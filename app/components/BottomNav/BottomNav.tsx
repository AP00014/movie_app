"use client";

import { useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MonitorPlay, Sparkles, User, Clapperboard, LogOut } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import AuthModal from '../AuthModal/AuthModal';
import './BottomNav.css';

export default function BottomNav() {
  const pathname = usePathname();
  const [showAuth, setShowAuth] = useState(false);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, isLoading, signOut, role } = useAuth();

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  }

  const handleSignOut = async () => {
    await signOut();
    setShowProfileMenu(false);
  };

  const getInitials = (name: string | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/superadmin')) {
      return null;
  }

  return (
    <>
        <div className="bottom-nav">
          <Link href="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
            <Home size={24} strokeWidth={isActive('/') ? 3 : 2} />
            <span>Home</span>
          </Link>
          
          <Link href="/series" className={`nav-item ${isActive('/series') ? 'active' : ''}`}>
            <MonitorPlay size={24} strokeWidth={isActive('/series') ? 3 : 2} />
            <span>New & Hot</span>
          </Link>

          <Link href="/animations" className={`nav-item ${isActive('/animations') ? 'active' : ''}`}>
             <div className="nav-icon-container">
                <Sparkles size={24} strokeWidth={isActive('/animations') ? 3 : 2} />
             </div>
             <span>Animations</span>
          </Link>

          <Link href="/shorts" className={`nav-item ${isActive('/shorts') ? 'active' : ''}`}>
              <Clapperboard size={24} strokeWidth={isActive('/shorts') ? 3 : 2} />
              <span>Shorts</span>
          </Link>

          {isLoading ? (
            <div className="nav-item">
              <div className="nav-avatar-skeleton"></div>
              <span>Loading...</span>
            </div>
          ) : user ? (
            <Link href="/account" className={`nav-item ${isActive('/account') ? 'active' : ''}`}>
              <div className="nav-avatar">
                {getInitials(user.user_metadata?.full_name)}
              </div>
              <span>Profile</span>
            </Link>
          ) : (
            <div className="nav-item" onClick={() => setShowAuth(true)}>
              <User size={24} strokeWidth={2} />
              <span>My account</span>
            </div>
          )}
        </div>

        <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}
