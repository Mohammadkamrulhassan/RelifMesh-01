# ReliefMesh — Data Flow Diagrams

## Context Diagram (DFD Level 0)

```
                    ┌──────────────────────────┐
                    │                          │
                    │     UPAZILA OFFICER      │
                    │  (Upazila Nirbahi Office)│
                    │                          │
                    └──────────┬───────────────┘
                               │
             ┌─────────────────┼──────────────────┐
             │  Reports,       │  User mgmt,      │
             │  Alerts,        │  Households,     │
             │  Feedback       │  Distributions   │
             │                 │                   │
             ▼                 ▼                   ▼
   ┌─────────────────────────────────────────────────────┐
   │                                                     │
   │                   RELIEFMESH                         │
   │             Disaster Relief System                  │
   │                                                     │
   │   ┌──────────┐  ┌──────────┐  ┌────────────────┐   │
   │   │Households│  │Distrib's │  │Relief Requests │   │
   │   └──────────┘  └──────────┘  └────────────────┘   │
   │                                                     │
   └─────────────────────────────────────────────────────┘
          │              │              │
          │              │              │
          ▼              ▼              ▼
 ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐
 │ UP OFFICIAL  │ │ NGO WORKER   │ │    CITIZEN       │
 │ (Union       │ │ (BRAC, etc.) │ │ (General Public) │
 │  Parishad)   │ │              │ │                  │
 └──────────────┘ └──────────────┘ └──────────────────┘
   Register         Log              Submit relief
   households,      distributions    requests, view
   log distrib's                      dashboard
```

### External Entities

| Entity | Role | Data Flows (In) | Data Flows (Out) |
|--------|------|-----------------|------------------|
| **UPAZILA_OFFICER** | Admin & oversight | Reports, Alerts, Dashboard | User registration, Household management, Feedback mgmt |
| **UP_OFFICIAL** | Field-level registration | Household data, Distribution status | Household registration, Distribution logs |
| **NGO_WORKER** | Relief distribution | Distribution status, Alerts | Distribution logs |
| **CITIZEN** | Beneficiary | Relief request status, Dashboard | Relief requests, Feedback |

---

## Level 1 DFD — Main Processes

### Process 1: Authentication & User Management

```
 ┌──────────┐    Credentials    ┌──────────────┐
 │  Entity  │ ────────────────  │  Process 1   │
 │ (Any)    │ ◄──────────────── │ Authenticate │
 └──────────┘      Token        └──────┬───────┘
                                        │
                              ┌─────────▼─────────┐
                              │   Data Store       │
                              │   D1 — Users       │
                              └───────────────────┘
```

**Sub-processes:**
- 1.1 Login (any role)
- 1.2 Register Citizen (public)
- 1.3 Register Official (UPAZILA_OFFICER only)
- 1.4 Get/Update Profile (any authenticated)
- 1.5 List Users (UPAZILA_OFFICER)

### Process 2: Household Management

```
 ┌──────────┐   Household Data   ┌──────────────┐
 │UP_OFFICIAL│ ────────────────  │  Process 2   │
 │UPAZILA_  │ ◄──────────────── │  Manage      │
 │ OFFICER  │   Household List   │  Households  │
 └──────────┘                    └──────┬───────┘
                                        │
                              ┌─────────▼─────────┐
                              │   Data Store       │
                              │   D2 — Households  │
                              └───────────────────┘
```

**Sub-processes:**
- 2.1 Create Household
- 2.2 List/Search Households
- 2.3 Get Household Detail
- 2.4 Update Household

### Process 3: Distribution Management

```
 ┌──────────┐   Distribution     ┌──────────────┐
 │UP_OFFICIAL│ ────────────────  │  Process 3   │
 │NGO_WORKER│ ◄──────────────── │  Manage      │
 │          │   Distribution List│Distributions │
 └──────────┘                    └──────┬───────┘
                                        │
                              ┌─────────▼─────────┐
                              │   Data Store       │
                              │   D3 — Distrib.    │
                              │        Logs        │
                              └───────────────────┘
```

**Sub-processes:**
- 3.1 Create Distribution Log (with duplicate check)
- 3.2 List Distributions
- 3.3 Get Distribution Detail
- 3.4 Update Distribution
- 3.5 Delete Distribution

### Process 4: Relief Request Management

