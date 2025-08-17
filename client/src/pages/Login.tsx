import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Login() {
  const [username, setUsername] = useState('demo')
  const [password, setPassword] = useState('demo')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const res = await api.post('/login', { username, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('name', res.data.name)
      localStorage.setItem('email', res.data.email)
      navigate('/')
    } catch (err) {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="fade-in" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: '28rem', padding: '32px' }}>
        <h2 style={{ fontSize: '30px', fontWeight: 'bold', textAlign: 'center', marginBottom: '24px', color: '#1f2937' }}>
          <i className="fa-solid fa-lock" style={{ color: 'var(--primary-color)', marginRight: '8px' }}></i>
          XP-Optimise Login
        </h2>
        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              placeholder="Enter your username" 
              required 
            />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="Enter your password" 
              required 
            />
          </div>
          <button className="btn-primary" type="submit" style={{ width: '100%', padding: '12px' }}>
            <i className="fa-solid fa-right-to-bracket" style={{ marginRight: '8px' }}></i>Login
          </button>
          {error && <p style={{ color: '#ef4444', textAlign: 'center', marginTop: '16px' }}>Invalid credentials. Please try again.</p>}
        </form>
      </div>
    </div>
  )
}


