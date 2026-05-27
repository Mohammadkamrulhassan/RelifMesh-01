# Section 3.10 — Security & Access Control
**Project:** RelifMesh — Disaster Relief Coordination System for Local Government
**Team:** Team_Skipper | **Course:** CSE-3208 System Analysis & Design Lab
**Last Updated:** 2026-05-27

---

## 3.10.1 Threat Model (STRIDE)

STRIDE is a standard threat classification framework: **S**poofing, **T**ampering, **R**epudiation, **I**nformation Disclosure, **D**enial of Service, **E**levation of Privilege.

| Threat | Category | Example in RelifMesh | Mitigation |
|--------|----------|----------------------|------------|
| Fake officer identity | Spoofing | Attacker logs in as UP Official to falsify distribution logs | JWT authentication + bcrypt password hashing |
| Modify distribution log | Tampering | User edits a submitted log to hide duplicate distribution | Logs are immutable once synced; amendments create new entries |
| Deny making a log entry | Repudiation | Officer claims they never logged a distribution | All logs include officer_id + timestamp + GPS; full audit trail |
| Expose household PII | Information Disclosure | Public dashboard leaks NID or name | PII only in private endpoints; public data aggregated at union level |
| Flood API with requests | Denial of Service | Bot hammers `/distributions` endpoint | Rate limiting middleware (express-rate-limit) |
| NGO worker views Upazila data | Elevation of Privilege | NGO worker accesses admin-only reports | RBAC enforced on every protected route; JWT role decoded server-side |

---

## 3.10.2 Authentication Mechanism

### Method: JWT (JSON Web Token)

**Login Flow:**
```
Client             Server
 │                │
 │──POST /auth/login─────────────►│
 │ { email, password }      │
 │                │──Lookup user by email
 │                │──Compare password with bcrypt hash
 │                │──Generate JWT (payload: user_id, role, jurisdiction_id)
 │◄──{ token: "eyJ..." }─────────│
 │                │
 │──GET /households (with JWT)───►│
 │ Authorization: Bearer eyJ... │──Decode JWT → extract role + jurisdiction
 │                │──Check permission
 │◄──{ households: [...] }───────│
```

**JWT Payload Structure:**
```json
{
 "sub": "user-uuid-here",
 "role": "UP_OFFICIAL",
 "jurisdiction_id": "union-uuid-here",
 "iat": 1748300000,
 "exp": 1748904800
}
```

**Settings:**
- Algorithm: `HS256`
- Expiry: `7 days`
- Secret: stored in `.env`, never in code
- Token transmitted via `Authorization: Bearer` header only — never in URL query params

---

## 3.10.3 Role-Based Access Control (RBAC)

### Roles & Permissions Matrix

| Permission | Public | UP Official | NGO Worker | Upazila Officer |
|-----------|:------:|:-----------:|:----------:|:---------------:|
| View public dashboard | [x] | [x] | [x] | [x] |
| Register household | [ ] | [x] | [ ] | [ ] |
| Log distribution | [ ] | [x] | [x] | [ ] |
| Override duplicate | [ ] | [x] | [x] | [ ] |
| View own union data | [ ] | [x] | [x] | [x] |
| View all unions (jurisdiction) | [ ] | [ ] | [ ] | [x] |
| Export reports | [ ] | [ ] | [ ] | [x] |
| Manage user accounts | [ ] | [ ] | [ ] | [x] |
| Review sync conflicts | [ ] | [x] (own) | [x] (own) | [x] (all) |
| View duplicate alert log | [ ] | [x] (own) | [x] (own) | [x] (all) |

### Jurisdiction Enforcement
Beyond role, every data query is filtered by `jurisdiction_id`:
- A UP Official can only read/write data tagged to their union.
- An Upazila Officer can read data from all unions whose `parent_id` matches their Upazila.
- Server always validates: `decoded_jwt.jurisdiction_id` is an ancestor of the requested resource's jurisdiction.

### RBAC Middleware (pseudocode)
```javascript
// middleware/authorize.js
function authorize(...allowedRoles) {
 return (req, res, next) => {
  const { role, jurisdiction_id } = req.user; // decoded from JWT
  if (!allowedRoles.includes(role)) {
   return res.status(403).json({ error: 'Forbidden' });
  }
  req.userJurisdiction = jurisdiction_id;
  next();
 };
}

// Usage in routes
router.post('/households', authenticate, authorize('UP_OFFICIAL'), createHousehold);
router.get('/reports/export', authenticate, authorize('UPAZILA_OFFICER'), exportReport);
```

---

## 3.10.4 Data Privacy Design

### PII Handling
| Data Field | Classification | Where Visible |
|-----------|---------------|---------------|
| Head-of-household name | PII | Authenticated users only |
| NID number | Sensitive PII | Authenticated users only; never in logs/responses |
| GPS (household) | Location data | Authenticated users; approximate only in reports |
| Family vulnerability flags | Sensitive | Authenticated users only |
| Photo URL | Sensitive | Authenticated users only |
| Distribution item + quantity | Public aggregate | Public dashboard (no individual linkage) |
| Officer ID | Internal | Audit logs; not shown publicly |

### Public Dashboard Rules
- Only aggregated counts per union (no per-household breakdown)
- No NID, name, or GPS coordinates in public responses
- API response for `/public/dashboard` is pre-computed and cached — never directly queries household table

### Data Retention
- All distribution logs retained permanently (audit purposes)
- Photos stored indefinitely in Cloudinary (prototype: manual cleanup after semester)
- No right-to-erasure implementation in prototype scope

---

## 3.10.5 Input Validation & Injection Prevention

### Server-Side Validation (all inputs)
```javascript
// Example: household registration validation
const { body, validationResult } = require('express-validator');

const validateHousehold = [
 body('head_name').trim().isLength({ min: 2, max: 100 }).escape(),
 body('nid').trim().matches(/^[0-9]{10,17}$/),
 body('family_size').isInt({ min: 1, max: 50 }),
 body('gps_lat').isFloat({ min: -90, max: 90 }),
 body('gps_lng').isFloat({ min: -180, max: 180 }),
];
```

### SQL Injection Prevention
- No raw SQL string concatenation — all DB queries use parameterized queries:
```javascript
// Safe
const result = await db.query(
 'SELECT * FROM households WHERE jurisdiction_id = $1',
 [jurisdictionId]
);

// Never
const result = await db.query(
 `SELECT * FROM households WHERE jurisdiction_id = '${jurisdictionId}'`
);
```

### XSS Prevention
- All user input escaped before storage (`express-validator`'s `.escape()`)
- React escapes output by default — no `dangerouslySetInnerHTML` used
- `Content-Security-Policy` header set on all API responses

### Other Security Headers (via `helmet` middleware)
```javascript
const helmet = require('helmet');
app.use(helmet()); // Sets: X-Frame-Options, X-Content-Type-Options, HSTS, CSP
```

### Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');
app.use('/api/', rateLimit({
 windowMs: 15 * 60 * 1000, // 15 minutes
 max: 200,         // max 200 requests per window per IP
 message: { error: 'Too many requests, slow down.' }
}));
```

---

*End of Section 3.10 — Next: Section 3.11 Deployment & Maintenance*
