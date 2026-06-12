# Section 3.7 — UI/UX Design
**Project:** ReliefMesh — Disaster Response & Relief Management System
**Team:** Team_Skipper | **Course:** CSE-3208 System Analysis & Design Lab
**Last Updated:** 2026-06-10

---

## 3.7.1 Screen Map (v2)

```
Public / Unauthenticated
├── Landing Page
├── Login
├── Register (Citizen / Volunteer / NGO / Donor)
├── About / Contact
├── Active Campaigns (Public)
└── News & Updates

Citizen (Victim)
├── Dashboard
├── SOS (Emergency Request)
│   ├── New SOS
│   └── SOS History
├── Relief Request
│   ├── New Request
│   └── Request History
├── Missions (My Rescues)
├── Notifications
└── Profile

Volunteer / NGO Worker / Govt Official
├── Dashboard
├── Pending Missions
├── Active Missions
│   ├── Mission Details
│   ├── Chat (Mission-Scoped)
│   └── Complete Mission
├── SOS Map (Real-Time)
├── Relief Distribution
│   ├── New Distribution
│   └── Distribution History
├── Household Management
├── Notifications
└── Profile

NGO Admin
├── Dashboard
├── Campaigns
│   ├── Create Campaign
│   ├── Edit Campaign
│   └── Donation Reports
├── Inventory Management
├── Shelter Management
├── Team Management
├── Notifications
└── Reports

Donor
├── Dashboard (Donation History)
├── Browse Campaigns
├── Make Donation
├── Receipts
├── Notifications
└── Profile

Admin (Super Admin)
├── Command Center Dashboard
├── User Management
├── SOS Analytics
├── Mission Monitoring
├── Shelter Overview
├── Campaign Verification
├── Audit Logs
├── System Config
├── Reports & Export
└── Notifications
```

---

## 3.7.2 Mockup / Screen Descriptions

### 1. SOS Request Screen (Victim)
```
┌─────────────────────────────────────┐
│ ← SOS                       Language │
├─────────────────────────────────────┤
│ ⚠ EMERGENCY SOS REQUEST              │
│                                     │
│ [📍 Use My Location]                 │
│                                     │
│ Type of Help Needed:                 │
│ ○ Rescue  ○ Food  ○ Water           │
│ ○ Medical  ○ Shelter  ○ Other       │
│                                     │
│ Description (Optional):              │
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Attach Image: [📷 Capture Photo]    │
│ [🖼 Choose from Gallery]             │
│                                     │
│ 🟢 [SEND SOS — Send Location]       │
│                                     │
│ *Your GPS coordinates will be        │
│  shared with rescue teams.          │
│ *Works offline — will sync when     │
│  connected.                         │
└─────────────────────────────────────┘
```

