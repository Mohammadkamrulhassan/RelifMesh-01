# Section 3.3 — Requirements Engineering (SRS)
**Project:** ReliefMesh — Disaster Response & Relief Management System
**Team:** Team_Skipper | **Course:** CSE-3208 System Analysis & Design Lab
**Last Updated:** 2026-06-10

---

## 3.3.1 Functional Requirements

### Authentication & User Management
| ID | Requirement | Phase |
|----|-------------|-------|
| FR-01 | The system shall allow user registration via phone number and OTP verification. | v1 |
| FR-02 | The system shall authenticate users via phone + OTP (passwordless). | v1 |
| FR-03 | The system shall support 7 roles: Victim, Volunteer, NGO, Govt, Donor, Admin, Super Admin. | v2 |
| FR-04 | The system shall restrict data access based on user role and jurisdiction. | v1 |
| FR-05 | The system shall implement JWT access + refresh token rotation with Redis storage. | v2 |
| FR-06 | Admin shall be able to create, suspend, and manage user accounts. | v1 |

### Household Registration
| ID | Requirement | Phase |
|----|-------------|-------|
| FR-07 | UP Officials shall register households with head name, NID, GPS, family size, vulnerability flags. | v1 |
| FR-08 | The system shall capture a photo of the household location during registration. | v1 |
| FR-09 | Household registration shall work offline and sync when connectivity is restored. | v1 |
| FR-10 | The system shall allow searching and editing existing household records. | v1 |

### Relief Distribution Logging
| ID | Requirement | Phase |
|----|-------------|-------|
| FR-11 | Authorized users shall log distribution events: HH-ID, item type, quantity, unit, officer, GPS, timestamp, photo. | v1 |
| FR-12 | Distribution logging shall work offline and sync on reconnection. | v1 |
| FR-13 | Distribution logs shall include proof photos and beneficiary signatures. | v2 |

### Duplicate Detection
| ID | Requirement | Phase |
|----|-------------|-------|
| FR-14 | Before logging, the system shall check same household + same item within 7 days. | v1 |
| FR-15 | If duplicate detected, the system shall show warning with prior distribution details. | v1 |
| FR-16 | Officer may override with mandatory reason; all overrides logged. | v1 |

### SOS Emergency Requests
| ID | Requirement | Phase |
|----|-------------|-------|
| FR-17 | Victims shall create SOS requests with GPS coordinates and type (rescue/food/water/medical/shelter). | v2 |
| FR-18 | SOS shall display on an interactive map for nearby volunteers. | v2 |
| FR-19 | SOS shall work offline via IndexedDB queue and sync when online. | v2 |
| FR-20 | SOS shall auto-expire after configurable timeout (TTL index). | v2 |
| FR-21 | Low-bandwidth text-only SOS mode shall be available. | v2 |

### Rescue Mission Coordination
| ID | Requirement | Phase |
|----|-------------|-------|
| FR-22 | Volunteers shall view nearby active SOS on a map. | v2 |
| FR-23 | Volunteers shall accept SOS as a rescue mission. | v2 |
| FR-24 | Mission lifecycle: Assigned → En Route → On Site → Rescued → Completed. | v2 |
| FR-25 | Victim shall receive real-time notification on mission status change. | v2 |
| FR-26 | Admin shall be able to reassign missions. | v2 |

### Campaigns & Donations
| ID | Requirement | Phase |
|----|-------------|-------|
| FR-27 | NGOs/Govt shall create fundraising campaigns with goal amount and end date. | v2 |
| FR-28 | Donors shall browse active campaigns and donate via bKash/Nagad/Rocket. | v2 |
| FR-29 | Donors shall receive digital receipts. | v2 |
| FR-30 | Admin shall verify and approve campaigns. | v2 |

