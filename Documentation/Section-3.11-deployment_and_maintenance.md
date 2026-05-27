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
| PostgreSQL | Railway managed DB | Free |
| CouchDB (sync) | Cloudant (IBM) or Railway Docker | Free |
| Photo storage | Cloudinary | Free (25GB) |
| Domain | GitHub Pages subdomain or Netlify default | Free |

---

## 3.11.2 Deployment Steps

### Step 1 — Prepare Repository
```bash
# Ensure .env is in .gitignore
echo ".env" >> .gitignore

# Verify build works locally
cd frontend && npm run build     # generates dist/ folder
cd ../backend && node src/server.js  # confirm no startup errors
```

### Step 2 — Deploy Backend to Railway
```
1. Go to https://railway.app → New Project → Deploy from GitHub
2. Select: Team-Skipper/relifmesh → /backend
3. Set environment variables in Railway dashboard:
   DATABASE_URL     (auto-provided by Railway PostgreSQL plugin)
   COUCHDB_URL
   JWT_SECRET
   CLOUDINARY_CLOUD_NAME
   CLOUDINARY_API_KEY
   CLOUDINARY_API_SECRET
   NODE_ENV=production
4. Railway auto-detects Node.js; runs `npm start`
5. Note the generated URL: https://relifmesh-api.railway.app
```

### Step 3 — Run Database Migrations
```bash
# SSH into Railway shell or run via Railway CLI
railway run npm run migrate
railway run npm run seed
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

### Step 5 — Setup CouchDB (Cloudant)
```
1. Register at https://www.ibm.com/cloud/cloudant (free Lite plan)
2. Create database: relifmesh_sync
3. Create API credentials (username + password)
4. Update COUCHDB_URL in Railway env vars
5. Verify PouchDB sync works: open app, register household offline,
   go online, check Cloudant dashboard for new document
```

### Step 6 — Verify Deployment
```
✅ API health check: GET https://relifmesh-api.railway.app/v1/health → { status: "ok" }
✅ Frontend loads: https://relifmesh.netlify.app
✅ Login works with seeded test account
✅ Register a household → sync to CouchDB → appears in PostgreSQL
✅ Public dashboard loads without login
✅ Lighthouse PWA score ≥ 80
```

---

## 3.11.3 Environment Configuration Reference

| Variable | Used By | Description |
|----------|---------|-------------|
| `DATABASE_URL` | Backend | PostgreSQL connection string |
| `COUCHDB_URL` | Backend | CouchDB with credentials |
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
- **PostgreSQL:** Railway provides daily automated backups on paid tiers. For prototype, weekly manual export:
```bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```
- **CouchDB:** Cloudant provides export via replication or JSON dump:
```bash
curl -X GET "$COUCHDB_URL/_all_docs?include_docs=true" > couchdb_backup.json
```

### Recovery Procedure
```
1. Restore PostgreSQL:
   psql $DATABASE_URL < backup_YYYYMMDD.sql

2. Restore CouchDB:
   Upload JSON back to Cloudant via dashboard or curl bulk_docs

3. Verify integrity:
   npm run verify-sync    (custom script comparing PG vs CouchDB record counts)
```

### Photo Backup
- Cloudinary retains all uploaded media — no local backup needed for prototype.

---

## 3.11.5 Known Limitations & Future Roadmap

### Known Limitations (Prototype)
| Limitation | Impact | Reason |
|-----------|--------|--------|
| No NID validation against national DB | Cannot verify identity | Government API not accessible |
| No real-time sync (polling only) | Slight delay in cross-device updates | CouchDB free tier; WebSocket not implemented |
| CouchDB free tier: 1GB storage, 20 req/sec | Limits scale beyond prototype | Budget constraint |
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
