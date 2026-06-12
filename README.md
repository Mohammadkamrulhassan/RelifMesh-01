# ReliefMesh — Disaster Response & Relief Management System

> *"One mesh. No duplicates. No household left behind."*

**Course:** CSE-3208 System Analysis & Design Lab
**Team:** Team_Skipper | **Project:** #6 ReliefMesh
**Supervisor:** MD Mynoddin, Assistant Professor, RMSTU

---

## Team

| ID | Name | Role |
|----|------|------|
| 2101011001 | Abidul Islam | Backend Lead (v2) / QA Tester |
| 2101011005 | MD. Kamrul Hassan | Project Manager / Full-Stack Developer |
| 2101011013 | Sayeda Mofatteha Ahmed | UI/UX Designer (v2) / Documentation Lead |
| 2101011038 | Iftekhar Alam Nahid | Frontend UI / Presentation Lead |

---

## Problem

During floods and cyclones in Bangladesh, relief distribution suffers from:
- **Duplicate aid** — same household served multiple times
- **Missed households** — vulnerable families skipped
- **No real-time tracking** — paper-based logs, late consolidation
- **Inter-agency opacity** — NGOs and government teams operate independently
- **No emergency channel** — victims cannot send SOS with GPS location
- **No transparency** — donors and public cannot track where relief goes

ReliefMesh solves this with an offline-first platform connecting **victims**, **volunteers**, **NGOs**, **local government**, and **donors** for end-to-end disaster response.

---

## Key Features

### Current (v1 — Completed)
- **Household Registration** — GPS + photo + vulnerability flags, works offline
- **Distribution Logging** — item-level tracking with duplicate detection
- **Duplicate Alert Engine** — flags same household + same item within 7 days
- **Offline-First Sync** — localforage queue + auto-sync on reconnect
- **Role-Based Access** — 4 roles: UP Official, NGO Worker, Upazila Officer, Citizen
- **Public Dashboard** — aggregated distribution stats + map (no login)
- **Feedback System** — public submissions, Upazila Officer management
- **Inventory Tracking** — stock levels per item category
- **User Profiles** — view/edit name and organization
- **Pagination & Search** — paginated lists with live search across modules
- **Relief Requests** — citizen submit, officials approve/reject/fulfill
- **Reports Export** — CSV/PDF generation
- **Image Upload** — photo capture and upload

### v2 Roles (7 roles)

| Role | Purpose |
|------|---------|
| `victim` | Disaster-affected individual requesting SOS/relief |
| `volunteer` | Rescue worker assigned to missions |
| `ngo` | NGO admin managing campaigns & inventory |
| `govt` | Government official overseeing relief |
| `donor` | Individual/organization donating to campaigns |
| `admin` | System administrator with full access |
| `super_admin` | Elevated admin with user management & audit |

### Implemented (v2 — Done)
- **Phone/OTP Authentication** — passwordless login via OTP + JWT refresh token rotation
- **Auto-User Creation** — first-time phone login creates a verified user automatically
- **Offline-First with In-Memory Fallback** — OTP store works without Redis in development

### Planned (v2 — In Development)
- **SOS Emergency Requests** — GPS-based SOS with type, priority, auto-expiry, offline mode
- **Rescue Mission Coordination** — volunteers accept SOS, mission lifecycle with real-time tracking
- **Campaigns & Crowdfunding** — NGOs create fundraising campaigns, bKash/Nagad/Rocket payments
- **Transparency Ledger** — donations collected vs relief distributed with proof photos/signatures
- **Shelter Management** — capacity tracking, facilities, occupancy
- **Real-Time Chat** — mission-scoped messaging between victim and volunteer
- **In-App Notifications** — real-time push via Socket.io
- **Admin Command Center** — heatmaps, analytics charts, resource shortage alerts
- **i18n (English/Bengali)** — full Bengali UI via react-i18next
- **PWA Enhancements** — Service Worker caching, IndexedDB offline SOS queue, install prompt
- **Redis Caching** — session store, rate limiting, Socket.io adapter
- **TypeScript Migration** — full TypeScript across frontend and backend
- **Granular Rate Limiting** — per-endpoint limits with Redis store
- **Audit Logs** — full system audit trail for all admin actions
- **Background Jobs** — auto-expire SOS, inventory alerts, periodic backup

---

## Tech Stack

