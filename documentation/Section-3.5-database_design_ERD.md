# Section 3.5 — Database Design (ERD)
**Project:** ReliefMesh — Disaster Relief Coordination System for Local Government
**Team:** Team_Skipper | **Course:** CSE-3208 System Analysis & Design Lab
**Last Updated:** 2026-06-09

---

## 3.5.1 Entity Identification

| Entity | Description |
|--------|-------------|
| **User** | System accounts — UP officials, Upazila officers, NGO workers |
| **GeographicArea** | Full BD administrative hierarchy: Division → District → Upazila → Union → Ward (replaces old Jurisdiction with Ward level added) |
| **Household** | Registered disaster-affected family unit (includes age-bracket counts for need calculation) |
| **DistributionLog** | Record of one relief distribution to one household (optionally linked to a pledge) |
| **ItemCategory** | Lookup table for predefined relief item types (now includes per-person-per-day rate for need calculation) |
| **DuplicateAlert** | Alert generated when duplicate distribution is detected |
| **SyncConflict** | Log of offline sync conflicts pending manual review |
| **Feedback** | User-submitted feedback/complaints with response |
| **Inventory** | Stock tracking per item category (total, distributed, remaining) |
| **NeedAssessment** | Ward-level calculated need per item category, with optional officer override |
| **ReliefPledge** | Source declaration of relief supply (donor, NGO, volunteer) with status lifecycle |

---

## 3.5.2 Entity-Relationship Diagram (Crow's Foot Notation)

```
┌──────────────────────┐     ┌──────────────────────────┐
│   GeographicArea   │     │         User         │
├──────────────────────┤     ├──────────────────────────┤
│ PK area_id         │     │ PK user_id          │
│  name              │◄──────────│ FK area_id (jurisdiction)│
│  level (enum: DIV/   │ 1   * │  name ┊ email          │
│    DIST/UPAZILA/     │     │  password_hash       │
│    UNION/WARD)      │     │  role (enum) ┊ organization│
│  parent_id (FK)     │     │  is_active ┊ created_at  │
└──────────────────────┘     └────────────┬─────────────┘
     │ 1                    │ 1
     │                     │ registers
     │ *                   │ *
     │         ┌───────────▼──────────────┐
     │         │      Household        │
     │         ├──────────────────────────┤
     │         │ PK hh_id               │
     │         │ FK area_id (union)      │
     │         │  head_name ┊ nid         │
     │         │  gps_lat ┊ gps_lng      │
     │         │  family_size           │
     │         │  is_elderly ┊ is_disabled│
     │         │  is_pregnant           │
     │         │  children_0_5 ┊ over_60 │
     │         │  photo_url ┊ created_at │
     │         └───────────┬──────────────┘
     │                     │ 1
     │                     │ receives
     │                     │ *
     │         ┌───────────▼──────────────┐
     │         │    DistributionLog     │
     │         ├──────────────────────────┤
     │         │ PK log_id               │
     │         │ FK hh_id                │
     │         │ FK officer_id (User)    │
     │         │ FK item_category_id     │
     │         │ FK pledge_id (nullable) │
     │         │  quantity ┊ unit        │
     │         │  gps_lat ┊ gps_lng      │
     │         │  photo_url ┊ timestamp  │
     │         │  sync_status (enum)     │
     │         │  is_override            │
     │         │  override_reason        │
     │         │  created_at             │
     │         └──┬──────────┬───────────┘
     │            │ 1       │ 1
     │            │ triggers│ belongs_to
     │            │ 0..1   │ *
     │  ┌─────────▼────┐  ┌─▼───────────────────┐
     │  │DuplicateAlert│  │  ReliefPledge    │
     │  ├──────────────┤  ├──────────────────────┤
     │  │ PK alert_id │  │ PK pledge_id      │
     │  │ FK hh_id   │  │ FK source_id      │
     │  │ FK prior/   │  │  source_type (enum)  │
     │  │  triggered   │  │ FK area_id          │
     │  │  log_id     │  │ FK item_category_id  │
     │  │ is_resolved │  │  pledged_qty         │
     │  │ resolved_by │  │  remaining_qty       │
     │  │ override_   │  │  team_count          │
     │  │  reason     │  │  volunteer_count     │
     │  │ created_at  │  │  description         │
     │  └──────────────┘  │  status (PENDING/    │
     │                    │    IN_FULFILLMENT/   │
     │                    │    COMPLETED/CANCEL) │
     │                    │  created_at/updated  │
     │                    └──────────────────────┘
     │
     │  ┌───────────────────┐  ┌───────────────────┐
     │  │  NeedAssessment   │  │  ItemCategory  │
     │  ├───────────────────┤  ├───────────────────┤
     │  │ PK assessment_id  │  │ PK item_cat_id  │
     │  │ FK area_id (ward) │  │  name      │
     │  │ FK item_cat_id   │  │  parent_cat_id │
     │  │  calculated_qty  │  │  per_person_per_  │
     │  │  override_qty    │  │  day_qty (NEW)  │
     │  │  override_reason │  │  is_active   │
     │  │  computed_at     │  └───────────────────┘
     │  └───────────────────┘

┌───────────────────┐     ┌───────────────────────┐
│   SyncConflict    │     │     Feedback      │
├───────────────────┤     ├───────────────────────┤
│ PK conflict_id   │     │ PK feedback_id    │
│ FK log_id_a     │     │  name ┊ contact    │
│ FK log_id_b     │     │  category (enum)  │
│ resolution_status│     │  message ┊ is_read  │
│ reviewed_by     │     │  response         │
│ created_at     │     │  responded_by     │
└───────────────────┘     │  responded_at     │
                 │  created_at     │
                 └──────────────────┘
```

