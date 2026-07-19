# ReliefMesh v2 — Update Plan
**From:** Generic disaster-relief coordination system
**To:** Feni-grounded, map-first, need-calculated, multi-source relief coordination system
**Prepared for:** Team_Skipper | CSE-3208 System Analysis & Design Lab
**Date:** 2026-06-20

---

## How to read this document

This is not a new report. It is a **change-instruction document**. For every existing file in your `/Sections/` folder, it tells you:
- what stays the same
- what gets added
- what gets rewritten
- exactly where (which heading/sub-section)

Sections 1–4 are the analysis you asked for. Section 5 is the concept-level decision list. Section 6 is the file-by-file instruction set. Section 7 is the prototype build order.

---

# 1. Analysis of Existing Online Systems / Proposed Contexts

I researched five categories of existing systems before touching your files, because your new idea (map + heatmap + need-calculation + multi-source pledges) already has real-world precedent — which is good news academically: you can cite it instead of inventing it from nothing.

### 1.1 Sahana Eden (Sahana Foundation)
The most directly comparable open-source system. Built after the 2004 tsunami, still the reference disaster-management FOSS platform. Its core idea is the **"4W" model — Who is doing What, Where (and When)** — covering organization registry, inventory/assets, shelter registry, and map-based situational awareness. Sahana explicitly separates **organizations** (govt, NGO, UN, corporate) from **individual beneficiaries**, and tracks each organization's office/warehouse/field-site locations so capacity can be mapped. This maps almost exactly onto your point #5 and #7 (relief sources declaring presence/capacity by area).

**Relevance to you:** Confirms your "volunteer/source declares area + capacity" idea is not a niche feature — it's the central organizing concept of the most mature system in this space. It also confirms a known weakness: Sahana's web map shows only **points**, not polygons/areas, which is cited in research as a limitation. This is something you can explicitly improve on (Upazila/Union/Ward as actual polygon layers, not just pins).

### 1.2 OCHA "3W / 4W / 5W" Methodology (UN humanitarian standard)
This is the single most relevant external precedent for your point #7–8. The UN's Office for Coordination of Humanitarian Affairs runs a standard data collection tool literally called **"Who does What, Where (and When)"** — a 3W, extended to 4W (adds When) and 5W (adds **how many/how much** — beneficiary counts and quantities). It is rolled out at the start of every major emergency response, collected from every organization (cluster partners), and consolidated into a single dataset to "identify gaps, avoid duplication of efforts, and plan for future humanitarian response." A specific guidance warns: when multiple organizations report in the same location, you must **sum the MAX beneficiaries per location to avoid double-counting** — directly relevant to your duplicate-detection logic when multiple sources operate in the same ward.

**Relevance to you:** Your point #7 ("volunteer says: we're near area A, we have X kg rice, Y teams, Z volunteers") is *literally* a 5W form. This gives you a named, citable, internationally standardized concept to build your "Source Pledge" feature on top of — instead of presenting it as an original ad-hoc idea, you can say "ReliefMesh implements a digitized, real-time 5W matrix at ward level, extending OCHA's standard practice with offline-first mobile capture."

### 1.3 Sphere Standards (Sphere Association / Sphere Handbook)
The global minimum-standard reference for humanitarian relief quantities. Key figure: **2,100 kcal per person per day** minimum survival ration, with defined macronutrient splits (≥17% energy from fat, 10–12% from protein). WFP/UNHCR joint guidelines translate this into standard food-basket compositions (cereal/rice, pulses, oil, etc.) by ration size. This is exactly the missing ingredient for your point #6 ("per person *kg needed, per household *kg needed").

