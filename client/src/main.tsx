import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './pages/App'
import './styles.css'
import Dashboard from './pages/Dashboard'
import Research from './pages/Research'
import Recommendations from './pages/Recommendations'
import Settings from './pages/Settings'
import Login from './pages/Login'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'research', element: <Research /> },
      { path: 'recommendations', element: <Recommendations /> },
      { path: 'settings', element: <Settings /> }
    ]
  },
  { path: '/login', element: <Login /> }
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)


