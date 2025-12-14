"use client";

import { useState, useRef, useEffect } from 'react';
import { 
  Home, Search, Library, Heart, Play, Pause, SkipBack, SkipForward, 
  Repeat, Repeat1, Shuffle, Volume2, VolumeX, ListMusic, Mic2, 
  ChevronUp, MoreHorizontal, Plus, Clock, TrendingUp, Disc3,
  Radio, Headphones, Music2, Sparkles, ChevronRight
} from 'lucide-react';
import FullScreenPlayer from './components/FullScreenPlayer';
import './Spotify.css';

// Song data with real-looking content
const allSongs = [
  { id: 1, title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', duration: 203, img: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80', color: '#e91e63' },
  { id: 2, title: 'Starboy', artist: 'The Weeknd', album: 'Starboy', duration: 230, img: 'https://images.unsplash.com/photo-1619983081593-e2ba5b543e68?w=500&q=80', color: '#9c27b0' },
  { id: 3, title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', duration: 183, img: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=500&q=80', color: '#e91e63' },
  { id: 4, title: 'Stay', artist: 'The Kid LAROI, Justin Bieber', album: 'F*ck Love 3', duration: 141, img: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=500&q=80', color: '#ff5722' },
  { id: 5, title: 'Heat Waves', artist: 'Glass Animals', album: 'Dreamland', duration: 238, img: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=500&q=80', color: '#ff9800' },
  { id: 6, title: 'Save Your Tears', artist: 'The Weeknd', album: 'After Hours', duration: 215, img: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=500&q=80', color: '#2196f3' },
  { id: 7, title: 'Peaches', artist: 'Justin Bieber', album: 'Justice', duration: 198, img: 'https://images.unsplash.com/photo-1629276301820-0f3eedc29571?w=500&q=80', color: '#ff7043' },
  { id: 8, title: 'Mood', artist: '24kGoldn, iann dior', album: 'El Dorado', duration: 140, img: 'https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=500&q=80', color: '#4caf50' },
  { id: 9, title: 'drivers license', artist: 'Olivia Rodrigo', album: 'SOUR', duration: 242, img: 'https://images.unsplash.com/photo-1485579149621-3123dd979885?w=500&q=80', color: '#03a9f4' },
  { id: 10, title: 'Montero', artist: 'Lil Nas X', album: 'MONTERO', duration: 137, img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80', color: '#e91e63' },
  { id: 11, title: 'Kiss Me More', artist: 'Doja Cat ft. SZA', album: 'Planet Her', duration: 208, img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&q=80', color: '#9c27b0' },
  { id: 12, title: 'Bad Habits', artist: 'Ed Sheeran', album: '=', duration: 231, img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80', color: '#673ab7' },
];

const playlists = [
  { id: 1, name: 'Liked Songs', count: 342, img: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500&q=80', isLiked: true },
  { id: 2, name: 'Late Night Vibes', count: 45, img: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&q=80' },
  { id: 3, name: 'Workout Energy', count: 78, img: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&q=80' },
  { id: 4, name: 'Chill Beats', count: 156, img: 'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=500&q=80' },
  { id: 5, name: 'Road Trip', count: 89, img: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500&q=80' },
];

const genres = [
  { name: 'Pop', color: '#e91e63', icon: Music2 },
  { name: 'Hip-Hop', color: '#ff5722', icon: Headphones },
  { name: 'Rock', color: '#f44336', icon: Radio },
  { name: 'Electronic', color: '#9c27b0', icon: Disc3 },
  { name: 'R&B', color: '#673ab7', icon: Sparkles },
  { name: 'Jazz', color: '#3f51b5', icon: Music2 },
];

export default function MusicPage() {
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'library'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSong, setCurrentSong] = useState<typeof allSongs[0] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFullPlayer, setShowFullPlayer] = useState(false);
  const [playlist, setPlaylist] = useState(allSongs.slice(0, 5));
  const [likedSongs, setLikedSongs] = useState<number[]>([1, 3, 5]);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<'off' | 'all' | 'one'>('off');
  const [showQueue, setShowQueue] = useState(false);
  
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  // Progress simulation
  useEffect(() => {
    if (isPlaying && currentSong) {
      progressInterval.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + (100 / (currentSong.duration * 10));
        });
      }, 100);
    }
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [isPlaying, currentSong]);

  const playSong = (song: typeof allSongs[0]) => {
    if (currentSong?.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
      setProgress(0);
      // Add to queue if not already there
      if (!playlist.find(s => s.id === song.id)) {
        setPlaylist(prev => [song, ...prev]);
      }
    }
  };

  const handleNext = () => {
    if (!currentSong) return;
    const idx = playlist.findIndex(s => s.id === currentSong.id);
    let nextIdx = shuffle 
      ? Math.floor(Math.random() * playlist.length)
      : (idx + 1) % playlist.length;
    setCurrentSong(playlist[nextIdx]);
    setProgress(0);
  };

  const handlePrev = () => {
    if (!currentSong) return;
    if (progress > 10) {
      setProgress(0);
      return;
    }
    const idx = playlist.findIndex(s => s.id === currentSong.id);
    const prevIdx = (idx - 1 + playlist.length) % playlist.length;
    setCurrentSong(playlist[prevIdx]);
    setProgress(0);
  };

  const toggleLike = (songId: number) => {
    setLikedSongs(prev => 
      prev.includes(songId) 
        ? prev.filter(id => id !== songId)
        : [...prev, songId]
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const filteredSongs = searchQuery 
    ? allSongs.filter(s => 
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.artist.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="music-app">
      {/* Full Screen Player */}
      {showFullPlayer && currentSong && (
        <FullScreenPlayer
          currentSong={currentSong}
          playlist={playlist}
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          onClose={() => setShowFullPlayer(false)}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}

      {/* Main Content */}
      <div className="music-content">
        {/* Header */}
        <header className="music-header">
          <div className="header-left">
            <h1 className="greeting">{getGreeting()}</h1>
          </div>
          <div className="header-actions">
            <button className="icon-btn notification">
              <Plus size={20} />
            </button>
            <button className="icon-btn">
              <Clock size={20} />
            </button>
            <button className="icon-btn settings">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </header>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'home' && (
            <div className="home-view">
              {/* Quick Picks Grid */}
              <section className="quick-picks">
                {allSongs.slice(0, 6).map(song => (
                  <div 
                    key={song.id} 
                    className={`quick-pick-card ${currentSong?.id === song.id ? 'playing' : ''}`}
                    onClick={() => playSong(song)}
                  >
                    <img src={song.img} alt={song.title} />
                    <span className="title">{song.title}</span>
                    <div className="play-indicator">
                      {currentSong?.id === song.id && isPlaying ? (
                        <div className="equalizer">
                          <span></span><span></span><span></span>
                        </div>
                      ) : (
                        <Play size={16} fill="white" />
                      )}
                    </div>
                  </div>
                ))}
              </section>

              {/* Trending Section */}
              <section className="content-section">
                <div className="section-header">
                  <div className="section-title">
                    <TrendingUp size={20} className="section-icon" />
                    <h2>Trending Now</h2>
                  </div>
                  <button className="see-all">See all</button>
                </div>
                <div className="horizontal-scroll">
                  {allSongs.slice(0, 8).map(song => (
                    <div 
                      key={song.id} 
                      className="song-card"
                      onClick={() => playSong(song)}
                    >
                      <div className="card-image">
                        <img src={song.img} alt={song.title} />
                        <div className="card-overlay">
                          <button 
                            className={`like-btn ${likedSongs.includes(song.id) ? 'liked' : ''}`}
                            onClick={(e) => { e.stopPropagation(); toggleLike(song.id); }}
                          >
                            <Heart size={16} fill={likedSongs.includes(song.id) ? '#1db954' : 'transparent'} />
                          </button>
                          <button className="play-btn-card">
                            {currentSong?.id === song.id && isPlaying ? (
                              <Pause size={20} fill="black" />
                            ) : (
                              <Play size={20} fill="black" />
                            )}
                          </button>
                        </div>
                        {currentSong?.id === song.id && isPlaying && (
                          <div className="now-playing-indicator">
                            <div className="wave"><span></span><span></span><span></span><span></span></div>
                          </div>
                        )}
                      </div>
                      <h3>{song.title}</h3>
                      <p>{song.artist}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Recently Played */}
              <section className="content-section">
                <div className="section-header">
                  <div className="section-title">
                    <Clock size={20} className="section-icon" />
                    <h2>Recently Played</h2>
                  </div>
                  <button className="see-all">See all</button>
                </div>
                <div className="song-list">
                  {allSongs.slice(4, 10).map((song, index) => (
                    <div 
                      key={song.id} 
                      className={`song-row ${currentSong?.id === song.id ? 'active' : ''}`}
                      onClick={() => playSong(song)}
                    >
                      <span className="song-index">{index + 1}</span>
                      <img src={song.img} alt={song.title} className="song-thumb" />
                      <div className="song-info">
                        <h4>{song.title}</h4>
                        <p>{song.artist}</p>
                      </div>
                      <span className="song-duration">{formatTime(song.duration)}</span>
                      <button 
                        className={`like-btn-small ${likedSongs.includes(song.id) ? 'liked' : ''}`}
                        onClick={(e) => { e.stopPropagation(); toggleLike(song.id); }}
                      >
                        <Heart size={16} fill={likedSongs.includes(song.id) ? '#1db954' : 'transparent'} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Browse by Genre */}
              <section className="content-section">
                <div className="section-header">
                  <div className="section-title">
                    <Sparkles size={20} className="section-icon" />
                    <h2>Browse Genres</h2>
                  </div>
                </div>
                <div className="genre-grid">
                  {genres.map(genre => (
                    <div 
                      key={genre.name} 
                      className="genre-card" 
                      style={{ background: `linear-gradient(135deg, ${genre.color}, ${genre.color}88)` }}
                    >
                      <span>{genre.name}</span>
                      <genre.icon size={40} className="genre-icon" />
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'search' && (
            <div className="search-view">
              <div className="search-bar">
                <Search size={20} className="search-icon" />
                <input 
                  type="text"
                  placeholder="What do you want to listen to?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>

              {searchQuery ? (
                <div className="search-results">
                  <h3>Songs</h3>
                  {filteredSongs.length > 0 ? (
                    <div className="song-list">
                      {filteredSongs.map((song) => (
                        <div 
                          key={song.id} 
                          className={`song-row ${currentSong?.id === song.id ? 'active' : ''}`}
                          onClick={() => playSong(song)}
                        >
                          <img src={song.img} alt={song.title} className="song-thumb" />
                          <div className="song-info">
                            <h4>{song.title}</h4>
                            <p>{song.artist} • {song.album}</p>
                          </div>
                          <span className="song-duration">{formatTime(song.duration)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-results">No songs found for "{searchQuery}"</p>
                  )}
                </div>
              ) : (
                <div className="browse-section">
                  <h3>Browse All</h3>
                  <div className="genre-grid large">
                    {genres.map(genre => (
                      <div 
                        key={genre.name} 
                        className="genre-card large" 
                        style={{ background: `linear-gradient(135deg, ${genre.color}, ${genre.color}88)` }}
                      >
                        <span>{genre.name}</span>
                        <genre.icon size={50} className="genre-icon" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'library' && (
            <div className="library-view">
              <div className="library-header">
                <h2>Your Library</h2>
                <div className="library-actions">
                  <button className="icon-btn"><Search size={20} /></button>
                  <button className="icon-btn"><Plus size={20} /></button>
                </div>
              </div>

              <div className="library-filters">
                <button className="filter-chip active">Playlists</button>
                <button className="filter-chip">Artists</button>
                <button className="filter-chip">Albums</button>
              </div>

              <div className="playlist-list">
                {playlists.map(pl => (
                  <div key={pl.id} className="playlist-row">
                    <div className={`playlist-img ${pl.isLiked ? 'liked-playlist' : ''}`}>
                      {pl.isLiked ? (
                        <Heart size={24} fill="white" />
                      ) : (
                        <img src={pl.img} alt={pl.name} />
                      )}
                    </div>
                    <div className="playlist-info">
                      <h4>{pl.name}</h4>
                      <p>Playlist • {pl.count} songs</p>
                    </div>
                    <ChevronRight size={20} className="chevron" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mini Player */}
      {currentSong && !showFullPlayer && (
        <div 
          className="mini-player"
          style={{ '--accent-color': currentSong.color } as React.CSSProperties}
        >
          <div className="mini-progress" style={{ width: `${progress}%` }}></div>
          <div className="mini-content" onClick={() => setShowFullPlayer(true)}>
            <div className="mini-left">
              <div className={`vinyl-container ${isPlaying ? 'spinning' : ''}`}>
                <img src={currentSong.img} alt={currentSong.title} className="vinyl-img" />
                <div className="vinyl-hole"></div>
              </div>
              <div className="mini-info">
                <h4>{currentSong.title}</h4>
                <p>{currentSong.artist}</p>
              </div>
            </div>
            <div className="mini-controls" onClick={(e) => e.stopPropagation()}>
              <button 
                className={`mini-like ${likedSongs.includes(currentSong.id) ? 'liked' : ''}`}
                onClick={() => toggleLike(currentSong.id)}
              >
                <Heart size={20} fill={likedSongs.includes(currentSong.id) ? '#1db954' : 'transparent'} />
              </button>
              <button className="mini-play" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" />}
              </button>
            </div>
          </div>
          <button className="expand-btn" onClick={() => setShowFullPlayer(true)}>
            <ChevronUp size={20} />
          </button>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="music-nav">
        <button 
          className={`nav-tab ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <Home size={24} />
          <span>Home</span>
        </button>
        <button 
          className={`nav-tab ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          <Search size={24} />
          <span>Search</span>
        </button>
        <button 
          className={`nav-tab ${activeTab === 'library' ? 'active' : ''}`}
          onClick={() => setActiveTab('library')}
        >
          <Library size={24} />
          <span>Library</span>
        </button>
      </nav>
    </div>
  );
}
