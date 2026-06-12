# Section 3.12 — Project Management
**Project:** ReliefMesh — Disaster Response & Relief Management System
**Team:** Team_Skipper | **Course:** CSE-3208 System Analysis & Design Lab
**Last Updated:** 2026-06-10

---

## 3.12.1 Team Structure

| Role | Name | Responsibilities |
|------|------|------------------|
| **Project Lead** | Kamrul | Planning, architecture, admin dashboard |
| **Backend Lead** | Abid | Auth, SOS, Missions, Redis, Socket.io |
| **Frontend Lead** | Nayeem | Campaigns, Donations, i18n, Redux |
| **DB & Testing** | Rafi | Inventory, Shelters, offline sync, testing |
| **UI/UX & Docs** | Fahim | UI design, documentation, reports |
| **DevOps & QA** | Mominul | Chat, Notifications, CI/CD, deployment |

---

## 3.12.2 Communication Channels

| Channel | Purpose | Frequency |
|---------|---------|-----------|
| WhatsApp Group | Daily updates, quick questions | Daily |
| GitHub Issues | Bug tracking, feature requests | As needed |
| Weekly Sync (Google Meet) | Progress review, blockers | Weekly (Sat 8 PM) |
| Shared Google Drive | Design docs, meeting minutes | Ongoing |

---

## 3.12.3 Meeting Minutes

### Meeting 1 — Kickoff (2026-05-20)
**Attendees:** Kamrul, Abid, Nayeem, Rafi, Fahim, Mominul
**Agenda:**
- Project scope confirmation
- v1 codebase review
- newly-think redesign discussion
- Team role assignment
**Decisions:**
- Adopt newly-think v2 redesign as the target
- Documentation-first approach (all docs updated before code)
- Branch naming: `RelifMesh-[increment]-[member_name]`
**Action Items:**
- [x] Each member reviews newly-think/docs
- [x] Kamrul sets up GitHub repo and branch protection
- [x] Abid documents tech stack gaps (v1 → v2)

### Meeting 2 — Requirements Finalization (2026-05-27)
**Attendees:** Kamrul, Abid, Nayeem, Rafi, Fahim, Mominul
**Agenda:**
- Finalize SRS functional requirements
- Review stakeholder analysis
- Approve ERD and Class Diagram
**Decisions:**
- 51 functional requirements approved (16 v1 + 35 v2)
- 7 roles approved
- MongoDB with Redis approved as data layer
**Action Items:**
- [x] Fahim updates stakeholder personas
- [x] Nayeem documents all use cases
- [ ] All members: finalize individual contribution reports

### Meeting 3 — Architecture & UI Design (2026-06-03)
**Attendees:** Kamrul, Abid, Nayeem, Rafi, Fahim, Mominul
**Agenda:**
- Review system architecture (REST + WebSocket + Redis)
- Approve UI mockups (SOS, Mission, Dashboard, Campaign)
- Confirm offline strategy
**Decisions:**
- Socket.io for real-time, Redis adapter for scaling
- IndexedDB for SOS queue, localforage for distribution sync
- Leaflet.js for maps (free tier, offline tiles)
- Bottom tab mobile navigation approved
**Action Items:**
- [x] Abid writes API specs for SOS and Mission modules
- [ ] Rafi sets up Docker Compose for dev environment

### Meeting 4 — Sprint Planning (2026-06-10)
**Attendees:** Kamrul, Abid, Nayeem, Rafi, Fahim, Mominul
**Agenda:**
- Review Phase 1 tasks
- Assign coding responsibilities
- Set milestones
**Decisions:**
- Phase 1 (Foundation) starts immediately
- Target: Phase 1 complete by 2026-06-17
- Code in `dev` branch, merge to `main` after review
**Action Items:**
- [ ] All: Start Phase 1 tasks (scaffolding, auth, models)
- [ ] Mominul: Set up GitHub Actions CI pipeline
- [ ] Kamrul: Create project board on GitHub Projects

---

## 3.12.4 Milestones

| Milestone | Target Date | Deliverable |
|-----------|-------------|-------------|
| ✅ Documentation Complete | 2026-06-10 | All docs updated with v2 redesign |
| 🔄 Phase 1: Foundation | 2026-06-17 | Scaffolding, Auth, DB, i18n |
| ⬜ Phase 2: SOS & Rescue | 2026-06-24 | SOS + Mission + Map real-time |
| ⬜ Phase 3: Relief Distribution | 2026-07-01 | Household, Requests, Distribution |
| ⬜ Phase 4: Campaigns & Donations | 2026-07-08 | Campaign + Donation + Payment |
| ⬜ Phase 5: Inventory & Shelters | 2026-07-15 | Inventory + Shelter Management |
| ⬜ Phase 6: Real-Time Comms | 2026-07-22 | Chat + Notifications + Live Tracking |
| ⬜ Phase 7: Admin Center | 2026-07-29 | Dashboard, Users, Audit, Reports |
| ⬜ Phase 8: Testing & Polish | 2026-08-05 | i18n, QA, CI/CD, Deploy |

---

## 3.12.5 Tools & Workflow

| Tool | Purpose |
|------|---------|
| GitHub | Version control, Issues, Projects |
| GitHub Actions | CI/CD |
| Docker Compose | Dev environment |
| Google Meet | Weekly sync |
| WhatsApp | Daily communication |
| Google Drive | Document sharing |
| Figma | UI mockups (optional) |

---

*End of Section 3.12*
