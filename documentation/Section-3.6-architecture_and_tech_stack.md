# Section 3.6 — Architecture & Technology Stack
**Project:** RelifMesh — Disaster Relief Coordination System for Local Government
**Team:** Team_Skipper | **Course:** CSE-3208 System Analysis & Design Lab
**Last Updated:** 2026-06-09

---

## 3.6.1 System Architecture Overview

RelifMesh uses a **Progressive Web App (PWA) + REST API + MongoDB** architecture.

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                                 │
│                                                                  │
│  ┌──────────────────────────────┐   ┌────────────────────────┐  │
│  │     PWA (React / Vite)       │   │   Public Dashboard     │  │
│  │  - Household Registration    │   │   (Read-only, no auth) │  │
│  │  - Distribution Logging      │   │   - Aggregated stats   │  │
│  │  - Offline queue (localforage)│  │   - Map view           │  │
│  │  - Role-based UI views       │   └────────────────────────┘  │
│  └──────────────┬───────────────┘                                │
│                 │ HTTPS / REST API                               │
└─────────────────┼───────────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────────┐
│                      SERVER LAYER                                │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Node.js + Express.js API Server              │   │
│  │                                                          │   │
│  │  /auth         → JWT authentication                      │   │
│  │  /households   → CRUD household records                  │   │
│  │  /distributions → Log and query distributions            │   │
│  │  /alerts       → Duplicate detection engine              │   │
│  │  /reports      → PDF/CSV generation                      │   │
│  │  /public       → Aggregated public dashboard data        │   │
│  │  /sync         → Offline push/pull sync API              │   │
│  │  /feedback     → Public feedback submission + management  │   │
│  │  /inventory    → Stock/warehouse tracking                 │   │
│  │  /auth/profile → User profile management                  │   │
│  └──────────────────────────┬───────────────────────────────┘   │
│                             │                                    │
└─────────────────────────────┼───────────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                        DATA LAYER                                │
│                                                                  │
│  ┌──────────────────────────────────────┐                       │
│  │           MongoDB (single DB)        │                       │
│  │  - Users                             │                       │
│  │  - Jurisdictions                     │                       │
│  │  - Households                        │                       │
│  │  - Distribution Logs                 │                       │
│  │  - Item Categories                   │                       │
│  │  - Duplicate Alerts                  │                       │
│  │  - Sync Conflicts                    │                       │
│  │  - Feedback Entries                  │                       │
│  │  - Inventory Records                 │                       │
│  └──────────────────────────────────────┘                       │
│                                                                  │
│  ┌──────────────────────┐                                        │
│  │   File Storage       │                                        │
│  │   (Local / Cloudinary)│                                       │
│  │   - Photos           │                                        │
│  └──────────────────────┘                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3.6.2 Technology Stack

### Frontend
| Technology | Version | Justification |
|-----------|---------|---------------|
| React.js | 18.x | Component-based UI; team familiarity; strong ecosystem |
| Vite | 5.x | Fast build tool; PWA plugin support |
| Tailwind CSS | 3.x | Rapid UI styling; mobile-first utility classes |
| localforage | 1.x | In-browser IndexedDB wrapper; lightweight offline storage |
| Leaflet.js | 1.9.x | Open-source map library; no API key required |
| vite-plugin-pwa | latest | PWA manifest, service worker, offline caching |

### Backend
| Technology | Version | Justification |
|-----------|---------|---------------|
| Node.js | 20.x LTS | JavaScript full-stack; team already knows JS |
| Express.js | 4.x | Lightweight REST API; minimal boilerplate |
| Mongoose | 8.x | MongoDB ODM with schema validation and query building |
| JWT (jsonwebtoken) | 9.x | Stateless auth; works well with mobile clients |
| bcrypt | 5.x | Secure password hashing |
| Multer | 1.x | Photo upload handling (multipart/form-data) |
| PDFKit / json2csv | latest | Report export to PDF and CSV |

### Database
| Technology | Justification |
|-----------|---------------|
| MongoDB 8.x | Flexible document model; maps directly to JS objects; Mongoose ODM for schema enforcement; free Atlas tier for deployment |
| Local FS (multer) / Cloudinary | Photo upload handled via `POST /v1/uploads/image` (multer, 5MB limit, image-only). Stored in `backend/uploads/` and served as static files. Cloudinary integration available for production. |

