# Section 3.9 — Testing & Quality Assurance
**Project:** RelifMesh — Disaster Relief Coordination System for Local Government
**Team:** Team_Skipper | **Course:** CSE-3208 System Analysis & Design Lab
**Last Updated:** 2026-05-27
**QA Lead:** Abidul Islam

---

## 3.9.1 Test Plan

### Objectives
- Verify all functional requirements (FR-01 to FR-27) are correctly implemented
- Validate non-functional requirements (performance, security, offline reliability)
- Ensure role-based access control is enforced at every endpoint
- Confirm offline sync and duplicate detection work as specified

### Scope
- Unit testing: individual functions and utility modules
- Integration testing: API endpoints with real DB
- System testing: end-to-end user flows in browser
- User Acceptance Testing (UAT): simulated field scenarios

### Out of Scope
- Load testing beyond 50 concurrent users (prototype only)
- Penetration testing (covered conceptually in Section 3.10)
- Cross-browser testing beyond Chrome (PWA targets Android Chrome)

### Testing Tools
| Tool | Purpose |
|------|---------|
| Jest | Unit and integration tests (backend) |
| Supertest | HTTP API testing with Jest |
| React Testing Library | Component-level frontend tests |
| Postman | Manual API endpoint verification |
| Chrome DevTools | Offline simulation (Network tab → Offline) |
| Lighthouse | PWA audit, performance scoring |

---

## 3.9.2 Unit Test Cases

### Authentication Module

| TC ID | Test Case | Input | Expected Output | Status |
|-------|-----------|-------|-----------------|--------|
| TC-01 | Valid login returns JWT | Correct email + password | `{ token: "..." }`, 200 OK | [ ] |
| TC-02 | Invalid password rejected | Wrong password | 401 Unauthorized | [ ] |
| TC-03 | Non-existent user rejected | Unknown email | 401 Unauthorized | [ ] |
| TC-04 | Role embedded correctly in JWT | Login as UP Official | Decoded role = `UP_OFFICIAL` | [ ] |

### Household Registration

| TC ID | Test Case | Input | Expected Output | Status |
|-------|-----------|-------|-----------------|--------|
| TC-05 | Valid registration saves HH-ID | Valid form data | Household saved, unique HH-ID returned | [ ] |
| TC-06 | Duplicate NID is rejected | NID already registered | 409 Conflict with message | [ ] |
| TC-07 | Missing required field fails validation | name="" | 400 Bad Request, field error | [ ] |
| TC-08 | GPS coordinates stored correctly | lat=22.3, lng=91.8 | Stored with 6 decimal precision | [ ] |

### Distribution Logging

| TC ID | Test Case | Input | Expected Output | Status |
|-------|-----------|-------|-----------------|--------|
| TC-09 | Valid distribution log saved | Valid HH-ID + item + qty | Log saved, 201 Created | [ ] |
| TC-10 | Unknown HH-ID rejected | Non-existent HH-ID | 404 Not Found | [ ] |
| TC-11 | Quantity must be positive | quantity = -5 | 400 Bad Request | [ ] |

### Duplicate Detection

| TC ID | Test Case | Input | Expected Output | Status |
|-------|-----------|-------|-----------------|--------|
| TC-12 | Same item within 7 days → duplicate | Same HH, same item, 3 days later | Alert returned with prior log details | [ ] |
| TC-13 | Same item after 8 days → no duplicate | Same HH, same item, 8 days later | No alert, log proceeds | [ ] |
| TC-14 | Different item → no duplicate | Same HH, different item category | No alert | [ ] |
| TC-15 | Override accepted with reason | Duplicate + reason provided | Log saved with `is_override=true` | [ ] |
| TC-16 | Override rejected without reason | Duplicate, no reason | 400 Bad Request | [ ] |

---

## 3.9.3 Integration Test Cases

| TC ID | Flow | Steps | Expected | Status |
|-------|------|-------|----------|--------|
| TC-17 | Register → Log → Duplicate | 1. Register HH. 2. Log rice. 3. Log rice again same day. | Step 3 triggers duplicate alert | [ ] |
| TC-18 | Offline queue → sync | 1. Disable network. 2. Register HH in IndexedDB. 3. Re-enable network. | Record appears in MongoDB after sync | [ ] |
| TC-19 | Role access control | Login as UP Official, call `/reports/export` | 403 Forbidden | [ ] |
| TC-20 | Public dashboard — no auth | Call `/public/dashboard` without JWT | 200 OK with aggregated data | [ ] |
| TC-21 | Upazila jurisdiction filter | Upazila Officer from Upazila A queries Union B (different Upazila) | 403 Forbidden | [ ] |
| TC-22 | Conflict detection on sync | Two devices log same HH, same item offline; both sync | Both records saved; conflict flagged in `sync_conflicts` | [ ] |

---

## 3.9.4 User Acceptance Test (UAT) Scenarios

### UAT-01 — Field Registration Scenario
**Actor:** Simulated UP Official
**Scenario:** Register 5 households with photos and GPS in offline mode, then sync.
**Pass Criteria:**
- All 5 households appear in MongoDB after sync
- HH-IDs generated correctly
- Photos stored in Cloudinary
- Sync status indicator shows "Synced"

---

### UAT-02 — Duplicate Distribution Prevention
**Actor:** Simulated NGO Worker
**Scenario:** Attempt to distribute rice to a household that received rice 2 days ago (logged by UP Official).
**Pass Criteria:**
- Warning shown with prior distribution details before submission
- Officer can cancel or override with reason
- Override logged with reason text

---

### UAT-03 — Upazila Audit
**Actor:** Simulated Upazila Officer
**Scenario:** View all distributions in Union X over the past 7 days and export a PDF.
**Pass Criteria:**
- All relevant logs displayed
- PDF generated with correct data
- No data from other Upazilas visible

---

### UAT-04 — Public Transparency Check
**Actor:** Simulated citizen (no login)
**Scenario:** Open public dashboard and view distribution data for a specific union.
**Pass Criteria:**
- Dashboard loads without login
- No NID or personal name visible
- Map shows correct union markers
- Item totals correct

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

*(To be completed during Module 13 — Week 13–14)*

| Category | Total Cases | Passed | Failed | Blocked |
|----------|-------------|--------|--------|---------|
| Unit Tests | 16 | — | — | — |
| Integration Tests | 6 | — | — | — |
| UAT Scenarios | 4 | — | — | — |
| **Total** | **26** | — | — | — |

---

## 3.9.7 Non-Functional Test Cases

| TC ID | NFR | Test Method | Target | Status |
|-------|-----|-------------|--------|--------|
| NF-01 | Dashboard load time | Lighthouse + Chrome DevTools | < 3 seconds on 3G throttle | [ ] |
| NF-02 | API response time | Postman timer on `/distributions` | < 2 seconds | [ ] |
| NF-03 | PWA offline capability | Chrome DevTools → Offline mode | Core features functional | [ ] |
| NF-04 | Offline sync reliability | 20 records queued, re-sync | ≥ 19/20 synced correctly | [ ] |
| NF-05 | Password hashing | DB inspection | bcrypt hash stored, not plain text | [ ] |
| NF-06 | HTTPS enforcement | HTTP request to API | Redirected to HTTPS | [ ] |
| NF-07 | Unauthorized access | Call protected endpoint without JWT | 401 Unauthorized | [ ] |
| NF-08 | Mobile usability | Manual test on Android phone | Core flows in ≤ 5 taps | [ ] |

---

*End of Section 3.9 — Next: Section 3.10 Security & Access Control*
