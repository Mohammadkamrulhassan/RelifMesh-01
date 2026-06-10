# Section 3.5 — Database Design (ERD)
**Project:** ReliefMesh — Disaster Response & Relief Management System
**Team:** Team_Skipper | **Course:** CSE-3208 System Analysis & Design Lab
**Last Updated:** 2026-06-10

---

## 3.5.1 Entity Identification

| Entity | Description | Phase |
|--------|-------------|-------|
| **User** | System accounts — 7 roles | v1 |
| **Household** | Registered disaster-affected family | v1 |
| **DistributionLog** | Relief distribution record | v1 |
| **ItemCategory** | Lookup for relief item types | v1 |
| **DuplicateAlert** | Alert for duplicate distribution | v1 |
| **SyncConflict** | Offline sync conflict log | v1 |
| **Feedback** | User-submitted feedback | v1 |
| **Inventory** | Stock levels per item category | v1 |
| **ReliefRequest** | Citizen relief item requests | v1 |
| **Jurisdiction** | Geographic units | v1 |
| **SOSRequest** | Emergency SOS from victims | v2 |
| **Mission** | Rescue mission assignment | v2 |
| **Shelter** | Shelter/camp management | v2 |
| **Campaign** | Fundraising campaigns | v2 |
| **Donation** | Donation records | v2 |
| **Notification** | In-app notifications | v2 |
| **ChatMessage** | Mission-scoped messaging | v2 |
| **InventoryTransaction** | Stock movement audit | v2 |
| **AuditLog** | System admin action trail | v2 |

---

## 3.5.2 Entity-Relationship Diagram

```
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│   User    │       │  Household    │       │  SOSRequest   │
├───────────────┤       ├───────────────┤       ├───────────────┤
│ PK user_id   │       │ PK hh_id    │       │ PK sos_id    │
│ phone (unique)│1──*│ head_name   │       │ FK victim_id │
│ fullName    │       │ nid (unique)  │       │ type (enum)  │
│ role (enum)  │       │ gps (GeoJSON) │       │ location (2d) │
│ location (2d)│       │ familySize   │       │ priority     │
│ isVerified  │       │ photo_url   │       │ status (enum)│
│ isActive    │       │ FK jurisdiction│*──1│ expiresAt(TTL)│
└──────┬────────┘       └──────┬────────┘       └──────┬────────┘
       │ 1                     │ 1                      │ 1
       │                       │                        │ triggers
       │ *                     │ *                      │ 0..1
┌──────┴────────┐       ┌──────┴────────┐       ┌──────┴────────┐
│ Distribution  │       │ ReliefRequest │       │   Mission    │
│     Log       │       │               │       │              │
├───────────────┤       ├───────────────┤       ├───────────────┤
│ PK log_id    │       │ PK req_id    │       │ PK mission_id│
│ FK hh_id     │       │ FK citizenId │       │ FK sos_id(uq)│
│ FK officerId │       │ items[]      │       │ FK volunteerId│
│ itemCategory │       │ status (enum)│       │ status (enum)│
│ quantity     │       │ priority     │       │ startedAt    │
│ proofPhotos[]│       │ FK approvedBy│       │ completedAt  │
│ signature    │       │ reviewedAt   │       │ feedback     │
└───────────────┘       └───────────────┘       └───────────────┘

┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│   Campaign   │       │   Donation    │       │   Shelter    │
├───────────────┤       ├───────────────┤       ├───────────────┤
│ PK campaignId│       │ PK donationId│       │ PK shelterId │
│ title        │       │ FK campaignId │       │ name         │
│ description  │       │ FK donorId   │       │ location (2d)│
│ FK ngoId     │1──*│ amount       │       │ capacity     │
│ goalAmount   │       │ paymentMethod│       │ occupancy    │
│ raisedAmount │       │ txnId       │       │ facilities[] │
│ status (enum)│       │ status (enum)│       │ isActive     │
└───────────────┘       └───────────────┘       └───────────────┘

┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│  Inventory   │       │ Notification │       │  ChatMessage  │
├───────────────┤       ├───────────────┤       ├───────────────┤
│ PK invId     │       │ PK notifId   │       │ PK msgId     │
│ name         │       │ FK userId    │       │ FK missionId │
│ category     │       │ type (enum)  │       │ FK senderId  │
│ quantity     │       │ title        │       │ message      │
│ batchNo      │       │ body         │       │ messageType  │
│ expiryDate   │       │ isRead       │       │ isRead       │
│ FK shelterId │       │ readAt       │       │ createdAt    │
└───────────────┘       └───────────────┘       └───────────────┘

┌───────────────┐       ┌───────────────┐
│  AuditLog    │       │InventoryTrans │
├───────────────┤       ├───────────────┤
│ PK logId     │       │ PK txnId     │
│ FK userId    │       │ FK inventoryId│
│ action       │       │ type (in/out) │
│ resource     │       │ quantity      │
│ details(JSON)│       │ referenceType │
│ ipAddress    │       │ performedBy  │
└───────────────┘       └───────────────┘
```

