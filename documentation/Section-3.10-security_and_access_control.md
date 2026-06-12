# Section 3.10 — Security & Access Control
**Project:** ReliefMesh — Disaster Response & Relief Management System
**Team:** Team_Skipper | **Course:** CSE-3208 System Analysis & Design Lab
**Last Updated:** 2026-06-10

---

## 3.10.1 Authentication (v2 — Implemented)

ReliefMesh v2 uses **Phone Number + OTP** authentication for all users.

### OTP Flow (Implemented)

```
[User enters phone number]
        │
        ▼
[POST /v2/auth/send-otp]
        │
        ▼
[Server generates 6-digit OTP (crypto.randomInt)]
  ├── Hashes OTP with SHA-256
  ├── Stores hash in Redis (5 min TTL) OR in-memory Map
  └── In dev mode (NODE_ENV=development):
        OTP is returned in the response body
        In production: OTP would be sent via SMS gateway
        │
        ▼
[POST /v2/auth/verify-otp]
  { phone, otp }
        │
        ▼
[Server hashes input OTP → compares with stored hash]
  ├── Match → Delete OTP from store
  │           Issue JWT access token (15 min TTL)
  │           Issue refresh token (7 day TTL)
  │           Store refresh token for rotation
  │           Auto-create user if first-time phone
  │           Return { accessToken, refreshToken, user }
  │
  └── No match → Increment attempt counter (max 5)
                  Return 401 with remaining attempts
                  After 5 failures → block phone for 30 min
```

### Rate Limiting (Implemented)

| Limit | Value | Implementation |
|-------|-------|----------------|
| OTP send | 3 requests per 10 min per phone | Increment counter with 10 min TTL |
| OTP verify | 5 attempts per phone | Counter cleared on success; block 30 min after 5 failures |
| General API | 200 requests per 15 min | `express-rate-limit` middleware |

If rate limit is exceeded, the API returns:
```json
{
  "error": "Too many OTP requests. Try again in X min.",
  "retryAfter": 345
}
```

### Token Strategy (Implemented)

| Token | Storage | TTL | Purpose |
|-------|---------|-----|---------|
| **Access Token** | Memory (client) | 15 min (`JWT_EXPIRES_IN`) | API auth header |
| **Refresh Token** | Client + Server store | 7 days (`JWT_REFRESH_EXPIRES_IN`) | Token renewal with rotation |
| **OTP Code** | Redis / In-Memory | 5 min | Phone verification |

### Refresh Token Rotation

Each use of a refresh token:
1. Server **consumes** the old token (deletes from store)
2. Server verifies the old token's JWT signature
3. Server issues a **new** access token + **new** refresh token
4. If an old, already-consumed refresh token is reused → rejected (401)

This prevents replay attacks if a refresh token is stolen.

### Security Measures

| Measure | Implementation |
|---------|----------------|
| OTP hashing | SHA-256 before storage (not plaintext) |
| Rate limiting | Redis-cached counters (or in-memory fallback) |
| Max verify attempts | 5 → phone blocked for 30 min |
| JWT signing | HS256 with env secret (RS256 planned for production) |
| Refresh rotation | Old token invalidated on each use |
| Dev mode safety | OTP returned in response body only when `NODE_ENV=development` |
| No password storage | Phone/OTP users have no `passwordHash` |

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
| OTP hashing | SHA-256 (not stored in plaintext) |
| Password hashing | bcrypt (cost factor 10) — for v1 email/password users |
| JWT signing | HS256 with 32+ character secret |
| API rate limiting | 200 req/15 min global; 3 OTP/10 min per phone |
| Input validation | express-validator on all routes |
| XSS protection | Helmet.js, React escape by default |
| MongoDB injection | Mongoose schema validation |
| HTTPS enforcement | Production only; TLS 1.3 |

---

## 10.5 Implementation Details

### OTP Service (`backend/services/otpStore.js`)

```
┌─────────────────────────────────────────────────────────────────┐
│                      OtpStore (Singleton)                        │
├─────────────────────────────────────────────────────────────────┤
│  _init()                                                         │
│    ├── Try Redis connection (ioredis)                            │
│    ├── If Redis fails → in-memory Map fallback                   │
│    └── Logs which store is active                                │
│                                                                  │
│  sendOtp(phone)                                                  │
│    ├── Check rate limit (3/10min) → 429 if exceeded              │
│    ├── Generate 6-digit OTP                                      │
│    ├── Hash with SHA-256                                         │
│    ├── Store hash (Redis EX 300s / Map with expiry)              │
│    └── Return OTP (visible only in dev mode)                     │
│                                                                  │
│  verifyOtp(phone, otp)                                           │
│    ├── Check attempt counter → 423 if ≥5 failures               │
│    ├── Hash input OTP, compare with stored hash                  │
│    ├── Match → delete from store, return { valid: true }         │
│    └── No match → increment counter, return error                │
│                                                                  │
│  consumeRefreshToken(token)                                      │
│    ├── Look up token in store                                    │
│    ├── Found → delete from store, return phone                   │
│    └── Not found → return null                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Auth Controller (`backend/modules/auth-v2/authV2Controller.js`)

```
sendOtp(req, res)
  ├── Calls otpStore.sendOtp(phone)
  ├── If rate limited → 429 { error, retryAfter }
  └── 200 { message: "OTP sent to +880****08", otp: "..." }

verifyOtp(req, res)
  ├── Calls otpStore.verifyOtp(phone, otp)
  ├── If invalid → 401 { error }
  ├── Find or auto-create User by phone
  ├── Sign accessToken (JWT, 15 min)
  ├── Sign refreshToken (JWT, 7 days)
  ├── Store refreshToken in otpStore
  └── 200 { accessToken, refreshToken, user }

refresh(req, res)
  ├── Calls otpStore.consumeRefreshToken(refreshToken)
  ├── If null → 401 { error: "Invalid or expired refresh token" }
  ├── Verify JWT signature of old refresh token
  ├── Find user
  ├── Issue new access + refresh tokens
  ├── Store new refresh token
  └── 200 { accessToken, refreshToken }
```

---

*End of Section 3.10 — Next: Section 3.11 Deployment & Maintenance*
