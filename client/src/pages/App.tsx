import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'

export default function App() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isActive = (path: string) => pathname === path

  return (
    <div className="flex min-h-screen text-gray-800">
      {/* Sidebar */}
      <aside className="sidebar w-64 flex-shrink-0 text-white p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-8">
            <img src="https://placehold.co/24x24/4A90E2/FFFFFF?text=XP" alt="Innovid XP Logo" className="rounded-full" />
            <span className="text-lg font-semibold">XP-Optimise</span>
          </div>
          <nav>
            <ul>
              <li className="mb-2">
                <Link to="/collection" className={`flex items-center space-x-3 p-2 rounded-lg transition-colors duration-200 ${isActive('/collection') ? 'bg-blue-700 text-white' : 'hover:bg-blue-600'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m7 0V5a2 2 0 012-2h4a2 2 0 012 2v6"></path></svg>
                  <span>My Collection</span>
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/" className={`flex items-center space-x-3 p-2 rounded-lg transition-colors duration-200 ${isActive('/') ? 'bg-blue-700 text-white' : 'hover:bg-blue-600'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m0 0l-7 7m7-7v10a1 1 0 00-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                  <span>Dashboard</span>
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/research" className={`flex items-center space-x-3 p-2 rounded-lg transition-colors duration-200 ${isActive('/research') ? 'bg-blue-700 text-white' : 'hover:bg-blue-600'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span>Research</span>
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/recommendations" className={`flex items-center space-x-3 p-2 rounded-lg transition-colors duration-200 ${isActive('/recommendations') ? 'bg-blue-700 text-white' : 'hover:bg-blue-600'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  <span>Recommendations</span>
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/settings" className={`flex items-center space-x-3 p-2 rounded-lg transition-colors duration-200 ${isActive('/settings') ? 'bg-blue-700 text-white' : 'hover:bg-blue-600'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  <span>Settings</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 cursor-pointer">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          <span>Sign Out</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="header p-4 flex justify-between items-center text-gray-700 shadow-sm">
          <div className="flex items-center space-x-4">
            <img src="https://placehold.co/32x32/4A90E2/FFFFFF?text=XP" alt="Innovid XP Logo" className="rounded-full" />
            <span className="text-lg font-semibold text-gray-900">XP-Optimise</span>
            <div className="h-6 w-px bg-gray-300 mx-4"></div>
            <span className="text-sm font-medium">
              {pathname === '/' ? 'Dashboard' : 
               pathname === '/collection' ? 'My Collection' :
               pathname === '/research' ? 'Research' :
               pathname === '/recommendations' ? 'Recommendations' :
               pathname === '/settings' ? 'Settings' : 'Dashboard'}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => window.open('https://help.innovid.com', '_blank')}
              className="btn-secondary btn-sm flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span>Get Help</span>
            </button>
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/settings')}>
              <img src="https://placehold.co/32x32/4A90E2/FFFFFF?text=JD" alt="User Avatar" className="rounded-full" />
              <div className="text-right">
                <div className="font-medium text-sm">John Doe</div>
                <div className="text-xs text-gray-500">Account Settings</div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="main-content flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}


