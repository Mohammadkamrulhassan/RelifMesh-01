# Section 3.14 — Presentation & Defense
**Project:** ReliefMesh — Disaster Response & Relief Management System
**Team:** Team_Skipper | **Course:** CSE-3208 System Analysis & Design Lab
**Last Updated:** 2026-06-10
**Presentation Lead:** Iftekhar Alam Nahid | **Slides:** Abidul Islam

---

## 3.14.1 Presentation Slide Structure (v2)

Total slides: ~22–26 | Duration: 15–20 minutes | Format: PowerPoint / Google Slides

| Slide # | Title | Content | Presenter |
|---------|-------|---------|-----------|
| 1 | Title Slide | ReliefMesh, team names, course, date | All |
| 2 | The Problem | Bangladesh flood/cyclone context, pain points (duplicate aid, delayed SOS, no transparency) | Abidul |
| 3 | Evidence | Key stats + research backing (citations from Sec 3.1) | Abidul |
| 4 | Our Solution | One-paragraph pitch + key differentiators | Kamrul |
| 5 | System Overview | Architecture diagram (Client → API + Socket.io → MongoDB + Redis) | Kamrul |
| 6 | v1 → v2 Evolution | Feature comparison table | Kamrul |
| 7 | Key Features v2 | SOS, Rescue Missions, Campaigns/Donations, Chat, Shelters, Admin Center | Sayeda |
| 8 | User Roles | 7 roles diagram with permissions summary | Sayeda |
| 9 | System Modeling | DFD Level 1 + Class Diagram | Abidul |
| 10 | Database Design | ERD overview (simplified — 18 entities) | Abidul |
| 11 | Offline-First Design | IndexedDB (SOS) + localforage (distribution) → Sync API | Kamrul |
| 12 | Real-Time Architecture | Socket.io namespaces, Redis adapter, chat flow | Kamrul |
| 13 | Security Design | RBAC table (7 roles × 20 resources) + OTP auth flow | Kamrul |
| 14 | UI Walkthrough | Screenshots of key screens (SOS, Mission, Campaign, Admin) | Sayeda / Nahid |
| 15 | LIVE DEMO | Working prototype demonstration | Kamrul (driver) |
| 16 | Testing Results | 48 test cases, 12 modules, UAT results | Abidul |
| 17 | Challenges Faced | Top 3 technical/team challenges and how we solved them | All |
| 18 | Impact | What changes if ReliefMesh is deployed for real | All |
| 19 | Future Roadmap | NID API, SMS, 2FA, native app, DDM integration | Nahid |
| 20 | Individual Contributions | RACI summary, who did what | All |
| 21 | Q&A Slide | "Thank you. Questions?" | All |

---

## 3.14.2 Live Demo Script (v2)

**Demo Duration:** 7–9 minutes
**Driver:** Kamrul Hassan (laptop connected to projector)
**Backup:** Recorded video at `/Submission/demo_video/` (if live demo fails)

### Demo Flow

```
Step 1 — Public Dashboard (30 sec)
  → Open https://reliefmesh.vercel.app
  → Show map, stat cards, active campaigns

Step 2 — OTP Login (30 sec)
  → Enter phone: +8801700000008
  → Enter OTP: 123456
  → Show JWT-based session

Step 3 — SOS Emergency (1.5 min)
  → Victim dashboard → SOS
  → Select type: Rescue, set location (or auto-detect)
  → Submit → Socket.io broadcasts
  → Switch to volunteer view → SOS appears

Step 4 — Accept Mission & Chat (1.5 min)
  → Volunteer accepts mission
  → Mission status: assigned → en_route → on_site
  → Open mission chat → send message
  → Victim sees message in real-time
  → Complete mission with rating

Step 5 — Campaign & Donation (1 min)
  → Switch to NGO account → create campaign
  → Admin verifies campaign
  → Donor donates → receipt generated
  → Campaign progress bar updates

Step 6 — Offline SOS (1 min)
  → Switch to OFFLINE mode (Chrome DevTools)
  → Submit SOS → shows "queued offline"
  → Re-enable network → SOS syncs automatically
  → Check MongoDB → SOS appears

Step 7 — Admin Command Center (1 min)
  → Login as Super Admin
  → Show live dashboard: SOS count, active missions, donations
  → View audit logs
  → Manage users

Step 8 — Bengali i18n (30 sec)
  → Toggle language to Bengali
  → Show translated UI
```

### Pre-Demo Checklist
- [ ] Laptop charged to 100% or plugged in
- [ ] Chrome open in incognito (no cached sessions)
- [ ] Test accounts seeded in production DB
- [ ] Backup video exported and ready to play
- [ ] Internet connection at venue tested
- [ ] Offline mode tested beforehand

---

## 3.14.3 Anticipated Viva Questions & Answers

### On Design & Architecture

