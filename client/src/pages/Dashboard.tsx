import { useEffect, useState } from 'react'
import api from '../services/api'
import KPI from '../components/KPI'
import { ScatterChart, CartesianGrid, XAxis, YAxis, Tooltip, Scatter } from 'recharts'

type Metrics = {
  impressions: number
  reach: number
  frequency: number
  conversions: number
  revenue: number
  cost: number
  cpc: number
  conversion_rate: number
  roas: number | null
  simulated: boolean
}

export default function Dashboard() {
  const [windowDays, setWindowDays] = useState(30)
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [scatter, setScatter] = useState<{ campaign: string; cost_per_conversion: number; conversion_rate: number }[]>([])
  const [pivot, setPivot] = useState<{ region: string; category: string; revenue: number }[]>([])

  useEffect(() => {
    const load = async () => {
      const m = await api.get(`/metrics?window=${windowDays}`)
      setMetrics(m.data)
      const s = await api.get(`/scatter?window=${windowDays}`)
      setScatter(s.data.points)
      const p = await api.get(`/pivot?window=${windowDays}`)
      setPivot(p.data.rows)
    }
    load()
  }, [windowDays])

  return (
    <div className="fade-in">
      <h1 className="section-title">Media</h1>

      {/* Campaign Overview Card */}
      <div className="card p-6 mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
        <div>
          <span className="text-xs text-gray-500 block mb-1">Campaign ID</span>
          <span className="font-medium">123456</span>
        </div>
        <div>
          <span className="text-xs text-gray-500 block mb-1">Media Buyer</span>
          <span className="font-medium">ABC Agency</span>
        </div>
        <div>
          <span className="text-xs text-gray-500 block mb-1">Spend Group</span>
          <span className="font-medium">4 Groups</span>
        </div>
        <div className="flex items-center justify-end md:col-span-2 lg:col-span-1 space-x-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-blue-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            <span className="text-blue-500 font-medium">Hypermode</span>
          </div>
          <button className="btn-primary">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            <span>Import / Export</span>
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <h3 className="section-title"><i className="fa-solid fa-chart-line"></i>Executive Performance Overview</h3>
          
          <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
            <table style={{ minWidth: '100%', background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
              <thead style={{ background: '#f9fafb' }}>
                <tr style={{ textAlign: 'left', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '12px 16px' }}>Metric</th>
                  <th style={{ padding: '12px 16px' }}>Value</th>
                  <th style={{ padding: '12px 16px' }}>Innovid Benchmark</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                </tr>
              </thead>
              <tbody style={{ borderTop: '1px solid #e5e7eb' }}>
                <tr><td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 500, color: '#111827' }}>Impressions</td><td style={{ padding: '12px 16px', fontSize: '14px', color: '#374151' }}>{metrics?.impressions ?? '-'}</td><td style={{ padding: '12px 16px', fontSize: '14px', color: '#374151' }}>-</td><td style={{ padding: '12px 16px', fontSize: '14px', color: '#16a34a' }}>Above Benchmark</td></tr>
                <tr><td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 500, color: '#111827' }}>Reach</td><td style={{ padding: '12px 16px', fontSize: '14px', color: '#374151' }}>{metrics?.reach ?? '-'}</td><td style={{ padding: '12px 16px', fontSize: '14px', color: '#374151' }}>-</td><td style={{ padding: '12px 16px', fontSize: '14px', color: '#16a34a' }}>Above Benchmark</td></tr>
                <tr><td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 500, color: '#111827' }}>Frequency</td><td style={{ padding: '12px 16px', fontSize: '14px', color: '#374151' }}>{metrics?.frequency ?? '-'}</td><td style={{ padding: '12px 16px', fontSize: '14px', color: '#374151' }}>-</td><td style={{ padding: '12px 16px', fontSize: '14px', color: '#16a34a' }}>Above Benchmark</td></tr>
                <tr><td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 500, color: '#111827' }}>Conversions</td><td style={{ padding: '12px 16px', fontSize: '14px', color: '#374151' }}>{metrics?.conversions ?? '-'}</td><td style={{ padding: '12px 16px', fontSize: '14px', color: '#374151' }}>-</td><td style={{ padding: '12px 16px', fontSize: '14px', color: '#16a34a' }}>Above Benchmark</td></tr>
                <tr><td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 500, color: '#111827' }}>ROAS</td><td style={{ padding: '12px 16px', fontSize: '14px', color: '#374151' }}>{metrics?.roas ?? '-'}</td><td style={{ padding: '12px 16px', fontSize: '14px', color: '#374151' }}>-</td><td style={{ padding: '12px 16px', fontSize: '14px', color: '#16a34a' }}>Above Benchmark</td></tr>
              </tbody>
            </table>
          </div>

          <h3 className="section-title" style={{ marginTop: '32px' }}><i className="fa-solid fa-chart-scatter"></i>Effectiveness vs. Efficiency</h3>
          <div style={{ height: '320px' }}>
            <ScatterChart width={700} height={320} margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
              <CartesianGrid />
              <XAxis type="number" dataKey="cost_per_conversion" name="CPC" />
              <YAxis type="number" dataKey="conversion_rate" name="CVR" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Campaigns" data={scatter} fill="#8884d8" />
            </ScatterChart>
          </div>

          <h3 className="section-title" style={{ marginTop: '32px' }}><i className="fa-solid fa-chart-pie"></i>Channel Performance</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ minWidth: '100%', background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
              <thead style={{ background: '#f9fafb' }}>
                <tr style={{ textAlign: 'left', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '12px 16px' }}>Region</th>
                  <th style={{ padding: '12px 16px' }}>Category</th>
                  <th style={{ padding: '12px 16px' }}>Revenue</th>
                </tr>
              </thead>
              <tbody style={{ borderTop: '1px solid #e5e7eb' }}>
                {pivot.map((r, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '12px 16px' }}>{r.region}</td>
                    <td style={{ padding: '12px 16px' }}>{r.category}</td>
                    <td style={{ padding: '12px 16px' }}>${r.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card lg:col-span-1">
          <h3 className="section-title"><i className="fa-solid fa-lightbulb"></i>Top 3 Recommendations</h3>
          <div id="top-recommendations-list">
            {/* Top 3 recommendations will be populated here */}
            <div style={{ background: '#eef2ff', padding: '16px', borderRadius: '12px', marginBottom: '16px', border: '1px solid #c7d2fe' }}>
              <p style={{ fontWeight: 600, color: '#3730a3', fontSize: '18px', marginBottom: '8px' }}>
                <i className="fa-solid fa-bolt" style={{ marginRight: '8px', color: '#6366f1' }}></i>
                Increase Budget Electronics
              </p>
              <p style={{ fontSize: '14px', color: '#374151', marginBottom: '8px' }}>
                <strong>Benefit:</strong> <span style={{ color: '#059669', fontWeight: 500 }}>Predicted ROAS +0.06</span>
              </p>
              <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>
                Electronics category shows strong CVR; increasing budget can scale results.
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-primary btn-sm"><i className="fa-solid fa-eye" style={{ marginRight: '4px' }}></i>View</button>
                <button className="btn-primary btn-sm"><i className="fa-solid fa-check" style={{ marginRight: '4px' }}></i>Apply</button>
                <button className="btn-primary btn-sm" style={{ background: '#e5e7eb', color: '#374151' }}><i className="fa-solid fa-times" style={{ marginRight: '4px' }}></i>Dismiss</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


