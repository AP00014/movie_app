"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Menu } from 'lucide-react';
import AdminSidebar from '@/app/components/AdminSidebar/AdminSidebar';
import AdminContentManager from '@/app/components/AdminContentManager/AdminContentManager';
import '../../AdminLayout.css';

export default function AdminSeriesPage() {
  const { user, role, isLoading } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) router.push('/');
      else if (role !== 'admin' && role !== 'superadmin') router.push('/account'); 
    }
  }, [user, role, isLoading, router]);

  if (isLoading || !user) return <div style={{height:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>Loading...</div>;

  return (
    <div className="admin-container">
       <div className={`admin-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>
       <div className="admin-mobile-top">
          <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
          </button>
          <div style={{fontWeight:800, color:'#0f172a', fontSize:'18px'}}>AdminPanel</div>
          <div style={{width:'24px'}}></div>
       </div>

       <AdminSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

       <main className="admin-main">
            <AdminContentManager contentType="series" title="Series" />
       </main>
    </div>
  );
}
