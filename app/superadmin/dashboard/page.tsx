"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { 
  Shield, Terminal, Database, Cpu, Globe, Activity, Lock, Server, 
  AlertTriangle, Check, LogOut, Menu, X 
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/app/lib/supabase/client';
import '../SuperAdminLayout.css';

export default function SuperAdminDashboard() {
  const { user, role, isLoading, signOut } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [metrics, setMetrics] = useState({ totalUsers: 0, contentCount: 0});

  // Protect Route & Fetch Data
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/');
      } else if (role !== 'superadmin') {
         if (role === 'admin') router.push('/admin/dashboard');
         else router.push('/account');
      } else {
         const fetchMetrics = async () => {
            const supabase = createClient();
            if (!supabase) return;
            const { count: u } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
            // const { count: c } = await supabase.from('movies').select('*', { count: 'exact', head: true });
            const c = 0; 
            setMetrics({ totalUsers: u || 0, contentCount: c || 0 });
         };
         fetchMetrics();
      }
    }
  }, [user, role, isLoading, router]);

  if (isLoading || !user) {
      return <div style={{height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'black', color:'#a855f7', fontFamily:'monospace'}}>INITIALIZING SYSTEM...</div>;
  }

  return (
    <div className="sa-container">
       {/* Mobile Menu Overlay & Top Bar */}
       <div className={`sa-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>
       
       <div className="mobile-top-bar">
          <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
          </button>
          <span style={{fontWeight:700, color:'#a855f7', letterSpacing:'1px'}}>COMMAND CENTER</span>
          <div style={{width:'24px'}}></div>
       </div>

       {/* Sidebar */}
       <aside className={`sa-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
           <button className="drawer-close-btn" onClick={() => setIsMobileMenuOpen(false)}>
               <X size={24} />
           </button>
           <Link href="/" className="sa-logo">
               <Shield size={24} />
               GOD_MODE
           </Link>

           <nav className="sa-nav">
               <div className="sa-link active">
                   <Activity size={16} /> SYSTEM STATUS
               </div>
               <div className="sa-link">
                   <Database size={16} /> DATA_CORE
               </div>
               <div className="sa-link">
                   <Terminal size={16} /> AUDIT_LOGS
               </div>
               <div className="sa-link">
                   <Lock size={16} /> SECURITY
               </div>
               <div className="sa-link">
                   <Globe size={16} /> GLOBAL_MAP
               </div>
           </nav>
           
           <div style={{padding:'20px', borderTop:'1px solid #333'}}>
                <div onClick={() => signOut()} className="sa-link" style={{cursor:'pointer', color:'#ef4444', paddingLeft:0}}>
                   <LogOut size={16} /> DISCONNECT
               </div>
           </div>
       </aside>

       {/* Main Content */}
       <main className="sa-main">
           <header className="sa-header">
               <div className="sa-title-block">
                   <h1>COMMAND CENTER</h1>
                   <p>ROOT ACCESS GRANTED: {user.id}</p>
               </div>
               <div className="system-status">
                   <div className="status-indicator">
                       <div className="dot ok"></div> API GATEWAY
                   </div>
                   <div className="status-indicator">
                       <div className="dot ok"></div> DATABASE
                   </div>
                   <div className="status-indicator">
                       <div className="dot warn"></div> QUEUE
                   </div>
               </div>
           </header>

           {/* Metrics Grid */}
           <div className="sa-grid">
               <div className="sa-card">
                   <div className="card-title">
                       TOTAL USERS <UsersIcon />
                   </div>
                   <div className="metric-big">{metrics.totalUsers}</div>
                   <div className="metric-sub">Registered accounts</div>
               </div>
               <div className="sa-card">
                   <div className="card-title">
                       SERVER LOAD <Cpu strokeWidth={1.5} size={16} />
                   </div>
                   <div className="metric-big">42%</div>
                   <div className="metric-sub">8 Cores Active</div>
               </div>
               <div className="sa-card">
                   <div className="card-title">
                       SECURITY THREATS <Shield strokeWidth={1.5} size={16} />
                   </div>
                   <div className="metric-big" style={{color:'#ef4444'}}>3</div>
                   <div className="metric-sub">IP Blocked / 24h</div>
               </div>
           </div>

           <div className="sa-dashboard-layout">
               {/* Terminal Logs */}
               <div>
                   <div style={{color:'#888', marginBottom:'10px', fontSize:'12px', letterSpacing:'1px'}}>LIVE SYSTEM LOGS</div>
                   <div className="terminal-window">
                       <LogEntry time="14:20:01" type="INFO" msg="User authentication successful [User: 492]" />
                       <LogEntry time="14:20:05" type="INFO" msg="Stream started: Movie_ID_883 [1080p, en-US]" />
                       <LogEntry time="14:21:12" type="WARN" msg="High latency detected in cluster us-east-1" />
                       <LogEntry time="14:21:15" type="INFO" msg="Auto-scaling group trigger: +1 instance" />
                       <LogEntry time="14:22:01" type="INFO" msg="Database backup routine initiated" />
                       <LogEntry time="14:22:45" type="CRIT" msg="Failed login attempt from IP 192.168.x.x (3 attempts)" />
                       <LogEntry time="14:23:00" type="INFO" msg="User authentication successful [User: 510]" />
                       <span style={{animation:'blink 1s infinite'}}>_</span>
                   </div>
               </div>

               {/* Map Mock */}
               <div>
                   <div style={{color:'#888', marginBottom:'10px', fontSize:'12px', letterSpacing:'1px'}}>GLOBAL TRAFFIC</div>
                   <div className="map-container">
                       [ GLOBAL MAP VISUALIZATION ]
                       <div className="map-point" style={{top:'30%', left:'20%'}}></div>
                       <div className="map-point" style={{top:'40%', left:'70%', animationDelay:'0.5s'}}></div>
                       <div className="map-point" style={{top:'60%', left:'60%', animationDelay:'1s'}}></div>
                   </div>
               </div>
           </div>

       </main>
    </div>
  );
}

function LogEntry({time, type, msg}: {time:string, type:string, msg:string}) {
    let typeClass = 'type-info';
    if(type === 'WARN') typeClass = 'type-warn';
    if(type === 'CRIT') typeClass = 'type-crit';
    
    return (
        <div className="log-line">
            <span className="log-time">[{time}]</span>
            <span className={`log-type ${typeClass}`}>{type}</span>
            <span className="log-msg">{msg}</span>
        </div>
    );
}

function UsersIcon() {
    return (
        <svg  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
    )
}
