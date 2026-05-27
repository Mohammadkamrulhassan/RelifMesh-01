# Section 3.11 — Deployment & Maintenance
**Project:** RelifMesh — Disaster Relief Coordination System for Local Government
**Team:** Team_Skipper | **Course:** CSE-3208 System Analysis & Design Lab
**Last Updated:** 2026-05-27

---

## 3.11.1 Deployment Overview

RelifMesh uses a **zero-cost cloud deployment** strategy appropriate for the prototype phase:

| Component | Platform | Tier |
|-----------|----------|------|
| Frontend (React PWA) | Netlify | Free |
| Backend (Node.js API) | Railway | Free / Hobby |
| MongoDB | MongoDB Atlas (free cluster) | Free (512MB) |
| Photo storage | Cloudinary | Free (25GB) |
| Domain | Netlify default subdomain | Free |

---

## 3.11.2 Deployment Steps

### Step 1 — Prepare Repository
```bash
# Ensure .env is in .gitignore
echo ".env" >> .gitignore

# Verify build works locally
cd frontend && npm run build     # generates dist/ folder
cd ../backend && node server.js  # confirm no startup errors
```

### Step 2 — Set Up MongoDB Atlas
```
1. Go to https://www.mongodb.com/atlas → Sign up for free account
2. Create a free M0 cluster (shared RAM, 512MB storage)
3. Under Security → Database Access → Add a database user
4. Under Security → Network Access → Add IP 0.0.0.0/0 (allow all)
5. Click Connect → Drivers → Copy the connection string:
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/relifmesh?retryWrites=true
```

### Step 3 — Deploy Backend to Railway
```
1. Go to https://railway.app → New Project → Deploy from GitHub
2. Select: Team-Skipper/relifmesh → /backend
3. Set environment variables in Railway dashboard:
   MONGODB_URI        (the Atlas connection string from Step 2)
   JWT_SECRET         (generate a random 32-char string)
   CLOUDINARY_CLOUD_NAME
   CLOUDINARY_API_KEY
   CLOUDINARY_API_SECRET
   NODE_ENV=production
4. Railway auto-detects Node.js; runs `npm start`
5. Railway will automatically seed the database on first start
6. Note the generated URL: https://relifmesh-api.railway.app
```

### Step 4 — Deploy Frontend to Netlify
```
1. Go to https://netlify.com → New site → Import from GitHub
2. Select: Team-Skipper/relifmesh → /frontend
3. Build command: npm run build
4. Publish directory: dist
5. Set environment variable:
   VITE_API_BASE_URL=https://relifmesh-api.railway.app/v1
6. Deploy → note URL: https://relifmesh.netlify.app
```

### Step 5 — Verify Deployment
```
[x] API health check: GET https://relifmesh-api.railway.app/v1/health → { status: "ok" }
[x] Frontend loads: https://relifmesh.netlify.app
[x] Login works with seeded test account
[x] Register a household → stored in MongoDB → appears in dashboard
[x] Public dashboard loads without login
[x] Lighthouse PWA score ≥ 80
```

---

## 3.11.3 Environment Configuration Reference

| Variable | Used By | Description |
|----------|---------|-------------|
| `MONGODB_URI` | Backend | MongoDB connection string (Atlas or local) |
| `JWT_SECRET` | Backend | Signing key for JWTs (min 32 chars) |
| `JWT_EXPIRES_IN` | Backend | Token lifetime (e.g., `7d`) |
| `CLOUDINARY_CLOUD_NAME` | Backend | Cloudinary account name |
| `CLOUDINARY_API_KEY` | Backend | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Backend | Cloudinary API secret |
| `NODE_ENV` | Backend | `development` or `production` |
| `PORT` | Backend | Server port (Railway sets automatically) |
| `VITE_API_BASE_URL` | Frontend | Backend API base URL |

---

## 3.11.4 Backup & Recovery Plan

### Database Backup
- **MongoDB Atlas** provides automated backups on paid tiers. For prototype, weekly manual export:
```bash
mongodump --uri="$MONGODB_URI" --out=backup_$(date +%Y%m%d)
```

### Recovery Procedure
```
1. Restore MongoDB:
   mongorestore --uri="$MONGODB_URI" backup_YYYYMMDD/

2. Verify integrity:
   npm run db:status    (shows document count per collection)
```

### Photo Backup
- Cloudinary retains all uploaded media — no local backup needed for prototype.

---

## 3.11.5 Known Limitations & Future Roadmap

### Known Limitations (Prototype)
| Limitation | Impact | Reason |
|-----------|--------|--------|
| No NID validation against national DB | Cannot verify identity | Government API not accessible |
| No real-time sync (polling only) | Slight delay in cross-device updates | WebSocket not implemented in prototype |
| MongoDB Atlas free tier: 512MB storage | Limits scale beyond prototype | Budget constraint |
| Single-language UI (Bengali/English toggle) | Non-Bengali speakers may struggle | Scope decision |
| No automated CI/CD pipeline | Manual deploy required | Prototype phase |

### Future Roadmap (Post-semester / Production)
| Feature | Priority | Notes |
|---------|----------|-------|
| NID API integration (national DB) | High | Requires government MOU |
| Real-time WebSocket sync | Medium | Replace polling with socket.io |
| Native Android app (React Native) | Medium | Better camera/GPS access |
| AI-based household need scoring | Low | ML model for vulnerability prioritization |
| Multi-district multi-disaster support | High | Extend jurisdiction model |
| End-to-end encryption of PII | High | For production compliance |
| SMS notification for households | Medium | Alert families when aid logged |
| Integration with DDM national system | High | Long-term government adoption |

---

*End of Section 3.11 — Next: Section 3.12 Project Management Artifacts*
