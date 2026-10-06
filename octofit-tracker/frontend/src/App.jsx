import { Link, NavLink, Route, Routes } from 'react-router-dom'
import octofitLogo from '../../../docs/octofitapp-small.png'
import Activities from './components/Activities'
import Leaderboard from './components/Leaderboard'
import Teams from './components/Teams'
import Users from './components/Users'
import Workouts from './components/Workouts'

const navItems = [
  { label: 'Users', to: '/users' },
  { label: 'Teams', to: '/teams' },
  { label: 'Activities', to: '/activities' },
  { label: 'Leaderboard', to: '/leaderboard' },
  { label: 'Workouts', to: '/workouts' },
]

function App() {
  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-expand-lg navbar-dark bg-success">
        <div className="container">
          <Link className="navbar-brand fw-semibold" to="/users">
            <img
              src={octofitLogo}
              alt="OctoFit Tracker"
              width="32"
              height="32"
              className="me-2 rounded"
            />
            OctoFit Tracker
          </Link>

          <div className="navbar-nav ms-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Users />} />
          <Route path="/users" element={<Users />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="*" element={<p className="alert alert-warning">Page not found.</p>} />
        </Routes>
      </main>
    </div>
  )
}

export default App
