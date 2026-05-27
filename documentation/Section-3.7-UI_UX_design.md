# Section 3.7 — UI/UX Design
**Project:** RelifMesh — Disaster Relief Coordination System for Local Government
**Team:** Team_Skipper | **Course:** CSE-3208 System Analysis & Design Lab
**Last Updated:** 2026-05-27
**Primary Designer:** Sayeda Mofatteha Ahmed, Iftekhar Alam Nahid

> **Note:** High-fidelity mockups are in `designs/mockups/` (Figma exports). This document covers information architecture, user flows, wireframe descriptions, and the design system.

---

## 3.7.1 Information Architecture (Site Map)

```
RelifMesh
│
├── Public (no login)
│  └── /dashboard     → Public distribution summary + map
│
├── Login          → /login
│
├── UP Official / NGO Worker
│  ├── /home        → Personal dashboard (today's logs, sync status)
│  ├── /households
│  │  ├── /households/new → Register new household
│  │  ├── /households   → Search / list households
│  │  └── /households/:id → Household detail + distribution history
│  ├── /distributions
│  │  ├── /distributions/new → Log new distribution
│  │  └── /distributions   → My distribution logs
│  └── /sync-status    → Offline queue status, conflict review
│
└── Upazila Officer
  ├── /home        → Jurisdiction overview dashboard
  ├── /unions       → List of unions under jurisdiction
  ├── /unions/:id     → Union-level distribution detail
  ├── /reports      → Generate and export PDF/CSV reports
  ├── /alerts       → Duplicate alert review log
  └── /accounts      → Manage UP Official accounts
```

---

## 3.7.2 User Flow Diagrams

### Flow 1 — Register Household (UP Official)
```
[Open App] → [Home] → [+ New Household]
→ [Auto-capture GPS] → [Fill Form: name, NID, family size, flags]
→ [Take Photo] → [Save]
→ [If Online: sync immediately] / [If Offline: queue + show HH-ID]
→ [Confirmation screen with HH-ID]
```

### Flow 2 — Log Distribution
```
[Home] → [Log Distribution]
→ [Search Household by HH-ID / Name]
→ [Select Household]
→ [System checks duplicates]
  → [No duplicate: proceed]
  → [Duplicate found: show warning]
    → [Override with reason] / [Cancel]
→ [Select item, quantity] → [Take photo] → [Confirm GPS]
→ [Submit]
→ [Online: sync] / [Offline: queue]
→ [Success screen]
```

### Flow 3 — Public Dashboard
```
[Open URL (no login)] → [Public Dashboard]
→ [View summary cards: total households, distributions, items]
→ [View map with union markers]
→ [Click union marker: see item breakdown]
→ [Apply date filter]
```

---

## 3.7.3 Wireframe Descriptions

### Screen 1 — Login
- Full-width card centered on screen
- App logo + name at top
- Fields: Username / Email, Password
- CTA button: "Login" (primary, full width)
- Small link: "Forgot password?" 
- No registration link (accounts created by Upazila Officers)
- Bengali label option toggle at top-right

---

### Screen 2 — Home Dashboard (UP Official)
```
┌─────────────────────────────┐
│ [*] RelifMesh  [Sync: OK] │
│ Welcome, Rahim Uddin    │
│ Char Fasson Union      │
├─────────────────────────────┤
│ ┌───────────┐ ┌───────────┐│
│ │ Today's  │ │ Pending  ││
│ │ Logs: 12 │ │ Sync: 3  ││
│ └───────────┘ └───────────┘│
│ ┌───────────┐ ┌───────────┐│
│ │Households │ │ Alerts  ││
│ │ Reg: 48  │ │  2   ││
│ └───────────┘ └───────────┘│
├─────────────────────────────┤
│ [+ New Household]     │
│ [Log Distribution]     │
│ [Search Household]     │
└─────────────────────────────┘
```

---

### Screen 3 — Household Registration Form
```
┌─────────────────────────────┐
│ ← Register Household    │
├─────────────────────────────┤
│ Head of Household Name *  │
│ [________________________] │
│               │
│ NID Number *        │
│ [________________________] │
│               │
│ Family Size *        │
│ [__]            │
│               │
│ Vulnerability Flags:    │
│ [ ] Elderly [ ] Disabled    │
│ [ ] Pregnant         │
│               │
│ GPS Location        │
│ [[GPS] Auto-detected: 22.3°N] │
│               │
│ Photo *           │
│ [[CAM] Take Photo]       │
│ [preview thumbnail]     │
│               │
│ [    SAVE    ]   │
└─────────────────────────────┘
```

