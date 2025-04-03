import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../services/authService'
import { AuthContext } from '../context/AuthContext'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const navigate = useNavigate()
  const { setUser, setIsAuth } = useContext(AuthContext)
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      const userData = await loginUser({ email, password })
      setUser(userData)
      setIsAuth(true)
      navigate('/dashboard') // Redirect to dashboard after successful login
    } catch (err) {
      setError(err.msg || 'Failed to login. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to access your account</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="form-options">
            <div className="remember-me">
              <input 
                type="checkbox" 
                id="remember-me" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              <label htmlFor="remember-me">Remember me</label>
            </div>
            <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <div className="auth-divider">
          <span>OR</span>
        </div>
        
        <div className="social-auth">
          <button className="btn btn-outline btn-block" disabled={isLoading}>
            <span className="icon">G</span>
            Sign in with Google
          </button>
          <button className="btn btn-outline btn-block" disabled={isLoading}>
            <span className="icon">f</span>
            Sign in with Facebook
          </button>
        </div>
        
        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
        </div>
      </div>
      
      <div className="auth-info">
        <Link to="/" className="logo">StockTrader Pro</Link>
        <div className="auth-benefits">
          <h2>Why Choose StockTrader Pro?</h2>
          <ul>
            <li>Commission-free trading</li>
            <li>Real-time market data</li>
            <li>Advanced charting tools</li>
            <li>Portfolio analytics</li>
            <li>Secure and reliable platform</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Login