---

## 3.5.3 Relationships & Cardinality

| Relationship | Cardinality | Description |
|-------------|-------------|-------------|
| GeographicArea → User | 1 : Many | One area has many users assigned |
| GeographicArea → Household | 1 : Many | One union has many households |
| GeographicArea → GeographicArea | 1 : Many | Self-referencing (Division → District → Upazila → Union → Ward) |
| GeographicArea → NeedAssessment | 1 : Many | One ward has many need assessments (per item category) |
| GeographicArea → ReliefPledge | 1 : Many | One area receives many pledges |
| User → DistributionLog | 1 : Many | One officer logs many distributions |
| Household → DistributionLog | 1 : Many | One household receives many distributions |
| ItemCategory → DistributionLog | 1 : Many | One item category used in many logs |
| ItemCategory → NeedAssessment | 1 : Many | One item category assessed in many wards |
| ItemCategory → ReliefPledge | 1 : Many | One item category pledged by many sources |
| DistributionLog → DuplicateAlert | 1 : 0..1 | A log may trigger one duplicate alert |
| DistributionLog → ReliefPledge | Many : 1 | Many distribution logs may fulfill one pledge (optional FK) |
| DistributionLog → SyncConflict | 1 : 0..1 | A log may have one conflict record |
| ItemCategory → Inventory | 1 : 1 | Each item category has one inventory record |
| User → Feedback | 1 : Many | One user responds to many feedback entries |

---

## 3.5.4 Normalization

### 1NF — All attributes are atomic
- No repeating groups. Vulnerability flags split into individual boolean columns (`is_elderly`, `is_disabled`, `is_pregnant`). Age-bracket counts are separate INT columns (`children_0_5`, `over_60`), not arrays.

### 2NF — No partial dependencies (all non-key attributes depend on full PK)
- All tables use single-column surrogate PKs (UUID/auto-increment). No composite PKs, so 2NF is satisfied.
- `NeedAssessment` uses a single-column PK (`assessment_id`), not a composite of (area_id, item_category_id), to allow multiple assessment versions per ward per item.

### 3NF — No transitive dependencies
- `GeographicArea` hierarchy is self-referencing via `parent_id`, not transitive columns.
- `ItemCategory` is in its own table (not embedded as a string in DistributionLog).
- User's area is a FK, not duplicated data.
- `ReliefPledge.remaining_qty` is a computed/cached column, not a transitive dependency (derived from sum of linked distribution_logs).

**Result:** All tables are in 3NF.

---

## 3.5.5 Data Dictionary