### Shelter Management
| ID | Requirement | Phase |
|----|-------------|-------|
| FR-31 | Govt/Admin shall create shelters with name, location, capacity, facilities. | v2 |
| FR-32 | Shelters shall be visible on public map with current occupancy. | v2 |

### Chat & Notifications
| ID | Requirement | Phase |
|----|-------------|-------|
| FR-33 | Mission-scoped chat between victim and assigned volunteer. | v2 |
| FR-34 | In-app real-time notifications via Socket.io for all critical events. | v2 |

### Public Transparency Ledger
| ID | Requirement | Phase |
|----|-------------|-------|
| FR-35 | Public dashboard shall show total donations collected and relief distributed. | v2 |
| FR-36 | Each distribution record shall include proof (photo, signature). | v2 |
| FR-37 | Public dashboard shall be accessible without login. | v1 |

### Inventory & Stock Tracking
| ID | Requirement | Phase |
|----|-------------|-------|
| FR-38 | The system shall track inventory levels per item category. | v1 |
| FR-39 | Inventory items shall track batch/lot numbers and expiry dates. | v2 |
| FR-40 | Low-stock alerts shall be generated automatically. | v2 |
| FR-41 | Inventory transfers between shelters shall be supported. | v2 |

### Offline & Sync
| ID | Requirement | Phase |
|----|-------------|-------|
| FR-42 | All offline actions shall queue in local storage. | v1 |
| FR-43 | Auto-sync on reconnection with conflict detection. | v1 |
| FR-44 | SOS requests shall have dedicated offline queue in IndexedDB. | v2 |

### Feedback
| ID | Requirement | Phase |
|----|-------------|-------|
| FR-45 | Any user may submit feedback without authentication. | v1 |
| FR-46 | Authorized users may view and respond to feedback. | v1 |

### i18n
| ID | Requirement | Phase |
|----|-------------|-------|
| FR-47 | The platform shall be available in English and Bengali. | v2 |
| FR-48 | Language toggle shall persist across sessions. | v2 |

### Admin Command Center
| ID | Requirement | Phase |
|----|-------------|-------|
| FR-49 | Admin dashboard shall show heatmaps, analytics charts, resource shortage alerts. | v2 |
| FR-50 | Full system audit log shall be accessible. | v2 |
| FR-51 | Background jobs shall auto-expire SOS and generate inventory alerts. | v2 |

---

## 3.3.2 Non-Functional Requirements

| ID | Category | Requirement |
|----|----------|-------------|
| NFR-01 | Performance | Public dashboard loads within 3 seconds on 3G. |
| NFR-02 | Performance | SOS creation completes within 2 seconds when online. |
| NFR-03 | Performance | Real-time notification latency < 1 second. |
| NFR-04 | Availability | 99% uptime during declared disaster periods. |
| NFR-05 | Scalability | Support up to 10,000 concurrent users (city-level). |
| NFR-06 | Security | All API endpoints authenticated except public dashboard. |
| NFR-07 | Security | All data transmission over HTTPS/TLS. |
| NFR-08 | Security | OTP expires in 300 seconds; 5 failed attempts locks for 15 min. |
| NFR-09 | Privacy | No household PII on public-facing views. |
| NFR-10 | Usability | Core flows completable in ≤ 5 taps on mobile. |
| NFR-11 | Usability | Bengali language support for all field-facing screens. |
| NFR-12 | Reliability | Offline sync failure rate < 5%. |
| NFR-13 | Maintainability | All endpoints documented. |
| NFR-14 | Portability | PWA function on Android Chrome. |
| NFR-15 | Accessibility | WCAG 2.1 AA compliance. |
| NFR-16 | Rate Limiting | Auth: 1 req/60s per phone; General: 100 req/min per user. |

---

## 3.3.3 User Stories

