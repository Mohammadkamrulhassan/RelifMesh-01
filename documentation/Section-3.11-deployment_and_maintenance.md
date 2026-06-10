# Section 3.11 — Deployment & Maintenance
**Project:** ReliefMesh — Disaster Response & Relief Management System
**Team:** Team_Skipper | **Course:** CSE-3208 System Analysis & Design Lab
**Last Updated:** 2026-06-10

---

## 3.11.1 Deployment Overview (v2)

ReliefMesh v2 uses a **Docker Compose** deployment for consistency across dev, staging, and production.

| Component | Platform | Tier |
|-----------|----------|------|
| Frontend (React PWA + TypeScript) | Vercel / Netlify | Free |
| Backend (Node.js + Express + Socket.io) | Railway / VPS | Free / Hobby |
| MongoDB | MongoDB Atlas (free cluster) | Free (512MB) |
| Redis | Redis Cloud / Upstash | Free (30MB) |
| Photo storage | Cloudinary (free tier) | Free (25GB) |
| CI/CD | GitHub Actions | Free |
| Containerization | Docker Compose | Local dev |

---

## 3.11.2 Deployment Steps

### Step 1 — Docker Compose Setup (Local Dev)
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

### Step 2 — Set Up MongoDB Atlas
```
1. Go to https://www.mongodb.com/atlas → Sign up for free account
2. Create a free M0 cluster (shared RAM, 512MB storage)
3. Under Security → Database Access → Add a database user
4. Under Security → Network Access → Add IP 0.0.0.0/0 (allow all)
5. Click Connect → Drivers → Copy the connection string
```

### Step 3 — Set Up Redis (Upstash Free)
```
1. Go to https://upstash.com → Sign up
2. Create a free Redis database (max 30MB)
3. Copy the REST URL and Redis password
4. Set as REDIS_URL in environment
```

### Step 4 — Deploy Backend to Railway
```
1. Go to https://railway.app → New Project → Deploy from GitHub
2. Select: backend/ folder
3. Set environment variables:
   MONGODB_URI       (Atlas connection string)
   REDIS_URL         (Upstash Redis URL)
   JWT_SECRET        (32-char random string)
   JWT_REFRESH_SECRET (32-char random string)
   OTP_BYPASS=123456 (dev only, remove in production)
   SMS_PROVIDER=mock
   CLOUDINARY_CLOUD_NAME
   CLOUDINARY_API_KEY
   CLOUDINARY_API_SECRET
   NODE_ENV=production
   FRONTEND_URL=https://reliefmesh.vercel.app
4. Railway auto-detects Node.js; runs npm start
5. Note the generated URL: https://reliefmesh-api.railway.app
```

### Step 5 — Deploy Frontend to Vercel
```
1. Go to https://vercel.com → New Project → Import from GitHub
2. Select: frontend/ folder
3. Framework preset: Vite
4. Build command: npm run build
5. Output directory: dist
6. Environment variable:
   VITE_API_BASE_URL=https://reliefmesh-api.railway.app/api
7. Deploy → note URL: https://reliefmesh.vercel.app
```

### Step 6 — Verify Deployment
```
[x] API health: GET /api/health → { status: "ok" }
[x] Frontend loads: https://reliefmesh.vercel.app
[x] OTP send + verify works with test accounts
[x] SOS create → appears on volunteer dashboard
[x] Campaign create → donate → receipt generated
[x] Socket.io connection established
[x] Public dashboard loads without login
[x] Lighthouse PWA score ≥ 80
```

---

## 3.11.3 Environment Configuration Reference

| Variable | Used By | Description |
|----------|---------|-------------|
| `MONGODB_URI` | Backend | MongoDB connection string |
| `REDIS_URL` | Backend | Redis connection string |
| `JWT_SECRET` | Backend | Access token signing key (min 32 chars) |
| `JWT_REFRESH_SECRET` | Backend | Refresh token signing key |
| `OTP_BYPASS` | Backend | Dev-only bypass code (remove in production) |
| `SMS_PROVIDER` | Backend | `mock` or `twilio` |
| `TWILIO_*` | Backend | Twilio credentials (if SMS_PROVIDER=twilio) |
| `CLOUDINARY_*` | Backend | Cloudinary photo upload credentials |
| `BKASH_*` | Backend | bKash merchant sandbox credentials |
| `NAGAD_*` | Backend | Nagad merchant sandbox credentials |
| `ROCKET_*` | Backend | Rocket merchant sandbox credentials |
| `NODE_ENV` | Backend | `development` or `production` |
| `PORT` | Backend | Server port |
| `FRONTEND_URL` | Backend | CORS allowed origin |
| `VITE_API_BASE_URL` | Frontend | Backend API base URL |

---

## 3.11.4 CI/CD Pipeline (GitHub Actions)

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

  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run lint

  deploy:
    needs: [test, lint]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploy triggered" # Add Railway/Vercel deploy hooks
```

---

## 3.11.5 Backup & Recovery Plan

### Database Backup
```bash
mongodump --uri="$MONGODB_URI" --out=backup_$(date +%Y%m%d)
```

### Recovery Procedure
```
1. Restore MongoDB:
   mongorestore --uri="$MONGODB_URI" backup_YYYYMMDD/
2. Verify integrity:
   npm run db:status
```

### Photo Backup
- Cloudinary retains all uploaded media — no local backup needed.

---

## 3.11.6 Known Limitations & Future Roadmap

### Known Limitations (Prototype)
| Limitation | Impact | Reason |
|-----------|--------|--------|
| No NID validation against national DB | Cannot verify identity | Government API not accessible |
| SMS via mock provider | OTP not actually sent by SMS | No Twilio credit for prototype |
| Payment gateway sandbox only | No real transactions | bKash/Nagad sandbox accounts |
| MongoDB Atlas free tier: 512MB | Limits scale | Budget constraint |
| Single-language UI in dev | — | i18n planned for v2 |
| Redis free tier: 30MB | Limits session count | Upstash free tier limit |

### Future Roadmap (Post-semester / Production)
| Feature | Priority | Notes |
|---------|----------|-------|
| NID API integration | High | Requires government MOU |
| Twilio SMS for real OTP | High | Paid tier |
| Real payment gateway | High | Business registration required |
| Native Android app (React Native) | Medium | Better camera/GPS access |
| AI-based SOS priority scoring | Low | ML-based vulnerability prioritization |
| End-to-end 2FA | High | TOTP + SMS for admin accounts |
| Multi-disaster support | High | Disaster-type scoping |
| DDM national system integration | High | Long-term adoption goal |

---

*End of Section 3.11 — Next: Section 3.12 Project Management Artifacts*