**Relevance to you:** Instead of inventing arbitrary per-person relief quantities, you can build your need-calculation engine on the **Sphere ration table**, scaled for what's locally available in Bangladesh response practice (rice, dal/pulses, oil — already your DB's `ItemCategory` design). This single citation gives your "needed relief calculated" feature (point #6) real academic legitimacy instead of looking like a guess.

### 1.4 HeiGIT / Humanitarian OpenStreetMap Tools
Open geospatial tools used in real disaster response: **MapSwipe** (crowdsourced building/road tagging from satellite imagery) and **openrouteservice** (open-source routing for access/accessibility analysis, built on OpenStreetMap data, no API key required). Both are free and embeddable.

**Relevance to you:** For your "which direction the volunteer moved" (point #4), `openrouteservice` is a genuinely usable, zero-cost routing layer you can integrate alongside Leaflet (which is already in your Section 3.6 tech stack) — no new vendor, no API key, no budget impact (your project constraint in Section 3.1.7 is "zero monetary budget, free/open-source only").

### 1.5 Other relevant systems found (lighter precedent, worth one-line mentions in your report)
- **DisasterConnect** (open-source, real-time resource-to-need matching with map visualization) — closest "modern stack" analog to what you're building (Python/Flask).
- **ResQAI** — AI-assisted resource-need prediction and coordination prototype (Next.js/Express/Google Maps), shows current student/academic-project trend toward AI-enhanced coordination — useful as a "related work, but ReliefMesh focuses on offline-first low-connectivity contexts which AI-cloud-dependent systems like this do not address" contrast point.
- **OpenGov Disaster Preparedness & Recovery** — commercial enterprise product; useful contrast as "expensive, not designed for union-level / low-budget local government," reinforcing your zero-cost constraint as a deliberate design choice, not a limitation.

---

# 2. Analysis of Your Current Files

Your existing 14-section ReliefMesh report (+ DFD doc) is a complete, internally consistent SAD document. Strengths relevant to preserving:

| Area | Current state | Verdict |
|---|---|---|
| Offline-first architecture (IndexedDB/localforage + sync push/pull) | Fully designed, Section 3.6/3.4 | **Keep as-is** — directly answers your earlier confirmation. Also matches the real Feni 2024 event: 92% of mobile towers in Feni district went down during the flood, so offline-first isn't a nice-to-have, it's the only viable design — this is a citable fact you didn't have before. |
| Duplicate detection (7-day window, override+reason) | Fully designed, FR-15 to FR-18 | **Keep as-is** — per your confirmation. Note: under 5W double-counting guidance (1.2 above), this should be reframed as solving a *named, standard* humanitarian data problem, not just a custom business rule. |
| Jurisdiction model (District → Upazila → Union, self-referencing FK) | Section 3.5.2/3.5.3 | **Extend, don't replace.** Currently stops at Union. Your new requirement (point #2: village/ward level) needs one more tier. |
| Roles (UP Official, NGO Worker, Upazila Officer, Public) | Section 3.3/3.10 | **Extend.** Your new sources list (point #5: govt, NGO, outside individuals/institutions, local individuals/institutions) needs 1–2 new role/actor types and a distinction between *organizational* and *individual* actors that doesn't exist yet. |
| Household model (head, NID, GPS, family_size, 3 boolean vulnerability flags) | Section 3.5.5 | **Extend.** Your point #6 needs an **age-bracket breakdown** (adult/elderly/teenager/child counts), not just boolean flags, to drive a real need calculation. |
| Distribution model | Section 3.5.5 | **Keep, but link to new Pledge entity** (your "both stages" answer — pre-declare then log actuals). |
| Public dashboard | FR-19 to FR-22, aggregated counts only | **Upgrade, don't replace.** Currently text/number aggregates only. New requirement is a literal interactive map (heatmap + drill-down District→Upazila→Union→Ward), which is a different UI/data paradigm, not just "more stats." |
| Project context (generic "Bangladesh," no named real event) | Section 3.1.3 | **Replace with Feni 2024/2025-specific grounding.** This is the single highest-value, lowest-effort change — it turns abstract claims into a concrete, citable case. |
| Item categories (Food/WASH/Shelter/Other, no quantities tied to population) | Section 3.3/3.4/3.5 | **Extend with Sphere-based unit rates** so "need" can be calculated, not just tracked. |

**Gap summary:** Your current system answers *"what was distributed and was it a duplicate?"* very well. It does **not yet** answer *"how much is still needed, where, and who nearby has capacity to bring it?"* — which is precisely the new direction you're asking for. The good news: none of your existing entities need to be deleted. You're adding a **need layer**, a **geo layer**, and a **pledge/capacity layer** on top of a sound existing skeleton.

---

# 3. Re-Analysis: Matching External Concepts to Your Specific Project

Mapping each of your 8 stated points to the research above, and to your existing files:

| Your point | External precedent | Where it slots into your existing design |
|---|---|---|
| 1. Real location: Feni, 2024 & 2025 floods | ReliefWeb/OCHA/UNICEF Feni situation reports | Replaces generic Bangladesh narrative in §3.1.3; feeds real upazila/union names into Jurisdiction seed data |
| 2. Map-based, District→Upazila→Village/Ward, public-visible | Sahana Eden mapping (with the polygon-gap you can improve on) + Bangladesh's real admin hierarchy (District→Upazila→Union→Ward→Village, confirmed: Feni has 6 upazilas, 45 unions, 570 villages) | New `Jurisdiction.level` enum value (`WARD`/`VILLAGE`), new public map screens in §3.4/§3.6/§3.7 |
| 3. Heatmap: served vs. remaining households | No direct existing open-source equivalent found at ward granularity — **this is your most original contribution**, worth stating explicitly in the report | New aggregation endpoint + Leaflet heatmap layer; builds on existing `D2 Households` + `D3 DistributionLogs` |
| 4. Map shows volunteer movement, direction, area committed | openrouteservice (free routing) + OCHA 5W "Where" dimension | New `Pledge`/`VolunteerMovement` tracking, optional route line layer |
| 5. Multi-source: govt / NGO / outside individuals / local individuals | Sahana Organization Registry distinguishes org types; OCHA 5W "Who" | Extend `User.role` and add `SourceType` (ORGANIZATION vs INDIVIDUAL) — your current roles don't separate "NGO worker" the person from "the NGO" the org |
| 6. Per-area needed relief, calculated from demographics | Sphere Handbook 2,100 kcal/person/day + WFP/UNHCR ration tables | New `NeedAssessment` entity + calculation service, hybrid auto/override per your answer |
| 7. Sources pre-declare capacity/intent (X kg, Y teams, Z volunteers, area A) | This is OCHA's 5W matrix, almost verbatim | New `ReliefPledge` entity — the "before" stage, separate from existing `DistributionLog` (the "after" stage) — exactly matching your two-stage answer |
| 8. Volunteers + local govt + local adults all "involved" | Same Sahana Organization Registry + Human Resources module pattern | `Volunteer`/`Team` entities linked to a `Pledge`, with `affiliationType` (NGO staff / govt staff / independent local volunteer) |

This table is the bridge between "things that exist in the world" and "things you need to add to your ERD/DFD/SRS."

---

# 4. Deep Analysis — How the Pieces Fit Together (Data Flow Logic)

Before editing files, it's worth stating the actual logic chain once, plainly, since every later section depends on it:

```
1. A Jurisdiction (Ward/Village) has a Household Census
   → sum of family_size, age-bracket counts per household
   → gives: total people, total adults, elderly, teenager, child counts for that area

2. Sphere-based Need Engine takes those counts
   → multiplies by per-person/day rates (rice, dal, oil, water...)
   → multiplied by days-of-coverage (e.g., 7-day relief cycle)
   → produces: NeedAssessment per area, per item category
   → officer can override any auto-suggested number (your "hybrid" answer)

3. Sources (Govt / NGO / Outside Individual / Local Individual) make a Pledge
   → "we are near Ward 4, we have 200kg rice, 3 teams, 12 volunteers"
   → Pledge is geo-tagged to a Jurisdiction + has a status (PLEDGED → EN_ROUTE → ARRIVED → COMPLETED)

4. As the pledge is acted on, existing DistributionLog entries are created
   → each log links back to the Pledge that funded it (new FK)
   → existing duplicate-detection logic runs exactly as before — untouched

5. NeedAssessment.remaining = NeedAssessment.calculated − SUM(DistributionLog.quantity for that area+item)
   → this remaining number IS the heatmap data
   → red/dark = high remaining need, green = mostly served

6. Public map (no login) shows:
   → Heatmap layer (step 5 output)
   → Pledge markers + movement lines (step 3 + openrouteservice, step 4 of your points)
   → Drill-down: District → Upazila → Union → Ward/Village
```

Everything downstream (ERD, DFD, API, UI) is just this loop expressed in each section's notation. Holding this loop in mind makes the file-by-file edits below much easier to apply without losing the thread.

---

# 5. Concepts You Need to Update (Decision List)

Before the file-by-file instructions, here is the flat list of **new or changed concepts**, so you can sanity-check the scope before editing:

### New entities (add to ERD/Class diagram)
1. **NeedAssessment** — per Jurisdiction + ItemCategory, auto-calculated + override fields
2. **ReliefPledge** — pre-declared capacity/intent by a source, before distribution happens
3. **Team** — a pledge can have N teams; each team has a volunteer count
4. **SourceProfile** (or extend `User`) — distinguishes ORGANIZATION (govt dept / NGO) vs INDIVIDUAL (outside / local), with org name, affiliation type
5. **VolunteerMovement** (optional/Could-Have) — direction/route tracking tied to a Pledge

### Changed entities
6. **Jurisdiction** — add `WARD`/`VILLAGE` as valid `level` enum values (currently stops at UNION)
7. **Household** — replace 3 boolean vulnerability flags with **age-bracket counts**: `adult_count`, `elderly_count`, `teenager_count`, `child_count` (keep `is_disabled`/`is_pregnant` as flags, they're not age-brackets)
8. **ItemCategory** — add `per_person_per_day_amount` and `unit`, seeded from Sphere ration data
9. **DistributionLog** — add optional FK `pledge_id` (nullable — distributions can still happen without a prior pledge, e.g. spontaneous local giving)
10. **Role enum** — add `OUTSIDE_VOLUNTEER` / `INDIVIDUAL_DONOR` distinct from `NGO_WORKER` (point #5's "outsider individuals" vs an NGO staff member are not the same actor type)

### New/changed processes (DFD)
11. New **Process: Need Calculation** (reads Household census → writes NeedAssessment)
12. New **Process: Pledge Management** (Source creates/updates Pledge → feeds map)
13. **Process 5 (Dashboard)** — upgrade from "aggregate stats" to "interactive map with heatmap + drill-down + pledge layer"

### New/changed UI screens (UI/UX)
14. Public map screen (District → Upazila → Union → Ward drill-down + heatmap toggle)
15. Source/Volunteer pledge form ("I'm near Ward X, I have...")
16. Need dashboard for officials (auto-suggested numbers, editable)

### New API endpoints
17. `/jurisdictions/:id/need` — get calculated + override need
18. `/pledges` (POST/GET) — create/list pledges
19. `/public/heatmap` — GeoJSON-ish aggregate for map rendering
20. `/public/jurisdictions/:id/drilldown` — children of a jurisdiction node

### New references to add (Section 3.13)
21. OCHA 3W/4W/5W methodology
22. Sphere Handbook / Sphere Association minimum standards
23. Sahana Eden / Sahana Foundation
24. ReliefWeb / OCHA / UNICEF Feni 2024 flood situation reports (real event grounding)
25. HeiGIT open geospatial tools (openrouteservice, MapSwipe) — if you adopt routing

Nothing on this list requires removing the offline sync engine, the duplicate-detection engine, or the existing auth/RBAC system. They all stay; the new entities just attach to them via foreign keys.

---

# 6. File-by-File Update Instructions

Apply in this order (each builds on the previous). For each file: **what to keep**, **what to add**, **exact section/heading**.

---

## 6.1 `Section-3.1-project_initiation_Problem_definition.md`

**Keep:** Vision/Mission, Scope structure, SMART objectives format, Risk Register format, Team formation table, RACI chart.

**Update §3.1.2 "Problem Statement → Who Suffers / Pain Points":**
- Replace generic "Bangladesh" framing with **Feni District** as the named case study.
- Add a new pain point row:

| # | Pain Point | Description |
|---|-----------|--------------|
| 7 | **No visibility into remaining need** | No one — not officials, not NGOs, not the public — can see which wards/villages still need relief and how much, versus which are already served. Aid clusters in accessible areas while remote wards are missed entirely. |
| 8 | **No way for outside/local volunteers to coordinate with official channels** | Individual donors and ad-hoc local volunteer groups (a very large share of real ground response) have no shared channel to declare what they're bringing or where, so their effort isn't visible on the same coordination layer as government/NGO relief. |

**Update §3.1.3 "Background Study of the Problem Domain":**
- Add a new subsection **"3.1.3.1 Case Study: Feni District Floods (2024 & 2025)"** with:
  - The August 2024 eastern Bangladesh floods: 4.5–5.8 million people affected across 11 districts including Feni; Feni district alone had ~92% of mobile towers go down, cutting off communication to all 6 upazilas at the height of the disaster.
  - Feni's administrative makeup: 6 upazilas (Feni Sadar, Sonagazi, Chhagalnaiya, Daganbhuiyan, Parshuram, Fulgazi), 45 unions, ~570 villages — use this real structure as your geo-hierarchy example throughout the report.
  - Note the documented worst-hit unions (e.g., Kalidaha Union in Feni Sadar Upazila) as a concrete example you can refer back to in your UI mockups/screenshots ("Ward view for Kalidaha Union").
  - State plainly: *because mobile network infrastructure itself failed during the disaster, offline-first design (already in Section 3.6) is not optional — it is the defining constraint of this problem domain.* This single sentence retroactively justifies your kept architecture with real evidence.

**Update §3.1.5 "Project Scope → In-Scope":** add:
- Geographic need-mapping module (District → Upazila → Union → Ward/Village drill-down)
- Public heatmap of served vs. remaining households
- Relief-need calculation engine (demographic-based, override-capable)
- Multi-source relief pledge/capacity declaration (government, NGO, outside individual, local individual/institution)

**Update §3.1.6 "SMART Objectives":** add 2 new rows (Objective 6: heatmap loads with correct served/remaining split for a test ward; Objective 7: need-calculation accuracy within Sphere-standard tolerance on test households).

**Update §3.1.9 Team Formation table:** no structural change needed, but note in a footnote that GIS/map feature ownership sits with whoever owns Section 3.6/3.7 (likely Kamrul + Sayeda).

---

## 6.2 `Section-3.2-stakeholder_analysis.md`

**Keep:** Power-Interest grid structure, Person format.

**Update §3.2.1 "Stakeholder Identification":** add rows:

| ID | Stakeholder | Type | Interaction |
|---|---|---|---|
| S11 | Outside Individual Donors | Primary | Pledge relief capacity, view map, log own distribution |
| S12 | Local (in-area) Individual/Institution Volunteers | Primary | Pledge relief capacity for their own neighborhood, coordinate with officials |
| S13 | Volunteer Teams (under NGO/Govt/Independent) | Primary | Move toward pledged area, get logged as part of a Pledge |

**Add §3.2.4 new Person — Person 5: "Arif Hossain (Outside Individual Donor)":**
- Age 30, lives in Dhaka, wants to send relief to his home village in Fulgazi Upazila after seeing news. Goal: know exactly which ward still needs help before sending money/goods, avoid sending to an already-saturated area. Frustration: currently no way to know this except calling relatives. Key need: public heatmap + simple pledge form, no login required to *view*, login only required to *pledge*.

**Update §3.2.5 "Stakeholder Requirements Summary":** add a row for Outside/Local Individual Volunteers: "Public heatmap of need, simple pledge form, no jurisdiction restriction on browsing (read-only), pledge requires lightweight registration only."

---

## 6.3 `Section-3.3-requirements_engineering_SRS.md`

**Keep:** All existing FR-01 to FR-34, all NFRs, existing use cases UC-01 to UC-05, MoSCoW structure, traceability matrix format.

**Add new Functional Requirement block — "Geographic Need Mapping & Multi-Source Coordination":**

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

**Add new Non-Functional Requirement:**

| ID | Category | Requirement |
|---|---|---|
| NFR-14 | Performance | The heatmap layer shall render for a full district (6 upazilas) within 3 seconds on a 3G connection, using pre-aggregated data (not live per-household queries). |
| NFR-15 | Usability | Pledge submission shall require no more than 6 fields for a non-technical first-time volunteer user. |

**Add new User Stories (§3.3.3):**

| ID | Role | Story | Acceptance Criteria |
|----|------|-------|---------------------|
| US-09 | Outside Individual Donor | As someone outside the disaster area, I want to see which wards still need relief before I send help, so my donation doesn't duplicate aid that's already arrived. | Public map loads without login; heatmap shows served vs. remaining; clicking a ward shows item-level remaining need. |
| US-10 | Local Volunteer | As a local volunteer with my own small group, I want to declare what I'm bringing and where, so officials and other groups can see my contribution and avoid going to the same household. | Pledge form requires only name/phone, area, items, quantity, team/volunteer count; appears on map within minutes. |
| US-11 | Upazila Officer | As an Upazila Officer, I want to see auto-calculated need per ward so I can direct incoming NGO/volunteer pledges to the most under-served areas. | Need dashboard shows calculated vs. override vs. remaining, sortable by "most unmet need." |

**Add new Use Cases (§3.3.4):**
- **UC-06: Submit Relief Pledge** (Actor: any Source) — main flow: select area on map → enter item categories/quantities → enter team/volunteer counts → submit → pledge appears on public map with PLEDGED status.
- **UC-07: View Need Heatmap** (Actor: General Public, unauthenticated) — main flow: open map → select drill-down level → toggle heatmap layer → click a ward → see item-level remaining need (aggregated, no PII).
- **UC-08: Calculate & Override Area Need** (Actor: UP Official/Upazila Officer) — main flow: open ward → system shows auto-calculated need by item category → officer edits any value → system stores both calculated and override, uses override where present.

**Update §3.3.5 MoSCoW:**
- **Must Have:** add FR-35, FR-36, FR-38, FR-39, FR-40 (the map + need-calc core is now must-have, per your stated direction)
- **Should Have:** add FR-37, FR-41, FR-42, FR-43, FR-44
- **Could Have:** route/direction tracking (point #4's "which direction the volunteer moved") — this is genuinely advanced (needs `openrouteservice` integration) and fits Could-Have for a one-semester prototype.

**Update §3.3.6 Traceability Matrix:** add rows for FR-35 through FR-44 mapping to UC-06/07/08 and new test case IDs (TC-NEED01, TC-PLEDGE01, etc. — to be filled in when you update Section 3.9).

---

## 6.4 `Section-3.4-system_modeling_DFD_UML.md`

**Keep:** Existing Level 0/1/2 DFDs, existing Use Case Diagram, existing Sequence Diagrams SD-01/02/03, existing Activity Diagram — all untouched, since the core (auth, household reg, distribution, duplicate check, sync) is unchanged.

**Add §3.4.2.1 "Level 1 DFD Extension — New Processes":**
- **P6: Need Calculation** — Input: Household Registry (D2) demographic fields → Output: D7 NeedAssessment store. Reads age-bracket counts, multiplies by Sphere-derived per-person rates from D6 (extended ItemCategory), writes calculated need; accepts officer override.
- **P7: Pledge Management** — Input: Source declaration (area, items, qty, teams, volunteers) → Output: D8 Pledge store. Updates pledge status over its lifecycle; feeds into P5 (Dashboard) for map display.
- **P5: Public Dashboard & Reporting** — *upgrade description*: now reads D7 (NeedAssessment) and D8 (Pledge) in addition to existing D2/D3, to produce the heatmap and pledge-overlay views.

**Add new Data Stores to the Data Stores table:**

| ID | Name | Contents |
|----|------|----------|
| D7 | NeedAssessment | jurisdiction_id, item_category_id, calculated_qty, override_qty, override_reason, computed_at |
| D8 | ReliefPledge | pledge_id, source_id, source_type, jurisdiction_id, item_category_id, pledged_qty, team_count, volunteer_count, status, created_at, updated_at |

**Add §3.4.4.1 "Use Case Diagram Extension":** add actors `OUTSIDE_INDIVIDUAL`, `LOCAL_INDIVIDUAL_OR_INSTITUTION` (or a generic `SOURCE` actor with a `sourceType` attribute if you prefer fewer diagram actors); add use cases `(Submit Relief Pledge)`, `(View Need Heatmap)`, `(Calculate/Override Need)`.

**Add §3.4.5.1 "Class Diagram Extension"** — new classes:

```
┌──────────────────────┐    ┌──────────────────────┐
│   NeedAssessment   │    │   ReliefPledge    │
├──────────────────────┤    ├──────────────────────┤
│ needId: String    │    │ pledgeId: String   │
│ jurisdictionId: String │    │ sourceId: UserId   │
│ itemCategoryId: String │    │ sourceType: Enum   │
│ calculatedQty: Float │    │ jurisdictionId: String │
│ overrideQty: Float  │    │ itemCategoryId: String │
│ overrideReason: String │    │ pledgedQty: Float   │
│ computedAt: DateTime │    │ teamCount: Int    │
├──────────────────────┤    │ volunteerCount: Int  │
│ calculate()      │    │ status: Enum     │
│ override()      │    ├──────────────────────┤
└──────────────────────┘    │ create()       │
                  │ updateStatus()    │
                  └──────────┬───────────┘
                       │ 1
                       │ funds
                       │ *
                  (existing DistributionLog
                   gains optional pledgeId FK)
```

**Add Enums:**
- `SourceType`: GOVERNMENT, NGO, OUTSIDE_INDIVIDUAL, LOCAL_INDIVIDUAL_OR_INSTITUTION
- `PledgeStatus`: PLEDGED, EN_ROUTE, ARRIVED, COMPLETED, CANCELLED

**Update §3.4.6 "Sequence Diagrams"** — add:
- **SD-04: Submit Relief Pledge** — Source → App → Server → D8, then Server → D7 (to show remaining need updates) → Public Map refresh.
- **SD-05: Calculate Area Need** — Officer opens Ward → App requests `/jurisdictions/:id/need` → Server reads D2 household census for that ward → applies Sphere rates → returns calculated value → Officer optionally PUTs an override → Server stores both.

**Update §3.4.7 "Activity Diagram"** — keep the existing Distribution Workflow diagram as-is, since it's unchanged; add a **new, separate** Activity Diagram "Pledge-to-Distribution Workflow": `[Source views heatmap] → [Selects under-served ward] → [Submits Pledge] → [Status: EN_ROUTE] → [Arrives, logs Distribution linked to Pledge] → [Status: COMPLETED] → [Heatmap updates]`.

---

## 6.5 `Section-3.5-database_design_ERD.md`

**Keep:** All existing entities and tables exactly as-is (User, Jurisdiction, Household core fields, DistributionLog, ItemCategory, DuplicateAlert, SyncConflict, Feedback, Inventory).

**Update §3.5.1 "Entity Identification":** add:

| Entity | Description |
|---|---|
| **NeedAssessment** | Calculated and/or officer-overridden relief need for a jurisdiction + item category |
| **ReliefPledge** | A source's declared intent/capacity to deliver relief to an area, tracked through its lifecycle |

**Update §3.5.2 ERD:** add the new entities and relationships (text description, since your diagrams are drawio-based):
- `Jurisdiction (1) ──── (many) NeedAssessment`
- `ItemCategory (1) ──── (many) NeedAssessment`
- `Jurisdiction (1) ──── (many) ReliefPledge`
- `User (1) ──── (many) ReliefPledge` (the source)
- `ReliefPledge (1) ──── (0..many) DistributionLog` *(new optional FK on existing DistributionLog table — this is the only change to an existing table's relationships)*

**Update §3.5.3 "Relationships & Cardinality" table:** add the 4 new rows above.

**Update Household section of §3.5.5 "Data Dictionary" — `households` table:**
- **Remove:** `is_elderly`, `is_disabled`, `is_pregnant` as the *only* demographic data (keep `is_disabled` and `is_pregnant` — those are not age-brackets and remain useful for vulnerability flagging in distribution priority).
- **Add columns:**

| Column | Type | Constraints | Description |
|---|---|---|---|
| adult_count | INT | NOT NULL, DEFAULT 0 | Number of adult members (18–59) |
| elderly_count | INT | NOT NULL, DEFAULT 0 | Number of elderly members (60+) |
| teenager_count | INT | NOT NULL, DEFAULT 0 | Number of teenage members (13–17) |
| child_count | INT | NOT NULL, DEFAULT 0 | Number of child members (0–12) |

*(Keep `family_size` as a stored total — validated equal to the sum of the four counts at save time.)*

**Update `jurisdictions` table in §3.5.5:**
- `level` ENUM extended: `DISTRICT / UPAZILA / UNION / WARD` (Ward used loosely to also represent village-level granularity in rural unions, since Bangladesh's urban wards and rural villages sit at the same tier under a Union).

**Update `item_categories` table:**
- Add: `per_person_per_day_amount` DECIMAL(8,3), `unit` VARCHAR(20) — seeded from Sphere/WFP reference rates (rice, dal, oil, water, etc.) so need calculation has a default to work from.

**Add new table definitions to §3.5.5:**

#### Table: `need_assessments`
| Column | Type | Constraints | Description |
|---|---|---|---|
| need_id | UUID | PK | Unique need record |
| jurisdiction_id | UUID | FK → jurisdictions | Target area |
| item_category_id | UUID | FK → item_categories | Item type |
| calculated_qty | DECIMAL(10,2) | NOT NULL | System-computed need |
| override_qty | DECIMAL(10,2) | NULLABLE | Officer-entered value, used if present |
| override_reason | TEXT | NULLABLE | Why officer changed the value |
| override_by | UUID | FK → users, NULLABLE | Who overrode it |
| computed_at | TIMESTAMP | NOT NULL | When calculated_qty was last (re)computed |

#### Table: `relief_pledges`
| Column | Type | Constraints | Description |
|---|---|---|---|
| pledge_id | UUID | PK | Unique pledge ID |
| source_id | UUID | FK → users | Who pledged |
| source_type | ENUM | NOT NULL | GOVERNMENT / NGO / OUTSIDE_INDIVIDUAL / LOCAL_INDIVIDUAL_OR_INSTITUTION |
| jurisdiction_id | UUID | FK → jurisdictions | Target area |
| item_category_id | UUID | FK → item_categories | Item type pledged |
| pledged_qty | DECIMAL(10,2) | NOT NULL | Amount pledged |
| team_count | INT | DEFAULT 1 | Number of teams |
| volunteer_count | INT | DEFAULT 1 | Number of volunteers across teams |
| status | ENUM | DEFAULT 'PLEDGED' | PLEDGED / EN_ROUTE / ARRIVED / COMPLETED / CANCELLED |
| created_at | TIMESTAMP | NOT NULL | — |
| updated_at | TIMESTAMP | NOT NULL | — |

**Update `distribution_logs` table:** add one nullable column:
| Column | Type | Constraints | Description |
|---|---|---|---|
| pledge_id | UUID | FK → relief_pledges, NULLABLE | Pledge this distribution fulfilled, if any |

**Update §3.5.4 "Normalization":** add one line confirming the new tables are also in 3NF (single-column surrogate PKs, no transitive dependencies — `item_category_id`'s per-person rate lives in `item_categories`, not duplicated into `need_assessments`).

---

## 6.6 `Section-3.6-architecture_and_tech_stack.md`

**Keep:** PWA + REST API + MongoDB architecture, full existing tech stack table, offline-first sync design, all existing API endpoints.

**Update §3.6.1 "System Architecture Overview" diagram:** add to the Client Layer box:
```
┌────────────────────────┐
│  Public Map / Heatmap  │
│  (Leaflet.js +         │
│   heatmap overlay)     │
│  - District→Ward drilldown │
│  - Served vs remaining  │
│  - Active pledge markers │
└────────────────────────┘
```
and add to the Server Layer's endpoint list:
```
/jurisdictions   → CRUD + drilldown for District/Upazila/Union/Ward
/needs       → Get/override calculated need per jurisdiction+item
/pledges      → Create/list/update relief pledges
/public/heatmap   → Aggregated served-vs-remaining data for map render
```

**Update §3.6.2 "Technology Stack → Frontend":** add one row:

| Technology | Version | Justification |
|---|---|---|
| Leaflet.heat (leaflet.heat plugin) | 0.2.x | Lightweight heatmap layer on top of existing Leaflet.js; zero additional cost, no new vendor |
| openrouteservice (optional, Could-Have) | API v2 | Free, no-API-key-required routing for volunteer movement/direction (point #4); only added if Could-Have scope is reached |

**Update §3.6.4 "API Design Overview" table:** add rows:

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| GET | `/jurisdictions` | No | List jurisdictions, filterable by parent (drilldown) |
| GET | `/jurisdictions/:id/need` | Yes | Get calculated + override need for an area |
| PUT | `/jurisdictions/:id/need` | UP Official, Upazila Officer | Override calculated need with reason |
| POST | `/pledges` | Yes | Create a relief pledge |
| GET | `/pledges` | No (public, aggregated) / Yes (full detail) | List active pledges, public view aggregates source identity for individuals |
| PUT | `/pledges/:id/status` | Yes (pledge owner or official) | Update pledge lifecycle status |
| GET | `/public/heatmap` | No | Aggregated served-vs-remaining data by jurisdiction, for map heatmap layer |

**Update §3.6.5 "Deployment Architecture":** no structural change — Netlify/Railway/MongoDB Atlas free-tier stack already supports the additional collections at zero extra cost; add one line confirming this explicitly so the "zero-cost deployment confirmed" claim still holds after the extension.

---

## 6.7 `Section-3.7-UI_UX_design.md`
*(You did not paste this file's content, so these are instructions to apply against whatever currently exists there — likely wireframe descriptions, Figma links, or screen-by-screen breakdowns matching the existing modules.)*

**Keep:** Existing screen list for auth, household registration, distribution logging, duplicate-warning UI, existing dashboard layouts, feedback/profile/inventory screens.

**Add new screens:**
1. **Public Map Screen** (no login) — full-screen Leaflet map, drill-down breadcrumb (District > Upazila > Union > Ward), heatmap toggle, legend (served = green, partial = yellow, unmet = red), tap a ward → bottom sheet with item-level remaining need + active pledges in that ward.
2. **Pledge Submission Screen** — for any logged-in source: select source type (if not already fixed by role), select target jurisdiction (map-pick or dropdown), select item category + quantity, team count, volunteer count, submit → confirmation with pledge ID and status tracker.
3. **Need Dashboard Screen** (Officials) — table/list of jurisdictions under their authority, sorted by "most unmet need" by default, each row shows calculated vs. override vs. distributed-so-far, tap to edit override.
4. **Pledge Status Tracker** (for the pledging source) — simple status stepper: Pledged → En Route → Arrived → Completed, with a one-tap status update button (designed for low-literacy field use, consistent with your existing NFR-09/NFR-10 design philosophy).

**Add a note on accessibility consistency:** all new screens should follow the same Bengali-label-first, large-tap-target design principle already established in your existing UI/UX section (NFR-09, NFR-10) — this is a direct continuity instruction, not a new design system.

---

## 6.8 `Section-3.8-implementation_plan.md`

**Keep:** Existing module table M1–M20, Gantt chart structure, environment setup, coding standards, branching strategy — fully intact, since none of it is invalidated.

**Add new modules to the table** (placed after M20, since the existing modules are marked complete):

| # | Module | Owner | Deadline (Week) | Status |
|---|---|---|---|---|
| M21 | Jurisdiction model extension (Ward level) + seed Feni district data | Kamrul | Week 17 | [ ] |
| M22 | Household model extension (age-bracket counts) + migration of existing flags | Kamrul | Week 17 | [ ] |
| M23 | Need calculation engine (Sphere-based rates, auto + override API) | Kamrul | Week 18 | [ ] |
| M24 | Relief Pledge module (model, API, status lifecycle) | Kamrul (API), Sayeda (UI) | Week 18 | [ ] |
| M25 | Public heatmap + drill-down map (Leaflet + leaflet.heat) | Nahid | Week 19 | [ ] |
| M26 | Need dashboard for officials (override UI) | Sayeda | Week 19 | [ ] |
| M27 | Link DistributionLog ↔ Pledge (optional FK + UI) | Kamrul | Week 20 | [ ] |
| M28 | (Could-Have) Volunteer movement/direction via openrouteservice | Nahid | Week 20+ | [ ] |
| M29 | Testing for all new modules (unit + integration) | Abidul | Week 20–21 | [ ] |
| M30 | Documentation update across all 14 sections (this update) | All | Week 21 | [ ] |

**Add a short new subsection §3.8.6 "Migration Note for Existing Data":**
> Because `households.is_elderly/is_disabled/is_pregnant` boolean flags are being supplemented with age-bracket counts, write a one-time migration script that sets `adult_count = family_size` as a safe default for any pre-existing test households, flagged for manual correction. `is_disabled` and `is_pregnant` flags are retained unchanged.

---

## 6.9 `Section-3.9-testing_and_QA.md`

**Keep:** All existing test cases TC-01 to TC-22, TC-FB01-04, TC-INV01-03, UAT-01 to UAT-04, test results summary table, bug report template — unchanged, since the underlying features they test are unchanged.

**Add new Unit Test Cases — "Need Calculation Module":**

| TC ID | Test Case | Input | Expected Output |
|---|---|---|---|
| TC-NEED01 | Calculated need matches Sphere rate × population | Household with adult_count=4, rice rate=X kg/person/day, 7-day cycle | calculated_qty = 4 × X × 7 |
| TC-NEED02 | Override replaces calculated value | calculated_qty=50, override_qty=70 submitted | API returns/uses 70, calculated_qty preserved unchanged in record |
| TC-NEED03 | Need aggregates correctly up the jurisdiction tree | 3 wards with known needs under 1 union | Union-level need = sum of ward-level needs |

**Add new Unit Test Cases — "Relief Pledge Module":**

| TC ID | Test Case | Input | Expected Output |
|---|---|---|---|
| TC-PLEDGE01 | Valid pledge created | Valid source, jurisdiction, item, qty | 201 Created, status=PLEDGED |
| TC-PLEDGE02 | Status transitions in order | PLEDGED → EN_ROUTE → ARRIVED → COMPLETED | Each transition succeeds; skipping backward (COMPLETED → PLEDGED) rejected |
| TC-PLEDGE03 | Public pledge view hides individual donor identity | source_type=OUTSIDE_INDIVIDUAL, public GET /pledges | Response shows source_type + area + qty, not name/contact |

**Add new Integration Test Case:**

| TC ID | Flow | Steps | Expected |
|---|---|---|---|
| TC-23 | Pledge → Distribution → Need update | 1. Submit pledge for Ward X, 100kg rice. 2. Log distribution of 60kg linked to that pledge. 3. Query heatmap for Ward X. | Remaining need for Ward X drops by 60kg; pledge still shows 40kg unfulfilled if you track that derived field, or simply shows ARRIVED/COMPLETED per your chosen granularity. |

**Add new UAT Scenario — "UAT-05 Outside Donor Heatmap Check":**
**Actor:** Simulated outside individual donor
**Scenario:** Open public map, drill down District → Feni Sadar Upazila → a specific union → a ward, see remaining need by item, submit a pledge for that ward.
**Pass Criteria:** Map loads without login; drill-down works at all 4 levels; heatmap color reflects actual served/remaining ratio; pledge submission succeeds with ≤6 form fields.

**Update §3.9.6 "Test Results Summary":** add a new row category "Need & Pledge Modules" once implemented, with its own pass/fail counts — do not retroactively edit the existing "36/36 passing" figure, since that reflects the pre-update system truthfully.

---

## 6.10 `Section-3.10-security_and_access_control.md`

**Keep:** STRIDE table, JWT mechanism, RBAC middleware pattern, existing permissions matrix rows, PII handling rules, input validation/injection prevention sections — unchanged.

**Update §3.10.1 STRIDE table:** add one row:

| Threat | Category | Example in ReliefMesh | Mitigation |
|---|---|---|---|
| Fake pledge to appear helpful without delivering | Tampering / Repudiation | A source pledges relief to inflate visible coverage on the public map without ever distributing | Pledge status only advances to COMPLETED when linked to an actual logged DistributionLog; stale PLEDGED/EN_ROUTE pledges auto-flagged after a configurable time window for official review |

**Update §3.10.3 "Permissions Matrix":** add rows:

| Permission | Public | UP Official | NGO Worker | Upazila Officer | Outside/Local Individual |
|---|:---:|:---:|:---:|:---:|:---:|
| View public heatmap | [x] | [x] | [x] | [x] | [x] |
| Submit relief pledge | [ ] | [x] | [x] | [x] | [x] |
| View calculated need (own jurisdiction) | [ ] | [x] | [x] | [x] | [ ] |
| Override calculated need | [ ] | [x] (own union) | [ ] | [x] (all) | [ ] |
| View other sources' pledge details (full) | [ ] | [ ] | [ ] | [x] | [ ] |

**Update §3.10.4 "Data Privacy Design":** add a row:

| Data Field | Classification | Where Visible |
|---|---|---|
| Outside/local individual donor name & contact | Sensitive PII | Authenticated officials only; public pledge view shows source_type + area + quantity only |

---

## 6.11 `Section-3.11-deployment_and_maintenance.md`

**Keep:** Entire deployment process, env var reference, backup/recovery plan — unchanged, since no new infrastructure component (database, hosting platform, payment) is introduced.

**Update §3.11.5 "Known Limitations & Future Roadmap":** add to Known Limitations:

| Limitation | Impact | Reason |
|---|---|---|
| Need calculation uses static Sphere reference rates, not real-time local price/availability data | May overstate or understate true local need in atypical situations | No live market-data integration in prototype scope |
| Pledge status is self-reported by the source | A pledge marked COMPLETED is not independently verified beyond the linked distribution log | No third-party verification mechanism in prototype scope |

Add to Future Roadmap:

| Feature | Priority | Notes |
|---|---|---|
| Volunteer movement/route tracking via openrouteservice | Medium | Could-Have scope item from this update; adds real direction/ETA visualization |
| Verified-pledge badge (cross-checked by 2+ field reports) | Low | Would reduce risk of inflated/fake pledges appearing on public map |

---

## 6.12 `Section-3.12-project_management.md`

**Keep:** Meeting minutes log format, weekly progress report format, branching log, change request log, lessons-learned template.

**Add a new Change Request entry to §3.12.4:**

| CR ID | Date | Requested By | Description | Impact | Approved By | Status |
|---|---|---|---|---|---|---|
| CR-002 | 2026-06-20 | Tanvir (on behalf of Team_Skipper) | Add geographic need-mapping, heatmap, Sphere-based need calculation, and multi-source relief pledge system; ground project in real Feni 2024/2025 flood case | Scope: expands (new modules M21–M28); Timeline: +5 weeks; Risk: medium (new GIS/map complexity, but builds on existing Leaflet dependency already in stack) | Supervisor (pending) | Proposed |

**Add a new Meeting Minutes Log row** (fill in your real date once discussed with the team/supervisor) summarizing this direction change for the record.

---

## 6.13 `Section-3.13-references_and_bibliography.md`

**Keep:** All existing 21 references and the annotated bibliography table.

**Add new references** (renumber sequentially as [22] onward, or insert and renumber per your citation tool):

```
[22] OCHA Centre for Humanitarian Data, "The Rough Guide to Aid-Activity Data on HDX:
   3W/4W/5W Reporting," Centre for Humanitarian Data. [Online].
   Available: https://centre.humdata.org/the-rough-guide-to-aid-activity-data-on-hdx/

[23] Sphere Association, "The Sphere Handbook: Humanitarian Charter and Minimum
   Standards in Humanitarian Response," 4th ed., Practical Action Publishing, 2018.
   [Online]. Available: https://spherestandards.org/

[24] Sahana Software Foundation, "Sahana Eden: Open Source Disaster Management
   System," Sahana Foundation. [Online]. Available: https://sahanafoundation.org/

[25] ReliefWeb / OCHA, "Flooding in Eastern Bangladesh (Feni, Comilla, Noakhali,
   Habiganj, Moulvibazar, Khagrachhari and Rangamati), Briefing Note," 24 Aug. 2024.
   [Online]. Available: https://reliefweb.int/report/bangladesh/flooding-eastern-bangladesh-feni-comilla-noakhali-habiganj-moulvibazar-khagracchari-and-rangamati-briefing-note-24082024

[26] UNOCHA, "Bangladesh: Eastern Flash Floods 2024 Situation Report No. 02,"
   30 Aug. 2024. [Online]. Available: https://www.unocha.org/publications/report/bangladesh/bangladesh-eastern-flash-floods-2024-situation-report-no-02-30-august-2024

[27] HeiGIT, "Five Open-Source Tools to Harness Geographic Knowledge for Disaster
   Management," HeiGIT Blog. [Online]. Available: https://heigit.org/five-open-source-tools-to-harness-geographic-knowledge-for-disaster-management/

[28] World Food Programme & UNHCR, "Guidelines for Estimating Food and Nutritional
   Needs in Emergencies." [Online]. Available: https://www.unhcr.org/sites/default/files/legacy-pdf/3b9cbef7a.pdf
```

**Update the Annotated Bibliography table** with rows explaining why each is used:

| Ref | Why Used |
|---|---|
| [22] | Direct precedent for the Relief Pledge / multi-source coordination module — ReliefMesh implements a digitized 5W matrix |
| [23], [28] | Source of the per-person daily ration rates used in the Need Calculation engine |
| [24] | Closest existing open-source system; basis for comparison and for identifying the map-polygon gap ReliefMesh improves on |
| [25], [26] | Real-event grounding: the specific 2024 Feni flood case used throughout Section 3.1 and UI examples |
| [27] | Source of the optional openrouteservice integration for volunteer movement tracking (Could-Have feature) |

---

## 6.14 `Section-3.14-presentation_and_defense.md`

**Keep:** Overall slide structure, demo script format, viva Q&A format, individual contribution template, readiness checklist.

**Update §3.14.1 Slide Structure:** insert 2 new slides after the existing "Key Features" slide (renumber subsequent slides accordingly):

| Slide # | Title | Content | Presenter |
|---|---|---|---|
| 6b | The Feni Case | Real 2024 flood data: 92% mobile towers down, 6 upazilas, named worst-hit union — grounds the whole project in a real event | Abidul |
| 6c | Map & Need Engine | Heatmap screenshot + Sphere-based calculation explanation in one slide | Kamrul |

**Update §3.14.2 "Live Demo Script":** insert a new step between existing Step 4 (Log a Distribution) and Step 5 (Trigger Duplicate Alert):

```
Step 4b — Show the Map & Submit a Pledge (1.5 min)
  → Open public map (no login)
  → Drill down: Feni District → Sonagazi Upazila → a union → a ward
  → Toggle heatmap, point out a red (unmet need) ward
  → Login as an "outside individual" test account
  → Submit a pledge for that ward (item, qty, team/volunteer count)
  → Show pledge appear on map with PLEDGED status
  → Update status to EN_ROUTE → show map marker change
```

**Update §3.14.3 "Anticipated Viva Questions":** add:

**Q: Why calculate need from Sphere standards instead of just asking officials to estimate it?**
A: Officials can and do override every calculated number — that's by design (FR-37). But starting from a recognized humanitarian standard (2,100 kcal/person/day baseline, Sphere Handbook) means the *default* is defensible and consistent across wards, instead of depending entirely on individual judgment, which is exactly the kind of inconsistency that caused real coordination failures in past Bangladesh relief efforts (cited in Section 3.1).

**Q: Isn't the Relief Pledge feature just a duplicate of Distribution Log?**
A: No — a Pledge is a *declaration of intent/capacity before action* (matching the international "5W" methodology used by OCHA), while a Distribution Log is a *record of action already taken* (your existing, unchanged feature). A pledge can be cancelled or fail to convert into a distribution; the system tracks both stages separately so the map can show "help is coming" versus "help has arrived" as genuinely different states.

**Q: How do you stop someone from pledging fake relief just to look good on the public map?**
A: See Section 3.10.1 — pledges only show as COMPLETED when linked to an actual synced Distribution Log; long-stale pledges are flagged for official review. It is a transparency-encouraging design, not a verification-proof one — clearly stated as a known limitation in Section 3.11.5.

---

# 7. Prototype Build Flow (Web First, Other Later)

Since you asked specifically for a phased flow:

### Phase 1 — Web Prototype (this semester, Modules M21–M29)
1. **Data layer first:** extend Jurisdiction (add WARD level) and seed real Feni data (6 upazilas, real union names you already have from research) → extend Household with age-bracket counts → add ItemCategory rate fields.
2. **Need engine second:** build the calculation service as a pure function first (input: counts + rates + days → output: quantities) and unit-test it *before* wiring any UI — this isolates your Sphere-based logic from API/DB concerns and is easy to defend in viva.
3. **Pledge module third:** CRUD + status lifecycle, no map yet — test with Postman just like your existing modules.
4. **Map last:** Leaflet + leaflet.heat consuming the now-stable `/public/heatmap` and `/pledges` endpoints. Build the map UI only after the data it displays is already correct and tested — avoids debugging two unknowns (data correctness + map rendering) at once.
5. Link DistributionLog → Pledge (the optional FK) only after both sides independently work.
6. Run the new TC-NEED/TC-PLEDGE/TC-23/UAT-05 tests.
7. Update all 14 docs (this document's Section 6 is your checklist for that).

### Phase 2 — Beyond web (explicitly out of this semester's scope, list only)
- Native Android app (you already have this as a documented future-roadmap item in Section 3.11 — the map/heatmap feature slots into that same future plan, no new decision needed)
- Real-time WebSocket-driven live pledge movement (replacing polling)
- openrouteservice-based actual route/direction lines (Could-Have → Should-Have once Phase 1 is stable)
- Verified-pledge / trust scoring system

This keeps your existing "web PWA first, native app later" decision (already justified in Section 3.1.5 Out-of-Scope and Section 3.11 Future Roadmap) fully consistent — nothing in this update contradicts that earlier decision, it just adds one more web-first module to build before any native work begins.

---

*End of ReliefMesh v2 Update Plan.*
*Next step: confirm this plan, then I can draft the actual revised text for any specific section file on request — tell me which section to start with.*
