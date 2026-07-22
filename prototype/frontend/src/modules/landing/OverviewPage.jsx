import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const SECTIONS = [
  { id: 'introduction', num: 1, title: 'Introduction' },
  { id: 'architecture', num: 2, title: 'System Architecture' },
  { id: 'srs', num: 3, title: 'SRS Summary' },
  { id: 'dataflow', num: 4, title: 'Data Flow Diagrams' },
  { id: 'usecase', num: 5, title: 'Use Case Diagram' },
  { id: 'erd', num: 6, title: 'Entity-Relationship Diagram' },
  { id: 'class', num: 7, title: 'Class Diagram' },
  { id: 'sequence', num: 8, title: 'Sequence Diagrams' },
  { id: 'api', num: 9, title: 'API Reference' },
  { id: 'project', num: 10, title: 'Project Management' },
  { id: 'testing', num: 11, title: 'Testing Strategy' },
  { id: 'techstack', num: 12, title: 'Technology Stack' },
  { id: 'deployment', num: 13, title: 'Deployment Guide' },
  { id: 'security', num: 14, title: 'Security' },
  { id: 'limitations', num: 15, title: 'Limitations & Future Work' },
]

export default function OverviewPage() {
  const [activeSection, setActiveSection] = useState('introduction')
  const observerRef = useRef(null)

  useEffect(() => {
    const headings = SECTIONS.map(s => document.getElementById(s.id)).filter(Boolean)
    observerRef.current = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id)
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    )
    headings.forEach(h => observerRef.current.observe(h))
    return () => observerRef.current?.disconnect()
  }, [])

  return (
    <div className="overview-page">
      {/* ─── Top Nav ─── */}
      <nav className="overview-nav">
        <Link to="/" className="overview-nav-brand">
          <div className="overview-nav-logo">R</div>
          <span className="overview-nav-text">
            Relief<span className="overview-nav-accent">Mesh</span>
          </span>
        </Link>
        <div className="overview-nav-links">
          <Link to="/" className="overview-nav-link">Home</Link>
          <Link to="/login" className="btn btn-primary btn-sm">Sign In</Link>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <header className="overview-hero">
        <div className="overview-hero-inner">
          <span className="overview-hero-badge">CSE 3208 — System Analysis & Design Lab</span>
          <h1 className="overview-hero-title">System Overview</h1>
          <p className="overview-hero-sub">
            Comprehensive technical documentation for the ReliefMesh Disaster Relief Coordination System
          </p>
        </div>
      </header>

      <div className="overview-layout">
        {/* ─── Sidebar TOC ─── */}
        <aside className="overview-toc">
          <nav className="overview-toc-inner">
            <p className="overview-toc-heading">On this page</p>
            {SECTIONS.map(s => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`overview-toc-item ${activeSection === s.id ? 'overview-toc-item--active' : ''}`}
                onClick={e => {
                  e.preventDefault()
                  document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
              >
                <span className="overview-toc-num">{s.num}</span>
                {s.title}
              </a>
            ))}
          </nav>
        </aside>

        {/* ─── Main Content ─── */}
        <main className="overview-content">

          {/* 1. Introduction */}
          <section id="introduction" className="overview-section">
            <h2 className="overview-heading"><span className="overview-heading-num">1</span>Introduction</h2>
            <p className="overview-text">
              ReliefMesh is a full-stack web application designed to coordinate disaster relief operations in real time.
              It enables relief coordinators, administrators, and citizens to manage relief distributions, assess needs,
              track inventory, and generate reports — all with offline-first synchronization capability.
            </p>
            <div className="overview-diagram">
{`┌──────────────────────────────────────────────────┐
│              RELIEFMESH SYSTEM                   │
│   Disaster Relief Coordination Platform          │
├──────────────────────────────────────────────────┤
│  Frontend  (React 18 + Vite + Leaflet)           │
│      ↕  HTTP / REST                              │
│  Backend   (Node.js + Express + Mongoose)        │
│      ↕                                           │
│  MongoDB (Online)  +  PouchDB (Offline Sync)     │
└──────────────────────────────────────────────────┘`}
            </div>
          </section>

          {/* 2. Architecture */}
          <section id="architecture" className="overview-section">
            <h2 className="overview-heading"><span className="overview-heading-num">2</span>System Architecture</h2>

            <h3 className="overview-subheading">Three-tier Architecture</h3>
            <ul className="overview-list">
              <li><strong>Presentation Tier:</strong> React 18 SPA with Vite bundler, Leaflet.js for maps, custom CSS design tokens for UI components.</li>
              <li><strong>Logic Tier:</strong> Express.js REST API with JWT authentication, role-based authorization (UP Official / Upazila Officer / NGO Worker / Citizen), and modular route/controller/service pattern.</li>
              <li><strong>Data Tier:</strong> MongoDB via Mongoose ODM with mongodb-memory-server for testing. PouchDB integration enables offline-first data sync.</li>
            </ul>

            <h3 className="overview-subheading">Component Diagram</h3>
            <div className="overview-diagram">
{`┌──────────────┐    ┌──────────────────┐    ┌──────────────┐
│   React SPA  │───▶│   Express API    │───▶│   MongoDB    │
│   (Vite)     │◀───│   (JWT Auth)     │◀───│  (Mongoose)  │
├──────────────┤    ├──────────────────┤    ├──────────────┤
│ Landing Page │    │ Public Routes    │    │ Geographic   │
│ Dashboard    │    │ Auth Routes      │    │   Areas      │
│ Need Assess. │    │ Need Routes      │    │ Households   │
│ Distributions│    │ District Routes  │    │ Distributions│
│ Reports      │    │ Pledge Routes    │    │ Need Assess. │
│ Map/Heatmap  │    │ Report Routes    │    │ Pledges      │
│ Admin Panel  │    │ Admin Routes     │    │ Items / Users│
└──────────────┘    └──────────────────┘    └──────────────┘`}
            </div>
          </section>

          {/* 3. SRS */}
          <section id="srs" className="overview-section">
            <h2 className="overview-heading"><span className="overview-heading-num">3</span>Software Requirements Specification</h2>

            <h3 className="overview-subheading">Functional Requirements</h3>
            <div className="overview-table-wrap">
              <table className="overview-table">
                <thead>
                  <tr>
                    <th style={{ width: 80 }}>ID</th>
                    <th>Requirement</th>
                    <th style={{ width: 130 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['FR-01', 'User registration & role-based authentication', true],
                    ['FR-02', 'Household registration with NID verification', true],
                    ['FR-03', 'Need assessment calculation based on household data', true],
                    ['FR-04', 'Relief distribution logging with item categories', true],
                    ['FR-05', 'Inventory & stock management', true],
                    ['FR-06', 'Relief pledging by donors/coordinators', true],
                    ['FR-07', 'Geographic area hierarchy (Division → District → Upazila → Union → Ward)', true],
                    ['FR-08', 'Heatmap visualization of relief needs', true],
                    ['FR-09', 'Offline sync with PouchDB/localforage', true],
                    ['FR-10', 'Public landing page with overview and stats', true],
                  ].map(([id, req, done]) => (
                    <tr key={id}>
                      <td className="overview-table-mono">{id}</td>
                      <td>{req}</td>
                      <td><span className="overview-badge overview-badge--success">✓ Implemented</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="overview-subheading">Non-functional Requirements</h3>
            <ul className="overview-list">
              <li><strong>Performance:</strong> API responses &lt; 500ms for 95% of requests.</li>
              <li><strong>Offline capability:</strong> localforage-based local storage with periodic sync queue.</li>
              <li><strong>Security:</strong> JWT tokens with bcrypt password hashing, role-based access control.</li>
              <li><strong>Reliability:</strong> mongodb-memory-server for isolated integration tests.</li>
              <li><strong>Scalability:</strong> Modular controller/service/repository architecture.</li>
              <li><strong>Usability:</strong> Responsive UI with map-based visualization.</li>
            </ul>
          </section>

          {/* 4. Data Flow */}
          <section id="dataflow" className="overview-section">
            <h2 className="overview-heading"><span className="overview-heading-num">4</span>Data Flow Diagrams</h2>

            <h3 className="overview-subheading">Level 0 — Context Diagram</h3>
            <div className="overview-diagram">
{`┌───────────────────────────────────────────────────┐
│              RELIEFMESH SYSTEM                    │
│                                                  │
│   ┌──────────┐  ┌───────────┐  ┌──────────┐     │
│   │  Citizen  │  │Coordinator│  │  Admin   │     │
│   └────┬──────┘  └─────┬─────┘  └────┬─────┘     │
│        │               │             │            │
│        └───────┬───────┴───────┬─────┘            │
│                │               │                  │
│   ┌────────────▼───────────────▼────────────┐     │
│   │       Relief Distribution Flow          │     │
│   │  Register → Assess → Pledge →           │     │
│   │   Distribute → Report → Sync            │     │
│   └─────────────────────────────────────────┘     │
└───────────────────────────────────────────────────┘`}
            </div>

            <h3 className="overview-subheading">Level 1 — Relief Distribution Process</h3>
            <div className="overview-diagram">
{`┌──────────┐    ┌───────────┐    ┌──────────┐
│  Citizen  │    │Coordinator│    │  System  │
└────┬──────┘    └─────┬─────┘    └────┬─────┘
     │                 │               │
     │ 1. Register     │               │
     │────────────────▶│               │
     │  (Household)    │               │
     │                 │ 2. Assess     │
     │                 │──────────────▶│ Needs
     │                 │  (Calculate)  │──────┐
     │                 │               │◀─────┘
     │                 │ 3. View       │
     │                 │──────────────▶│ Needs
     │                 │               │
     │                 │ 4. Pledge     │
     │                 │──────────────▶│ Items
     │                 │               │
     │                 │ 5. Distribute │
     │◀────────────────│──────────────▶│ Log
     │    Receive      │               │
     │                 │ 6. Reports    │
     │                 │◀──────────────│──────┘
     │                 │  Visualize    │
     └─────────────────┴───────────────┘`}
            </div>
          </section>

          {/* 5. Use Case */}
          <section id="usecase" className="overview-section">
            <h2 className="overview-heading"><span className="overview-heading-num">5</span>Use Case Diagram</h2>
            <div className="overview-diagram">
{`┌──────────────────────────────────────────────────────────┐
│                    RELIEFMESH SYSTEM                      │
│                                                          │
│   ┌──────────┐    ┌────────────┐    ┌──────────┐        │
│   │  Citizen  │    │Coordinator │    │  Admin   │        │
│   └─────┬────┘    └──────┬─────┘    └────┬─────┘        │
│         │                │               │               │
│   ┌─────┴────────────────┴───────────────┴─────────┐    │
│   │                                                 │    │
│   │  ┌───────────┐  ┌───────────┐  ┌────────────┐  │    │
│   │  │ Register  │  │ View      │  │ Manage     │  │    │
│   │  │ Household │  │ Relief    │  │ Users      │  │    │
│   │  └───────────┘  │ Status    │  └────────────┘  │    │
│   │                 └───────────┘                   │    │
│   │  ┌───────────┐  ┌───────────┐  ┌────────────┐  │    │
│   │  │ Submit    │  │ Assess    │  │ Manage     │  │    │
│   │  │ Feedback  │  │ Needs     │  │ Inventory  │  │    │
│   │  └───────────┘  └───────────┘  └────────────┘  │    │
│   │                                                 │    │
│   │  ┌───────────┐  ┌───────────┐  ┌────────────┐  │    │
│   │  │ Request   │  │ Log       │  │ View       │  │    │
│   │  │ Relief    │  │ Distrib.  │  │ Reports    │  │    │
│   │  └───────────┘  └───────────┘  └────────────┘  │    │
│   └─────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘`}
            </div>
          </section>

          {/* 6. ERD */}
          <section id="erd" className="overview-section">
            <h2 className="overview-heading"><span className="overview-heading-num">6</span>Entity-Relationship Diagram</h2>
            <div className="overview-diagram">
{`┌─────────────────┐       ┌───────────────────┐
│      User       │       │  GeographicArea   │
├─────────────────┤       ├───────────────────┤
│ PK: _id         │       │ PK: _id           │
│ name, email     │       │ name, level       │
│ role, password  │◀──────│ coordinates {lat,  │
│ jurisdictionId──┼──────▶│   lng}            │
│ nid, phone      │       │ parentId (ref)    │
└────────┬────────┘       └───────────────────┘
         │                        │
         │ 1                   1:N│
         │  ┌──────────────────┐  │
         │  │    Household     │  │
         ├─▶│ userId           │  │
         │  │ jurisdictionId───┼──┘
         │  │ headName, nid    │
         │  └────────┬─────────┘
         │           │ 1
         │           │ N
         │  ┌────────▼─────────┐
         │  │ DistributionLog  │
         │  ├──────────────────┤
         │  │ householdId (FK) │
         │  │ itemCategoryId   │
         │  │ quantity, date   │
         │  │ distributedBy    │
         │  └──────────────────┘

┌──────────────────┐  ┌──────────────────────┐
│ ItemCategory     │  │ NeedAssessment       │
├──────────────────┤  ├──────────────────────┤
│ PK: _id          │  │ PK: _id              │
│ name, unit       │  │ areaId, itemCatId    │
│ isActive         │  │ totalNeed, fulfilled │
└──────────────────┘  └──────────────────────┘

┌──────────────────┐  ┌──────────────────────┐
│ ReliefPledge     │  │ ReliefRequest        │
├──────────────────┤  ├──────────────────────┤
│ PK: _id          │  │ PK: _id              │
│ pledgedBy (FK)   │  │ userId, status       │
│ itemCategoryId   │  │ description, notes   │
│ quantity, status │  │ priority             │
└──────────────────┘  └──────────────────────┘`}
            </div>

            <h3 className="overview-subheading">Key Relationships</h3>
            <ul className="overview-list">
              <li><strong>User → GeographicArea:</strong> Many-to-One. Each user belongs to one administrative area (via jurisdictionId).</li>
              <li><strong>Household → GeographicArea:</strong> Many-to-One. Each household is located within an area.</li>
              <li><strong>Household → User:</strong> Many-to-One. Each household is registered by a user.</li>
              <li><strong>DistributionLog → Household:</strong> Many-to-One. Distributions are made to households.</li>
              <li><strong>DistributionLog → ItemCategory:</strong> Many-to-One. Each distribution involves one item type.</li>
              <li><strong>NeedAssessment → GeographicArea & ItemCategory:</strong> Tracks calculated needs per area per item.</li>
            </ul>
          </section>

          {/* 7. Class Diagram */}
          <section id="class" className="overview-section">
            <h2 className="overview-heading"><span className="overview-heading-num">7</span>Class Diagram (Mongoose Models)</h2>
            <div className="overview-diagram overview-diagram--wide">
{`┌──────────────────────────────────────────────────────────────┐
│ User {                                                       │
│   +_id: ObjectId,  +name: String,  +email: String           │
│   +passwordHash: String,  +role: enum('UPAZILA_OFFICER',     │
│     'UP_OFFICIAL', 'NGO_WORKER', 'CITIZEN')                 │
│   +jurisdictionId: ref→GeographicArea,  +phone, +address     │
│   +organization: String,  +isActive: Boolean                 │
│ }                                                            │
├──────────────────────────────────────────────────────────────┤
│ GeographicArea {                                             │
│   +_id: ObjectId,  +name: String,  +level: enum('DISTRICT',  │
│     'UPAZILA', 'UNION', 'WARD')                             │
│   +coordinates: { lat: Number, lng: Number }                 │
│   +parentId: ref→GeographicArea                              │
│   +index( name + level → unique )                            │
│ }                                                            │
├──────────────────────────────────────────────────────────────┤
│ Household {                                                  │
│   +_id: ObjectId,  +headName,  +nid (unique),  +familySize  │
│   +phone,  +address,  +vulnerableMembers: [...]             │
│   +jurisdictionId: ref→GeographicArea                        │
│   +createdBy: ref→User                                       │
│ }                                                            │
├──────────────────────────────────────────────────────────────┤
│ DistributionLog {                                            │
│   +_id: ObjectId,  +householdId: ref→Household               │
│   +itemCategoryId: ref→ItemCategory,  +quantity: Number      │
│   +distributedAt: Date,  +distributedBy: ref→User            │
│ }                                                            │
├──────────────────────────────────────────────────────────────┤
│ ItemCategory { +_id, +name, +unit, +isActive }              │
│ NeedAssessment { +_id, +areaId, +itemCatId, +totalNeed }    │
│ ReliefPledge { +_id, +pledgedBy, +itemCatId, +quantity }     │
│ ReliefRequest { +_id, +userId, +status, +priority }         │
└──────────────────────────────────────────────────────────────┘`}
            </div>
          </section>

          {/* 8. Sequence Diagrams */}
          <section id="sequence" className="overview-section">
            <h2 className="overview-heading"><span className="overview-heading-num">8</span>Sequence Diagrams</h2>

            <h3 className="overview-subheading">8.1 User Registration & Login</h3>
            <div className="overview-diagram">
{`User               Frontend             API              MongoDB
 │                    │                  │                  │
 │  Fill Form         │                  │                  │
 │───────────────────▶│                  │                  │
 │                    │ POST /register   │                  │
 │                    │─────────────────▶│                  │
 │                    │                  │ Create User      │
 │                    │                  │─────────────────▶│
 │                    │                  │◀─────────────────│
 │                    │◀─────────────────│                  │
 │◀───────────────────│                  │                  │
 │                    │                  │                  │
 │  Login Form        │                  │                  │
 │───────────────────▶│                  │                  │
 │                    │ POST /login      │                  │
 │                    │─────────────────▶│                  │
 │                    │                  │ Verify Creds     │
 │                    │                  │─────────────────▶│
 │                    │                  │◀─────────────────│
 │                    │◀──── JWT Token ──│                  │
 │◀───────────────────│                  │                  │
 │  Store Token       │                  │                  │
 │  in localStorage   │                  │                  │`}
            </div>

            <h3 className="overview-subheading">8.2 Relief Distribution Flow</h3>
            <div className="overview-diagram">
{`Coordinator          Frontend             API              MongoDB
 │                    │                  │                  │
 │  Select Household  │                  │                  │
 │───────────────────▶│                  │                  │
 │                    │ GET /households  │                  │
 │                    │─────────────────▶│                  │
 │                    │                  │ Query Households │
 │                    │                  │─────────────────▶│
 │                    │                  │◀─────────────────│
 │                    │◀─────────────────│                  │
 │◀───────────────────│                  │                  │
 │                    │                  │                  │
 │  Choose Items &    │                  │                  │
 │  Confirm Dist.     │                  │                  │
 │───────────────────▶│                  │                  │
 │                    │POST /distribute  │                  │
 │                    │─────────────────▶│                  │
 │                    │                  │ Create DistLog   │
 │                    │                  │─────────────────▶│
 │                    │                  │ Update Stock     │
 │                    │                  │─────────────────▶│
 │                    │                  │◀─────────────────│
 │                    │◀─────────────────│                  │
 │◀───────────────────│                  │                  │
 │  Confirmation      │                  │                  │`}
            </div>
          </section>

          {/* 9. API Reference */}
          <section id="api" className="overview-section">
            <h2 className="overview-heading"><span className="overview-heading-num">9</span>API Endpoint Reference</h2>

            <h3 className="overview-subheading">Public Endpoints</h3>
            <div className="overview-table-wrap">
              <table className="overview-table">
                <thead>
                  <tr>
                    <th style={{ width: 80 }}>Method</th>
                    <th>Path</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['GET', '/v1/public/dashboard', 'Aggregated stats (households, distributions, areas, items)'],
                    ['GET', '/v1/public/map', 'Geographic distribution data with area coordinates'],
                    ['GET', '/v1/public/activities', 'Recent distributions and relief requests'],
                    ['GET', '/v1/public/item-categories', 'Active item categories'],
                    ['GET', '/v1/needs/heatmap', 'Need intensity points for heatmap visualization'],
                  ].map(([method, path, desc]) => (
                    <tr key={path}>
                      <td><span className="overview-method">{method}</span></td>
                      <td className="overview-table-mono">{path}</td>
                      <td>{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="overview-subheading">Authenticated Endpoints</h3>
            <div className="overview-table-wrap">
              <table className="overview-table">
                <thead>
                  <tr>
                    <th style={{ width: 80 }}>Method</th>
                    <th>Path</th>
                    <th style={{ width: 140 }}>Roles</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['GET', '/v1/households', 'NGO / UP Official / Upazila'],
                    ['POST', '/v1/households', 'NGO / UP Official / Upazila'],
                    ['GET', '/v1/distributions', 'NGO / UP Official / Upazila'],
                    ['POST', '/v1/distributions/log', 'NGO / UP Official / Upazila'],
                    ['GET', '/v1/needs', 'NGO / UP Official / Upazila'],
                    ['POST', '/v1/needs/calculate', 'Upazila Officer'],
                    ['GET', '/v1/pledges', 'NGO / UP Official / Upazila'],
                    ['POST', '/v1/pledges', 'NGO / UP Official / Upazila'],
                    ['GET', '/v1/areas', 'All Authenticated'],
                    ['POST', '/v1/auth/login', 'Public'],
                    ['POST', '/v1/auth/register/citizen', 'Public'],
                  ].map(([method, path, roles]) => (
                    <tr key={path + roles}>
                      <td><span className="overview-method">{method}</span></td>
                      <td className="overview-table-mono">{path}</td>
                      <td>{roles}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 10. Project Management */}
          <section id="project" className="overview-section">
            <h2 className="overview-heading"><span className="overview-heading-num">10</span>Project Management & Sprint Plan</h2>

            {[
              { title: 'Phase 1 — Foundation (Sprint 1)', items: [
                'Project scaffolding (MERN stack setup with Vite)',
                'User authentication (JWT, bcrypt, role-based access)',
                'GeographicArea model with hierarchical data structure',
                'Database connection and seeding scripts',
              ]},
              { title: 'Phase 2 — Core Features (Sprint 2)', items: [
                'Household CRUD with NID validation',
                'Need assessment calculation engine',
                'Relief distribution logging',
                'Inventory and item categories management',
              ]},
              { title: 'Phase 3 — Advanced Features (Sprint 3)', items: [
                'Relief pledging system',
                'Relief request submission and tracking',
                'Heatmap visualization with Leaflet',
                'Offline sync with localforage',
              ]},
              { title: 'Phase 4 — Testing & Polish (Sprint 4)', items: [
                'Integration testing (36+ passing tests)',
                'Jurisdiction → GeographicArea migration',
                'Public landing page with overview',
                'Demo credentials for testing access',
              ]},
            ].map(phase => (
              <div key={phase.title} className="overview-phase">
                <h3 className="overview-subheading">{phase.title}</h3>
                <ul className="overview-list">
                  {phase.items.map(item => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ))}
          </section>

          {/* 11. Testing */}
          <section id="testing" className="overview-section">
            <h2 className="overview-heading"><span className="overview-heading-num">11</span>Testing Strategy</h2>

            <div className="overview-table-wrap">
              <table className="overview-table">
                <thead>
                  <tr>
                    <th>Suite</th>
                    <th>File</th>
                    <th style={{ width: 100 }}>Tests</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['GeographicArea', 'areas.test.js', '12 tests'],
                    ['Need Assessment', 'needs.test.js', '8 tests'],
                    ['Pledges', 'pledges.test.js', '11 tests'],
                    ['TC-07: Household Creation', 'tc-07.test.js', '—'],
                    ['TC-17: Duplicate NID Rejection', 'tc-17.test.js', '—'],
                    ['TC-19: Login Flow', 'tc-19.test.js', '—'],
                    ['TC-20: Auth Validation', 'tc-20.test.js', '—'],
                    ['NGO Distribution', 'ngo-distribution.test.js', '—'],
                    ['All Integration', '36 total', 'Passing'],
                  ].map(([suite, file, tests]) => (
                    <tr key={suite}>
                      <td style={{ fontWeight: 500 }}>{suite}</td>
                      <td className="overview-table-mono">{file}</td>
                      <td>
                        <span className={`overview-badge ${tests === 'Passing' ? 'overview-badge--success' : 'overview-badge--neutral'}`}>
                          {tests}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="overview-subheading">Testing Tools</h3>
            <ul className="overview-list">
              <li><strong>Jest:</strong> Test runner with --forceExit, --runInBand for MongoDB isolation.</li>
              <li><strong>Supertest:</strong> HTTP integration testing for Express endpoints.</li>
              <li><strong>mongodb-memory-server:</strong> In-memory MongoDB instances for each test file.</li>
              <li><strong>bcrypt:</strong> Password hashing verification in auth tests.</li>
            </ul>
          </section>

          {/* 12. Tech Stack */}
          <section id="techstack" className="overview-section">
            <h2 className="overview-heading"><span className="overview-heading-num">12</span>Technology Stack</h2>
            <div className="overview-tech-grid">
              <div className="overview-tech-card">
                <div className="overview-tech-card-header overview-tech-card-header--frontend">Frontend</div>
                <ul className="overview-list">
                  <li>React 18 with Vite</li>
                  <li>React Router v6 (SPA routing)</li>
                  <li>Leaflet.js + leaflet.heat</li>
                  <li>Tailwind CSS + CSS Custom Properties</li>
                  <li>localforage (IndexedDB)</li>
                  <li>PWA with service worker</li>
                </ul>
              </div>
              <div className="overview-tech-card">
                <div className="overview-tech-card-header overview-tech-card-header--backend">Backend</div>
                <ul className="overview-list">
                  <li>Node.js + Express.js</li>
                  <li>MongoDB + Mongoose ODM</li>
                  <li>JWT (jsonwebtoken) auth</li>
                  <li>bcrypt (10 salt rounds)</li>
                  <li>express-validator</li>
                  <li>Jest + Supertest</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 13. Deployment */}
          <section id="deployment" className="overview-section">
            <h2 className="overview-heading"><span className="overview-heading-num">13</span>Deployment Guide</h2>

            <h3 className="overview-subheading">Prerequisites</h3>
            <ul className="overview-list">
              <li>Node.js v18+ and npm/yarn</li>
              <li>MongoDB v6+ (local or Atlas)</li>
              <li>Git for version control</li>
            </ul>

            <h3 className="overview-subheading">Setup Steps</h3>
            <div className="overview-diagram">
{`# 1. Clone repository
git clone https://github.com/Mohammadkamrulhassan/ReliefMesh-01.git
cd ReliefMesh

# 2. Backend setup
cd prototype/backend
npm install
cp .env.example .env   # configure MONGODB_URI, JWT_SECRET
npm run seed           # seed initial data
npm start              # runs on port 3000

# 3. Frontend setup
cd ../frontend
npm install
# .env is auto-generated by start-dev.sh
npm run dev            # runs on port 5173

# 4. Or use the one-command startup
cd ../..
./start-dev.sh         # starts MongoDB + backend + frontend`}
            </div>

            <h3 className="overview-subheading">Environment Variables</h3>
            <div className="overview-table-wrap">
              <table className="overview-table">
                <thead>
                  <tr>
                    <th>Variable</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['PORT', 'Backend server port (default: 3000)'],
                    ['MONGODB_URI', 'MongoDB connection string'],
                    ['JWT_SECRET', 'Secret key for JWT signing'],
                    ['JWT_EXPIRES_IN', 'Token expiration time (e.g., 7d)'],
                    ['VITE_API_BASE_URL', 'API base URL for frontend'],
                  ].map(([varName, desc]) => (
                    <tr key={varName}>
                      <td className="overview-table-mono">{varName}</td>
                      <td>{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 14. Security */}
          <section id="security" className="overview-section">
            <h2 className="overview-heading"><span className="overview-heading-num">14</span>Security Considerations</h2>
            <ul className="overview-list">
              <li><strong>Authentication:</strong> JWT tokens with 7-day expiration. Passwords hashed with bcrypt (salt rounds: 10).</li>
              <li><strong>Authorization:</strong> Role-based middleware (UPAZILA_OFFICER, UP_OFFICIAL, NGO_WORKER, CITIZEN) on all protected routes.</li>
              <li><strong>Input Validation:</strong> express-validator on key routes, Mongoose schema validation with required fields, enums, and unique constraints.</li>
              <li><strong>Rate Limiting:</strong> express-rate-limit (200 requests per 15-minute window) to prevent abuse.</li>
              <li><strong>Security Headers:</strong> helmet middleware (CSP, X-Frame-Options, HSTS, etc.).</li>
              <li><strong>Offline Security:</strong> localforage data is scoped per user; sync requires authentication.</li>
              <li><strong>CORS:</strong> Configured via helmet and express middleware.</li>
            </ul>
          </section>

          {/* 15. Limitations */}
          <section id="limitations" className="overview-section">
            <h2 className="overview-heading"><span className="overview-heading-num">15</span>Known Limitations & Future Work</h2>

            <h3 className="overview-subheading">Limitations</h3>
            <ul className="overview-list">
              <li>Heatmap uses seeded/synthetic coordinates for demo areas (not real-world geo-coordinates of Bangladesh).</li>
              <li>Offline sync uses last-write-wins conflict resolution.</li>
              <li>No real-time WebSocket updates; data refreshes on page load.</li>
              <li>Mobile responsiveness is functional but not fully optimized.</li>
            </ul>

            <h3 className="overview-subheading">Future Enhancements</h3>
            <ul className="overview-list">
              <li>SMS/email notifications for relief distribution alerts.</li>
              <li>Advanced analytics dashboard with historical trends.</li>
              <li>Multi-language support (Bengali, English).</li>
              <li>Integration with disaster early warning systems (e.g., API from BMD).</li>
              <li>CI/CD pipeline with automated test + deployment.</li>
              <li>Containerization with Docker for consistent deployment.</li>
            </ul>
          </section>

        </main>
      </div>

      {/* ─── Footer ─── */}
      <footer className="overview-footer">
        <p>ReliefMesh — CSE 3208 System Analysis and Design Lab, RMSTU.</p>
        <p style={{ marginTop: 4 }}>
          <Link to="/" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Back to Home</Link>
          {' · '}
          <Link to="/login" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Sign In</Link>
        </p>
      </footer>
    </div>
  )
}
