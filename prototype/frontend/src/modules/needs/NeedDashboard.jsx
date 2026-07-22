import { useState, useEffect } from 'react'
import { listNeeds, getNeedSummary, getAreaHierarchy, getAreaChildren, calculateNeeds, overrideNeed } from './needService'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Loading from '../../components/common/Loading'
import { useToast } from '../../components/ui/Toast'
import { useAuth } from '../../hooks/useAuth'

export default function NeedDashboard() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [summary, setSummary] = useState([])
  const [hierarchy, setHierarchy] = useState([])
  const [selectedWard, setSelectedWard] = useState(null)
  const [selectedAssessments, setSelectedAssessments] = useState([])
  const [calculating, setCalculating] = useState(false)
  const [overrideModal, setOverrideModal] = useState(null)
  const [overrideQty, setOverrideQty] = useState('')
  const [overrideReason, setOverrideReason] = useState('')
  const [wardList, setWardList] = useState([])
  const [coverageDays, setCoverageDays] = useState(7)

  const canCalculate = user?.role === 'UPAZILA_OFFICER'
  const canOverride = user?.role === 'UPAZILA_OFFICER'

  useEffect(() => {
    Promise.all([getNeedSummary(), getAreaHierarchy()])
      .then(([sumData, hierData]) => {
        setSummary(sumData.byArea || [])
        setHierarchy(hierData.hierarchy || [])
        // Flatten to get all wards
        const wards = []
        for (const div of hierData.hierarchy || []) {
          for (const dist of div.children || []) {
            for (const upa of dist.children || []) {
              for (const uni of upa.children || []) {
                for (const w of uni.children || []) {
                  wards.push({ ...w, unionName: uni.name, upazilaName: upa.name, districtName: dist.name, divisionName: div.name })
                }
              }
            }
          }
        }
        setWardList(wards)
      })
      .catch(err => setError(err.error || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  async function handleSelectWard(ward) {
    setSelectedWard(ward)
    try {
      const data = await listNeeds({ areaId: ward._id })
      setSelectedAssessments(data.assessments || [])
    } catch {
      setSelectedAssessments([])
    }
  }

  async function handleCalculate(wardId) {
    setCalculating(true)
    try {
      await calculateNeeds(wardId, coverageDays)
      addToast('Need calculation complete', 'success')
      if (selectedWard?._id === wardId) {
        const data = await listNeeds({ areaId: wardId })
        setSelectedAssessments(data.assessments || [])
      }
      const sumData = await getNeedSummary()
      setSummary(sumData.byArea || [])
    } catch (err) {
      addToast(err.error || 'Calculation failed', 'error')
    } finally {
      setCalculating(false)
    }
  }

  async function handleOverride() {
    if (!overrideModal || !overrideQty || !overrideReason) return
    try {
      await overrideNeed(overrideModal._id, Number(overrideQty), overrideReason)
      addToast('Override saved', 'success')
      setOverrideModal(null)
      setOverrideQty('')
      setOverrideReason('')
      const data = await listNeeds({ areaId: selectedWard._id })
      setSelectedAssessments(data.assessments || [])
      const sumData = await getNeedSummary()
      setSummary(sumData.byArea || [])
    } catch (err) {
      addToast(err.error || 'Override failed', 'error')
    }
  }

  function getWardNeed(wardId) {
    const s = summary.find(s => s.area?._id === wardId)
    return s || null
  }

  if (loading) return <Loading message="Loading need assessment dashboard..." />
  if (error) return <div className="page-section"><p style={{ color: 'var(--color-danger)' }}>{error}</p></div>

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Need Assessment Dashboard</h1>
          <p className="page-header-subtitle">Ward-level relief needs calculated from demographics × Sphere rates</p>
        </div>
      </div>

      {/* Stats overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <Card className="text-center">
          <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)' }}>{wardList.length}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Wards Covered</p>
        </Card>
        <Card className="text-center">
          <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)' }}>{summary.length}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Area-Item Records</p>
        </Card>
        <Card className="text-center">
          <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)' }}>
            {summary.reduce((sum, s) => sum + s.totalEffective, 0).toLocaleString()}
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Total Effective Qty</p>
        </Card>
      </div>

      {/* Coverage days selector + Calculate All */}
      <Card style={{ marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <label style={{ fontWeight: 500, fontSize: '0.875rem' }}>Coverage Period (days):</label>
          <input
            type="number"
            min="1"
            max="90"
            value={coverageDays}
            onChange={e => setCoverageDays(Math.max(1, Math.min(90, Number(e.target.value))))}
            style={{ width: '80px', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
          />
          {canCalculate && (
            <Button
              onClick={() => wardList.forEach(w => handleCalculate(w._id))}
              loading={calculating}
              disabled={calculating || wardList.length === 0}
            >
              Calculate All Wards
            </Button>
          )}
        </div>
      </Card>

      {/* Ward list */}
      <Card style={{ marginBottom: 'var(--space-4)' }}>
        <h2 className="page-section-title">Wards</h2>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Ward / Area</th>
                <th>Union</th>
                <th>Upazila</th>
                <th>Items Assessed</th>
                <th>Total Effective</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {wardList.map(ward => {
                const need = getWardNeed(ward._id)
                return (
                  <tr
                    key={ward._id}
                    style={{ cursor: 'pointer', background: selectedWard?._id === ward._id ? 'var(--color-primary-light)' : undefined }}
                    onClick={() => handleSelectWard(ward)}
                  >
                    <td style={{ fontWeight: 500 }}>{ward.name}</td>
                    <td>{ward.unionName}</td>
                    <td>{ward.upazilaName}</td>
                    <td>{need ? need.items.length : 0}</td>
                    <td style={{ fontWeight: 600, color: need && need.totalEffective > 0 ? 'var(--color-danger)' : 'var(--color-text-muted)' }}>
                      {need ? need.totalEffective.toLocaleString() : '—'}
                    </td>
                    <td>
                      {canCalculate && (
                        <Button size="xs" variant="secondary" onClick={e => { e.stopPropagation(); handleCalculate(ward._id) }}>
                          Calculate
                        </Button>
                      )}
                    </td>
                  </tr>
                )
              })}
              {wardList.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>No wards found. Run the geographic area seed first.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Selected ward detail */}
      {selectedWard && (
        <Card>
          <h2 className="page-section-title">{selectedWard.name} — Item Breakdown</h2>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item Category</th>
                  <th>Calculated Qty</th>
                  <th>Override Qty</th>
                  <th>Effective Qty</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedAssessments.map(a => (
                  <tr key={a._id}>
                    <td style={{ fontWeight: 500 }}>{a.itemCategoryId?.name || a.itemCategoryId}</td>
                    <td>{Math.round(a.calculated_qty).toLocaleString()}</td>
                    <td>{a.override_qty != null ? Math.round(a.override_qty).toLocaleString() : '—'}</td>
                    <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                      {Math.round(a.effective_qty).toLocaleString()}
                    </td>
                    <td>
                      {canOverride && (
                        <Button size="xs" variant="ghost" onClick={() => { setOverrideModal(a); setOverrideQty(String(a.override_qty || '')); setOverrideReason('') }}>
                          Override
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
                {selectedAssessments.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>No assessments yet. Click "Calculate" for this ward.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Override Modal */}
      {overrideModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 'var(--space-4)',
        }} onClick={() => setOverrideModal(null)}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: 'var(--space-6)', maxWidth: '480px', width: '100%' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Override Need Assessment</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: 'var(--space-4)' }}>
              {overrideModal.itemCategoryId?.name || overrideModal.itemCategoryId} — Current calculated: {Math.round(overrideModal.calculated_qty).toLocaleString()}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div>
                <label className="input-label">Override Quantity</label>
                <input
                  type="number"
                  min="0"
                  value={overrideQty}
                  onChange={e => setOverrideQty(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                />
              </div>
              <div>
                <label className="input-label">Reason</label>
                <textarea
                  value={overrideReason}
                  onChange={e => setOverrideReason(e.target.value)}
                  rows={3}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', resize: 'vertical' }}
                  placeholder="Explain why the quantity is being overridden..."
                />
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
                <Button variant="secondary" onClick={() => setOverrideModal(null)}>Cancel</Button>
                <Button onClick={handleOverride} disabled={!overrideQty || !overrideReason}>Save Override</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
