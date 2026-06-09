# Section 3.7 — UI/UX Design
**Project:** RelifMesh — Disaster Relief Coordination System for Local Government
**Team:** Team_Skipper | **Course:** CSE-3208 System Analysis & Design Lab
**Last Updated:** 2026-06-09
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

### Color Palette (Implemented — Result09 Design System)

#### Light Theme
| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#2563eb` | Buttons, active states, links |
| Primary Hover | `#1d4ed8` | Button hover state |
| Primary Light | `#eff6ff` | Light card backgrounds |
| Surface | `#ffffff` | Cards, input backgrounds |
| Surface 2 | `#f8fafc` | Subtle page backgrounds |
| Border | `#e2e8f0` | Card borders, dividers |
| Border Strong | `#cbd5e1` | Active borders, inputs |
| Text Primary | `#1e293b` | Body text |
| Text Secondary | `#64748b` | Secondary text, captions |
| Text Muted | `#94a3b8` | Placeholder text |
| Danger | `#ef4444` | Errors, delete actions |
| Danger Light | `#fef2f2` | Error backgrounds |
| Warning | `#f59e0b` | Alerts, pending states |
| Warning Light | `#fffbeb` | Alert backgrounds |
| Success | `#22c55e` | Success states |
| Success Light | `#f0fdf4` | Success backgrounds |

#### Dark Theme
| Token | Hex | Usage |
|-------|-----|-------|
| Surface | `#0f172a` | Page background |
| Surface 1 | `#1e293b` | Card backgrounds |
| Surface 2 | `#334155` | Elevated surfaces |
| Border | `#334155` | Card borders |
| Border Strong | `#475569` | Active borders |
| Text Primary | `#f1f5f9` | Body text |
| Text Secondary | `#94a3b8` | Secondary text |
| Text Muted | `#64748b` | Placeholder text |

#### Sidebar (Dark)
| Token | Usage |
|-------|-------|
| `#0f172a` | Sidebar background |
| `#1e293b` | Hover/active item background |
| `#3b82f6` | Active item text/indicator |
| `#94a3b8` | Default item text |

### Typography (Implemented)
| Level | Font | Size | Weight |
|-------|------|------|--------|
| App Title | Inter | 22px | 700 |
| Section Header | Inter | 18px | 600 |
| Body | Inter | 16px | 400 |
| Caption | Inter | 13px | 400 |
| Button Label | Inter | 16px | 600 |

*Google Fonts: Inter (400, 500, 600, 700) loaded via `index.html`.*
*Monospace: JetBrains Mono (if needed) for code/metrics display.*

### Component Standards (Implemented)
- All buttons: min height 40px (sm 32px, lg 48px), border-radius 8px, 6 variants (primary, secondary, danger, success, warning, ghost)
- All input fields: min height 44px, clear label above field, error/hint/success states
- Cards: surface background, 12px border-radius, 1px border, subtle shadow
- Form sections: grouped in `.page-section` containers with section title
- Loading state: centered spinner with message (`.page-section` wrapper)
- Data tables: full-width, striped rows, sticky header with sort indicators
- Sidebar: fixed dark panel, collapsible, mobile overlay with slide-in
- Topbar: fixed header with breadcrumbs, theme toggle, sync status indicator

---

### Screen 7 — Profile Page (Authenticated)
```
┌─────────────────────────────┐
│ ← My Profile          │
├─────────────────────────────┤
│ Account Information      │
│ ┌───────────────────────────┐│
│ │ Email: user@up.gov.bd  ││
│ │ Role: UP Official    ││
│ │ Organization: N/A    ││
│ │ Active: Yes         ││
│ └───────────────────────────┘│
│               │
│ Edit Profile          │
│ ┌───────────────────────────┐│
│ │ Full Name *        ││
│ │ [________________]  ││
│ │ Organization       ││
│ │ [________________]  ││
│ │               ││
│ │ [Save Changes]    ││
│ └───────────────────────────┘│
└─────────────────────────────┘
```

### Screen 8 — Feedback Form (Public)
```
┌─────────────────────────────┐
│ Send Feedback          │
│ We value your opinion      │
├─────────────────────────────┤
│ Your Name *           │
│ [________________________] │
│               │
│ Contact (optional)      │
│ [________________________] │
│               │
│ Category *           │
│ [▼ Complaint         ]│
│               │
│ Message *           │
│ ┌─────────────────────────┐ │
│ │                   │ │
│ │                   │ │
│ │                   │ │
│ └─────────────────────────┘ │
│                   0/1000  │
│               │
│ [Submit Feedback]      │
└─────────────────────────────┘
```

### Screen 9 — Feedback Management (Upazila Officer)
```
┌─────────────────────────────┐
│ Feedback — 5 entries    │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ [!] New  Kamrul     │ │
│ │ Complaint | 2 hours ago│ │
│ │ "Need more rice..."│ │
│ │ [Respond]         │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ Abidul (Suggestion)  │ │
│ │ 1 day ago          │ │
│ │ Response: Thanks!    │ │
│ └─────────────────────────┘ │
│ ◄Prev 1 2 Next►       │
└─────────────────────────────┘
```

### Screen 10 — Inventory Tracking (Upazila Officer)
```
┌─────────────────────────────┐
│ Inventory Stock          │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ Rice        1000 kg │ │
│ │ Distributed: 230 kg   │ │
│ │ Remaining: 770 kg   │ │
│ │ [Update Stock]       │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ Water        500 L  │ │
│ │ Distributed: 120 L   │ │
│ │ Remaining: 380 L   │ │
│ │ [Update Stock]       │ │
│ └─────────────────────────┘ │
│ [+ New Inventory Item]  │
└─────────────────────────────┘
```

---

*End of Section 3.7 — Next: Section 3.8 Implementation Plan*
