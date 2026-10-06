import { Link, Route, Routes } from 'react-router-dom'
import octofitLogo from '../../../docs/octofitapp-small.png'

function App() {
  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-dark bg-success">
        <div className="container">
          <Link className="navbar-brand fw-semibold" to="/">
            <img
              src={octofitLogo}
              alt=""
              width="32"
              height="32"
              className="me-2 rounded"
            />
            OctoFit Tracker
          </Link>
        </div>
      </nav>
      <main className="container py-5">
        <Routes>
          <Route
            path="/"
            element={
              <section className="p-4 p-md-5 bg-white rounded shadow-sm">
                <h1 className="display-5 fw-bold">Welcome to OctoFit Tracker</h1>
                <p className="lead mb-0">
                  Your fitness tracking app is ready to build.
                </p>
              </section>
            }
          />
          <Route
            path="*"
            element={<p className="alert alert-warning">Page not found.</p>}
          />
        </Routes>
      </main>
    </div>
  )
}

export default App
