# Section 3.4 — System Modeling (DFD & UML)
**Project:** ReliefMesh — Disaster Relief Coordination System for Local Government
**Team:** Team_Skipper | **Course:** CSE-3208 System Analysis & Design Lab
**Last Updated:** 2026-06-09

> **Note:** All diagrams referenced here are stored as `.drawio` files in `/Diagrams/`. This document describes each diagram in text for the written report. Render diagrams using draw.io or Lucidchart and export as PNG/PDF for the final report appendix.

---

## 3.4.1 Context Diagram (Level 0 DFD)

The context diagram shows ReliefMesh as a single process interacting with all external entities.

```
            ┌─────────────────────────────────────┐
            │                   │
 UP Official ─────────►│                   │──────► Public Dashboard
 NGO Worker ─────────►│     ReliefMesh System      │
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
          │           ReliefMesh              │
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

### 3.4.2.1 Level 1 DFD Extension — New Processes

**P6: Need Calculation** — Input: Household Registry (D2) demographic fields (age-bracket counts) → Output: D7 NeedAssessment store. Reads household census for a jurisdiction, multiplies by Sphere-derived per-person rates from D6 (extended ItemCategory with per_person_per_day_amount), writes calculated need; accepts officer override.

**P7: Pledge Management** — Input: Source declaration (area, items, qty, teams, volunteers) → Output: D8 Pledge store. Updates pledge status over its lifecycle; feeds into P5 (Dashboard) for map display.

**P5: Public Dashboard & Reporting** — *Upgraded:* now reads D7 (NeedAssessment) and D8 (Pledge) in addition to existing D2/D3, to produce the heatmap and pledge-overlay views.

**Updated Data Stores:**

| ID | Name | Contents |
|----|------|----------|
| D1 | User Store | User accounts, roles, jurisdictions, hashed passwords |
| D2 | Household Registry | HH-ID, NID, name, GPS, family size, age-bracket counts, vulnerability flags, photo |
| D3 | Distribution Log | Log ID, HH-ID, item category, quantity, officer ID, GPS, timestamp, photo, sync status, pledge_id (optional FK) |
| D4 | Conflict Log | Conflicting record pairs, timestamps, resolution status |
| D5 | Feedback Store | Feedback entries with name, contact, category, message, response |
| D6 | Inventory Store | Stock levels per item category, distributed quantities; item categories now include per_person_per_day_amount for need calculation |
| **D7** | **NeedAssessment** | jurisdiction_id, item_category_id, calculated_qty, override_qty, override_reason, computed_at |
| **D8** | **ReliefPledge** | pledge_id, source_id, source_type, jurisdiction_id, item_category_id, pledged_qty, team_count, volunteer_count, status, created_at, updated_at |

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
│            ReliefMesh System           │
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

### 3.4.4.1 Use Case Diagram Extension (v2 Features)

**New Actors:** Outside Individual Donor, Local Volunteer, Volunteer Teams (see §3.2)

```
                          ┌────────────────────────────────────────────┐
                          │           ReliefMesh System (v2)           │
                          │                                            │
  Outside Individual Donor ───► (Declare Pledge)        │
  Local Volunteer            ───► (Receive Pledge-Matched    │
  Volunteer Teams            ───►  Supplies)                │
                          │                                            │
  UP Official / Upazila Off. ──► (Calculate Area Need)    │
                          │ (Override Calculated Need)    │
                          │                                            │
  General Public             ───► (View Need Heatmap)      │
                          │ (View Active Pledges)        │
                          └────────────────────────────────────────────┘
```

**New include/extend:**
- `Declare Pledge` **includes** `Pledge Validation` (item category + jurisdiction must exist)
- `Calculate Area Need` **includes** `Read Household Census` (age-bracket data)
- `Override Need` **extends** `Calculate Area Need`
- `Log Distribution` **extended** — now optionally references `pledge_id` when distribution fulfills a pledge
- `View Need Heatmap` **includes** `Aggregate Ward-Level Need` (rolls up NeedAssessment by ward)
- `View Active Pledges` **extends** `View Need Heatmap`

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

**Additional Classes (Feedback & Inventory):**
- **Feedback**: feedbackId, name, contact, category (COMPLAINT/SUGGESTION/INQUIRY/APPRECIATION/OTHER), message, isRead, response, respondedBy, respondedAt
- **Inventory**: inventoryId, itemCategoryId (FK), totalQuantity, distributedQuantity, remainingQuantity (virtual), unit, lastRestockedAt

**Enums:**
- `Role`: UP_OFFICIAL, UPAZILA_OFFICER, NGO_WORKER, PUBLIC
- `ItemCategory`: FOOD, WASH, SHELTER, OTHER
- `SyncStatus`: PENDING, SYNCED, CONFLICT

### 3.4.5.1 Class Diagram Extension (v2 Features)

```
┌──────────────────────────────────┐    ┌──────────────────────────────┐
│        NeedAssessment      │    │        ReliefPledge       │
├──────────────────────────────────┤    ├──────────────────────────────┤
│ assessmentId: String        │    │ pledgeId: String         │
│ jurisdictionId: String      │    │ sourceId: String          │
│ itemCategoryId: String      │    │ sourceType: SourceType    │
│ calculatedQty: Float       │    │ jurisdictionId: String    │
│ overrideQty: Float (nullable)   │    │ itemCategoryId: String    │
│ overrideReason: String (nullable)│    │ pledgedQty: Float        │
│ computedAt: DateTime       │    │ teamCount: Int (nullable) │
│ overriddenAt: DateTime (nullable)│    │ volunteerCount: Int (nullable)│
│ overriddenBy: String (nullable)  │    │ description: String      │
├──────────────────────────────────┤    │ status: PledgeStatus     │
│ calculate()                │    │ createdAt: DateTime     │
│ acceptOverride()           │    │ updatedAt: DateTime     │
└──────────────────────────────────┘    ├──────────────────────────────┤
                              │ declare()              │
