"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { 
  LayoutDashboard, Users, Film, FileText, Settings, LogOut, 
  X, ChevronDown, ChevronRight, Video, Music, MonitorPlay, Zap, Globe, LayoutTemplate
} from 'lucide-react';
import '../../admin/AdminLayout.css'; // Ensure we have styles

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
    const pathname = usePathname();
    const { signOut } = useAuth();
    const [isContentExpanded, setIsContentExpanded] = useState(false);

    // Auto-expand if active path is content
    useEffect(() => {
        if (pathname.startsWith('/admin/content')) {
            setIsContentExpanded(true);
        }
    }, [pathname]);

    const isActive = (path: string) => pathname === path;
    const isContentActive = pathname.startsWith('/admin/content');

    return (
       <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
           <button className="drawer-close" onClick={onClose}>
               <X size={24} />
           </button>
           <Link href="/" className="admin-logo">
               <div style={{width:'32px', height:'32px', background:'#3b82f6', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center'}}>
                   <Film size={18} color="white" />
               </div>
               AdminPanel
           </Link>

           <nav className="sidebar-nav">
               <Link href="/admin/dashboard" className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}>
                   <LayoutDashboard size={18} /> <span>Dashboard</span>
               </Link>
               
               <Link href="/admin/users" className={`nav-link ${isActive('/admin/users') ? 'active' : ''}`}>
                   <Users size={18} /> <span>Users</span>
               </Link>
               
               {/* Content Dropdown */}
               <div className="nav-group">
                   <div 
                        className={`nav-link ${isContentActive ? 'active' : ''}`} 
                        onClick={() => setIsContentExpanded(!isContentExpanded)}
                        style={{cursor:'pointer', justifyContent:'space-between'}}
                   >
                       <div style={{display:'flex', gap:'12px', alignItems:'center'}}>
                            <Film size={18} /> <span>Content</span>
                       </div>
                       {isContentExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                   </div>
                   
                   {/* Submenu */}
                   {isContentExpanded && (
                       <div className="nav-submenu" style={{paddingLeft:'20px', display:'flex', flexDirection:'column', gap:'2px', marginTop:'4px'}}>
                           <SubLink href="/admin/content" label="All Overview" active={pathname === '/admin/content'} />
                           <SubLink href="/admin/content/movies" label="Movies" active={pathname.startsWith('/admin/content/movies')} />
                           <SubLink href="/admin/content/series" label="Series" icon={<MonitorPlay size={14} />} active={pathname.startsWith('/admin/content/series')} />
                           <SubLink href="/admin/content/music" label="Music" icon={<Music size={14} />} active={pathname.startsWith('/admin/content/music')} />
                           <SubLink href="/admin/content/animation" label="Animation" icon={<Zap size={14} />} active={pathname.startsWith('/admin/content/animation')} />
                           <SubLink href="/admin/content/shorts" label="Shorts" icon={<Video size={14} />} active={pathname.startsWith('/admin/content/shorts')} />
                       </div>
                   )}
               </div>

               <Link href="/admin/appearance" className={`nav-link ${isActive('/admin/appearance') ? 'active' : ''}`}>
                   <LayoutTemplate size={18} /> <span>Site Appearance</span>
               </Link>

               <Link href="/admin/reports" className={`nav-link ${isActive('/admin/reports') ? 'active' : ''}`}>
                   <FileText size={18} /> <span>Reports</span>
               </Link>
           </nav>
           
           <div className="sidebar-footer">
                <Link href="/" className="nav-link" style={{marginBottom:'5px'}}>
                   <Globe size={18} /> <span>View Site</span>
               </Link>
                <div onClick={() => signOut()} className="nav-link" style={{cursor:'pointer', color:'#ef4444'}}>
                   <LogOut size={18} /> <span>Logout</span>
               </div>
           </div>
       </aside>        
    );
}

function SubLink({href, label, icon, active}: {href:string, label:string, icon?:React.ReactNode, active?:boolean}) {
    // Basic formatting for sublinks
    return (
        <Link href={href} style={{
            display:'flex', gap:'10px', alignItems:'center',
            padding:'8px 12px', fontSize:'13px', color:'#64748b', textDecoration:'none',
            borderRadius:'6px', background: active ? '#f1f5f9' : 'transparent'
        }}>
           {icon || <div style={{width:'4px', height:'4px', borderRadius:'50%', background:'currentColor'}}></div>}
           {label}
        </Link>
    )
}
