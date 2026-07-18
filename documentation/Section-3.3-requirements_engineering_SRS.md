# Section 3.3 — Requirements Engineering (SRS)
**Project:** ReliefMesh — Disaster Relief Coordination System for Local Government
**Team:** Team_Skipper | **Course:** CSE-3208 System Analysis & Design Lab
**Last Updated:** 2026-06-09

---

## 3.3.1 Functional Requirements

### Authentication & User Management

| ID | Requirement |
|----|-------------|
| FR-01 | The system shall allow users to register with name, role, organization, and password. |
| FR-02 | The system shall authenticate users via email/username and password (JWT-based). |
| FR-03 | The system shall support four roles: UP Official, Upazila Officer, NGO Worker, Public Viewer. |
| FR-04 | The system shall restrict data access based on user role and geographic jurisdiction. |
| FR-05 | Upazila Officers shall be able to create and manage UP Official accounts under their jurisdiction. |

### Household Registration

| ID | Requirement |
|----|-------------|
| FR-06 | UP Officials shall be able to register a household with: head-of-household name, NID number, GPS coordinates, number of members, and vulnerability flags (elderly, disabled, pregnant). |
| FR-07 | The system shall capture a photo of the household location during registration. |
| FR-08 | The system shall assign a unique Household ID (HH-ID) to every registered household. |
| FR-09 | The system shall allow searching and editing existing household records by HH-ID or name. |
| FR-10 | Household registration shall work offline and sync to the server when connectivity is restored. |

### Relief Distribution Logging

| ID | Requirement |
|----|-------------|
| FR-11 | Authorized users shall be able to log a distribution event: HH-ID, item type, quantity, unit, distributing officer, GPS, timestamp, and photo. |
| FR-12 | The system shall support predefined item categories: food (rice, dal, oil), WASH (water, soap), shelter (tarp, blanket), and other. |
| FR-13 | Distribution logging shall work offline and sync automatically on reconnection. |
| FR-14 | Each distribution log entry shall be immutable once synced; corrections require a new entry flagged as amendment. |

### Duplicate Detection

| ID | Requirement |
|----|-------------|
| FR-15 | Before logging a distribution, the system shall check if the same household received the same item category within a configurable window (default: 7 days). |
| FR-16 | If a duplicate is detected, the system shall display a warning with details of the previous distribution (date, officer, quantity). |
| FR-17 | The distributing officer may override the duplicate warning with a mandatory reason (text field). |
| FR-18 | All override events shall be logged with officer ID, timestamp, and reason. |

### Public Dashboard

| ID | Requirement |
|----|-------------|
| FR-19 | The public dashboard shall display total distributions by union, item category, and date — without any household PII. |
| FR-20 | The dashboard shall be accessible without login. |
| FR-21 | The dashboard shall show a map view with union-level markers indicating distribution activity. |
| FR-22 | The dashboard shall update aggregated data at least once every hour. |

### Reporting & Export

| ID | Requirement |
|----|-------------|
| FR-23 | Upazila Officers shall be able to export a distribution report (CSV/PDF) filtered by union, date range, and item category. |
| FR-24 | The system shall generate a household coverage report showing registered vs. distributed households per union. |

### Sync & Offline

| ID | Requirement |
|----|-------------|
| FR-25 | The system shall queue all offline actions (registration, distribution log) in local storage. |
| FR-26 | On reconnection, the system shall sync queued data to the server automatically. |
| FR-27 | The system shall detect and log sync conflicts; default resolution is last-write-wins with a manual review flag. |

### Feedback & Communication

| ID | Requirement |
|----|-------------|
| FR-28 | The system shall allow any user to submit feedback/complaints (name, contact, category, message) without authentication. |
| FR-29 | The system shall support feedback categories: Complaint, Suggestion, Inquiry, Appreciation, Other. |
| FR-30 | Authorized users (Upazila Officer) shall be able to view and respond to feedback submissions. |

### Inventory & Stock Tracking

