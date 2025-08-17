import { useEffect, useState } from 'react'
import api from '../services/api'

type Rec = { id: string; campaign: string; action: string; benefit: string; explanation: string }

export default function Recommendations() {
  const [recs, setRecs] = useState<Rec[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [summary, setSummary] = useState('')

  useEffect(() => {
    const load = async () => {
      const res = await api.get('/recommendations?limit=10')
      setRecs(res.data.items)
    }
    load()
  }, [])

  useEffect(() => {
    if (selected.length === 0) {
      setSummary('')
    } else {
      setSummary(`Benefits estimate: ROAS +${(selected.length * 0.03).toFixed(2)} (simulated)`) 
    }
  }, [selected])

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const apply = async () => {
    await api.post('/recommendations/apply', { ids: selected })
    alert('Simulated apply complete')
  }

  return (
    <div className="card fade-in">
      <h3 className="section-title"><i className="fa-solid fa-list-check"></i>All Recommendations</h3>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>Select one or more recommendations to see the combined benefits.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="lg:col-span-1">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {recs.map(r => (
              <label 
                key={r.id} 
                style={{ 
                  display: 'block', 
                  background: 'white', 
                  padding: '16px', 
                  borderRadius: '12px', 
                  border: '1px solid #e5e7eb', 
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#6366f1'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
              >
                <input 
                  type="radio" 
                  name="selected-recommendations" 
                  value={r.id} 
                  checked={selected.includes(r.id)} 
                  onChange={() => toggle(r.id)}
                  style={{ marginRight: '12px', verticalAlign: 'middle' }}
                />
                <span style={{ fontWeight: 600, fontSize: '18px', color: '#3730a3' }}>
                  {r.action} {r.campaign}
                </span>
                <p style={{ fontSize: '14px', color: '#374151', marginTop: '4px' }}>
                  {r.explanation}
                </p>
              </label>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card" style={{ padding: '16px' }}>
            <h4 className="section-title" style={{ fontSize: '16px' }}>
              <i className="fa-solid fa-arrow-trend-up"></i>Predicted Benefits
            </h4>
            <div style={{ fontSize: '14px', color: '#374151' }}>
              {summary ? (
                <div>
                  <p>{summary}</p>
                  <p style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
                    *Estimates are illustrative for prototype demonstration.
                  </p>
                </div>
              ) : (
                <p>Select recommendations to see predicted changes in metrics.</p>
              )}
            </div>
          </div>

          <div className="card" style={{ padding: '16px' }}>
            <h4 className="section-title" style={{ fontSize: '16px' }}>
              <i className="fa-solid fa-circle-info"></i>Explanation
            </h4>
            <div style={{ fontSize: '14px', color: '#374151' }}>
              {selected.length ? 
                'Package justified based on high CPC and low CVR segments (simulated).' : 
                'Justification for selected recommendations will appear here.'
              }
            </div>
          </div>
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'flex-end', 
        marginTop: '32px', 
        gap: '16px' 
      }}>
        <button className="btn-primary" onClick={() => window.open('/api/recommendations/export')}>
          <i className="fa-solid fa-file-export" style={{ marginRight: '8px' }}></i>
          Export Presentation Data
        </button>
        <button 
          className="btn-primary" 
          onClick={apply} 
          disabled={!selected.length}
        >
          <i className="fa-solid fa-check-circle" style={{ marginRight: '8px' }}></i>
          Apply Recommendations
        </button>
      </div>
    </div>
  )
}


