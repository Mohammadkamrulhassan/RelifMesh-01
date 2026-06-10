# ReliefMesh — Disaster Response & Relief Management System

> *"One mesh. No duplicates. No household left behind."*

**Course:** CSE-3208 System Analysis & Design Lab
**Team:** Team_Skipper | **Project:** #6 ReliefMesh
**Supervisor:** MD Mynoddin, Assistant Professor, RMSTU

---

## Team

| ID | Name | Role |
|----|------|------|
| 2101011001 | Abidul Islam | System Analyst / QA Tester |
| 2101011005 | MD. Kamrul Hassan | Project Manager / Developer |
| 2101011013 | Sayeda Mofatteha Ahmed | UI/UX Designer |
| 2101011038 | Iftekhar Alam Nahid | UI/UX Designer |

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

### Planned (v2 — In Development)
- **Phone/OTP Authentication** — passwordless login via OTP + JWT refresh tokens
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
| Database | MongoDB, Mongoose ODM | MongoDB, Mongoose ODM, Redis |
| Auth | Email/password + JWT | Phone/OTP + JWT (access + refresh) |
| Real-time | — | Socket.io (SOS, missions, notifications) |
| Offline | localforage (distribution sync) | IndexedDB (SOS queue + distribution sync) |
| i18n | — | react-i18next (English, Bengali) |
| Payments | — | bKash / Nagad / Rocket (sandbox) |
| Testing | Jest + Supertest | Jest + Supertest |

---

## Architecture (v2)

```
[ React Client (PWA + Redux) ] <──REST/WS──> [ Express + Socket.io Server ] <──> [ MongoDB ]
                                                    │
                                              [ Redis Cache ]
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
├── backend/           # Express + TypeScript REST API + Socket.io
│   ├── modules/       # Domain modules with model/router/controller/service
│   ├── config/        # DB, Redis, Socket, env config
│   ├── sockets/       # WebSocket event handlers
│   ├── jobs/          # Background cron jobs
│   └── tests/         # Integration and E2E tests
│
├── documentation/     # 14 SAD module deliverables
├── diagrams/          # draw.io files (DFD, UML, ERD, architecture)
├── designs/           # Figma exports (wireframes, mockups)
├── reports/           # PM artifacts (meeting minutes, weekly progress)
├── submission/        # Final deliverables (demo video, slides)
├── newly-think/       # Redesign spec and documentation
└── assets/            # Shared media
```

---

## API Reference (v1)

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| GET | `/v1/health` | No | Health check |
| POST | `/v1/auth/login` | No | Login, returns JWT |
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

All protected endpoints use `Authorization: Bearer <token>` header.

---

## Quick Start

```bash
# Backend
cd backend
cp .env.example .env  # fill in your values
npm install
npm run migrate
npm run seed
npm run dev

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
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
| **Upgrade** | v2 enhancements (see newly-think/) | [ ] In Progress |