| ID | Requirement |
|----|-------------|
| FR-31 | The system shall track inventory levels per item category (total quantity, distributed quantity, remaining). |
| FR-32 | Upazila Officers shall be able to create and update inventory items with quantities and unit. |
| FR-33 | All authenticated users shall be able to view current inventory levels. |

### User Profile

| ID | Requirement |
|----|-------------|
| FR-34 | The system shall allow authenticated users to view and update their profile (name, organization). |

### Geographic Need Mapping & Multi-Source Coordination

| ID | Requirement |
|----|-------------|
| FR-35 | The system shall model jurisdictions at four levels: District, Upazila, Union, Ward/Village. |
| FR-36 | The system shall calculate per-household relief need automatically from registered family size and age-bracket counts (adult, elderly, teenager, child), using configurable per-person daily ration rates. |
| FR-37 | Authorized officers shall be able to override any auto-calculated need value, with the override reason optional but recorded. |
| FR-38 | The system shall aggregate need and distribution data at Ward/Village, Union, Upazila, and District level for map display. |
| FR-39 | The public map shall display a heatmap layer showing households/areas already reached versus areas with remaining unmet need, with no household-level PII. |
| FR-40 | The system shall allow any registered source (government office, NGO, outside individual, local individual/institution) to submit a Relief Pledge: target area, item categories, quantities, number of teams, number of volunteers. |
| FR-41 | A Relief Pledge shall have a status: PLEDGED → EN_ROUTE → ARRIVED → COMPLETED, updatable by the pledging source. |
| FR-42 | A Distribution Log entry may optionally reference the Relief Pledge that funded it. |
| FR-43 | The public map shall display active pledges (area, source type, status) without exposing the Personl identity of individual (non-organizational) donors unless they opt in. |
| FR-44 | The system shall distinguish source/actor types: GOVERNMENT, NGO, OUTSIDE_INDIVIDUAL, LOCAL_INDIVIDUAL_OR_INSTITUTION. |

---

## 3.3.2 Non-Functional Requirements

| ID | Category | Requirement |
|----|----------|-------------|
| NFR-01 | Performance | The public dashboard shall load within 3 seconds on a 3G connection. |
| NFR-02 | Performance | Distribution log submission shall complete within 2 seconds when online. |
| NFR-03 | Availability | The system shall target 99% uptime during declared disaster periods. |
| NFR-04 | Scalability | The system shall support up to 500 concurrent users without degradation. |
| NFR-05 | Security | All API endpoints shall require authentication except the public dashboard. |
| NFR-06 | Security | All data transmission shall use HTTPS/TLS. |
| NFR-07 | Security | Passwords shall be hashed using bcrypt (min. cost factor 10). |
| NFR-08 | Privacy | Household NID numbers shall not appear on any public-facing view. |
| NFR-09 | Usability | Core data entry flows shall be completable in ≤ 5 taps on a mobile device. |
| NFR-10 | Usability | UI shall support Bengali language labels for all field-facing screens. |
| NFR-11 | Reliability | Offline sync failure rate shall be less than 5% on reconnection. |
| NFR-12 | Maintainability | All backend API endpoints shall be documented (README or Swagger). |
| NFR-13 | Portability | The frontend shall function as a Progressive Web App (PWA) on Android Chrome. |
| NFR-14 | Performance | The heatmap layer shall render for a full district (6 upazilas) within 3 seconds on a 3G connection, using pre-aggregated data (not live per-household queries). |
| NFR-15 | Usability | Pledge submission shall require no more than 6 fields for a non-technical first-time volunteer user. |

---

## 3.3.3 User Stories

