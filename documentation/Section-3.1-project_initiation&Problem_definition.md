# Section 3.1 — Project Initiation & Problem Definition
**Project:** ReliefMesh — Disaster Response & Relief Management System
**Team:** Team_Skipper | Course: CSE-3208 System Analysis & Design Lab
**Last Updated:** 2026-06-10

---

## 3.1.1 Project Title & Tagline

**Title:** ReliefMesh — Disaster Response & Relief Management System

**Tagline:**
> *"One mesh. No duplicates. No household left behind."*

---

## 3.1.2 Problem Statement

### Who Suffers
During flood and cyclone events in Bangladesh, five groups experience direct harm from poor coordination:
- **Affected households/victims** — some receive aid multiple times while others receive nothing; no channel to request emergency help
- **Union Parishad (UP) officials** — operate without real-time visibility into what other teams (NGOs, Upazila offices, military) are distributing
- **Volunteers/rescuers** — no centralized way to find and accept rescue missions
- **NGOs and donors** — cannot track where donations go or verify relief distribution
- **District/Upazila administrators** — cannot verify ground-level distribution without physical field visits

### Current Pain Points

| # | Pain Point | Description |
|---|-----------|-------------|
| 1 | **Duplicate distribution** | Multiple agencies distribute to same household with no shared registry |
| 2 | **Missed households** | Families in isolated areas skipped entirely |
| 3 | **No real-time tracking** | Paper-based logs; consolidation happens days later |
| 4 | **Inter-agency opacity** | NGOs and government teams plan independently |
| 5 | **Accountability gaps** | Political networks influence aid; missing records |
| 6 | **Offline environments** | Flood-hit areas lose internet during critical first 72 hours |
| 7 | **No emergency SOS** | Victims cannot send GPS-tagged distress signals |
| 8 | **No donation transparency** | Donors cannot see where their money went |

### Evidence Base
- A 2023 study of Union Parishad flood relief in Chittagong found that inadequate coordination among local representatives significantly undermined relief efforts.
- Agencies responding to disasters in Bangladesh routinely prepare individual response plans with diverse goals, making coordination challenging.
- Research on post-Cyclone Aila reconstruction found household-level allocation suffered from irregularities driven by political connections.
- Following major floods (1998, 2004) and Cyclone Sidr (2007), multiple international observers reported "general lack of coordination among actors."

---

## 3.1.3 Background Study of the Problem Domain

### Bangladesh Disaster Profile
Bangladesh is among the world's most disaster-prone nations. Floods affect approximately one-third of the country annually, and the Bengal coast faces cyclones regularly. From 2019–2023 alone, five years of major floods caused around 537 deaths and widespread infrastructure damage.

### Institutional Framework
The **Department of Disaster Management (DDM)** under the Ministry of Disaster Management and Relief is the central coordinating authority:
```
Ministry of Disaster Management & Relief
    |
Department of Disaster Management (DDM) — National
    |
District Disaster Management Committee
    |
Upazila Disaster Management Committee
    |
Union Parishad (UP) — Local Ground Level
    |
Ward/Village Level
```

### Gap: Digital Coordination Tools
No standardized digital platform exists for UP-level officials to log relief distribution, coordinate SOS rescues, track donations, and expose a public accountability dashboard.

### Relevant Technology Context
- Smartphone penetration in Bangladesh has grown significantly, making mobile-first approaches viable.
- GPS tagging via smartphones is a proven low-cost method for geo-locating events.
- PWA and offline-first architectures are mature for low-connectivity environments.
- Phone-based OTP authentication is widely understood by Bangladeshi users.
- Mobile financial services (bKash/Nagad/Rocket) are deeply integrated into daily life.

---

## 3.1.4 Project Vision & Mission

### Vision
A Bangladesh where no disaster-affected household is missed or double-served — where every relief item is tracked from warehouse to household, every SOS is answered by a nearby volunteer, and every donation is transparent to the public.

### Mission
To build an offline-capable, multi-role platform that enables victims to request help, volunteers to coordinate rescues, NGOs and government to distribute relief transparently, and donors to track their impact — all through a single integrated system.

---

## 3.1.5 Project Scope

### In-Scope (v1 — Completed)
- Household registration module (name, NID, GPS, family size, vulnerability flags)
- Relief item distribution logging (item type, quantity, photo, GPS, timestamp)
- Duplicate detection engine (flag same household + same item within 7 days)
- Multi-role authentication: UP official, Upazila officer, NGO worker, Citizen
- Offline-first data entry with background sync
- Sync conflict resolution (last-write-wins with audit log)
- Public dashboard: distribution summary by union
- Authority hierarchy enforcement (Upazila can audit all UPs under jurisdiction)
- Report export (PDF/CSV)
- Feedback submission and management
- Inventory/stock tracking
- Relief requests with approval workflow
- User profile management

### In-Scope (v2 — Planned)
- Phone/OTP authentication with JWT refresh tokens
- SOS emergency requests with GPS, type, priority, auto-expiry
- Rescue mission coordination with real-time lifecycle tracking
- Volunteer acceptance and mission management
- Fundraising campaigns and crowdfunding
- Donation processing (bKash/Nagad/Rocket sandbox)
- Shelter management with capacity tracking
- Mission-scoped real-time chat
- In-app notifications via Socket.io
- Admin command center with heatmaps and analytics
- English/Bengali bilingual UI
- PWA enhancements (Service Worker, install prompt, offline SOS queue)
- Redis caching for session management and rate limiting
- Audit log for all admin actions
- Background cron jobs (auto-expire SOS, inventory alerts, backups)

