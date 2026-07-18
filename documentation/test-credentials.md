# Test / Dummy Credentials

## Seed Accounts (dev/staging database)

| Role | Email | Password | Source |
|------|-------|----------|--------|
| Upazila Officer | `upazila@reliefmesh.test` | `password123` | `backend/db/seeds/seed.js:29-33` |
| UP Official | `upofficial@reliefmesh.test` | `password123` | `backend/db/seeds/seed.js:35-39` |
| NGO Worker | `ngo@reliefmesh.test` | `password123` | `backend/db/seeds/seed.js:42-48` |
| Citizen | `citizen@reliefmesh.test` | `password123` | `backend/db/seeds/seed.js:49-56` |

## Test Suite Accounts

| Role | Email | Password | Source |
|------|-------|----------|--------|
| Upazila Officer | `upazila@test.com` | `password` | `backend/tests/helpers.js:28-33` |
| UP Official | `upofficial@test.com` | `password` | `backend/tests/helpers.js:35-40` |
| NGO Worker | `ngo@test.com` | `password` | `backend/tests/helpers.js:42-48` |

## Other Hardcoded Secrets

| Secret | Value | Source |
|--------|-------|--------|
| JWT secret (dev fallback) | `dev-secret-change-in-production` | `backend/config/environment.js:8` |
| JWT secret (test) | `test-secret` | `backend/tests/helpers.js:66`, `backend/tests/setup.js:12` |
| MongoDB URI (dev fallback) | `mongodb://localhost:27017/reliefmesh` | `backend/config/environment.js:7` |
| MongoDB URI (example) | `mongodb://localhost:27017/reliefmesh` | `backend/.env.example:2` |
| JWT secret (example) | `your-secret-key-here` | `backend/.env.example:5` |

## UI Hint

The login page at `frontend/src/modules/auth/Login.jsx:94` displays these test emails to users.

---

**Note:** All seeded passwords are hashed with bcrypt in the database. Plaintext passwords are printed to the console during seeding (`backend/db/seeds/seed.js:61-63`).