| ID | Role | Story | Acceptance Criteria |
|----|------|-------|---------------------|
| US-01 | UP Official | As a UP Official, I want to register a household with GPS and photo so that I have a verifiable record of who I visited. | Registration saves offline; photo and GPS captured; HH-ID generated. |
| US-02 | UP Official | As a UP Official, I want to log rice distribution for a household so that the system can prevent duplicate distribution later. | Log entry saved with item, quantity, timestamp; duplicate check triggered. |
| US-03 | UP Official | As a UP Official, I want to work without internet during floods so that I can still enter data in the field. | App works fully offline; data queued locally; syncs on reconnect. |
| US-04 | NGO Worker | As an NGO worker, I want to see a duplicate alert before distributing to a household so that I don't give aid already provided by the UP team. | Warning shown if same item given within 7 days; override requires reason. |
| US-05 | Upazila Officer | As an Upazila Officer, I want to view all distributions under my jurisdiction so that I can audit relief operations remotely. | Dashboard filtered by Upazila; all UP logs visible; exportable. |
| US-06 | Upazila Officer | As an Upazila Officer, I want to export a PDF report of distributions so that I can submit a physical record to the district office. | PDF generated with filter options; includes summary table. |
| US-07 | General Public | As a citizen, I want to see a public dashboard of what relief was distributed in my union so that I can verify transparency. | Dashboard loads without login; shows union-level aggregates; no PII. |
| US-08 | General Public | As a journalist, I want to see distribution data on a map so that I can identify under-served areas. | Map view with union markers; clickable for summary. |
| US-09 | Outside Individual Donor | As someone outside the disaster area, I want to see which wards still need relief before I send help, so my donation doesn't duplicate aid that's already arrived. | Public map loads without login; heatmap shows served vs. remaining; clicking a ward shows item-level remaining need. |
| US-10 | Local Volunteer | As a local volunteer with my own small group, I want to declare what I'm bringing and where, so officials and other groups can see my contribution and avoid going to the same household. | Pledge form requires only name/phone, area, items, quantity, team/volunteer count; appears on map within minutes. |
| US-11 | Upazila Officer | As an Upazila Officer, I want to see auto-calculated need per ward so I can direct incoming NGO/volunteer pledges to the most under-served areas. | Need dashboard shows calculated vs. override vs. remaining, sortable by "most unmet need." |

---

## 3.3.4 Use Case Descriptions (Fully Dressed)

### UC-01: Register a Household

| Field | Detail |
|-------|--------|
| **Use Case ID** | UC-01 |
| **Name** | Register a Household |
| **Actor** | UP Official |
| **Preconditions** | Actor is authenticated; device has GPS enabled |
| **Trigger** | Actor taps "New Household" |
| **Main Flow** | 1. Actor opens registration form. 2. System auto-fills GPS coordinates. 3. Actor enters name, NID, family size, vulnerability flags. 4. Actor captures photo. 5. Actor taps Save. 6. System validates inputs. 7. System generates HH-ID. 8. System saves record (locally if offline, syncs when online). 9. System displays HH-ID confirmation. |
| **Alternate Flow** | 3a. GPS unavailable → Actor manually selects area on map. |
| **Exception Flow** | 6a. Duplicate NID detected → System warns actor; actor confirms or cancels. |
| **Postconditions** | Household record saved with unique HH-ID; photo and GPS attached. |

---

### UC-02: Log a Distribution

| Field | Detail |
|-------|--------|
| **Use Case ID** | UC-02 |
| **Name** | Log a Relief Distribution |
| **Actor** | UP Official, NGO Worker |
| **Preconditions** | Actor is authenticated; household is registered |
| **Trigger** | Actor taps "Log Distribution" |
| **Main Flow** | 1. Actor searches for household by HH-ID or name. 2. System retrieves household. 3. System checks duplicate history for item category. 4. No duplicate → Actor selects item, quantity, takes photo. 5. Actor submits. 6. System saves log entry with timestamp and officer ID. |
| **Alternate Flow** | 3a. Duplicate found → System shows warning with prior distribution details → Actor provides override reason → Log saved with override flag. |
| **Exception Flow** | 1a. Household not found → Actor prompted to register household first. |
| **Postconditions** | Distribution log entry saved and linked to household. |

---

### UC-03: View Public Dashboard

