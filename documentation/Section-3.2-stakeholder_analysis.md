# Section 3.2 — Stakeholder Analysis
**Project:** ReliefMesh — Disaster Response & Relief Management System
**Team:** Team_Skipper | **Course:** CSE-3208 System Analysis & Design Lab
**Last Updated:** 2026-06-10

---

## 3.2.1 Stakeholder Identification

| # | Stakeholder | Type | Interaction with System |
|---|-------------|------|------------------------|
| S1 | Union Parishad (UP) Officials | Primary | Register households, log distributions, view local dashboard |
| S2 | Upazila Officers | Primary | Audit data, generate reports, manage accounts |
| S3 | NGO Field Workers | Primary | Log distributions, view duplicate alerts |
| S4 | Disaster Victims / Households | Primary | Submit SOS requests, request relief, view mission status |
| S5 | Volunteers / Rescue Teams | Primary | Find nearby SOS, accept missions, update rescue status |
| S6 | Donors | Primary | Browse campaigns, make donations, view receipts |
| S7 | General Public | Primary | View public transparency dashboard (read-only) |
| S8 | System Administrators | Primary | Manage users, view analytics, audit logs |
| S9 | District Disaster Management Committee | Secondary | Review aggregated district-level reports |
| S10 | Department of Disaster Management (DDM) | Secondary | Policy-level oversight; potential future integration |
| S11 | Course Teacher (MD Mynoddin) | External | Academic evaluator, QA reviewer |
| S12 | Team_Skipper (Development Team) | Internal | Design, build, test, and maintain the system |

---

## 3.2.2 Stakeholder Classification

### Primary Stakeholders (direct system users)
- **UP Officials** — core data entry role
- **Upazila Officers** — supervisory role
- **NGO Field Workers** — cross-agency coordination
- **Disaster Victims** — SOS requests, relief requests
- **Volunteers** — rescue mission acceptance
- **Donors** — campaign donations
- **General Public** — transparency dashboard
- **Admins** — system management

### Secondary Stakeholders (indirect benefit)
- **District Disaster Management Committee** — aggregated reports
- **DDM** — policy and compliance oversight

### External Stakeholders
- **Course Teacher** — evaluates documentation and prototype quality

### Internal Stakeholders
- **Team_Skipper** — responsible for all design, development, and documentation

---

## 3.2.3 Power-Interest Grid

```
HIGH POWER
  │
  │  District Committee    UP Officials
  │  DDM            Upazila Officers, Admins
  │
  │──────────────────────────────────────────────
  │
  │  Course Teacher      NGO Workers, Victims
  │               Volunteers, Donors
  │               General Public
LOW POWER
  └──────────────────────────────────────────────
     LOW INTEREST       HIGH INTEREST
```

| Quadrant | Strategy | Stakeholders |
|----------|----------|--------------|
| High Power, High Interest | **Manage Closely** | UP Officials, Upazila Officers, Admins |
| High Power, Low Interest | **Keep Satisfied** | District Committee, DDM, Course Teacher |
| Low Power, High Interest | **Keep Informed** | Victims, Volunteers, NGO Workers, Donors, Public |
| Low Power, Low Interest | **Monitor** | — |

---

## 3.2.4 User Personas

### Persona 1 — Rahim Uddin (UP Official)
| Attribute | Detail |
|-----------|--------|
| Age | 42 |
| Location | Char Fasson Union, Bhola District |
| Device | Android smartphone (basic) |
| Connectivity | 2G/3G intermittent |
| Goal | Register affected families, log distributions |
| Key Need | Offline data entry, Bengali UI, duplicate prevention |

### Persona 2 — Nasrin Akter (NGO Worker, BRAC)
| Attribute | Detail |
|-----------|--------|
| Age | 28 |
| Location | Mobile — across Sylhet |
| Device | Android tablet |
| Connectivity | Moderate with patchy zones |
| Goal | Log distributions without creating duplicates |
| Key Need | Duplicate alerts, cross-agency visibility |

### Persona 3 — Kamal Hossain (Upazila Officer)
| Attribute | Detail |
|-----------|--------|
| Age | 51 |
| Location | Upazila office, Sunamganj |
| Device | Desktop PC |
| Connectivity | Broadband |
| Goal | Verify all unions distributing correctly |
| Key Need | Dashboard, PDF export, audit trail |

### Persona 4 — Fatema Begum (Victim)
| Attribute | Detail |
|-----------|--------|
| Age | 34 |
| Location | Flood-affected village, Sylhet |
| Device | Basic smartphone |
| Connectivity | 2G, frequently offline |
| Goal | Send SOS when family is stranded, request relief |
| Key Need | Simple SOS form, works offline, GPS auto-capture |

### Persona 5 — Arif Hasan (Volunteer)
| Attribute | Detail |
|-----------|--------|
| Age | 24 |
| Location | Sunamganj town |
| Device | Smartphone with mobile data |
| Connectivity | 3G/4G |
| Goal | Find and accept nearby rescue missions |
| Key Need | Map view of active SOS, real-time mission updates |

### Persona 6 — Shahida Karim (Donor)
| Attribute | Detail |
|-----------|--------|
| Age | 38 |
| Location | Dhaka |
| Device | Smartphone |
| Connectivity | Stable |
| Goal | Donate to verified campaigns, see where money went |
| Key Need | bKash/Nagad payment, transparency ledger, receipts |

---

## 3.2.5 Stakeholder Requirements Summary

| Stakeholder | Core Requirements |
|-------------|-------------------|
| UP Official | Offline registration, duplicate alerts, Bengali UI |
| Upazila Officer | Audit trail, jurisdiction dashboard, export |
| NGO Worker | Cross-agency visibility, distribution logging |
| Victim | SOS with GPS, relief requests, offline mode |
| Volunteer | Nearby SOS map, mission acceptance, status updates |
| Donor | Campaigns, payment, receipts, transparency |
| General Public | Dashboard, map, no login required |
| Admin | User management, analytics, audit logs |

---

*End of Section 3.2 — Next: Section 3.3 Requirements Engineering (SRS)*
