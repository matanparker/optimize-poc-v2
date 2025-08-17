import { useEffect, useState } from 'react'

export default function Settings() {
  const [email, setEmail] = useState(localStorage.getItem('email') || '')
  const [name, setName] = useState(localStorage.getItem('name') || '')
  const [objective, setObjective] = useState('ROAS')
  const [cadence, setCadence] = useState('weekly')
  const [openaiKey, setOpenaiKey] = useState(localStorage.getItem('OPENAI_API_KEY') || '')

  useEffect(() => {
    localStorage.setItem('email', email)
    localStorage.setItem('name', name)
    localStorage.setItem('OPENAI_API_KEY', openaiKey)
  }, [email, name, openaiKey])

  return (
    <div className="card fade-in">
      <h3 className="section-title" style={{ marginBottom: '24px' }}>
        <i className="fa-solid fa-cog"></i>Settings
      </h3>

      {/* Account & Profile Management */}
      <div style={{ marginBottom: '32px' }}>
        <h4 className="section-title" style={{ fontSize: '16px', marginBottom: '16px' }}>
          <i className="fa-solid fa-user-circle"></i>Account & Profile
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '16px' }}>
          <div>
            <label htmlFor="settings-username">Username</label>
            <input 
              type="text" 
              id="settings-username" 
              value="demoUser" 
              readOnly 
              style={{ background: '#f3f4f6', cursor: 'not-allowed' }}
            />
          </div>
          <div>
            <label htmlFor="settings-email">Email</label>
            <input 
              type="email" 
              id="settings-email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
            />
          </div>
        </div>
        <button 
          className="btn-primary" 
          disabled 
          style={{ marginTop: '16px', padding: '8px 16px' }}
        >
          <i className="fa-solid fa-key" style={{ marginRight: '8px' }}></i>
          Change Password (Non-functional)
        </button>
      </div>

      {/* Campaign Preferences */}
      <div style={{ marginBottom: '32px' }}>
        <h4 className="section-title" style={{ fontSize: '16px', marginBottom: '16px' }}>
          <i className="fa-solid fa-bullseye"></i>Campaign Preferences
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '16px' }}>
          <div>
            <label htmlFor="optimization-objective">Optimization Objective</label>
            <select 
              id="optimization-objective" 
              value={objective} 
              onChange={e => setObjective(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="roas">Maximize ROAS</option>
              <option value="conversions">Increase Conversions</option>
              <option value="cpc">Reduce Cost Per Conversion</option>
              <option value="reach">Maximize Reach</option>
            </select>
          </div>
          <div>
            <label htmlFor="alert-metric">Set Alert for Metric</label>
            <select id="alert-metric" style={{ width: '100%' }}>
              <option value="cpc">Cost Per Conversion (CPC)</option>
              <option value="cpm">Cost Per Mille (CPM)</option>
              <option value="ctr">Click-Through Rate (CTR)</option>
            </select>
          </div>
          <div>
            <label htmlFor="alert-threshold">Alert Threshold</label>
            <input 
              type="number" 
              id="alert-threshold" 
              placeholder="e.g., 0.5 for CTR, 1.20 for CPC" 
              style={{ width: '100%' }}
            />
          </div>
        </div>
        <button 
          className="btn-primary" 
          style={{ marginTop: '16px', padding: '8px 16px' }}
          onClick={() => alert('Settings saved successfully! (Simulated)')}
        >
          <i className="fa-solid fa-save" style={{ marginRight: '8px' }}></i>
          Save Preferences
        </button>
      </div>

      {/* Notification Settings */}
      <div>
        <h4 className="section-title" style={{ fontSize: '16px', marginBottom: '16px' }}>
          <i className="fa-solid fa-bell"></i>Notification Settings
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '16px' }}>
          <div>
            <label htmlFor="notification-email">Notification Email</label>
            <input 
              type="email" 
              id="notification-email" 
              placeholder="Enter email for updates"
              value={email} 
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="recommendation-cadence">Recommendation Cadence</label>
            <select 
              id="recommendation-cadence" 
              value={cadence} 
              onChange={e => setCadence(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>
        <button 
          className="btn-primary" 
          style={{ marginTop: '16px', padding: '8px 16px' }}
          onClick={() => alert('Notification settings saved! (Simulated)')}
        >
          <i className="fa-solid fa-save" style={{ marginRight: '8px' }}></i>
          Save Notifications
        </button>
      </div>
    </div>
  )
}


