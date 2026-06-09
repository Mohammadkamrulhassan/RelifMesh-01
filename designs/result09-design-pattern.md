# Result09 — Design Theme & Pattern Reference

## 1. Brand Identity

- **Name:** Result09 (Academic Result Management System, RMSTU)
- **Font Family Display:** `'DM Serif Display'`, Georgia, serif (headings, logo)
- **Font Family Body:** `'Outfit'`, sans-serif (body text)
- **Font Family Mono:** `'DM Mono'`, `'Courier New'`, monospace (code/data)

---

## 2. Color System (Design Tokens)

All colors are defined as CSS custom properties on `:root` and `[data-theme='light']`, with overrides in `[data-theme='dark']`.

### Brand Colors

| Token | Light Value | Dark Value | Usage |
|-------|-------------|------------|-------|
| `--color-primary` | `#2563eb` (Blue 600) | `#60a5fa` (Blue 400) | Primary buttons, links, active states |
| `--color-primary-hover` | `#1d4ed8` | `#93c5fd` | Button hover states |
| `--color-primary-light` | `#dbeafe` | `#1e3a5f` | Background tints, focus rings |
| `--color-primary-muted` | `#93c5fd` | `#334155` | Muted accents |
| `--color-accent` | `#0d9488` (Teal 600) | `#2dd4bf` (Teal 400) | Secondary brand accent |
| `--color-accent-hover` | `#0f766e` | `#5eead4` | Accent hover |
| `--color-accent-light` | `#ccfbf1` | `#134e4a` | Accent background tint |

### Semantic Colors

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--color-success` | `#059669` | `#34d399` | Success indicators |
| `--color-success-light` | `#a7f3d1` | `#064e3b` | Success backgrounds |
| `--color-warning` | `#d97706` | `#fbbf24` | Warning indicators |
| `--color-warning-light` | `#fef3c7` | `#451a03` | Warning backgrounds |
| `--color-danger` | `#e53e3e` | `#f87171` | Error/danger states |
| `--color-danger-light` | `#fecaca` | `#7f1d1d` | Error backgrounds |
| `--color-info` | `#0284c7` | `#38bdf8` | Info indicators |
| `--color-info-light` | `#e0f2fe` | `#0c4a6e` | Info backgrounds |

### Neutral / Surface Colors

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--color-bg` | `#f8fafc` | `#0f172a` | Page background |
| `--color-surface` | `#ffffff` | `#1e293b` | Card/surface background |
| `--color-surface-2` | `#f1f5f9` | `#1e293b` | Secondary surface (hover, table headers) |
| `--color-surface-3` | `#e2e8f0` | `#334155` | Tertiary surface |
| `--color-border` | `#cbd5e1` | `#334155` | Default border |
| `--color-border-strong` | `#94a3b8` | `#475569` | Strong borders |

### Text Colors

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--color-text` | `#0f172a` | `#f1f5f9` | Primary text |
| `--color-text-primary` | `#0f172a` | `#f1f5f9` | Primary body text |
| `--color-text-secondary` | `#475569` | `#cbd5e1` | Secondary text |
| `--color-text-muted` | `#94a3b8` | `#64748b` | Muted/placeholder text |
| `--color-text-inverse` | `#ffffff` | `#0f172a` | Text on dark backgrounds |

### Form Inputs

| Token | Light | Dark |
|-------|-------|------|
| `--color-input-bg` | `#ffffff` | `#1e293b` |
| `--color-input-border` | `#cbd5e1` | `#334155` |
| `--color-input-focus` | `#2563eb` | `#60a5fa` |

### Sidebar

| Token | Value | Usage |
|-------|-------|-------|
| `--sidebar-bg` | `#1e293b` | Dark slate background |
| `--sidebar-text` | `#cbd5e1` | Default nav text |
| `--sidebar-text-muted` | `#64748b` | Section labels |
| `--sidebar-active-bg` | `rgba(37,99,235,0.25)` | Active item background |
| `--sidebar-active-text` | `#93c5fd` | Active item text |
| `--sidebar-active-border` | `#60a5fa` | Active left border accent |
| `--sidebar-hover-bg` | `rgba(255,255,255,0.06)` | Hover state background |
| `--sidebar-width` | `260px` | Expanded width |
| `--sidebar-collapsed` | `64px` | Collapsed width |

### Topbar

| Token | Light | Dark |
|-------|-------|------|
| `--topbar-bg` | `#ffffff` | `#1e293b` |
| `--topbar-border` | `#e2e8f0` | `#334155` |
| `--topbar-height` | `60px` | Fixed height |

