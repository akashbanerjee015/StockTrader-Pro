import { useState, useEffect, useRef, useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Search, Menu, X, User, LogOut, Settings, Home } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { searchStocks } from '../services/stockService' // Import the searchStocks function

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([]) // State for search results
  const [isSearching, setIsSearching] = useState(false) // State for loading indicator
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const navbarRef = useRef(null)
  const sidebarRef = useRef(null)
  const dropdownRef = useRef(null)
  
  const { user, isAuth, logout } = useContext(AuthContext)
  
  const handleSearch = async (e) => {
    e.preventDefault()
    if (searchQuery.trim() === '') return

    setIsSearching(true)
    try {
      const results = await searchStocks(searchQuery) // Fetch search results
      setSearchResults(results)
    } catch (err) {
      console.error('Error searching stocks:', err)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearchResultClick = (stock) => {
    setSearchQuery('')
    setSearchResults([])
    navigate(`/stocks/${stock.symbol}`) // Navigate to stock details page
  }

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu)
    
    // When opening mobile menu, prevent body scroll
    if (!showMobileMenu) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }
  
  const handleLogout = () => {
    logout();
    navigate('/');
  }
  
  // Close mobile menu when location changes
  useEffect(() => {
    setShowMobileMenu(false)
    document.body.style.overflow = 'auto'
  }, [location.pathname])
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  // Handle click outside sidebar to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only close if menu is open and click is outside the sidebar and not on the toggle button
      if (
        showMobileMenu && 
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest('.navbar-menu-toggle')
      ) {
        setShowMobileMenu(false)
        document.body.style.overflow = 'auto'
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMobileMenu])

  // Handle scroll offset for anchor links
  const handleAnchorClick = (event, target) => {
    if (location.pathname === '/') {
      event.preventDefault()
      
      // Get navbar height to offset scroll position
      const navbarHeight = document.querySelector('.app-navbar')?.offsetHeight || 0
      
      // Find the target element
      const element = document.getElementById(target)
      if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
        const offsetPosition = elementPosition - navbarHeight - 20 // Extra 20px for spacing
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
      
      // Close mobile menu after clicking
      setShowMobileMenu(false)
      document.body.style.overflow = 'auto'
    }
  }

  // Handle dropdown toggle
  const toggleUserDropdown = (e) => {
    e.stopPropagation() // Prevent event from bubbling up
    setShowUserDropdown(!showUserDropdown)
  }

  // Handle dropdown link clicks
  const handleDropdownLinkClick = () => {
    setShowUserDropdown(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  
  return (
    <nav className={`app-navbar ${showMobileMenu ? 'menu-mobile-active' : ''}`} ref={navbarRef}>
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to={isAuth ? "/dashboard" : "/"} className="logo">StockTrader Pro</Link>
        </div>
        
        {isAuth && (
          <div className={`navbar-search ${showMobileMenu ? 'active' : ''}`}>
            <form onSubmit={handleSearch}>
              <input 
                type="text" 
                placeholder="Search for stocks..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit">
                <Search size={18} className="search-icon" />
              </button>
            </form>
            {isSearching && <div className="search-loading">Searching...</div>}
            {searchResults.length > 0 && (
              <ul className="search-results">
                {searchResults.map((stock) => (
                  <li 
                    key={stock.symbol} 
                    onClick={() => handleSearchResultClick(stock)}
                  >
                    {stock.name} ({stock.symbol})
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        
        <div className={`navbar-links ${showMobileMenu ? 'active' : ''}`} ref={sidebarRef}>
          <div className="sidebar-header">
            <button 
              className="close-sidebar-btn" 
              onClick={() => setShowMobileMenu(false)}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          
          {isAuth ? (
            // Links for authenticated users
            <>
              <Link 
                to="/dashboard" 
                className={location.pathname === '/dashboard' ? 'active' : ''}
                onClick={() => setShowMobileMenu(false)}
              >
                <Home size={18} className="nav-icon" />
                <span>Dashboard</span>
              </Link>
              <Link 
                to="/portfolio" 
                className={location.pathname === '/portfolio' ? 'active' : ''}
                onClick={() => setShowMobileMenu(false)}
              >
                <span>Portfolio</span>
              </Link>
              <Link 
                to="/watchlist" 
                className={location.pathname === '/watchlist' ? 'active' : ''}
                onClick={() => setShowMobileMenu(false)}
              >
                <span>Watchlist</span>
              </Link>
            </>
          ) : (
            // Links for landing page (unauthenticated users)
            <>
              <a 
                href="#features" 
                onClick={(e) => handleAnchorClick(e, 'features')}
                className="landing-nav-link"
              >
                Features
              </a>
              <a 
                href="#pricing" 
                onClick={(e) => handleAnchorClick(e, 'pricing')}
                className="landing-nav-link"
              >
                Pricing
              </a>
              <a 
                href="#about" 
                onClick={(e) => handleAnchorClick(e, 'about')}
                className="landing-nav-link"
              >
                About
              </a>
              <a 
                href="#contact" 
                onClick={(e) => handleAnchorClick(e, 'contact')}
                className="landing-nav-link"
              >
                Contact
              </a>
              <Link 
                to="/login" 
                className="login-nav-link"
                onClick={() => setShowMobileMenu(false)}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="register-nav-link"
                onClick={() => setShowMobileMenu(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
        
        {isAuth && (
          <div className="navbar-user" ref={dropdownRef}>
            <div 
              className={`user-avatar ${showUserDropdown ? 'active' : ''}`}
              onClick={toggleUserDropdown}
            >
              <User size={18} />
            </div>
            {showUserDropdown && (
              <div className="user-dropdown">
                <div className="user-info">
                  {user && (
                    <span className="user-name">{user.firstName} {user.lastName}</span>
                  )}
                </div>
                <Link to="/account" onClick={handleDropdownLinkClick}>
                  <User size={16} className="dropdown-icon" />
                  <span>My Account</span>
                </Link>
                <Link to="/settings" onClick={handleDropdownLinkClick}>
                  <Settings size={16} className="dropdown-icon" />
                  <span>Settings</span>
                </Link>
                <button onClick={handleLogout} className="logout-button">
                  <LogOut size={16} className="dropdown-icon" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
        
        <button 
          className="navbar-menu-toggle" 
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  )
}

export default Navbar