| Field | Detail |
|-------|--------|
| **Use Case ID** | UC-03 |
| **Name** | View Public Dashboard |
| **Actor** | General Public (unauthenticated) |
| **Preconditions** | None |
| **Trigger** | User opens public URL |
| **Main Flow** | 1. User opens dashboard. 2. System loads aggregated distribution data by union. 3. User selects union or date filter. 4. System updates chart and map. |
| **Postconditions** | User sees distribution summary; no PII exposed. |

---

### UC-04: Sync Offline Data

| Field | Detail |
|-------|--------|
| **Use Case ID** | UC-04 |
| **Name** | Sync Offline Data |
| **Actor** | System (automated), UP Official |
| **Preconditions** | Device has queued offline records |
| **Trigger** | Device detects network connectivity restored |
| **Main Flow** | 1. System detects connectivity. 2. System uploads queued records in chronological order. 3. Server validates and stores records. 4. System clears local queue. 5. System notifies user: "X records synced." |
| **Alternate Flow** | 3a. Conflict detected → Server flags for manual review; saves both versions with timestamps. |
| **Postconditions** | All offline records uploaded; conflicts flagged for review. |

---

### UC-05: Audit Union Distributions

| Field | Detail |
|-------|--------|
| **Use Case ID** | UC-05 |
| **Name** | Audit Union Distributions |
| **Actor** | Upazila Officer |
| **Preconditions** | Actor is authenticated as Upazila Officer |
| **Trigger** | Officer opens Upazila dashboard |
| **Main Flow** | 1. Officer selects a union from their jurisdiction. 2. System loads all distribution logs for that union. 3. Officer applies date/item filters. 4. Officer reviews entries; can flag suspicious ones. 5. Officer exports report as PDF or CSV. |
| **Postconditions** | Officer has an audited view; flagged entries marked for follow-up. |

---

### UC-06: Submit Relief Pledge

| Field | Detail |
|-------|--------|
| **Use Case ID** | UC-06 |
| **Name** | Submit Relief Pledge |
| **Actor** | Any registered Source (UP Official, NGO Worker, Outside/Local Individual) |
| **Preconditions** | Actor is authenticated; jurisdiction hierarchy is seeded |
| **Trigger** | Actor selects "Submit Pledge" |
| **Main Flow** | 1. Actor selects target area on map (District → Upazila → Union → Ward). 2. Actor selects item category and enters quantity. 3. Actor enters team count and volunteer count. 4. Actor submits pledge. 5. System validates and saves pledge with status PLEDGED. 6. Pledge appears on public map. |
| **Alternate Flow** | 1a. Actor knows the area name (not using map) → dropdown selection via text. |
| **Postconditions** | ReliefPledge saved; public map updated; heatmap adjusted. |

---

### UC-07: View Need Heatmap

| Field | Detail |
|-------|--------|
| **Use Case ID** | UC-07 |
| **Name** | View Need Heatmap |
| **Actor** | General Public (unauthenticated) |
| **Preconditions** | None |
| **Trigger** | User opens public map URL |
| **Main Flow** | 1. User opens public map. 2. System loads Leaflet map with District-level view. 3. User drills down: District → Upazila → Union → Ward. 4. User toggles heatmap layer. 5. System displays served (green) vs. partial (yellow) vs. unmet (red) areas. 6. User clicks a ward → bottom sheet shows item-level remaining need (aggregated, no PII). |
| **Postconditions** | User sees need status and active pledges for selected area. |

---

### UC-08: Calculate & Override Area Need

| Field | Detail |
|-------|--------|
| **Use Case ID** | UC-08 |
| **Name** | Calculate & Override Area Need |
| **Actor** | UP Official, Upazila Officer |
| **Preconditions** | Actor is authenticated; jurisdiction has registered households with age-bracket counts |
| **Trigger** | Officer opens Need Dashboard for a ward |
| **Main Flow** | 1. System reads household census for that ward. 2. System applies Sphere-based per-person rates (rice, dal, oil, etc.) for 7-day relief cycle. 3. System displays calculated need per item category. 4. Officer reviews values. 5. Optionally, officer edits any value and provides override reason. 6. System stores both calculated_qty and override_qty; uses override where present. |
| **Postconditions** | NeedAssessment record saved; heatmap uses override value if present. |