---

## 3. Spacing System

| Token | Value |
|-------|-------|
| `--space-1` | `4px` |
| `--space-2` | `8px` |
| `--space-3` | `12px` |
| `--space-4` | `16px` |
| `--space-5` | `20px` |
| `--space-6` | `24px` |
| `--space-8` | `32px` |
| `--space-10` | `40px` |
| `--space-12` | `48px` |
| `--space-16` | `64px` |

---

## 4. Border Radius

| Token | Value |
|-------|-------|
| `--radius-sm` | `4px` |
| `--radius-md` | `8px` |
| `--radius-lg` | `12px` |
| `--radius-xl` | `16px` |
| `--radius-full` | `9999px` |

---

## 5. Shadows

| Token | Light Value | Dark Value |
|-------|-------------|------------|
| `--shadow-sm` | `0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)` | `0 1px 3px rgba(0,0,0,0.3)` |
| `--shadow-md` | `0 4px 12px rgba(15,23,42,0.08), 0 2px 4px rgba(15,23,42,0.04)` | `0 4px 12px rgba(0,0,0,0.4)` |
| `--shadow-lg` | `0 10px 30px rgba(15,23,42,0.10), 0 4px 8px rgba(15,23,42,0.06)` | `0 10px 30px rgba(0,0,0,0.5)` |
| `--shadow-xl` | `0 20px 50px rgba(15,23,42,0.12)` | `0 20px 50px rgba(0,0,0,0.6)` |

---

## 6. Transitions

| Token | Value |
|-------|-------|
| `--transition-fast` | `120ms ease` |
| `--transition-base` | `200ms ease` |
| `--transition-slow` | `350ms cubic-bezier(0.4, 0, 0.2, 1)` |

---

## 7. Z-Index Scale

| Token | Value |
|-------|-------|
| `--z-dropdown` | `100` |
| `--z-sticky` | `200` |
| `--z-drawer` | `300` |
| `--z-modal` | `400` |
| `--z-toast` | `500` |
| `--z-tooltip` | `600` |

---

## 8. Layout Architecture

### App Shell

```
.app-shell (flex, min-height: 100vh)
├── .sidebar (fixed, left, full height)
└── .main-area (flex: 1, flex column)
    ├── .topbar (fixed height, breadcrumb + actions)
    └── .page-content (flex: 1, scrollable, padding, margin-top for topbar)
```

- Sidebar is `position: fixed; top: 0; left: 0; height: 100vh`
- Main area has `margin-left: var(--sidebar-width)` when sidebar is expanded
- When sidebar collapsed: `margin-left: var(--sidebar-collapsed)` (64px)
- Page content has `margin-top: var(--topbar-height)` (60px)

### Layout classes

| Class | Purpose |
|-------|---------|
| `.app-shell` | Flex container, full viewport height |
| `.main-area` | Right content area, flex column |
| `.main-area--with-sidebar` | Margin-left: 260px |
| `.main-area--collapsed` | Margin-left: 64px |
| `.page-content` | Scrollable content area with padding |
| `.page-header` | Flex row: title + actions, margin-bottom |
| `.page-section` | White card section with border + shadow |
| `.page-header-row` | Title row with flexbox spacing |

---

## 9. Sidebar Design

- **Background:** `#1e293b` (dark slate)
- **Fixed position**, full viewport height
- **Width:** 260px expanded, 64px collapsed
- **Transition:** smooth slide with `350ms cubic-bezier`
- **Logo bar:** 60px height, bottom border, brand mark (32px rounded square with initial) + text label
- **Navigation sections** with uppercase labels ("Main Menu", "Management", etc.)
- **Nav items** with 18px SVG icons + text labels
- **Active state:** left border accent (3px wide, `#60a5fa`), semi-transparent blue background, blue text
- **Hover state:** `rgba(255,255,255,0.06)` background
- **Collapse toggle** at bottom with chevron icon
- **Logout** item at bottom in footer
- **Tooltips** on collapsed sidebar icons

---

## 10. Topbar Design

- **Background:** white (light) / `#1e293b` (dark)
- **Bottom border:** 1px solid border color
- **Fixed height:** 60px
- **Left:** Hamburger menu (mobile only) + breadcrumb navigation
- **Breadcrumb:** path segments separated by `/`, last segment bold
- **Right:** Role switcher dropdown, theme toggle icon (sun/moon), user avatar + dropdown menu
- **Dark mode toggle:** moon icon in light mode, sun icon in dark mode

---

## 11. UI Components

### Button

