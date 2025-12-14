"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { 
  Menu, ChevronLeft, Save, Upload, Music, Mic, Image as ImageIcon, 
  Play, Star, Calendar, Clock, Globe, Shield, Users, Layers, CheckCircle,
  Type, MessageSquareQuote, Percent, User, Link as LinkIcon, Hash, Sparkles, Disc, Headphones
} from 'lucide-react';
import Link from 'next/link';
import AdminSidebar from '@/app/components/AdminSidebar/AdminSidebar';
import '../../../AdminLayout.css';

// Iconic Tech Badge Component (reused style)
const TechBadge = ({ active, children, onClick }: any) => (
    <div onClick={onClick} 
         style={{
             padding:'8px 16px', borderRadius:'8px', cursor:'pointer', fontWeight:600, fontSize:'13px',
             background: active ? 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' : '#f1f5f9',
             color: active ? 'white' : '#64748b', transition:'all 0.2s ease',
             border: active ? 'none' : '1px solid #e2e8f0',
             boxShadow: active ? '0 4px 12px rgba(236, 72, 153, 0.2)' : 'none'
         }}>
        {children}
    </div>
);

export default function NewMusicPage() {
  const { user, role, isLoading } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // overview, media, visuals, people, distribution
  const [newMember, setNewMember] = useState({ name: '', role: '', imageUrl: '' });

  const addMember = () => {
    if(!newMember.name) return;
    setFormData(prev => ({
        ...prev,
        castMembers: [...prev.castMembers, { ...newMember, id: Date.now().toString() }]
    }));
    setNewMember({ name: '', role: '', imageUrl: '' });
  };

  const removeMember = (id: string) => {
      setFormData(prev => ({
          ...prev,
          castMembers: prev.castMembers.filter((c: any) => c.id !== id)
      }));
  };
  
  const [formData, setFormData] = useState({
      // Identity
      title: '', album: '', artist: '', slug: '',
      description: '', lyrics: '',
      
      // Technical & Classification
      genres: [] as string[],
      releaseDate: '', duration: '', 
      explicit: false,
      quality: '320kbps', audioFormat: 'MP3', 
      languages: '',
      moods: '', matchScore: 90,
      
      // Media
      audioUrl: '', videoUrl: '', 
      
      // Visuals
      coverArtUrl: '', bannerUrl: '', artistLogoUrl: '',
      
      // People
      composers: '', producers: '', label: '',
      castMembers: [] as {id: string, name: string, role: string, imageUrl: string}[], // Featured artists/band members
      
      // Distribution / Sections
      sections: {
          hero: false,
          trending: false,
          newArrival: true,
          editorsChoice: false
      },
      customCollections: [] as string[],
      
      status: 'released' // released, coming_soon, production
  });

  useEffect(() => {
    if (!isLoading) {
      if (!user) router.push('/');
      else if (role !== 'admin' && role !== 'superadmin') router.push('/account'); 
    }
  }, [user, role, isLoading, router]);


  const handleChange = (e: any) => {
      const { name, value } = e.target;
      setFormData(prev => ({...prev, [name]: value}));
  };
  
  const handleSectionToggle = (key: string) => {
      setFormData(prev => ({
          ...prev,
          sections: { ...prev.sections, [key as keyof typeof prev.sections]: !prev.sections[key as keyof typeof prev.sections] }
      }));
  };

  const handleSubmit = async (e: any) => {
      e.preventDefault();
      setIsSubmitting(true);
      console.log("Submitting Music Project:", formData);
      setTimeout(() => {
          setIsSubmitting(false);
          router.push('/admin/content/music');
      }, 1500);
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
            {/* Pro Header */}
            <header className="admin-header">
               <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                   <Link href="/admin/content/music" style={{display:'flex', alignItems:'center', justifyContent:'center', width:'36px', height:'36px', borderRadius:'10px', background:'white', border:'1px solid #e2e8f0', color:'#64748b', transition:'all 0.2s'}}>
                        <ChevronLeft size={20} />
                   </Link>
                   <div>
                       <div className="page-title" style={{fontSize:'20px'}}>New Music Release</div>
                       <div style={{fontSize:'12px', color:'#94a3b8', fontWeight:500}}>Upload tracks, albums, or music videos</div>
                   </div>
               </div>
               
               <div className="header-actions">
                   <button onClick={handleSubmit} disabled={isSubmitting} className="header-btn" 
                           style={{width:'auto', padding:'0 25px', background: isSubmitting ? '#94a3b8' : 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', color:'white', border:'none', borderRadius:'10px', fontWeight:600, gap:'8px', boxShadow:'0 4px 12px rgba(236, 72, 153, 0.3)'}}>
                       {isSubmitting ? 'Processing...' : <><Save size={18} /> Publish Release</>}
                   </button>
               </div>
           </header>

           {/* Tab Navigation */}
           <div className="pro-tabs-container">
               {['overview', 'media', 'visuals', 'credits', 'distribution'].map(tab => (
                   <button 
                       key={tab}
                       onClick={() => setActiveTab(tab)}
                       className="pro-tab"
                       style={{
                           borderBottom: activeTab === tab ? '3px solid #ec4899' : '3px solid transparent',
                           color: activeTab === tab ? '#ec4899' : '#64748b',
                           fontWeight: activeTab === tab ? 700 : 600,
                           textTransform: 'capitalize'
                       }}
                   >
                       {tab}
                   </button>
               ))}
           </div>

           <div className="content-section" style={{maxWidth:'1200px', margin:'0 auto'}}>
               <form onSubmit={handleSubmit}>
                   
                   {/* TAB: OVERVIEW */}
                   {activeTab === 'overview' && (
                       <div className="pro-grid-2-1">
                           <div style={{display:'flex', flexDirection:'column', gap:'25px'}}>
                               <ProSection icon={Disc} title="Track Identity">
                                   <div className="form-group">
                                       <Label>Track Title</Label>
                                       <Input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Blinding Lights" required icon={Type} />
                                   </div>
                                   <div className="form-group">
                                       <Label>Main Artist</Label>
                                       <Input name="artist" value={formData.artist} onChange={handleChange} placeholder="e.g. The Weeknd" icon={Mic} />
                                   </div>
                                   <div className="form-group">
                                       <Label>Album Name</Label>
                                       <Input name="album" value={formData.album} onChange={handleChange} placeholder="e.g. After Hours" icon={Disc} />
                                   </div>
                                   <div className="form-group">
                                       <Label>Description / Liner Notes</Label>
                                       <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="pro-input" placeholder="About this track..." />
                                   </div>
                                   <div className="form-group">
                                        <Label>Lyrics</Label>
                                        <textarea name="lyrics" value={formData.lyrics} onChange={handleChange} rows={6} className="pro-input" placeholder="I've been tryna call..." />
                                   </div>
                               </ProSection>
                           </div>

                           <div style={{display:'flex', flexDirection:'column', gap:'25px'}}>
                               <ProSection icon={Globe} title="Classification">
                                    <div className="form-group">
                                       <Label>Primary Genre</Label>
                                       <Input name="genres" value={formData.genres} onChange={handleChange} placeholder="Pop, R&B, Rock" icon={Hash} />
                                   </div>
                                   <div className="pro-grid-2">
                                       <div className="form-group">
                                           <Label>Moods</Label>
                                           <Input name="moods" value={formData.moods} onChange={handleChange} placeholder="Energetic, Chill" icon={Sparkles} />
                                       </div>
                                       <div className="form-group">
                                           <Label>Match Score (%)</Label>
                                           <Input type="number" name="matchScore" value={formData.matchScore} onChange={handleChange} icon={Percent} />
                                       </div>
                                   </div>
                                   <div className="pro-grid-2">
                                       <div>
                                           <Label>Release Date</Label>
                                           <Input type="date" name="releaseDate" value={formData.releaseDate} onChange={handleChange} icon={Calendar} />
                                       </div>
                                       <div>
                                           <Label>Duration</Label>
                                           <Input name="duration" value={formData.duration} onChange={handleChange} placeholder="3:20" icon={Clock} />
                                       </div>
                                   </div>
                                   <div className="pro-grid-2">
                                        <div>
                                           <Label>Content Rating</Label>
                                           <select name="explicit" value={formData.explicit ? 'explicit' : 'clean'} onChange={(e:any) => setFormData(prev => ({...prev, explicit: e.target.value === 'explicit'}))} className="pro-select">
                                               <option value="clean">Clean / Radio Edit</option>
                                               <option value="explicit">Explicit (E)</option>
                                           </select>
                                        </div>
                                        <div>
                                           <Label>Status</Label>
                                           <select name="status" value={formData.status} onChange={handleChange} className="pro-select">
                                               <option value="released">Released</option>
                                               <option value="coming_soon">Pre-Order / Upcoming</option>
                                           </select>
                                        </div>
                                   </div>
                               </ProSection>
                           </div>
                       </div>
                   )}

                   {/* TAB: MEDIA */}
                   {activeTab === 'media' && (
                       <div style={{display:'flex', flexDirection:'column', gap:'30px'}}>
                           <ProSection icon={Play} title="Audio & Video Sources">
                               <div className="form-group">
                                   <Label>Audio File Path (MP3/WAV)</Label>
                                   <div style={{display:'flex', gap:'10px'}}>
                                        <div style={{flex:1}}>
                                            <Input name="audioUrl" value={formData.audioUrl} onChange={handleChange} placeholder="https://..." icon={LinkIcon} />
                                        </div>
                                        <button type="button" className="secondary-btn">Upload Audio</button>
                                   </div>
                               </div>
                               <div className="form-group">
                                   <Label>Music Video URL (Optional)</Label>
                                   <div style={{display:'flex', gap:'10px'}}>
                                        <div style={{flex:1}}>
                                           <Input name="videoUrl" value={formData.videoUrl} onChange={handleChange} placeholder="https://youtube.com/..." icon={LinkIcon} />
                                        </div>
                                        <button type="button" className="secondary-btn">Fetch Info</button>
                                   </div>
                               </div>
                           </ProSection>

                           <ProSection icon={Headphones} title="Technical Specs">
                               <div className="pro-grid-2" style={{gap:'20px'}}>
                                   <div>
                                       <Label>Audio Bitrate</Label>
                                       <select name="quality" value={formData.quality} onChange={handleChange} className="pro-select">
                                           <option>320kbps (High)</option>
                                           <option>256kbps (Standard)</option>
                                           <option>Lossless (FLAC/WAV)</option>
                                       </select>
                                   </div>
                                   <div>
                                       <Label>File Format</Label>
                                       <select name="audioFormat" value={formData.audioFormat} onChange={handleChange} className="pro-select">
                                           <option>MP3</option>
                                           <option>FLAC</option>
                                           <option>WAV</option>
                                           <option>AAC</option>
                                       </select>
                                   </div>
                                   <div className="form-group">
                                       <Label>Record Label</Label>
                                       <Input name="label" value={formData.label} onChange={handleChange} placeholder="Major Label / Indie" icon={Globe} />
                                   </div>
                                   <div className="form-group">
                                       <Label>Language</Label>
                                       <Input name="languages" value={formData.languages} onChange={handleChange} placeholder="English..." icon={MessageSquareQuote} />
                                   </div>
                               </div>
                           </ProSection>
                       </div>
                   )}

                   {/* TAB: VISUALS */}
                   {activeTab === 'visuals' && (
                       <div className="pro-visuals-grid">
                           <ProSection icon={ImageIcon} title="Artwork">
                                <Label>Album Art (Square 1:1)</Label>
                                <Dropzone label="Upload Album Cover" aspect="square" name="coverArtUrl" />
                                
                                <div style={{width:'100%', height:'20px'}}></div>
                                
                                <Label>Artist Logo (Transparent)</Label>
                                <Dropzone label="Upload Logo" name="artistLogoUrl" />
                           </ProSection>

                           <ProSection icon={Layers} title="Banners & Assets">
                                <Label>Artist Banner (Horizontal)</Label>
                                <Dropzone label="Upload Wide Banner" aspect="video" name="bannerUrl" />
                           </ProSection>
                       </div>
                   )}

                   {/* TAB: PEOPLE / CREDITS */}
                   {activeTab === 'credits' && (
                       <ProSection icon={Users} title="Credits & Feature">
                           <div className="form-group">
                               <Label>Producers</Label>
                                <Input name="producers" value={formData.producers} onChange={handleChange} placeholder="Producer Names" icon={User} />
                           </div>
                           <div className="form-group">
                               <Label>Composers / Writers</Label>
                               <Input name="composers" value={formData.composers} onChange={handleChange} icon={Users} />
                           </div>
                           
                           <div style={{marginTop:'20px', paddingTop:'20px', borderTop:'1px solid #e2e8f0'}}>
                               <Label>Featured Artists / Band Members</Label>
                               
                               {/* Add New Member Row */}
                               <div style={{display:'flex', gap:'15px', alignItems:'flex-end', marginBottom:'20px', background:'#f8fafc', padding:'15px', borderRadius:'12px'}}>
                                   <div style={{flex:1}}>
                                       <label style={{fontSize:'11px', fontWeight:600, color:'#64748b', marginBottom:'4px', display:'block'}}>Artist Name</label>
                                       <Input value={newMember.name} onChange={(e:any) => setNewMember({...newMember, name: e.target.value})} placeholder="e.g. Daft Punk" style={{background:'white'}} icon={User} />
                                   </div>
                                   <div style={{flex:1}}>
                                       <label style={{fontSize:'11px', fontWeight:600, color:'#64748b', marginBottom:'4px', display:'block'}}>Role (Feat, Vocals, etc)</label>
                                       <Input value={newMember.role} onChange={(e:any) => setNewMember({...newMember, role: e.target.value})} placeholder="e.g. Feature" style={{background:'white'}} icon={LinkIcon} />
                                   </div>
                                   <div style={{flex:1}}>
                                       <label style={{fontSize:'11px', fontWeight:600, color:'#64748b', marginBottom:'4px', display:'block'}}>Avatar URL</label>
                                       <Input value={newMember.imageUrl} onChange={(e:any) => setNewMember({...newMember, imageUrl: e.target.value})} placeholder="https://..." style={{background:'white'}} icon={LinkIcon} />
                                   </div>
                                   <button type="button" onClick={addMember} style={{background:'#ec4899', color:'white', border:'none', borderRadius:'10px', width:'42px', height:'42px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer'}}>
                                       <CheckCircle size={20} />
                                   </button>
                               </div>

                               {/* Member Grid */}
                               <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px, 1fr))', gap:'30px'}}>
                                   {formData.castMembers?.map((member: any) => (
                                       <div key={member.id} style={{textAlign:'center', position:'relative'}}>
                                            <div style={{width:'80px', height:'80px', borderRadius:'50%', margin:'0 auto 10px', overflow:'hidden', background:'#e2e8f0', border:'2px solid white', boxShadow:'0 4px 10px rgba(0,0,0,0.1)'}}>
                                                {member.imageUrl ? <img src={member.imageUrl} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <Users size={32} style={{margin:'24px', color:'#94a3b8'}} />}
                                            </div>
                                            <div style={{fontWeight:700, fontSize:'13px', color:'#0f172a'}}>{member.name}</div>
                                            <div style={{fontSize:'11px', color:'#64748b'}}>{member.role}</div>
                                            <button type="button" onClick={() => removeMember(member.id)} 
                                                    style={{position:'absolute', top:'0', right:'10px', background:'white', border:'1px solid #fee2e2', borderRadius:'50%', width:'24px', height:'24px', color:'#ef4444', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow:'0 2px 5px rgba(0,0,0,0.05)'}}>
                                                ×
                                            </button>
                                       </div>
                                   ))}
                               </div>
                           </div>
                       </ProSection>
                   )}

                    {/* TAB: DISTRIBUTION */}
                    {activeTab === 'distribution' && (
                       <ProSection icon={Globe} title="Distribution Channels">
                           <div className="pro-grid-2">
                               <div className="section-card" onClick={() => handleSectionToggle('hero')} 
                                    style={{padding:'20px', border: formData.sections.hero ? '2px solid #ec4899' : '1px solid #e2e8f0', background: formData.sections.hero ? '#fdf2f8' : 'white', borderRadius:'12px', cursor:'pointer'}}>
                                   <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                                        <Label>Home Hero Carousel</Label>
                                        <div style={{width:'20px', height:'20px', borderRadius:'50%', border: formData.sections.hero?'none':'2px solid #cbd5e1', background:formData.sections.hero?'#ec4899':'none', display:'flex', alignItems:'center', justifyContent:'center'}}>
                                            {formData.sections.hero && <CheckCircle size={14} color="white" />}
                                        </div>
                                   </div>
                                   <p style={{fontSize:'12px', color:'#64748b'}}>Pin this release to the main landing slider.</p>
                               </div>
                               <div className="section-card" onClick={() => handleSectionToggle('trending')} 
                                    style={{padding:'20px', border: formData.sections.trending ? '2px solid #ec4899' : '1px solid #e2e8f0', background: formData.sections.trending ? '#fdf2f8' : 'white', borderRadius:'12px', cursor:'pointer'}}>
                                   <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                                        <Label>Trending Now</Label>
                                        <div style={{width:'20px', height:'20px', borderRadius:'50%', border: formData.sections.trending?'none':'2px solid #cbd5e1', background:formData.sections.trending?'#ec4899':'none', display:'flex', alignItems:'center', justifyContent:'center'}}>
                                            {formData.sections.trending && <CheckCircle size={14} color="white" />}
                                        </div>
                                   </div>
                                   <p style={{fontSize:'12px', color:'#64748b'}}>Boost visibility in the trending charts.</p>
                               </div>
                               <div className="section-card" onClick={() => handleSectionToggle('newArrival')} 
                                    style={{padding:'20px', border: formData.sections.newArrival ? '2px solid #ec4899' : '1px solid #e2e8f0', background: formData.sections.newArrival ? '#fdf2f8' : 'white', borderRadius:'12px', cursor:'pointer'}}>
                                   <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                                        <Label>New Releases</Label>
                                        <div style={{width:'20px', height:'20px', borderRadius:'50%', border: formData.sections.newArrival?'none':'2px solid #cbd5e1', background:formData.sections.newArrival?'#ec4899':'none', display:'flex', alignItems:'center', justifyContent:'center'}}>
                                            {formData.sections.newArrival && <CheckCircle size={14} color="white" />}
                                        </div>
                                   </div>
                                   <p style={{fontSize:'12px', color:'#64748b'}}>Feature in the 'Fresh Drops' row.</p>
                               </div>
                               <div className="section-card" onClick={() => handleSectionToggle('editorsChoice')} 
                                    style={{padding:'20px', border: formData.sections.editorsChoice ? '2px solid #ec4899' : '1px solid #e2e8f0', background: formData.sections.editorsChoice ? '#fdf2f8' : 'white', borderRadius:'12px', cursor:'pointer'}}>
                                   <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                                        <Label>Editor's Choice</Label>
                                        <div style={{width:'20px', height:'20px', borderRadius:'50%', border: formData.sections.editorsChoice?'none':'2px solid #cbd5e1', background:formData.sections.editorsChoice?'#ec4899':'none', display:'flex', alignItems:'center', justifyContent:'center'}}>
                                            {formData.sections.editorsChoice && <CheckCircle size={14} color="white" />}
                                        </div>
                                   </div>
                                   <p style={{fontSize:'12px', color:'#64748b'}}>Curated highlight badge.</p>
                               </div>
                           </div>
                           
                           <div style={{marginTop:'30px', paddingTop:'30px', borderTop:'1px solid #e2e8f0'}}>
                               <Label>Custom Collections (Tags)</Label>
                               <div style={{display:'flex', gap:'10px', marginBottom:'15px'}}>
                                   <Input placeholder="e.g. Summer Hits, Workout"  id="collectionInput" 
                                          onKeyDown={(e: any) => {
                                              if (e.key === 'Enter') {
                                                  e.preventDefault();
                                                  const val = e.currentTarget.value.trim();
                                                  if (val && !formData.customCollections?.includes(val)) {
                                                      setFormData(prev => ({...prev, customCollections: [...(prev.customCollections || []), val]}));
                                                      e.currentTarget.value = '';
                                                  }
                                              }
                                          }} 
                                   />
                                   <button type="button" className="secondary-btn" onClick={() => {
                                        const input = document.getElementById('collectionInput') as HTMLInputElement;
                                        const val = input.value.trim();
                                        if (val && !formData.customCollections?.includes(val)) {
                                            setFormData(prev => ({...prev, customCollections: [...(prev.customCollections || []), val]}));
                                            input.value = '';
                                        }
                                   }}>Add Tag</button>
                               </div>
                               <div style={{display:'flex', flexWrap:'wrap', gap:'10px'}}>
                                   {formData.customCollections?.map((col: string) => (
                                       <span key={col} style={{display:'flex', alignItems:'center', gap:'6px', padding:'6px 14px', background:'#fdf2f8', color:'#ec4899', borderRadius:'20px', fontSize:'13px', fontWeight:600}}>
                                           {col}
                                           <button type="button" onClick={() => setFormData(prev => ({...prev, customCollections: prev.customCollections.filter((c: string) => c !== col)}))} 
                                                   style={{background:'none', border:'none', cursor:'pointer', color:'#ec4899', display:'flex', alignItems:'center'}}>
                                               ×
                                           </button>
                                       </span>
                                   ))}
                                   {!formData.customCollections?.length && <span style={{fontSize:'13px', color:'#94a3b8', fontStyle:'italic'}}>No custom tags added.</span>}
                               </div>
                           </div>
                       </ProSection>
                   )}

               </form>
           </div>
       </main>
    </div>
  );
}

