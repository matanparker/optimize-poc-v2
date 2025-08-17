import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function App() {
  const navigate = useNavigate()
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) navigate('/login')
  }, [navigate])

  const { pathname } = useLocation()
  const isActive = (path: string) => (pathname === path ? 'menu-item active' : 'menu-item')

  return (
    <div className="container">
      <header className="glass-header" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontWeight: 800, justifySelf: 'start' }}>
          <i className="fa-solid fa-wand-magic-sparkles" style={{ color: 'var(--primary-color)', marginRight: 8 }}></i>
          OptimizeDemo™
        </h2>
        
        <nav className="nav" style={{ justifySelf: 'center' }}>
          <Link to="/" className={isActive('/')}>Summary</Link>
          <Link to="/research" className={isActive('/research')}>Research</Link>
          <Link to="/recommendations" className={isActive('/recommendations')}>Recommendations</Link>
          <Link to="/settings" className={isActive('/settings')}>Settings</Link>
        </nav>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifySelf: 'end' }}>
          <span className="btn-primary" style={{ padding: '6px 10px', fontSize: 12 }}>
            <i className="fa-solid fa-circle" style={{ marginRight: 6 }}></i>Active
          </span>
          <img src="https://i.pravatar.cc/40?u=demoUser" alt="User Avatar" style={{ width: 40, height: 40, borderRadius: '9999px', border: '2px solid #c7d2fe' }} />
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}


