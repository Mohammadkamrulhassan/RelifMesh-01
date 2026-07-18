# Section 3.12 — Project Management Artifacts
**Project:** ReliefMesh — Disaster Relief Coordination System for Local Government
**Team:** Team_Skipper | **Course:** CSE-3208 System Analysis & Design Lab
**Last Updated:** 2026-06-09
**Project Manager:** MD. Kamrul Hassan

---

## 3.12.1 Meeting Minutes Log

> Add a new entry for every team meeting and supervisor meeting.
> Store detailed minutes in `reports/meeting-minutes/YYYY-MM-DD_<type>.md`

### Log Summary Table

| # | Date | Type | Attendees | Key Decisions | Action Items | Next Meeting |
|---|------|------|-----------|--------------|--------------|--------------|
| 1 | 2026-05-27 | Team kickoff | All 4 | Project topic confirmed — ReliefMesh disaster relief coordination system | Set up GitHub repo, assign roles | Week 2 |
| 2 | 2026-05-28 | Supervisor | All + MD Mynoddin | Approved team formation, provided feedback on scope | Submit SRS draft by Week 3 | Week 3 |
| 3 | 2026-06-01 | Team | All 4 | Backend architecture finalized (Express + Mongoose), frontend framework confirmed (React + Vite + Tailwind) | Start coding: auth + household CRUD | Week 4 |
| 4 | 2026-06-05 | Team | All 4 | All core features built (auth, households, distributions, alerts, reports, public dashboard). UI restyled with Result09 design system. | Begin offline sync wiring, photo upload, test writing | Week 5 |
| 5 | 2026-06-09 | Team | All 4 | Offline queue wired, sync service completed with conflict resolution, photo upload endpoint added, documentation updated. | Bug fixes, demo video prep, presentation | Week 6 |
| 6 | 2026-06-10 | Team | All 4 | Feedback module (model, API, form, list) built. Inventory/stock module built. User profile endpoints + frontend page built. Pagination + search added to households/distributions. Dashboard enhanced with feedback/sync stats. All 14 documentation files updated for new features. | Final testing, demo video, presentation prep | Week 7 |
| 7 | 2026-06-20 | Team | All 4 | v2 feature design approved: need calculation engine, pledge management, geographic area hierarchy, heatmap rendering. All 14 docs updated for Phase 2. | Begin Phase 2 implementation (M21–M32), add new tests | Week 17 |

### Meeting Minutes Template
```markdown
## Meeting #[N] — [Date]
**Type:** Team / Supervisor / Stakeholder
**Attendees:** [names]
**Duration:** [X minutes]

### Agenda
1. ...
2. ...

### Discussion & Decisions
- ...

### Action Items
| Task | Owner | Due |
|------|-------|-----|
| ... | ... | ... |

### Next Meeting
Date: [date] | Time: [time] | Location/Platform: [Discord/Teams/Physical]
```

---

## 3.12.2 Weekly Progress Reports

> Store each week's report in `reports/weekly-progress/week-NN.md`

### Progress Summary

| Week | Dates | Key Achievements | Blockers | Status |
|------|-------|------------------|----------|--------|
| 1 | May 25–31 | Project setup, repo structure, documentation drafts (Sections 3.1–3.7) | — | Complete |
| 2 | Jun 1–7 | Backend: all modules implemented (auth, households, distributions, alerts, reports, public, sync). Frontend: all pages built, Result09 design system applied. | Sync service needed conflict resolution wiring | Complete |
| 3 | Jun 8–14 | Offline queue wired, sync service completed with conflict detection, photo upload endpoint added, all 28 tests passing, RBAC role-gating fixed, documentation updated. | — | Complete |
| 4 | Jun 15–21 | Feedback module (model + controller + routes + tests), inventory module (model + controller + routes + tests), user profile endpoints, pagination + search filters, enhanced dashboard, toast notifications, Profile/Feedback frontend pages, all 14 docs updated for new features. All 36 tests passing. | — | Complete |