// UI Components
const ProSection = ({icon: Icon, title, children}: any) => (
    <section style={{background:'white', padding:'30px', borderRadius:'16px', border:'1px solid #e2e8f0', boxShadow:'0 2px 10px rgba(0,0,0,0.02)'}}>
        <h3 style={{marginTop:0, marginBottom:'25px', fontSize:'16px', fontWeight:700, display:'flex', alignItems:'center', gap:'10px', color:'#0f172a'}}>
            <div style={{padding:'8px', background:'#f1f5f9', borderRadius:'8px', color:'#ec4899'}}><Icon size={18} /></div>
            {title}
        </h3>
        {children}
    </section>
);

const Label = ({children}: any) => (
    <label style={{display:'block', marginBottom:'8px', fontSize:'13px', fontWeight:600, color:'#475569', letterSpacing:'0.02em'}}>{children}</label>
);

const Input = ({icon: Icon, ...props}: any) => (
    <div className={Icon ? "icon-input-wrapper" : ""}>
        {Icon && <Icon size={18} />}
        <input {...props} className="pro-input" style={props.style} />
    </div>
);

const Dropzone = ({label, aspect, name}: any) => (
    <div style={{
        border:'2px dashed #cbd5e1', borderRadius:'12px', padding:'30px', textAlign:'center', cursor:'pointer', background:'#f8fafc',
        aspectRatio: aspect === 'square' ? '1/1' : (aspect === 'video' ? '16/9' : '2/3'), display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', transition:'all 0.2s'
    }} className="hover-dashed">
        <div style={{width:'50px', height:'50px', borderRadius:'50%', background:'#e2e8f0', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'15px'}}>
            <Upload size={24} style={{color:'#64748b'}} />
        </div>
        <div style={{fontSize:'13px', color:'#475569', fontWeight:600}}>{label}</div>
        <div style={{fontSize:'11px', color:'#94a3b8', marginTop:'5px'}}>Drag & Drop or Click</div>
    </div>
);