### 2. Rescue Mission Dashboard (Volunteer)
```
┌─────────────────────────────────────┐
│ 🦺 Missions                🔔 3     │
├─────────────────────────────────────┤
│                                      │
│ ┌─ Pending (2) ──────────────────┐ │
│ │ ⚠ CRITICAL — Flood Rescue       │ │
│ │ 📍 Mirpur, Dhaka                 │ │
│ │ 👤 Ayesha Begum (3 victims)     │ │
│ │ [  Accept  ] [  Map  ]          │ │
│ └─────────────────────────────────┘ │
│                                      │
│ ┌─ Active (1) ───────────────────┐ │
│ │ 🚗 En Route — Medical Evac      │ │
│ │ 📍 Uttara, Dhaka                │ │
│ │  ETA: 7 mins                    │ │
│ │ [  Update  ] [  Chat  ]         │ │
│ └─────────────────────────────────┘ │
│                                      │
│ ┌─ Active SOS Map ───────────────┐ │
│ │        🗺 [Map Widget]          │ │
│ │   🔴 ●●○●●●●○○○○○○○○○○○○      │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### 3. Campaign & Donation (NGO Admin)
```
┌─────────────────────────────────────┐
│ 📢 Campaigns              + New     │
├─────────────────────────────────────┤
│  Search campaigns...                │
│                                      │
│ ┌─ Active Campaigns ─────────────┐ │
│ │ "Flood Relief 2026"            │ │
│ │ 🏢 Brac NGO                   │ │
│ │ Goal: ৳500,000  Raised: ৳342,500 │ │
│ │ ████████████░░░░░░░░ 68%      │ │
│ │ [  Edit  ] [  View Donations  ]  │ │
│ │ [  Pause  ]                      │ │
│ └─────────────────────────────────┘ │
│                                      │
│ ┌─ Recent Donations ────────────┐   │
│ │ Donor        Amount   Date    │   │
│ │ Karim Mia   ৳2,000  10 Jun   │   │
│ │ Fatima      ৳5,000  09 Jun   │   │
│ │ Anonymous   ৳500    08 Jun   │   │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### 4. Admin Command Center
```
┌─────────────────────────────────────┐
│ Admin Command Center        🔴Live  │
├─────────────────────────────────────┤
│  ┌──────┐ ┌──────┐ ┌──────┐       │
│  │ 🆘   │ │ 🚗   │ │ 🏠   │       │
│  │ 12   │ │  8   │ │  4   │       │
│  │ SOS  │ │Active│ │Shel- │       │
│  │ Now  │ │Missions│ │ ters │       │
│  └──────┘ └──────┘ └──────┘       │
│  ┌──────┐ ┌──────┐ ┌──────┐       │
│  │ 💰   │ │ 👥   │ │ 📊   │       │
│  │ ৳2.1M│ │  245 │ │ 89%  │       │
│  │Donat-│ │Volun-│ │Res-  │       │
│  │ ions │ │ teers │ │ponse │       │
│  └──────┘ └──────┘ └──────┘       │
│                                      │
│ ┌─ SOS Heat Map ─────────────────┐ │
│ │        🗺  [Map Widget]         │ │
│ │  🔴 🔴🟡🟢🔴🟡🟢🔴🔴🔴        │ │
│ └─────────────────────────────────┘ │
│                                      │
│ ┌─ Recent Alerts ───────────────┐   │
│ │ [SOS] Mirpur — 2 min ago     │   │
│ │ [SOS] Mohammadpur — 5 min ago│   │
│ │ [Donation] ৳50k to Flood Relief│ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### 5. Mobile Navigation (Bottom Tab)

```
┌──────────────────────────────────┐
│                                  │
│         [Screen Content]         │
│                                  │
│                                  │
│                                  │
├──────────────────────────────────┤
│ 🏠  🆘  📋  🔔  👤              │
│Home  SOS  Tasks  Alerts  Profile │
└──────────────────────────────────┘
```
Persistent bottom tab bar: Home, SOS (red icon, quick trigger), Tasks/Alerts, Notifications, Profile.

---

## 3.7.3 UI/UX Principles

| Principle | Application |
|-----------|-------------|
| **Mobile-First** | All screens designed for 360–480px width first; responsive to desktop |
| **Emergency Priority** | SOS button always accessible (fixed FAB on mobile, quick panel on desktop) |
| **Offline Resilient** | Forms save to IndexedDB on submit; clear visual queued indicator |
| **Accessibility** | High-contrast colors, large touch targets (>48px), screen reader labels |
| **Low Bandwidth** | Lazy image loading, compressed assets, text-first UI |
| **Color Semantics** | Red → SOS/Emergency, Amber → Waiting, Green → Resolved/Safe |

### Color Palette
| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Emergency | Red | `#DC2626` | SOS, alerts, critical status |
| Warning | Amber | `#F59E0B` | Pending, en-route, waiting |
| Success | Green | `#16A34A` | Resolved, rescued, donation complete |
| Info | Blue | `#2563EB` | Info, mission details |
| Neutral | Slate | `#64748B` | Secondary text, inactive |

---

## 3.7.4 User Flow Diagrams

### SOS → Rescue Flow
```
[Victim opens app]
       │
       ▼
[SOS Screen] ←─────────────────────────┐
       │                                │
  [Fill Type + Location]               │
       │                                │
       ▼                                │
[Submit SOS] ──[Offline?]──► [Queue to IndexedDB]
       │ (online)                      │
       ▼                                │
[Server receives SOS]                  │
       │                                │
       ▼                                │
[Broadcast SOS to Volunteers]          │
       │                                │
       ▼                                │
[Volunteer Accepts Mission]            │
       │                                │
       ▼                                │
[Mission Active — Chat Enabled]        │
       │                                │
       ▼                                │
[Volunteer Completes Rescue]           │
       │                                │
       ▼                                │
[Victim Feedback / Mission Closed] ────┘
```

### Donation Flow
```
[User browses campaigns]
       │
       ▼
[Select Campaign → View Details]
       │
       ▼
[Enter Amount → Select Payment Method]
       │
       ▼
[Redirect to bkash/Nagad/Rocket]
       │
       ▼
[Payment Confirmation]
       │
       ▼
[Receipt Generated + Notification]
       │
       ▼
[Campaign Progress Updated]
```

---

## 3.7.5 Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 640px | Single column, bottom nav |
| Tablet | 640–1024px | Two column, sidebar nav |
| Desktop | > 1024px | Full layout, persistent sidebar |

---

*End of Section 3.7 — Next: Section 3.8 Implementation Plan*