---

## 3.3.5 Requirements Prioritization (MoSCoW)

### Must Have
- FR-01 to FR-04 (authentication and roles)
- FR-06 to FR-10 (household registration with offline)
- FR-11 to FR-13 (distribution logging with offline)
- FR-15 to FR-17 (duplicate detection and override)
- FR-19 to FR-20 (public dashboard, no login)
- FR-25 to FR-26 (offline queue and auto-sync)
- FR-35, FR-36, FR-38, FR-39, FR-40 (geographic need mapping & heatmap core)
- NFR-05, NFR-06, NFR-07 (security baseline)
- NFR-09, NFR-10 (mobile usability, Bengali labels)

### Should Have
- FR-05 (Upazila manages UP accounts)
- FR-23 to FR-24 (export reports)
- FR-21 (map view on public dashboard)
- FR-27 (conflict detection and flagging)
- FR-28 to FR-30 (feedback module)
- FR-31 to FR-33 (inventory tracking)
- FR-34 (user profile)
- FR-37, FR-41, FR-42, FR-43, FR-44 (need override, pledge lifecycle, privacy)
- NFR-01, NFR-02 (performance targets)

### Could Have
- FR-22 (hourly dashboard refresh)
- FR-18 (override event logging)
- Route/direction tracking (volunteer movement via openrouteservice)
- NFR-04 (500 concurrent users — beyond prototype scale)
- NFR-12 (Swagger API docs)

### Won't Have (this semester)
- DDM API integration
- Native Android/iOS app
- AI-based need forecasting
- Financial/cash transfer management
- Real-time satellite GIS layers (static geo layers are in scope)

---

## 3.3.6 Requirements Traceability Matrix

| Requirement ID | Module | Use Case | Test Case |
|---------------|--------|----------|-----------|
| FR-01 | Auth | — | TC-01 |
| FR-02 | Auth | — | TC-02 |
| FR-03 | Auth | — | TC-03 |
| FR-06 | Household | UC-01 | TC-04 |
| FR-07 | Household | UC-01 | TC-05 |
| FR-08 | Household | UC-01 | TC-06 |
| FR-10 | Household / Sync | UC-01, UC-04 | TC-07 |
| FR-11 | Distribution | UC-02 | TC-08 |
| FR-15 | Duplicate | UC-02 | TC-09 |
| FR-16 | Duplicate | UC-02 | TC-10 |
| FR-17 | Duplicate | UC-02 | TC-11 |
| FR-19 | Dashboard | UC-03 | TC-12 |
| FR-25 | Sync | UC-04 | TC-13 |
| FR-26 | Sync | UC-04 | TC-14 |
| FR-27 | Sync | UC-04 | TC-15 |
| FR-23 | Reports | UC-05 | TC-16 |
| FR-28 | Feedback | — | TC-FB01 |
| FR-29 | Feedback | — | TC-FB02 |
| FR-30 | Feedback | — | TC-FB03 |
| FR-31 | Inventory | — | TC-INV01 |
| FR-32 | Inventory | — | TC-INV02 |
| FR-34 | Auth | — | — |
| FR-35 | Jurisdiction | — | — |
| FR-36 | Need Calculation | UC-08 | TC-NEED01 |
| FR-37 | Need Calculation | UC-08 | TC-NEED02 |
| FR-38 | Dashboard / Map | UC-07 | TC-NEED03 |
| FR-39 | Dashboard / Map | UC-07 | — |
| FR-40 | Pledge | UC-06 | TC-PLEDGE01 |
| FR-41 | Pledge | UC-06 | TC-PLEDGE02 |
| FR-42 | Distribution / Pledge | UC-06 | TC-23 |
| FR-43 | Dashboard / Map | UC-07 | TC-PLEDGE03 |
| FR-44 | Auth / Roles | — | — |

*(Test cases defined in full in Section 3.9)*

---

*End of Section 3.3 — Next: Section 3.4 System Modeling (DFD & UML)*
