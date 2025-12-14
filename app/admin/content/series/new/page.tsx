"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { 
  Menu, ChevronLeft, Save, Upload, Tv, FileText, Image as ImageIcon, 
  Play, Star, Calendar, Clock, Globe, Shield, Users, Layers, CheckCircle, Mic,
  Type, MessageSquareQuote, Percent, User, UserCog, Link as LinkIcon, Hash, Sparkles,
  Plus, Trash2, ChevronDown, ChevronRight, Trophy
} from 'lucide-react';
import Link from 'next/link';
import AdminSidebar from '@/app/components/AdminSidebar/AdminSidebar';
import '../../../AdminLayout.css';

// Types for Series Structure
interface Episode {
    id: string;
    episodeNumber: number;
    title: string;
    duration: string;
    description: string;
    thumbnailUrl: string;
    videoUrl: string;
}

interface Season {
    id: string;
    seasonNumber: number;
    episodes: Episode[];
    isExpanded?: boolean; // UI state
}

export default function NewSeriesPage() {
  const { user, role, isLoading } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); 
  
  // Cast Management State
  const [newCast, setNewCast] = useState({ name: '', role: '', imageUrl: '' });

  // Episode Management State
  const [activeSeasonId, setActiveSeasonId] = useState<string | null>(null);
  const [newEpisode, setNewEpisode] = useState<Partial<Episode>>({
      title: '', duration: '', description: '', thumbnailUrl: '', videoUrl: ''
  });

  const [formData, setFormData] = useState({
      // Identity
      title: '', tagline: '', originalTitle: '', slug: '',
      description: '', fullPlot: '',
      
      // Technical & Classification
      genres: [] as string[],
      releaseDate: '', 
      avgDuration: '', // Avg duration per ep
      rating: '', ratingReason: '',
      quality: '4K', audioFormat: 'Dolby Atmos', 
      audioLanguages: '', subtitleLanguages: '',
      moods: '', 
      matchScore: 90,
      rank: '', // e.g. "#1 in TV Shows"
      
      // Visuals
      posterUrl: '', bannerUrl: '', titleLogoUrl: '', thumbnailUrl: '',
      
      // People
      director: '', writers: '', producers: '', 
      castMembers: [] as {id: string, name: string, role: string, imageUrl: string}[],
      
      // Series Structure
      seasons: [] as Season[],

      // Distribution / Sections
      sections: {
          hero: false,
          trending: false,
          newArrival: true,
          editorsChoice: false
      },
      customCollections: [] as string[],
      
      status: 'released' // released, coming_soon, ended, production
  });

  useEffect(() => {
    if (!isLoading) {
      if (!user) router.push('/');
      else if (role !== 'admin' && role !== 'superadmin') router.push('/account'); 
      
      // Initialize with Season 1 if empty
      if (formData.seasons.length === 0) {
          addSeason();
      }
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

  // --- Cast Logic ---
  const addCastMember = () => {
    if(!newCast.name) return;
    setFormData(prev => ({
        ...prev,
        castMembers: [...prev.castMembers, { ...newCast, id: Date.now().toString() }]
    }));
    setNewCast({ name: '', role: '', imageUrl: '' });
  };

  const removeCastMember = (id: string) => {
      setFormData(prev => ({
          ...prev,
          castMembers: prev.castMembers.filter((c: any) => c.id !== id)
      }));
  };

  // --- Season/Episode Logic ---
  const addSeason = () => {
      setFormData(prev => {
          const nextNum = prev.seasons.length + 1;
          const newSeason: Season = {
              id: Date.now().toString(),
              seasonNumber: nextNum,
              episodes: [],
              isExpanded: true
          };
          // Collapse others
          const updatedSeasons = prev.seasons.map(s => ({...s, isExpanded: false}));
          return { ...prev, seasons: [...updatedSeasons, newSeason] };
      });
  };

  const toggleSeason = (id: string) => {
      setFormData(prev => ({
          ...prev,
          seasons: prev.seasons.map(s => s.id === id ? { ...s, isExpanded: !s.isExpanded } : s)
      }));
      setActiveSeasonId(id);
  };

  const addEpisodeToSeason = (seasonId: string) => {
      if (!newEpisode.title) return;
      setFormData(prev => ({
          ...prev,
          seasons: prev.seasons.map(s => {
              if (s.id === seasonId) {
                  const nextEpNum = s.episodes.length + 1;
                  const ep: Episode = {
                      id: Date.now().toString(),
                      episodeNumber: nextEpNum,
                      title: newEpisode.title || `Episode ${nextEpNum}`,
                      duration: newEpisode.duration || '45m',
                      description: newEpisode.description || '',
                      thumbnailUrl: newEpisode.thumbnailUrl || '',
                      videoUrl: newEpisode.videoUrl || ''
                  };
                  return { ...s, episodes: [...s.episodes, ep] };
              }
              return s;
          })
      }));
      setNewEpisode({ title: '', duration: '', description: '', thumbnailUrl: '', videoUrl: '' });
  };

  const removeEpisode = (seasonId: string, episodeId: string) => {
      setFormData(prev => ({
          ...prev,
          seasons: prev.seasons.map(s => {
              if (s.id === seasonId) {
                  return { ...s, episodes: s.episodes.filter(e => e.id !== episodeId) };
              }
              return s;
          })
      }));
  };

  const handleSubmit = async (e: any) => {
      e.preventDefault();
      setIsSubmitting(true);
      console.log("Submitting Complex Series:", formData);
      setTimeout(() => {
          setIsSubmitting(false);
          router.push('/admin/content/series');
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
                   <Link href="/admin/content/series" style={{display:'flex', alignItems:'center', justifyContent:'center', width:'36px', height:'36px', borderRadius:'10px', background:'white', border:'1px solid #e2e8f0', color:'#64748b', transition:'all 0.2s'}}>
                        <ChevronLeft size={20} />
                   </Link>
                   <div>
                       <div className="page-title" style={{fontSize:'20px'}}>New Series Project</div>
                       <div style={{fontSize:'12px', color:'#94a3b8', fontWeight:500}}>Create a grand episodic legend</div>
                   </div>
               </div>
               
               <div className="header-actions">
                   <button onClick={handleSubmit} disabled={isSubmitting} className="header-btn" 
                           style={{width:'auto', padding:'0 25px', background: isSubmitting ? '#94a3b8' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color:'white', border:'none', borderRadius:'10px', fontWeight:600, gap:'8px', boxShadow:'0 4px 12px rgba(37, 99, 235, 0.3)'}}>
                       {isSubmitting ? 'Processing...' : <><Save size={18} /> Publish Series</>}
                   </button>
               </div>
           </header>

           {/* Tab Navigation */}
           <div className="pro-tabs-container">
               {['overview', 'seasons', 'visuals', 'people', 'distribution'].map(tab => (
                   <button 
                       key={tab}
                       onClick={() => setActiveTab(tab)}
                       className="pro-tab"
                       style={{
                           borderBottom: activeTab === tab ? '3px solid #3b82f6' : '3px solid transparent',
                           color: activeTab === tab ? '#3b82f6' : '#64748b',
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
                               <ProSection icon={Tv} title="Identity">
                                   <div className="form-group">
                                       <Label>Series Title</Label>
                                       <Input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Stranger Things" required icon={Type} />
                                   </div>
                                   <div className="form-group">
                                       <Label>Tagline</Label>
                                       <Input name="tagline" value={formData.tagline} onChange={handleChange} placeholder="e.g. One summer can change everything" icon={MessageSquareQuote} />
                                   </div>
                                    <div className="form-group">
                                       <Label>Global Rank (Optional)</Label>
                                       <Input name="rank" value={formData.rank} onChange={handleChange} placeholder="e.g. #1 in Global TV" icon={Trophy} />
                                   </div>
                                   <div className="form-group">
                                       <Label>Synopsis (Short)</Label>
                                       <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="pro-input" placeholder="Brief summary for listings..." />
                                   </div>
                                   <div className="form-group">
                                        <Label>Full Plot (Long)</Label>
                                        <textarea name="fullPlot" value={formData.fullPlot} onChange={handleChange} rows={6} className="pro-input" placeholder="Detailed storyline..." />
                                   </div>
                               </ProSection>
                           </div>

                           <div style={{display:'flex', flexDirection:'column', gap:'25px'}}>
                               <ProSection icon={Globe} title="Classification">
                                    <div className="form-group">
                                       <Label>Primary Genre</Label>
                                       <Input name="genres" value={formData.genres} onChange={handleChange} placeholder="Sci-Fi" icon={Hash} />
                                   </div>
                                   <div className="pro-grid-2">
                                       <div className="form-group">
                                           <Label>Moods (Comma separated)</Label>
                                           <Input name="moods" value={formData.moods} onChange={handleChange} placeholder="Spooky, 80s, Teen" icon={Sparkles} />
                                       </div>
                                       <div className="form-group">
                                           <Label>Match Score (%)</Label>
                                           <Input type="number" name="matchScore" value={formData.matchScore} onChange={handleChange} icon={Percent} />
                                       </div>
                                   </div>
                                   <div className="pro-grid-2">
                                       <div>
                                           <Label>Premiere Date</Label>
                                           <Input type="date" name="releaseDate" value={formData.releaseDate} onChange={handleChange} icon={Calendar} />
                                       </div>
                                       <div>
                                           <Label>Avg. Ep Duration</Label>
                                           <Input name="avgDuration" value={formData.avgDuration} onChange={handleChange} placeholder="45m" icon={Clock} />
                                       </div>
                                   </div>
                                   <div className="pro-grid-2">
                                        <div>
                                           <Label>Maturity Rating</Label>
                                           <select name="rating" value={formData.rating} onChange={handleChange} className="pro-select">
                                               <option>TV-14</option>
                                               <option>TV-MA</option>
                                               <option>TV-PG</option>
                                           </select>
                                        </div>
                                        <div>
                                           <Label>Status</Label>
                                           <select name="status" value={formData.status} onChange={handleChange} className="pro-select">
                                               <option value="released">Ongoing</option>
                                               <option value="coming_soon">Coming Soon</option>
                                               <option value="ended">Ended</option>
                                               <option value="production">In Production</option>
                                           </select>
                                        </div>
                                   </div>
                               </ProSection>

                               <ProSection icon={Mic} title="Technical Specs">
                                   <div className="pro-grid-2">
                                       <div>
                                           <Label>Visual Quality</Label>
                                           <select name="quality" value={formData.quality} onChange={handleChange} className="pro-select">
                                               <option>4K Ultra HD</option>
                                               <option>1080p Full HD</option>
                                               <option>720p HD</option>
                                           </select>
                                       </div>
                                       <div>
                                           <Label>Audio</Label>
                                           <select name="audioFormat" value={formData.audioFormat} onChange={handleChange} className="pro-select">
                                               <option>Dolby Atmos</option>
                                               <option>5.1 Surround</option>
                                           </select>
                                       </div>
                                   </div>
                                   <div className="form-group">
                                       <Label>Audio Languages</Label>
                                       <Input name="audioLanguages" value={formData.audioLanguages} onChange={handleChange} placeholder="English, Spanish..." icon={Globe} />
                                   </div>
                                   <div className="form-group">
                                       <Label>Subtitles</Label>
                                       <Input name="subtitleLanguages" value={formData.subtitleLanguages} onChange={handleChange} icon={FileText} />
                                   </div>
                               </ProSection>
                           </div>
                       </div>
                   )}

                   {/* TAB: SEASONS (NEW) */}
                   {activeTab === 'seasons' && (
                       <ProSection icon={Layers} title="Seasons & Episodes">
                           <div style={{marginBottom:'25px'}}>
                               <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'15px'}}>
                                    <Label>Series Structure</Label>
                                    <button type="button" onClick={addSeason} className="secondary-btn" style={{fontSize:'12px'}}>
                                        <Plus size={14} /> Add Season {formData.seasons.length + 1}
                                    </button>
                               </div>

                               {formData.seasons.map((season) => (
                                   <div key={season.id} style={{border:'1px solid #e2e8f0', borderRadius:'12px', marginBottom:'15px', overflow:'hidden'}}>
                                       <div 
                                            onClick={() => toggleSeason(season.id)}
                                            style={{
                                                padding:'15px 20px', background:'#f8fafc', display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer', borderBottom: season.isExpanded ? '1px solid #e2e8f0' : 'none'
                                            }}
                                       >
                                           <div style={{display:'flex', alignItems:'center', gap:'10px', fontWeight:700, color:'#0f172a'}}>
                                               <ChevronRight size={18} style={{transform: season.isExpanded ? 'rotate(90deg)' : 'none', transition:'transform 0.2s'}} />
                                               Season {season.seasonNumber}
                                               <span style={{fontSize:'12px', fontWeight:500, color:'#64748b', marginLeft:'10px'}}>({season.episodes.length} Episodes)</span>
                                           </div>
                                           {/* Actions for Season (Delete?) could go here */}
                                       </div>

                                       {season.isExpanded && (
                                           <div style={{padding:'20px', background:'white'}}>
                                               {/* Existing Episodes List */}
                                               {season.episodes.map((ep) => (
                                                   <div key={ep.id} style={{display:'flex', alignItems:'center', gap:'15px', padding:'10px', border:'1px solid #f1f5f9', borderRadius:'8px', marginBottom:'10px'}}>
                                                       <div style={{width:'50px', height:'30px', background:'#e2e8f0', borderRadius:'4px', overflow:'hidden'}}>
                                                           {ep.thumbnailUrl && <img src={ep.thumbnailUrl} style={{width:'100%', height:'100%', objectFit:'cover'}} />}
                                                       </div>
                                                       <div style={{flex:1}}>
                                                           <div style={{fontSize:'13px', fontWeight:600}}>Ep {ep.episodeNumber}: {ep.title}</div>
                                                           <div style={{fontSize:'11px', color:'#64748b'}}>{ep.duration}</div>
                                                       </div>
                                                       <button type="button" onClick={() => removeEpisode(season.id, ep.id)} style={{color:'#ef4444', background:'none', border:'none', cursor:'pointer'}}>
                                                           <Trash2 size={16} />
                                                       </button>
                                                   </div>
                                               ))}

                                               {/* Add Episode Form */}
                                               <div style={{marginTop:'20px', paddingTop:'20px', borderTop:'1px dashed #e2e8f0'}}>
                                                   <div style={{fontSize:'12px', fontWeight:600, color:'#3b82f6', marginBottom:'10px'}}>Add Episode to Season {season.seasonNumber}</div>
                                                   <div className="pro-grid-2">
                                                        <Input placeholder="Episode Title" value={newEpisode.title} onChange={(e:any) => setNewEpisode({...newEpisode, title: e.target.value})} icon={Type} />
                                                        <Input placeholder="Duration (e.g. 45m)" value={newEpisode.duration} onChange={(e:any) => setNewEpisode({...newEpisode, duration: e.target.value})} icon={Clock} />
                                                   </div>
                                                   <div style={{marginTop:'10px'}}>
                                                       <Input placeholder="Description" value={newEpisode.description} onChange={(e:any) => setNewEpisode({...newEpisode, description: e.target.value})} icon={MessageSquareQuote} />
                                                   </div>
                                                    <div style={{marginTop:'10px'}}>
                                                       <Input placeholder="Video URL (HLS/MP4)" value={newEpisode.videoUrl} onChange={(e:any) => setNewEpisode({...newEpisode, videoUrl: e.target.value})} icon={LinkIcon} />
                                                   </div>
                                                   <div style={{marginTop:'10px', display:'flex', justifyContent:'flex-end'}}>
                                                       <button type="button" onClick={() => addEpisodeToSeason(season.id)} className="secondary-btn" style={{background:'#eff6ff', color:'#3b82f6', border:'none'}}>
                                                           <Plus size={16} /> Add Episode
                                                       </button>
                                                   </div>
                                               </div>
                                           </div>
                                       )}
                                   </div>
                               ))}
                           </div>
                       </ProSection>
                   )}

                   {/* TAB: VISUALS */}
                   {activeTab === 'visuals' && (
                       <div className="pro-visuals-grid">
                           <ProSection icon={ImageIcon} title="Posters & Thumbnails">
                                <Label>Vertical Poster (Portrait)</Label>
                                <Dropzone label="Upload Vertical Poster" name="posterUrl" />
                                
                                <div style={{width:'100%', height:'20px'}}></div>
                                
                                <Label>Standard Thumbnail (16:9)</Label>
                                <Dropzone label="Upload Thumbnail" name="thumbnailUrl" />
                           </ProSection>

                           <ProSection icon={Layers} title="Banners & Assets">
                                <Label>Cinematic Banner (Horizontal)</Label>
                                <Dropzone label="Upload Wide Banner" aspect="video" name="bannerUrl" />

                                <div style={{width:'100%', height:'20px'}}></div>

                                <Label>Title Logo (Transparent PNG)</Label>
                                <Dropzone label="Upload Title Treatment" name="titleLogoUrl" />
                           </ProSection>
                       </div>
                   )}

                   {/* TAB: PEOPLE */}
                   {activeTab === 'people' && (
                       <ProSection icon={Users} title="Cast & Crew">
                           <div className="form-group">
                               <Label>Showrunner / Creator</Label>
                               <Input name="director" value={formData.director} onChange={handleChange} placeholder="e.g. Duffer Brothers" icon={User} />
                           </div>
                           <div className="pro-grid-2">
                               <div className="form-group">
                                   <Label>Writers (Comma separated)</Label>
                                   <Input name="writers" value={formData.writers} onChange={handleChange} icon={Users} />
                               </div>
                               <div className="form-group">
                                   <Label>Producers</Label>
                                   <Input name="producers" value={formData.producers} onChange={handleChange} icon={Users} />
                               </div>
                           </div>
                           <div style={{marginTop:'20px', paddingTop:'20px', borderTop:'1px solid #e2e8f0'}}>
                               <Label>Starring Cast</Label>
                               
                               {/* Add New Member Row */}
                               <div style={{display:'flex', gap:'15px', alignItems:'flex-end', marginBottom:'20px', background:'#f8fafc', padding:'15px', borderRadius:'12px'}}>
                                   <div style={{flex:1}}>
                                       <label style={{fontSize:'11px', fontWeight:600, color:'#64748b', marginBottom:'4px', display:'block'}}>Actor Name</label>
                                       <Input value={newCast.name} onChange={(e:any) => setNewCast({...newCast, name: e.target.value})} placeholder="e.g. Millie Bobby Brown" style={{background:'white'}} icon={User} />
                                   </div>
                                   <div style={{flex:1}}>
                                       <label style={{fontSize:'11px', fontWeight:600, color:'#64748b', marginBottom:'4px', display:'block'}}>Character / Role</label>
                                       <Input value={newCast.role} onChange={(e:any) => setNewCast({...newCast, role: e.target.value})} placeholder="e.g. Eleven" style={{background:'white'}} icon={UserCog} />
                                   </div>
                                   <div style={{flex:1}}>
                                       <label style={{fontSize:'11px', fontWeight:600, color:'#64748b', marginBottom:'4px', display:'block'}}>Avatar URL</label>
                                       <Input value={newCast.imageUrl} onChange={(e:any) => setNewCast({...newCast, imageUrl: e.target.value})} placeholder="https://..." style={{background:'white'}} icon={LinkIcon} />
                                   </div>
                                   <button type="button" onClick={addCastMember} style={{background:'#3b82f6', color:'white', border:'none', borderRadius:'10px', width:'42px', height:'42px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer'}}>
                                       <CheckCircle size={20} />
                                   </button>
                               </div>

                               {/* Cast Grid */}
                               <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px, 1fr))', gap:'30px'}}>
                                   {formData.castMembers?.map((member: any) => (
                                       <div key={member.id} style={{textAlign:'center', position:'relative'}}>
                                            <div style={{width:'80px', height:'80px', borderRadius:'50%', margin:'0 auto 10px', overflow:'hidden', background:'#e2e8f0', border:'2px solid white', boxShadow:'0 4px 10px rgba(0,0,0,0.1)'}}>
                                                {member.imageUrl ? <img src={member.imageUrl} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <Users size={32} style={{margin:'24px', color:'#94a3b8'}} />}
                                            </div>
                                            <div style={{fontWeight:700, fontSize:'13px', color:'#0f172a'}}>{member.name}</div>
                                            <div style={{fontSize:'11px', color:'#64748b'}}>{member.role}</div>
                                            <button type="button" onClick={() => removeCastMember(member.id)} 
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
                                    style={{padding:'20px', border: formData.sections.hero ? '2px solid #3b82f6' : '1px solid #e2e8f0', background: formData.sections.hero ? '#eff6ff' : 'white', borderRadius:'12px', cursor:'pointer'}}>
                                   <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                                        <Label>Home Hero Carousel</Label>
                                        <div style={{width:'20px', height:'20px', borderRadius:'50%', border: formData.sections.hero?'none':'2px solid #cbd5e1', background:formData.sections.hero?'#3b82f6':'none', display:'flex', alignItems:'center', justifyContent:'center'}}>
                                            {formData.sections.hero && <CheckCircle size={14} color="white" />}
                                        </div>
                                   </div>
                                   <p style={{fontSize:'12px', color:'#64748b'}}>Pin this series to the main landing slider.</p>
                               </div>
                               <div className="section-card" onClick={() => handleSectionToggle('trending')} 
                                    style={{padding:'20px', border: formData.sections.trending ? '2px solid #3b82f6' : '1px solid #e2e8f0', background: formData.sections.trending ? '#eff6ff' : 'white', borderRadius:'12px', cursor:'pointer'}}>
                                   <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                                        <Label>Trending Now</Label>
                                        <div style={{width:'20px', height:'20px', borderRadius:'50%', border: formData.sections.trending?'none':'2px solid #cbd5e1', background:formData.sections.trending?'#3b82f6':'none', display:'flex', alignItems:'center', justifyContent:'center'}}>
                                            {formData.sections.trending && <CheckCircle size={14} color="white" />}
                                        </div>
                                   </div>
                                   <p style={{fontSize:'12px', color:'#64748b'}}>Boost visibility in the trending algorithm.</p>
                               </div>
                               <div className="section-card" onClick={() => handleSectionToggle('newArrival')} 
                                    style={{padding:'20px', border: formData.sections.newArrival ? '2px solid #3b82f6' : '1px solid #e2e8f0', background: formData.sections.newArrival ? '#eff6ff' : 'white', borderRadius:'12px', cursor:'pointer'}}>
                                   <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                                        <Label>New Releases</Label>
                                        <div style={{width:'20px', height:'20px', borderRadius:'50%', border: formData.sections.newArrival?'none':'2px solid #cbd5e1', background:formData.sections.newArrival?'#3b82f6':'none', display:'flex', alignItems:'center', justifyContent:'center'}}>
                                            {formData.sections.newArrival && <CheckCircle size={14} color="white" />}
                                        </div>
                                   </div>
                                   <p style={{fontSize:'12px', color:'#64748b'}}>Feature in the 'Just Added' row.</p>
                               </div>
                               <div className="section-card" onClick={() => handleSectionToggle('editorsChoice')} 
                                    style={{padding:'20px', border: formData.sections.editorsChoice ? '2px solid #3b82f6' : '1px solid #e2e8f0', background: formData.sections.editorsChoice ? '#eff6ff' : 'white', borderRadius:'12px', cursor:'pointer'}}>
                                   <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                                        <Label>Editor's Choice</Label>
                                        <div style={{width:'20px', height:'20px', borderRadius:'50%', border: formData.sections.editorsChoice?'none':'2px solid #cbd5e1', background:formData.sections.editorsChoice?'#3b82f6':'none', display:'flex', alignItems:'center', justifyContent:'center'}}>
                                            {formData.sections.editorsChoice && <CheckCircle size={14} color="white" />}
                                        </div>
                                   </div>
                                   <p style={{fontSize:'12px', color:'#64748b'}}>Curated highlight badge.</p>
                               </div>
                           </div>
                           
                           <div style={{marginTop:'30px', paddingTop:'30px', borderTop:'1px solid #e2e8f0'}}>
                               <Label>Custom Collections (Tags)</Label>
                               <div style={{display:'flex', gap:'10px', marginBottom:'15px'}}>
                                   <Input placeholder="e.g. Holiday Specials, Best of 2024"  id="collectionInput" 
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
                                   }}>Add Channel</button>
                               </div>
                               <div style={{display:'flex', flexWrap:'wrap', gap:'10px'}}>
                                   {formData.customCollections?.map((col: string) => (
                                       <span key={col} style={{display:'flex', alignItems:'center', gap:'6px', padding:'6px 14px', background:'#eff6ff', color:'#3b82f6', borderRadius:'20px', fontSize:'13px', fontWeight:600}}>
                                           {col}
                                           <button type="button" onClick={() => setFormData(prev => ({...prev, customCollections: prev.customCollections.filter((c: string) => c !== col)}))} 
                                                   style={{background:'none', border:'none', cursor:'pointer', color:'#3b82f6', display:'flex', alignItems:'center'}}>
                                               ×
                                           </button>
                                       </span>
                                   ))}
                                   {!formData.customCollections?.length && <span style={{fontSize:'13px', color:'#94a3b8', fontStyle:'italic'}}>No custom channels added.</span>}
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
            <div style={{padding:'8px', background:'#f1f5f9', borderRadius:'8px', color:'#3b82f6'}}><Icon size={18} /></div>
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
        aspectRatio: aspect === 'video' ? '16/9' : '2/3', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', transition:'all 0.2s'
    }} className="hover-dashed">
        <div style={{width:'50px', height:'50px', borderRadius:'50%', background:'#e2e8f0', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'15px'}}>
            <Upload size={24} style={{color:'#64748b'}} />
        </div>
        <div style={{fontSize:'13px', color:'#475569', fontWeight:600}}>{label}</div>
        <div style={{fontSize:'11px', color:'#94a3b8', marginTop:'5px'}}>Drag & Drop or Click</div>
    </div>
);
