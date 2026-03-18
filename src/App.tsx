import { Routes, Route, Link } from 'react-router-dom'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Home from './pages/Home'

function App() {
  return (
    <div>
      <nav style={{ padding: '1rem 2rem', borderBottom: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/">Home</Link>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <Link to="/signin">Sign In</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
      </nav>

      <div style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
