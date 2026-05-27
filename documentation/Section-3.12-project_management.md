# Section 3.12 — Project Management Artifacts
**Project:** RelifMesh — Disaster Relief Coordination System for Local Government
**Team:** Team_Skipper | **Course:** CSE-3208 System Analysis & Design Lab
**Last Updated:** 2026-05-27
**Project Manager:** MD. Kamrul Hassan

---

## 3.12.1 Meeting Minutes Log

> Add a new entry for every team meeting and supervisor meeting.
> Store detailed minutes in `reports/meeting-minutes/YYYY-MM-DD_<type>.md`

### Log Summary Table

| # | Date | Type | Attendees | Key Decisions | Action Items | Next Meeting |
|---|------|------|-----------|--------------|--------------|--------------|
| 1 | — | Team kickoff | All 4 | Project topic confirmed | Set up GitHub repo, assign roles | Week 2 |
| 2 | — | Supervisor | All + MD Mynoddin | Approved team formation | Submit form by Week 2 deadline | Week 3 |
| — | — | — | — | *(fill as meetings happen)* | — | — |

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
| `feature/household-registration` | M4 | Kamrul | [ ] | — |
| `feature/distribution-log` | M6 | Kamrul | [ ] | — |
| `feature/duplicate-detection` | M7 | Kamrul | [ ] | — |
| `feature/offline-sync` | M5/M9 | Kamrul | [ ] | — |
| `feature/public-dashboard` | M11 | Nahid | [ ] | — |
| `feature/upazila-dashboard` | M10 | Sayeda | [ ] | — |

### Git Discipline Rules Followed
- [ ] No direct commits to `main`
- [ ] All features via pull request
- [ ] At least 1 reviewer per PR
- [ ] Daily commits by active member (even `docs:` commits count)
- [ ] Meaningful commit messages (`feat:`, `fix:`, `docs:`, etc.)

---

## 3.12.4 Change Request Log

> Use this log whenever scope, requirements, or design decisions change after Module 3 is locked.

| CR ID | Date | Requested By | Description | Impact | Approved By | Status |
|-------|------|-------------|-------------|--------|-------------|--------|
| CR-001 | — | — | *(example: Add SMS notification feature)* | Out of scope; deferred to roadmap | — | Rejected |
| — | — | — | *(fill as changes arise)* | — | — | — |

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
## Lessons Learned — RelifMesh Project

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