### Progress Report Template
```markdown
## Week [NN] Progress Report
**Date:** [start date] – [end date]
**Prepared by:** [PM name]

### Completed This Week
- [ ] Task 1
- [ ] Task 2

### In Progress
- [ ] Task 3 (owner: ..., ETA: ...)

### Blocked / Issues
- Issue: [description] | Impact: [low/medium/high] | Resolution: [plan]

### Next Week Plan
- [ ] Task A
- [ ] Task B

### Module Completion Status
| Module | Status | % Done |
|--------|--------|--------|
| 3.1 | [x] | 100% |
| 3.2 | 🔄 | 60% |
| ... | | |

### Notes for Supervisor
- ...
```

---

## 3.12.3 Version Control Discipline Log

> Evidence of Git discipline to be presented at defense.

### Branch Activity Summary *(update as project progresses)*

| Branch | Purpose | Created By | Merged? | PR Link |
|--------|---------|-----------|---------|---------|
| `main` | Production | Kamrul | — | — |
| `develop` | Integration | Kamrul | — | — |
| `feature/household-registration` | M4 | Kamrul | [x] | — |
| `feature/distribution-log` | M6 | Kamrul | [x] | — |
| `feature/duplicate-detection` | M7 | Kamrul | [x] | — |
| `feature/offline-sync` | M5/M9 | Kamrul | [x] | — |
| `feature/public-dashboard` | M11 | Nahid | [x] | — |
| `feature/upazila-dashboard` | M10 | Sayeda | [x] | — |

### Git Discipline Rules Followed
- [x] No direct commits to `main`
- [x] All features via pull request
- [x] At least 1 reviewer per PR
- [x] Daily commits by active member (even `docs:` commits count)
- [x] Meaningful commit messages (`feat:`, `fix:`, `docs:`, etc.)

---

## 3.12.4 Change Request Log

> Use this log whenever scope, requirements, or design decisions change after Module 3 is locked.

| CR ID | Date | Requested By | Description | Impact | Approved By | Status |
|-------|------|-------------|-------------|--------|-------------|--------|
| CR-001 | — | — | *(example: Add SMS notification feature)* | Out of scope; deferred to roadmap | — | Rejected |
| CR-002 | 2026-06-20 | Supervisor / Team | Phase 2 v2 features: need calculation engine, pledge management, geographic area hierarchy (ward-level), heatmap overlay rendering | Expands scope — adds 10+ modules (M21–M32), updates all documentation sections, extends ERD and data dictionary | MD Mynoddin, PM | Approved |

### Change Request Template
```markdown
## Change Request CR-[NNN]
**Date:** [date]
**Requested By:** [name]
**Description:** [what change is proposed]
**Reason:** [why it is needed]
**Impact Assessment:**
 - Scope: [expand / reduce / no change]
 - Timeline: [adds X days / no impact]
 - Risk: [low / medium / high]
**Decision:** [Approved / Rejected / Deferred]
**Approved By:** [PM + Supervisor if major]
```

---

## 3.12.5 Final Lessons-Learned Document

*(To be completed at end of semester — Week 16)*

### Template

```markdown
## Lessons Learned — ReliefMesh Project

### What Went Well
- ...

### What Could Have Been Better
- ...

### Technical Lessons
- Offline-first: [reflection on IndexedDB + custom sync experience]
- Duplicate detection: [tuning challenges]
- Team Git workflow: [what worked]

### Process Lessons
- Documentation before coding: [impact on efficiency]
- Weekly supervisor meetings: [value]
- RACI chart: [did it prevent confusion]

### Recommendations for Future Teams
1. ...
2. ...
3. ...
```

---

## 3.12.6 Communication Log

| Date | Channel | Participants | Topic | Outcome |
|------|---------|-------------|-------|---------|
| — | Discord | Team | Initial planning | Roles agreed | 
| — | Email | Kamrul → MD Mynoddin | Submit team formation | Awaiting approval |
| — | — | — | *(fill as communication happens)* | — |

---

*End of Section 3.12 — Next: Section 3.13 References & Bibliography*
