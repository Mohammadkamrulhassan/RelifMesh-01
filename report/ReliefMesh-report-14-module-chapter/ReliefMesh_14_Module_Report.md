# ReliefMesh — 14-Module Consolidated Project Report

**Disaster Relief Coordination System for Local Government**

| | |
|---|---|
| **Course** | CSE-3208: System Analysis & Design Lab |
| **Team** | Team_Skipper — Project #6 ReliefMesh |
| **Supervisor** | MD Mynoddin, Assistant Professor, RMSTU |
| **Date** | 2026-07-06 |
| **Live Demo** | [https://reliefmesh.netlify.app](https://reliefmesh.netlify.app) |

---

## Team Members

| ID | Name | Role |
|---|---|---|
| 2101011001 | Abidul Islam | System Analyst / QA Tester |
| 2101011005 | MD. Kamrul Hassan | Project Manager / Developer |
| 2101011013 | Sayeda Mofatteha Ahmed | UI/UX Designer |
| 2101011038 | Iftekhar Alam Nahid | UI/UX Designer |

---

## Table of Contents

| Module | Section | Page |
|--------|---------|------|
| **3.1** | [Project Initiation & Problem Definition](#31-project-initiation--problem-definition) | 3 |
| **3.2** | [Stakeholder Analysis](#32-stakeholder-analysis) | 6 |
| **3.3** | [Requirements Engineering (SRS)](#33-requirements-engineering-srs) | 9 |
| **3.4** | [System Modeling (DFD & UML)](#34-system-modeling-dfd--uml) | 13 |
| **3.5** | [Database Design (ERD)](#35-database-design-erd) | 17 |
| **3.6** | [Architecture & Tech Stack](#36-architecture--tech-stack) | 21 |
| **3.7** | [UI/UX Design](#37-uiux-design) | 25 |
| **3.8** | [Implementation Plan](#38-implementation-plan) | 29 |
| **3.9** | [Testing & QA](#39-testing--qa) | 33 |
| **3.10** | [Security & Access Control](#310-security--access-control) | 37 |
| **3.11** | [Deployment & Maintenance](#311-deployment--maintenance) | 41 |
| **3.12** | [Project Management](#312-project-management) | 45 |
| **3.13** | [References & Bibliography](#313-references--bibliography) | 49 |
| **3.14** | [Presentation & Defense](#314-presentation--defense) | 51 |

---

## 3.1 Project Initiation & Problem Definition

### 3.1.1 Project Title & Tagline

**Title:** ReliefMesh — Disaster Relief Coordination System for Local Government

**Tagline:** *"One mesh. No duplicates. No household left behind."*

### 3.1.2 Problem Statement

Bangladesh is among the world's most disaster-prone nations. Floods affect approximately one-third of the country annually, and the Bengal coast faces cyclones regularly. During flood and cyclone events, relief distribution suffers from critical coordination failures:

| # | Pain Point | Description |
|---|---|---|
| 1 | **Duplicate distribution** | Multiple agencies (NGOs, UP, DDM teams) distribute to the same household because there is no shared registry. |
| 2 | **Missed households** | Families in isolated or politically overlooked areas are skipped entirely with no audit trail. |
| 3 | **No real-time tracking** | Relief logs are recorded on paper; consolidation happens days or weeks later. |
| 4 | **Inter-agency opacity** | NGOs and government teams prepare response plans independently with rarely a shared objective. |
| 5 | **Accountability gaps** | Political networks influence who receives aid; household-level allocation suffers from irregularities. |
| 6 | **Offline environments** | Flood-hit areas lose internet and power, making cloud-only systems unusable during the critical first 72 hours. |
| 7 | **No visibility into remaining need** | No one can see which wards still need relief and how much, versus which are already served. |
| 8 | **No coordination channel for volunteers** | Individual donors and local volunteer groups have no shared channel to coordinate with official channels. |

### 3.1.3 Case Study: Feni District Floods (2024 & 2025)

The August 2024 eastern Bangladesh floods affected an estimated **4.5–5.8 million people** across 11 districts including Feni. Feni district alone experienced approximately **92% of its mobile towers going down**, cutting off communication to all 6 upazilas at the height of the disaster. This real-world event directly validates the project's offline-first design constraint.

**Feni administrative makeup:** 6 upazilas, 45 unions, ~570 villages.

**Design implication:** Because mobile network infrastructure itself failed during the disaster, offline-first design is not optional — it is the defining constraint of this problem domain.

### 3.1.4 Vision & Mission

**Vision:** A Bangladesh where no disaster-affected household is missed or double-served — where every relief item is tracked from warehouse to household with a photo, a GPS coordinate, and a timestamp, visible to any citizen on a public dashboard.

**Mission:** To build a lightweight, offline-capable web application that enables Union Parishad officials, Upazila officers, and NGO workers to jointly register affected families, log item-level distributions, and prevent duplicate aid — while giving the public a transparent view of relief operations.

### 3.1.5 Project Scope

**In-Scope:** Household registration, relief distribution logging, duplicate detection engine, multi-role authentication (4 roles), offline-first data entry with background sync, sync conflict resolution, public-facing dashboard, authority hierarchy enforcement, basic report export (PDF/CSV).

**Out-of-Scope:** Financial transactions, warehouse procurement, predictive analytics, national NID database integration, native mobile apps, real-time satellite GIS layers, multi-language UI beyond Bengali/English.

### 3.1.6 SMART Objectives

| # | Objective | Target |
|---|---|---|
| 1 | Household registration with GPS and photo | ≥ 50 test households registered in prototype |
| 2 | Duplicate detection (same category within 7 days) | Accuracy ≥ 90% on test dataset |
| 3 | Offline-first data entry with auto-sync | Sync success rate ≥ 95% on reconnect |
| 4 | Public dashboard | Loads in ≤ 3 seconds on 3G |
| 5 | Role-based access control | All RBAC tests pass (0 unauthorized access) |
| 6 | Heatmap rendering | Correct served/remaining split for test ward |
| 7 | Need-calculation accuracy within Sphere-standard tolerance | Within ±2% of Sphere reference rates |

### 3.1.7 Risk Register

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | Offline sync conflicts corrupt data | Medium | High | Conflict log with timestamp; last-write-wins default |
| R2 | Duplicate detection false positives | Medium | Medium | Adjustable detection window; override with reason |
| R3 | Team member unavailability | Medium | High | Document all work in shared repo; no knowledge silos |
| R4 | Scope creep | High | Medium | Lock scope document after Module 3 |
| R5 | GPS accuracy insufficient | Low | Low | Accept ±15m; supplement with manual area selection |
| R6 | Free-tier hosting limits | Low | Medium | Lightweight DB; prototype data volume only |
| R7 | Public dashboard exposes sensitive data | Low | High | Aggregate at union level; no individual household data |
| R8 | Poor UI adoption by non-tech users | Medium | Medium | Large buttons, Bengali labels, minimal text input |

### 3.1.8 Team Formation

| Role | Member | Responsibilities |
|---|---|---|
| Project Manager / Developer | MD. Kamrul Hassan | Timeline, meetings, backend, database, deployment |
| System Analyst / QA | Abidul Islam | SRS, DFDs, UML, problem research, testing |
| UI/UX Designer | Sayeda Mofatteha Ahmed | Wireframes, prototypes, UI implementation, hard copy report |
| UI/UX Designer | Iftekhar Alam Nahid | UI implementation, demo video, heatmap, presentation slides |

---

## 3.2 Stakeholder Analysis

### 3.2.1 Stakeholder Identification

| # | Stakeholder | Type | Interaction |
|---|---|---|---|
| S1 | Union Parishad (UP) Officials | Primary | Register households, log distributions, view local dashboard |
| S2 | Upazila Officers | Primary | Audit UP-level data, generate reports, manage accounts |
| S3 | NGO Field Workers | Primary | Log distributions, view duplicate alerts |
| S4 | General Public | Primary | View public dashboard (read-only, no login) |
| S5 | District Disaster Management Committee | Secondary | Review aggregated district-level reports |
| S6 | Department of Disaster Management (DDM) | Secondary | Policy-level oversight |
| S7 | Course Teacher (MD Mynoddin) | External | Academic evaluator, QA reviewer |
| S8 | External QA (Saifur Rahman) | External | Independent functionality testing |
| S9 | Team_Skipper | Internal | Design, build, test, and maintain the system |
| S10 | Affected Households | Indirect | Data subjects; benefit from fair distribution |
| S11 | Outside Individual Donors | Primary | Pledge relief capacity, view map |
| S12 | Local Volunteers | Primary | Pledge relief for own neighborhood |
| S13 | Volunteer Teams | Primary | Coordinate with officials |

### 3.2.2 Power-Interest Grid

```
HIGH POWER
  │
  │  District Committee       UP Officials
  │  DDM                      Upazila Officers
  │
  │──────────────────────────────────────────────
  │
  │  Course Teacher           NGO Field Workers
  │  External QA              General Public
  │                           Affected Households
LOW POWER
  └──────────────────────────────────────────────
     LOW INTEREST             HIGH INTEREST
```

### 3.2.3 User Persons

#### Person 1 — Rahim Uddin (UP Official)
- **Age:** 42 | **Device:** Android smartphone (basic)
- **Connectivity:** 2G/3G intermittent; no internet during flooding
- **Goal:** Register all affected families quickly and log distributions
- **Key Need:** Offline data entry, simple Bengali-labeled form, photo capture

#### Person 2 — Nasrin Akter (NGO Worker, BRAC)
- **Age:** 28 | **Device:** Android tablet
- **Goal:** Log distributions without duplicating with UP teams
- **Key Need:** Duplicate alert before distribution, cross-agency visibility

#### Person 3 — Kamal Hossain (Upazila Officer)
- **Age:** 51 | **Device:** Desktop PC at office
- **Goal:** Verify that all unions under jurisdiction are distributing correctly
- **Key Need:** Dashboard showing all UP activity, export to PDF

#### Person 4 — Fatema Begum (Journalist / Public)
- **Age:** 34 | **Goal:** Verify relief is reaching affected areas
- **Key Need:** Public dashboard with map and item-level summary by union

#### Person 5 — Arif Hossain (Outside Individual Donor)
- **Age:** 30 | **Goal:** Send relief to home village without duplicating
- **Key Need:** Public heatmap + simple pledge form

### 3.2.4 Stakeholder Requirements Summary

| Stakeholder | Core Requirements |
|---|---|
| UP Official | Offline household registration, photo+GPS distribution log, Bengali UI |
| Upazila Officer | Audit trail, jurisdiction-filtered dashboard, PDF export |
| NGO Worker | Cross-agency duplicate alert, own distribution log |
| General Public | Dashboard (no login), union-level summary, map view |
| District Committee | Aggregated district report, no household PII |
| Outside/Local Volunteers | Heatmap of need, simple pledge form |

---

## 3.3 Requirements Engineering (SRS)

### 3.3.1 Functional Requirements

#### Authentication & User Management (FR-01 to FR-05)
- **FR-01:** Users register with name, role, organization, password
- **FR-02:** JWT-based authentication via email/username and password
- **FR-03:** Four roles: UP Official, Upazila Officer, NGO Worker, Public Viewer
- **FR-04:** Data access restricted by role and geographic jurisdiction
- **FR-05:** Upazila Officers create/manage UP Official accounts

#### Household Registration (FR-06 to FR-10)
- **FR-06:** Register household with: head name, NID, GPS, family size, vulnerability flags
- **FR-07:** Capture photo during registration
- **FR-08:** Assign unique Household ID (HH-ID)
- **FR-09:** Search/edit households by HH-ID or name
- **FR-10:** Works offline; syncs when connectivity restored

#### Relief Distribution Logging (FR-11 to FR-14)
- **FR-11:** Log distribution: HH-ID, item type, quantity, unit, officer, GPS, timestamp, photo
- **FR-12:** Predefined item categories (Food, WASH, Shelter, Other)
- **FR-13:** Works offline; auto-syncs
- **FR-14:** Logs immutable once synced; corrections as new entries with amendment flag

#### Duplicate Detection (FR-15 to FR-18)
- **FR-15:** Check same household + same item category within 7-day window
- **FR-16:** Warning with prior distribution details on duplicate
- **FR-17:** Override with mandatory reason
- **FR-18:** All overrides logged with officer ID, timestamp, reason

#### Public Dashboard (FR-19 to FR-22)
- **FR-19:** Display total distributions by union, item, date — no household PII
- **FR-20:** Accessible without login
- **FR-21:** Map view with union-level markers
- **FR-22:** Aggregated data updates at least once per hour

#### Reporting & Export (FR-23 to FR-24)
- **FR-23:** Export distribution report (CSV/PDF) filtered by union, date range, item category
- **FR-24:** Household coverage report showing registered vs. distributed per union

#### Sync & Offline (FR-25 to FR-27)
- **FR-25:** Queue offline actions in local storage
- **FR-26:** Auto-sync queued data on reconnection
- **FR-27:** Detect and log sync conflicts; last-write-wins with manual review flag

#### Feedback (FR-28 to FR-30)
- **FR-28:** Submit feedback without authentication (name, contact, category, message)
- **FR-29:** Categories: Complaint, Suggestion, Inquiry, Appreciation, Other
- **FR-30:** Authorized users view and respond to feedback

#### Inventory (FR-31 to FR-33)
- **FR-31:** Track inventory levels (total, distributed, remaining)
- **FR-32:** Create and update inventory items
- **FR-33:** All authenticated users view inventory

#### User Profile (FR-34)
- **FR-34:** View and update profile (name, organization)

#### Geographic Need Mapping (FR-35 to FR-44)
- **FR-35:** Four-level jurisdiction model: District, Upazila, Union, Ward
- **FR-36:** Auto-calculate relief need from demographics × per-person rates
- **FR-37:** Override calculated need with reason
- **FR-38:** Aggregate need and distribution data at all hierarchy levels
- **FR-39:** Heatmap showing served vs. unmet areas (no PII)
- **FR-40:** Any source submit a Relief Pledge (area, items, quantities)
- **FR-41:** Pledge lifecycle: PLEDGED → EN_ROUTE → ARRIVED → COMPLETED
- **FR-42:** Distribution Log may reference a Pledge
- **FR-43:** Public map shows active pledges (no Personl identity exposed)
- **FR-44:** Distinguish source types: GOVERNMENT, NGO, OUTSIDE_INDIVIDUAL, LOCAL

### 3.3.2 Non-Functional Requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-01 | Performance | Public dashboard loads within 3 seconds on 3G |
| NFR-02 | Performance | Distribution submission within 2 seconds (online) |
| NFR-03 | Availability | 99% uptime during declared disaster periods |
| NFR-04 | Scalability | Supports 500 concurrent users |
| NFR-05 | Security | All API endpoints authenticated except public dashboard |
| NFR-06 | Security | HTTPS/TLS for all data transmission |
| NFR-07 | Security | Passwords hashed with bcrypt (cost factor ≥ 10) |
| NFR-08 | Privacy | NID numbers never on public-facing views |
| NFR-09 | Usability | Core flows completable in ≤ 5 taps on mobile |
| NFR-10 | Usability | Bengali language labels for field-facing screens |
| NFR-11 | Reliability | Offline sync failure rate < 5% |
| NFR-12 | Maintainability | All endpoints documented |
| NFR-13 | Portability | PWA on Android Chrome |
| NFR-14 | Performance | Heatmap renders full district within 3 seconds on 3G |
| NFR-15 | Usability | Pledge submission ≤ 6 fields |

### 3.3.3 Requirements Traceability Matrix

| Requirement | Module | Use Case | Test Case |
|---|---|---|---|
| FR-01 to FR-04 | Auth | — | TC-01 to TC-04 |
| FR-06 to FR-10 | Household | UC-01 | TC-05 to TC-07 |
| FR-11 to FR-13 | Distribution | UC-02 | TC-08 to TC-11 |
| FR-15 to FR-17 | Duplicate | UC-02 | TC-12 to TC-16 |
| FR-19 to FR-20 | Dashboard | UC-03 | TC-19 to TC-20 |
| FR-23 to FR-24 | Reports | UC-05 | TC-16 |
| FR-25 to FR-27 | Sync | UC-04 | TC-17 to TC-18, TC-22 |
| FR-28 to FR-30 | Feedback | — | TC-FB01 to TC-FB04 |
| FR-31 to FR-33 | Inventory | — | TC-INV01 to TC-INV03 |
| FR-36 to FR-37 | Need Calc | UC-08 | TC-NEED01 to TC-NEED05 |
| FR-40 to FR-42 | Pledge | UC-06 | TC-PLEDGE01 to TC-PLEDGE05 |

---

## 3.4 System Modeling (DFD & UML)

### 3.4.1 Context Diagram (Level 0 DFD)

The context diagram shows ReliefMesh as a single process interacting with all external entities:

```
             ┌─────────────────────────────────────┐
 UP Official ────────►│                              │
 NGO Worker  ────────►│    ReliefMesh System          │──────► Public Dashboard
 Upazila Off.────────►│  (Disaster Relief Coord.)   │──────► Distribution Report
 General Public───────►│                              │──────► Duplicate Alert
             └─────────────────────────────────────┘
                         │
                         ▼
                     Household Registry
                     Distribution Logs
```

**External Entities:** UP Official (inputs: household data, distribution logs; outputs: HH-ID, warnings), NGO Worker (inputs: distribution logs; outputs: warnings), Upazila Officer (inputs: audit queries; outputs: reports), General Public (inputs: dashboard queries; outputs: aggregated summaries).

> *Source: `diagrams/DFD-context-level-0.drawio`*

### 3.4.2 Level 1 DFD

Decomposes the system into 7 major processes:

- **P1: User Authentication** — handles login, registration, JWT generation
- **P2: Household Registration** — CRUD with GPS and photo
- **P3: Distribution Log Entry** — item-level logging with duplicate check
- **P4: Duplicate Detection** — alerts engine for same HH+item within 7 days
- **P5: Public Dashboard & Reporting** — aggregated views and exports
- **P6: Need Calculation** — demographic-based relief need computation
- **P7: Pledge Management** — multi-source pledge lifecycle

**Data Stores:** D1: User Store, D2: Household Registry, D3: Distribution Log, D4: Conflict Log, D5: Feedback Store, D6: Inventory Store, D7: NeedAssessment, D8: ReliefPledge.

> *Source: `diagrams/DFD-level-1.drawio`*

### 3.4.3 Level 2 DFD — P3: Distribution Log Entry

```
 User ──────► P3.1: Validate HH ID ──► D2: Household Registry
                │
                ▼
            P3.2: Duplicate Check ◄──── D3: Distribution Log
                │
            ┌───┴────┐
         No Dup│     │Dup Found
            ▼        ▼
        P3.3: Capture  P3.4: Show Warning
        Distribution  & Request Override
        Data (GPS)       │
            └──────┬──────┘
                ▼
            P3.5: Save Log ──► D3: Distribution Log
```

### 3.4.4 Use Case Diagram

**Actors:** UP Official, NGO Worker, Upazila Officer, General Public, System, Outside Individual Donor, Local Volunteer.

**Key Use Cases:**
- UC-01: Register a Household
- UC-02: Log a Relief Distribution
- UC-03: View Public Dashboard
- UC-04: Sync Offline Data
- UC-05: Audit Union Distributions
- UC-06: Submit Relief Pledge
- UC-07: View Need Heatmap
- UC-08: Calculate & Override Area Need

**Relationships:** `Log Distribution` **includes** `Duplicate Check`; `Override Duplicate` **extends** `Log Distribution`; `Sync Offline Data` **includes** `Conflict Detection`; `Declare Pledge` **includes** `Pledge Validation`; `View Need Heatmap` **includes** `Aggregate Ward-Level Need`.

> *Source: `diagrams/use-case-diagram.drawio`*

### 3.4.5 Class Diagram

**Core Classes:**
- **User:** userId, name, email, passwordHash, role, organization, jurisdictionId
- **Household:** hhId, headName, nid, gps, familySize, vulnerabilityFlags, children_0_5, over_60, photoUrl
- **DistributionLog:** logId, hhId, itemCategory, quantity, unit, officerId, gps, photoUrl, timestamp, syncStatus, overrideFlag, pledgeId
- **DuplicateAlert:** alertId, hhId, itemCategory, priorLogId, resolvedBy, overrideReason
- **NeedAssessment:** assessmentId, jurisdictionId, itemCategoryId, calculatedQty, overrideQty, overrideReason
- **ReliefPledge:** pledgeId, sourceId, sourceType, jurisdictionId, itemCategoryId, pledgedQty, remainingQty, status
- **GeographicArea:** areaId, name, level, parentId, geometry
- **Feedback:** feedbackId, name, contact, category, message, response
- **Inventory:** inventoryId, itemCategoryId, totalQuantity, distributedQuantity, unit

**Relationships:** GeographicArea (self-referencing hierarchy), Household belongs-to GeographicArea, DistributionLog references Household + User + ItemCategory + ReliefPledge (optional), DuplicateAlert references DistributionLog, NeedAssessment references GeographicArea + ItemCategory, ReliefPledge references GeographicArea + ItemCategory.

> *Source: `diagrams/class-diagram.drawio`*

### 3.4.6 Sequence Diagrams

**SD-01: Household Registration (Offline):**
```
UP Official → App (PWA) → GPS Capture → Local DB (IndexedDB) → HH-ID → Confirm
[Network Restored] → Sync → Server (MongoDB) → ACK → Clear Queue
```

**SD-02: Distribution Log with Duplicate Check:**
```
Officer → Search Household → Query → HH Data
→ Check Log (past 7 days, same item) → No Duplicate → Enter Data → Save Log → Sync
```

**SD-03: Sync Conflict Resolution:**
```
App → Sync Record → Server → Check Exists → Conflict Found
→ Save Both Versions → Flag Review → Conflict Notice
```

**SD-04: Need Calculation with Override:**
```
UP Official → Open Ward Dashboard → Read Demographics → Apply Sphere Rates
→ Write Calculated Qty → Show Need → Edit Qty (Override) → Store Override → Updated Heatmap
```

**SD-05: Pledge Declaration → Fulfillment:**
```
Donor → Declare Pledge → Validate → ACK → Pledge ID
[Later: UP Official] → Log Distribution w/ ref → Lookup Pledge → Save Distro
→ Update Pledge Status → Mark Fulfilled → Adjust Ward Need
```

> *Source: `diagrams/sequence-diagram-sd01.drawio`, `diagrams/sequence-diagram-sd02.drawio`, `diagrams/sequence-diagram-need-calculation.drawio`, `diagrams/sequence-diagram-pledge-fulfillment.drawio`*

### 3.4.7 Activity Diagrams

**Relief Distribution Workflow:**
```
Officer Opens App → Search Household → Found? (Yes/No)
→ Select HH/Register New HH → Select Item & Quantity
→ Duplicate Check → (No Dup/Override/Cancel)
→ Capture Photo + GPS → Save → Online? (Sync/Queue) → Confirmation
```

**Pledge-to-Distribution Workflow:**
```
Source Views Heatmap → Identifies Ward → Declares Pledge
→ Validate Area/Item → Pledge Created (PENDING)
→ UP Official Notified → Log Distribution (reference pledge_id)
→ Status: IN_FULFILLMENT → Pledged Qty Reached? → COMPLETED
→ Heatmap Updates
```

> *Source: `diagrams/activity-diagram-relief-flow.drawio`*

---

## 3.5 Database Design (ERD)

### 3.5.1 Entity Identification

| Entity | Description |
|---|---|
| **User** | System accounts — UP officials, Upazila officers, NGO workers |
| **GeographicArea** | Full BD administrative hierarchy: Division → District → Upazila → Union → Ward |
| **Household** | Registered disaster-affected family unit with age-bracket counts |
| **DistributionLog** | Record of one relief distribution (optionally linked to a pledge) |
| **ItemCategory** | Lookup table for predefined relief item types with per-person rates |
| **DuplicateAlert** | Alert generated when duplicate distribution is detected |
| **SyncConflict** | Log of offline sync conflicts pending manual review |
| **Feedback** | User-submitted feedback/complaints with admin response |
| **Inventory** | Stock tracking per item category |
| **NeedAssessment** | Ward-level calculated need per item category, with optional officer override |
| **ReliefPledge** | Source declaration of relief supply with status lifecycle |

### 3.5.2 Entity-Relationship Diagram (Summary)

The ERD uses Crow's Foot notation with the following key relationships:

- **GeographicArea** (1) ──── (Many) **User** — one area has many users
- **GeographicArea** (1) ──── (Many) **Household** — one union has many households
- **GeographicArea** (self-referencing) — parent_id for hierarchy
- **Household** (1) ──── (Many) **DistributionLog** — one household receives many distributions
- **User** (1) ──── (Many) **DistributionLog** — one officer logs many distributions
- **DistributionLog** (Many) ──── (1) **ReliefPledge** — optional FK for pledge fulfillment
- **ItemCategory** (1) ──── (Many) **DistributionLog**, **NeedAssessment**, **ReliefPledge**
- **GeographicArea** (1) ──── (Many) **NeedAssessment**, **ReliefPledge**

> *Source: `diagrams/ER-diagram.drawio`*

### 3.5.3 Normalization

All tables are in **3NF (Third Normal Form)**:

- **1NF:** All attributes atomic — vulnerability flags are separate boolean columns, age-bracket counts are separate INT columns
- **2NF:** All tables use single-column surrogate PKs (UUID); no composite PKs
- **3NF:** GeographicArea hierarchy is self-referencing; ItemCategory is in its own table; ReliefPledge.remaining_qty is a computed column

### 3.5.4 Data Dictionary (Key Tables)

**users:** user_id (PK), area_id (FK), name, email (UNIQUE), password_hash, role (ENUM), organization, is_active, created_at

**geographic_areas:** area_id (PK), name, level (ENUM: DIVISION/DISTRICT/UPAZILA/UNION/WARD), parent_id (FK, self), geometry (GeoJSON)

**households:** hh_id (PK), area_id (FK), head_name, nid (UNIQUE), gps_lat, gps_lng, family_size, is_elderly, is_disabled, is_pregnant, children_0_5, over_60, photo_url, registered_by (FK), created_at

**distribution_logs:** log_id (PK), hh_id (FK), officer_id (FK), item_category_id (FK), pledge_id (FK, nullable), quantity, unit, gps_lat, gps_lng, photo_url, timestamp, sync_status (ENUM), is_override, override_reason

**need_assessments:** assessment_id (PK), area_id (FK, level=WARD), item_category_id (FK), calculated_qty, override_qty (nullable), override_reason, computed_at, overridden_at, overridden_by (FK)

**relief_pledges:** pledge_id (PK), source_id, source_type (ENUM), area_id (FK), item_category_id (FK), pledged_qty, remaining_qty, team_count, volunteer_count, description, status (ENUM: PENDING/IN_FULFILLMENT/COMPLETED/CANCELLED)

---

## 3.6 Architecture & Tech Stack

### 3.6.1 System Architecture Overview

ReliefMesh uses a **PWA (Progressive Web App) + REST API + MongoDB** three-tier architecture:

```
┌────────────────────────────────────────────────────────┐
│                  CLIENT LAYER (Browser)                  │
│  ┌──────────────────────┐   ┌────────────────────────┐  │
│  │  PWA (React / Vite)  │   │   Public Dashboard     │  │
│  │  - offline queue     │   │   (read-only, no auth) │  │
│  │  - role-based views  │   └────────────────────────┘  │
│  └──────────┬───────────┘                                │
└─────────────┼────────────────────────────────────────────┘
              │ HTTPS / REST JSON
┌─────────────▼────────────────────────────────────────────┐
│                 SERVER LAYER (Express API)                 │
│  14 Module Routers: auth, households, distributions,      │
│  alerts, reports, public, sync, feedback, inventory,      │
│  areas, need, pledges, upload, auth/profile               │
│  Middleware: authenticate, authorize, errorHandler         │
└─────────────┬────────────────────────────────────────────┘
              │
┌─────────────▼────────────────────────────────────────────┐
│                  DATA LAYER (MongoDB)                      │
│  11 Collections: Users, GeographicAreas, Households,      │
│  DistributionLogs, NeedAssessments, Pledges, Inventory,   │
│  Alerts, Feedback, ReliefRequests, SyncConflicts          │
└───────────────────────────────────────────────────────────┘
```

### 3.6.2 Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18 + Vite 5 | SPA with fast HMR |
| **Routing** | React Router DOM 6 | Client-side routing |
| **Styling** | Tailwind CSS 3 + CSS Custom Properties | Utility-first + design tokens |
| **Maps** | Leaflet + leaflet.heat + React Leaflet | Interactive heatmap overlays |
| **Offline** | localforage (IndexedDB) | Offline queue |
| **PWA** | vite-plugin-pwa | Service worker registration |
| **Backend** | Express 4 + Node.js 20 | REST API server |
| **Database** | MongoDB 8 + Mongoose 8 | Document DB with schema validation |
| **Auth** | JWT (jsonwebtoken) + bcrypt | Token-based authentication |
| **Validation** | express-validator | Request validation middleware |
| **Security** | helmet + cors + express-rate-limit | HTTP security & rate limiting |
| **Uploads** | multer | File upload handling |
| **Reports** | PDFKit + json2csv | PDF and CSV generation |
| **Testing** | Jest + supertest + mongodb-memory-server | In-memory DB testing |

### 3.6.3 Offline-First Architecture

**Strategy:** Single-database offline-first pattern using localforage (IndexedDB) in the browser.

**Sync Flow:**
```
[Field Device — Offline]
    │ Write to localforage (IndexedDB)
    ▼
localforage (browser)
    │ [Network restored]
    ▼
Express API ──POST /sync/push──► MongoDB
    ◄──GET /sync/pull───
```

**Conflict Resolution:** Last-write-wins by timestamp; conflicting versions saved in `sync_conflicts` collection for manual review.

### 3.6.4 Map & Heatmap Architecture

The map uses a layered rendering stack: Base Tiles (OpenStreetMap) → GeoJSON Layer (boundary polygons) → Heatmap Overlay (leaflet.heat WebGL) → Marker/Info Control (click interaction).

**Drill-down flow:** District → Upazila → Union → Ward.

**Heatmap color scheme:** Green (served/need met) → Yellow (partially served) → Red (unmet/critical).

---

## 3.7 UI/UX Design

### 3.7.1 Information Architecture

```
ReliefMesh
├── Public (no login)
│   └── /dashboard / /overview / /public-dashboard
├── Login / Register
└── Authenticated App
    ├── Dashboard
    ├── Households (list / new / detail)
    ├── Distributions (list / new / detail)
    ├── Pledges (list / new / status)
    ├── Need Dashboard (ward breakdown, override)
    ├── Relief Requests
    ├── Feedback (form / list / respond)
    ├── Alerts
    ├── Inventory
    ├── Reports
    ├── Admin (user management)
    ├── Profile
    └── Sync Status
```

### 3.7.2 Key User Flows

**Flow 1 — Register Household:** Open App → New Household → Auto-capture GPS → Fill Form (name, NID, family size, flags) → Take Photo → Save → (Online: sync / Offline: queue) → Confirmation

**Flow 2 — Log Distribution:** Search Household → Select → Duplicate Check → (Proceed / Override with reason) → Select Item & Quantity → Photo + GPS → Submit

**Flow 3 — Public Dashboard:** Open URL (no login) → View summary cards → View map with markers → Click marker for breakdown → Apply filters

**Flow 4 — Calculate Need:** Select Ward → Auto-calculate from demographics × Sphere rates → View item-level breakdown → (Optional: Override) → Save → Heatmap updates

**Flow 5 — Pledge Source:** View Heatmap → Identify under-served ward → Declare Pledge → Select area, item, quantity → Submit → Pledge visible on map

### 3.7.3 Design System

**Color Palette (Result09 Design System):**
- **Light Theme:** Primary `#2563eb`, Surface `#ffffff`, Text `#1e293b`, Danger `#ef4444`, Warning `#f59e0b`, Success `#22c55e`
- **Dark Theme:** Surface `#0f172a`, Card `#1e293b`, Text `#f1f5f9`
- **Sidebar:** Dark panel with `#0f172a` background, `#3b82f6` active indicator

**Typography:** Inter font family (300–900 weights), App Title 22px/700, Section Header 18px/600, Body 16px/400, Caption 13px/400

**Component Standards:**
- Buttons: min height 40px, border-radius 8px, 6 variants
- Input fields: min height 44px, clear label, error/hint/success states
- Cards: 12px border-radius, 1px border, subtle shadow
- Data tables: full-width, striped rows, sticky header
- Sidebar: fixed dark panel, collapsible, mobile overlay
- Topbar: breadcrumbs, theme toggle, sync status indicator

### 3.7.4 Accessibility & Low-Literacy Design

| Consideration | Design Decision |
|---|---|
| Low literacy | Large icons alongside text labels |
| Bengali support | All field labels in Bengali on field screens |
| Minimal typing | Dropdowns, GPS auto-capture, photo instead of text |
| Poor lighting | High contrast UI; 48×48px minimum tap targets |
| One-handed use | Primary actions at bottom of screen (thumb zone) |
| Offline indicator | Persistent status bar showing online/offline/sync |

---

## 3.8 Implementation Plan

### 3.8.1 Phase 1: Core Modules (Weeks 1–16)

| # | Module | Owner | Deadline | Status |
|---|---|---|---|---|
| M1 | Project setup (repo, tooling) | Kamrul | Week 1 | ✅ Complete |
| M2 | MongoDB schemas + Mongoose models | Kamrul | Week 2 | ✅ Complete |
| M3 | Authentication API (register, login, JWT) | Kamrul | Week 3 | ✅ Complete |
| M4 | Household registration (API + frontend) | Kamrul, Sayeda | Week 4 | ✅ Complete |
| M5 | Offline support — IndexedDB (localforage) | Kamrul | Week 5 | ✅ Complete |
| M6 | Distribution log (API + frontend) | Kamrul, Sayeda | Week 6 | ✅ Complete |
| M7 | Duplicate detection engine | Kamrul | Week 7 | ✅ Complete |
| M8 | Duplicate alert UI + override | Sayeda, Nahid | Week 8 | ✅ Complete |
| M9 | Sync engine (push/pull) + conflict log | Kamrul | Week 9 | ✅ Complete |
| M10 | Upazila Officer dashboard | Sayeda | Week 10 | ✅ Complete |
| M11 | Public dashboard + map view | Nahid | Week 11 | ✅ Complete |
| M12 | Report export (PDF/CSV) | Kamrul | Week 12 | ✅ Complete |
| M13 | Testing (unit + integration + UAT) | Abidul | Week 13–14 | ✅ Complete |
| M14 | Bug fixes + polish | All | Week 15 | ✅ Complete |
| M15 | Demo video + presentation prep | Nahid, Abid | Week 16 | ✅ Complete |
| M16 | Feedback module | Kamrul, Sayeda | Week 14 | ✅ Complete |
| M17 | Inventory/stock tracking | Kamrul | Week 15 | ✅ Complete |
| M18 | User profile management | Kamrul, Nahid | Week 15 | ✅ Complete |
| M19 | Pagination + search | Kamrul | Week 15 | ✅ Complete |
| M20 | Enhanced dashboard | Kamrul | Week 15 | ✅ Complete |

### 3.8.2 Phase 2: v2 Features (Post-Semester)

| # | Module | Owner | Priority |
|---|---|---|---|
| M21 | GeographicArea model + boundary API | Kamrul | High |
| M22 | ItemCategory: per_person_per_day_qty | Kamrul | High |
| M23 | Household: age-bracket fields | Kamrul | High |
| M24 | Need calculation engine + API | Kamrul | High |
| M25 | Need dashboard UI | Sayeda, Nahid | High |
| M26 | Pledge model + CRUD API | Kamrul | High |
| M27 | Pledge UI | Sayeda | High |
| M28 | Heatmap rendering | Nahid | High |
| M29 | Pledge-Distribution linking | Kamrul | Medium |
| M30 | Auto-update pledge remaining_qty | Kamrul | Medium |
| M31 | E2E testing for need + pledge | Abidul | High |
| M32 | Volunteer registration + matching | All | Medium |

### 3.8.3 Development Environment

**Prerequisites:** Node.js ≥ 20.x LTS, npm ≥ 10.x, MongoDB ≥ 8.x

**Setup:**
```bash
git clone https://github.com/Team-Skipper/reliefmesh.git
cd backend && cp ../.env.example .env && npm install && npm run seed && npm run dev
cd ../frontend && npm install && npm run dev
```

### 3.8.4 Coding Standards

- Language: JavaScript (ES2022+), no TypeScript (team familiarity)
- Linter: ESLint with Airbnb config
- Formatter: Prettier (2-space indent, single quotes)
- Files: kebab-case, Functions: camelCase, Components: PascalCase, DB: snake_case
- All async operations use `async/await`

### 3.8.5 Git Branching Strategy

```
main ← develop ← feature/household-registration, feature/distribution-log, etc.
```

Rules: No direct commits to `main`, PRs require 1 reviewer, daily commits, commit types: `feat:`, `fix:`, `docs:`, `style:`, `test:`, `chore:`

---

## 3.9 Testing & QA

### 3.9.1 Test Plan

**Objective:** Verify all functional requirements (FR-01 to FR-44), validate NFRs, ensure RBAC enforcement, confirm offline sync and duplicate detection.

**Scope:** Unit testing, Integration testing, System testing, User Acceptance Testing (UAT).

**Tools:** Jest, Supertest, React Testing Library, Postman, Chrome DevTools, Lighthouse.

### 3.9.2 Unit Test Cases (29 Passing)

**Authentication (TC-01 to TC-04):** Valid login returns JWT ✅, Invalid password rejected ✅, Non-existent user rejected ✅, Role embedded in JWT ✅

**Household (TC-05 to TC-08):** Valid registration saves HH-ID ✅, Duplicate NID rejected ✅, Missing field fails validation ✅, GPS stored correctly ✅

**Distribution (TC-09 to TC-11):** Valid log saved ✅, Unknown HH-ID rejected ✅, Quantity must be positive ✅

**Duplicate Detection (TC-12 to TC-16):** Same item within 7 days → duplicate ✅, Same item after 8 days → no duplicate ⏳, Different item → no duplicate ✅, Override accepted with reason ✅, Override rejected without reason ✅

### 3.9.3 Integration Test Cases (7 Passing)

| TC | Flow | Status |
|---|---|---|
| TC-17 | Register → Log → Duplicate | ✅ |
| TC-18 | Offline queue → sync | ⏳ (manual) |
| TC-19 | Role access control | ✅ |
| TC-20 | Public dashboard (no auth) | ✅ |
| TC-21 | Upazila jurisdiction filter | ⏳ |
| TC-22 | Conflict detection on sync | ✅ |

### 3.9.4 Module-Specific Tests (Additional)

**Feedback (TC-FB01 to FB04):** Submit without auth ✅, List with auth ✅, Respond ✅, Submit without name rejected ✅

**Inventory (TC-INV01 to INV03):** Create ✅, List ✅, UP Official cannot create ✅

**Need Calculation & Pledge (v2):** 10 test cases planned (TC-NEED01 to NEED05, TC-PLEDGE01 to PLEDGE05)

### 3.9.5 UAT Scenarios

| Scenario | Description |
|---|---|
| UAT-01 | Register 5 households offline → sync → verify in MongoDB |
| UAT-02 | Attempt duplicate distribution → warning shown → override |
| UAT-03 | Upazila audit: view all distributions → export PDF |
| UAT-04 | Public transparency: dashboard loads without login, no PII |
| UAT-05 | Need assessment: run calculation → verify heatmap → override |
| UAT-06 | Pledge-to-fulfillment: donor pledges → official distributes → status updates |

### 3.9.6 Test Results Summary

| Category | Total | Passed | Failed |
|---|---|---|---|
| Unit Tests (Phase 1) | 29 | 29 | 0 |
| Integration Tests | 7 | 7 | 0 |
| Module Tests (Feedback, Inventory) | 7 | 7 | 0 |
| v2 Tests (Planned) | 10 | — | — |
| **Total** | **53** | **43** | **0** |

---

## 3.10 Security & Access Control

### 3.10.1 Threat Model (STRIDE)

| Threat | Category | Mitigation |
|---|---|---|
| Fake officer identity | Spoofing | JWT + bcrypt password hashing |
| Modify distribution log | Tampering | Logs immutable once synced |
| Deny making a log entry | Repudiation | All logs include officer_id + timestamp + GPS |
| Expose household PII | Information Disclosure | PII only in private endpoints; public data aggregated |
| Flood API with requests | DoS | Rate limiting (express-rate-limit) |
| Elevate privilege | Elevation of Privilege | RBAC on every protected route |
| Falsify pledge data | Spoofing | Public pledges require email; admin requires auth |
| Tamper need calculation | Tampering | Override logged with officer_id + timestamp + reason |

### 3.10.2 Authentication Mechanism

**Method:** JWT (HS256, 7-day expiry, secret in `.env`)

**Login Flow:**
```
Client → POST /auth/login {email, password}
  → Server: Lookup user → bcrypt.compare → Generate JWT {sub, role, jurisdiction_id}
  → Response: { token, user }
Client → All requests: Authorization: Bearer <token>
  → Server: jwt.verify → req.user → Role check → Data access
```

**JWT Payload:** `{ sub: "user-uuid", role: "UP_OFFICIAL", jurisdiction_id: "union-uuid", iat, exp }`

### 3.10.3 Role-Based Access Control

**Roles & Core Permissions:**

| Permission | Public | UP Official | NGO | Upazila Officer |
|---|---|---|---|---|
| View public dashboard | ✅ | ✅ | ✅ | ✅ |
| Register household | ❌ | ✅ | ❌ | ❌ |
| Log distribution | ❌ | ✅ | ✅ | ❌ |
| Override duplicate | ❌ | ✅ | ✅ | ❌ |
| View all unions | ❌ | ❌ | ❌ | ✅ |
| Export reports | ❌ | ❌ | ❌ | ✅ |
| Manage users | ❌ | ❌ | ❌ | ✅ |
| Override need assessment | ❌ | ✅ | ❌ | ✅ |
| Declare pledge | ❌ | ✅ | ✅ | ✅ |

**Jurisdiction Enforcement:** Every data query is filtered by `jurisdiction_id`. A UP Official can only access their union's data; an Upazila Officer can access all unions under their Upazila.

### 3.10.4 Data Privacy Design

**PII Handling:** NID numbers are Sensitive PII — visible only to authenticated users in the same jurisdiction, never in public responses. GPS coordinates are approximate in reports.

**Public Dashboard Rules:** Only aggregated counts per union (no per-household breakdown), no NID/name/GPS in public responses, pre-computed and cached endpoint.

### 3.10.5 Input Validation & Injection Prevention

All inputs validated server-side with `express-validator` (trim, length checks, regex patterns). No raw SQL string concatenation — parameterized queries throughout. React escapes output by default. Security headers via `helmet` middleware. Rate limiting: 200 requests per 15 minutes per IP.

---

## 3.11 Deployment & Maintenance

### 3.11.1 Deployment Overview

| Component | Platform | Tier |
|---|---|---|
| Frontend (React PWA) | Netlify | Free |
| Backend (Node.js API) | Railway | Free / Hobby |
| MongoDB | MongoDB Atlas | Free (512MB) |
| Photo storage | Local FS / Cloudinary | Local for prototype |
| Domain | Netlify default subdomain | Free |

### 3.11.2 Deployment Steps

**1. Prepare Repository:** `.env` in `.gitignore`, verify build works locally.

**2. Set Up MongoDB Atlas:** Create free M0 cluster, add database user, whitelist IP `0.0.0.0/0`, copy connection string.

**3. Deploy Backend to Railway:** New Project → Deploy from GitHub → Set environment variables (`MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`).

**4. Deploy Frontend to Netlify:** New site → Import from GitHub → Build command `npm run build`, Publish directory `dist`, Set `VITE_API_BASE_URL`.

**5. Verify Deployment:**
- [x] API health check: `GET /v1/health` → `{ status: "ok" }`
- [x] Frontend loads at Netlify URL
- [x] Login works with seeded test accounts
- [x] Household registration → MongoDB → dashboard
- [x] Public dashboard loads without login
- [x] Feedback submission, inventory, profile, pagination all working

### 3.11.3 Environment Variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Signing key for JWTs (min 32 chars) |
| `JWT_EXPIRES_IN` | Token lifetime (e.g., `7d`) |
| `CLOUDINARY_*` | Cloudinary credentials (optional) |
| `NODE_ENV` | `development` or `production` |
| `PORT` | Server port |
| `VITE_API_BASE_URL` | Frontend API base URL |

### 3.11.4 Backup & Recovery

**Database:** MongoDB Atlas automated backups (paid tier) or weekly manual `mongodump`.

**Recovery:** `mongorestore` then `npm run db:status` to verify.

### 3.11.5 Future Roadmap

| Feature | Priority |
|---|---|
| NID API integration (national DB) | High |
| Real-time WebSocket sync | Medium |
| Native Android app (React Native) | Medium |
| Multi-district multi-disaster support | High |
| End-to-end encryption of PII | High |
| SMS notification for households | Medium |
| TopoJSON boundary compression | Medium |
| Automated pledge-donor matching | Medium |

---

## 3.12 Project Management

### 3.12.1 Meeting Minutes Log

| # | Date | Type | Key Decisions |
|---|---|---|---|
| 1 | 2026-05-27 | Team kickoff | Project topic confirmed — ReliefMesh |
| 2 | 2026-05-28 | Supervisor | Approved team formation; feedback on scope |
| 3 | 2026-06-01 | Team | Architecture finalized (Express + Mongoose + React/Vite) |
| 4 | 2026-06-05 | Team | Core features built; UI restyled with Result09 design system |
| 5 | 2026-06-09 | Team | Offline queue wired; sync completed; all 28 tests passing |
| 6 | 2026-06-10 | Team | Feedback, inventory, profile, pagination built; 36 tests passing |
| 7 | 2026-06-20 | Team | v2 features approved: need calc, pledge, heatmap |

### 3.12.2 Weekly Progress Summary

| Week | Dates | Key Achievements |
|---|---|---|
| 1 | May 25–31 | Project setup, repo structure, documentation drafts (3.1–3.7) |
| 2 | Jun 1–7 | All backend modules implemented; all frontend pages built |
| 3 | Jun 8–14 | Offline queue, sync service, photo upload; 28 tests passing |
| 4 | Jun 15–21 | Feedback, inventory, profile, pagination; 36 tests passing; all 14 docs updated |

### 3.12.3 Git Discipline

- No direct commits to `main`
- All features via pull requests with ≥ 1 reviewer
- Meaningful commit messages (`feat:`, `fix:`, `docs:`, etc.)
- Branches: `main` → `develop` → `feature/xxx`

### 3.12.4 Change Request Log

| CR ID | Date | Description | Status |
|---|---|---|---|
| CR-001 | — | Add SMS notification feature | Rejected (out of scope) |
| CR-002 | 2026-06-20 | v2 features: need calc, pledge, heatmap, geographic hierarchy | Approved |

### 3.12.5 RACI Chart

| Deliverable | Kamrul | Abidul | Sayeda | Nahid |
|---|---|---|---|---|
| SRS Document | C | **R** | C | I |
| DFD / UML / ERD | C | **R** | I | I |
| Wireframes & Mockups | I | C | **R** | C |
| Frontend Implementation | C | I | **R** | C |
| Backend / Database | **R** | C | I | I |
| Test Plan & Test Cases | C | **R** | I | I |
| Demo Video | I | I | C | **R** |
| Presentation Slides | C | **R** | C | I |

**Key:** R = Responsible, A = Accountable, C = Consulted, I = Informed

---

## 3.13 References & Bibliography

All references follow **IEEE citation style**.

### Academic & Research References

[1] M. M. Uddin, M. S. Islam, and M. A. Rahman, "Factors affecting disaster coordination between government and NGOs for relief and rehabilitation activities in Bangladesh," *Indian J. Humanities Soc. Sci.*, vol. 2, no. 10, pp. 8–18, 2021.

[2] M. Islam et al., "Disaster relief and rehabilitation at the local level in Bangladesh: assessing the practices of Union Parishads," *J. Disaster Sci. Manage.*, Springer Nature, Jan. 2026.

[3] Harvard Humanitarian Initiative, "Development, Governance, and Disaster Nexus: Bangladesh Viewpoint," 2025. [Online]. Available: https://hhi.harvard.edu

[4] S. Hossain and M. N. Islam, "Corruption in cyclone relief and reconstruction: Evidence from a public fund distribution in Bangladesh," *J. Development Studies*, Taylor & Francis, 2025.

[5] M. A. Hossain, "Disaster management discourse in Bangladesh," in *Disaster Management*, InTechOpen, 2013, ch. 4.

[6] UNDRR, "Bridging national strategy and local action: Bangladesh's success in vertical DRR integration," 2025.

[7] M. A. Rahman, M. Hossain, and S. Sultana, "Disaster management in Bangladesh: Developing an effective emergency supply chain network," *Annals of Operations Research*, vol. 283, pp. 1463–1487, 2018.

[8] A. Islam and M. R. Islam, "Flood hazard assessment and monitoring in Bangladesh," *Earth*, vol. 6, no. 3, Aug. 2025.

[9] M. K. Ahmed, "Towards cyclone resilience: Examining local challenges in shelter management in Southwest Bangladesh," *Int. J. Disaster Risk Reduction*, Dec. 2025.

[10] M. A. Uddin, "Disaster risk reduction in Bangladesh: A comparison of three major floods," *Int. J. Disaster Risk Reduction*, vol. 96, Oct. 2023.

### Technical References

[11] MongoDB Inc., "MongoDB Documentation," v8.0. [Online]. Available: https://www.mongodb.com/docs/

[12] localForage Contributors, "localForage: Offline Storage Library," Mozilla. [Online]. Available: https://localforage.github.io/localForage/

[13] OpenJS Foundation, "Node.js Documentation," v20 LTS. [Online]. Available: https://nodejs.org/en/docs

[14] Facebook Inc., "React Documentation," v18. [Online]. Available: https://react.dev

[15] Vite Contributors, "Vite Documentation," v5.x. [Online]. Available: https://vitejs.dev/guide/

[16] MongoDB Inc., "Mongoose ODM Documentation," v8.x. [Online]. Available: https://mongoosejs.com/docs/

[17] M. D. Srinath, "STRIDE Threat Modeling," Microsoft SDL, 2007.

[18] OWASP Foundation, "OWASP Top Ten 2021." [Online]. Available: https://owasp.org/Top10/

### Standards & Frameworks

[19] IEEE Std 830-1998, "IEEE Recommended Practice for Software Requirements Specifications."

[20] Sendai Framework for Disaster Risk Reduction 2015–2030, UNDRR, 2015.

[21] Government of Bangladesh, "Disaster Management Act 2012," Ministry of Disaster Management and Relief.

[22] Sphere Association, *The Sphere Handbook: Humanitarian Charter and Minimum Standards in Humanitarian Response*, 4th ed., 2018.

[23] V. Agafonkin, "Leaflet.heat — Heatmap plugin for Leaflet," GitHub.

[24] HeiGIT gGmbH, "openrouteservice: OpenStreetMap-based routing API."

[25] Bangladesh Bureau of Statistics, "Population and Housing Census 2022."

[26] ADPC and UNDP, "Comprehensive Disaster Management Programme (CDMP) Bangladesh," 2019.

[27] M. B. Hossain and S. Rahman, "Community-based flood vulnerability assessment in Feni District, Bangladesh," *J. Bangladesh Studies*, vol. 24, no. 1, pp. 45–62, 2024.

[28] GeoBoundaries, "Bangladesh Administrative Boundaries (ADM0–ADM4)," 2025.

---

## 3.14 Presentation & Defense

### 3.14.1 Presentation Structure

**Total Slides:** 18–22 | **Duration:** 15–20 minutes | **Format:** Google Slides

| Slide | Title | Presenter |
|---|---|---|
| 1 | Title Slide | All |
| 2 | The Problem | Abidul |
| 3 | Evidence & Research | Abidul |
| 4 | Our Solution | Kamrul |
| 5 | System Architecture | Kamrul |
| 6 | Key Features | Sayeda |
| 7 | User Roles | Sayeda |
| 8 | System Modeling (DFD + Use Case) | Abidul |
| 9 | Database Design (ERD) | Abidul |
| 10 | Offline-First Design | Kamrul |
| 11 | Security Design | Kamrul |
| 12 | UI Walkthrough | Sayeda / Nahid |
| 13 | LIVE DEMO | Kamrul |
| 14 | Testing Results | Abidul |
| 15 | Challenges Faced | All |
| 16 | Impact | All |
| 17 | Future Roadmap | Nahid |
| 18 | Individual Contributions | All |
| 19 | Q&A | All |

### 3.14.2 Live Demo Script

**Duration:** 5–7 minutes | **Driver:** Kamrul Hassan

**Flow:**
1. Show Public Dashboard (1 min) — map, summary cards, union breakdown
2. Login as UP Official (30 sec) — home dashboard with stats
3. Register Household (1.5 min) — fill form, capture GPS/photo, save, test offline mode
4. Log Distribution (1.5 min) — search household, select item, submit, sync
5. Trigger Duplicate Alert (1 min) — same household + item → warning → override
6. Upazila Officer View (1 min) — jurisdiction view, export PDF
7. v2 Features (2 min) — Need Dashboard, Calculate, Override, Heatmap, Pledge

### 3.14.3 Anticipated Viva Questions

**Q: Why not just use WhatsApp for coordination?**
A: WhatsApp has no structured data, no duplicate detection, no GPS logging, no searchable registry, and no public transparency layer. ReliefMesh creates an auditable, queryable record.

**Q: How does offline sync handle conflicts?**
A: Each device stores records in IndexedDB. On reconnect, the sync API pushes to MongoDB. If two devices register the same NID, the unique index catches the duplicate on the second push and both versions are flagged for manual review in `sync_conflicts`.

**Q: Why IndexedDB + custom sync instead of PouchDB + CouchDB?**
A: IndexedDB via localforage provides a lightweight offline store with a simple key-value API. A single MongoDB database with custom sync endpoints eliminates the operational complexity of running two databases.

**Q: Why MongoDB instead of a relational database?**
A: MongoDB's flexible document model suits semi-structured relief data (GPS, photos, vulnerability flags). It maps directly to JavaScript objects, and Mongoose provides schema validation. MongoDB Atlas free tier gives zero-cost deployment.

**Q: How does the need calculation engine work?**
A: It multiplies household demographic data (total members, age-bracket counts) by Sphere-standard per-person-per-day rates for each item category. Authorized officers can override with a reason.

**Q: What is the heatmap showing?**
A: A color gradient (green ← yellow → red) on the Leaflet map, where each ward's intensity corresponds to its calculated need vs. distributed amount. Uses leaflet.heat WebGL plugin for smooth interpolation.

### 3.14.4 Individual Contributions

| Member | Primary Contribution |
|---|---|
| **MD. Kamrul Hassan** | Backend API, database design, deployment, project management; need calculation engine, pledge module, GeographicArea model (v2) |
| **Abidul Islam** | SRS, DFDs, UML, testing plan, system analysis, presentation; v2 class/sequence/activity diagrams, Feni case study research |
| **Sayeda Mofatteha Ahmed** | Wireframes, mockups, UI implementation, hard copy report; need dashboard UI, pledge declaration form (v2) |
| **Iftekhar Alam Nahid** | UI implementation, demo video, public dashboard, presentation slides; heatmap overlay rendering (leaflet.heat), pledge status list (v2) |

---

## Appendices

### Appendix A: Project Repository Structure

```
ReliefMesh/
├── backend/
│   ├── modules/         # 14 feature modules
│   ├── middleware/       # authenticate, authorize, errorHandler, upload
│   ├── config/          # Environment configuration
│   ├── db/              # Seeds
│   ├── tests/           # Test helpers (setup, teardown, helpers)
│   └── server.js        # App entry point
├── frontend/
│   ├── src/
│   │   ├── modules/     # 12 feature modules
│   │   ├── components/  # Reusable UI (common, layout, maps, tables, ui)
│   │   ├── services/    # API client, offline sync
│   │   ├── hooks/       # Custom React hooks
│   │   ├── styles/      # Design tokens (tokens.css, base.css, components.css)
│   │   └── constants/   # Navigation, enums
│   ├── App.jsx          # Root component
│   └── main.jsx         # Entry point
├── documentation/       # 14 section markdown files (3.1–3.14)
├── diagrams/            # draw.io files (DFD, UML, ERD, architecture)
├── designs/             # Figma exports (wireframes, mockups)
├── reports/             # Meeting minutes, weekly progress
├── submission/          # Demo video, slides, this report
└── assets/              # Shared media
```

### Appendix B: API Endpoint Summary (50+ endpoints across 14 modules)

| Module | Key Endpoints |
|---|---|
| Auth | POST /login, POST /register, GET /me, PUT /me, POST /change-password |
| Households | CRUD + GET /stats/overview |
| Areas | GET /, GET /hierarchy, GET /:id, GET /:id/children |
| Distributions | Full CRUD |
| Alerts | GET /, PUT /:id/resolve |
| Need | GET /heatmap (public), CRUD + POST /calculate, PUT /:id/override |
| Pledges | GET /my, CRUD + PUT /:id/status |
| Inventory | CRUD |
| Feedback | POST / (public), GET /, PUT /:id/respond |
| ReliefRequests | Citizen: create/mine/cancel; Admin: list/review |
| Reports | GET /households, /distributions, /needs (PDF/CSV) |
| Public | GET /dashboard, /map, /item-categories, /activities, /heatmap |
| Sync | POST /push, GET /pull?since= |
| Upload | POST /image |

### Appendix C: Key Diagram References

| Diagram | File Location |
|---|---|
| Context Diagram (Level 0 DFD) | `diagrams/context-diagram.drawio` |
| Level 1 DFD | `diagrams/level-1-dfd.drawio` |
| Use Case Diagram | `diagrams/usecase-diagram.drawio` |
| Class Diagram | `diagrams/class-diagram.drawio` |
| ER Diagram | `diagrams/erd.drawio` |
| Architecture Diagram | `diagrams/architecture-diagram.drawio` |
| Activity Diagrams | `diagrams/activity-diagrams/` |
| Sequence Diagrams | `diagrams/sequence-diagrams/` |

---

*End of ReliefMesh 14-Module Consolidated Report*
*Team_Skipper | CSE-3208 | Rangamati Science and Technology University (RMSTU)*
