"use client";

import { useEffect, useState, useRef } from 'react';
import { 
  ChevronDown, MoreHorizontal, Shuffle, SkipBack, 
  Play, Pause, SkipForward, Repeat, Repeat1, 
  Heart, Share2, ListMusic, Volume2, VolumeX
} from 'lucide-react';
import './FullScreenPlayer.css';

interface Song {
  id: string | number;
  title: string;
  artist: string;
  img: string;
  color?: string;
  duration?: number;
}

interface FullScreenPlayerProps {
  currentSong: Song;
  playlist: Song[];
  isPlaying: boolean;
  onPlayPause: () => void;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function FullScreenPlayer({ 
  currentSong, playlist, isPlaying, onPlayPause, onClose, onNext, onPrev 
}: FullScreenPlayerProps) {
  
  const [progress, setProgress] = useState(0);
  const [loopMode, setLoopMode] = useState<'off'|'all'|'one'>('off');
  const [isShuffle, setIsShuffle] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isDragging, setIsDragging] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  
  const duration = currentSong.duration || 225; // Default 3:45
  
  // Progress simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isDragging) {
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            if (loopMode === 'one') return 0;
            onNext();
            return 0;
          }
          return p + (100 / (duration * 10));
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, loopMode, onNext, duration, isDragging]);

  // Reset progress when song changes
  useEffect(() => {
    setProgress(0);
  }, [currentSong.id]);

  const formatTime = (percent: number) => {
    const seconds = Math.floor((percent / 100) * duration);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    setProgress(Math.min(100, Math.max(0, percent)));
  };

  // Visualizer bars
  const bars = Array.from({ length: 60 }).map((_, i) => i);

  return (
    <div className="fullscreen-player">
      {/* Dynamic Background */}
      <div 
        className="fs-background" 
        style={{ backgroundImage: `url(${currentSong.img})` }}
      />
      <div className="fs-overlay" />

      <div className="fs-content">
        {/* Header */}
        <header className="fs-header">
          <button className="fs-btn" onClick={onClose}>
            <ChevronDown size={28} />
          </button>
          <div className="fs-header-center">
            <span className="fs-playing-from">Playing from playlist</span>
            <span className="fs-playlist-name">Your Mix</span>
          </div>
          <button className="fs-btn">
            <MoreHorizontal size={24} />
          </button>
        </header>

        {/* Artwork Section */}
        <div className="fs-artwork-section">
          <div className={`fs-artwork ${isPlaying ? 'playing' : ''}`}>
            <img src={currentSong.img} alt={currentSong.title} />
            <div className="fs-artwork-glow" style={{ background: currentSong.color || '#1db954' }} />
            {isPlaying && (
              <div className="fs-vinyl-lines">
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
              </div>
            )}
          </div>
        </div>

        {/* Song Info */}
        <div className="fs-song-info">
          <div className="fs-info-left">
            <h1 className="fs-title">{currentSong.title}</h1>
            <p className="fs-artist">{currentSong.artist}</p>
          </div>
          <button 
            className={`fs-like-btn ${liked ? 'liked' : ''}`} 
            onClick={() => setLiked(!liked)}
          >
            <Heart size={26} fill={liked ? '#1db954' : 'transparent'} />
          </button>
        </div>

        {/* Audio Visualizer */}
        <div className="fs-visualizer">
          {bars.map(i => (
            <div 
              key={i} 
              className={`fs-bar ${isPlaying ? 'active' : ''}`}
              style={{ 
                animationDelay: `${i * 0.02}s`,
                height: isPlaying ? undefined : '4px'
              }}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="fs-progress-section">
          <div 
            className="fs-progress-bar" 
            ref={progressRef}
            onClick={handleProgressClick}
          >
            <div className="fs-progress-bg" />
            <div className="fs-progress-fill" style={{ width: `${progress}%` }}>
              <div className="fs-scrubber" />
            </div>
          </div>
          <div className="fs-time">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(100)}</span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="fs-controls">
          <button 
            className={`fs-control ${isShuffle ? 'active' : ''}`}
            onClick={() => setIsShuffle(!isShuffle)}
          >
            <Shuffle size={22} />
          </button>
          
          <button className="fs-control skip" onClick={onPrev}>
            <SkipBack size={28} fill="white" />
          </button>
          
          <button className="fs-play-btn" onClick={onPlayPause}>
            <div className="play-btn-inner">
              {isPlaying ? (
                <Pause size={32} fill="black" color="black" />
              ) : (
                <Play size={32} fill="black" color="black" className="play-icon" />
              )}
            </div>
          </button>
          
          <button className="fs-control skip" onClick={onNext}>
            <SkipForward size={28} fill="white" />
          </button>
          
          <button 
            className={`fs-control ${loopMode !== 'off' ? 'active' : ''}`}
            onClick={() => setLoopMode(prev => 
              prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off'
            )}
          >
            {loopMode === 'one' ? <Repeat1 size={22} /> : <Repeat size={22} />}
          </button>
        </div>

        {/* Bottom Actions */}
        <div className="fs-actions">
          <button className="fs-action">
            <ListMusic size={22} />
            <span>Queue</span>
          </button>
          <button className="fs-action">
            <Share2 size={22} />
            <span>Share</span>
          </button>
        </div>

        {/* Queue Preview */}
        <div className="fs-queue-preview">
          <h4>Next in Queue</h4>
          <div className="queue-items">
            {playlist.slice(0, 3).map((song, idx) => (
              <div key={song.id} className="queue-item">
                <span className="queue-num">{idx + 1}</span>
                <img src={song.img} alt={song.title} />
                <div className="queue-info">
                  <span className="queue-title">{song.title}</span>
                  <span className="queue-artist">{song.artist}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
