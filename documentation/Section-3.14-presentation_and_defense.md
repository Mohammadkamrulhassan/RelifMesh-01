# Section 3.14 — Presentation & Defense
**Project:** RelifMesh — Disaster Relief Coordination System for Local Government
**Team:** Team_Skipper | **Course:** CSE-3208 System Analysis & Design Lab
**Last Updated:** 2026-06-09
**Presentation Lead:** Iftekhar Alam Nahid | **Slides:** Abidul Islam

---

## 3.14.1 Presentation Slide Structure

Total slides: ~18–22 | Duration: 15–20 minutes | Format: PowerPoint / Google Slides

| Slide # | Title | Content | Presenter |
|---------|-------|---------|-----------|
| 1 | Title Slide | RelifMesh, team names, course, date | All |
| 2 | The Problem | Bangladesh flood/cyclone context, pain points (duplicate aid, missed households) | Abidul |
| 3 | Evidence | Key stats + research backing (citations from Sec 3.1) | Abidul |
| 4 | Our Solution | One-paragraph pitch + key differentiators | Kamrul |
| 5 | System Overview | Architecture diagram (client → API → DB) | Kamrul |
| 6 | Key Features | 4 feature cards: registration, distribution log, duplicate detection, public dashboard | Sayeda |
| 7 | User Roles | 4 roles diagram with permissions summary | Sayeda |
| 8 | System Modeling | DFD Level 1 + Use Case diagram | Abidul |
| 9 | Database Design | ERD overview (simplified) | Abidul |
| 10 | Offline-First Design | IndexedDB → Sync API → MongoDB diagram | Kamrul |
| 11 | Security Design | RBAC table + threat model summary | Kamrul |
| 12 | UI Walkthrough | Screenshots of key screens (wireframes or actual) | Sayeda / Nahid |
| 13 | LIVE DEMO | Working prototype demonstration | Kamrul (driver) |
| 14 | Testing Results | Test case summary table, UAT results | Abidul |
| 15 | Challenges Faced | Top 3 technical/team challenges and how we solved them | All |
| 16 | Impact | What changes if RelifMesh is deployed for real | All |
| 17 | Future Roadmap | Top 5 post-semester features (NID API, SMS, etc.) | Nahid |
| 18 | Individual Contributions | RACI summary, who did what | All |
| 19 | Q&A Slide | "Thank you. Questions?" | All |

---

## 3.14.2 Live Demo Script

**Demo Duration:** 5–7 minutes
**Driver:** Kamrul Hassan (laptop connected to projector)
**Backup:** Recorded video at `/Submission/demo_video/` (if live demo fails)

### Demo Flow

```
Step 1 — Show Public Dashboard (1 min)
  → Open https://relifmesh.netlify.app (no login)
  → Show map with union markers
  → Show distribution summary cards
  → Click on one union to show item breakdown

Step 2 — Login as UP Official (30 sec)
  → Login with test credentials (prepared beforehand)
  → Show home dashboard with stats

Step 3 — Register a Household (1.5 min)
  → Tap "New Household"
  → Fill form: name, NID (use test NID), family size
  → Check vulnerability flags
  → Take photo (or use pre-captured test photo)
  → Save → show HH-ID generated
  → Switch to OFFLINE mode (Chrome DevTools → Network → Offline)
  → Register one more household → shows "queued offline"

Step 4 — Log a Distribution (1.5 min)
  → Tap "Log Distribution"
  → Search for previously registered household
  → Select Rice (Food), 10 kg
  → Take photo → Submit
  → Re-enable network → show sync happening
  → Check public dashboard updated

Step 5 — Trigger Duplicate Alert (1 min)
  → Log Rice again for the same household
  → System shows duplicate warning with prior distribution details
  → Demo: cancel → then override with reason

Step 6 — Upazila Officer View (1 min)
  → Logout → Login as Upazila Officer
  → Show all unions in jurisdiction
  → Export PDF report → open downloaded PDF

Step 7 — Bonus: New Features (1.5 min)
  → [Feedback] Open /feedback, submit a test message without login
  → [Feedback Manage] Login as Upazila Officer, view feedback list, respond
  → [Inventory] View inventory stock levels, create a new inventory entry
  → [Profile] Update profile name/organization
  → [Pagination] Show paginated household list with search filtering
  → [Enhanced Dashboard] Show new stat cards (Feedbacks, Pending Sync, Alerts)
```

### Pre-Demo Checklist
- [ ] Laptop charged to 100% or plugged in
- [ ] Chrome open in incognito (no cached sessions)
- [ ] Test accounts seeded in production DB
- [ ] Test photos pre-loaded on device
- [ ] Backup video exported and ready to play
- [ ] Offline mode tested beforehand on demo device
- [ ] Internet connection at venue tested