```
 ┌──────────┐   Relief Request   ┌──────────────┐
 │ CITIZEN  │ ────────────────  │  Process 4   │
 │          │ ◄──────────────── │  Manage      │
 │          │   Request Status  │  Relief      │
 │          │                   │  Requests    │
 └──────────┘                   └──────┬───────┘
                                        │
                              ┌─────────▼─────────┐
                              │   Data Store       │
                              │   D4 — Relief      │
                              │        Requests    │
                              └───────────────────┘
         ▲
         │ Review Decision
 ┌───────┴────────┐
 │ UPAZILA_OFFICER│
 │ UP_OFFICIAL    │
 └────────────────┘
```

**Sub-processes:**
- 4.1 Submit Relief Request (CITIZEN)
- 4.2 List My Requests (CITIZEN)
- 4.3 Cancel Request (CITIZEN)
- 4.4 List All Requests (Officials)
- 4.5 Review Request (Officials)

### Process 5: Dashboard & Reporting

```
 ┌──────────┐   Dashboard View   ┌──────────────┐
 │  Any     │ ────────────────  │  Process 5   │
 │  Role    │ ◄──────────────── │  Dashboard   │
 │          │   Stats & Charts  │  & Reports   │
 └──────────┘                   └──────┬───────┘
                                        │
         ┌──────────────────────────────┼──────────────┐
         │                              │              │
         ▼                              ▼              ▼
 ┌────────────┐  ┌────────────┐  ┌────────────┐
 │ D2 — House.│  │ D3 — Dist. │  │ D4 — Relief│
 └────────────┘  └────────────┘  └────────────┘
```

**Sub-processes:**
- 5.1 Public Dashboard (no auth)
- 5.2 Admin Dashboard (authenticated)
- 5.3 Generate Reports (UPAZILA_OFFICER)

### Process 6: Feedback Management

```
 ┌──────────┐   Submit Feedback  ┌──────────────┐
 │  Any     │ ────────────────  │  Process 6   │
 │  Role    │ ◄──────────────── │  Manage      │
 │          │                   │  Feedback    │
 └──────────┘                   └──────┬───────┘
                                        │
                              ┌─────────▼─────────┐
                              │   Data Store       │
                              │   D5 — Feedback    │
                              └───────────────────┘
         ▲
         │ Manage
 ┌───────┴────────┐
 │ UPAZILA_OFFICER│
 └────────────────┘
```

**Sub-processes:**
- 6.1 Submit Feedback (any role, public API)
- 6.2 List Feedback (UPAZILA_OFFICER)

---

## Data Stores

| Store | Description | Key Fields |
|-------|-------------|------------|
| D1 — Users | Registered users (all roles) | \_id, name, email, passwordHash, role, jurisdictionId, phone, address, isActive |
| D2 — Households | Registered households | \_id, headName, nid, gps, familySize, familyMembers[], vulnerabilityFlags, jurisdictionId, registeredBy |
| D3 — DistributionLogs | Distribution records | \_id, householdId, officerId, itemCategoryId, quantity, unit, gps, distributedAt, syncStatus |
| D4 — ReliefRequests | Citizen relief requests | \_id, citizenId, items[], status, priority, location, jurisdictionId, reviewedBy, reviewedAt |
| D5 — Feedback | Citizen feedback | \_id, userId, message, isRead |
| D6 — ItemCategories | Relief item types | \_id, name, isActive |
| D7 — Jurisdictions | Geographic areas | \_id, name, level (DISTRICT/UPAZILA/UNION), parentId |
| D8 — DuplicateAlerts | Override tracking | \_id, householdId, priorLogId, triggeredLogId, isResolved |

---

## Data Flow Matrix

| Data Flow | Source | Destination | Description |
|-----------|--------|-------------|-------------|
| Login credentials | Any Entity | P1 Authenticate | Email + password |
| JWT Token | P1 Authenticate | Any Entity | Authentication token |
| Register data | CITIZEN | P1.3 Register Citizen | Name, email, password, phone |
| Household data | UP_OFFICIAL | P2.1 Create Household | Head name, NID, GPS, members |
| Household list | P2.2 List | UP_OFFICIAL | Filtered by jurisdiction |
| Distribution data | NGO_WORKER | P3.1 Create Distribution | Household, item, qty, GPS |
| Relief request | CITIZEN | P4.1 Submit Request | Items needed, description, priority |
| Review decision | UPAZILA_OFFICER | P4.5 Review | Approve/reject + notes |
| Dashboard stats | P5 Dashboard | Any Entity | Aggregated counts |
| Feedback | Any Entity | P6.1 Submit | Message text |