| ID | Role | Story | Phase |
|----|------|-------|-------|
| US-01 | UP Official | Register household with GPS + photo; work offline | v1 |
| US-02 | UP Official | Log distribution with duplicate check | v1 |
| US-03 | NGO Worker | See duplicate alerts before distributing | v1 |
| US-04 | Upazila Officer | Audit all unions; export PDF reports | v1 |
| US-05 | General Public | View distribution transparency dashboard | v1 |
| US-06 | Victim | Send SOS with GPS when stranded during flood | v2 |
| US-07 | Victim | Submit SOS offline; auto-syncs when online | v2 |
| US-08 | Volunteer | Find nearby SOS on map; accept rescue mission | v2 |
| US-09 | Volunteer | Update mission status; see assigned missions | v2 |
| US-10 | NGO | Create fundraising campaign for relief supplies | v2 |
| US-11 | Donor | Donate to campaign via bKash; get receipt | v2 |
| US-12 | Admin | View analytics, heatmaps, audit logs | v2 |
| US-13 | Victim | Chat with assigned volunteer during rescue | v2 |
| US-14 | All Users | Switch between English and Bengali UI | v2 |

---

## 3.3.4 Use Case Descriptions

### UC-01: Register a Household
| Field | Detail |
|-------|--------|
| Actor | UP Official |
| Preconditions | Authenticated, GPS enabled |
| Main Flow | Open form → GPS auto-capture → Enter name, NID, family size, flags → Take photo → Save (offline if needed) → HH-ID generated |

### UC-02: Log a Distribution
| Actor | UP Official, NGO Worker |
|-------|------------------------|
| Main Flow | Search HH → System checks duplicates → No dup: log item/qty/photo → Save |
| Alt Flow | Duplicate found → Show warning → Override with reason → Save |

### UC-03: Send SOS
| Actor | Victim |
|-------|--------|
| Main Flow | Open SOS form → GPS auto-capture → Select type (rescue/food/water/medical/shelter) → Set priority → Submit (online or offline queue) |
| Postcondition | SOS visible to nearby volunteers on map |

### UC-04: Accept Rescue Mission
| Actor | Volunteer |
|--------|-----------|
| Main Flow | View SOS on map → Select SOS → Accept → Mission created → Victim notified → Update status as mission progresses |

### UC-05: Donate to Campaign
| Actor | Donor |
|-------|-------|
| Main Flow | Browse campaigns → Select campaign → Enter amount → Choose payment method (bKash/Nagad/Rocket) → Complete payment → Receive digital receipt |

### UC-06: Sync Offline Data
| Actor | System (automated) |
|-------|--------------------|
| Main Flow | Detect connectivity → Upload queued records → Server validates → Clear local queue → Notify user |
| Alt Flow | Conflict detected → Flag for review → Save both versions |

---

## 3.3.5 Requirements Prioritization (MoSCoW)

### Must Have
- FR-01 to FR-04 (authentication and roles)
- FR-07 to FR-10 (household registration with offline)
- FR-11 to FR-12 (distribution logging)
- FR-14 to FR-16 (duplicate detection)
- FR-35, FR-37 (public dashboard)
- FR-42 to FR-43 (offline sync)
- FR-17 to FR-21 (SOS)
- FR-22 to FR-26 (missions)
- FR-38 to FR-41 (inventory)
- NFR-06 to NFR-11 (security + UX)

### Should Have
- FR-27 to FR-30 (campaigns and donations)
- FR-31 to FR-32 (shelters)
- FR-33 to FR-34 (chat and notifications)
- FR-45 to FR-46 (feedback)
- FR-47 to FR-48 (i18n)
- NFR-01 to NFR-04 (performance targets)

### Could Have
- FR-49 to FR-51 (admin command center)
- NFR-15 (WCAG accessibility)
- NFR-16 (granular rate limiting)

### Won't Have (this semester)
- Native Android/iOS app
- AI-based need forecasting
- DDM API integration
- Full SMS gateway integration
- Satellite GIS layers

---

*End of Section 3.3 — Next: Section 3.4 System Modeling (DFD & UML)*
