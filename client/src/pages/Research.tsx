import { useState } from 'react'
import api from '../services/api'

export default function Research() {
  const [q, setQ] = useState('What are the top factors driving the highest conversion rates?')
  const [loading, setLoading] = useState(false)
  const [answer, setAnswer] = useState('')
  const [source, setSource] = useState('')

  const ask = async () => {
    setLoading(true)
    setAnswer('')
    const res = await api.post('/chat', { message: q })
    setAnswer(res.data.answer)
    setSource(res.data.source)
    setLoading(false)
  }

  return (
    <div className="card fade-in" style={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
      <h3 className="section-title"><i className="fa-solid fa-comment-dots"></i>Research Assistant</h3>
      
      <div style={{ 
        flexGrow: 1, 
        background: '#f9fafb', 
        padding: '16px', 
        borderRadius: '12px', 
        overflowY: 'auto', 
        marginBottom: '16px', 
        border: '1px solid #e5e7eb' 
      }}>
        <div style={{ marginBottom: '16px' }}>
          <p style={{ 
            background: '#eef2ff', 
            color: '#3730a3', 
            padding: '12px', 
            borderRadius: '12px', 
            borderBottomLeftRadius: '4px', 
            display: 'inline-block', 
            maxWidth: '80%' 
          }}>
            Hello! How can I assist you with your campaign performance today?
          </p>
        </div>
        {answer && (
          <div style={{ marginBottom: '16px' }}>
            <p style={{ 
              background: '#dbeafe', 
              color: '#1e40af', 
              padding: '12px', 
              borderRadius: '12px', 
              borderBottomRightRadius: '4px', 
              display: 'inline-block', 
              maxWidth: '80%',
              marginLeft: 'auto',
              textAlign: 'right'
            }}>
              {q}
            </p>
          </div>
        )}
        {answer && (
          <div style={{ marginBottom: '16px' }}>
            <p style={{ 
              background: '#eef2ff', 
              color: '#3730a3', 
              padding: '12px', 
              borderRadius: '12px', 
              borderBottomLeftRadius: '4px', 
              display: 'inline-block', 
              maxWidth: '80%' 
            }}>
              {answer}
            </p>
          </div>
        )}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="loader"></div>
            <span style={{ color: '#6b7280' }}>AI is typing...</span>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="pre-canned-questions">Or select a pre-canned question:</label>
        <select 
          id="pre-canned-questions" 
          style={{ width: '100%' }}
          onChange={(e) => {
            if (e.target.value) {
              setQ(e.target.value);
              e.target.value = '';
            }
          }}
        >
          <option value="">Choose a question...</option>
          <option value="What are the top factors driving the highest conversion rates?">What are the top factors driving the highest conversion rates?</option>
          <option value="How can I reduce my Cost Per Conversion for Campaign Alpha?">How can I reduce my Cost Per Conversion for Campaign Alpha?</option>
          <option value="What channels are underperforming this month?">What channels are underperforming this month?</option>
          <option value="Provide a summary of Campaign Gamma's performance over the last 30 days.">Provide a summary of Campaign Gamma's performance over the last 30 days.</option>
        </select>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <input 
          type="text" 
          style={{ flexGrow: 1 }} 
          value={q} 
          onChange={e => setQ(e.target.value)} 
          placeholder="Ask a question..."
          onKeyPress={(e) => e.key === 'Enter' && ask()}
        />
        <button className="btn-primary" onClick={ask} disabled={loading} style={{ padding: '12px', width: '25%' }}>
          <i className="fa-solid fa-paper-plane" style={{ marginRight: '8px' }}></i>
          {loading ? 'Typing…' : 'Send'}
        </button>
      </div>
    </div>
  )
}


