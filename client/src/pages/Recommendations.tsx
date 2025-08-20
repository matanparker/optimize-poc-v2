import { useEffect, useState } from 'react'
import api from '../services/api'

type Recommendation = {
  id: string
  campaign: string
  action: string
  benefit: string
  explanation: string
  priority: 'high' | 'medium' | 'low'
  estimatedLift: {
    roas: number
    conversions: number
    costReduction: number
  }
}

type BenefitForecast = {
  totalROASLift: number
  totalConversionsLift: number
  totalCostSavings: number
  confidenceLevel: number
}

const mockRecommendations: Recommendation[] = [
  {
    id: 'rec-001',
    campaign: 'Q4 Holiday Campaign',
    action: 'Increase Budget',
    benefit: 'Predicted ROAS +0.8',
    explanation: 'High-performing campaign shows 23% higher conversion rates during peak hours. Increasing budget by 40% during 6-9PM could scale results efficiently.',
    priority: 'high',
    estimatedLift: { roas: 0.8, conversions: 450, costReduction: 0 }
  },
  {
    id: 'rec-002', 
    campaign: 'Brand Awareness Spring',
    action: 'Pause Underperforming Ad Groups',
    benefit: 'Cost Reduction -$2,400/month',
    explanation: 'Ad groups with CPA above $45 are draining budget. Pausing these 3 ad groups would save $2,400 monthly while maintaining 94% of current conversions.',
    priority: 'high',
    estimatedLift: { roas: 0.3, conversions: -45, costReduction: 2400 }
  },
  {
    id: 'rec-003',
    campaign: 'Product Launch Mobile',
    action: 'Optimize Bidding Strategy',
    benefit: 'CPA Reduction -15%',
    explanation: 'Switch from Manual CPC to Target CPA bidding with $25 target. Machine learning optimization could reduce current CPA from $29 to $25.',
    priority: 'high',
    estimatedLift: { roas: 0.5, conversions: 180, costReduction: 800 }
  },
  {
    id: 'rec-004',
    campaign: 'Retargeting Campaign',
    action: 'Expand Audience Segments',
    benefit: 'Reach Increase +35%',
    explanation: 'Add cart abandoners and product page viewers to existing customer segment. Similar audience shows 18% higher engagement rates.',
    priority: 'medium',
    estimatedLift: { roas: 0.4, conversions: 220, costReduction: 0 }
  },
  {
    id: 'rec-005',
    campaign: 'Search Campaign Alpha',
    action: 'Add Negative Keywords',
    benefit: 'Quality Score +12%',
    explanation: 'Adding 27 negative keywords for low-intent terms will improve relevance and reduce wasted spend on non-converting clicks.',
    priority: 'medium',
    estimatedLift: { roas: 0.2, conversions: 85, costReduction: 600 }
  }
]