---

### Screen 4 — Log Distribution
```
┌─────────────────────────────┐
│ ← Log Distribution     │
├─────────────────────────────┤
│ Search Household      │
│ [HH-ID or Name ___________] │
│               │
│ ┌─────────────────────────┐ │
│ │ ✓ Rahim Uddin      │ │
│ │  HH-2024-001 | 5 members│ │
│ └─────────────────────────┘ │
│               │
│ Item Category *       │
│ [▼ Food — Rice       ]│
│               │
│ Quantity *  Unit      │
│ [______]   [▼ kg    ] │
│               │
│ Photo *           │
│ [[CAM] Take Photo]       │
│               │
│ GPS: [[GPS] Auto]       │
│               │
│ [    SUBMIT    ]   │
└─────────────────────────────┘
```

---

### Screen 5 — Duplicate Warning
```
┌─────────────────────────────┐
│ [!] Duplicate Alert     │
├─────────────────────────────┤
│ This household already   │
│ received Rice (Food)    │
│               │
│ Previous distribution:   │
│ [Date] 3 days ago        │
│ By: NGO Worker (BRAC)  │
│ [Item] Rice — 10 kg       │
│               │
│ Do you want to proceed?   │
├─────────────────────────────┤
│ [Cancel] [Override + Reason]│
└─────────────────────────────┘
```

---

### Screen 6 — Public Dashboard
```
┌─────────────────────────────────────────────┐
│ RelifMesh — Public Relief Tracker     │
│ Sylhet Flood Response 2026         │
├─────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌─────────────┐ │
│ │Households│ │ Logs   │ │ Unions   │ │
│ │ 1,240  │ │ 3,891  │ │ Covered 12 │ │
│ └──────────┘ └──────────┘ └─────────────┘ │
├─────────────────────────────────────────────┤
│ [MAP — union markers with distribution   │
│  density heat indicators]         │
│                       │
├─────────────────────────────────────────────┤
│ Distribution by Item (last 7 days)     │
│ Rice ████████████ 1,200 kg         │
│ Water ██████ 600 L             │
│ Tarp ████ 240 pcs             │
├─────────────────────────────────────────────┤
│ Filter by: [Union ▼] [Date range]     │
└─────────────────────────────────────────────┘
```

---

## 3.7.4 Accessibility & Low-Literacy Design Considerations

| Consideration | Design Decision |
|--------------|-----------------|
| Low literacy | Large icons alongside text labels; no text-only navigation |
| Bengali support | All field labels and system messages in Bengali on field screens |
| Minimal typing | Dropdowns for item categories, GPS auto-capture, photo instead of text description |
| Poor lighting | High contrast UI; large tap targets (min. 48×48px) |
| One-handed use | Primary actions reachable at bottom of screen (thumb zone) |
| Error feedback | Clear red/green color coding + icon + text for all validations |
| Offline indicator | Persistent status bar showing online/offline/sync status at top |

---

## 3.7.5 Design System

### Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#1A6B3C` | Buttons, active states, header |
| Primary Light | `#D4EDDA` | Card backgrounds, success states |
| Warning | `#E67E22` | Duplicate alerts, pending sync |
| Danger | `#C0392B` | Errors, conflict alerts |
| Neutral Dark | `#2C3E50` | Body text |
| Neutral Light | `#F5F6FA` | Page backgrounds |
| White | `#FFFFFF` | Cards, input backgrounds |

### Typography
| Level | Font | Size | Weight |
|-------|------|------|--------|
| App Title | System sans-serif | 22px | 700 |
| Section Header | System sans-serif | 18px | 600 |
| Body | System sans-serif | 16px | 400 |
| Caption | System sans-serif | 13px | 400 |
| Button Label | System sans-serif | 16px | 600 |

*(System sans-serif = Roboto on Android, SF Pro on iOS — no custom font load for performance)*

### Component Standards
- All buttons: min height 48px, border-radius 8px
- All input fields: min height 44px, clear label above field
- Cards: white background, 4px border-radius, subtle shadow
- Form sections: grouped in collapsible cards with section title
- Loading state: skeleton placeholders (no spinners that block interaction)

---

*End of Section 3.7 — Next: Section 3.8 Implementation Plan*
