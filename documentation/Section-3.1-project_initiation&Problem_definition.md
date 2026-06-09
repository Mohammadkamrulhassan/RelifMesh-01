# Section 3.1 — Project Initiation & Problem Definition
**Project:** RelifMesh — Disaster Relief Coordination System for Local Government
**Team:** Team_Skipper | Course: CSE-3208 System Analysis & Design Lab
**Last Updated:** 2026-06-09

---

## 3.1.1 Project Title & Tagline

**Title:** RelifMesh — Disaster Relief Coordination System for Local Government

**Tagline:**
> *"One mesh. No duplicates. No household left behind."*

---

## 3.1.2 Problem Statement

### Who Suffers
During flood and cyclone events in Bangladesh, three groups experience direct harm from poor coordination:
- **Affected households** — some receive aid multiple times while others receive nothing at all.
- **Union Parishad (UP) officials** — operate without real-time visibility into what other teams (NGOs, Upazila offices, military) are distributing in the same area.
- **District/Upazila administrators** — cannot verify ground-level distribution without physical field visits, making oversight nearly impossible.

### Current Pain Points

| # | Pain Point | Description |
|---|-----------|-------------|
| 1 | **Duplicate distribution** | Multiple agencies (NGOs, UP, DDM teams) distribute to the same household because there is no shared registry. |
| 2 | **Missed households** | Families in geographically isolated or politically overlooked areas are skipped entirely with no audit trail. |
| 3 | **No real-time tracking** | Relief logs are recorded on paper; consolidation happens days or weeks later, too late to correct errors. |
| 4 | **Inter-agency opacity** | NGOs and government teams prepare response plans independently with rarely a shared objective (Harvard HHI, 2025). |
| 5 | **Accountability gaps** | Political networks influence who receives aid; household-level allocation suffers from irregularities and missing records (Journal of Development Studies, 2025). |
| 6 | **Offline environments** | Flood-hit areas lose internet and power, making cloud-only systems unusable during the critical first 72 hours. |

### Evidence Base
- A 2023 study of Union Parishad flood relief in Chittagong found that inadequate coordination among local representatives significantly undermined relief efforts, and both officials and residents lacked adequate knowledge of relief distribution processes.
- Agencies responding to disasters in Bangladesh routinely prepare individual response plans with goals so diverse they rarely agree on common objectives, making coordination hugely challenging.
- Research on post-Cyclone Aila reconstruction found that household-level allocation suffered from considerable irregularities driven by political connections in the distribution process.
- Historically, following major floods (1998, 2004) and Cyclone Sidr (2007), multiple international observers reported "general lack of coordination among actors" and aid that arrived "too little, too late."

---

## 3.1.3 Background Study of the Problem Domain

### Bangladesh Disaster Profile
Bangladesh is among the world's most disaster-prone nations. Floods affect approximately one-third of the country annually, and the Bengal coast faces cyclones regularly. From 2019–2023 alone, five years of major floods caused around 537 deaths and widespread infrastructure damage.

### Institutional Framework
The **Department of Disaster Management (DDM)** under the Ministry of Disaster Management and Relief is the central coordinating authority. Below it, the hierarchy runs:
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
Despite this hierarchy, field research consistently shows that the institutional framework suffers from a lack of functioning partnerships at the operational level.

### Gap: Digital Coordination Tools
No standardized digital platform exists for UP-level officials to log relief distribution in real time, share data across NGO and government teams, and expose a public accountability dashboard. Paper-based systems remain the norm at the union level.

### Relevant Technology Context
- Smartphone penetration in Bangladesh has grown significantly, making mobile-first approaches viable even at union level.
- GPS tagging via smartphones is a proven low-cost method for geo-locating distribution events.
- Progressive Web App (PWA) and offline-first architectures (e.g., IndexedDB + custom sync) are mature, field-tested solutions for low-connectivity environments.

---

## 3.1.4 Project Vision & Mission

### Vision
A Bangladesh where no disaster-affected household is missed or double-served — where every relief item is tracked from warehouse to household with a photo, a GPS coordinate, and a timestamp, visible to any citizen on a public dashboard.

### Mission
To build a lightweight, offline-capable web application that enables Union Parishad officials, Upazila officers, and NGO workers to jointly register affected families, log item-level distributions, and prevent duplicate aid — while giving the public a transparent view of relief operations in their area.

---

## 3.1.5 Project Scope

### In-Scope
- Household registration module (name, NID, GPS, family size, vulnerability flags)
- Relief item distribution logging (item type, quantity, photo, GPS, timestamp, distributing officer ID)
- Duplicate detection engine (flag if household received same item category within defined period)
- Multi-role authentication: UP official, Upazila officer, NGO field worker, public viewer
- Offline-first data entry with background sync when connectivity is restored
- Sync conflict resolution (last-write-wins with audit log for manual review)
- Public-facing dashboard: what was distributed, where, by whom (aggregated, no PII)
- Authority hierarchy enforcement (Upazila can view/audit all UPs under their jurisdiction)
- Basic report export (PDF/CSV) for physical submission

### Out-of-Scope
- Financial transactions or cash transfer management
- Warehouse/inventory procurement management
- Predictive analytics or AI-based need forecasting
- Integration with national NID database (requires government API access not available to this project)
- Native Android/iOS apps (PWA covers mobile use)
- Real-time satellite/GIS mapping layers
- Multi-language UI beyond Bengali and English

---

## 3.1.6 SMART Objectives

