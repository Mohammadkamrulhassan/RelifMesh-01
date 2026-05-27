# Section 3.4 — System Modeling (DFD & UML)
**Project:** RelifMesh — Disaster Relief Coordination System for Local Government
**Team:** Team_Skipper | **Course:** CSE-3208 System Analysis & Design Lab
**Last Updated:** 2026-05-27

> **Note:** All diagrams referenced here are stored as `.drawio` files in `/Diagrams/`. This document describes each diagram in text for the written report. Render diagrams using draw.io or Lucidchart and export as PNG/PDF for the final report appendix.

---

## 3.4.1 Context Diagram (Level 0 DFD)

The context diagram shows RelifMesh as a single process interacting with all external entities.

```
            ┌─────────────────────────────────────┐
            │                   │
 UP Official ─────────►│                   │──────► Public Dashboard
 NGO Worker ─────────►│     RelifMesh System      │
 Upazila Officer ──────►│  (Disaster Relief Coordination)  │──────► Distribution Report
            │                   │
 General Public ───────►│                   │──────► Duplicate Alert
            └─────────────────────────────────────┘
                    │
                    ▼
                Household Registry
                Distribution Logs
```

**External Entities:**
| Entity | Input to System | Output from System |
|--------|----------------|-------------------|
| UP Official | Household data, distribution logs | HH-ID, duplicate warnings |
| NGO Worker | Distribution logs | Duplicate warnings |
| Upazila Officer | Audit queries, report requests | Filtered reports, audit views |
| General Public | Dashboard queries | Aggregated distribution summaries |

---

## 3.4.2 Level 1 DFD

Decomposes the system into 5 major processes:

```
          ┌──────────────────────────────────────────────────────────┐
          │           RelifMesh              │
          │                             │
 UP Official ──────► P1: User     ──► D1: User Store          │
 NGO Worker     Authentication                      │
 Upazila Officer                               │
          │                             │
 UP Official ──────► P2: Household  ──► D2: Household Registry      │
          │  Registration                      │
          │                             │
 UP Official ──────► P3: Distribution ──► D3: Distribution Log       │
 NGO Worker     Log Entry   ◄──── D2: Household Registry       │
          │                             │
          │ P4: Duplicate  ◄──── D3: Distribution Log       │
          │ Detection   ──────► Duplicate Alert (to user)    │
          │                             │
 General Public ───► P5: Public    ◄──── D3: Distribution Log       │──► Dashboard
 Upazila Officer ──► Dashboard &   ◄──── D2: Household Registry      │──► Reports
          │ Reporting                        │
          └──────────────────────────────────────────────────────────┘
```

**Data Stores:**
| ID | Name | Contents |
|----|------|----------|
| D1 | User Store | User accounts, roles, jurisdictions, hashed passwords |
| D2 | Household Registry | HH-ID, NID, name, GPS, family size, vulnerability flags, photo |
| D3 | Distribution Log | Log ID, HH-ID, item category, quantity, officer ID, GPS, timestamp, photo, sync status |
| D4 | Conflict Log | Conflicting record pairs, timestamps, resolution status |

---

## 3.4.3 Level 2 DFD — P3: Distribution Log Entry (Decomposed)

```
 User ──────► P3.1: Validate   ──► D2: Household Registry (lookup)
        Household ID
          │
          ▼
        P3.2: Duplicate   ◄──── D3: Distribution Log
        Check
          │
       ┌─────┴──────┐
    No Dup│       │Dup Found
       ▼       ▼
     P3.3: Capture  P3.4: Show
     Distribution  Warning &
     Data (photo,  Request
     GPS, item)   Override
       │       │
       └──────┬──────┘
           ▼
        P3.5: Save      ──► D3: Distribution Log
        Log Entry      ──► D4: Conflict Log (if override)
```

---

## 3.4.4 Use Case Diagram

**Actors:** UP Official, NGO Worker, Upazila Officer, General Public, System (automated)

```
┌─────────────────────────────────────────────────────────────┐
│            RelifMesh System           │
│                               │
│  (Register Household) ◄──── UP Official          │
│  (Log Distribution)  ◄──── UP Official, NGO Worker    │
│  (Override Duplicate) ◄──── UP Official, NGO Worker    │
│  (Search Household)  ◄──── UP Official, NGO Worker    │
│  (View Own Dashboard) ◄──── UP Official          │
│                               │
│  (Audit Union Data)  ◄──── Upazila Officer        │
│  (Export Reports)   ◄──── Upazila Officer        │
│  (Manage UP Accounts) ◄──── Upazila Officer        │
│                               │
│  (View Public Dashboard) ◄── General Public        │
│  (View Map View)     ◄── General Public        │
│                               │
│  (Sync Offline Data) ◄──── System (automated)      │
│  (Detect Duplicates) ◄──── System (automated)      │
│  (Generate Alerts)  ◄──── System (automated)      │
│                               │
└─────────────────────────────────────────────────────────────┘
```

**Include / Extend relationships:**
- `Log Distribution` **includes** `Duplicate Check`
- `Override Duplicate` **extends** `Log Distribution`
- `Sync Offline Data` **includes** `Conflict Detection`

