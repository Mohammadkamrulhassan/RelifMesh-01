import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { listAlerts, resolveAlert, listUsers } from './adminService'
import { listHouseholds } from '../households/householdService'
import { formatDateTime, roleLabel } from '../../utils/formatters'
import Card from '../../components/common/Card'
import Loading from '../../components/common/Loading'
import Button from '../../components/common/Button'
import Input from '../../components/ui/Input'
import SelectField from '../../components/forms/SelectField'

export default function Admin() {
  const [alerts, setAlerts] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [resolveId, setResolveId] = useState(null)
  const [reason, setReason] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [usersLoading, setUsersLoading] = useState(false)
  const [householdStats, setHouseholdStats] = useState(null)

  useEffect(() => {
    Promise.all([listAlerts(), listUsers(), listHouseholds('?limit=1')])
      .then(([alertsData, usersData, householdData]) => {
        setAlerts(alertsData.alerts)
        setUsers(usersData.users)
        setHouseholdStats({ total: householdData.total, pages: householdData.pages })
      })
      .catch(err => setError(err.error || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  async function loadUsers() {
    setUsersLoading(true)
    try {
      const params = roleFilter ? `?role=${roleFilter}` : ''
      const data = await listUsers(params)
      setUsers(data.users)
    } catch (err) {
      setError(err.error || 'Failed to load users')
    } finally {
      setUsersLoading(false)
    }
  }

  useEffect(() => { if (!loading) loadUsers() }, [roleFilter])

  async function handleResolve(id) {
    try {
      await resolveAlert(id, reason)
      setAlerts(a => a.filter(al => al._id !== id))
      setResolveId(null)
      setReason('')
    } catch (err) {
      setError(err.error || 'Failed to resolve')
    }
  }

  if (loading) return <Loading message="Loading admin..." />
  if (error) return <div className="page-section"><p style={{ color: 'var(--color-danger)' }}>{error}</p></div>

  const unresolved = alerts.filter(a => !a.isResolved)

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Admin</h1>
          <p className="page-header-subtitle">System overview, user management & duplicate alert resolution</p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <Link to="/app/households" style={{ textDecoration: 'none' }}>
          <Card style={{ cursor: 'pointer', transition: 'box-shadow var(--transition-base)', textAlign: 'center', padding: 'var(--space-6)' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
          >
            <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)' }}>
              {householdStats ? householdStats.total : '—'}
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
              Total Households
            </p>
          </Card>
        </Link>
      </div>

      <Card style={{ marginBottom: 'var(--space-6)' }}>
        <h2 className="page-section-title">Registered Users <span className="badge badge-info">{users.length}</span></h2>
        <div style={{ marginBottom: 'var(--space-3)', maxWidth: '200px' }}>
          <SelectField label="" name="roleFilter" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
            <option value="">All Roles</option>
            <option value="UPAZILA_OFFICER">Upazila Officer</option>
            <option value="UP_OFFICIAL">UP Official</option>
            <option value="NGO_WORKER">NGO Worker</option>
            <option value="CITIZEN">Citizen</option>
          </SelectField>
        </div>
        {usersLoading ? <Loading message="Loading users..." /> : users.length === 0 ? (
          <p className="data-table-empty">No users found.</p>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td style={{ fontWeight: 500 }}>{u.name}</td>
                    <td style={{ color: 'var(--color-text-secondary)' }}>{u.email}</td>
                    <td><span className="badge badge-info">{roleLabel(u.role)}</span></td>
                    <td style={{ color: 'var(--color-text-secondary)' }}>{u.phone || '—'}</td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{formatDateTime(u.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card>
        <h2 className="page-section-title">Duplicate Alerts <span className="badge badge-warning">{unresolved.length}</span></h2>
        {unresolved.length === 0 ? (
          <p className="data-table-empty">No unresolved alerts.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {unresolved.map(alert => (
              <div key={alert._id} className="page-section" style={{ marginBottom: 0 }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                  Household: <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{alert.householdId?.headName || alert.householdId}</span>
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>{formatDateTime(alert.createdAt)}</p>
                {resolveId === alert._id ? (
                  <div style={{ marginTop: 'var(--space-3)', display: 'flex', gap: 'var(--space-2)' }}>
                    <div style={{ flex: 1 }}>
                      <Input
                        name="reason"
                        placeholder="Override reason..."
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                      />
                    </div>
                    <Button onClick={() => handleResolve(alert._id)} disabled={!reason}>Resolve</Button>
                    <Button variant="ghost" onClick={() => setResolveId(null)}>Cancel</Button>
                  </div>
                ) : (
                  <Button variant="secondary" size="sm" style={{ marginTop: 'var(--space-2)' }} onClick={() => setResolveId(alert._id)}>Resolve</Button>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
