# Section 3.11 — Deployment & Maintenance
**Project:** ReliefMesh — Disaster Response & Relief Management System
**Team:** Team_Skipper | **Course:** CSE-3208 System Analysis & Design Lab
**Last Updated:** 2026-06-10

---

## 3.11.1 Deployment Overview (v2)

ReliefMesh v2 uses a **Docker Compose** deployment for consistency across dev, staging, and production.

| Component | Platform | Tier |
|-----------|----------|------|
| Backend (Node.js + Express) | Railway / VPS | Free / Hobby |
| Frontend (React PWA) | Vercel / Netlify | Free |
| Database | **MongoDB Atlas** (free M0 cluster) | Free (512MB) |
| Cache (optional) | Redis / Upstash | Free (30MB) |
| Photo storage | Cloudinary (free tier) | Free (25GB) |
| CI/CD | GitHub Actions | Free |
| Containerization | Docker Compose | Local dev |

---

## 3.11.2 Setup Procedure

### Step 1 — Create MongoDB Atlas Cluster

```
1. Go to https://www.mongodb.com/atlas → Sign up for free account
2. Deploy a free M0 shared cluster (AWS, 512MB storage)
3. Under SECURITY → Database Access → Add Database User:
     Username: your_db_user
     Authentication Method: Password
     Password: your_db_password  (save this)
4. Under SECURITY → Network Access → Add IP Address:
     IP Address: 0.0.0.0/0
     Comment: Allow all (dev only)
5. Click Connect → Drivers → Copy connection string:
   mongodb+srv://<db_user>:<db_password>@cluster0.xxxxx.mongodb.net
```

> **Important:** The connection string from Atlas may not include a database name. The application automatically appends `/relifmesh` as the database name if none is present in the URI.

### Step 2 — Configure .env

Copy `backend/.env.example` to `backend/.env` and fill in:

```env
MONGODB_URI=mongodb+srv://your_user:your_pass@cluster0.xxxxx.mongodb.net/relifmesh?retryWrites=true&w=majority
JWT_SECRET=<random-32-char-string>
JWT_REFRESH_SECRET=<another-random-32-char-string>
SMS_PROVIDER=mock
REDIS_URL=redis://localhost:6379
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Step 3 — Install & Run

```bash
cd backend
npm install
npm run dev
```

**First run behavior:**
1. Connects to MongoDB Atlas
2. Calls `mongoose.syncIndexes()` — fixes unique sparse indexes (e.g., `email` field with null values)
3. Detects empty database → auto-seeds:
   - 3 jurisdictions (Dhaka, Sylhet districts with unions)
   - 4 v1 users (email/password)
   - 9 v2 users (phone-based, all 7 roles)
   - 5 item categories
4. Starts Express server on port 5000

### Step 4 — Verify

```bash
# Health check
curl http://localhost:5000/v1/health
# → { "status": "ok" }

# OTP auth flow
curl -X POST http://localhost:5000/v2/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"+8801700000008"}'
# → { "message": "OTP sent...", "otp": "123456" }  (dev mode returns OTP)
```

---

## 3.11.3 Docker Compose Setup (Local Dev)

```yaml
version: "3.8"
services:
  mongo:
    image: mongo:8
    ports: ["27017:27017"]
    volumes: [mongo-data:/data/db]

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  backend:
    build: ./backend
    ports: ["5000:5000"]
    depends_on: [mongo, redis]
    env_file: ./backend/.env

  frontend:
    build: ./frontend
    ports: ["5173:5173"]
    depends_on: [backend]
    environment:
      - VITE_API_BASE_URL=http://localhost:5000/api

volumes:
  mongo-data:
```

> **Note:** When using Docker, set `MONGODB_URI=mongodb://mongo:27017/relifmesh` (service name `mongo` instead of `localhost`).

---

## 3.11.4 Environment Configuration Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MONGODB_URI` | Yes | — | MongoDB connection string (Atlas SRV or local) |
| `JWT_SECRET` | Yes | — | Access token signing key (min 32 chars) |
| `JWT_REFRESH_SECRET` | Yes | — | Refresh token signing key |
| `JWT_EXPIRES_IN` | No | `15m` | Access token lifetime |
| `JWT_REFRESH_EXPIRES_IN` | No | `7d` | Refresh token lifetime |
| `REDIS_URL` | No | `redis://localhost:6379` | Redis connection (in-memory fallback if unavailable) |
| `SMS_PROVIDER` | No | `mock` | `mock` for dev (OTP returned in response), `twilio` for production |
| `TWILIO_*` | No | — | Twilio credentials (if `SMS_PROVIDER=twilio`) |
| `CLOUDINARY_*` | No | — | Cloudinary photo upload credentials |
| `PORT` | No | `5000` | Server port |
| `NODE_ENV` | No | `development` | Controls OTP visibility in API responses |
| `FRONTEND_URL` | No | `http://localhost:5173` | CORS allowed origin |

---

## 3.11.5 Atlas Connection Details

The database connection in `config/database.js`:

```js
// Auto-detects Atlas via mongodb+srv:// prefix
const opts = {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
}
if (env.isAtlas) {
  opts.retryWrites = true
  opts.w = 'majority'
  opts.appName = 'reliefmesh'
}
```

- **SSL/TLS:** Enabled by default with `mongodb+srv://`
- **Retry writes:** `w=majority` with `retryWrites=true`
- **Index sync:** `mongoose.syncIndexes()` runs after every connection to keep indexes aligned with schema changes
- **Database name:** Auto-appends `/relifmesh` if the URI path is empty

### Troubleshooting Atlas Connection

| Symptom | Cause | Fix |
|---------|-------|-----|
| `ECONNREFUSED` | IP not whitelisted | Add `0.0.0.0/0` in Network Access |
| `Authentication failed` | Wrong credentials | Check Database Access user/password |
| `Duplicate key (email: null)` | Old non-sparse index | `syncIndexes()` fixes this automatically |
| `Connection timeout` | Atlas free tier cold start | Wait 30s, retry; free tier spins down after inactivity |

---

## 3.11.6 CI/CD Pipeline (GitHub Actions)

```yaml
name: CI/CD

on:
  push:
    branches: [main, dev]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      mongo:
        image: mongo:8
        ports: ["27017:27017"]
      redis:
        image: redis:7-alpine
        ports: ["6379:6379"]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm test
      - run: npm run lint
```

---

## 3.11.7 Known Limitations & Roadmap

| Limitation | Impact | Workaround |
|-----------|--------|------------|
| No real SMS (mock provider) | OTP not actually sent by SMS | OTP visible in API response (dev only) |
| Atlas free tier cold start | First connection after inactivity is slow | Connection retries with 3s delay |
| In-memory OTP store (no Redis) | OTPs lost on server restart | Falls back gracefully; Redis for production |
| No TypeScript migration yet | JS codebase | Planned for Phase 8 |

---

*End of Section 3.11 — Next: Section 3.12 Project Management Artifacts*
