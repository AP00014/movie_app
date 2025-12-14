"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  Menu, Save, LayoutTemplate, MonitorPlay, MoveVertical, Eye, EyeOff, 
  Plus, Trash2, Image as ImageIcon, GripVertical, CheckCircle, Palette, 
  Type, Layers, Smartphone
} from 'lucide-react';
import AdminSidebar from '@/app/components/AdminSidebar/AdminSidebar';
import '../AdminLayout.css';

export default function SiteAppearancePage() {
  const { user, role, isLoading } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('layout'); // layout, hero, branding
  const [isSaving, setIsSaving] = useState(false);

  // Mock Data for Layout Sections
  const [sections, setSections] = useState([
    { id: 'hero_carousel', label: 'Main Hero Carousel', enabled: true, type: 'hero' },
    { id: 'featured_brands', label: 'Brand Logos Row', enabled: true, type: 'logos' },
    { id: 'trending_now', label: 'Trending Now', enabled: true, type: 'row_horizontal' },
    { id: 'continue_watching', label: 'Continue Watching', enabled: true, type: 'row_horizontal' },
    { id: 'new_releases', label: 'New Releases', enabled: true, type: 'row_vertical' },
    { id: 'top_10', label: 'Top 10 in Country', enabled: true, type: 'row_numbered' },
    { id: 'just_added', label: 'Just Added', enabled: false, type: 'row_horizontal' },
    { id: 'originals', label: 'Originals', enabled: true, type: 'row_large' },
  ]);

  // Mock Data for Hero Carousel Items
  const [heroItems, setHeroItems] = useState([
    { id: '1', title: 'Inception', type: 'movie', image: 'https://image.tmdb.org/t/p/original/8ZKJP15hxM7z8p4.jpg' },
    { id: '2', title: 'Stranger Things', type: 'series', image: 'https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYkDjAR08k.jpg' },
    { id: '3', title: 'Interstellar', type: 'movie', image: 'https://image.tmdb.org/t/p/original/gEU2QniL6uF75dHu9diy2D6.jpg' },
  ]);

  const [branding, setBranding] = useState({
      appName: 'StreamFlix',
      primaryColor: '#3b82f6',
      accentColor: '#ec4899',
      logoUrl: '',
      faviconUrl: ''
  });

  useEffect(() => {
    if (!isLoading) {
      if (!user) router.push('/');
      else if (role !== 'admin' && role !== 'superadmin') router.push('/account'); 
    }
  }, [user, role, isLoading, router]);

  const handleSave = () => {
      setIsSaving(true);
      // Simulate API call
      setTimeout(() => setIsSaving(false), 1500);
  };

  const toggleSection = (id: string) => {
      setSections(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
      if (direction === 'up' && index === 0) return;
      if (direction === 'down' && index === sections.length - 1) return;
      
      const newSections = [...sections];
      const temp = newSections[index];
      newSections[index] = newSections[index + (direction === 'up' ? -1 : 1)];
      newSections[index + (direction === 'up' ? -1 : 1)] = temp;
      setSections(newSections);
  };

  if (isLoading || !user) return <div style={{height:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>Loading...</div>;

  return (
    <div className="admin-container">
       <div className={`admin-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>
       
       <div className="admin-mobile-top">
          <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)}><Menu size={24} /></button>
          <div style={{fontWeight:800, color:'#0f172a', fontSize:'18px'}}>AdminPanel</div>
      </div>

       <AdminSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

       <main className="admin-main">
            <header className="admin-header">
               <div>
                   <div className="page-title">Site Appearance</div>
                   <div style={{fontSize:'12px', color:'#94a3b8', fontWeight:500}}>Manage layout, sections, and featured content</div>
               </div>
               
               <div className="header-actions">
                   <button onClick={handleSave} disabled={isSaving} className="header-btn" 
                           style={{width:'auto', padding:'0 25px', background: isSaving ? '#94a3b8' : '#0f172a', color:'white', border:'none', borderRadius:'10px', fontWeight:600, gap:'8px', boxShadow:'0 4px 12px rgba(15, 23, 42, 0.2)'}}>
                       {isSaving ? 'Saving Changes...' : <><Save size={18} /> Save Configuration</>}
                   </button>
               </div>
           </header>

           {/* Tabs */}
           <div className="pro-tabs-container">
               {[
                   {id: 'layout', label: 'Homepage Layout', icon: LayoutTemplate},
                   {id: 'hero', label: 'Hero Carousel', icon: MonitorPlay},
                   {id: 'branding', label: 'Branding & Theme', icon: Palette},
               ].map(tab => (
                   <button 
                       key={tab.id}
                       onClick={() => setActiveTab(tab.id)}
                       className="pro-tab"
                       style={{
                           borderBottom: activeTab === tab.id ? '3px solid #0f172a' : '3px solid transparent',
                           color: activeTab === tab.id ? '#0f172a' : '#64748b',
                           fontWeight: activeTab === tab.id ? 700 : 600,
                           display: 'flex', gap: '8px', alignItems: 'center'
                       }}
                   >
                       <tab.icon size={16} />
                       {tab.label}
                   </button>
               ))}
           </div>

           <div className="content-section" style={{maxWidth:'1000px', margin:'0 auto'}}>
               
               {/* TAB: LAYOUT */}
               {activeTab === 'layout' && (
                   <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
                       <div style={{padding:'20px', background:'#f8fafc', borderRadius:'12px', border:'1px solid #e2e8f0'}}>
                           <h3 style={{marginTop:0, fontSize:'16px', fontWeight:700, display:'flex', alignItems:'center', gap:'10px'}}>
                               <Smartphone size={18} color="#64748b" /> 
                               Mobile & Desktop Structure
                           </h3>
                           <p style={{fontSize:'13px', color:'#64748b', margin:'5px 0 0'}}>Drag or use arrows to reorder sections. Toggle visibility with the eye icon.</p>
                       </div>

                       <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                           {sections.map((section, index) => (
                               <div key={section.id} style={{
                                   display:'flex', alignItems:'center', gap:'15px', padding:'15px 20px', 
                                   background:'white', borderRadius:'10px', border:'1px solid #e2e8f0',
                                   opacity: section.enabled ? 1 : 0.6,
                                   boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
                               }}>
                                   <div style={{color:'#cbd5e1', cursor:'grab'}}><GripVertical size={20} /></div>
                                   
                                   <div style={{display:'flex', flexDirection:'column', gap:'2px'}}>
                                       <button onClick={() => moveSection(index, 'up')} disabled={index === 0} style={{border:'none', background:'none', cursor:'pointer', padding:'2px', color: index===0?'#e2e8f0':'#64748b'}}>▲</button>
                                       <button onClick={() => moveSection(index, 'down')} disabled={index === sections.length-1} style={{border:'none', background:'none', cursor:'pointer', padding:'2px', color: index===sections.length-1?'#e2e8f0':'#64748b'}}>▼</button>
                                   </div>

                                   <div style={{flex:1}}>
                                       <div style={{fontWeight:600, color:'#0f172a', fontSize:'14px'}}>{section.label}</div>
                                       <div style={{fontSize:'11px', color:'#94a3b8', textTransform:'uppercase', fontWeight:700, letterSpacing:'0.05em'}}>{section.type.replace('_', ' ')}</div>
                                   </div>

                                   <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                                        <button onClick={() => toggleSection(section.id)} 
                                                style={{
                                                    padding:'8px 12px', borderRadius:'6px', border:'none', cursor:'pointer',
                                                    background: section.enabled ? '#dbeafe' : '#f1f5f9',
                                                    color: section.enabled ? '#2563eb' : '#94a3b8',
                                                    display:'flex', alignItems:'center', gap:'6px', fontSize:'13px', fontWeight:600
                                                }}>
                                            {section.enabled ? <><Eye size={16} /> Visible</> : <><EyeOff size={16} /> Hidden</>}
                                        </button>
                                   </div>
                               </div>
                           ))}
                       </div>
                   </div>
               )}

               {/* TAB: HERO CAROUSEL */}
               {activeTab === 'hero' && (
                   <div>
                       <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
                           <h3 style={{margin:0}}>Active Slides ({heroItems.length})</h3>
                           <button className="primary-btn" style={{background:'#0f172a', color:'white', padding:'8px 16px', borderRadius:'8px', display:'flex', alignItems:'center', gap:'6px', fontSize:'13px'}}>
                               <Plus size={16} /> Add Content
                           </button>
                       </div>

                       <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'20px'}}>
                           {heroItems.map(item => (
                               <div key={item.id} style={{
                                   position:'relative', height:'160px', borderRadius:'12px', overflow:'hidden', 
                                   boxShadow:'0 4px 12px rgba(0,0,0,0.1)', border:'1px solid #e2e8f0'
                               }}>
                                   {/* Background Image mock */}
                                   <div style={{position:'absolute', top:0, left:0, width:'100%', height:'100%', background:'#cbd5e1'}}>
                                        {/* In real app, un-comment img */}
                                        {/* <img src={item.image} style={{width:'100%', height:'100%', objectFit:'cover'}} /> */}
                                        <div style={{display:'flex', alignItems:'center', justifyContent:'center', height:'100%', background:`url(${item.image}) center/cover`}}>
                                            {!item.image && <ImageIcon size={32} color="white" />}
                                        </div>
                                   </div>
                                   
                                   <div style={{
                                       position:'absolute', bottom:0, left:0, width:'100%', padding:'15px',
                                       background:'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'
                                   }}>
                                       <div style={{color:'white', fontWeight:700, fontSize:'14px'}}>{item.title}</div>
                                       <div style={{color:'rgba(255,255,255,0.7)', fontSize:'11px', textTransform:'capitalize'}}>{item.type}</div>
                                   </div>

                                   <button style={{
                                       position:'absolute', top:'10px', right:'10px', width:'28px', height:'28px', 
                                       borderRadius:'50%', background:'white', border:'none', color:'#ef4444', 
                                       display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow:'0 2px 5px rgba(0,0,0,0.2)'
                                   }}>
                                       <Trash2 size={14} />
                                   </button>
                               </div>
                           ))}
                           
                           {/* Add Placeholder */}
                           <div style={{
                               height:'160px', borderRadius:'12px', border:'2px dashed #cbd5e1', 
                               display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                               color:'#94a3b8', cursor:'pointer', background:'#f8fafc'
                           }}>
                               <Plus size={24} />
                               <span style={{fontSize:'12px', marginTop:'5px', fontWeight:600}}>Add Slot</span>
                           </div>
                       </div>
                   </div>
               )}

               {/* TAB: BRANDING */}
               {activeTab === 'branding' && (
                   <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'30px'}}>
                       <div className="section-card" style={{padding:'25px', background:'white', borderRadius:'12px', border:'1px solid #e2e8f0'}}>
                           <h3 style={{marginTop:0, display:'flex', alignItems:'center', gap:'10px'}}>
                               <Type size={18} /> App Identity
                           </h3>
                           
                           <div style={{marginBottom:'15px'}}>
                               <label style={{display:'block', fontSize:'13px', fontWeight:600, marginBottom:'5px', color:'#64748b'}}>Application Name</label>
                               <input value={branding.appName} onChange={(e) => setBranding({...branding, appName: e.target.value})} 
                                      className="pro-input" style={{width:'100%', padding:'10px', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'8px'}} />
                           </div>
                           
                           <div style={{marginBottom:'15px'}}>
                               <label style={{display:'block', fontSize:'13px', fontWeight:600, marginBottom:'5px', color:'#64748b'}}>Primary Color</label>
                               <div style={{display:'flex', gap:'10px'}}>
                                   <input type="color" value={branding.primaryColor} onChange={(e) => setBranding({...branding, primaryColor: e.target.value})} 
                                          style={{width:'40px', height:'40px', padding:0, border:'none', borderRadius:'8px', cursor:'pointer'}} />
                                   <input value={branding.primaryColor} onChange={(e) => setBranding({...branding, primaryColor: e.target.value})} 
                                      className="pro-input" style={{flex:1, padding:'10px', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'8px', textTransform:'uppercase'}} />
                               </div>
                           </div>
                       </div>

                       <div className="section-card" style={{padding:'25px', background:'white', borderRadius:'12px', border:'1px solid #e2e8f0'}}>
                           <h3 style={{marginTop:0, display:'flex', alignItems:'center', gap:'10px'}}>
                               <ImageIcon size={18} /> Logos
                           </h3>
                           
                           <div style={{marginBottom:'20px'}}>
                               <label style={{display:'block', fontSize:'13px', fontWeight:600, marginBottom:'5px', color:'#64748b'}}>Main Logo (Dark Mode)</label>
                               <div style={{padding:'20px', background:'#0f172a', borderRadius:'8px', border:'2px dashed #334155', textAlign:'center', cursor:'pointer'}}>
                                   <div style={{color:'#94a3b8', fontSize:'12px'}}>Click to upload PNG</div>
                               </div>
                           </div>

                           <div>
                               <label style={{display:'block', fontSize:'13px', fontWeight:600, marginBottom:'5px', color:'#64748b'}}>Favicon</label>
                               <div style={{padding:'20px', background:'#f1f5f9', borderRadius:'8px', border:'2px dashed #cbd5e1', textAlign:'center', cursor:'pointer'}}>
                                    <div style={{color:'#94a3b8', fontSize:'12px'}}>Click to upload ICO</div>
                               </div>
                           </div>
                       </div>
                   </div>
               )}

           </div>
       </main>
    </div>
  );
}
