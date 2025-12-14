"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { 
  LayoutDashboard, Users, Film, FileText, Settings, LogOut, 
  Search, Bell, TrendingUp, UserPlus, AlertCircle, CheckCircle, Clock, Menu, X 
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/app/lib/supabase/client';
import AdminSidebar from '@/app/components/AdminSidebar/AdminSidebar';
import '../AdminLayout.css';

export default function AdminDashboard() {
  const { user, role, isLoading, signOut } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({ users: 0, content: 0 });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/');
      } else if (role !== 'admin' && role !== 'superadmin') {
        router.push('/account'); 
      } else {
        // Fetch Data
        const fetchData = async () => {
             const supabase = createClient();
             if (!supabase) return;

             // 1. Count Users
             const { count: usersCount } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true });

             // 2. Count Content (Movies)
             // Table 'movies' does not exist yet, so we disable fetch to prevent 404s
             const moviesCount = 0;
             /* 
             const { count: moviesCount } = await supabase
                .from('movies')
                .select('*', { count: 'exact', head: true });
             */
             
             // 3. Recent Users
             const { data: recents } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);

             setStats({ users: usersCount || 0, content: moviesCount || 0 });
             setRecentUsers(recents || []);
        };
        fetchData();
      }
    }
  }, [user, role, isLoading, router]);

  if (isLoading || !user) {
      return <div style={{height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f4f6f8', color:'#333'}}>Loading Dashboard...</div>;
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
           {/* Header */}
           <header className="admin-header">
               <div>
                   <h1 className="page-title">Dashboard Overview</h1>
                   <p style={{color:'#64748b', fontSize:'14px'}}>Welcome back, {user.user_metadata?.full_name}</p>
               </div>
               
               <div className="header-actions">
                   <div className="search-wrapper">
                       <Search size={18} style={{position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'#94a3b8'}} />
                       <input type="text" placeholder="Search system..." className="header-search" />
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

           {/* Widgets */}
           <div className="dashboard-grid">
               <div className="stat-widget">
                   <div className="widget-icon blue"><Users size={24} /></div>
                   <div className="widget-value">{stats.users}</div>
                   <div className="widget-label">Total Users</div>
                   <div className="widget-trend trend-up"><TrendingUp size={12} /> Live Count</div>
               </div>
               <div className="stat-widget">
                   <div className="widget-icon green"><Film size={24} /></div>
                   <div className="widget-value">{stats.content}</div>
                   <div className="widget-label">Content Items</div>
                   <div className="widget-trend trend-up"><TrendingUp size={12} /> Movies & Series</div>
               </div>
               <div className="stat-widget">
                   <div className="widget-icon purple"><Clock size={24} /></div>
                   <div className="widget-value">1,203</div>
                   <div className="widget-label">Active Active Streams</div>
                   <div className="widget-trend"><span style={{color:'#64748b'}}>Stable</span></div>
               </div>
               <div className="stat-widget">
                   <div className="widget-icon orange"><AlertCircle size={24} /></div>
                   <div className="widget-value">15</div>
                   <div className="widget-label">Pending Reviews</div>
                   <div className="widget-trend trend-down"><span style={{color:'#f97316'}}>Needs attention</span></div>
               </div>
           </div>

           {/* Recent Signup Table */}
           <div className="content-section">
               <div className="section-header">
                   <h2 className="section-title">Recent Registrations</h2>
                   <button style={{color:'#3b82f6', background:'none', border:'none', cursor:'pointer', fontWeight:600}}>View All</button>
               </div>
               
               <div className="table-header">
                   <div>User</div>
                   <div>Role</div>
                   <div>Joined</div>
                   <div>Status</div>
               </div>

               {recentUsers.map((u) => (
                   <div className="table-row" key={u.id}>
                       <div className="user-cell">
                           <div className="snippet-avatar" style={{background:'#64748b'}}>
                               {u.full_name?.[0]?.toUpperCase() || 'U'}
                           </div>
                           <div>
                               <div style={{color:'#0f172a'}}>{u.full_name || 'No Name'}</div>
                               <div style={{fontSize:'12px', color:'#94a3b8'}}>{u.email || 'No Email'}</div>
                           </div>
                       </div>
                       <div style={{textTransform:'capitalize'}}>{u.role || 'user'}</div>
                       <div>{new Date(u.created_at).toLocaleDateString()}</div>
                       <div>
                           <span className="status-badge status-active">Active</span>
                       </div>
                   </div>
               ))}
               
               {recentUsers.length === 0 && (
                  <div style={{padding:'20px', textAlign:'center', color:'#666'}}>No recent users found</div>
               )}
           </div>

       </main>
    </div>
  );
}