---

## 3.5.3 New Collections (v2)

### sos_requests
| Field | Type | Notes |
|-------|------|-------|
| `victimId` | ObjectId (User) | Ref: users |
| `type` | Enum | rescue, food, water, medical, shelter, other |
| `location` | GeoJSON Point | 2dsphere index |
| `priority` | Enum | low, medium, high, critical |
| `status` | Enum | pending, acknowledged, in_progress, resolved, cancelled, expired |
| `expiresAt` | Date | TTL index for auto-expiry |
| `isOffline` | Boolean | True if submitted offline |

### missions
| Field | Type | Notes |
|-------|------|-------|
| `sosId` | ObjectId (SOSRequest) | Unique |
| `volunteerId` | ObjectId (User) | Assigned volunteer |
| `status` | Enum | assigned, en_route, on_site, rescued, completed, cancelled |
| `victimFeedback` | Object | rating, comment |

### shelters
| Field | Type | Notes |
|-------|------|-------|
| `name` | String | |
| `location` | GeoJSON Point | 2dsphere index |
| `capacity` | Number | Max people |
| `currentOccupancy` | Number | Current count |
| `facilities` | [String] | toilet, water, medical, power |

### campaigns
| Field | Type | Notes |
|-------|------|-------|
| `title` | String | |
| `ngoId` | ObjectId (User) | Campaign creator |
| `goalAmount` | Number | Target BDT |
| `raisedAmount` | Number | Default 0 |
| `status` | Enum | draft, active, paused, completed, cancelled |
| `isVerified` | Boolean | Admin verification required |

### donations
| Field | Type | Notes |
|-------|------|-------|
| `campaignId` | ObjectId (Campaign) | |
| `donorId` | ObjectId (User) | |
| `amount` | Number | BDT |
| `paymentMethod` | Enum | bkash, nagad, rocket, bank, cash |
| `transactionId` | String | Payment gateway Txn ID |
| `status` | Enum | pending, completed, failed, refunded |

### notifications
| Field | Type | Notes |
|-------|------|-------|
| `userId` | ObjectId (User) | |
| `type` | Enum | sos_assigned, mission_update, relief_approved, donation_receipt, system_alert |
| `title` | String | |
| `body` | String | |
| `isRead` | Boolean | Default false |

### chat_messages
| Field | Type | Notes |
|-------|------|-------|
| `missionId` | ObjectId (Mission) | |
| `senderId` | ObjectId (User) | |
| `message` | String | |
| `messageType` | Enum | text, image, location |

### audit_logs
| Field | Type | Notes |
|-------|------|-------|
| `userId` | ObjectId (User) | |
| `action` | String | e.g., user.create, sos.delete, donation.refund |
| `resource` | String | Target collection |
| `details` | Object | JSON metadata |
| `ipAddress` | String | |

### inventory_transactions
| Field | Type | Notes |
|-------|------|-------|
| `inventoryId` | ObjectId (Inventory) | |
| `type` | Enum | in, out, expired, damaged |
| `quantity` | Number | Positive for in, negative for out |
| `referenceType` | Enum | donation, relief_request, transfer, adjustment |
| `performedBy` | ObjectId (User) | |

---

## 3.5.4 Index Summary

| Collection | Indexes |
|------------|---------|
| users | `phone` (unique), `role`, `location` (2dsphere) |
| sos_requests | `victimId + status`, `location` (2dsphere), `expiresAt` (TTL) |
| missions | `sosId` (unique), `volunteerId + status` |
| households | `nid` (unique), `jurisdictionId`, `headName` |
| distribution_logs | `householdId + createdAt`, `officerId` |
| shelters | `location` (2dsphere), `isActive` |
| campaigns | `ngoId`, `status`, `endDate` |
| donations | `campaignId`, `donorId`, `status` |
| notifications | `userId + isRead + createdAt` |
| chat_messages | `missionId + createdAt` |
| audit_logs | `userId + createdAt`, `action` |

---

*End of Section 3.5 — Next: Section 3.6 Architecture & Tech Stack*