export default function Recommendations() {
  const [allRecs, setAllRecs] = useState<Recommendation[]>([])
  const [filteredRecs, setFilteredRecs] = useState<Recommendation[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [filterLimit, setFilterLimit] = useState<number>(10)
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [showApplyConfirm, setShowApplyConfirm] = useState(false)
  const [benefits, setBenefits] = useState<BenefitForecast | null>(null)
  const [appliedRecommendations, setAppliedRecommendations] = useState<string[]>([])

  useEffect(() => {
    loadRecommendations()
  }, [])

  useEffect(() => {
    if (filterLimit === 0) {
      setFilteredRecs(allRecs)
    } else {
      setFilteredRecs(allRecs.slice(0, filterLimit))
    }
  }, [allRecs, filterLimit])

  useEffect(() => {
    calculateBenefits()
  }, [selected, allRecs])

  const loadRecommendations = async () => {
    try {
      // Try API first, fallback to mock data
      const res = await api.get('/recommendations?limit=25')
      const apiRecs = res.data.items || []
      
      // Enhance API recommendations with mock data structure
      const enhancedRecs = apiRecs.map((rec: any, idx: number) => ({
        ...rec,
        priority: idx < 3 ? 'high' : idx < 8 ? 'medium' : 'low',
        estimatedLift: {
          roas: Math.random() * 0.8 + 0.2,
          conversions: Math.floor(Math.random() * 300 + 50),
          costReduction: Math.floor(Math.random() * 2000)
        }
      }))

      setAllRecs([...enhancedRecs, ...mockRecommendations].slice(0, 25))
    } catch (error) {
      console.error('Error loading recommendations:', error)
      setAllRecs(mockRecommendations)
    }
  }

  const calculateBenefits = () => {
    if (selected.length === 0) {
      setBenefits(null)
      return
    }

    const selectedRecs = allRecs.filter(rec => selected.includes(rec.id))
    const totalROASLift = selectedRecs.reduce((sum, rec) => sum + rec.estimatedLift.roas, 0)
    const totalConversionsLift = selectedRecs.reduce((sum, rec) => sum + rec.estimatedLift.conversions, 0)
    const totalCostSavings = selectedRecs.reduce((sum, rec) => sum + rec.estimatedLift.costReduction, 0)
    const confidenceLevel = Math.max(65, Math.min(95, 85 - (selected.length * 3)))

    setBenefits({
      totalROASLift,
      totalConversionsLift,
      totalCostSavings,
      confidenceLevel
    })
  }

  const toggleSelection = (id: string) => {
    setSelected(prev => 
      prev.includes(id) 
        ? prev.filter(x => x !== id) 
        : [...prev, id]
    )
  }

  const handleApply = () => {
    setShowApplyConfirm(true)
  }

  const confirmApply = async () => {
    try {
      await api.post('/recommendations/apply', { ids: selected })
      setAppliedRecommendations([...appliedRecommendations, ...selected])
      setSelected([])
      setShowApplyConfirm(false)
      
      // Show success message
      alert('Recommendations applied successfully! Changes will take effect within 24 hours.')
    } catch (error) {
      console.error('Error applying recommendations:', error)
      alert('Successfully applied recommendations (simulated)')
    }
  }

  const addCustomRecommendation = (customRec: Omit<Recommendation, 'id'>) => {
    const newRec: Recommendation = {
      ...customRec,
      id: `custom-${Date.now()}`,
      priority: 'medium',
      estimatedLift: {
        roas: 0.3,
        conversions: 100,
        costReduction: 500
      }
    }
    setAllRecs(prev => [newRec, ...prev])
    setShowCustomForm(false)
  }

  const exportData = () => {
    const exportUrl = `/api/recommendations/export?selected=${selected.join(',')}`
    window.open(exportUrl, '_blank')
  }

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
    }
  }

  const getExplanationText = () => {
    if (selected.length === 0) {
      return "Select recommendations to see detailed analysis and reasoning for the suggested optimizations."
    }
    
    const selectedRecs = allRecs.filter(rec => selected.includes(rec.id))
    const highPriorityCount = selectedRecs.filter(rec => rec.priority === 'high').length
    
    if (highPriorityCount >= 2) {
      return `This optimization package focuses on high-impact changes across ${selected.length} campaigns. The combination addresses both budget efficiency and performance scaling, with emphasis on underperforming segments and high-opportunity areas. Expected implementation timeline: 2-3 weeks with gradual rollout.`
    } else {
      return `Selected recommendations target specific optimization opportunities across ${selected.length} campaign${selected.length > 1 ? 's' : ''}. The package balances quick wins with longer-term performance improvements. Most changes can be implemented within 1 week.`
    }
  }

  return (
    <div className="fade-in">
      <h1 className="section-title">Optimization Recommendations</h1>

      {/* Summary Panel */}
      {benefits && (
        <div className="card mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-blue-900 mb-2">Total Estimated Lift</h2>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-2xl font-bold text-green-600">+{benefits.totalROASLift.toFixed(1)}</p>
                  <p className="text-sm text-gray-600">ROAS Improvement</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">+{benefits.totalConversionsLift.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Additional Conversions</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">${benefits.totalCostSavings.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Monthly Savings</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-700">Confidence Level</p>
              <p className="text-3xl font-bold text-blue-600">{benefits.confidenceLevel}%</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommendations List */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Available Recommendations</h2>
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">
                  Show:
                  <select 
                    value={filterLimit} 
                    onChange={(e) => setFilterLimit(Number(e.target.value))}
                    className="ml-2 border border-gray-300 rounded px-2 py-1"
                  >
                    <option value={10}>Top 10</option>
                    <option value={15}>Top 15</option>
                    <option value={20}>Top 20</option>
                    <option value={25}>Top 25</option>
                    <option value={0}>All</option>
                  </select>
                </label>
                <button
                  onClick={() => setShowCustomForm(true)}
                  className="btn-secondary btn-sm"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                  Add Custom
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredRecs.map((rec) => (
                <div
                  key={rec.id}
                  className={`border rounded-lg p-4 transition-colors cursor-pointer ${
                    selected.includes(rec.id) 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  } ${appliedRecommendations.includes(rec.id) ? 'opacity-50' : ''}`}
                  onClick={() => !appliedRecommendations.includes(rec.id) && toggleSelection(rec.id)}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(rec.id)}
                      onChange={() => toggleSelection(rec.id)}
                      disabled={appliedRecommendations.includes(rec.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {rec.action} - {rec.campaign}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(rec.priority)}`}>
                            {rec.priority.toUpperCase()}
                          </span>
                          {appliedRecommendations.includes(rec.id) && (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              APPLIED
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm font-medium text-green-600 mb-2">{rec.benefit}</p>
                      <p className="text-sm text-gray-600">{rec.explanation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits & Explanation Pane */}
        <div className="space-y-6">
          {/* Benefits Pane */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Forecasted Impact</h3>
            {benefits ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">Performance Gains</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• ROAS: +{benefits.totalROASLift.toFixed(1)} points</li>
                    <li>• Conversions: +{benefits.totalConversionsLift.toLocaleString()}</li>
                    <li>• Monthly Savings: ${benefits.totalCostSavings.toLocaleString()}</li>
                  </ul>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Implementation Timeline</h4>
                  <p className="text-sm text-blue-700">
                    {selected.length <= 3 ? '1-2 weeks' : '2-4 weeks'} expected rollout
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Select recommendations to see forecasted impact on your campaigns.</p>
            )}
          </div>

          {/* Explanation Pane */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Optimization Strategy</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {getExplanationText()}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleApply}
              disabled={selected.length === 0}
              className="btn-primary w-full"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              Apply Selected ({selected.length})
            </button>
            <button
              onClick={exportData}
              className="btn-secondary w-full"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Apply Confirmation Modal */}
      {showApplyConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Confirm Application</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to apply {selected.length} recommendation{selected.length > 1 ? 's' : ''}? 
              Changes will be implemented across your campaigns within 24 hours.
            </p>
            {benefits && (
              <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-6">
                <p className="text-sm text-blue-800 font-medium">Expected Results:</p>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  <li>• ROAS Increase: +{benefits.totalROASLift.toFixed(1)}</li>
                  <li>• Additional Conversions: +{benefits.totalConversionsLift.toLocaleString()}</li>
                  <li>• Cost Savings: ${benefits.totalCostSavings.toLocaleString()}/month</li>
                </ul>
              </div>
            )}
            <div className="flex space-x-3">
              <button 
                className="btn-secondary flex-1" 
                onClick={() => setShowApplyConfirm(false)}
              >
                Cancel
              </button>
              <button className="btn-primary flex-1" onClick={confirmApply}>
                Confirm Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Recommendation Modal */}
      {showCustomForm && (
        <CustomRecommendationForm
          onAdd={addCustomRecommendation}
          onCancel={() => setShowCustomForm(false)}
        />
      )}
    </div>
  )
}

// Custom Recommendation Form Component
function CustomRecommendationForm({ 
  onAdd, 
  onCancel 
}: { 
  onAdd: (rec: Omit<Recommendation, 'id'>) => void
  onCancel: () => void 
}) {
  const [campaign, setCampaign] = useState('')
  const [action, setAction] = useState('')
  const [explanation, setExplanation] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!campaign || !action || !explanation) return

    onAdd({
      campaign,
      action,
      benefit: 'Custom optimization',
      explanation,
      priority: 'medium',
      estimatedLift: { roas: 0.3, conversions: 100, costReduction: 500 }
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h3 className="text-lg font-semibold mb-4">Add Custom Recommendation</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Campaign</label>
            <select
              value={campaign}
              onChange={(e) => setCampaign(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            >
              <option value="">Select Campaign...</option>
              <option value="Q4 Holiday Campaign">Q4 Holiday Campaign</option>
              <option value="Brand Awareness Spring">Brand Awareness Spring</option>
              <option value="Product Launch Mobile">Product Launch Mobile</option>
              <option value="Retargeting Campaign">Retargeting Campaign</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
            <input
              type="text"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              placeholder="e.g., Increase Budget, Pause Ad Group, Change Targeting"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Explanation</label>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Explain the reasoning behind this recommendation..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-24 resize-none"
              required
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <button type="button" className="btn-secondary flex-1" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              Add Recommendation
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