| Layer | v1 (Current) | v2 (Planned) |
|-------|-------------|--------------|
| Language | JavaScript (FE + BE) | TypeScript (FE + BE) |
| Frontend | React 18, Vite, Tailwind CSS, Leaflet.js, localforage | React 18, Vite, Tailwind, Leaflet, Redux Toolkit, react-i18next |
| Backend | Node.js, Express.js | Node.js, Express.js, Socket.io |
| Database | MongoDB, Mongoose ODM | MongoDB (Atlas), Mongoose ODM, Redis |
| Auth | Email/password + JWT | Phone/OTP + JWT (access + refresh) |
| Real-time | — | Socket.io (SOS, missions, notifications) |
| Offline | localforage (distribution sync) | IndexedDB (SOS queue + distribution sync) |
| i18n | — | react-i18next (English, Bengali) |
| Payments | — | bKash / Nagad / Rocket (sandbox) |
| Testing | Jest + Supertest | Jest + Supertest |

---

## Architecture (v2)

```
[ React Client (PWA + Redux) ] <──REST/WS──> [ Express + Socket.io Server ] <──> [ MongoDB Atlas ]
                                                     │
                                               [ Redis / In-Memory Store ]
```

---

## Project Structure

```
ReliefMesh/
├── frontend/          # React PWA (Vite + Tailwind + Redux)
│   ├── features/      # Domain modules (auth, sos, rescue, donation, etc.)
│   ├── shared/        # Shared components, hooks, store, i18n, api
│   └── public/        # PWA manifest, icons, service worker
│
├── backend/           # Express REST API
│   ├── modules/       # Domain modules (auth, auth-v2, sos, campaigns...)
│   ├── services/      # Shared services (otpStore, conflictResolver)
│   ├── config/        # DB, environment, env config
│   ├── middleware/     # authenticate, authorize, errorHandler
│   └── tests/         # Integration and unit tests
│
├── documentation/     # 14 SAD module deliverables
├── diagrams/          # draw.io files (DFD, UML, ERD, architecture)
├── designs/           # Figma exports (wireframes, mockups)
├── reports/           # PM artifacts (meeting minutes, weekly progress)
├── submission/        # Final deliverables (demo video, slides)
└── assets/            # Shared media
```

---

## API Reference

### v1 (Implemented)

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| GET | `/v1/health` | No | Health check |
| POST | `/v1/auth/login` | No | Login (email/password), returns JWT |
| POST | `/v1/auth/register` | Upazila Officer | Create user account |
| GET | `/v1/auth/profile` | Yes | Get profile |
| PUT | `/v1/auth/profile` | Yes | Update profile |
| GET | `/v1/auth/users` | Yes | List users |
| GET | `/v1/households` | Yes | List households (paginated, searchable) |
| POST | `/v1/households` | UP Official | Register household |
| GET | `/v1/households/:id` | Yes | Get household details |
| PUT | `/v1/households/:id` | UP Official | Update household |
| GET | `/v1/distributions` | Yes | List distributions (paginated, filterable) |
| POST | `/v1/distributions` | UP/NGO | Log distribution |
| GET | `/v1/alerts` | Yes | List duplicate alerts |
| PUT | `/v1/alerts/:id/resolve` | Yes | Resolve an alert |
| GET | `/v1/reports/export` | Upazila Officer | Export CSV/PDF |
| GET | `/v1/public/dashboard` | No | Public aggregated stats |
| GET | `/v1/public/admin-dashboard` | Yes | Enhanced dashboard |
| GET | `/v1/public/map` | No | Public map data |
| POST | `/v1/sync/push` | Yes | Push offline records |
| GET | `/v1/sync/pull` | Yes | Pull new records |
| POST | `/v1/feedback` | No | Submit feedback |
| GET | `/v1/feedback` | Yes | List feedback entries |
| PUT | `/v1/feedback/:id/respond` | Yes | Respond to feedback |
| GET | `/v1/inventory` | Yes | List inventory items |
| POST | `/v1/inventory` | Upazila Officer | Create inventory item |
| PUT | `/v1/inventory/:id` | Upazila Officer | Update inventory item |
| POST | `/v1/uploads/image` | Yes | Upload photo (multipart, 5MB, image only) |

### v2 (Implemented)

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| POST | `/v2/auth/send-otp` | No | Send 6-digit OTP to phone |
| POST | `/v2/auth/verify-otp` | No | Verify OTP, returns access + refresh tokens |
| POST | `/v2/auth/refresh` | No | Rotate refresh token (old one invalidated) |

### v2 (Planned)

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| POST | `/v2/sos` | victim | Submit SOS request |
| GET | `/v2/sos` | volunteer | List SOS requests |
| POST | `/v2/missions` | volunteer | Accept/start mission |
| PUT | `/v2/missions/:id` | volunteer | Update mission status |
| GET | `/v2/campaigns` | No | List active campaigns |
| POST | `/v2/donations` | donor | Donate to campaign |
| GET | `/v2/shelters` | No | List nearby shelters |
| POST | `/v2/chat/:missionId` | volunteer/victim | Send mission message |
| GET | `/v2/notifications` | Yes | List user notifications |
| GET | `/v2/admin/dashboard` | admin | Command center stats |
| GET | `/v2/admin/audit-logs` | super_admin | View audit trail |

