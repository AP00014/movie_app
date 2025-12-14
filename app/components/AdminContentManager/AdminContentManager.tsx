"use client";

import { useState } from 'react';
import { 
  Plus, X, Film, Video, Music, MonitorPlay, Zap
} from 'lucide-react';
import '@/app/admin/AdminLayout.css';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';

interface Props {
  contentType: string;
  title: string;
  addPath?: string; // If provided, button redirects instead of opening modal
}

export default function AdminContentManager({ contentType, title, addPath }: Props) {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
      title: '',
      type: contentType,
      genre: '',
      releaseYear: new Date().getFullYear(),
      thumbnailUrl: '',
      videoUrl: '',
      description: ''
  });

  const [contentList, setContentList] = useState<any[]>([]);

  const handleInputChange = (e: any) => {
      const { name, value } = e.target;
      setFormData(prev => ({...prev, [name]: value}));
  };

  const handleSubmit = async (e: any) => {
      e.preventDefault();
      console.log(`Submitting ${contentType}:`, formData);
      
      const newItem = {
          id: Math.random().toString(36).substr(2, 9),
          ...formData, // uses current state, which defaults type to props.contentType
          created_at: new Date().toISOString(),
          status: 'draft'
      };
      
      setContentList([newItem, ...contentList]);
      setIsModalOpen(false);
      // Reset form but keep type fixed
      setFormData({
        title: '', type: contentType, genre: '', releaseYear: new Date().getFullYear(),
        thumbnailUrl: '', videoUrl: '', description: ''
      });
  };

  return (
    <>
       <header className="admin-header">
           <div className="page-title">{title}</div>
           <div className="header-actions">
               <div style={{display:'flex', gap:'10px'}}>
                   {addPath ? (
                        <Link href={addPath} className="header-btn" 
                           style={{width:'auto', padding:'0 20px', background:'#3b82f6', color:'white', border:'none', borderRadius:'8px', fontWeight:600, gap:'8px', display:'flex', alignItems:'center', textDecoration:'none', fontSize:'14px'}}>
                           <Plus size={18} /> Add {contentType}
                        </Link>
                   ) : (
                       <button className="header-btn" onClick={() => setIsModalOpen(true)} 
                               style={{width:'auto', padding:'0 20px', background:'#3b82f6', color:'white', border:'none', borderRadius:'8px', fontWeight:600, gap:'8px'}}>
                           <Plus size={18} /> Add {contentType}
                       </button>
                   )}
               </div>
               <Link href="/account" className="user-snippet">
                    <div className="snippet-avatar">
                        {user?.user_metadata?.full_name?.[0] || 'A'}
                    </div>
               </Link>
           </div>
       </header>

       <div className="content-section">
           <div className="section-header">
                <h2 className="section-title" style={{textTransform:'capitalize'}}>{title} List</h2>
           </div>
           
           <div className="table-header" style={{gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr'}}>
               <div>Format</div>
               <div>Title & Genre</div>
               <div>Release</div>
               <div>Status</div>
               <div>Actions</div>
           </div>

           {contentList.length > 0 ? contentList.map((item) => (
               <div className="table-row" key={item.id} style={{gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr'}}>
                   <div><TypeBadge type={contentType} /></div>
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
                   <div>No {contentType} content found.</div>
                   {addPath ? (
                       <Link href={addPath} style={{marginTop:'15px', display:'inline-block', color:'#3b82f6', cursor:'pointer', textDecoration:'underline'}}>
                           Add first {contentType}
                       </Link>
                   ) : (
                       <button onClick={() => setIsModalOpen(true)} style={{marginTop:'15px', color:'#3b82f6', background:'none', border:'none', cursor:'pointer', textDecoration:'underline'}}>
                           Add first {contentType}
                       </button>
                   )}
               </div>
           )}
       </div>

       {/* Add Content Modal */}
       {isModalOpen && (
           <div style={{
               position:'fixed', top:0, left:0, width:'100%', height:'100%', 
               background:'rgba(0,0,0,0.5)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center',
               backdropFilter:'blur(4px)'
           }}>
               <div style={{background:'white', width:'500px', maxWidth:'90%', borderRadius:'16px', padding:'30px', boxShadow:'0 20px 50px rgba(0,0,0,0.2)'}}>
                   <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                       <h2 style={{margin:0, fontSize:'20px'}}>Add New {contentType.charAt(0).toUpperCase() + contentType.slice(1)}</h2>
                       <button onClick={() => setIsModalOpen(false)} style={{background:'none', border:'none', cursor:'pointer'}}><X size={24} /></button>
                   </div>

                   <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:'15px'}}>
                       <div>
                           <label style={{display:'block', fontSize:'13px', fontWeight:600, marginBottom:'5px', color:'#64748b'}}>Title</label>
                           <input name="title" required value={formData.title} onChange={handleInputChange} 
                                  style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #e2e8f0', outline:'none'}} placeholder="e.g. Content Title" />
                       </div>

                       <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px'}}>
                           <div>
                               {/* Type is fixed/hidden but shown for clarity if needed, or we just rely on parent prop */}
                               <label style={{display:'block', fontSize:'13px', fontWeight:600, marginBottom:'5px', color:'#64748b'}}>Type</label>
                               <input value={contentType.toUpperCase()} disabled
                                  style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #e2e8f0', outline:'none', background:'#f8fafc', color:'#64748b'}} />
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
                                  style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #e2e8f0', outline:'none'}} placeholder="Action, Drama..." />
                       </div>

                       <div>
                           <label style={{display:'block', fontSize:'13px', fontWeight:600, marginBottom:'5px', color:'#64748b'}}>Thumbnail URL</label>
                           <input name="thumbnailUrl" value={formData.thumbnailUrl} onChange={handleInputChange}
                                  style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #e2e8f0', outline:'none'}} placeholder="https://..." />
                       </div>

                       <button type="submit" style={{marginTop:'10px', padding:'12px', background:'#3b82f6', color:'white', border:'none', borderRadius:'8px', fontWeight:700, cursor:'pointer'}}>
                           Publish {contentType}
                       </button>
                   </form>
               </div>
           </div>
       )}
    </> 
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
