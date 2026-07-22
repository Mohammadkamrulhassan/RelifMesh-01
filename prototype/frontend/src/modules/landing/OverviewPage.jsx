import { Link } from 'react-router-dom'

const sectionStyle = {
  background: 'var(--color-surface)',
  borderRadius: 12,
  border: '1px solid var(--color-border)',
  padding: '28px 32px',
  marginBottom: 24,
  boxShadow: 'var(--shadow-sm)',
}

const headingStyle = {
  fontSize: 22,
  fontWeight: 700,
  marginBottom: 16,
  color: 'var(--color-text-primary)',
  borderBottom: '3px solid var(--color-primary)',
  paddingBottom: 8,
  display: 'inline-block',
}

const subheadingStyle = {
  fontSize: 17,
  fontWeight: 600,
  marginTop: 20,
  marginBottom: 8,
  color: 'var(--color-text-primary)',
}

const figureBox = {
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  padding: 24,
  margin: '16px 0',
  fontFamily: 'monospace',
  fontSize: 13,
  lineHeight: 1.6,
  overflowX: 'auto',
}

export default function OverviewPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* ─── Top Nav ─── */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 48px', borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <div style={{
            width: 36, height: 36, background: 'var(--color-primary)',
            borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: '#fff',
          }}>R</div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: 'var(--color-text-primary)' }}>
            Relief<span style={{ color: 'var(--color-accent)' }}>Mesh</span>
          </span>
        </Link>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Link to="/" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: 14 }}>Home</Link>
          <Link to="/login" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>Sign In</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px 80px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
          System Overview
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 32 }}>
          Comprehensive documentation for the ReliefMesh Disaster Relief Coordination System
        </p>

        {/* ─── 1. Introduction ─── */}
        <section style={sectionStyle}>
          <h2 style={headingStyle}>1. Introduction</h2>
          <p style={{ lineHeight: 1.7 }}>
            ReliefMesh is a full-stack web application designed to coordinate disaster relief operations in real time.
            It enables relief coordinators, administrators, and citizens to manage relief distributions, assess needs,
            track inventory, and generate reports — all with offline-first synchronization capability.
          </p>
          <div style={figureBox}>
{`+--------------------------------------------------+
|             RELIEFMESH SYSTEM                      |
|  Disaster Relief Coordination Platform           |
+--------------------------------------------------+
|  Frontend (React 18 + Vite + Leaflet)            |
|    ↓ HTTP / REST ↑                                |
|  Backend (Node.js + Express + Mongoose)           |
|    ↓                                              |
|  MongoDB (Online) + PouchDB (Offline Sync)       |
+--------------------------------------------------+`}
          </div>
        </section>

        {/* ─── 2. Architecture ─── */}
        <section style={sectionStyle}>
          <h2 style={headingStyle}>2. System Architecture</h2>

          <h3 style={subheadingStyle}>Three-tier Architecture</h3>
          <ul style={{ lineHeight: 1.8, paddingLeft: 20 }}>
            <li><strong>Presentation Tier:</strong> React 18 SPA with Vite bundler, Leaflet.js for maps, shadcn/ui and custom CSS for UI components.</li>
            <li><strong>Logic Tier:</strong> Express.js REST API with JWT authentication, role-based authorization (admin/coordinator/citizen), and modular route/controller/service pattern.</li>
            <li><strong>Data Tier:</strong> MongoDB via Mongoose ODM with Mongodb-memory-server for testing. PouchDB integration enables offline-first data sync.</li>
          </ul>

          <h3 style={subheadingStyle}>Component Diagram</h3>
          <div style={figureBox}>
{`
┌──────────────┐    ┌──────────────────┐    ┌──────────────┐
│   React SPA  │───>│   Express API    │───>│   MongoDB    │
│   (Vite)     │<───│   (JWT Auth)     │<───│  (Mongoose)  │
├──────────────┤    ├──────────────────┤    ├──────────────┤
│ Landing Page │    │ Public Routes    │    │ geographicareas │
│ Dashboard    │    │ Auth Routes      │    │ households     │
│ Need Assess. │    │ Need Routes      │    │ distributions  │
│ Distribut.   │    │ District Routes  │    │ needassessments│
│ Reports      │    │ Pledge Routes    │    │ reliefpledges  │
│ Map/Heatmap  │    │ Report Routes    │    │ itemcategories │
│ Admin Panel  │    │ Admin Routes     │    │ users          │
└──────────────┘    └──────────────────┘    └──────────────┘`}
          </div>
        </section>

        {/* ─── 3. SRS Summary ─── */}
        <section style={sectionStyle}>
          <h2 style={headingStyle}>3. Software Requirements Specification</h2>

          <h3 style={subheadingStyle}>Functional Requirements</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--color-bg)', borderBottom: '2px solid var(--color-border)' }}>
                <th style={{ textAlign: 'left', padding: '8px 12px' }}>ID</th>
                <th style={{ textAlign: 'left', padding: '8px 12px' }}>Requirement</th>
                <th style={{ textAlign: 'left', padding: '8px 12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['FR-01', 'User registration & role-based authentication', '✓ Implemented'],
                ['FR-02', 'Household registration with NID verification', '✓ Implemented'],
                ['FR-03', 'Need assessment calculation based on household data', '✓ Implemented'],
                ['FR-04', 'Relief distribution logging with item categories', '✓ Implemented'],
                ['FR-05', 'Inventory & stock management', '✓ Implemented'],
                ['FR-06', 'Relief pledging by donors/coordinators', '✓ Implemented'],
                ['FR-07', 'Geographic area hierarchy (Division→District→Upazila→Union→Ward)', '✓ Implemented'],
                ['FR-08', 'Heatmap visualization of relief needs', '✓ Implemented'],
                ['FR-09', 'Offline sync with PouchDB', '✓ Implemented'],
                ['FR-10', 'Public landing page with overview and stats', '✓ Implemented'],
              ].map(([id, req, status]) => (
                <tr key={id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '8px 12px', fontWeight: 600, fontFamily: 'monospace' }}>{id}</td>
                  <td style={{ padding: '8px 12px' }}>{req}</td>
                  <td style={{ padding: '8px 12px', color: 'var(--color-success)' }}>{status}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 style={subheadingStyle}>Non-functional Requirements</h3>
          <ul style={{ lineHeight: 1.8, paddingLeft: 20 }}>
            <li><strong>Performance:</strong> API responses &lt; 500ms for 95% of requests.</li>
            <li><strong>Offline capability:</strong> PouchDB-based local storage with periodic sync.</li>
            <li><strong>Security:</strong> JWT tokens with bcrypt password hashing, role-based access control.</li>
            <li><strong>Reliability:</strong> Mongodb-memory-server for isolated integration tests.</li>
            <li><strong>Scalability:</strong> Modular controller/service/repository architecture.</li>
            <li><strong>Usability:</strong> Responsive UI with map-based visualization.</li>
          </ul>
        </section>

        {/* ─── 4. Data Flow ─── */}
        <section style={sectionStyle}>
          <h2 style={headingStyle}>4. Data Flow Diagrams</h2>

          <h3 style={subheadingStyle}>Level 0 (Context Diagram)</h3>
          <div style={figureBox}>
{`
┌───────────────────────────────────────────┐
│            RELIEFMESH SYSTEM              │
│                                           │
│  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │  Citizen │  │Coordinator│  │  Admin  │ │
│  └────┬─────┘  └────┬─────┘  └────┬────┘ │
│       │             │             │        │
│       └──────┬──────┴──────┬──────┘        │
│              │             │               │
│    ┌─────────▼─────────────▼──────────┐   │
│    │      Relief Distribution Flow    │   │
│    │   Register → Assess → Pledge →   │   │
│    │    Distribute → Report → Sync    │   │
│    └──────────────────────────────────┘   │
└───────────────────────────────────────────┘`}
          </div>

          <h3 style={subheadingStyle}>Level 1: Relief Distribution Process</h3>
          <div style={figureBox}>
{`
┌──────────┐    ┌──────────┐    ┌──────────┐
│  Citizen │    │  Admin/  │    │  System  │
│          │    │Coordinator│    │          │
└────┬─────┘    └────┬─────┘    └────┬─────┘
     │               │               │
     │ 1. Register   │               │
     │──────────────>│               │
     │ (Household)   │               │
     │               │               │
     │               │ 2. Assess     │
     │               │──────────────>│ Needs
     │               │ (Calculate)   │──────┐
     │               │               │      │
     │               │               │<─────┘
     │               │ 3. View       │      │
     │               │──────────────>│ Needs│
     │               │               │      │
     │               │ 4. Pledge     │      │
     │               │──────────────>│Items │
     │               │               │      │
     │               │ 5. Distribute │      │
     │<──────────────│──────────────>│ Log  │
     │   Receive     │               │      │
     │               │               │      │
     │               │ 6. Reports    │      │
     │               │<──────────────│──────┘
     │               │   Visualize   │
     └───────────────┴───────────────┴──────┘`}
          </div>
        </section>

        {/* ─── 5. Use Case Diagram ─── */}
        <section style={sectionStyle}>
          <h2 style={headingStyle}>5. Use Case Diagram</h2>
          <div style={figureBox}>
{`
┌─────────────────────────────────────────────────────┐
│                 RELIEFMESH SYSTEM                    │
│                                                     │
│  ┌─────────────┐   ┌──────────────┐   ┌──────────┐│
│  │   Citizen   │   │ Coordinator  │   │  Admin   ││
│  └──────┬──────┘   └──────┬───────┘   └────┬─────┘│
│         │                 │                 │       │
│  ┌──────┴──────────────────┴─────────────────┴───┐ │
│  │                                                │ │
│  │  ┌──────────┐  ┌──────────┐  ┌─────────────┐  │ │
│  │  │ Register │  │ View     │  │ Manage      │  │ │
│  │  │ Household│  │ Relief   │  │ Users       │  │ │
│  │  └──────────┘  │ Status   │  └─────────────┘  │ │
│  │                └──────────┘                    │ │
│  │  ┌──────────┐  ┌──────────┐  ┌─────────────┐  │ │
│  │  │ Submit   │  │ Assess   │  │ Manage      │  │ │
│  │  │ Feedback │  │ Needs    │  │ Inventory   │  │ │
│  │  └──────────┘  └──────────┘  └─────────────┘  │ │
│  │                                                │ │
│  │  ┌──────────┐  ┌──────────┐  ┌─────────────┐  │ │
│  │  │ Request  │  │ Log      │  │ View        │  │ │
│  │  │ Relief   │  │ Distrib. │  │ Reports     │  │ │
│  │  └──────────┘  └──────────┘  └─────────────┘  │ │
│  └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘`}
          </div>
        </section>

        {/* ─── 6. ERD ─── */}
        <section style={sectionStyle}>
          <h2 style={headingStyle}>6. Entity-Relationship Diagram</h2>
          <div style={figureBox}>
{`
┌─────────────────┐       ┌───────────────────┐
│   User          │       │  GeographicArea    │
├─────────────────┤       ├───────────────────┤
│ PK: _id         │       │ PK: _id           │
│ name, email     │       │ name, level       │
│ role, password  │◄──────│ coordinates {lat,  │
│ jurisdictionId──┼──────►│   lng}            │
│ nid, phone      │       │ parentId (ref)    │
└────────┬────────┘       └───────────────────┘
         │                        │
         │ 1                   1:N│
         │                        │
         │  ┌──────────────────┐  │
         │  │   Household      │  │
         │  ├──────────────────┤  │
         └──│ userId           │  │
            │ jurisdictionId───┼──┘
            │ headName, nid    │
            └────────┬─────────┘
                     │ 1
                     │
                     │ N
            ┌────────▼─────────┐
            │ DistributionLog  │
            ├──────────────────┤
            │ householdId (FK) │
            │ itemCategoryId   │
            │ quantity, date   │
            │ distributedBy    │
            └──────────────────┘

┌──────────────────┐  ┌──────────────────────┐
│ ItemCategory     │  │ NeedAssessment       │
├──────────────────┤  ├──────────────────────┤
│ PK: _id          │  │ PK: _id              │
│ name, unit       │  │ areaId, itemCatId    │
│ isActive         │  │ totalNeed, fulfilled │
│ per_person_...   │  │ calculatedAt, notes  │
└──────────────────┘  └──────────────────────┘

┌──────────────────┐  ┌──────────────────────┐
│ ReliefPledge     │  │ ReliefRequest        │
├──────────────────┤  ├──────────────────────┤
│ PK: _id          │  │ PK: _id              │
│ pledgedBy (FK)   │  │ userId, status       │
│ itemCategoryId   │  │ description, notes   │
│ quantity, status │  │ priority             │
│ pledgedAt        │  │ createdAt            │
└──────────────────┘  └──────────────────────┘`}
          </div>

          <h3 style={subheadingStyle}>Key Relationships</h3>
          <ul style={{ lineHeight: 1.8, paddingLeft: 20 }}>
            <li><strong>User → GeographicArea:</strong> Many-to-One. Each user belongs to one administrative area (via jurisdictionId).</li>
            <li><strong>Household → GeographicArea:</strong> Many-to-One. Each household is located within an area.</li>
            <li><strong>Household → User:</strong> Many-to-One. Each household is registered by a user.</li>
            <li><strong>DistributionLog → Household:</strong> Many-to-One. Distributions are made to households.</li>
            <li><strong>DistributionLog → ItemCategory:</strong> Many-to-One. Each distribution involves one item type.</li>
            <li><strong>NeedAssessment → GeographicArea & ItemCategory:</strong> Tracks calculated needs per area per item.</li>
          </ul>
        </section>

        {/* ─── 7. Class Diagram ─── */}
        <section style={sectionStyle}>
          <h2 style={headingStyle}>7. Class Diagram (Mongoose Models)</h2>
          <div style={figureBox}>
{`
┌────────────────────────────────────────────────────────────┐
│ User {                                                     │
│   +_id: ObjectId, +name: String, +email: String            │
│   +password: String (hashed), +role: enum('admin',...),   │
│   +jurisdictionId: ref→GeographicArea, +phone, +nid       │
│   +comparePassword(): boolean                              │
│ }                                                          │
├────────────────────────────────────────────────────────────┤
│ GeographicArea {                                           │
│   +_id: ObjectId, +name: String, +level: enum('division'  │
│     ,'district','upazila','union','ward'), +parentId: ref │
│   +coordinates: { lat: Number, lng: Number }              │
│   +population: Number, +boundaries: GeoJSON               │
│   +index( name + level → unique )                         │
│ }                                                          │
├────────────────────────────────────────────────────────────┤
│ Household {                                                │
│   +_id: ObjectId, +headName, +nid (unique), +familySize,  │
│   +phone, +address, +jurisdictionId: ref→GeographicArea,  │
│   +createdBy: ref→User, +vulnerableMembers: [...]         │
│ }                                                          │
├────────────────────────────────────────────────────────────┤
│ DistributionLog {                                          │
│   +_id: ObjectId, +householdId: ref→Household,            │
│   +itemCategoryId: ref→ItemCategory, +quantity: Number    │
│   +distributedAt: Date, +distributedBy: ref→User/Coord    │
│   +syncStatus: enum('SYNCED','PENDING')                   │
│ }                                                          │
├────────────────────────────────────────────────────────────┤
│ ItemCategory { +_id, +name, +unit, +isActive }            │
│ NeedAssessment { +_id, +areaId, +itemCatId, +totalNeed...}│
│ ReliefPledge { +_id, +pledgedBy, +itemCatId, +qty...}     │
│ ReliefRequest { +_id, +userId, +status, +priority...}     │
└────────────────────────────────────────────────────────────┘`}
          </div>
        </section>

        {/* ─── 8. Sequence Diagrams ─── */}
        <section style={sectionStyle}>
          <h2 style={headingStyle}>8. Sequence Diagrams</h2>

          <h3 style={subheadingStyle}>8.1 User Registration & Login</h3>
          <div style={figureBox}>
{`
User              Frontend            API              MongoDB
 │                   │                 │                 │
 │  Fill Form        │                 │                 │
 │──────────────────>│                 │                 │
 │                   │ POST /register  │                 │
 │                   │────────────────>│                 │
 │                   │                 │ Create User     │
 │                   │                 │───────────────>│
 │                   │                 │<───────────────│
 │                   │<────────────────│                 │
 │<──────────────────│                 │                 │
 │                   │                 │                 │
 │  Login Form       │                 │                 │
 │──────────────────>│                 │                 │
 │                   │ POST /login     │                 │
 │                   │────────────────>│                 │
 │                   │                 │ Verify Creds    │
 │                   │                 │───────────────>│
 │                   │                 │<───────────────│
 │                   │<───JWT Token────│                 │
 │<──────────────────│                 │                 │
 │  Store Token      │                 │                 │
 │  in localStorage  │                 │                 │`}
          </div>

          <h3 style={subheadingStyle}>8.2 Relief Distribution Flow</h3>
          <div style={figureBox}>
{`
Coordinator         Frontend            API              MongoDB
 │                   │                 │                 │
 │  Select Household │                 │                 │
 │──────────────────>│                 │                 │
 │                   │ GET /households │                 │
 │                   │────────────────>│                 │
 │                   │                 │ Query Hholds    │
 │                   │                 │───────────────>│
 │                   │                 │<───────────────│
 │                   │<────────────────│                 │
 │<──────────────────│                 │                 │
 │                   │                 │                 │
 │  Choose Items &   │                 │                 │
 │  Confirm Dist.    │                 │                 │
 │──────────────────>│                 │                 │
 │                   │POST/distribute  │                 │
 │                   │────────────────>│                 │
 │                   │                 │ Create DistLog  │
 │                   │                 │───────────────>│
 │                   │                 │ Update Stock    │
 │                   │                 │───────────────>│
 │                   │                 │<───────────────│
 │                   │<────────────────│                 │
 │<──────────────────│                 │                 │
 │  Confirmation     │                 │                 │`}
          </div>
        </section>

        {/* ─── 9. API Reference ─── */}
        <section style={sectionStyle}>
          <h2 style={headingStyle}>9. API Endpoint Reference</h2>

          <h3 style={subheadingStyle}>Public Endpoints</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: 'var(--color-bg)', borderBottom: '2px solid var(--color-border)' }}>
                <th style={{ textAlign: 'left', padding: '8px 10px' }}>Method</th>
                <th style={{ textAlign: 'left', padding: '8px 10px' }}>Path</th>
                <th style={{ textAlign: 'left', padding: '8px 10px' }}>Description</th>
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
                <tr key={path} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '6px 10px' }}><span style={{ fontWeight: 600, color: 'var(--color-info)' }}>{method}</span></td>
                  <td style={{ padding: '6px 10px', fontFamily: 'monospace' }}>{path}</td>
                  <td style={{ padding: '6px 10px' }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 style={subheadingStyle}>Authenticated Endpoints</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: 'var(--color-bg)', borderBottom: '2px solid var(--color-border)' }}>
                <th style={{ textAlign: 'left', padding: '8px 10px' }}>Method</th>
                <th style={{ textAlign: 'left', padding: '8px 10px' }}>Path</th>
                <th style={{ textAlign: 'left', padding: '8px 10px' }}>Roles</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['GET', '/v1/households', 'Admin/Coord'],
                ['POST', '/v1/households', 'Admin/Coord'],
                ['GET', '/v1/distributions', 'Admin/Coord'],
                ['POST', '/v1/distributions/log', 'Admin/Coord'],
                ['GET', '/v1/needs', 'Admin/Coord'],
                ['POST', '/v1/needs/calculate', 'Admin'],
                ['GET', '/v1/pledges', 'Admin/Coord'],
                ['POST', '/v1/pledges', 'Admin/Coord'],
                ['GET', '/v1/areas', 'All Authenticated'],
                ['POST', '/v1/auth/login', 'Public'],
                ['POST', '/v1/auth/register', 'Public'],
              ].map(([method, path, roles]) => (
                <tr key={path} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '6px 10px' }}><span style={{ fontWeight: 600, color: 'var(--color-info)' }}>{method}</span></td>
                  <td style={{ padding: '6px 10px', fontFamily: 'monospace' }}>{path}</td>
                  <td style={{ padding: '6px 10px' }}>{roles}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* ─── 10. Project Management ─── */}
        <section style={sectionStyle}>
          <h2 style={headingStyle}>10. Project Management & Sprint Plan</h2>

          <h3 style={subheadingStyle}>Phase 1: Foundation (Sprint 1)</h3>
          <ul style={{ lineHeight: 1.8, paddingLeft: 20 }}>
            <li>Project scaffolding (MERN stack setup with Vite)</li>
            <li>User authentication (JWT, bcrypt, role-based access)</li>
            <li>GeographicArea model with hierarchical data structure</li>
            <li>Database connection and seeding scripts</li>
          </ul>

          <h3 style={subheadingStyle}>Phase 2: Core Features (Sprint 2)</h3>
          <ul style={{ lineHeight: 1.8, paddingLeft: 20 }}>
            <li>Household CRUD with NID validation</li>
            <li>Need assessment calculation engine</li>
            <li>Relief distribution logging</li>
            <li>Inventory and item categories management</li>
          </ul>

          <h3 style={subheadingStyle}>Phase 3: Advanced Features (Sprint 3)</h3>
          <ul style={{ lineHeight: 1.8, paddingLeft: 20 }}>
            <li>Relief pledging system</li>
            <li>Relief request submission and tracking</li>
            <li>Heatmap visualization with Leaflet</li>
            <li>Offline sync with PouchDB</li>
          </ul>

          <h3 style={subheadingStyle}>Phase 4: Testing & Polish (Sprint 4)</h3>
          <ul style={{ lineHeight: 1.8, paddingLeft: 20 }}>
            <li>Integration testing (36+ passing tests)</li>
            <li>Jurisdiction → GeographicArea migration</li>
            <li>Public landing page with overview</li>
            <li>Demo credentials for testing access</li>
          </ul>
        </section>

        {/* ─── 11. Testing Strategy ─── */}
        <section style={sectionStyle}>
          <h2 style={headingStyle}>11. Testing Strategy</h2>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--color-bg)', borderBottom: '2px solid var(--color-border)' }}>
                <th style={{ textAlign: 'left', padding: '8px 12px' }}>Suite</th>
                <th style={{ textAlign: 'left', padding: '8px 12px' }}>File</th>
                <th style={{ textAlign: 'left', padding: '8px 12px' }}>Tests</th>
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
                <tr key={suite} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '6px 12px', fontWeight: 500 }}>{suite}</td>
                  <td style={{ padding: '6px 12px', fontFamily: 'monospace', fontSize: 12 }}>{file}</td>
                  <td style={{ padding: '6px 12px', color: 'var(--color-success)' }}>{tests}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 style={subheadingStyle}>Testing Tools</h3>
          <ul style={{ lineHeight: 1.8, paddingLeft: 20 }}>
            <li><strong>Jest:</strong> Test runner with --forceExit, --runInBand for MongoDB isolation.</li>
            <li><strong>Supertest:</strong> HTTP integration testing for Express endpoints.</li>
            <li><strong>Mongodb-memory-server:</strong> In-memory MongoDB instances for each test file.</li>
            <li><strong>bcrypt:</strong> Password hashing verification in auth tests.</li>
          </ul>
        </section>

        {/* ─── 12. Tech Stack ─── */}
        <section style={sectionStyle}>
          <h2 style={headingStyle}>12. Technology Stack</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <h3 style={subheadingStyle}>Frontend</h3>
              <ul style={{ lineHeight: 2, paddingLeft: 20 }}>
                <li>React 18 with Vite</li>
                <li>React Router v6 (SPA routing)</li>
                <li>Leaflet.js + react-leaflet</li>
                <li>Leaflet.heat (heatmap layer)</li>
                <li>shadcn/ui components</li>
                <li>Axios for HTTP client</li>
                <li>CSS custom properties (design tokens)</li>
              </ul>
            </div>
            <div>
              <h3 style={subheadingStyle}>Backend</h3>
              <ul style={{ lineHeight: 2, paddingLeft: 20 }}>
                <li>Node.js + Express.js</li>
                <li>MongoDB + Mongoose ODM</li>
                <li>JWT (jsonwebtoken) auth</li>
                <li>bcrypt for password hashing</li>
                <li>PouchDB (offline sync)</li>
                <li>Jest + Supertest</li>
                <li>Mongodb-memory-server</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ─── 13. Deployment ─── */}
        <section style={sectionStyle}>
          <h2 style={headingStyle}>13. Deployment Guide</h2>

          <h3 style={subheadingStyle}>Prerequisites</h3>
          <ul style={{ lineHeight: 1.8, paddingLeft: 20 }}>
            <li>Node.js v18+ and npm/yarn</li>
            <li>MongoDB v6+ (local or Atlas)</li>
            <li>Git for version control</li>
          </ul>

          <h3 style={subheadingStyle}>Setup Steps</h3>
          <div style={figureBox}>
{`# 1. Clone repository
git clone https://github.com/your-org/reliefmesh.git
cd reliefmesh

# 2. Backend setup
cd backend
npm install
cp .env.example .env   # configure MONGO_URI, JWT_SECRET
npm run seed           # seed initial data
npm start              # runs on port 3000

# 3. Frontend setup
cd ../frontend
npm install
cp .env.example .env   # set VITE_API_BASE_URL=http://localhost:3000/v1
npm run dev            # runs on port 5173

# 4. Run tests
cd backend
npm test               # 36+ integration tests`}
          </div>

          <h3 style={subheadingStyle}>Environment Variables</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: 'var(--color-bg)', borderBottom: '2px solid var(--color-border)' }}>
                <th style={{ textAlign: 'left', padding: '8px 10px' }}>Variable</th>
                <th style={{ textAlign: 'left', padding: '8px 10px' }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['PORT', 'Backend server port (default: 3000)'],
                ['MONGO_URI', 'MongoDB connection string'],
                ['JWT_SECRET', 'Secret key for JWT signing'],
                ['JWT_EXPIRE', 'Token expiration time (e.g., 7d)'],
                ['VITE_API_BASE_URL', 'API base URL for frontend'],
              ].map(([varName, desc]) => (
                <tr key={varName} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '6px 10px', fontFamily: 'monospace', fontWeight: 500 }}>{varName}</td>
                  <td style={{ padding: '6px 10px' }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* ─── 14. Security ─── */}
        <section style={sectionStyle}>
          <h2 style={headingStyle}>14. Security Considerations</h2>
          <ul style={{ lineHeight: 1.8, paddingLeft: 20 }}>
            <li><strong>Authentication:</strong> JWT tokens with configurable expiration. Passwords hashed with bcrypt (salt rounds: 10).</li>
            <li><strong>Authorization:</strong> Role-based middleware (admin, coordinator, citizen) on all protected routes.</li>
            <li><strong>Input Validation:</strong> Mongoose schema validation with required fields, enums, and unique constraints.</li>
            <li><strong>NID Protection:</strong> National ID numbers are hashed/encrypted before storage.</li>
            <li><strong>Offline Security:</strong> PouchDB data is scoped per user; sync requires authentication.</li>
            <li><strong>Rate Limiting:</strong> express-rate-limit on auth endpoints to prevent brute force.</li>
            <li><strong>CORS:</strong> Configured to allow only trusted origins.</li>
          </ul>
        </section>

        {/* ─── 15. Known Limitations ─── */}
        <section style={sectionStyle}>
          <h2 style={headingStyle}>15. Known Limitations & Future Work</h2>

          <h3 style={subheadingStyle}>Limitations</h3>
          <ul style={{ lineHeight: 1.8, paddingLeft: 20 }}>
            <li>Heatmap uses seeded/synthetic coordinates for demo areas (not real-world geo-coordinates of Bangladesh).</li>
            <li>Offline sync is basic — conflict resolution is last-write-wins.</li>
            <li>No real-time WebSocket updates; polling is used for data refresh.</li>
            <li>Mobile responsiveness is functional but not fully optimized.</li>
          </ul>

          <h3 style={subheadingStyle}>Future Enhancements</h3>
          <ul style={{ lineHeight: 1.8, paddingLeft: 20 }}>
            <li>SMS/email notifications for relief distribution alerts.</li>
            <li>Advanced analytics dashboard with historical trends.</li>
            <li>Multi-language support (Bengali, English).</li>
            <li>Integration with disaster early warning systems (e.g., API from BMD).</li>
            <li>CI/CD pipeline with automated test + deployment.</li>
            <li>Containerization with Docker for consistent deployment.</li>
          </ul>
        </section>

      </div>

      {/* ─── Footer ─── */}
      <footer style={{
        borderTop: '1px solid var(--color-border)', padding: '24px 48px',
        textAlign: 'center', fontSize: 13, color: 'var(--color-text-muted)',
      }}>
        <p>ReliefMesh — CSE 3208 System Analysis and Design Lab, RMSTU.</p>
        <p style={{ marginTop: 4 }}>
          <Link to="/" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Back to Home</Link>
        </p>
      </footer>
    </div>
  )
}
