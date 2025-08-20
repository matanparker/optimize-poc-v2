import { useEffect, useState } from 'react'

export default function Settings() {
  const [profile, setProfile] = useState({
    name: localStorage.getItem('name') || 'John Doe',
    email: localStorage.getItem('email') || 'john.doe@company.com',
    username: 'john.doe',
    role: 'Campaign Manager'
  })

  const [notifications, setNotifications] = useState({
    emailAlerts: localStorage.getItem('email') || 'john.doe@company.com',
    alertFrequency: localStorage.getItem('alertFrequency') || 'weekly',
    recommendationUpdates: localStorage.getItem('recommendationUpdates') || 'weekly',
    enableEmailAlerts: localStorage.getItem('enableEmailAlerts') !== 'false',
    enablePushNotifications: localStorage.getItem('enablePushNotifications') !== 'false',
    enableWeeklyReports: localStorage.getItem('enableWeeklyReports') !== 'false'
  })

  const [showPasswordTooltip, setShowPasswordTooltip] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('name', profile.name)
    localStorage.setItem('email', profile.email)
    localStorage.setItem('alertFrequency', notifications.alertFrequency)
    localStorage.setItem('recommendationUpdates', notifications.recommendationUpdates)
    localStorage.setItem('enableEmailAlerts', notifications.enableEmailAlerts.toString())
    localStorage.setItem('enablePushNotifications', notifications.enablePushNotifications.toString())
    localStorage.setItem('enableWeeklyReports', notifications.enableWeeklyReports.toString())
  }, [profile, notifications])

  const handleProfileSave = async () => {
    setSaveStatus('saving')
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    }, 1000)
  }

  const handleNotificationSave = async () => {
    setSaveStatus('saving')
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    }, 1000)
  }

  const handlePasswordChange = () => {
    alert('Password changes must be made through your IT administrator or account manager. Please contact support for assistance.')
  }

  return (
    <div className="fade-in">
      <h1 className="section-title">Account Settings</h1>

      <div className="space-y-8">
        {/* Account & Profile Management */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Account & Profile</h2>
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Full Name</div>
                <div className="font-medium text-gray-900">{profile.name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Email Address</div>
                <div className="font-medium text-gray-900">{profile.email}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Username</div>
                <div className="font-medium text-gray-900">{profile.username}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Role</div>
                <div className="font-medium text-gray-900">{profile.role}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="profile-name">Display Name</label>
              <input
                type="text"
                id="profile-name"
                value={profile.name}
                onChange={e => setProfile(prev => ({ ...prev, name: e.target.value }))}
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="profile-email">Email Address</label>
              <input
                type="email"
                id="profile-email"
                value={profile.email}
                onChange={e => setProfile(prev => ({ ...prev, email: e.target.value }))}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
            <div className="relative">
              <button
                className="btn-secondary"
                onClick={handlePasswordChange}
                onMouseEnter={() => setShowPasswordTooltip(true)}
                onMouseLeave={() => setShowPasswordTooltip(false)}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                </svg>
                Change Password
              </button>
              {showPasswordTooltip && (
                <div className="absolute bottom-full left-0 mb-2 p-2 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10">
                  Contact your account manager for password changes
                  <div className="absolute top-full left-4 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800"></div>
                </div>
              )}
            </div>
            <button
              onClick={handleProfileSave}
              disabled={saveStatus === 'saving'}
              className={`btn-primary ${saveStatus === 'saved' ? 'bg-green-600' : ''}`}
            >
              {saveStatus === 'saving' && <div className="loader mr-2 w-4 h-4 border-2"></div>}
              {saveStatus === 'saved' && (
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              )}
              {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Profile'}
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="card">
          <div className="flex items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Notification Settings</h2>
            <svg className="w-6 h-6 ml-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
          </div>

          {/* Email Settings */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="alert-email">Alert Email Address</label>
                <input
                  type="email"
                  id="alert-email"
                  value={notifications.emailAlerts}
                  onChange={e => setNotifications(prev => ({ ...prev, emailAlerts: e.target.value }))}
                  placeholder="Enter email for alerts and updates"
                  className="w-full"
                />
                <p className="text-sm text-gray-500 mt-1">Receive performance alerts and system notifications</p>
              </div>
              <div>
                <label htmlFor="alert-frequency">Alert Frequency</label>
                <select
                  id="alert-frequency"
                  value={notifications.alertFrequency}
                  onChange={e => setNotifications(prev => ({ ...prev, alertFrequency: e.target.value }))}
                  className="w-full"
                >
                  <option value="immediate">Immediate</option>
                  <option value="daily">Daily Summary</option>
                  <option value="weekly">Weekly Summary</option>
                  <option value="monthly">Monthly Summary</option>
                </select>
              </div>
            </div>
          </div>

          {/* Recommendation Updates */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recommendation Updates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="recommendation-frequency">Update Frequency</label>
                <select
                  id="recommendation-frequency"
                  value={notifications.recommendationUpdates}
                  onChange={e => setNotifications(prev => ({ ...prev, recommendationUpdates: e.target.value }))}
                  className="w-full"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
                <p className="text-sm text-gray-500 mt-1">How often to receive new optimization recommendations</p>
              </div>
              <div>
                <div className="space-y-3 pt-7">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notifications.enableEmailAlerts}
                      onChange={e => setNotifications(prev => ({ ...prev, enableEmailAlerts: e.target.checked }))}
                      className="mr-3"
                    />
                    <span className="text-sm">Email alerts for performance issues</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notifications.enableWeeklyReports}
                      onChange={e => setNotifications(prev => ({ ...prev, enableWeeklyReports: e.target.checked }))}
                      className="mr-3"
                    />
                    <span className="text-sm">Weekly performance reports</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Preview */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-blue-800 mb-2">Notification Preview</h4>
            <div className="text-sm text-blue-700">
              <p className="mb-1">
                <strong>Alert Email:</strong> {notifications.emailAlerts}
              </p>
              <p className="mb-1">
                <strong>Alert Frequency:</strong> {notifications.alertFrequency.charAt(0).toUpperCase() + notifications.alertFrequency.slice(1)}
              </p>
              <p>
                <strong>Recommendation Updates:</strong> {notifications.recommendationUpdates.charAt(0).toUpperCase() + notifications.recommendationUpdates.slice(1)}
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleNotificationSave}
              disabled={saveStatus === 'saving'}
              className={`btn-primary ${saveStatus === 'saved' ? 'bg-green-600' : ''}`}
            >
              {saveStatus === 'saving' && <div className="loader mr-2 w-4 h-4 border-2"></div>}
              {saveStatus === 'saved' && (
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              )}
              {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Notification Settings'}
            </button>
          </div>
        </div>

        {/* Additional Settings */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Additional Settings</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Data & Privacy</h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-3" />
                  <span className="text-sm">Allow usage analytics for product improvement</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-3" />
                  <span className="text-sm">Share anonymized performance data with benchmarks</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">System Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="timezone">Timezone</label>
                  <select id="timezone" className="w-full">
                    <option value="UTC">UTC (Coordinated Universal Time)</option>
                    <option value="EST">EST (Eastern Standard Time)</option>
                    <option value="PST">PST (Pacific Standard Time)</option>
                    <option value="GMT">GMT (Greenwich Mean Time)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="currency">Default Currency</label>
                  <select id="currency" className="w-full">
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="JPY">JPY (¥)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button className="btn-secondary">
              Save Additional Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