| Variant | Classes | Visual |
|---------|---------|--------|
| Primary | `.btn .btn-primary` | Blue bg, white text, hover darker blue |
| Secondary | `.btn .btn-secondary` | Gray bg, dark text |
| Danger | `.btn .btn-danger` | Red bg, white text |
| Ghost | `.btn .btn-ghost` | Transparent, text only |
| Outline | `.btn .btn-outline` | Transparent with border |
| Success | `.btn .btn-success` | Green bg, white text |

Sizes: `xs`, `sm`, `md`, `lg` with `.btn-xs`, `.btn-sm`, `.btn-md`, `.btn-lg`

Features: loading spinner, left/right icons, fullWidth, disabled state

### Card

| Property | Value |
|----------|-------|
| Background | `var(--color-surface)` |
| Border | `1px solid var(--color-border)` |
| Border radius | `var(--radius-lg)` (12px) |
| Padding | `20px` |
| Shadow | `var(--shadow-sm)` |

### Input

| State | Styling |
|-------|---------|
| Default | 1px border, white bg |
| Focus | Blue border, blue shadow ring (`0 0 0 3px var(--color-primary-light)`) |
| Error | Red border, error text below |
| Disabled | Opacity 0.6, cursor not-allowed |
| With icon | `.has-left-icon` / `.has-right-icon` padding adjustment |

### Modal

- Overlay: semi-transparent black (`rgba(0,0,0,0.5)`), centered flex
- Container: white surface, rounded corners, shadow
- Sizes: `sm`, `md`, `lg`, `xl`, `full`
- Header: title + close button (✕)
- Body: scrollable content
- Footer: action buttons, right-aligned
- Escape key to close, overlay click to close, focus trap

### DataTable

- Full width, collapsed borders
- Header: `--color-surface-2` background, `0.8rem` bold text, bottom border
- Body rows: `1px` bottom border, hover row highlight
- Empty state: centered muted text with padding

### Badge / Chip

- Small rounded label, color-coordinated with semantic meaning
- Used for status, grade letters, counts

---

## 12. Auth Page (Split-Screen)

```
.auth-layout (grid, 2 columns, full viewport)
├── .auth-brand-panel (left 50%)
│   ├── Brand logo (DM Serif Display, white, large)
│   ├── Tagline (muted, descriptive)
│   └── Gradient overlay background effect
│       (radial-gradient at 20% 80% warm, at 80% 20% cool)
└── .auth-panel (right 50%)
    └── .auth-card (centered, 420px max-width, shadow, rounded)
        ├── Title: "Welcome back" (DM Serif Display)
        ├── Subtitle: description
        ├── Error alert banner (dismissible)
        └── Form
            ├── Input (identifier with icon)
            ├── Input (password with toggle)
            └── Button (fullWidth, primary)
```

- Left panel: dark sidebar background (same as sidebar), hidden on mobile
- Right panel: white card centered, responsive

---

## 13. Page Structure Conventions

| Class | Usage |
|-------|-------|
| `.page-header` | Title + action button row |
| `.page-title` | Page heading (DM Serif Display, `1.75rem`) |
| `.page-subtitle` | Description text under title |
| `.page-section` | Card section for grouped content |
| `.page-search-row` | Search + filter bar |
| `.page-filters` | Filter controls row |
| `.page-actions` | Action buttons, flex-end |
| `.filter-tabs` | Tab-style filter bar with bottom border |
| `.filter-tab` | Individual tab, active state has blue bottom border |

---

## 14. Theme System (Dark/Light)

- Toggled via `data-theme` attribute on `<html>` element (`light` / `dark`)
- Default: light (no attribute or `data-theme="light"`)
- All colors defined in CSS custom properties under both `:root` and `[data-theme='dark']`
- Transitions applied to `background-color` and `color` for smooth theme switching
- Theme preference optionally persisted in `localStorage` via Zustand store

---

## 15. Design Principles

1. **Clean & Minimal** — Generous whitespace, subtle shadows, muted borders
2. **Typography-driven** — Serif display font for headings creates academic/traditional feel, sans-serif body for readability
3. **Blue + Teal accent** — Professional, trustworthy, modern
4. **Dark sidebar with light content** — High contrast navigation, focus on content area
5. **Consistent spacing** — 4px base grid, multiples for rhythm
6. **Accessibility** — Sufficient color contrast, aria attributes, focus management
7. **Responsive** — Mobile sidebar overlay, stacked layouts on small screens
8. **Component modularity** — Small, focused UI components with variant props
9. **Semantic colors** — Green/red/yellow/blue for clear status communication
