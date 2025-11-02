import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaSearch, FaUser } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import AccountModal from './AccountModal';
import '../../styles/header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const auth = useAuth();
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsAccountModalOpen(false);
  }, [location]);

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!auth) return null;
  const { user, logout } = auth;
  const isLoggedIn = !!user;

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.name) {
      const nameParts = user.name.trim().split(/\s+/);
      if (nameParts.length >= 2) {
        // Two or more parts - first letter of first and last name
        return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
      } else if (nameParts.length === 1) {
        // Single name - first two letters
        return nameParts[0].substring(0, 2).toUpperCase();
      }
    }
    // Fallback to email
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Prevent body scroll when menu is open
    document.body.style.overflow = isMenuOpen ? 'auto' : 'hidden';
  };

  const toggleAccountModal = () => {
    setIsAccountModalOpen(!isAccountModalOpen);
  };

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="container header-container">
        <Link to="/" className="logo">
         
          <h1 className="text-gold">Synergize Studio</h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/movies" className={`nav-link ${location.pathname.includes('/movies') ? 'active' : ''}`}>Movies</Link>
            </li>
            <li className="nav-item">
              <Link to="/series" className={`nav-link ${location.pathname.includes('/series') ? 'active' : ''}`}>TV Series</Link>
            </li>
            <li className="nav-item">
              <Link to="/music" className={`nav-link ${location.pathname.includes('/music') ? 'active' : ''}`}>Music</Link>
            </li>
            <li className="nav-item">
              <Link to="/gaming" className={`nav-link ${location.pathname.includes('/gaming') ? 'active' : ''}`}>Gaming</Link>
            </li>
          </ul>
        </nav>

        {/* Search Bar */}
        <div className="search-container">
          <input type="text" placeholder="Search..." className="search-input" />
          <button className="search-button">
            <FaSearch />
          </button>
        </div>

        {/* Auth Buttons */}
        <div className="auth-buttons">
          {isLoggedIn ? (
            <div className="user-menu">
              <button className="user-avatar-button" onClick={toggleAccountModal}>
                <div className="user-initials-avatar">{getUserInitials()}</div>
              </button>
              <AccountModal isOpen={isAccountModalOpen} onClose={() => setIsAccountModalOpen(false)} />
            </div>
          ) : (
            <div className="account-menu">
              <button className="account-button" onClick={toggleAccountModal}>
                <FaUser className="account-icon" />
                <span>Account</span>
              </button>
              <AccountModal isOpen={isAccountModalOpen} onClose={() => setIsAccountModalOpen(false)} />
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Canvas Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <Link to="/" className="logo" onClick={() => setIsMenuOpen(false)}>
            <h1 className="text-gold">Synergize studio</h1>
          </Link>
          
        </div>
        
        <div className="mobile-search">
          <input type="text" placeholder="Search..." className="mobile-search-input" />
          <button className="mobile-search-button">
            <FaSearch />
          </button>
        </div>
        
        <nav className="mobile-nav">
          <ul className="mobile-nav-list">
            <li className="mobile-nav-item">
              <Link to="/" className={`mobile-nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={toggleMenu}>Home</Link>
            </li>
            <li className="mobile-nav-item">
              <Link to="/movies" className={`mobile-nav-link ${location.pathname.includes('/movies') ? 'active' : ''}`} onClick={toggleMenu}>Movies</Link>
            </li>
            <li className="mobile-nav-item">
              <Link to="/series" className={`mobile-nav-link ${location.pathname.includes('/series') ? 'active' : ''}`} onClick={toggleMenu}>TV Series</Link>
            </li>
            <li className="mobile-nav-item">
              <Link to="/music" className={`mobile-nav-link ${location.pathname.includes('/music') ? 'active' : ''}`} onClick={toggleMenu}>Music</Link>
            </li>
            <li className="mobile-nav-item">
              <Link to="/gaming" className={`mobile-nav-link ${location.pathname.includes('/gaming') ? 'active' : ''}`} onClick={toggleMenu}>Gaming</Link>
            </li>
          </ul>
        </nav>
        
        <div className="mobile-auth">
          {isLoggedIn ? (
            <div className="mobile-user-info">
              <div className="mobile-user-avatar-initials">{getUserInitials()}</div>
              <span className="mobile-user-name">{user?.name || 'User'}</span>
              <div className="mobile-user-links">
                <Link to="/profile" className="mobile-user-link" onClick={toggleMenu}>Profile</Link>
                <Link to="/watchlist" className="mobile-user-link" onClick={toggleMenu}>My Watchlist</Link>
                <Link to="/library" className="mobile-user-link" onClick={toggleMenu}>My Library</Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="mobile-user-link" onClick={toggleMenu}>Admin Dashboard</Link>
                )}
                <button className="mobile-user-link" onClick={() => logout()}>Logout</button>
              </div>
            </div>
          ) : (
            <div className="mobile-auth-buttons">
              <Link to="/login" className="btn btn-outline btn-block" onClick={toggleMenu}>Login</Link>
              <Link to="/register" className="btn btn-primary btn-block" onClick={toggleMenu}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;