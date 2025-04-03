import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import Navbar from '../components/Navbar'

function Account() {
  const { user } = useContext(AuthContext)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || ''
      })
    }
  }, [user])
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)
    
    try {
      // In a real app, make API call to update user profile
      // await updateProfile(formData)
      setMessage('Profile updated successfully')
    } catch (err) {
      setError(err.msg || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordErrors, setPasswordErrors] = useState({})
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
  }
  
  const validatePasswordForm = () => {
    const errors = {}
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required'
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required'
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters'
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }
    
    setPasswordErrors(errors)
    return Object.keys(errors).length === 0
  }
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    
    if (validatePasswordForm()) {
      setLoading(true)
      setError(null)
      setMessage(null)
      
      try {
        // In a real app, make API call to change password
        // await changePassword({
        //   currentPassword: passwordData.currentPassword,
        //   newPassword: passwordData.newPassword
        // })
        setMessage('Password changed successfully')
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } catch (err) {
        setError(err.msg || 'Failed to change password')
      } finally {
        setLoading(false)
      }
    }
  }
  
  return (
    <div className="account-container">
      <Navbar />
      
      <div className="account-content">
        <div className="account-header">
          <h1>My Account</h1>
        </div>
        
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        
        <div className="account-sections">
          <div className="account-section">
            <h2>Profile Information</h2>
            <form onSubmit={handleSubmit} className="account-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    name="firstName"
                    value={formData.firstName} 
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    name="lastName"
                    value={formData.lastName} 
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  value={formData.email} 
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
          
          <div className="account-section">
            <h2>Change Password</h2>
            <form onSubmit={handlePasswordSubmit} className="account-form">
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input 
                  type="password" 
                  id="currentPassword" 
                  name="currentPassword"
                  value={passwordData.currentPassword} 
                  onChange={handlePasswordChange}
                  disabled={loading}
                />
                {passwordErrors.currentPassword && <div className="error-message">{passwordErrors.currentPassword}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input 
                  type="password" 
                  id="newPassword" 
                  name="newPassword"
                  value={passwordData.newPassword} 
                  onChange={handlePasswordChange}
                  disabled={loading}
                />
                {passwordErrors.newPassword && <div className="error-message">{passwordErrors.newPassword}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  name="confirmPassword"
                  value={passwordData.confirmPassword} 
                  onChange={handlePasswordChange}
                  disabled={loading}
                />
                {passwordErrors.confirmPassword && <div className="error-message">{passwordErrors.confirmPassword}</div>}
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Changing Password...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Account