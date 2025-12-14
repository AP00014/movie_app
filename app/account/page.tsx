"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { 
  ArrowLeft, Edit2, Film, Clock, Award, Play, 
  Trash2, Download, Check, Star, Settings, Shield, Bell, Globe, Lock, UserCog 
} from 'lucide-react';
import Link from 'next/link';
import './AccountPage.css';

export default function AccountPage() {
  const { user, signOut, isLoading, role } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'mylist' | 'downloads' | 'history' | 'settings'>('mylist');

  // Protect route
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <div className="account-container"></div>; // Loading state
  }

  // Dashboard Link based on role
  const getDashboardLink = () => {
     return (
        <div style={{marginLeft:'auto', display:'flex', alignItems:'center', gap:'10px'}}>
             {role === 'superadmin' && (
                <Link href="/superadmin/dashboard" style={{
                    display:'flex', alignItems:'center', gap:'8px', 
                    background: 'linear-gradient(45deg, #a855f7, #ec4899)', 
                    color:'white', padding:'10px 20px', borderRadius:'8px', 
                    textDecoration:'none', fontWeight:700, fontSize:'14px',
                    boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)'
                }}>
                   <Shield size={18} /> Command Center
                </Link>
             )}

             {(role === 'admin' || role === 'superadmin') && (
                <Link href="/admin/dashboard" style={{
                    display:'flex', alignItems:'center', gap:'8px', 
                    background: '#3b82f6', 
                    color:'white', padding:'10px 20px', borderRadius:'8px', 
                    textDecoration:'none', fontWeight:700, fontSize:'14px',
                    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
                }}>
                   <UserCog size={18} /> Admin Dashboard
                </Link>
             )}
        </div>
     );
  };

  // Mock Data
  const myList = [
    { id: '1', title: 'Inception', year: '2010', quality: '4K', img: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=500' },
    { id: '2', title: 'Interstellar', year: '2014', quality: 'HD', img: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500' },
    { id: '3', title: 'The Dark Knight', year: '2008', quality: '4K', img: 'https://images.unsplash.com/photo-1478720568477-152d9b164e63?w=500' },
    { id: '4', title: 'Dune', year: '2021', quality: '4K', img: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=500' },
    { id: '5', title: 'Blade Runner 2049', year: '2017', quality: 'HD', img: 'https://images.unsplash.com/photo-1535446202450-e773be1222e1?w=500' },
  ];

  const downloads = [
    { id: 'd1', title: 'Stranger Things: S4 E1', size: '1.2 GB', date: '2 days ago', img: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500' },
    { id: 'd2', title: 'Avengers: Endgame', size: '3.5 GB', date: '1 week ago', img: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=500' },
    { id: 'd3', title: 'Cyberpunk: Edgerunners', size: '850 MB', date: 'Just now', img: 'https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?w=500' },
  ];

  const history = [
    { id: 'h1', title: 'Spider-Man: ATSV', progress: '100%', img: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500' },
    { id: 'h2', title: 'The Matrix', progress: '45%', img: 'https://images.unsplash.com/photo-1592484869061-00108396e95b?w=500' },
    { id: 'h3', title: 'Fight Club', progress: '100%', img: 'https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?w=500' },
  ];

  return (
    <div className="account-container">
      <div className="ambient-bg"></div>
      
      <div className="account-content">
        {/* Navigation */}
        <div style={{marginBottom: '20px'}}>
             <Link href="/" style={{display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#ccc', textDecoration: 'none'}}>
                <ArrowLeft size={20} /> Back
             </Link>
        </div>

        {/* Profile Header */}
        <div className="profile-header">
           <div className="avatar-wrapper">
              <div className="profile-avatar-large">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${user.user_metadata?.full_name || 'User'}&background=00d4ff&color=fff&size=256`} 
                    alt="User" 
                  />
              </div>
              <button className="edit-avatar-btn">
                  <Edit2 size={16} />
              </button>
           </div>
           
           <div className="profile-info">
               <h1 className="user-name">{user.user_metadata?.full_name || 'Movie Buff'}</h1>
               <div className="user-meta">
                  <div className="meta-item"><Award size={14} color="#00d4ff" /> Premium Member</div>
                  <div className="meta-item"><Clock size={14} color="#00d4ff" /> Joined {new Date(user.created_at || Date.now()).getFullYear()}</div>
                  <button onClick={() => signOut()} style={{background:'none', border:'none', color:'#ff6b6b', cursor:'pointer', marginLeft:'10px', fontSize:'12px', fontWeight:600}}>
                      SIGN OUT
                  </button>
               </div>
           </div>

           {/* Admin Link if applicable */}
           {getDashboardLink()}
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
           <div className="stat-card">
              <div className="stat-icon"><Film size={24} /></div>
              <div className="stat-details">
                 <span className="stat-value">124</span>
                 <span className="stat-label">Movies Watched</span>
              </div>
           </div>
           <div className="stat-card">
              <div className="stat-icon"><Clock size={24} /></div>
              <div className="stat-details">
                 <span className="stat-value">380</span>
                 <span className="stat-label">Hours Streamed</span>
              </div>
           </div>
           <div className="stat-card">
              <div className="stat-icon"><Star size={24} /></div>
              <div className="stat-details">
                 <span className="stat-value">Lvl 5</span>
                 <span className="stat-label">Cinephile</span>
              </div>
           </div>
        </div>

        {/* Library Tabs */}
        <div className="library-tabs">
            <button 
              className={`tab-btn ${activeTab === 'mylist' ? 'active' : ''}`}
              onClick={() => setActiveTab('mylist')}
            >
               My List
            </button>
            <button 
              className={`tab-btn ${activeTab === 'downloads' ? 'active' : ''}`}
              onClick={() => setActiveTab('downloads')}
            >
               Downloads
            </button>
            <button 
              className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
               Watch History
            </button>
            <button 
              className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
               Settings
            </button>
        </div>

        {/* Tab Content */}
        <div className="content-grid-section">
           
           {activeTab === 'mylist' && (
              <div className="grid-layout">
                 {myList.map(item => (
                    <Link href={`/movie/${item.id}`} key={item.id} className="content-card">
                       <img src={item.img} alt={item.title} className="card-img" />
                       <div className="card-overlay">
                          <div className="card-title">{item.title}</div>
                          <div className="card-meta">
                             <span>{item.year}</span>
                             <span>{item.quality}</span>
                          </div>
                       </div>
                    </Link>
                 ))}
                 <div className="content-card" style={{border: '2px dashed rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent'}}>
                    <div style={{textAlign: 'center', opacity: 0.5}}>
                        <div style={{fontSize: '30px', marginBottom: '10px'}}>+</div>
                        <div>Add More</div>
                    </div>
                 </div>
              </div>
           )}

           {activeTab === 'downloads' && (
              <div className="downloads-list">
                 {downloads.map(item => (
                    <div className="download-item" key={item.id}>
                        <img src={item.img} alt={item.title} className="download-thumb" />
                        <div className="download-info">
                            <div className="download-title">{item.title}</div>
                            <div className="download-meta">
                               <span className="download-size">{item.size}</span>
                               <span>•</span>
                               <span>{item.date}</span>
                               <span style={{color:'#46d369', gap:'4px', display:'flex', alignItems:'center'}}><Check size={12}/> Downloaded</span>
                            </div>
                        </div>
                        <button className="delete-btn">
                           <Trash2 size={18} />
                        </button>
                    </div>
                 ))}
              </div>
           )}

           {activeTab === 'history' && (
               <div className="grid-layout">
                  {history.map(item => (
                     <div key={item.id} className="content-card">
                        <img src={item.img} alt={item.title} className="card-img" style={{opacity: 0.7}} />
                        <div className="card-overlay" style={{opacity: 1, paddingBottom: 0}}>
                            <div style={{position:'absolute', bottom:0, left:0, width:'100%', height:'4px', background:'rgba(255,255,255,0.2)'}}>
                                <div style={{width: item.progress === '100%' ? '100%' : '45%', height:'100%', background: '#e50914'}}></div>
                            </div>
                        </div>
                        <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)', background:'rgba(0,0,0,0.5)', borderRadius:'50%', padding:'10px', border:'2px solid white'}}>
                            <Play fill="white" size={20} />
                        </div>
                     </div>
                  ))}
               </div>
           )}

           {activeTab === 'settings' && (
              <div style={{maxWidth:'600px', display:'flex', flexDirection:'column', gap:'20px'}}>
                  <div style={{background:'rgba(255,255,255,0.03)', padding:'25px', borderRadius:'16px', border:'1px solid rgba(255,255,255,0.05)'}}>
                      <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px'}}>
                          <Bell size={24} color="#00d4ff" />
                          <h3 style={{fontSize:'18px'}}>Notifications</h3>
                      </div>
                      <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px', paddingBottom:'15px', borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                          <span>New Arrivals</span>
                          <div style={{color:'#46d369'}}>On</div>
                      </div>
                      <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px'}}>
                          <span>Recommendation Emails</span>
                          <div style={{color:'#666'}}>Off</div>
                      </div>
                  </div>

                  <div style={{background:'rgba(255,255,255,0.03)', padding:'25px', borderRadius:'16px', border:'1px solid rgba(255,255,255,0.05)'}}>
                      <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px'}}>
                          <Globe size={24} color="#00d4ff" />
                          <h3 style={{fontSize:'18px'}}>Language & Region</h3>
                      </div>
                      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                          <span>Display Language</span>
                          <select style={{background:'rgba(0,0,0,0.5)', border:'1px solid #333', color:'white', padding:'8px', borderRadius:'6px'}}>
                              <option>English (US)</option>
                              <option>Spanish</option>
                              <option>French</option>
                          </select>
                      </div>
                  </div>

                  <div style={{background:'rgba(255,255,255,0.03)', padding:'25px', borderRadius:'16px', border:'1px solid rgba(255,255,255,0.05)'}}>
                      <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px'}}>
                          <Lock size={24} color="#00d4ff" />
                          <h3 style={{fontSize:'18px'}}>Security</h3>
                      </div>
                      <button style={{width:'100%', padding:'12px', background:'rgba(255,255,255,0.1)', border:'none', color:'white', borderRadius:'8px', cursor:'pointer', fontWeight:600}}>
                          Change Password
                      </button>
                  </div>
              </div>
           )}

        </div>

      </div>
    </div>
  );
}
