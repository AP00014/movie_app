"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { createClient } from '@/app/lib/supabase/client';
import { 
  LayoutDashboard, Users, Film, FileText, Settings, LogOut, 
  Search, Bell, Menu, X, Plus, Image as ImageIcon, Video, Music, MonitorPlay, Zap, Filter
} from 'lucide-react';
import Link from 'next/link';
import AdminSidebar from '@/app/components/AdminSidebar/AdminSidebar';
import '../AdminLayout.css';

import { Suspense } from 'react';
// ... previous imports

export default function AdminContentPage() {
    return (
        <Suspense fallback={<div className="p-10">Loading...</div>}>
            <AdminContentContent />
        </Suspense>
    );
}

function AdminContentContent() {
  const { user, role, isLoading, signOut } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
      title: '',
      type: 'movie',
      genre: '',
      releaseYear: new Date().getFullYear(),
      thumbnailUrl: '',
      videoUrl: '',
      description: ''
  });
  // ...
  const [contentList, setContentList] = useState<any[]>([]);

  // Protect Route
  useEffect(() => {
    if (!isLoading) {
      if (!user) router.push('/');
      else if (role !== 'admin' && role !== 'superadmin') router.push('/account'); 
    }
  }, [user, role, isLoading, router]);

  // Sync Tab with URL
  useEffect(() => {
      const type = searchParams.get('type');
      if (type) setActiveTab(type);
  }, [searchParams]);


  const handleInputChange = (e: any) => {
      const { name, value } = e.target;
      setFormData(prev => ({...prev, [name]: value}));
  };

  const handleSubmit = async (e: any) => {
      e.preventDefault();
      // Placeholder for Supabase Insert
      console.log("Submitting Content:", formData);
      
      const newItem = {
          id: Math.random().toString(36).substr(2, 9),
          ...formData,
          created_at: new Date().toISOString(),
          status: 'draft'
      };
      
      setContentList([newItem, ...contentList]);
      setIsModalOpen(false);
      setFormData({
        title: '', type: 'movie', genre: '', releaseYear: new Date().getFullYear(),
        thumbnailUrl: '', videoUrl: '', description: ''
      });
  };

  if (isLoading || !user) {
      return <div style={{height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f4f6f8', color:'#333'}}>Loading...</div>;
  }

  // Filter Logic
  const filteredContent = activeTab === 'all' 
      ? contentList 
      : contentList.filter(c => c.type === activeTab);

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
               <div className="page-title">Content Management</div>
               <div className="header-actions">
                   <div style={{display:'flex', gap:'10px'}}>
                       <button className="header-btn" onClick={() => setIsModalOpen(true)} 
                               style={{width:'auto', padding:'0 20px', background:'#3b82f6', color:'white', border:'none', borderRadius:'8px', fontWeight:600, gap:'8px'}}>
                           <Plus size={18} /> Add New
                       </button>
                   </div>
                   <Link href="/account" className="user-snippet">
                        <div className="snippet-avatar">
                            {user.user_metadata?.full_name?.[0] || 'A'}
                        </div>
                   </Link>
               </div>
           </header>

           {/* Tabs */}
           <div style={{display:'flex', gap:'10px', marginBottom:'20px', overflowX:'auto', paddingBottom:'5px'}}>
               {['all', 'movie', 'series', 'music', 'animation', 'shorts'].map(tab => (
                   <button 
                       key={tab}
                       onClick={() => setActiveTab(tab)}
                       style={{
                           padding:'8px 16px', 
                           borderRadius:'20px', 
                           border:'1px solid',
                           borderColor: activeTab === tab ? '#3b82f6' : '#e2e8f0',
                           background: activeTab === tab ? '#eff6ff' : 'white',
                           color: activeTab === tab ? '#3b82f6' : '#64748b',
                           fontWeight: 600,
                           textTransform: 'capitalize',
                           cursor:'pointer'
                       }}
                   >
                       {tab}
                   </button>
               ))}
           </div>

           <div className="content-section">
               <div className="section-header">
                    <h2 className="section-title" style={{textTransform:'capitalize'}}>{activeTab} Library</h2>
               </div>
               
               <div className="table-header" style={{gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr'}}>
                   <div>Format</div>
                   <div>Title & Genre</div>
                   <div>Release</div>
                   <div>Status</div>
                   <div>Actions</div>
               </div>

               {filteredContent.length > 0 ? filteredContent.map((item) => (
                   <div className="table-row" key={item.id} style={{gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr'}}>
                       <div><TypeBadge type={item.type} /></div>
                       <div>
                           <div style={{fontWeight:600, color:'#0f172a'}}>{item.title}</div>
                           <div style={{fontSize:'12px', color:'#64748b'}}>{item.genre}</div>
                       </div>
                       <div>{item.releaseYear}</div>
                       <div><span className="status-badge status-pending">Draft</span></div>
                       <div style={{color:'#3b82f6', fontWeight:600, cursor:'pointer'}}>Edit</div>
                   </div>
               )) : (
                   <div style={{padding:'60px', textAlign:'center', color:'#94a3b8'}}>
                       <Film size={48} style={{margin:'0 auto 20px', opacity:0.2}} />
                       <div>No content found in this category.</div>
                       <button onClick={() => setIsModalOpen(true)} style={{marginTop:'15px', color:'#3b82f6', background:'none', border:'none', cursor:'pointer', textDecoration:'underline'}}>Add your first item</button>
                   </div>
               )}
           </div>
       </main>

       {/* Add Content Modal */}
       {isModalOpen && (
           <div style={{
               position:'fixed', top:0, left:0, width:'100%', height:'100%', 
               background:'rgba(0,0,0,0.5)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center',
               backdropFilter:'blur(4px)'
           }}>
               <div style={{background:'white', width:'500px', maxWidth:'90%', borderRadius:'16px', padding:'30px', boxShadow:'0 20px 50px rgba(0,0,0,0.2)'}}>
                   <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                       <h2 style={{margin:0, fontSize:'20px'}}>Upload New Content</h2>
                       <button onClick={() => setIsModalOpen(false)} style={{background:'none', border:'none', cursor:'pointer'}}><X size={24} /></button>
                   </div>

                   <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:'15px'}}>
                       <div>
                           <label style={{display:'block', fontSize:'13px', fontWeight:600, marginBottom:'5px', color:'#64748b'}}>Title</label>
                           <input name="title" required value={formData.title} onChange={handleInputChange} 
                                  style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #e2e8f0', outline:'none'}} placeholder="e.g. The Matrix" />
                       </div>

                       <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px'}}>
                           <div>
                               <label style={{display:'block', fontSize:'13px', fontWeight:600, marginBottom:'5px', color:'#64748b'}}>Type</label>
                               <select name="type" value={formData.type} onChange={handleInputChange}
                                  style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #e2e8f0', outline:'none', background:'white'}}>
                                   <option value="movie">Movie</option>
                                   <option value="series">Series</option>
                                   <option value="music">Music</option>
                                   <option value="animation">Animation</option>
                                   <option value="shorts">Shorts</option>
                               </select>
                           </div>
                           <div>
                               <label style={{display:'block', fontSize:'13px', fontWeight:600, marginBottom:'5px', color:'#64748b'}}>Release Year</label>
                               <input name="releaseYear" type="number" value={formData.releaseYear} onChange={handleInputChange}
                                      style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #e2e8f0', outline:'none'}} />
                           </div>
                       </div>

                       <div>
                           <label style={{display:'block', fontSize:'13px', fontWeight:600, marginBottom:'5px', color:'#64748b'}}>Genre</label>
                           <input name="genre" value={formData.genre} onChange={handleInputChange}
                                  style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #e2e8f0', outline:'none'}} placeholder="Action, Sci-Fi..." />
                       </div>

                       <div>
                           <label style={{display:'block', fontSize:'13px', fontWeight:600, marginBottom:'5px', color:'#64748b'}}>Thumbnail URL</label>
                           <input name="thumbnailUrl" value={formData.thumbnailUrl} onChange={handleInputChange}
                                  style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #e2e8f0', outline:'none'}} placeholder="https://..." />
                       </div>

                       <button type="submit" style={{marginTop:'10px', padding:'12px', background:'#3b82f6', color:'white', border:'none', borderRadius:'8px', fontWeight:700, cursor:'pointer'}}>
                           Publish Content
                       </button>
                   </form>
               </div>
           </div>
       )}
    </div>
  );
}

function TypeBadge({type}: {type:string}) {
    const styles: any = {
        movie: { color: '#3b82f6', bg: '#eff6ff', icon: Film },
        series: { color: '#8b5cf6', bg: '#f5f3ff', icon: MonitorPlay },
        music: { color: '#ec4899', bg: '#fdf2f8', icon: Music },
        animation: { color: '#f59e0b', bg: '#fffbeb', icon: Zap },
        shorts: { color: '#ef4444', bg: '#fef2f2', icon: Video },
    };
    const s = styles[type] || styles['movie'];
    const Icon = s.icon;
    return (
        <span style={{display:'inline-flex', alignItems:'center', gap:'6px', padding:'4px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:700, color:s.color, background:s.bg}}>
            <Icon size={12} /> {type.toUpperCase()}
        </span>
    );
}
