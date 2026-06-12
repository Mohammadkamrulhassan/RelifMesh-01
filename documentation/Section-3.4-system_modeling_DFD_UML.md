# Section 3.4 — System Modeling (DFD & UML)
**Project:** ReliefMesh — Disaster Response & Relief Management System
**Team:** Team_Skipper | **Course:** CSE-3208 System Analysis & Design Lab
**Last Updated:** 2026-06-10

> Diagrams stored as `.drawio` files in `/diagrams/`. Render using draw.io for final report.

---

## 3.4.1 Context Diagram (Level 0 DFD)

```
            ┌──────────────────────────────────────────┐
            │                │
 UP Official ────────►│       ReliefMesh       │
 NGO Worker ────────►│   Disaster Response &  │◄─────── Victim (SOS)
 Volunteer ────────►│   Relief Management    │◄─────── Donor (Donations)
 Upazila Officer ──────►│                        │──────► Public Dashboard
 Admin ──────────►│                        │──────► Reports/Heatmaps
 General Public ───────►│                        │
            └──────────────────────────────────────────┘
                        │
                        ▼
            SOS Registry, Household DB, Donation Ledger
            Mission Logs, Inventory, Chat Messages
```

**External Entities:**
| Entity | Inputs | Outputs |
|--------|--------|---------|
| UP Official | Household data, distribution logs | HH-ID, duplicate warnings |
| NGO Worker | Distribution logs | Duplicate warnings |
| Volunteer | SOS acceptance, mission updates | Mission status, chat |
| Victim | SOS, relief requests, feedback | Mission updates, relief status |
| Donor | Campaign donations | Receipts, transparency data |
| Upazila Officer | Audit queries, report requests | Reports, dashboard |
| Admin | System configuration | Analytics, audit logs |
| General Public | Dashboard queries | Aggregated summaries |

---

## 3.4.2 Level 1 DFD — Main Processes

```
┌──────────────────────────────────────────────────────────┐
│      ReliefMesh                             │
│                                          │
P1: Auth & User Mgmt ──► D1: Users                 │
P2: SOS Management  ──► D2: SOS Requests           │
P3: Mission          ──► D3: Missions              │
│    Coordination                              │
P4: Household       ──► D4: Households             │
│    Registration                              │
P5: Distribution    ──► D5: Distribution Logs      │
│    Logging (with dup check)                  │
P6: Campaign &      ──► D6: Campaigns              │
│    Donation Mgmt ──► D7: Donations               │
P7: Inventory       ──► D8: Inventory              │
│    Management                              │
P8: Shelter         ──► D9: Shelters               │
│    Management                              │
P9: Chat &          ──► D10: Chat Messages          │
│    Notifications ──► D11: Notifications           │
P10: Dashboard &     ◄── D2-S (Aggregated data)    │
│     Analytics                               │
P11: Sync Engine     ──► D12: Sync Conflicts        │
P12: Audit Log       ──► D13: Audit Logs            │
└──────────────────────────────────────────────────────────┘
```

**Data Stores:**
| ID | Name | Contents |
|----|------|----------|
| D1 | Users | Accounts, roles, OTP hashes, profiles |
| D2 | SOS Requests | Victim SOS with GPS, type, priority, status |
| D3 | Missions | Volunteer assignments, lifecycle status, feedback |
| D4 | Households | Registered families with NID, GPS, flags |
| D5 | Distribution Logs | Item-level distribution records |
| D6 | Campaigns | Fundraising campaigns with goals |
| D7 | Donations | Payment records with method, receipt |
| D8 | Inventory | Stock levels, batch/expiry tracking |
| D9 | Shelters | Shelter info, capacity, occupancy |
| D10 | Chat Messages | Mission-scoped messaging |
| D11 | Notifications | In-app notification queue |
| D12 | Sync Conflicts | Offline sync conflict records |
| D13 | Audit Logs | Admin action trail |

---

## 3.4.3 Use Case Diagram

**Actors:** UP Official, NGO Worker, Volunteer, Victim, Donor, Upazila Officer, Admin, General Public

