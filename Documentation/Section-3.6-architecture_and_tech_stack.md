# Section 3.6 — Architecture & Technology Stack
**Project:** RelifMesh — Disaster Relief Coordination System for Local Government
**Team:** Team_Skipper | **Course:** CSE-3208 System Analysis & Design Lab
**Last Updated:** 2026-05-27

---

## 3.6.1 System Architecture Overview

RelifMesh uses a **Progressive Web App (PWA) + REST API + Offline Sync** architecture.

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│                                                                 │
│  ┌──────────────────────────────┐   ┌────────────────────────┐  │
│  │     PWA (React / Vite)       │   │   Public Dashboard     │  │
│  │  - Household Registration    │   │   (Read-only, no auth) │  │
│  │  - Distribution Logging      │   │   - Aggregated stats   │  │
│  │  - Offline queue (PouchDB)   │   │   - Map view           │  │
│  │  - Role-based UI views       │   └────────────────────────┘  │
│  └──────────────┬───────────────┘                               │
│                 │ HTTPS / REST API                              │
└─────────────────┼───────────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────────┐
│                       SERVER LAYER                              │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Node.js + Express.js API Server             │    │
│  │                                                         │    │
│  │  /auth       → JWT authentication                       │    │
│  │  /households → CRUD household records                   │    │
│  │  /distributions → Log and query distributions           │    │
│  │  /alerts     → Duplicate detection engine               │    │
│  │  /reports    → PDF/CSV generation                       │    │
│  │  /public     → Aggregated public dashboard data         │    │
│  │  /sync       → CouchDB sync endpoint (PouchDB protocol) │    │
│  └──────────────────────────┬──────────────────────────────┘    │
│                             │                                   │
└─────────────────────────────┼───────────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                       DATA LAYER                                │
│                                                                 │
│  ┌──────────────────────┐     ┌───────────────────────────┐     │
│  │   PostgreSQL (main)  │     │   CouchDB (sync target)   │     │
│  │   - Users            │     │   - Distribution logs     │     │
│  │   - Jurisdictions    │     │   - Household records     │     │
│  │   - Item categories  │     │   (offline-first sync)    │     │
│  └──────────────────────┘     └───────────────────────────┘     │
│                                                                 │
│  ┌──────────────────────┐                                       │
│  │   File Storage       │                                       │
│  │   (Local / S3-compat) │                                      │
│  │   - Photos           │                                       │
│  └──────────────────────┘                                       │
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
| PouchDB | 9.x | In-browser offline database; native CouchDB sync protocol |
| Leaflet.js | 1.9.x | Open-source map library; no API key required |
| vite-plugin-pwa | latest | PWA manifest, service worker, offline caching |

### Backend
| Technology | Version | Justification |
|-----------|---------|---------------|
| Node.js | 20.x LTS | JavaScript full-stack; team already knows JS |
| Express.js | 4.x | Lightweight REST API; minimal boilerplate |
| JWT (jsonwebtoken) | 9.x | Stateless auth; works well with mobile clients |
| bcrypt | 5.x | Secure password hashing |
| Multer | 1.x | Photo upload handling (multipart/form-data) |
| PDFKit / json2csv | latest | Report export to PDF and CSV |

### Database
| Technology | Justification |
|-----------|---------------|
| PostgreSQL 15 | Relational integrity for users, jurisdictions, item categories; ACID compliant |
| CouchDB 3.x | Offline-sync target for PouchDB; native replication protocol |
| Cloudinary / Local FS | Photo storage; Cloudinary free tier for prototype |

### DevOps & Tooling
| Tool | Purpose |
|------|---------|
| Git + GitHub | Version control, branching, pull requests |
| Railway / Render | Free-tier cloud deployment (Node.js + PostgreSQL) |
| Docker (optional) | Local dev environment consistency |
| Postman | API testing during development |
| draw.io | diagrams/ (DFD, UML, ERD) |
| Figma | UI/UX wireframes and mockups |

---

## 3.6.3 Offline-First Architecture Design

### Strategy
RelifMesh uses a **dual-database offline-first pattern**:
- **PouchDB** runs entirely in the browser — all writes go here first.
- **CouchDB** on the server is the sync target.
- When the device reconnects, PouchDB automatically replicates to CouchDB using the built-in sync protocol.
- CouchDB changes are then picked up by the Node.js API and written into PostgreSQL (the source of truth for structured queries and reports).

### Sync Flow
```
[Field Device — Offline]
     │
     │  Write to PouchDB (local)
     ▼
 PouchDB (browser)
     │
     │  [Network restored]
     │
     ▼
 CouchDB (server) ──► Node.js change listener ──► PostgreSQL
```

### Conflict Resolution
- **Detection:** CouchDB's built-in revision tracking (`_rev`) detects write conflicts.
- **Default Resolution:** Last-write-wins (by timestamp).
- **Conflict Log:** Both versions are saved in `sync_conflicts` table; flagged for manual review.
- **Officer Notification:** App displays "X records had sync conflicts" with a review link.

---

## 3.6.4 API Design Overview

Base URL: `https://api.relifmesh.app/v1`

| Method | Endpoint | Auth Required | Description |
|--------|----------|:------------:|-------------|
| POST | `/auth/login` | No | Login; returns JWT |
| POST | `/auth/register` | Upazila Officer | Create new user account |
| GET | `/households` | Yes | List households (filtered by jurisdiction) |
| POST | `/households` | UP Official, NGO | Register new household |
| GET | `/households/:id` | Yes | Get household by HH-ID |
| PUT | `/households/:id` | UP Official | Update household record |
| GET | `/distributions` | Yes | List distribution logs |
| POST | `/distributions` | UP Official, NGO | Create distribution log |
| GET | `/distributions/duplicate-check` | Yes | Check for duplicates before logging |
| GET | `/alerts` | Yes | List duplicate alerts |
| GET | `/reports/export` | Upazila Officer | Export CSV/PDF report |
| GET | `/public/dashboard` | No | Aggregated public data |
| GET | `/public/map` | No | Union-level map data |

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
        │       └── ENV vars: DB_URL, JWT_SECRET, CLOUDINARY_KEY
        │
        ├── PostgreSQL (Railway managed DB)
        │
        └── CouchDB (Railway Docker service or Cloudant free tier)

[Cloudinary]
        └── Photo uploads (free tier: 25GB)

[GitHub Pages / Netlify]
        └── React PWA frontend (static hosting, free tier)
```

**Zero-cost deployment confirmed:** Railway free tier, Netlify, Cloudinary free — all within prototype requirements.

---

*End of Section 3.6 — Next: Section 3.7 UI/UX Design*