---

## 3.4.5 Class Diagram

```
┌──────────────────┐    ┌──────────────────────┐
│   User    │    │   Household    │
├──────────────────┤    ├──────────────────────┤
│ userId: String  │    │ hhId: String     │
│ name: String   │    │ headName: String   │
│ email: String  │    │ nid: String      │
│ passwordHash: Str│    │ gps: GeoPoint     │
│ role: Enum    │    │ familySize: Int    │
│ organization: Str│    │ vulnerabilityFlags:[] │
│ jurisdictionId:Str    │ photoUrl: String   │
│ createdAt: Date │    │ registeredBy: UserId │
├──────────────────┤    │ unionId: String    │
│ authenticate()  │    │ createdAt: Date    │
│ hasPermission() │    ├──────────────────────┤
└────────┬─────────┘    │ register()      │
     │ 1        │ search()       │
     │ logs       │ update()       │
     ▼ *        └──────────┬────────────┘
┌──────────────────────┐       │ 1
│  DistributionLog  │◄─────────────┘ receives
├──────────────────────┤       * 
│ logId: String    │
│ hhId: String     │  ┌──────────────────────┐
│ itemCategory: Enum  │  │  DuplicateAlert   │
│ quantity: Float   │  ├──────────────────────┤
│ unit: String     │  │ alertId: String    │
│ officerId: String  │  │ hhId: String     │
│ gps: GeoPoint    │  │ itemCategory: Enum  │
│ photoUrl: String   │  │ priorLogId: String  │
│ timestamp: DateTime │  │ resolvedBy: String  │
│ syncStatus: Enum   │  │ overrideReason: String│
│ overrideFlag: Bool  │  ├──────────────────────┤
│ overrideReason: String  │ generate()      │
├──────────────────────┤  │ resolve()       │
│ save()        │  └──────────────────────┘
│ sync()        │
└──────────────────────┘
```

**Enums:**
- `Role`: UP_OFFICIAL, UPAZILA_OFFICER, NGO_WORKER, PUBLIC
- `ItemCategory`: FOOD, WASH, SHELTER, OTHER
- `SyncStatus`: PENDING, SYNCED, CONFLICT

---

## 3.4.6 Sequence Diagrams

### SD-01: Household Registration (Offline)

```
UP Official  App (PWA)   Local DB (IndexedDB)  Server (MongoDB)
  │        │         │          │
  │──Register──► │         │          │
  │        │──GPS Capture──► │          │
  │        │──Save Record──► │ (offline queue)  │
  │        │◄──HH-ID──────── │          │
  │◄──Confirm─── │         │          │
  │        │         │          │
  │     [Network Restored]   │          │
  │        │──────────────── Sync ──────────────► │
  │        │         │◄──── ACK ──────────│
  │        │──Clear Queue──► │          │
```

---

### SD-02: Distribution Log with Duplicate Check

```
Officer   App (PWA)  Local DB   Server   DuplicateEngine
  │       │      │      │       │
  │──Search──► │      │      │       │
  │       │──Query──► │      │       │
  │       │◄──HH Data──│      │       │
  │       │────────────────────────────────────► │
  │       │      │      │◄──Check Log──│
  │       │      │      │──────────►  │
  │       │      │      │◄──Result──  │
  │    [No Duplicate]   │      │       │
  │       │◄──────────────── Clear ───────────────│
  │──Enter Data─►│      │      │       │
  │       │──Save Log──►│      │       │
  │       │─────────────────── Sync ──────────►  │
  │◄──Confirm── │      │      │       │
```

---

### SD-03: Sync Conflict Resolution

```
App (PWA)     Server      ConflictLog
  │         │         │
  │──Sync Record──► │         │
  │         │──Check Exists──► │
  │         │◄──Conflict────── │
  │         │──Save Both──────►│
  │         │──Flag Review────►│
  │◄──Conflict Notice│         │
  │         │         │
```

---

## 3.4.7 Activity Diagram — Relief Distribution Workflow

```
   [Officer Opens App]
       │
       ▼
   [Search Household by HH-ID / Name]
       │
    ┌──────┴──────┐
  Found?     Not Found
    │        │
    ▼        ▼
 [Select HH]  [Register New HH]
    │        │
    └──────┬─────────┘
       ▼
  [Select Item Category & Quantity]
       │
       ▼
  [System Runs Duplicate Check]
       │
    ┌──────┴──────────┐
  No Duplicate    Duplicate Found
    │          │
    ▼          ▼
 [Capture Photo]  [Show Warning]
 [Confirm GPS]     │
    │      ┌─────┴──────┐
    │    Override?   Cancel
    │      │       │
    │      ▼       ▼
    │   [Enter Reason]  [END - No Log]
    │      │
    └──────┬─────┘
       ▼
    [Save Log Entry]
       │
    ┌──────┴──────┐
  Online?    Offline?
    │        │
    ▼        ▼
 [Sync to Server] [Queue Locally]
    │        │
    └──────┬─────────┘
       ▼
    [Show Confirmation]
       │
       END
```

---

*End of Section 3.4 — Next: Section 3.5 Database Design (ERD)*
