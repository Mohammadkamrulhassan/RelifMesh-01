# Section 3.2 — Stakeholder Analysis
**Project:** RelifMesh — Disaster Relief Coordination System for Local Government
**Team:** Team_Skipper | **Course:** CSE-3208 System Analysis & Design Lab
**Last Updated:** 2026-05-27

---

## 3.2.1 Stakeholder Identification

A stakeholder is any individual, group, or organization that affects or is affected by the RelifMesh system.

| # | Stakeholder | Type | Interaction with System |
|---|-------------|------|------------------------|
| S1 | Union Parishad (UP) Officials | Primary | Register households, log distributions, view local dashboard |
| S2 | Upazila Officers | Primary | Audit UP-level data, generate reports, manage UP accounts |
| S3 | NGO Field Workers | Primary | Log distributions independently, view duplicate alerts |
| S4 | General Public | Primary | View public dashboard (read-only, no login) |
| S5 | District Disaster Management Committee | Secondary | Review aggregated district-level reports |
| S6 | Department of Disaster Management (DDM) | Secondary | Policy-level oversight; potential future integration |
| S7 | Course Teacher (MD Mynoddin) | External | Academic evaluator, QA reviewer |
| S8 | External QA (Saifur Rahman) | External | Independent functionality testing |
| S9 | Team_Skipper (Development Team) | Internal | Design, build, test, and maintain the system |
| S10 | Affected Households / Disaster Victims | Indirect | Data subjects; benefit from fair distribution |

---

## 3.2.2 Stakeholder Classification

### Primary Stakeholders (direct system users)
These stakeholders interact with the system directly through the UI.

- **UP Officials** — most frequent users; core data entry role
- **Upazila Officers** — supervisory role; audit and reporting
- **NGO Field Workers** — parallel data entry; cross-agency coordination
- **General Public** — read-only transparency dashboard consumers

### Secondary Stakeholders (indirect benefit)
These stakeholders receive outputs or are affected by decisions but do not use the system directly.

- **District Disaster Management Committee** — consume aggregated reports
- **Department of Disaster Management (DDM)** — policy and compliance oversight

### External Stakeholders (project context)
- **Course Teacher** — evaluates documentation and prototype quality
- **External QA Tester** — validates system functionality independently

### Internal Stakeholders
- **Team_Skipper** — responsible for all design, development, and documentation

---

## 3.2.3 Power-Interest Grid (Stakeholder Matrix)

```
HIGH POWER
    │
    │   District Committee        UP Officials
    │   DDM                       Upazila Officers
    │
    │──────────────────────────────────────────────
    │
    │   Course Teacher            NGO Field Workers
    │   External QA               General Public
    │                             Affected Households
LOW POWER
    └──────────────────────────────────────────────
         LOW INTEREST              HIGH INTEREST
```

| Quadrant | Strategy | Stakeholders |
|----------|----------|--------------|
| High Power, High Interest | **Manage Closely** — involve in all decisions | UP Officials, Upazila Officers |
| High Power, Low Interest | **Keep Satisfied** — provide regular updates | District Committee, DDM, Course Teacher |
| Low Power, High Interest | **Keep Informed** — regular communication | NGO Workers, General Public, Households |
| Low Power, Low Interest | **Monitor** — minimal engagement | External QA |

---

## 3.2.4 User Personas

### Persona 1 — Rahim Uddin (UP Official)
| Attribute | Detail |
|-----------|--------|
| Age | 42 |
| Location | Char Fasson Union, Bhola District |
| Device | Android smartphone (basic), occasional laptop |
| Connectivity | 2G/3G intermittent; no internet during active flooding |
| Digital Literacy | Moderate — uses mobile banking, Facebook |
| Goal | Register all affected families quickly and log what was distributed |
| Frustration | Paper forms get wet; no way to know if NGO already visited the same household |
| Key Need | Offline data entry, simple Bengali-labeled form, photo capture |

---

### Persona 2 — Nasrin Akter (NGO Field Worker, BRAC)
| Attribute | Detail |
|-----------|--------|
| Age | 28 |
| Location | Mobile — deployed across multiple unions in Sylhet |
| Device | Android tablet provided by organization |
| Connectivity | Moderate — has mobile data, but patchy in flood zones |
| Digital Literacy | High — uses organization apps regularly |
| Goal | Log distributions without creating duplicates with UP teams |
| Frustration | No coordination channel with government teams; finds out about duplicates days later |
| Key Need | Duplicate alert before distribution, cross-agency visibility |

---

### Persona 3 — Kamal Hossain (Upazila Officer)
| Attribute | Detail |
|-----------|--------|
| Age | 51 |
| Location | Upazila office, Sunamganj |
| Device | Desktop PC at office |
| Connectivity | Stable broadband at office |
| Digital Literacy | Moderate — email, government portal user |
| Goal | Verify that all unions under his jurisdiction are distributing correctly |
| Frustration | Has to physically visit each union to verify; paper reports arrive late |
| Key Need | Dashboard showing all UP activity under his Upazila, export to PDF |

---

### Persona 4 — Fatema Begum (General Public / Journalist)
| Attribute | Detail |
|-----------|--------|
| Age | 34 |
| Location | Dhaka (covering Sylhet relief operations remotely) |
| Device | Laptop, smartphone |
| Connectivity | Stable |
| Digital Literacy | High |
| Goal | Verify that relief is reaching flood-affected areas |
| Frustration | No public source of actual distribution data; only press releases |
| Key Need | Public dashboard with map and item-level summary by union |

---

## 3.2.5 Stakeholder Requirements Summary

| Stakeholder | Core Requirements |
|-------------|-------------------|
| UP Official | Offline household registration, photo+GPS distribution log, Bengali UI, simple form |
| Upazila Officer | Audit trail for all UPs, jurisdiction-filtered dashboard, PDF export |
| NGO Worker | Cross-agency duplicate alert, own distribution log, account per organization |
| General Public | Public dashboard (no login), union-level distribution summary, map view |
| District Committee | Aggregated district report, no household PII visible |
| DDM | Potential data export / API endpoint (future scope) |
| Course Teacher | Complete SAD documentation, working prototype, clean code repository |
| Affected Households | Fair, unduplicated distribution; indirect beneficiaries |

---

*End of Section 3.2 — Next: Section 3.3 Requirements Engineering (SRS)*