All protected endpoints use `Authorization: Bearer <token>` header.

---

## Quick Start

### Prerequisites
- Node.js 20+
- **MongoDB Atlas** cluster (free M0 tier) — or local MongoDB
- (Optional but recommended) Redis — for OTP caching in production

---

### 1. Create a MongoDB Atlas Cluster

If you don't have one yet:

```
1. Go to https://www.mongodb.com/atlas → Sign up (free)
2. Deploy a free M0 cluster (AWS, 512MB storage)
3. Under SECURITY → Database Access → Add Database User:
     Username: your_db_user
     Password: your_db_password  (copy this)
4. Under SECURITY → Network Access → Add IP Address:
     Add 0.0.0.0/0 (allows all IPs — use for development only)
5. Click Connect → Drivers → Copy the connection string:
   mongodb+srv://<db_user>:<db_password>@cluster0.xxxxx.mongodb.net
```

> **Note:** The app auto-appends `/relifmesh` as the database name if your URI doesn't include one.

---

### 2. Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your Atlas credentials:

```env
MONGODB_URI=mongodb+srv://your_db_user:your_db_password@cluster0.xxxxx.mongodb.net/relifmesh?retryWrites=true&w=majority
JWT_SECRET=generate-a-random-32-char-string
JWT_REFRESH_SECRET=another-random-32-char-string
SMS_PROVIDER=mock
REDIS_URL=redis://localhost:6379
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Then install and start:

```bash
npm install
npm run dev
```

**On first run**, the server:
1. Connects to Atlas
2. Syncs indexes (fixes unique sparse index for email field)
3. Detects empty database → auto-seeds with test accounts
4. Starts on port `5000`

---

### 3. Configure Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The Vite proxy forwards `/v1` and `/v2` → `http://localhost:5000`.

Open `http://localhost:5173` in your browser.

---

### 4. Verify the OTP Auth Flow

Test the entire OTP lifecycle with curl:

```bash
# Step 1: Send OTP to a test phone
curl -X POST http://localhost:5000/v2/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"+8801700000008"}'
# Response: { "message": "OTP sent to +880****08", "otp": "630083" }
# Note: In development mode, the OTP is returned in the response.

# Step 2: Verify the OTP (use the otp value from step 1)
curl -X POST http://localhost:5000/v2/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"+8801700000008","otp":"630083"}'
# Response: { "accessToken": "...", "refreshToken": "...", "user": {...} }

# Step 3: Use the access token to access protected endpoints
curl http://localhost:5000/v1/auth/profile \
  -H "Authorization: Bearer <accessToken>"

# Step 4: Refresh the token (before the access token expires)
curl -X POST http://localhost:5000/v2/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refreshToken>"}'
# Response: { "accessToken": "...", "refreshToken": "..." }
# Note: The old refresh token is invalidated after use (rotation).
```

---

### Test Accounts

```bash
# v1 (email/password)
upazila@relifmesh.test / password123     (UPAZILA_OFFICER)
upofficial@relifmesh.test / password123  (UP_OFFICIAL)
ngo@relifmesh.test / password123         (NGO_WORKER)
citizen@relifmesh.test / password123     (CITIZEN)

# v2 (phone/OTP — OTP is returned in API response in dev mode)
+8801700000001  (super_admin)
+8801700000002  (admin)
+8801700000003  (ngo)
+8801700000004  (govt)
+8801700000005  (volunteer)
+8801700000006  (volunteer)
+8801700000007  (donor)
+8801700000008  (victim)
+8801700000009  (victim)
```

---

## Deliverables Status

| Module | Document | Status |
|--------|----------|--------|
| 3.1 | Project Initiation & Problem Definition | [x] Complete |
| 3.2 | Stakeholder Analysis | [x] Complete |
| 3.3 | Requirements Engineering (SRS) | [x] Complete |
| 3.4 | System Modeling (DFD & UML) | [x] Complete |
| 3.5 | Database Design (ERD) | [x] Complete |
| 3.6 | Architecture & Tech Stack | [x] Complete |
| 3.7 | UI/UX Design | [x] Complete |
| 3.8 | Implementation Plan | [x] Complete |
| 3.9 | Testing & QA | [x] Complete |
| 3.10 | Security & Access Control | [x] Complete |
| 3.11 | Deployment & Maintenance | [x] Complete |
| 3.12 | Project Management | [x] Complete |
| 3.13 | References & Bibliography | [x] Complete |
| 3.14 | Presentation & Defense | [x] Complete |
| **Prototype** | Frontend + Backend code | [x] Complete (v1) |
| **v2 Auth** | Phone/OTP + Refresh Rotation | [x] Implemented |
| **Upgrade** | v2 enhancements | [ ] In Progress |
