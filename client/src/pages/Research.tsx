import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

type Message = {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

type FAQItem = {
  question: string
  answer: string
  followups?: string[]
}

const faqDatabase: FAQItem[] = [
  {
    question: "What are the top factors driving the highest conversion rates?",
    answer: "Based on your campaign data analysis, the top factors driving conversion rates are: 1) Ad placement timing (peak hours show 35% higher conversions), 2) Creative format (video ads outperform display by 28%), 3) Audience targeting precision (lookalike audiences convert 42% better), and 4) Landing page optimization (mobile-optimized pages show 31% improvement).",
    followups: ["How can I optimize my ad scheduling?", "What video formats work best?", "Tell me more about audience targeting"]
  },
  {
    question: "How can I reduce my Cost Per Conversion for Campaign Alpha?",
    answer: "For Campaign Alpha specifically, I recommend: 1) Pause underperforming ad groups with CPC above $12 (saves ~$8,000/month), 2) Increase budget for high-performing mobile placements (+23% efficiency), 3) Implement dayparting to focus on 6-9PM timeframe, and 4) Test new creative variants with stronger CTAs. Expected CPA reduction: 18-25%.",
    followups: ["Show me the underperforming ad groups", "What creative elements should I test?", "How do I set up dayparting?"]
  },
  {
    question: "What channels are underperforming this month?",
    answer: "This month's underperforming channels: 1) Display network shows 31% below target ROAS, 2) Pinterest campaigns have 45% higher CPA than benchmark, 3) LinkedIn ads show declining CTR (-12% vs last month). However, YouTube and Facebook are exceeding targets by 18% and 23% respectively.",
    followups: ["Should I pause the underperforming channels?", "How can I improve display performance?", "What's working well on YouTube?"]
  },
  {
    question: "Provide a summary of Campaign Gamma's performance over the last 30 days.",
    answer: "Campaign Gamma 30-day performance: Total spend $45,230 (8% under budget), 2.3M impressions, 445K unique reach, 1,245 conversions at $36.31 CPA. Key highlights: Mobile performance up 28%, weekend conversion rates 41% higher, creative A outperforming B by 52%. Recommendations: Increase mobile budget allocation and expand weekend targeting.",
    followups: ["How can I optimize for mobile?", "Tell me more about creative performance", "Should I increase the weekend budget?"]
  }
]

const preCannedQuestions = [
  "What are the top factors driving the highest conversion rates?",
  "How can I reduce my Cost Per Conversion for Campaign Alpha?", 
  "What channels are underperforming this month?",
  "Provide a summary of Campaign Gamma's performance over the last 30 days.",
  "Which audiences are performing best across all campaigns?",
  "What time of day shows highest conversion rates?",
  "How does my performance compare to industry benchmarks?",
  "What creative elements are driving the most engagement?"
]

export default function Research() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI Research Assistant. I can help you analyze campaign performance, identify optimization opportunities, and answer questions about your advertising data. What would you like to explore today?",
      timestamp: new Date()
    }
  ])
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [typingDots, setTypingDots] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setTypingDots(prev => {
          if (prev === '...') return ''
          return prev + '.'
        })
      }, 500)
      return () => clearInterval(interval)
    }
  }, [loading])

  const handleSubmit = async (question: string) => {
    if (!question.trim() || loading) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: question,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setCurrentQuestion('')
    setLoading(true)

    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    try {
      // Try to find FAQ answer first
      const faqItem = faqDatabase.find(item => 
        item.question.toLowerCase().includes(question.toLowerCase()) ||
        question.toLowerCase().includes(item.question.toLowerCase().split(' ').slice(0, 3).join(' '))
      )

      let aiResponse = ''
      if (faqItem) {
        aiResponse = faqItem.answer
      } else {
        // Fallback to API
        const res = await api.post('/chat', { message: question })
        aiResponse = res.data.answer || "I don't have specific data on that topic, but I'd be happy to help you explore your campaign performance in other ways. Try asking about conversion rates, cost optimization, or channel performance."
      }

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])

      // Add follow-up options if available
      if (faqItem?.followups) {
        setTimeout(() => {
          const followupMessage: Message = {
            id: (Date.now() + 2).toString(),
            type: 'ai', 
            content: "Would you like me to elaborate on any of these areas?",
            timestamp: new Date()
          }
          setMessages(prev => [...prev, followupMessage])
        }, 1000)
      }

    } catch (error) {
      console.error('Error getting response:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I apologize, but I'm having trouble processing your request right now. Please try again or select one of the suggested questions.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    }

    setLoading(false)
  }

  const handlePreCannedQuestion = (question: string) => {
    setCurrentQuestion(question)
    handleSubmit(question)
  }

  const showRecommendationsCTA = () => {
    const ctaMessage: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content: "Based on our conversation, I can generate specific optimization recommendations for your campaigns. Would you like to see personalized recommendations?",
      timestamp: new Date()
    }
    setMessages(prev => [...prev, ctaMessage])
  }

  return (
    <div className="fade-in h-full flex flex-col">
      <h1 className="section-title">AI Research Assistant</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Question Pane */}
        <div className="lg:col-span-1">
          <div className="card h-full">
            <h3 className="text-lg font-semibold mb-4">Ask a Question</h3>
            
            <div className="mb-6">
              <textarea
                value={currentQuestion}
                onChange={(e) => setCurrentQuestion(e.target.value)}
                placeholder="Type your question here..."
                className="w-full h-24 resize-none"
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSubmit(currentQuestion))}
              />
              <button
                onClick={() => handleSubmit(currentQuestion)}
                disabled={loading || !currentQuestion.trim()}
                className="btn-primary w-full mt-2"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                {loading ? 'Processing...' : 'Ask Question'}
              </button>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Popular Questions</h4>
              <div className="space-y-2">
                {preCannedQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePreCannedQuestion(question)}
                    className="text-left text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded w-full transition-colors"
                    disabled={loading}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <button
                onClick={showRecommendationsCTA}
                className="btn-secondary w-full"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                Get Recommendations
              </button>
            </div>
          </div>
        </div>

        {/* Results Pane */}
        <div className="lg:col-span-2">
          <div className="card h-full flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Conversation</h3>
            
            <div className="flex-1 overflow-y-auto bg-gray-50 rounded-lg p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-800 border'
                  }`}>
                    {message.type === 'ai' && (
                      <div className="flex items-center mb-2">
                        <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                        <span className="text-xs text-gray-500">AI Assistant</span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    {message.type === 'ai' && message.content.includes('recommendations') && (
                      <button
                        onClick={() => navigate('/recommendations')}
                        className="mt-3 text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
                      >
                        View Recommendations →
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                      <span className="text-xs text-gray-500 mr-2">AI Assistant</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Analyzing your data{typingDots}
                    </p>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