┌──────────────────────────────────┐    │ fulfill()               │
│    GeographicArea (new)    │    │ cancel()                │
├──────────────────────────────────┤    └──────────────────────────────┘
│ areaId: String              │
│ level: AreaLevel            │                 1
│ nameBn: String              │                 │
│ nameEn: String              │                 │ pledges
│ parentId: String (nullable) │                 ▼
│ geometry: GeoJSON           │    ┌──────────────────────────────┐
├──────────────────────────────────┤    │   DistributionLog (updated) │
│ getChildren()               │    ├──────────────────────────────┤
│ getParent()                 │    │ ...existing fields...        │
└──────────────────────────────────┘    │ pledgeId: String (nullable)│
                              ├──────────────────────────────┤
**New Enums:**                      │ save()                      │
- `SourceType`: DONOR, NGO,         │ sync()                      │
  LOCAL_VOLUNTEER, VOLUNTEER_TEAM   └──────────────────────────────┘
- `PledgeStatus`: PENDING,
  IN_FULFILLMENT, COMPLETED,
  CANCELLED
- `AreaLevel`: DIVISION, DISTRICT,
  UPAZILA, UNION, WARD
```

**Updated associations:**
- `DistributionLog.pledgeId` → optional FK to `ReliefPledge.pledgeId` (many-to-one)
- `NeedAssessment.jurisdictionId` → FK to `GeographicArea.areaId` (many-to-one, where level = WARD)
- `ReliefPledge.sourceId` → generic reference (user ID or org ID depending on source type)
- `GeographicArea.areaId` → used by `User.jurisdictionId` (already FK-implied), now also by `Household.unionId` and new NeedAssessment

---

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

### SD-04: Need Calculation with Override

```
UP Official    Server (NeedEngine)   Household Registry   NeedAssessment
     │                │                     │                   │
     │──Open Ward────►│                     │                   │
     │   Dashboard    │                     │                   │
     │                │──Read Demographics──►│                   │
     │                │◄──Age-Bracket Data──│                   │
     │                │                     │                   │
     │                │──Apply Sphere Rates─────►              │
     │                │──Write Calculated Qty───►              │
     │◄──Show Need────│                     │                   │
     │   Breakdown    │                     │                   │
     │                │                     │                   │
     │──Edit Qty─────►│                     │                   │
     │   [Override]   │──Store Override────────►              │
     │                │  (with reason)      │                   │
     │◄──Updated──────│                     │                   │
     │   Heatmap      │                     │                   │
```

### SD-05: Pledge Declaration → Fulfillment

```
Donor    ReliefMesh (Web)   Pledge Store   DistributionLog   NeedEngine
  │           │                 │                │               │
  │──Declare──►│                 │                │               │
  │  Pledge    │──Validate──────►│                │               │
  │           │  (area + item)  │                │               │
  │           │◄──ACK──────────│                │               │
  │◄──Pledge──│                 │                │               │
  │   ID      │                 │                │               │
  │           │                 │                │               │
  │[Later, UP Official distributes items]         │               │
  │           │                 │                │               │
Officer      App              │                │               │
  │──Log─────►│                 │                │               │
  │  Distro   │──Lookup Pledge─►│                │               │
  │  w/ ref   │◄──Pledge Data──│                │               │
  │           │──Save Distro──────────────────►  │               │
  │           │                 │                │               │
  │           │──Update Pledge──►│                │               │
  │           │  Status [IN_FLIGHT]│                │               │
  │◄──Confirm─│                 │                │               │
  │           │                 │                │               │
  │[When pledged qty reached]   │                │               │
  │           │──Mark Fulfilled─►│                │               │
  │           │                 │──Adjust Ward Need────────►   │
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

### 3.4.7.1 Pledge-to-Distribution Workflow (v2)

```
   [Source Views Heatmap]
        │
        ▼
   [Identifies Under-Served Ward]
        │
        ▼
   [Declares Pledge via Web Portal]
        │
   ┌─────┴──────┐
   [System Validates: Area & Item exist?]
        │
    ┌───┴───┐
  Valid   Invalid
    │       │
    ▼       ▼
 [Pledge   [Show Error &
  Created]  Request Correct]
    │       │
    └───┬───┘
        ▼
   [Status: PENDING]
        │
        ▼
   [UP Official notified of new pledge]
        │
        ▼
   [Log Distribution referencing pledge_id]
        │
        ▼
   [Status: IN_FULFILLMENT]
        │
   ┌────┴────┐
[More items to fulfill?]
   Yes      No (pledged qty reached)
    │        │
    ▼        ▼
 [Continue]  [Pledge Status: COMPLETED]
    │        │
    ▼        ▼
         [Heatmap updates: need qty decreases]
              │
              END
```

---

*End of Section 3.4 — Next: Section 3.5 Database Design (ERD)*
