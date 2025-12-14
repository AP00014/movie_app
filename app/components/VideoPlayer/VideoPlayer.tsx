"use client";

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, X, RotateCcw, RotateCw, Volume2, VolumeX, Settings, Maximize, Minimize, SkipForward, Check } from 'lucide-react';
import './VideoPlayer.css';

export default function VideoPlayer({ src, onClose, title }: { src: string, onClose: () => void, title: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  
  // Settings States
  const [showSettings, setShowSettings] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [quality, setQuality] = useState('Auto');

  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);

  // Auto-hide controls
  useEffect(() => {
    const resetTimer = () => {
      setShowControls(true);
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
      controlsTimeout.current = setTimeout(() => {
          if (!showSettings) setShowControls(false); // Don't hide if settings open
      }, 3000);
    };

    const listeners = ['mousemove', 'click', 'touchstart'];
    listeners.forEach(l => window.addEventListener(l, resetTimer));
    
    // Simulate finding an intro at 5s
    const introTimer = setTimeout(() => setShowSkip(true), 5000);
    const introHide = setTimeout(() => setShowSkip(false), 15000);

    return () => {
      listeners.forEach(l => window.removeEventListener(l, resetTimer));
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
      clearTimeout(introTimer);
      clearTimeout(introHide);
    };
  }, [showSettings]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) videoRef.current.pause();
      else videoRef.current.play();
      setPlaying(!playing);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const time = (parseFloat(e.target.value) / 100) * videoRef.current.duration;
      videoRef.current.currentTime = time;
      setProgress(parseFloat(e.target.value));
    }
  };

  const skip = (amount: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += amount;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        setFullscreen(true);
    } else {
        document.exitFullscreen();
        setFullscreen(false);
    }
  };

  const changeSpeed = (speed: number) => {
      if (videoRef.current) {
          videoRef.current.playbackRate = speed;
          setPlaybackSpeed(speed);
      }
  };

  return (
    <div className={`video-player-overlay ${showControls ? '' : 'hide-cursor'}`}>
      <video 
        ref={videoRef}
        src={src}
        className="video-element"
        onTimeUpdate={handleTimeUpdate}
        autoPlay
        onClick={() => setShowSettings(false)}
      />
      
      {/* Top Header */}
      <div className={`player-header ${showControls ? 'visible' : ''}`}>
        <button onClick={onClose} className="back-icon"><X size={32} /></button>
        <span className="player-title">{title}</span>
      </div>

      {/* Skip Intro Button */}
      {showSkip && (
        <button className="skip-intro" onClick={() => skip(30)}>
           <SkipForward size={16} fill="black" /> Skip Intro
        </button>
      )}

      {/* Settings Menu Overlay */}
      {showSettings && (
          <div className="settings-menu-overlay">
             <div className="settings-column">
                <h3>Speed</h3>
                <div className="settings-options">
                    {[0.5, 0.75, 1, 1.25, 1.5].map(s => (
                        <div 
                          key={s} 
                          className={`settings-item ${playbackSpeed === s ? 'active' : ''}`}
                          onClick={() => changeSpeed(s)}
                        >
                            {playbackSpeed === s && <Check size={14} />}
                            <span>{s === 1 ? 'Normal' : `${s}x`}</span>
                        </div>
                    ))}
                </div>
             </div>
             <div className="settings-divider"></div>
             <div className="settings-column">
                 <h3>Quality</h3>
                 <div className="settings-options">
                    {['Auto', '1080p', '720p', '480p'].map(q => (
                        <div 
                          key={q} 
                          className={`settings-item ${quality === q ? 'active' : ''}`}
                          onClick={() => setQuality(q)}
                        >
                             {quality === q && <Check size={14} />}
                             <span>{q}</span>
                        </div>
                    ))}
                 </div>
             </div>
          </div>
      )}

      {/* Controls Container */}
      <div className={`player-controls ${showControls ? 'visible' : ''}`}>
        
        {/* Progress Bar */}
        <div className="progress-container">
           <div className="progress-bg">
             <div className="progress-fill" style={{ width: `${progress}%` }}></div>
             <div className="progress-thumb" style={{ left: `${progress}%` }}></div>
           </div>
           <input 
             type="range" 
             min="0" 
             max="100" 
             value={progress} 
             onChange={handleSeek} 
             className="seek-slider"
           />
        </div>

        <div className="controls-row">
           <div className="left-controls">
              <button onClick={togglePlay} className="control-btn-play">
                 {playing ? <Pause fill="white" size={28} /> : <Play fill="white" size={28} />}
              </button>
              
              <button onClick={() => skip(-10)} className="control-btn">
                 <RotateCcw size={24} />
                 <span className="seek-text">10</span>
              </button>
              
              <button onClick={() => skip(10)} className="control-btn">
                 <RotateCw size={24} />
                 <span className="seek-text">10</span>
              </button>

              <div className="volume-control">
                  <button onClick={toggleMute} className="control-btn">
                    {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                  </button>
                  <input 
                    type="range" 
                    min="0" max="1" step="0.1"
                    value={muted ? 0 : volume}
                    onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        setVolume(v);
                        setMuted(v === 0);
                        if(videoRef.current) videoRef.current.volume = v;
                    }}
                    className="volume-slider"
                  />
              </div>
           </div>

           <div className="right-controls">
              <span className="ep-title">S1:E1 "The Beginning"</span>
              <button className={`control-btn ${showSettings ? 'active-btn' : ''}`} onClick={() => setShowSettings(!showSettings)}>
                 <Settings size={24} />
              </button>
              <button onClick={toggleFullscreen} className="control-btn">
                 {fullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
