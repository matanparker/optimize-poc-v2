import { useEffect, useState } from 'react'
import api from '../services/api'

type Campaign = {
  id: string
  name: string
  placement: string
  creative: string
  channel: string
  impressions: number
  reach: number
  avgFrequency: number
  conversions: number
  conversionPercent: number
  conversionRate: number
  adSpend: number
  roas: number
  costPerConversion: number
  benchmarkStatus: 'above' | 'below' | 'at'
}

type SummaryMetrics = {
  totalSpend: number
  totalConversions: number
  totalImpressions: number
  totalReach: number
  avgROAS: number
  avgCostPerConversion: number
  efficiency: number
  effectiveness: number
}

export default function Collection() {
  const [timeframe, setTimeframe] = useState({ start: '2024-01-01', end: '2024-12-31' })
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [summary, setSummary] = useState<SummaryMetrics | null>(null)
  const [sortBy, setSortBy] = useState<keyof Campaign>('impressions')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showAddCampaign, setShowAddCampaign] = useState(false)

  useEffect(() => {
    loadCollectionData()
  }, [timeframe])

  const loadCollectionData = async () => {
    try {
      // Simulate API calls for collection data
      const mockCampaigns: Campaign[] = [
        {
          id: 'camp-001',
          name: 'Q4 Holiday Campaign',
          placement: 'Premium Video',
          creative: 'Holiday_30s_v2',
          channel: 'YouTube',
          impressions: 2500000,
          reach: 850000,
          avgFrequency: 2.9,
          conversions: 12450,
          conversionPercent: 0.50,
          conversionRate: 0.0050,
          adSpend: 125000,
          roas: 4.2,
          costPerConversion: 10.04,
          benchmarkStatus: 'above'
        },
        {
          id: 'camp-002',
          name: 'Brand Awareness Spring',
          placement: 'Display Banner',
          creative: 'Spring_Display_300x250',
          channel: 'Facebook',
          impressions: 1800000,
          reach: 650000,
          avgFrequency: 2.8,
          conversions: 8900,
          conversionPercent: 0.49,
          conversionRate: 0.0049,
          adSpend: 89000,
          roas: 3.8,
          costPerConversion: 10.00,
          benchmarkStatus: 'at'
        },
        {
          id: 'camp-003',
          name: 'Product Launch Mobile',
          placement: 'Mobile Video',
          creative: 'Launch_Mobile_15s',
          channel: 'Instagram',
          impressions: 3200000,
          reach: 1200000,
          avgFrequency: 2.7,
          conversions: 15680,
          conversionPercent: 0.49,
          conversionRate: 0.0049,
          adSpend: 156800,
          roas: 5.1,
          costPerConversion: 10.00,
          benchmarkStatus: 'above'
        }
      ]

      setCampaigns(mockCampaigns)

      // Calculate summary metrics
      const totalSpend = mockCampaigns.reduce((sum, c) => sum + c.adSpend, 0)
      const totalConversions = mockCampaigns.reduce((sum, c) => sum + c.conversions, 0)
      const totalImpressions = mockCampaigns.reduce((sum, c) => sum + c.impressions, 0)
      const totalReach = mockCampaigns.reduce((sum, c) => sum + c.reach, 0)

      setSummary({
        totalSpend,
        totalConversions,
        totalImpressions,
        totalReach,
        avgROAS: mockCampaigns.reduce((sum, c) => sum + c.roas, 0) / mockCampaigns.length,
        avgCostPerConversion: totalSpend / totalConversions,
        efficiency: 85, // Simulated efficiency score
        effectiveness: 92 // Simulated effectiveness score
      })
    } catch (error) {
      console.error('Error loading collection data:', error)
    }
  }

  const handleSort = (column: keyof Campaign) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('desc')
    }
  }

  const sortedCampaigns = [...campaigns].sort((a, b) => {
    const aVal = a[sortBy]
    const bVal = b[sortBy]
    const modifier = sortOrder === 'asc' ? 1 : -1
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return aVal.localeCompare(bVal) * modifier
    }
    return ((aVal as number) - (bVal as number)) * modifier
  })

  const removeCampaign = (id: string) => {
    if (confirm('Are you sure you want to remove this campaign from your collection?')) {
      setCampaigns(campaigns.filter(c => c.id !== id))
    }
  }

  const getBenchmarkIcon = (status: 'above' | 'below' | 'at') => {
    switch (status) {
      case 'above':
        return <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
      case 'below':
        return <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>
      case 'at':
        return <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14"></path></svg>
    }
  }

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`
  const formatPercent = (value: number) => `${(value * 100).toFixed(2)}%`

  return (
    <div className="fade-in">
      <h1 className="section-title">My Collection</h1>

      {/* Timeframe Selection */}
      <div className="card mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div>
              <label htmlFor="start-date">Start Date</label>
              <input
                type="date"
                id="start-date"
                value={timeframe.start}
                onChange={(e) => setTimeframe({ ...timeframe, start: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="end-date">End Date</label>
              <input
                type="date"
                id="end-date"
                value={timeframe.end}
                onChange={(e) => setTimeframe({ ...timeframe, end: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>
          <button
            onClick={() => setShowAddCampaign(true)}
            className="btn-primary"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Add Campaign
          </button>
        </div>
      </div>

      {/* Summary Statistics */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Spend</h3>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalSpend)}</p>
            <p className="text-sm text-green-600 mt-1">↗ 12% vs last period</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Conversions</h3>
            <p className="text-2xl font-bold text-gray-900">{summary.totalConversions.toLocaleString()}</p>
            <p className="text-sm text-green-600 mt-1">↗ 8% vs last period</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Average ROAS</h3>
            <p className="text-2xl font-bold text-gray-900">{summary.avgROAS.toFixed(1)}:1</p>
            <p className="text-sm text-green-600 mt-1">↗ 5% vs last period</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Unique Reach</h3>
            <p className="text-2xl font-bold text-gray-900">{(summary.totalReach / 1000000).toFixed(1)}M</p>
            <p className="text-sm text-blue-600 mt-1">← Target audience</p>
          </div>
        </div>
      )}

      {/* Campaign Data Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Campaign Performance</h2>
          <div className="text-sm text-gray-500">
            {campaigns.length} campaigns • {timeframe.start} to {timeframe.end}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>
                  Campaign Name
                  <svg className="inline-block ml-1 w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('channel')}>
                  Channel
                  <svg className="inline-block ml-1 w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('impressions')}>
                  Impressions
                  <svg className="inline-block ml-1 w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('reach')}>
                  Reach
                  <svg className="inline-block ml-1 w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('conversions')}>
                  Conversions
                  <svg className="inline-block ml-1 w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('roas')}>
                  ROAS
                  <svg className="inline-block ml-1 w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('costPerConversion')}>
                  Cost/Conv
                  <svg className="inline-block ml-1 w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Benchmark
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedCampaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                      <div className="text-sm text-gray-500">{campaign.placement}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{campaign.channel}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{campaign.impressions.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{campaign.reach.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{campaign.conversions.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{campaign.roas.toFixed(1)}:1</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(campaign.costPerConversion)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      {getBenchmarkIcon(campaign.benchmarkStatus)}
                      <span className="text-xs text-gray-500">vs Innovid</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => removeCampaign(campaign.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Campaign Modal */}
      {showAddCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Campaign</h3>
            <p className="text-gray-600 mb-4">
              This would integrate with XP-Navigate service to fetch available campaigns.
            </p>
            <div className="flex space-x-3">
              <button className="btn-secondary flex-1" onClick={() => setShowAddCampaign(false)}>
                Cancel
              </button>
              <button className="btn-primary flex-1" onClick={() => setShowAddCampaign(false)}>
                Browse Campaigns
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