| # | Objective | Specific | Measurable | Achievable | Relevant | Time-bound |
|---|-----------|----------|------------|------------|----------|------------|
| 1 | Build a household registration system with GPS and photo capture | Yes | ≥ 50 test households registered in prototype | Yes, using browser GPS API | Core feature | By Module 7 |
| 2 | Implement duplicate detection that flags same-category relief within 7 days | Yes | Accuracy ≥ 90% on test dataset | Yes, rule-based logic | Solves core problem | By Module 8 |
| 3 | Deliver offline-first data entry with auto-sync | Yes | Sync success rate ≥ 95% on reconnect in test | Yes, using IndexedDB + sync API | Critical for field use | By Module 9 |
| 4 | Provide a public dashboard showing distribution summary by union/item | Yes | Dashboard loads in ≤ 3 seconds on 3G | Yes, static aggregation | Transparency goal | By Module 10 |
| 5 | Support 4 distinct user roles with correct access control | Yes | All role-based access tests pass (0 unauthorized access) | Yes, standard auth design | Security requirement | By Module 8 |

---

## 3.1.7 Assumptions & Constraints

### Assumptions
- UP officials have access to at least one Android smartphone with a working camera and GPS.
- Network connectivity is available at least once per day at the union office for sync.
- The system will be deployed on a cloud server managed by the project team (no institutional IT support assumed).
- Data entered during the project prototype phase is synthetic/test data only — no real household PII.
- Upazila and NGO users have basic digital literacy (can log in, fill a form, take a photo).

### Constraints
- **Time:** 6-month academic semester; prototype must be demo-ready by defense date.
- **Team:** 4 members with mixed roles; no dedicated backend or DevOps specialist.
- **Budget:** Zero monetary budget; all tools must be free/open-source.
- **No NID API:** Cannot validate national IDs against the government database.
- **No real deployment:** System will not be deployed to a live union office; tested with simulated data.
- **Technology:** Must use technologies the team is already familiar with (to be specified in Module 5).

---

## 3.1.8 Risk Register

| # | Risk | Likelihood | Impact | Mitigation Plan |
|---|------|------------|--------|-----------------|
| R1 | Offline sync conflicts corrupt data | Medium | High | Implement conflict log with timestamp; default last-write-wins; manual review flag |
| R2 | Duplicate detection produces high false positives | Medium | Medium | Tune detection window and item-category grouping; allow officer override with reason |
| R3 | Team member unavailability (illness, exam pressure) | Medium | High | Document all work in shared repo from day one; no single-person knowledge silos |
| R4 | Scope creep (adding features not in scope) | High | Medium | Lock scope document after Module 3; any addition requires written team agreement |
| R5 | GPS accuracy insufficient in dense areas | Low | Low | Accept ±15m accuracy; supplement with manual area selection |
| R6 | Free-tier hosting limits (DB size, requests) | Low | Medium | Use lightweight DB; prototype only handles test data volume |
| R7 | Public dashboard exposes sensitive household data | Low | High | Aggregate all public data at union level; no individual household data on public view |
| R8 | Poor UI adoption by non-tech users | Medium | Medium | Design for low-literacy users; large buttons, Bengali labels, minimal text input |

---

## 3.1.9 Team Formation Document

| Role | Member | Primary Responsibilities |
|------|--------|-------------------------|
| Project Manager | MD. Kamrul Hassan | Timeline, meetings, supervisor communication, progress reports |
| System Analyst | Abidul Islam | SRS, DFDs, UML diagrams, problem domain research |
| UI/UX Designer | Sayeda Mofatteha Ahmed | Wireframes, prototypes, user flow, Figma mockups |
| UI/UX Designer | Iftekhar Alam Nahid | UI implementation, demo video, presentation slides |
| Developer (Lead) | MD. Kamrul Hassan | Backend, database, API, deployment |
| QA / Tester | Abidul Islam (primary) | Test cases, bug reports, acceptance testing |
| External QA | MD Mynoddin (Course Teacher) | Academic review, viva |
| External QA | Saifur Rahman (External) | Independent functionality testing |

**Supervisor:** MD Mynoddin, Assistant Professor, Rangamati Science and Technology University
**Team Name:** Team_Skipper
**Project Assigned:** Project 6 — RelifMesh

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
| Individual Contribution | **R** | **R** | **R** | **R** |
| Weekly Progress Reports | **R** | C | I | I |

**Key:** R = Responsible | A = Accountable (supervisor) | C = Consulted | I = Informed

---

## References (for this section)

1. Uddin, M. M. et al. (2021). Factors Affecting Disaster Coordination between Government and NGOs for Relief and Rehabilitation Activities in Bangladesh. *Indian Journal of Humanities and Social Sciences*, 2(10), 8–18.
2. Islam, M. et al. (2026, January). Disaster relief and rehabilitation at the local level in Bangladesh: assessing the practices of Union Parishads. *Journal of Disaster Science and Management*. Springer Nature. https://doi.org/10.1007/s44367-025-00027-x
3. Harvard Humanitarian Initiative. (2025). Development, Governance, and Disaster Nexus: Bangladesh Viewpoint. https://hhi.harvard.edu
4. Journal of Development Studies. (2025). Corruption in Cyclone Relief and Reconstruction: Evidence from a Public Fund Distribution in Bangladesh. Taylor & Francis.
5. IntechOpen. (2013). Disaster Management Discourse in Bangladesh: A Shift from Post-Event Response to the Preparedness and Mitigation Approach. https://www.intechopen.com/chapters/44219
6. UNDRR. (2025). Bridging national strategy and local action: Bangladesh's success in vertical DRR integration. https://www.undrr.org

---

*End of Section 3.1 — Next: Section 3.2 Stakeholder Analysis*