**Q: Why add Redis? What does it solve?**
A: Redis handles three things: (1) OTP storage with TTL and rate limiting, (2) Socket.io adapter for broadcasting events across multiple server instances, (3) session cache. Without Redis, OTP rate limiting would require additional DB queries and Socket.io wouldn't scale horizontally.

**Q: Why use both IndexedDB and localforage?**
A: IndexedDB (via idb) is used specifically for the SOS queue because SOS submissions are critical — we need dedicated, highest-priority storage with minimal overhead. localforage handles distribution and household sync, which is less time-sensitive. Separate queues prevent one from blocking the other.

**Q: How does Socket.io handle real-time SOS broadcasting?**
A: When a victim submits an SOS, the server emits a `sos:new` event on the `/sos` namespace. Volunteers who have subscribed to this namespace (via `volunteer:subscribe` on login) receive the event with the SOS location and type. The Redis adapter ensures the event reaches all server instances.

**Q: Why phone/OTP instead of email/password?**
A: In rural Bangladesh, many victims don't have email but almost everyone has a basic phone. OTP eliminates the password management burden — no "forgot password" flow, no weak passwords. The OTP also serves as implicit phone verification for SOS location credibility.

### On System Modeling

**Q: Explain the difference between Level 0 and Level 1 DFD.**
A: Level 0 (context diagram) shows the entire system as a single process with all external entities (Victim, Volunteer, NGO, Donor, Admin, SMS Gateway, Payment Gateway). Level 1 decomposes that into 12 sub-processes (Auth, SOS, Mission, Campaign, Donation, Shelter, Inventory, Chat, Notification, Relief Distribution, Reporting, Admin Dashboard).

**Q: How did the ERD change from v1 to v2?**
A: v1 had 10 entities (User, Household, DistributionLog, ItemCategory, DuplicateAlert, SyncConflict, Feedback, Inventory, ReliefRequest, Jurisdiction). v2 adds 8 more: SOSRequest, Mission, Shelter, Campaign, Donation, ChatMessage, Notification, AuditLog, InventoryTransaction — for a total of 19 entities.

### On Security

**Q: How is OTP protected against brute force?**
A: Rate limiting at 3 requests per 10 min per phone (via Redis), max 5 verify attempts before the phone is blocked for 30 minutes. OTPs are hashed with bcrypt before storage, so even if Redis is compromised, OTPs can't be read.

**Q: What if a volunteer accepts a mission but doesn't complete it?**
A: The mission has a `status` field that moves through assigned → en_route → on_site → rescued. If a volunteer doesn't update status within a configurable window (admin-set, default 2 hours), an admin can reassign the mission. The audit trail shows all status changes.

### On Testing

**Q: How did you test Socket.io events?**
A: We used a Socket.io test client that connects to the server, subscribes to namespaces (`/sos`, `/mission`, `/admin`), and asserts that the correct events are emitted in response to API actions. This is automated in the integration test suite (TC-INT05).

### On Team (v2)

**Q: What was each member's contribution in v2?**

| Member | v1 Contribution | v2 Contribution |
|--------|----------------|-----------------|
| Kamrul | Backend API, DB, deployment, PM | Admin dashboard, architecture, Redis/Socket.io setup |
| Abidul | SRS, DFDs, UML, testing | SOS/Mission API, OTP auth, testing v2 modules |
| Sayeda | Wireframes, UI, report | SOS/Campaign UI, i18n design, dark mode v2 |
| Nahid | UI, demo video, slides | Chat UI, notification UI, presentation v2 |
| Nayeem | — | Campaigns & Donations API, Redux store, i18n |
| Rafi | — | Inventory/Shelter API, offline sync v2 |
| Mominul | — | Chat/Notification API, CI/CD, Socket.io setup |

---

## 3.14.4 Final Viva Readiness Checklist

### Documentation
- [ ] All 14 module files completed and reviewed (v2)
- [ ] Section 3.1 cross-checked against all subsequent sections
- [ ] References formatted in IEEE style throughout
- [ ] Hard copy printed and bound
- [ ] Soft copy ZIP + GitHub link prepared

### Prototype
- [ ] All 51 functional requirements implemented and tested
- [ ] Test results documented in Section 3.9
- [ ] GitHub repository has clean commit history
- [ ] Demo works on the venue computer/browser
- [ ] Backup demo video ready to play

### Presentation
- [ ] Slides reviewed by all team members
- [ ] Each member knows which slides they present
- [ ] Demo script rehearsed at least twice
- [ ] Q&A questions practiced with mock viva session

### Day-of Checklist
- [ ] Arrive 15 minutes early
- [ ] Test projector connection
- [ ] Open app in incognito / clear cache
- [ ] Confirm internet connection works
- [ ] Backup video on USB stick
- [ ] Signed individual contribution forms in hand

---

*End of Section 3.14 — All 14 modules complete.*
*Good luck, Team_Skipper.*