---

## 3.14.3 Anticipated Viva Questions & Answers

### On Problem & Design

**Q: Why not just use WhatsApp groups for coordination?**
A: WhatsApp has no structured data entry, no duplicate detection, no GPS logging, no searchable household registry, and no public transparency layer. It is a messaging tool, not a coordination system. Our system creates an auditable, queryable record.

**Q: How does offline sync handle conflicts if two officers register the same NID household separately offline?**
A: Each device stores records in IndexedDB (via localforage). When they reconnect, the sync API pushes queued records to the server. If both devices recorded the same NID, the unique index on the `nid` field in MongoDB catches the duplicate on the second push, and the system flags both versions in the `sync_conflicts` collection for manual review.

**Q: Why IndexedDB + custom sync instead of PouchDB + CouchDB?**
A: IndexedDB (via localforage) provides a lightweight offline store with a simple key-value API. Instead of maintaining a separate CouchDB server just for sync, we use a single MongoDB database with custom `POST /sync/push` and `GET /sync/pull` endpoints. This eliminates the operational complexity of running two databases while still supporting offline-first functionality.

**Q: Why MongoDB instead of a relational database?**
A: MongoDB offers a flexible schema that suits the semi-structured nature of relief data (GPS coordinates, photos, variable vulnerability flags). Its document model maps directly to our JavaScript objects, and Mongoose provides schema validation. MongoDB Atlas free tier also gives us a zero-cost deployment option with automatic backups.

### On System Modeling

**Q: Explain the difference between Level 0 and Level 1 DFD.**
A: Level 0 (context diagram) shows the entire system as a single process with all external entities. Level 1 decomposes that single process into major sub-processes (authentication, household registration, distribution logging, duplicate detection, reporting) and shows the data stores they interact with.

**Q: Why is DistributionLog immutable?**
A: To maintain a tamper-proof audit trail. If a log can be edited, an officer could alter records to cover up duplicate distributions. Corrections are handled as new entries with an amendment flag, preserving the original entry.

### On Security

**Q: What if a UP Official tries to access another union's data?**
A: JWT contains `jurisdiction_id`. Every protected API endpoint validates that the requested resource's `jurisdiction_id` matches or descends from the user's `jurisdiction_id`. A mismatch returns 403 Forbidden.

**Q: How do you protect household NID numbers?**
A: NIDs are stored in the `households` table, accessible only to authenticated users in the same jurisdiction. They never appear in public API responses. The public dashboard only exposes aggregated counts at union level — no individual records.

### On Testing

**Q: How did you verify the duplicate detection is accurate?**
A: TC-12 to TC-16 in Section 3.9 cover the boundary conditions — same item within 7 days (should alert), same item after 8 days (should not alert), different item category (should not alert). We also ran UAT-02 as a simulated field scenario.

### On Team

**Q: What was each member's main contribution?**

| Member | Primary Contribution |
|--------|---------------------|
| Kamrul | Backend API, database design, deployment, project management |
| Abidul | SRS, DFDs, UML, testing plan, system analysis, presentation |
| Sayeda | Wireframes, mockups, UI implementation, hard copy report |
| Nahid | UI implementation, demo video, public dashboard, presentation slides |

---

## 3.14.4 Individual Contribution Summary

*(Each member signs their own statement — collect in `/Submission/individual_contributions/`)*

### Template
```
INDIVIDUAL CONTRIBUTION STATEMENT
Project: RelifMesh — Disaster Relief Coordination System for Local Government
Team: Team_Skipper | Course: CSE-3208

Name: [Full Name]
Student ID: [ID]
Role: [Role]

I confirm that I have contributed to the following tasks:
1. [Task / module / feature]
2. [Task / module / feature]
3. [Task / module / feature]

Approximate contribution to overall project: [X]%

I declare that all my contributions are original and that I have not
plagiarized any content or code from other sources without proper citation.

Signature: _______________________  Date: ___________
```

---

## 3.14.5 Final Viva Readiness Checklist

### Documentation
- [ ] All 14 module files completed and reviewed
- [ ] Section 3.1 cross-checked against all subsequent sections for consistency
- [ ] References formatted in IEEE style throughout
- [ ] Hard copy printed and bound (Sayeda)
- [ ] Soft copy ZIP + GitHub link prepared (Kamrul)

### Prototype
- [ ] All Must-Have features from SRS implemented and tested
- [ ] Test results documented in Section 3.9
- [ ] GitHub repository has clean commit history (no bulk uploads)
- [ ] Demo works on the venue computer/browser (tested in advance)
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
*Good luck, Team_Skipper. Build something you are proud of.*
