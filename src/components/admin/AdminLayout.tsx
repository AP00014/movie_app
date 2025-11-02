import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import '../../styles/admin.css';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="admin-layout">
      {/* Mobile Menu Button */}
      <button
        className="mobile-menu-toggle"
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
      )}

      <aside className={`admin-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="admin-sidebar-header">
          <Link to="/" className="admin-logo" onClick={closeMobileMenu}>
            MovieFlix Admin
          </Link>
        </div>

        <nav className="admin-nav">
          <p className="admin-nav-title">Dashboard</p>
          <ul className="admin-nav-list">
            <li className="admin-nav-item">
              <Link to="/admin" className={`admin-nav-link ${isActive('/admin')}`} onClick={closeMobileMenu}>
                Dashboard
              </Link>
            </li>
          </ul>

          <p className="admin-nav-title">Content</p>
          <ul className="admin-nav-list">
            <li className="admin-nav-item">
              <Link to="/admin/movies" className={`admin-nav-link ${isActive('/admin/movies')}`} onClick={closeMobileMenu}>
                Movies
              </Link>
            </li>
            <li className="admin-nav-item">
              <Link to="/admin/music" className={`admin-nav-link ${isActive('/admin/music')}`} onClick={closeMobileMenu}>
                Music
              </Link>
            </li>
            <li className="admin-nav-item">
              <Link to="/admin/games" className={`admin-nav-link ${isActive('/admin/games')}`} onClick={closeMobileMenu}>
                Games
              </Link>
            </li>
            <li className="admin-nav-item">
              <Link to="/admin/media" className={`admin-nav-link ${isActive('/admin/media')}`} onClick={closeMobileMenu}>
                Media Library
              </Link>
            </li>
          </ul>

          <p className="admin-nav-title">Users</p>
          <ul className="admin-nav-list">
            <li className="admin-nav-item">
              <Link to="/admin/users" className={`admin-nav-link ${isActive('/admin/users')}`} onClick={closeMobileMenu}>
                Users
              </Link>
            </li>
          </ul>

          <p className="admin-nav-title">Settings</p>
          <ul className="admin-nav-list">
            <li className="admin-nav-item">
              <Link to="/admin/settings" className={`admin-nav-link ${isActive('/admin/settings')}`} onClick={closeMobileMenu}>
                Site Settings
              </Link>
            </li>
          </ul>

          <div className="admin-nav-footer">
            <button onClick={handleLogout} className="admin-logout-btn">
              Logout
            </button>
          </div>
        </nav>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;