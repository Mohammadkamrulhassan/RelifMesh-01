# RelifMesh — Disaster Relief Coordination System for Local Government

> *"One mesh. No duplicates. No household left behind."*

**Course:** CSE-3208 System Analysis & Design Lab  
**Team:** Team_Skipper | **Project:** #6 ReliefMesh  
**Supervisor:** MD Mynoddin, Assistant Professor, RMSTU

---

## Team

| ID | Name | Role |
|----|------|------|
| 2101011001 | Abidul Islam | System Analyst / QA Tester |
| 2101011005 | MD. Kamrul Hassan | Project Manager / Developer |
| 2101011013 | Sayeda Mofatteha Ahmed | UI/UX Designer |
| 2101011038 | Iftekhar Alam Nahid | UI/UX Designer |

---

## Problem

During floods and cyclones in Bangladesh, relief distribution suffers from:
- **Duplicate aid** — same household served multiple times
- **Missed households** — vulnerable families skipped
- **No real-time tracking** — paper-based logs, late consolidation
- **Inter-agency opacity** — NGOs and government teams operate independently

RelifMesh solves this with an offline-first platform for Union Parishad officials, NGO workers, and Upazila officers to jointly register households, log item-level distributions, prevent duplicates, and expose a public transparency dashboard.

---

## Project Structure

```
RelifMesh/
│
├── frontend/               # React PWA (Vite + Tailwind + PouchDB)
│   ├── public/             # Static assets, manifest, icons
│   └── src/
│       ├── pages/          # Route-level page components
│       ├── components/     # Reusable UI components
│       ├── services/       # API client, auth, offline sync
│       ├── hooks/          # Custom React hooks
│       ├── store/          # State management
│       ├── utils/          # Helper functions
│       └── styles/         # Global styles
│
├── backend/                # Node.js + Express REST API
│   ├── src/
│   │   ├── routes/         # API route definitions
│   │   ├── controllers/    # Business logic
│   │   ├── models/         # Database queries
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── utils/          # Helpers (duplicate check, PDF gen)
│   │   ├── db/             # Migrations and seeds
│   │   └── config/         # Environment config
│   └── tests/              # Jest test files
│
├── documentation/          # 14 SAD module deliverables
│   ├── Section-3.1-...
│   ├── Section-3.2-...
│   └── ... (13 more)
│
├── diagrams/               # draw.io / UML / ERD files
│   ├── sequence-diagrams/
│   └── activity-diagrams/
│
├── designs/                # Figma exports
│   ├── wireframes/
│   ├── mockups/
│   └── style-guide/
│
├── reports/                # PM artifacts
│   ├── meeting-minutes/
│   └── weekly-progress/
│
├── submission/             # Final deliverables
│   ├── demo-video/
│   ├── presentation-slides/
│   └── individual-contributions/
│
├── assets/                 # Shared media
├── .env.example            # Environment variable template
└── .gitignore
```

---

## Quick Start

```bash
# Backend
cd backend
cp ../.env.example .env    # fill in your values
npm install
npm run migrate
npm run seed
npm run dev

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

---

## Deliverables Status

| Module | Document | Status |
|--------|----------|--------|
| 3.1 | Project Initiation & Problem Definition | ✅ Complete |
| 3.2 | Stakeholder Analysis | ✅ Complete |
| 3.3 | Requirements Engineering (SRS) | ✅ Complete |
| 3.4 | System Modeling (DFD & UML) | ✅ Complete |
| 3.5 | Database Design (ERD) | ✅ Complete |
| 3.6 | Architecture & Tech Stack | ✅ Complete |
| 3.7 | UI/UX Design | ✅ Complete |
| 3.8 | Implementation Plan | ✅ Complete |
| 3.9 | Testing & QA | ✅ Complete |
| 3.10 | Security & Access Control | ✅ Complete |
| 3.11 | Deployment & Maintenance | ✅ Complete |
| 3.12 | Project Management | ✅ Complete |
| 3.13 | References & Bibliography | ✅ Complete |
| 3.14 | Presentation & Defense | ✅ Complete |
| **Prototype** | Frontend + Backend code | 🔜 In Progress |