### Table: `users`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| user_id | UUID | PK, NOT NULL | Unique user identifier |
| area_id | UUID | FK → geographic_areas | User's assigned area |
| name | VARCHAR(100) | NOT NULL | Full name |
| email | VARCHAR(150) | UNIQUE, NOT NULL | Login email |
| password_hash | VARCHAR(255) | NOT NULL | bcrypt hashed password |
| role | ENUM | NOT NULL | UP_OFFICIAL / UPAZILA_OFFICER / NGO_WORKER |
| organization | VARCHAR(100) | NULLABLE | NGO name if applicable |
| is_active | BOOLEAN | DEFAULT TRUE | Account status |
| created_at | TIMESTAMP | NOT NULL | Account creation time |

### Table: `geographic_areas`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| area_id | UUID | PK, NOT NULL | Unique area ID |
| name | VARCHAR(100) | NOT NULL | Area name |
| level | ENUM | NOT NULL | DIVISION / DISTRICT / UPAZILA / UNION / WARD |
| parent_id | UUID | FK → geographic_areas, NULLABLE | Parent area |
| geometry | JSON | NULLABLE | GeoJSON boundary polygon for map rendering |

### Table: `households`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| hh_id | UUID | PK, NOT NULL | Unique household ID |
| area_id | UUID | FK → geographic_areas (level=UNION) | Union where household belongs |
| head_name | VARCHAR(100) | NOT NULL | Head-of-household name |
| nid | VARCHAR(20) | UNIQUE, NOT NULL | National ID number |
| gps_lat | DECIMAL(9,6) | NOT NULL | Latitude |
| gps_lng | DECIMAL(9,6) | NOT NULL | Longitude |
| family_size | INT | NOT NULL | Number of members |
| is_elderly | BOOLEAN | DEFAULT FALSE | Elderly member flag |
| is_disabled | BOOLEAN | DEFAULT FALSE | Disability flag |
| is_pregnant | BOOLEAN | DEFAULT FALSE | Pregnant member flag |
| children_0_5 | INT | DEFAULT 0 | Count of children aged 0–5 (need calc input) |
| over_60 | INT | DEFAULT 0 | Count of members aged 60+ (need calc input) |
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
| pledge_id | UUID | FK → relief_pledges, NULLABLE | Optional link to a pledge being fulfilled |
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
| per_person_per_day_qty | DECIMAL(8,4) | NULLABLE | Sphere-standard amount per person per day (e.g., 0.400 kg for rice) |
| unit | VARCHAR(20) | NOT NULL | kg, litre, piece, etc. |
| is_active | BOOLEAN | DEFAULT TRUE | Whether item is currently in use |

### Table: `need_assessments`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| assessment_id | UUID | PK, NOT NULL | Unique assessment ID |
| area_id | UUID | FK → geographic_areas (level=WARD) | Assessed ward |
| item_category_id | UUID | FK → item_categories | Item being assessed |
| calculated_qty | DECIMAL(12,2) | NOT NULL | Quantity derived from household demographics × Sphere rates |
| override_qty | DECIMAL(12,2) | NULLABLE | Officer-adjusted quantity (used if present) |
| override_reason | TEXT | NULLABLE | Justification for override |
| computed_at | TIMESTAMP | NOT NULL | When calculation ran |
| overridden_at | TIMESTAMP | NULLABLE | When override was applied |
| overridden_by | UUID | FK → users, NULLABLE | Officer who overrode |

### Table: `relief_pledges`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| pledge_id | UUID | PK, NOT NULL | Unique pledge ID |
| source_id | UUID | NOT NULL | Reference to user or external source |
| source_type | ENUM | NOT NULL | DONOR / NGO / LOCAL_VOLUNTEER / VOLUNTEER_TEAM |
| area_id | UUID | FK → geographic_areas | Target jurisdiction |
| item_category_id | UUID | FK → item_categories | Item being pledged |
| pledged_qty | DECIMAL(12,2) | NOT NULL | Total quantity pledged |
| remaining_qty | DECIMAL(12,2) | NOT NULL | pledged_qty minus sum of linked distributions (computed on update) |
| team_count | INT | NULLABLE | Number of team members (for volunteer teams) |
| volunteer_count | INT | NULLABLE | Number of individual volunteers |
| description | TEXT | NULLABLE | Free-text pledge description |
| status | ENUM | DEFAULT 'PENDING' | PENDING / IN_FULFILLMENT / COMPLETED / CANCELLED |
| created_at | TIMESTAMP | NOT NULL | Pledge creation time |
| updated_at | TIMESTAMP | NOT NULL | Last status update |

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
