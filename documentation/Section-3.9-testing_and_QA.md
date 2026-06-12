# Section 3.9 — Testing & Quality Assurance
**Project:** ReliefMesh — Disaster Response & Relief Management System
**Team:** Team_Skipper | **Course:** CSE-3208 System Analysis & Design Lab
**Last Updated:** 2026-06-10
**QA Lead:** Abidul Islam

---

## 3.9.1 Test Plan

### Objectives
- Verify all functional requirements (FR-01 to FR-51) are correctly implemented
- Validate non-functional requirements (performance, security, offline reliability, i18n)
- Ensure role-based access control is enforced at every endpoint (7 roles)
- Confirm SOS offline queue, real-time chat, and donation flows work end-to-end

### Scope
- Unit testing: individual functions and utility modules
- Integration testing: API endpoints with real DB
- System testing: end-to-end user flows in browser
- Real-time testing: Socket.io event emission and reception
- Offline sync testing: SOS queue, distribution queue, conflict resolution
- User Acceptance Testing (UAT): simulated field scenarios

### Out of Scope
- Load testing beyond 50 concurrent users (prototype only)
- Penetration testing (covered conceptually in Section 3.10)
- Cross-browser testing beyond Chrome (PWA targets Android Chrome)

### Testing Tools (v2)
| Tool | Purpose |
|------|---------|
| Jest | Unit and integration tests (backend) |
| Supertest | HTTP API testing with Jest |
| React Testing Library | Component-level frontend tests |
| Postman | Manual API endpoint verification |
| Chrome DevTools | Offline simulation (Network tab → Offline) |
| Lighthouse | PWA audit, performance scoring |
| Socket.io Client | Real-time event testing |
| k6 (optional) | Load testing for SOS + Chat |

---

## 3.9.2 Unit Test Cases

### Authentication Module (v2 — Phone/OTP)

| TC ID | Test Case | Input | Expected Output |
|-------|-----------|-------|-----------------|
| TC-01 | Send OTP to valid phone | `+8801700000008` | 200, OTP sent |
| TC-02 | Send OTP to invalid phone | `+88000` | 400 Validation error |
| TC-03 | Verify valid OTP | Phone + OTP `123456` | 200, JWT returned |
| TC-04 | Verify wrong OTP | Phone + wrong OTP | 401 Unauthorized |
| TC-05 | OTP rate limit exceeded | 4th OTP request in 10 min | 429 Too Many Requests |
| TC-06 | OTP max attempts exceeded | 6th verify attempt | 423 Locked |
| TC-07 | Refresh token rotation | Valid refresh + old refresh used | New tokens issued, old invalidated |
| TC-08 | JWT role embedded correctly | Login as volunteer | Decoded role = `volunteer` |
| TC-09 | JWT expired rejected | Use expired token | 401 Token expired |

### SOS Module

| TC ID | Test Case | Input | Expected Output |
|-------|-----------|-------|-----------------|
| TC-10 | Create SOS with valid data | Location, type, description | 201 Created, status = pending |
| TC-11 | Create SOS without location | No GPS coordinates | 400 Validation error |
| TC-12 | List own SOS history | Victim requests | 200, only victim's SOS returned |
| TC-13 | Volunteer views pending SOS | Volunteer requests | 200, all pending/resolved visible |
| TC-14 | SOS auto-expires after TTL | SOS created with 24h TTL | Deleted after 24h (TTL index) |
| TC-15 | SOS submitted offline queues to IndexedDB | Offline create | Stored in IndexedDB, pending sync |

### Mission Module

| TC ID | Test Case | Input | Expected Output |
|-------|-----------|-------|-----------------|
| TC-16 | Volunteer accepts mission | missionId + volunteerId | 200, status = assigned |
| TC-17 | Mission status update | en_route → on_site | 200, status updated |
| TC-18 | Complete mission with feedback | status = completed + rating | 200, feedback saved |
| TC-19 | Non-volunteer cannot accept | Victim tries to accept | 403 Forbidden |

### Campaign & Donation Module

| TC ID | Test Case | Input | Expected Output |
|-------|-----------|-------|-----------------|
| TC-20 | NGO creates campaign | title, goal, ngoId | 201 Created, status = draft |
| TC-21 | Admin verifies campaign | campaignId | 200, status = active |
| TC-22 | Donor donates to active campaign | campaignId + amount + method | 201 Created |
| TC-23 | Donation updates raisedAmount | Valid donation | raisedAmount incremented |
| TC-24 | Donor cannot create campaign | Donor token | 403 Forbidden |

### Shelter Module

| TC ID | Test Case | Input | Expected Output |
|-------|-----------|-------|-----------------|
| TC-25 | NGO creates shelter | name, location, capacity | 201 Created |
| TC-26 | Shelter capacity exceeded | occupancy > capacity | 400 Capacity exceeded |
| TC-27 | List nearby shelters | lat + lng + radius | 200, sorted by distance |

### Chat Module

| TC ID | Test Case | Input | Expected Output |
|-------|-----------|-------|-----------------|
| TC-28 | Send message in mission | missionId + senderId + text | 201, message saved |
| TC-29 | Non-participant cannot send | User not in mission | 403 Forbidden |
| TC-30 | List mission messages | missionId | 200, messages sorted by time |

### Notification Module

| TC ID | Test Case | Input | Expected Output |
|-------|-----------|-------|-----------------|
| TC-31 | Notification created on SOS | New SOS created | Notification sent to nearby volunteers |
| TC-32 | Mark notification read | notifId | 200, isRead = true |
| TC-33 | List user notifications | userId | 200, sorted by createdAt desc |

### Audit Log Module

