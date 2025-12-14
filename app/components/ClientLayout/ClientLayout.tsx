"use client";

import { usePathname } from 'next/navigation';
import Navbar from '../Navbar/Navbar';
import BottomNav from '../BottomNav/BottomNav';
import { AuthProvider } from '@/app/context/AuthContext';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Logic: Show Nav/BottomNav on all pages EXCEPT /movie/[id] and Admin pages
  // Also handle specific styling for Shorts
  const isMovieDetail = pathname.startsWith('/movie/');
  const isShorts = pathname === '/shorts';
  const isAdmin = pathname.startsWith('/admin') || pathname.startsWith('/superadmin');

  if (isMovieDetail) {
    return <AuthProvider>{children}</AuthProvider>;
  }

  if (isAdmin) {
    return <AuthProvider>{children}</AuthProvider>;
  }

  return (
    <AuthProvider>
      <div className={isShorts ? 'shorts-navbar-wrapper' : 'main-navbar-wrapper'}>
         <Navbar />
      </div>
      
      {children}
      
      <BottomNav />
    </AuthProvider>
  );
}
