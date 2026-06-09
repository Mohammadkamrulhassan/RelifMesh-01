# Section 3.5 — Database Design (ERD)
**Project:** RelifMesh — Disaster Relief Coordination System for Local Government
**Team:** Team_Skipper | **Course:** CSE-3208 System Analysis & Design Lab
**Last Updated:** 2026-06-09

---

## 3.5.1 Entity Identification

| Entity | Description |
|--------|-------------|
| **User** | System accounts — UP officials, Upazila officers, NGO workers |
| **Jurisdiction** | Geographic unit (District → Upazila → Union) |
| **Household** | Registered disaster-affected family unit |
| **DistributionLog** | Record of one relief distribution to one household |
| **ItemCategory** | Lookup table for predefined relief item types |
| **DuplicateAlert** | Alert generated when duplicate distribution is detected |
| **SyncConflict** | Log of offline sync conflicts pending manual review |
| **Feedback** | User-submitted feedback/complaints with response |
| **Inventory** | Stock tracking per item category (total, distributed, remaining) |

---

## 3.5.2 Entity-Relationship Diagram (Crow's Foot Notation)

```
┌───────────────────┐     ┌───────────────────────┐
│  Jurisdiction  │     │     User      │
├───────────────────┤     ├───────────────────────┤
│ PK jurisdiction_id│     │ PK user_id       │
│  name      │◄─────────│ FK jurisdiction_id   │
│  level (enum)  │ 1   * │  name        │
│  parent_id (FK) │     │  email        │
└───────────────────┘     │  password_hash    │
     │ 1          │  role (enum)     │
     │           │  organization    │
     │ *          │  is_active      │
     │           │  created_at     │
┌────────┴──────────┐     └───────────┬────────────┘
│  Household   │           │ 1
├───────────────────┤           │ registers
│ PK hh_id     │           │ *
│ FK jurisdiction_id│     ┌───────────▼────────────┐
│  head_name   │     │  DistributionLog   │
│  nid      │◄─────────├───────────────────────┤
│  gps_lat    │ 1   * │ PK log_id       │
│  gps_lng    │     │ FK hh_id        │
│  family_size  │     │ FK officer_id (User)  │
│  is_elderly   │     │ FK item_category_id  │
│  is_disabled  │     │  quantity      │
│  is_pregnant  │     │  unit        │
│  photo_url   │     │  gps_lat       │
│  registered_by │     │  gps_lng       │
│  created_at   │     │  photo_url      │
└───────────────────┘     │  timestamp      │
                │  sync_status (enum) │
                │  is_override     │
                │  override_reason   │
                │  created_at     │
                └───────────┬────────────┘
                      │ 1
                      │ triggers
                      │ 0..1
                ┌───────────▼────────────┐
                │  DuplicateAlert    │
                ├───────────────────────┤
                │ PK alert_id      │
                │ FK hh_id        │
                │ FK prior_log_id    │
                │ FK triggered_log_id  │
                │  item_category_id  │
                │  is_resolved     │
                │  resolved_by     │
                │  override_reason   │
                │  created_at     │
                └────────────────────────┘

┌───────────────────┐     ┌───────────────────────┐
│  ItemCategory  │     │   SyncConflict    │
├───────────────────┤     ├───────────────────────┤
│ PK item_cat_id  │     │ PK conflict_id     │
│  name      │     │ FK log_id_a      │
│  parent_cat_id │     │ FK log_id_b      │
│  is_active   │     │  resolution_status  │
└───────────────────┘     │  reviewed_by     │
                │  created_at     │
                └────────────────────────┘
```

---

## 3.5.3 Relationships & Cardinality