```
┌─────────────────────────────────────────────────────────────┐
│           ReliefMesh System                │
│                                │
│  (Register Household)  ◄──── UP Official          │
│  (Log Distribution)   ◄──── UP Official, NGO         │
│  (Override Duplicate)  ◄──── UP Official, NGO         │
│                                │
│  (Send SOS)       ◄──── Victim                │
│  (Track Mission Status) ◄── Victim                │
│  (Submit Relief Request)◄─── Victim                │
│                                │
│  (Accept Mission)    ◄──── Volunteer              │
│  (Update Mission Status)◄──── Volunteer              │
│  (Send Chat Message)  ◄──── Volunteer, Victim         │
│                                │
│  (Create Campaign)   ◄──── NGO                    │
│  (Donate)        ◄──── Donor                 │
│                                │
│  (Audit Data)      ◄──── Upazila Officer         │
│  (Export Reports)    ◄──── Upazila Officer         │
│                                │
│  (View Analytics)    ◄──── Admin                  │
│  (Manage Users)     ◄──── Admin                  │
│  (View Audit Logs)   ◄──── Admin                  │
│                                │
│  (View Public Dashboard) ◄── General Public          │
│  (Submit Feedback)   ◄── Any                    │
└─────────────────────────────────────────────────────────────┘
```

**Include / Extend relationships:**
- `Log Distribution` **includes** `Duplicate Check`
- `Accept Mission` **includes** `SOS Assignment`
- `Donate` **includes** `Payment Processing`
- `Send Chat` **includes** `Mission Validation`

---

## 3.4.4 Class Diagram

```
┌──────────────────┐    ┌──────────────────────┐    ┌──────────────────┐
│   User     │    │   Household      │    │   SOSRequest   │
├──────────────────┤    ├──────────────────────┤    ├──────────────────┤
│ userId: String  │    │ hhId: String     │    │ sosId: String   │
│ phone: String  │    │ headName: String   │    │ victimId: FK    │
│ fullName: String │    │ nid: String      │    │ type: Enum     │
│ role: Enum    │    │ gps: GeoJSON     │    │ location: GeoJSON│
│ nid: String   │    │ familySize: Int   │    │ status: Enum   │
│ location: GeoJSON│ │ vulnerabilityFlags:[]│    │ priority: Enum  │
│ isVerified: Bool  │ │ photoUrl: String   │    │ expiresAt: Date │
├──────────────────┤    ├──────────────────────┤    ├──────────────────┤
│ sendOTP()    │    │ register()      │    │ create()     │
│ verifyOTP()   │    │ search()       │    │ cancel()     │
└────────┬─────────┘    └──────────┬────────────┘    └────────┬─────────┘
         │ 1               │ 1               │ 1
         │                 │ receives          │ triggers
         ▼ *               ▼ *               ▼ 0..1
┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────┐
│  DistributionLog  │  │   ReliefRequest   │  │   Mission    │
├──────────────────────┤  ├──────────────────────┤  ├──────────────────┤
│ logId: String    │  │ requestId: String  │  │ missionId: String│
│ hhId: FK       │  │ citizenId: FK    │  │ sosId: FK (unique)│
│ itemCategory: Enum  │  │ items: []       │  │ volunteerId: FK  │
│ quantity: Float   │  │ status: Enum     │  │ status: Enum     │
│ proofPhotoUrls:[] │  │ priority: Enum   │  │ startedAt: Date  │
│ beneficiarySig: Str│ │ approvedBy: FK   │  │ completedAt: Date│
├──────────────────────┤  ├──────────────────────┤  ├──────────────────┤
│ log()        │  │ submit()      │  │ accept()     │
│ checkDuplicate()  │  │ approve()      │  │ updateStatus()  │
└──────────────────────┘  └──────────────────────┘  └──────────────────┘

┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   Campaign    │  │   Donation    │  │   Inventory    │
├──────────────────┤  ├──────────────────┤  ├──────────────────┤
│ title: String  │  │ campaignId: FK  │  │ name: String   │
│ ngoId: FK    │  │ donorId: FK    │  │ category: Enum  │
│ goalAmount: Num│  │ amount: Number  │  │ quantity: Number │
│ raisedAmount: Num│ │ paymentMethod: Enum│ │ batchNo: String │
│ status: Enum  │  │ transactionId:Str│ │ expiryDate: Date│
│ isVerified: Bool │  │ status: Enum   │  │ shelterId: FK  │
├──────────────────┤  ├──────────────────┤  ├──────────────────┤
│ create()     │  │ donate()     │  │ addStock()   │
│ verify()     │  │ verifyPayment() │  │ transfer()   │
└──────────────────┘  └──────────────────┘  └──────────────────┘

┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   Shelter    │  │  ChatMessage   │  │  Notification  │
├──────────────────┤  ├──────────────────┤  ├──────────────────┤
│ name: String   │  │ missionId: FK   │  │ userId: FK    │
│ location: GeoJSON│ │ senderId: FK   │  │ type: Enum    │
│ capacity: Number │ │ message: String │  │ title: String  │
│ occupancy: Number│ │ messageType: Enum│ │ body: String   │
│ facilities: [] │  │ isRead: Bool   │  │ isRead: Bool  │
├──────────────────┤  ├──────────────────┤  ├──────────────────┤
│ create()     │  │ send()       │  │ push()      │
│ updateOccupancy()│  │ getByMission() │  │ markRead()   │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

**Enums:**
- `Role`: victim, volunteer, ngo, govt, donor, admin, super_admin
- `SOSType`: rescue, food, water, medical, shelter, other
- `SOSStatus`: pending, acknowledged, in_progress, resolved, cancelled, expired
- `MissionStatus`: assigned, en_route, on_site, rescued, completed, cancelled
- `ItemCategory`: food, water, medicine, clothing, shelter_kit, hygiene, other
- `PaymentMethod`: bkash, nagad, rocket, bank, cash
- `NotifType`: sos_assigned, mission_update, relief_approved, donation_receipt, system_alert

---

## 3.4.5 Sequence Diagrams

### SD-01: SOS → Rescue Mission Flow
```
Victim        App (PWA)        Server         WebSocket         Volunteer
  │             │               │               │                │
  │──Send SOS──►│               │               │                │
  │   (GPS+type)│──Create SOS──►│               │                │
  │             │               │──Broadcast────►                │
  │             │               │   sos:new     │──Show on map──►│
  │             │               │               │                │
  │             │               │               │◄──Accept───────│
  │             │               │◄──Accept───────│                │
  │             │               │──Create Mission               │
  │             │               │──emit mission:update──►        │
  │◄──Notified──│◄──Mission─────│               │                │
  │   mission   │   created    │               │                │
  │             │               │               │                │
  │             │               │◄──Status Update────────────────│
  │             │               │──emit mission:update──►        │
  │◄──Real-time──│◄──Update─────│               │                │
