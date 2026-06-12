# Section 3.6 — Architecture & Technology Stack
**Project:** ReliefMesh — Disaster Response & Relief Management System
**Team:** Team_Skipper | **Course:** CSE-3208 System Analysis & Design Lab
**Last Updated:** 2026-06-10

---

## 3.6.1 System Architecture Overview (v2)

ReliefMesh uses a **PWA + REST/WebSocket + MongoDB + Redis** architecture.

```
┌──────────────────────────────────────────────────────────────────┐
│                     CLIENT TIER                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                    React.js (Vite + TS)                    │  │
│  │  ┌──────────┐  ┌───────────┐  ┌──────────┐  ┌──────────┐ │  │
│  │  │  Auth    │  │    SOS    │  │  Rescue  │  │  Admin   │ │  │
│  │  │ Features │  │  Features │  │ Features │  │ Features │ │  │
│  │  └──────────┘  └───────────┘  └──────────┘  └──────────┘ │  │
│  │  ┌────────────────────────────────────────────────────┐   │  │
│  │  │         Shared: UI / Hooks / Store / i18n         │   │  │
│  │  └────────────────────────────────────────────────────┘   │  │
│  │  ┌────────────────────────────────────────────────────┐   │  │
│  │  │   PWA: Service Worker / IndexedDB / Offline Queue  │   │  │
│  │  └────────────────────────────────────────────────────┘   │  │
│  └──────────────────────────┬─────────────────────────────────┘  │
│                             │ REST + WebSocket                    │
└─────────────────────────────┼───────────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                     SERVER LAYER                                 │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │           Express.js + Socket.io (TypeScript)            │   │
│  │                                                          │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐ │   │
│  │  │  Auth    │ │   SOS    │ │  Mission │ │  Campaign  │ │   │
│  │  │  Module  │ │  Module  │ │  Module  │ │  Module    │ │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └────────────┘ │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐ │   │
│  │  │ Donation │ │ Inventory│ │ Shelter  │ │   Chat     │ │   │
│  │  │  Module  │ │  Module  │ │  Module  │ │  Module    │ │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └────────────┘ │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐                │   │
│  │  │ Notifica-│ │  Audit   │ │Analytics │                │   │
│  │  │  tion    │ │   Log    │ │  Module  │                │   │
│  │  └──────────┘ └──────────┘ └──────────┘                │   │
│  └──────────────────────────┬───────────────────────────────┘   │
│                             │                                    │
└─────────────────────────────┼───────────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                      DATA TIER                                   │
│  ┌────────────────────────┐    ┌──────────────────────────────┐  │
│  │      MongoDB           │    │        Redis                 │  │
│  │  (Primary Database)    │    │  (Session / Cache / Queue)   │  │
│  │  Mongoose ODM          │    │  Socket.io Adapter           │  │
│  └────────────────────────┘    └──────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3.6.2 Technology Stack

### Frontend
| Technology | v1 | v2 | Justification |
|-----------|----|----|---------------|
| React.js | 18.x | 18.x | Component-based; team familiarity |
| Vite | 5.x | 5.x | Fast build; PWA plugin |
| Tailwind CSS | 3.x | 3.x | Mobile-first utility classes |
| localforage | 1.x | — | Replaced by IndexedDB (idb) |
| Leaflet.js | 1.9 | 1.9 | Free map library, offline tile caching |
| **TypeScript** | — | **Yes** | Type safety, better DX |
| **Redux Toolkit** | — | **Yes** | Predictable state, middleware |
| **react-i18next** | — | **Yes** | Bengali/English i18n |
| **idb** | — | **Yes** | Structured IndexedDB for SOS queue |

### Backend
| Technology | v1 | v2 | Justification |
|-----------|----|----|---------------|
| Node.js | 20.x | 20.x | Team familiarity |
| Express.js | 4.x | 4.x | Lightweight REST API |
| Mongoose | 8.x | 8.x | MongoDB ODM |
| JWT (jsonwebtoken) | 9.x | 9.x | Stateless auth |
| bcrypt | 5.x | 5.x | Password/OTP Hashing |
| Multer | 1.x | 1.x | File upload |
| PDFKit / json2csv | latest | latest | Report export |
| **TypeScript** | — | **Yes** | Type safety |
| **Socket.io** | — | **Yes** | Real-time SOS, missions, chat |
| **Redis** | — | **Yes** | Sessions, rate limits, Socket.io |
| **Zod** | — | **Yes** | Type-safe validation |
| **node-cron** | — | **Yes** | Background jobs |

### Database
| Technology | v1 | v2 |
|-----------|----|-----|
| MongoDB | 8.x | 8.x |
| Redis | — | 7.x |

### DevOps & Tooling
| Tool | v1 | v2 | Purpose |
|------|----|-----|---------|
| Git + GitHub | ✓ | ✓ | Version control |
| Docker | Optional | ✓ | Dev environment consistency |
| ESLint + Prettier | — | ✓ | Code style |
| GitHub Actions | — | ✓ | CI/CD pipeline |
| Nginx | — | ✓ | Reverse proxy (production) |

---

## 3.6.3 Offline-First Architecture

### Strategy
ReliefMesh uses a **dual offline queue** pattern:
- **IndexedDB (idb)** — dedicated SOS queue (critical emergency data)
- **localforage** — distribution and household sync queue

### Sync Flow
```
[Device — Offline]
     │
     ├── SOS → IndexedDB (dedicated queue, highest priority)
     ├── Distribution → localforage
     └── Household → localforage
     │
     │ [Network restored]
     ▼
 Express API ──POST /sync/push──► MongoDB
     ◄──GET /sync/pull───
```

### Conflict Resolution
- **Default:** Last-write-wins by timestamp
- **Conflict Log:** Versions saved in `sync_conflicts` collection for manual review
- **SOS Priority:** SOS queue syncs first (before distribution data)

---

## 3.6.4 Real-Time Architecture (WebSocket)

### Socket.io Namespaces
| Namespace | Room Pattern | Description |
|-----------|--------------|-------------|
| `/` (default) | `user:<userId>` | Personal notifications |
| `/sos` | `sos:<sosId>` | SOS-specific updates |
| `/mission` | `mission:<missionId>` | Mission-specific updates |
| `/admin` | `admin:dashboard` | Admin dashboard real-time data |

### Key Events
| Event | Direction | Description |
|-------|-----------|-------------|
| `sos:new` | Server → Volunteers | New SOS broadcast |
| `mission:update` | Server → Victim + Volunteer | Mission status change |
| `chat:receive` | Server → Mission participants | New message |
| `notification:new` | Server → User | In-app alert |
| `location:update` | Client → Server | Volunteer live location |

---

## 3.6.5 Deployment Architecture (v2)

```
[GitHub Repository] → [GitHub Actions CI/CD]
         │
         ▼
[Docker Compose / Production Server]
         │
     ┌───┴───────────────────────┐
     │                           │
[NGINX (Reverse Proxy)]     [MongoDB]
     │                      [Redis]
     ├── /api/* → Node.js:5000
     └── /* → Static frontend
```

---

*End of Section 3.6 — Next: Section 3.7 UI/UX Design*