| Relationship | Cardinality | Description |
|-------------|-------------|-------------|
| Jurisdiction → User | 1 : Many | One jurisdiction has many users |
| Jurisdiction → Household | 1 : Many | One union has many households |
| Jurisdiction → Jurisdiction | 1 : Many | Self-referencing (District → Upazila → Union) |
| User → DistributionLog | 1 : Many | One officer logs many distributions |
| Household → DistributionLog | 1 : Many | One household receives many distributions |
| ItemCategory → DistributionLog | 1 : Many | One item category used in many logs |
| DistributionLog → DuplicateAlert | 1 : 0..1 | A log may trigger one duplicate alert |
| DistributionLog → SyncConflict | 1 : 0..1 | A log may have one conflict record |
| ItemCategory → Inventory | 1 : 1 | Each item category has one inventory record |
| User → Feedback | 1 : Many | One user responds to many feedback entries |

---

## 3.5.4 Normalization

### 1NF — All attributes are atomic
- No repeating groups. Vulnerability flags split into individual boolean columns (`is_elderly`, `is_disabled`, `is_pregnant`).

### 2NF — No partial dependencies (all non-key attributes depend on full PK)
- All tables use single-column surrogate PKs (UUID/auto-increment). No composite PKs, so 2NF is satisfied.

### 3NF — No transitive dependencies
- `Jurisdiction` hierarchy is self-referencing via `parent_id`, not transitive columns.
- `ItemCategory` is in its own table (not embedded as a string in DistributionLog).
- User's jurisdiction is a FK, not duplicated data.

**Result:** All tables are in 3NF.

---

## 3.5.5 Data Dictionary

### Table: `users`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| user_id | UUID | PK, NOT NULL | Unique user identifier |
| jurisdiction_id | UUID | FK → jurisdictions | User's assigned area |
| name | VARCHAR(100) | NOT NULL | Full name |
| email | VARCHAR(150) | UNIQUE, NOT NULL | Login email |
| password_hash | VARCHAR(255) | NOT NULL | bcrypt hashed password |
| role | ENUM | NOT NULL | UP_OFFICIAL / UPAZILA_OFFICER / NGO_WORKER |
| organization | VARCHAR(100) | NULLABLE | NGO name if applicable |
| is_active | BOOLEAN | DEFAULT TRUE | Account status |
| created_at | TIMESTAMP | NOT NULL | Account creation time |

### Table: `jurisdictions`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| jurisdiction_id | UUID | PK, NOT NULL | Unique area ID |
| name | VARCHAR(100) | NOT NULL | Area name |
| level | ENUM | NOT NULL | DISTRICT / UPAZILA / UNION |
| parent_id | UUID | FK → jurisdictions, NULLABLE | Parent area |

### Table: `households`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| hh_id | UUID | PK, NOT NULL | Unique household ID |
| jurisdiction_id | UUID | FK → jurisdictions | Union where household belongs |
| head_name | VARCHAR(100) | NOT NULL | Head-of-household name |
| nid | VARCHAR(20) | UNIQUE, NOT NULL | National ID number |
| gps_lat | DECIMAL(9,6) | NOT NULL | Latitude |
| gps_lng | DECIMAL(9,6) | NOT NULL | Longitude |
| family_size | INT | NOT NULL | Number of members |
| is_elderly | BOOLEAN | DEFAULT FALSE | Elderly member flag |
| is_disabled | BOOLEAN | DEFAULT FALSE | Disability flag |
| is_pregnant | BOOLEAN | DEFAULT FALSE | Pregnant member flag |
| photo_url | VARCHAR(300) | NULLABLE | Household photo path |
| registered_by | UUID | FK → users | Officer who registered |
| created_at | TIMESTAMP | NOT NULL | Registration timestamp |