### Out-of-Scope
- Native Android/iOS apps (PWA covers mobile use)
- AI-based need forecasting
- Integration with national NID database
- Real-time satellite/GIS mapping layers
- Full SMS gateway integration (deferred)

---

## 3.1.6 SMART Objectives

| # | Objective | Specific | Measurable | Achievable | Relevant | Time-bound |
|---|-----------|----------|------------|------------|----------|------------|
| 1 | Build household registration with GPS and photo | Yes | ≥ 50 test households | Yes | Core feature | v1 Complete |
| 2 | Implement duplicate detection (7-day window) | Yes | Accuracy ≥ 90% | Yes | Core problem | v1 Complete |
| 3 | Deliver offline-first data entry with auto-sync | Yes | Sync success ≥ 95% | Yes | Field use | v1 Complete |
| 4 | Provide public dashboard with distribution summary | Yes | Loads in ≤ 3s on 3G | Yes | Transparency | v1 Complete |
| 5 | Implement Phone/OTP auth with refresh tokens | Yes | Login in ≤ 5 seconds | Yes | Accessibility | v2 Phase 1 |
| 6 | Enable SOS + rescue mission real-time tracking | Yes | SOS broadcast in < 1s | Yes | Emergency | v2 Phase 2-3 |
| 7 | Integrate donation processing with payment gateways | Yes | Sandbox transactions work | Yes | Funding | v2 Phase 5 |
| 8 | Deliver Bengali/English bilingual UI | Yes | All strings translated | Yes | Usability | v2 Phase 7 |

---

## 3.1.7 Assumptions & Constraints

### Assumptions
- UP officials have access to at least one Android smartphone with camera and GPS.
- Network connectivity available at least once daily at union office.
- Volunteers have smartphones with GPS for mission acceptance.
- Donors have bKash/Nagad/Rocket accounts for transactions.
- Users are familiar with phone-based OTP authentication.

### Constraints
- **Time:** Academic semester; prototype demo-ready by defense date.
- **Team:** 4 members with mixed roles.
- **Budget:** Zero monetary budget; all tools must be free/open-source.
- **No NID API:** Cannot validate national IDs against government database.
- **No real deployment:** System tested with simulated data.
- **Payment sandbox:** bKash/Nagad/Rocket integration limited to sandbox mode.

---

## 3.1.8 Risk Register

| # | Risk | Likelihood | Impact | Mitigation Plan |
|---|------|------------|--------|-----------------|
| R1 | Offline sync conflicts corrupt data | Medium | High | Last-write-wins with conflict log; manual review flag |
| R2 | Duplicate detection false positives | Medium | Medium | Tune detection window; allow override with reason |
| R3 | Team member unavailability | Medium | High | Shared repo; no single-person knowledge silos |
| R4 | Scope creep | High | Medium | Lock scope; changes require written team agreement |
| R5 | GPS accuracy insufficient | Low | Low | Accept ±15m; supplement with area selection |
| R6 | Payment sandbox API changes | Low | Medium | Abstract payment layer; mock fallback |
| R7 | Public dashboard leaks PII | Low | High | Aggregate at union level; no individual data |
| R8 | Real-time WebSocket connection drops | Medium | Medium | Auto-reconnect with exponential backoff |

---

## 3.1.9 Team Formation Document

| Role | Member | Primary Responsibilities |
|------|--------|-------------------------|
| Project Manager | MD. Kamrul Hassan | Timeline, meetings, supervisor communication, progress reports |
| System Analyst | Abidul Islam | SRS, DFDs, UML diagrams, problem domain research |
| UI/UX Designer | Sayeda Mofatteha Ahmed | Wireframes, prototypes, user flow, Figma mockups |
| UI/UX Designer | Iftekhar Alam Nahid | UI implementation, demo video, presentation slides |
| Developer (Lead) | MD. Kamrul Hassan | Backend, database, API, WebSocket, deployment |
| QA / Tester | Abidul Islam (primary) | Test cases, bug reports, acceptance testing |

**Supervisor:** MD Mynoddin, Assistant Professor, Rangamati Science and Technology University
**Team Name:** Team_Skipper
**Project Assigned:** Project 6 — ReliefMesh

---

## 3.1.10 Team Responsibility Matrix (RACI Chart)

| Deliverable | Kamrul (PM/Dev) | Abidul (Analyst/QA) | Sayeda (UX) | Nahid (UX/Media) |
|-------------|:---------------:|:-------------------:|:-----------:|:----------------:|
| SRS Document | C | **R** | C | I |
| DFD / UML / ERD | C | **R** | I | I |
| Wireframes & Mockups | I | C | **R** | C |
| Frontend Implementation | C | I | **R** | C |
| Backend / Database | **R** | C | I | I |
| Test Plan & Test Cases | C | **R** | I | I |
| Hard Copy Report | I | I | **R** | C |
| Soft Copy / GitHub | **R** | C | I | I |
| Demo Video | I | I | C | **R** |
| Presentation Slides | C | **R** | C | I |
| v2 Upgrade (Auth/SOS/Donations) | **R** | C | I | I |
| Individual Contribution | **R** | **R** | **R** | **R** |

**Key:** R = Responsible | A = Accountable (supervisor) | C = Consulted | I = Informed

---

*End of Section 3.1 — Next: Section 3.2 Stakeholder Analysis*
