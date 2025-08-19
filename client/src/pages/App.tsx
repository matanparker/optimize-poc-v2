import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function App() {
  const navigate = useNavigate()
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) navigate('/login')
  }, [navigate])

  const { pathname } = useLocation()
  const isActive = (path: string) => pathname === path

  return (
    <div className="flex min-h-screen text-gray-800">
      {/* Sidebar */}
      <aside className="sidebar w-64 flex-shrink-0 text-white p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-8">
            <img src="https://placehold.co/24x24/4A90E2/FFFFFF?text=I" alt="Innovid Logo" className="rounded-full" />
            <span className="text-lg font-semibold">Innovid Campaign Manager</span>
          </div>
          <nav>
            <ul>
              <li className="mb-2">
                <Link to="/" className={`flex items-center space-x-3 p-2 rounded-lg transition-colors duration-200 ${isActive('/') ? 'bg-blue-700 text-white' : 'hover:bg-blue-600'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m0 0l-7 7m7-7v10a1 1 0 00-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                  <span>Campaign Dashboard</span>
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/research" className={`flex items-center space-x-3 p-2 rounded-lg transition-colors duration-200 ${isActive('/research') ? 'bg-blue-700 text-white' : 'hover:bg-blue-600'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v14M9 19h12M9 19c-.552 0-1 .448-1 1s.448 1 1 1 1-.448 1-1-.448-1-1-1z"></path></svg>
                  <span>Research</span>
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/recommendations" className={`flex items-center space-x-3 p-2 rounded-lg transition-colors duration-200 ${isActive('/recommendations') ? 'bg-blue-700 text-white' : 'hover:bg-blue-600'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m7 0V5a2 2 0 012-2h4a2 2 0 012 2v6"></path></svg>
                  <span>Recommendations</span>
                </Link>
              </li>
              <li className="mb-2">
                <a href="#" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-blue-600 transition-colors duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343V4a2 2 0 012-2h4a2 2 0 012 2v6.343"></path></svg>
                  <span>Creative Strategies</span>
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-blue-600 transition-colors duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 2v-6m2 0H7m2 0a2 2 0 110-4 2 2 0 010 4zm6 0a2 2 0 110-4 2 2 0 010 4zm2 0a2 2 0 110-4 2 2 0 010 4z"></path></svg>
                  <span>Event Tags</span>
                </a>
              </li>
              <li className="mb-2">
                <Link to="/settings" className={`flex items-center space-x-3 p-2 rounded-lg transition-colors duration-200 ${isActive('/settings') ? 'bg-blue-700 text-white' : 'hover:bg-blue-600'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  <span>Campaign Settings</span>
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
            <span className="text-sm font-medium">Campaign Dashboard</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            <span className="text-sm font-medium">Blockrock 03, 2025_National_GI - Media</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            <span className="text-sm font-medium text-gray-500">Media</span>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <svg className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m0 0l-7 7m7-7v10a1 1 0 00-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
              <svg className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m7 0V5a2 2 0 012-2h4a2 2 0 012 2v6"></path></svg>
              <svg className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            </div>
            <span className="text-sm text-gray-500">04/24/2019 - 13:31:00</span>
            <div className="flex items-center space-x-2">
              <img src="https://placehold.co/32x32/FFD700/FFFFFF?text=JD" alt="User Avatar" className="rounded-full" />
              <span className="font-medium text-sm">John Doe</span>
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