### Table: `distribution_logs`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| log_id | UUID | PK, NOT NULL | Unique log ID |
| hh_id | UUID | FK → households | Recipient household |
| officer_id | UUID | FK → users | Distributing officer |
| item_category_id | UUID | FK → item_categories | Item type |
| quantity | DECIMAL(8,2) | NOT NULL | Amount distributed |
| unit | VARCHAR(20) | NOT NULL | kg, litre, piece, etc. |
| gps_lat | DECIMAL(9,6) | NOT NULL | Distribution GPS latitude |
| gps_lng | DECIMAL(9,6) | NOT NULL | Distribution GPS longitude |
| photo_url | VARCHAR(300) | NULLABLE | Distribution photo |
| timestamp | TIMESTAMP | NOT NULL | When distribution occurred |
| sync_status | ENUM | DEFAULT 'PENDING' | PENDING / SYNCED / CONFLICT |
| is_override | BOOLEAN | DEFAULT FALSE | Was duplicate overridden? |
| override_reason | TEXT | NULLABLE | Override justification |
| created_at | TIMESTAMP | NOT NULL | Record creation time |

### Table: `item_categories`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| item_cat_id | UUID | PK | Unique category ID |
| name | VARCHAR(50) | NOT NULL | Rice, Water, Tarp, etc. |
| parent_cat_id | UUID | FK → self, NULLABLE | Parent category (Food, WASH, Shelter) |
| is_active | BOOLEAN | DEFAULT TRUE | Whether item is currently in use |

### Table: `duplicate_alerts`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| alert_id | UUID | PK | Unique alert ID |
| hh_id | UUID | FK → households | Affected household |
| prior_log_id | UUID | FK → distribution_logs | First distribution |
| triggered_log_id | UUID | FK → distribution_logs | Duplicate attempt |
| item_category_id | UUID | FK → item_categories | Item that triggered alert |
| is_resolved | BOOLEAN | DEFAULT FALSE | Resolution status |
| resolved_by | UUID | FK → users, NULLABLE | Officer who resolved |
| override_reason | TEXT | NULLABLE | Reason if overridden |
| created_at | TIMESTAMP | NOT NULL | Alert generation time |

### Table: `feedbacks`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| feedback_id | UUID | PK, NOT NULL | Unique feedback ID |
| name | VARCHAR(100) | NOT NULL | Submitter's name |
| contact | VARCHAR(100) | NULLABLE | Phone or email |
| category | ENUM | NOT NULL | COMPLAINT / SUGGESTION / INQUIRY / APPRECIATION / OTHER |
| message | TEXT | NOT NULL | Feedback message body |
| is_read | BOOLEAN | DEFAULT FALSE | Admin read flag |
| response | TEXT | NULLABLE | Admin response |
| responded_by | UUID | FK → users, NULLABLE | Responding officer |
| responded_at | TIMESTAMP | NULLABLE | When response was sent |
| created_at | TIMESTAMP | NOT NULL | Submission time |

### Table: `inventories`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| inventory_id | UUID | PK, NOT NULL | Unique inventory ID |
| item_category_id | UUID | FK → item_categories, UNIQUE | Linked item category |
| total_quantity | DECIMAL(10,2) | NOT NULL, MIN 0 | Total stock |
| unit | VARCHAR(20) | NOT NULL | kg, litre, piece, etc. |
| distributed_quantity | DECIMAL(10,2) | DEFAULT 0, MIN 0 | Already distributed amount |
| last_restocked_at | TIMESTAMP | NULLABLE | Last restock time |
| notes | TEXT | NULLABLE | Any notes |
| created_at | TIMESTAMP | NOT NULL | Record creation |

### Table: `sync_conflicts`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| conflict_id | UUID | PK | Unique conflict ID |
| log_id_a | UUID | FK → distribution_logs | First version |
| log_id_b | UUID | FK → distribution_logs | Conflicting version |
| resolution_status | ENUM | DEFAULT 'PENDING' | PENDING / RESOLVED / AUTO |
| reviewed_by | UUID | FK → users, NULLABLE | Officer who reviewed |
| created_at | TIMESTAMP | NOT NULL | Conflict detected time |

---

*End of Section 3.5 — Next: Section 3.6 Architecture & Technology Stack*