```

### SD-02: Donation Flow
```
Donor       Frontend        Server          Payment Gateway       Campaign
  │            │              │                  │                  │
  │──Donate──►│              │                  │                  │
  │           │──Create────►│                  │                  │
  │           │  Donation   │──Payment Req────►│                  │
  │           │              │◄──Payment URL───│                  │
  │◄──Redirect─│◄──URL───────│                  │                  │
  │──Complete─────────────────────────────────►│                  │
  │   Payment               │◄──Webhook────────│                  │
  │           │              │──Verify─────────►│                  │
  │           │              │◄──Confirmed─────│                  │
  │           │              │──Update Campaign──────────────────►│
  │◄──Receipt─│◄──Receipt───│                  │                  │
```

---

## 3.4.6 Activity Diagram — SOS to Rescue Completion

```
[Victim Opens App]
    │
    ▼
[GPS Auto-Captured]
    │
    ▼
[Select SOS Type: Rescue/Food/Water/Medical/Shelter]
    │
    ▼
[Set Priority Level]
    │
    ▼
┌──────┴──────┐
 Online?    Offline?
    │           │
    ▼           ▼
[Send to Server] [Queue in IndexedDB]
    │           │
    └──────┬──────┘
           ▼
[SOS Visible on Volunteer Map]
           │
           ▼
[Volunteer Accepts SOS → Mission Created]
           │
           ▼
[Mission Lifecycle]:
[Assigned] → [En Route] → [On Site] → [Rescued] → [Completed]
           │
           ▼
[Real-time Updates to Victim via WebSocket]
           │
           ▼
[Victim Submits Feedback / Rating]
           │
           END
```

---

*End of Section 3.4 — Next: Section 3.5 Database Design (ERD)*