### DevOps & Tooling
| Tool | Purpose |
|------|---------|
| Git + GitHub | Version control, branching, pull requests |
| Railway / Render | Free-tier cloud deployment (Node.js + MongoDB) |
| Docker (optional) | Local dev environment consistency |
| Postman | API testing during development |
| draw.io | diagrams/ (DFD, UML, ERD) |
| Figma | UI/UX wireframes and mockups |

---

## 3.6.3 Offline-First Architecture Design

### Strategy
RelifMesh uses a **single-database offline-first pattern**:
- **localforage (IndexedDB)** runs in the browser — offline writes are queued here.
- When the device reconnects, queued records are pushed to the Express API via `POST /sync/push`.
- New records from other devices are pulled via `GET /sync/pull?since=<timestamp>`.
- **MongoDB** is the single source of truth — no separate sync database needed.

### Sync Flow
```
[Field Device — Offline]
     │
     │ Write to localforage (IndexedDB)
     ▼
 localforage (browser)
     │
     │ [Network restored]
     │
     ▼
 Express API ──POST /sync/push──►  MongoDB
     ◄──GET /sync/pull───
```

### Conflict Resolution
- **Detection:** The sync endpoint checks for duplicate records by NID or log ID.
- **Default Resolution:** Last-write-wins (by timestamp).
- **Conflict Log:** Conflicting versions are saved in `syncconflicts` collection; flagged for manual review.
- **Officer Notification:** App displays "X records had sync conflicts" with a review link.

---

## 3.6.4 API Design Overview

Base URL: `https://api.relifmesh.app/v1`

| Method | Endpoint | Auth Required | Description |
|--------|----------|:------------:|-------------|
| POST | `/auth/login` | No | Login; returns JWT |
| POST | `/auth/register` | Upazila Officer | Create new user account |
| GET | `/households` | Yes | List households (filtered by jurisdiction) |
| GET | `/households/search?q=` | Yes | Search households by name or NID |
| POST | `/households` | UP Official | Register new household |
| GET | `/households/:id` | Yes | Get household by HH-ID |
| PUT | `/households/:id` | UP Official | Update household record |
| GET | `/distributions` | Yes | List distribution logs |
| POST | `/distributions` | UP Official, NGO | Create distribution log |
| GET | `/distributions/duplicate-check` | Yes | Check for duplicates before logging |
| GET | `/alerts` | Yes | List duplicate alerts |
| PUT | `/alerts/:id/resolve` | Yes | Resolve a duplicate alert |
| GET | `/reports/export` | Upazila Officer | Export CSV/PDF report |
| GET | `/public/dashboard` | No | Aggregated public data |
| GET | `/public/map` | No | Union-level map data |
| POST | `/sync/push` | Yes | Push offline queued records to server |
| GET | `/sync/pull` | Yes | Pull new records since last sync |
| POST | `/uploads/image` | Yes | Upload photo (multipart, 5MB max, jpg/png/gif/webp) |
| GET | `/auth/profile` | Yes | Get authenticated user profile |
| PUT | `/auth/profile` | Yes | Update user profile (name, organization) |
| GET | `/auth/users` | Yes | List users (Upazila Officer) |
| POST | `/v1/feedback` | No | Submit public feedback |
| GET | `/v1/feedback` | Yes | List feedback entries |
| PUT | `/v1/feedback/:id/respond` | Yes | Respond to feedback |
| GET | `/v1/inventory` | Yes | List inventory items |
| POST | `/v1/inventory` | Upazila Officer | Create inventory item |
| PUT | `/v1/inventory/:id` | Upazila Officer | Update inventory item |
| GET | `/public/admin-dashboard` | Yes | Enhanced dashboard with feedback + sync stats |

All protected endpoints require `Authorization: Bearer <JWT>` header.

---

## 3.6.5 Deployment Architecture

```
[GitHub Repository]
        │
        │  Push to main branch
        ▼
[Railway / Render — Auto Deploy]
        │
        ├── Node.js API Server (Express)
        │       └── ENV vars: MONGODB_URI, JWT_SECRET, CLOUDINARY_KEY
        │
        └── MongoDB Atlas (free tier: 512MB)
                └── Single collection per entity (9 collections)
                └── Single collection per entity (7 collections)

[Cloudinary]
        └── Photo uploads (free tier: 25GB)

[Netlify]
        └── React PWA frontend (static hosting, free tier)
```

**Zero-cost deployment confirmed:** MongoDB Atlas free tier, Netlify, Cloudinary free — all within prototype requirements.

---

*End of Section 3.6 — Next: Section 3.7 UI/UX Design*
