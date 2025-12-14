"use client";

import { useState, use } from 'react';
import { 
  ArrowLeft, Play, Plus, Share2, Download, ThumbsUp, 
  Check, Volume2, VolumeX, Info, Calendar, ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { usePlayer } from '@/app/context/PlayerContext'; // Updated import
import './MoviePage.css';

export default function MovieDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { playMedia } = usePlayer(); // Use global player
  
  // Logic to determine content type (Mocked for demo)
  const isSeries = ['money-heist', 'spartacus', 'merlin', 'got'].includes(id) || id.includes('series');
  
  const [activeTab, setActiveTab] = useState(isSeries ? 'episodes' : 'more_like_this');
  const [selectedSeason, setSelectedSeason] = useState(1);

  // Mock data generator
  const getContentData = (id: string) => {
      const base = {
          match: "98% Match",
          year: "2024",
          rating: "13+",
          seasons: "1h 45m",
          quality: "HD",
          rank: "#5 in Global",
          genres: ["Action", "Adventure"],
          moods: ["Exciting", "Fun"],
          audio: ["English"],
          subtitles: ["English"],
          cast: ["Actor 1", "Actor 2"],
          description: "A placeholder description for this movie.",
          title: "Unknown Title",
          backdrop: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200"
      };

      if (id === 'money-heist') return { 
          ...base, 
          title: "Money Heist", year: "2017", rating: "18+", seasons: "5 Seasons", rank: "#1 in TV Shows",
          backdrop: "https://images.unsplash.com/photo-1541560052-77ec1bbc60f4?fit=crop&q=80&w=1200", 
          description: "Eight thieves take hostages and lock themselves in the Royal Mint of Spain as a criminal mastermind manipulates the police to carry out his plan.",
          cast: ["Úrsula Corberó", "Álvaro Morte", "Itziar Ituño"],
          genres: ["Crime TV", "Spanish", "Thriller"]
      };
      if (id === 'spartacus') return { 
          ...base, 
          title: "Spartacus", year: "2010", rating: "18+", seasons: "3 Seasons", rank: "#4 in Classics",
           backdrop: "https://images.unsplash.com/photo-1596727147705-54a9d0943fdd?fit=crop&q=80&w=1200", 
          description: "Determined to bring down the Roman Republic, Spartacus leads a rebellion of gladiators and slaves against the legions of Rome.",
          cast: ["Andy Whitfield", "Lucy Lawless"],
          genres: ["Historical", "Action", "Drama"]
      };
      if (id === 'merlin') return { 
          ...base, 
          title: "Merlin", year: "2008", rating: "13+", seasons: "5 Seasons", rank: "#8 in Family",
          backdrop: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?fit=crop&q=80&w=1200",
          description: "This family-oriented retelling of the King Arthur legend finds Merlin arriving in Camelot, where he must hone his magic in secret.",
          cast: ["Colin Morgan", "Bradley James"],
          genres: ["Fantasy", "Adventure"]
      };
      if (id === 'got') return { 
          ...base, 
          title: "Game of Thrones", year: "2011", rating: "18+", seasons: "8 Seasons", rank: "#2 All Time",
          backdrop: "https://images.unsplash.com/photo-1533613220915-609f661a6fe1?fit=crop&q=80&w=1200",
          description: "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.",
          cast: ["Emilia Clarke", "Kit Harington"],
          genres: ["Fantasy", "Drama"]
      };

      // MOVIES
      if (id === '1') return {
          ...base,
          title: "The Naked Gun", year: "2025", rating: "18+", seasons: "1h 55m", quality: "4K HDR", rank: "#2 in Movies",
          backdrop: "https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?q=80&w=1200",
          description: "In this modern reimagining, Frank Drebin returns to navigate a world of high-stakes crime with his signature incompetent brilliance.",
          cast: ["Liam Neeson", "Kevin Hart"],
          genres: ["Comedy", "Crime"]
      };
      
      // Default fallback using the ID to show variety
      return {
          ...base,
          title: `Movie Title ${id}`,
          description: `This is a dynamically generated description for the movie with ID ${id}. It features exciting scenes and a compelling story.`,
          backdrop: `https://source.unsplash.com/random/1200x600?movie&sig=${id}`
      };
  };

  
  const data = getContentData(id);

  // Mock Episodes
  const episodes = [
      { ep: 1, title: "Do as Planned", time: "47m", desc: "The Professor recruits a young female robber and seven other criminals for a grand heist.", img: "https://images.unsplash.com/photo-1550565118-c9d044630a65?w=300" },
      { ep: 2, title: "Lethal Negligence", time: "41m", desc: "Raquel's negotiation with The Professor gets off to a rocky start. Hostages are scared.", img: "https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=300" },
      { ep: 3, title: "Misfire", time: "50m", desc: "Police grab an image of the face of one of the robbers. Berlin and Denver argue.", img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300" },
  ];

  /* REMOVED: Local VideoPlayer rendering */

  return (
    <div className="content-detail-container">
      {/* Top Navigation */}
      <div className="content-nav">
         <ArrowLeft className="nav-back-arrow" onClick={() => router.back()} />
         <div className="nav-right">
            <Share2 size={24} />
            <div className="profile-icon"></div>
         </div>
      </div>

      {/* Hero Video Preview Area */}
      <div className="content-hero">
         <div className="hero-poster-wrapper">
             <img src={data.backdrop} alt="Backdrop" className="hero-bg-img" />
             <div className="hero-gradient-overlay"></div>
         </div>
         
         <div className="hero-content">
             {/* Top Badge */}
             <div className="top-10-badge">
                <div className="top-10-box">TOP<br/>10</div>
                <span>{data.rank}</span>
             </div>

             {/* Title */}
             <h1 className="hero-title">{data.title}</h1>
             
             {/* Metadata Row */}
             <div className="meta-info-row">
                 <span className="match-score">{data.match}</span>
                 <span className="year">{data.year}</span>
                 <span className="maturity-rating">{data.rating}</span>
                 <span className="duration">{data.seasons}</span>
                 <span className="hd-badge">{data.quality}</span>
             </div>

             {/* Action Buttons */}
             <div className="primary-actions">
                 <button className="content-play-btn" onClick={() => playMedia({
                     id: data.title + Date.now(),
                     title: data.title,
                     src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                     type: 'video'
                 })}>
                    <Play fill="black" size={24} />
                    <span>Play</span>
                 </button>
                 
                 <button className="content-download-btn">
                    <Download size={24} />
                    <span>Download {isSeries ? 'S1:E1' : ''}</span>
                 </button>
             </div>

             {/* Description */}
             <p className="content-description">
                 {data.description}
             </p>
             
             <div className="content-credits-short">
                 <p className="credit-line"><span>Starring:</span> {data.cast.slice(0,3).join(', ')}</p>
                 <div className="tags-wrapper">
                    {data.moods.map(m => <span key={m} className="tech-badge">{m}</span>)}
                 </div>
             </div>

             {/* Interaction Row */}
             <div className="interaction-row">
                 <div className="action-item">
                    <Plus size={24} />
                    <span>My List</span>
                 </div>
                 <div className="action-item">
                    <ThumbsUp size={24} />
                    <span>Rate</span>
                 </div>
                 <div className="action-item">
                    <Share2 size={24} />
                    <span>Share</span>
                 </div>
             </div>
         </div>
      </div>

      {/* Tab Section */}
      <div className="content-section">
          {/* Custom Tabs based on content type */}
          <div className="section-tabs">
             {isSeries && (
                <span 
                    className={activeTab === 'episodes' ? 'active-tab' : ''} 
                    onClick={() => setActiveTab('episodes')}
                >
                    Episodes
                </span>
             )}
             <span 
               className={activeTab === 'more_like_this' ? 'active-tab' : ''} 
               onClick={() => setActiveTab('more_like_this')}
             >
               More Like This
             </span>
             <span 
               className={activeTab === 'details' ? 'active-tab' : ''} 
               onClick={() => setActiveTab('details')}
             >
               Details & Specs
             </span>
          </div>

          {/* SERIES EPISODES TAB */}
          {activeTab === 'episodes' && isSeries && (
              <div className="episodes-container">
                  <div className="season-selector">
                      <span>Season {selectedSeason}</span>
                      <ChevronRight size={16} className="rotate-90" />
                  </div>
                  {episodes.map((ep) => (
                      <div className="episode-item" key={ep.ep} onClick={() => playMedia({
                        id: ep.title + ep.ep,
                        title: `${isSeries ? `S${selectedSeason}:E${ep.ep} ` : ''}${ep.title}`,
                        src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                        type: 'video'
                      })}>
                          <div className="ep-poster">
                              <img src={ep.img} alt={ep.title} />
                              <div className="play-overlay-small"><Play fill="white" size={16} /></div>
                          </div>
                          <div className="ep-info">
                              <div className="ep-header">
                                  <span className="ep-title">{ep.ep}. {ep.title}</span>
                                  <span className="ep-time">{ep.time}</span>
                              </div>
                              <p className="ep-desc">{ep.desc}</p>
                          </div>
                      </div>
                  ))}
              </div>
          )}
          
          {/* MORE LIKE THIS GRID */}
          {activeTab === 'more_like_this' && (
            <div className="content-grid">
                {[1,2,3,4,5,6].map((i) => (
                    <div className="content-grid-item" key={i}>
                        <img src={`https://source.unsplash.com/random/300x450?series&sig=${i+10}`} alt="Related" />
                        <div className="grid-overlay">
                            <span className="grid-match">9{i}% Match</span>
                        </div>
                    </div>
                ))}
            </div>
          )}

          {/* DETAILS & SPECS VIEW */}
          {activeTab === 'details' && (
             <div className="details-view">
               <div className="detail-column">
                  <h3>About "{data.title}"</h3>
                  <div className="detail-group">
                     <span className="detail-label">Cast:</span>
                     <span className="detail-value">{data.cast.join(', ')}</span>
                  </div>
                  <div className="detail-group">
                     <span className="detail-label">Genres:</span>
                     <div className="tags-wrapper">
                       {data.genres.map(g => <span key={g} className="detail-tag">{g}</span>)}
                     </div>
                  </div>
               </div>
            </div>
          )}
      </div>
    </div>
  );
}
