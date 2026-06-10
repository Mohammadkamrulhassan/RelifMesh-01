# Section 3.10 — Security & Access Control
**Project:** ReliefMesh — Disaster Response & Relief Management System
**Team:** Team_Skipper | **Course:** CSE-3208 System Analysis & Design Lab
**Last Updated:** 2026-06-10

---

## 3.10.1 Authentication (v2)

ReliefMesh v2 uses **Phone Number + OTP** authentication for all users.

### OTP Flow
```
[User enters phone number]
        │
        ▼
[Request OTP → POST /api/auth/send-otp]
        │
        ▼
[Server generates 6-digit OTP]
  ├── Stores OTP hash + phone in Redis (5 min TTL)
  └── Sends SMS via SMS gateway
        │
        ▼
[User enters OTP → POST /api/auth/verify-otp]
        │
        ▼
[Server verifies OTP hash]
  ├── Valid → Issue JWT (access + refresh tokens)
  └── Invalid → Return 401, max 5 attempts
```

### Token Strategy
| Token | Storage | TTL | Purpose |
|-------|---------|-----|---------|
| Access Token | Memory (Redux) | 15 min | API auth |
| Refresh Token | HTTP-only cookie | 7 days | Token renewal |
| OTP Code | Redis (hashed) | 5 min | Phone verification |

### Security Measures
- OTP hashed with bcrypt before storage
- Rate limit: 3 OTP requests per phone per 10 min (Redis)
- Max 5 OTP verify attempts per session
- JWT signed with RS256 (asymmetric key pair)
- Refresh token rotation on each use
- Device fingerprint stored on login for anomaly detection

---

## 3.10.2 Role Definitions

| Role | Description |
|------|-------------|
| `victim` | Disaster-affected individual requesting SOS/relief |
| `volunteer` | Rescue worker assigned to missions |
| `ngo` | NGO admin managing campaigns & inventory |
| `govt` | Government official overseeing relief distribution |
| `donor` | Individual/organization donating to campaigns |
| `admin` | System administrator with full access |
| `super_admin` | Elevated admin with user management & audit access |

---

## 3.10.3 Role-Based Permission Matrix (v2)

| Resource | victim | volunteer | ngo | govt | donor | admin | super_admin |
|----------|--------|-----------|-----|------|-------|-------|-------------|
| **Profile (own)** | CRUD | CRUD | CRUD | CRUD | CRUD | CRUD | CRUD |
| **Profile (others)** | — | — | — | — | — | R | CRUD |
| **SOS (create)** | C | C | C | C | — | C | C |
| **SOS (own history)** | R | — | — | — | — | R | R |
| **SOS (all)** | — | R | — | R | — | R | R |
| **SOS (delete)** | — | — | — | — | — | D | D |
| **Missions (view)** | Own | All assigned | — | R | — | R | CRUD |
| **Missions (assign)** | — | — | — | — | — | U | U |
| **Missions (status)** | — | Own | — | — | — | U | U |
| **Relief Request** | C | U | CRUD | CRUD | — | R | R |
| **Distribution** | — | C | C | C | — | R | CRUD |
| **Campaign (create)** | — | — | CRUD | CRUD | — | — | — |
| **Campaign (verify)** | — | — | — | — | — | U | U |
| **Campaign (all)** | R | R | R | R | R | CRUD | CRUD |
| **Donation** | — | — | R | R | C | R | CRUD |
| **Shelter (create)** | — | — | CRUD | CRUD | — | — | CRUD |
| **Shelter (view)** | R | R | R | R | R | R | R |
| **Inventory** | — | — | CRUD (own) | R | — | R | CRUD |
| **Chat (mission)** | Own mission | Own mission | — | — | — | R | R |
| **Notifications** | Own | Own | Own | Own | Own | Own | Own |
| **Audit Logs** | — | — | — | — | — | R | CRUD |
| **User Management** | — | — | — | — | — | — | CRUD |
| **System Config** | — | — | — | — | — | — | CRUD |

Legend: C = Create, R = Read, U = Update, D = Delete

---

## 10.4 Data Protection

| Measure | Implementation |
|---------|----------------|
| Password/OTP hashing | bcrypt (cost factor 12) |
| NID encryption | AES-256-GCM at rest |
| JWT signing | RS256 (4096-bit key pair) |
| API rate limiting | Redis-based, per-route tiers |
| Input validation | Zod schemas on all routes |
| XSS protection | Helmet.js, React escape by default |
| CSRF protection | SameSite=Strict cookies, CSRF token for state-changing requests |
| MongoDB injection | Mongoose sanitization, mongo-sanitize |
| HTTPS enforcement | Production only; TLS 1.3 |
| Audit trail | All admin/role changes logged to audit_logs |

### API Rate Limit Tiers

| Tier | Limit | Routes |
|------|-------|--------|
| Strict | 3 req/min | OTP send, OTP verify |
| Standard | 30 req/min | Auth, SOS create |
| Moderate | 100 req/min | CRUD endpoints |
| Unlimited | — | Public read-only |

---

## 10.5 Session & Device Management

- Users can view all active sessions (device, IP, last active)
- Force logout from specific devices
- Single-session enforcement optional (configurable in admin panel)
- Session data stored in Redis for fast invalidation

---

*End of Section 3.10 — Next: Section 3.12 Project Management*
