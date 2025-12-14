"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { createClient } from '@/app/lib/supabase/client';
import { 
  LayoutDashboard, Users, Film, FileText, Settings, LogOut, 
  Search, Bell, Menu, X, Filter, Download
} from 'lucide-react';
import Link from 'next/link';
import AdminSidebar from '@/app/components/AdminSidebar/AdminSidebar';
import '../AdminLayout.css';

export default function AdminUsersPage() {
  const { user, role, isLoading, signOut } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Protect Route & Fetch Users
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/');
      } else if (role !== 'admin' && role !== 'superadmin') {
        router.push('/account'); 
      } else {
        const fetchUsers = async () => {
            const supabase = createClient();
            if (!supabase) {
                setLoadingUsers(false);
                return;
            }
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (data) setUsers(data);
            setLoadingUsers(false);
        };
        fetchUsers();
      }
    }
  }, [user, role, isLoading, router]);

  if (isLoading || !user) {
      return <div style={{height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f4f6f8', color:'#333'}}>Loading...</div>;
  }

  return (
    <div className="admin-container">
       {/* Mobile Overlay & Top Bar */}
       <div className={`admin-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>
       
       <div className="admin-mobile-top">
          <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
          </button>
          <div style={{fontWeight:800, color:'#0f172a', fontSize:'18px'}}>AdminPanel</div>
          <div style={{width:'24px'}}></div>
       </div>

       {/* Sidebar */}
       <AdminSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

       {/* Main Content */}
       <main className="admin-main">
           <header className="admin-header">
               <div className="page-title">User Management</div>
               
               <div className="header-actions">
                   <div className="search-wrapper">
                       <Search size={18} style={{position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'#94a3b8'}} />
                       <input type="text" placeholder="Search users..." className="header-search" />
                   </div>

                   <div className="header-btn">
                       <Bell size={18} />
                       <div className="notification-badge"></div>
                   </div>
                   
                   <Link href="/account" className="user-snippet">
                        <div className="snippet-avatar">
                            {user.user_metadata?.full_name?.[0] || 'A'}
                        </div>
                        <span style={{fontSize:'13px', fontWeight:600}}>My Account</span>
                   </Link>
               </div>
           </header>

           <div className="content-section">
               <div className="section-header">
                   <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
                       <h2 className="section-title">All Users</h2>
                       <span style={{background:'#e2e8f0', padding:'2px 8px', borderRadius:'10px', fontSize:'12px', fontWeight:600}}>{users.length}</span>
                   </div>
                   <div style={{display:'flex', gap:'10px'}}>
                       <button className="header-btn" title="Filter"><Filter size={18} /></button>
                       <button className="header-btn" title="Export"><Download size={18} /></button>
                   </div>
               </div>
               
               <div className="table-header">
                   <div>User Details</div>
                   <div>Role</div>
                   <div>Joined Date</div>
                   <div>Last Login</div>
                   <div>Status</div>
               </div>

               {loadingUsers ? (
                   <div style={{padding:'40px', textAlign:'center', color:'#64748b'}}>Loading Users...</div>
               ) : (
                   <>
                       {users.map((u) => (
                           <div className="table-row" key={u.id}>
                               <div className="user-cell">
                                   <div className="snippet-avatar" style={{background:'#64748b'}}>
                                       {u.full_name?.[0]?.toUpperCase() || 'U'}
                                   </div>
                                   <div>
                                       <div style={{color:'#0f172a', fontWeight:600}}>{u.full_name || 'No Name'}</div>
                                       <div style={{fontSize:'12px', color:'#94a3b8'}}>{u.email}</div>
                                       <div style={{fontSize:'10px', color:'#cbd5e1', fontFamily:'monospace'}}>{u.id.substring(0,8)}...</div>
                                   </div>
                               </div>
                               <div style={{textTransform:'capitalize', fontWeight:500}}>{u.role || 'user'}</div>
                               <div>{new Date(u.created_at).toLocaleDateString()}</div>
                               <div style={{color:'#64748b'}}>-</div>
                               <div>
                                   <span className="status-badge status-active">Active</span>
                               </div>
                           </div>
                       ))}
                       {users.length === 0 && (
                           <div style={{padding:'40px', textAlign:'center', color:'#64748b'}}>No users found matching your criteria.</div>
                       )}
                   </>
               )}
           </div>

       </main>
    </div>
  );
}