| TC ID | Test Case | Input | Expected Output |
|-------|-----------|-------|-----------------|
| TC-34 | Admin action logged | Admin deletes SOS | Audit record created |
| TC-35 | Super admin views audit logs | Filter by action | 200, filtered results |

### Offline Sync

| TC ID | Test Case | Input | Expected Output |
|-------|-----------|-------|-----------------|
| TC-36 | SOS queued offline | Disconnect → submit SOS | Queued in IndexedDB |
| TC-37 | SOS syncs on reconnect | Network restored | SOS appears in MongoDB |
| TC-38 | Conflict detected on sync | Two devices, same SOS | Conflict flagged in sync_conflicts |

---

## 3.9.3 Integration Test Cases

| TC ID | Flow | Steps | Expected |
|-------|------|-------|----------|
| TC-INT01 | Send OTP → Verify → Access Protected | 1. Send OTP 2. Verify 3. Use JWT to access profile | Step 3 returns 200 |
| TC-INT02 | SOS → Mission → Chat | 1. Victim creates SOS 2. Volunteer accepts 3. Send chat | Chat appears in mission |
| TC-INT03 | Campaign → Donation → Receipt | 1. NGO creates campaign 2. Donor donates 3. Receipt generated | Receipt has correct amount |
| TC-INT04 | Shelter → Inventory | 1. Create shelter 2. Add inventory item 3. Transfer | Inventory transferred |
| TC-INT05 | SOS broadcast via Socket.io | Victim creates SOS | Volunteer receives `sos:new` event |
| TC-INT06 | Offline queue → Sync → Verify | 1. Submit SOS offline 2. Reconnect 3. Query MongoDB | SOS found in DB |
| TC-INT07 | Role access control | Victim calls `/api/admin/users` | 403 Forbidden |

---

## 3.9.4 User Acceptance Test (UAT) Scenarios

### UAT-01 — SOS to Rescue Scenario
**Actor:** Victim + Volunteer
**Scenario:** Victim submits SOS → Volunteer sees it → Accepts mission → Rescues → Chat → Complete
**Pass Criteria:**
- SOS appears in volunteer's dashboard
- Volunteer can accept → mission status changes
- Chat messages exchanged in real-time
- Mission completes with feedback

### UAT-02 — Campaign Donation Flow
**Actor:** NGO Admin + Donor
**Scenario:** NGO creates campaign → Admin verifies → Donor donates via bKash → Receipt generated
**Pass Criteria:**
- Campaign status moves draft → active
- Donation amount reflected in raisedAmount
- Receipt PDF downloadable

### UAT-03 — Admin Command Center
**Actor:** Super Admin
**Scenario:** View live dashboard → Manage users → View audit logs → Verify campaign
**Pass Criteria:**
- Dashboard shows correct live stats
- User can be created/edited/deactivated
- Audit log shows all recent admin actions
- Campaign can be verified (→ active)

### UAT-04 — Offline SOS in No-Network Zone
**Actor:** Victim
**Scenario:** Victim in remote area with no internet → Submits SOS → Locations cached → Later syncs
**Pass Criteria:**
- SOS saved in IndexedDB with "queued" indicator
- When network restored, SOS syncs automatically
- SOS visible in MongoDB with correct timestamp

---

## 3.9.5 Bug Report Log Template

| Bug ID | Date | Reported By | Module | Description | Severity | Status | Fix Commit |
|--------|------|-------------|--------|-------------|----------|--------|------------|
| BUG-001 | — | — | — | — | — | Open | — |

**Severity Levels:**
- **Critical** — System crash, data loss, security breach
- **High** — Core feature broken, no workaround
- **Medium** — Feature partially broken, workaround exists
- **Low** — UI issue, minor inconvenience

---

## 3.9.6 Test Results Summary

*(Updated 2026-06-10 — 48 test cases across 12 modules.)*

| Category | Total Cases | Passed | Failed | Blocked |
|----------|-------------|--------|--------|---------|
| Auth (OTP/JWT) | 9 | 9 | 0 | 0 |
| SOS | 6 | 6 | 0 | 0 |
| Mission | 4 | 4 | 0 | 0 |
| Campaign & Donation | 5 | 5 | 0 | 0 |
| Shelter | 3 | 3 | 0 | 0 |
| Chat | 3 | 3 | 0 | 0 |
| Notification | 3 | 3 | 0 | 0 |
| Audit Log | 2 | 2 | 0 | 0 |
| Offline Sync | 3 | 3 | 0 | 0 |
| Integration | 7 | 7 | 0 | 0 |
| UAT Scenarios | 4 | — | — | Pending |
| **Total** | **48** | **40** | **0** | — |

---

## 3.9.7 Non-Functional Test Cases (v2)

| TC ID | NFR | Test Method | Target |
|-------|-----|-------------|--------|
| NF-01 | Dashboard load time | Lighthouse + Chrome DevTools | < 3 seconds on 3G throttle |
| NF-02 | API response time | Postman timer on distributions | < 2 seconds |
| NF-03 | PWA offline capability | Chrome DevTools → Offline mode | SOS + forms functional |
| NF-04 | SOS sync reliability | 20 records queued, re-sync | ≥ 19/20 synced correctly |
| NF-05 | Socket.io connection time | Client connect measure | < 1 second |
| NF-06 | i18n string coverage | Scan all components | No untranslated keys |
| NF-07 | OTP hashing | DB inspection | bcrypt hash stored, not plain text |
| NF-08 | Unauthorized access | Call protected endpoint without JWT | 401 Unauthorized |
| NF-09 | Role enforcement | Cross-role API calls | Correct 403 responses |
| NF-10 | Mobile usability | Manual test on Android phone | Core flows in ≤ 5 taps |
| NF-11 | Real-time chat latency | Measure send → receive | < 500ms |

---

*End of Section 3.9 — Next: Section 3.10 Security & Access Control*
