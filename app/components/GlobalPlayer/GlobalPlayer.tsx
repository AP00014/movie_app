"use client";

import { useState, useRef, useEffect } from 'react';
import { usePlayer } from '@/app/context/PlayerContext';
import { 
  Play, Pause, X, RotateCcw, RotateCw, Volume2, VolumeX, 
  Settings, Maximize, Minimize, SkipForward, Check, Minimize2, Move
} from 'lucide-react';
import './GlobalPlayer.css';
import '../VideoPlayer/VideoPlayer.css'; // Reuse existing player styles for full screen

import { usePathname } from 'next/navigation';
// ... previous imports

export default function GlobalPlayer() {
  const pathname = usePathname();
  const { activeMedia, isMinimized, isPlaying, playMedia, closePlayer, toggleMinimize, setPlayingStatus } = usePlayer();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Auto-minimize on route change
  useEffect(() => {
      if (activeMedia && !isMinimized) {
          toggleMinimize();
      }
  }, [pathname]);

  // Reset state when media changes
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  
  // Settings
  const [showSettings, setShowSettings] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [quality, setQuality] = useState('Auto');

  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);

  // ... Reset state when media changes
  const [position, setPosition] = useState({ x: 0, y: 0 }); 
  const dragStart = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const draggableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleWindowMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current || !draggableRef.current) return;
      
      // Critical: Prevent scrolling on mobile while dragging
      if (e.cancelable) e.preventDefault();

      let clientX, clientY;
      if (window.TouchEvent && e instanceof TouchEvent) {
           clientX = e.touches[0].clientX;
           clientY = e.touches[0].clientY;
      } else {
           clientX = (e as MouseEvent).clientX;
           clientY = (e as MouseEvent).clientY;
      }

      const dx = clientX - dragStart.current.x;
      const dy = clientY - dragStart.current.y;
      
      const newX = startPos.current.x + dx;
      const newY = startPos.current.y + dy;
      
      // Direct DOM update for performance (avoiding React render cycle on every frame)
      draggableRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
    };
    
    const handleWindowUp = () => {
      if (isDraggingRef.current && draggableRef.current) {
          isDraggingRef.current = false;
          
          // Sync final position to state so it persists
          // We need to parse the current transform or re-calculate based on the last known delta
          // Easier to just re-calculate based on the last known values if we tracked them, 
          // but we can also just trust the logic:
          // actually we haven't tracked 'current' dx/dy in a var accessible here easily without parsing.
          // Let's rely on the DOM transform or re-read client X/Y if we had them.
          // Better: let's track the 'lastKnownPosition' in a mutable ref during move.
          // HOWEVER, strictly speaking, inside this closure we don't have the final 'e'.
          
          // Let's assume the user stopped dragging. We need to save the final X/Y.
          // For simplicity in this 'ref only' version, let's use the style transform to update state.
          const style = window.getComputedStyle(draggableRef.current);
          const matrix = new DOMMatrixReadOnly(style.transform);
          setPosition({ x: matrix.m41, y: matrix.m42 });
      }
    };

    // Attach non-passive listeners to window to ensure we can preventDefault
    window.addEventListener('mousemove', handleWindowMove);
    window.addEventListener('mouseup', handleWindowUp);
    window.addEventListener('touchmove', handleWindowMove, { passive: false });
    window.addEventListener('touchend', handleWindowUp);
    
    return () => {
      window.removeEventListener('mousemove', handleWindowMove);
      window.removeEventListener('mouseup', handleWindowUp);
      window.removeEventListener('touchmove', handleWindowMove);
      window.removeEventListener('touchend', handleWindowUp);
    };
  }, []); // Run once, refs handle state

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
     // Check if target is interactive (button/input) - we stopped propagation in children, but double check
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input')) return;

    // For touch, we might not want to prevent default immediately to allow tap, 
    // but for "drag start" usually it's okay. 
    // If we preventDefault here on TouchStart, it might block the 'click' emulation for closing if the user just tapped.
    // So we DON'T preventDefault on Start, only on Move.
    
    isDraggingRef.current = true;
    
    let clientX, clientY;
    if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = (e as React.MouseEvent).clientX;
        clientY = (e as React.MouseEvent).clientY;
        e.preventDefault(); // Prevent text selection on desktop
    }
    
    dragStart.current = { x: clientX, y: clientY };
    startPos.current = { x: position.x, y: position.y };
  };

  // Sync Play Pause with Context
  useEffect(() => {
      const el = activeMedia?.type === 'audio' ? audioRef.current : videoRef.current;
      if (el) {
          if (isPlaying) el.play().catch(e => console.log("Play interrupted", e));
          else el.pause();
      }
      return () => {
          if (el) el.pause();
      };
  }, [isPlaying, activeMedia]);

  const togglePlay = () => {
    // Determine which element to toggle
    const el = activeMedia?.type === 'audio' ? audioRef.current : videoRef.current;
    if (el) {
        if (isPlaying) {
            el.pause();
            setPlayingStatus(false);
        } else {
            el.play();
            setPlayingStatus(true);
        }
    }
  };

  const handleTimeUpdate = (e: any) => {
    const el = e.target;
    const p = (el.currentTime / el.duration) * 100;
    setProgress(p || 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = activeMedia?.type === 'audio' ? audioRef.current : videoRef.current;
    if (el) {
      const time = (parseFloat(e.target.value) / 100) * (el.duration || 0);
      el.currentTime = time;
      setProgress(parseFloat(e.target.value));
    }
  };

  const skip = (amount: number) => {
    const el = activeMedia?.type === 'audio' ? audioRef.current : videoRef.current;
    if (el) {
      el.currentTime += amount;
    }
  };

  const toggleMute = () => {
    const el = activeMedia?.type === 'audio' ? audioRef.current : videoRef.current;
    if (el) {
      el.muted = !muted;
      setMuted(!muted);
    }
  };

  const changeSpeed = (speed: number) => {
      const el = activeMedia?.type === 'audio' ? audioRef.current : videoRef.current;
      if (el) {
          el.playbackRate = speed;
          setPlaybackSpeed(speed);
      }
  };

  // Auto-hide controls in full screen
  useEffect(() => {
    if (isMinimized) return; // Don't hide in mini mode via this logic

    const resetTimer = () => {
      setShowControls(true);
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
      controlsTimeout.current = setTimeout(() => {
          if (!showSettings) setShowControls(false); 
      }, 3000);
    };

    const listeners = ['mousemove', 'click', 'touchstart'];
    listeners.forEach(l => window.addEventListener(l, resetTimer));
    
    return () => {
      listeners.forEach(l => window.removeEventListener(l, resetTimer));
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    };
  }, [showSettings, isMinimized]);


  if (!activeMedia) return null;

  const isAudio = activeMedia.type === 'audio';

  // --- AUDIO RENDER ---
  if (isAudio) {
      if (!isMinimized) {
        // FULL SCREEN AUDIO PLAYER
        return (
            <div className="global-player-full">
                 <div className="audio-fs-container">
                    {/* Blurred Background */}
                    <div 
                        className="audio-fs-bg" 
                        style={{backgroundImage: `url(${activeMedia.posterUrl || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100"})`}}
                    ></div>
                    
                    {/* Header Controls */}
                    <div className="player-header visible" style={{zIndex: 20}}>
                        <button onClick={toggleMinimize} className="back-icon">
                            <Minimize2 size={24} />
                        </button>
                        <div style={{flex:1}}></div>
                        <button onClick={closePlayer} className="back-icon">
                            <X size={28} />
                        </button>
                    </div>
                    
                    {/* Main Content */}
                    <div className={`audio-fs-content ${isPlaying ? 'audio-playing' : 'audio-paused'}`}>
                        <img 
                            src={activeMedia.posterUrl || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500"} 
                            className="audio-fs-poster"
                            alt="Album Art"
                        />
                        
                        <div className="audio-fs-meta">
                            <div className="audio-fs-title">{activeMedia.title}</div>
                            <div className="audio-fs-artist">{activeMedia.artist || 'Unknown Artist'}</div>
                        </div>

                        <div className="audio-fs-controls">
                            <div className="audio-fs-progress">
                                <span>{Math.floor((audioRef.current?.currentTime || 0) / 60)}:{String(Math.floor((audioRef.current?.currentTime || 0) % 60)).padStart(2, '0')}</span>
                                <div className="progress-container" style={{margin:0}}>
                                    <div className="progress-bg">
                                        <div className="progress-fill" style={{ width: `${progress}%`, background: 'white' }}></div>
                                        <div className="progress-thumb" style={{ left: `${progress}%`, background: 'white' }}></div>
                                    </div>
                                    <input type="range" min="0" max="100" value={progress} onChange={handleSeek} className="seek-slider"/>
                                </div>
                                <span>{Math.floor((audioRef.current?.duration || 0) / 60)}:{String(Math.floor((audioRef.current?.duration || 0) % 60)).padStart(2, '0')}</span>
                            </div>
                            
                            <div className="audio-fs-buttons">
                                <button className="audio-btn-sec" onClick={() => skip(-10)}>
                                    <RotateCcw size={28} />
                                </button>
                                
                                <button className="audio-btn-main" onClick={togglePlay}>
                                    {isPlaying ? <Pause fill="black" size={32} color="black" /> : <Play fill="black" size={32} color="black" style={{marginLeft:'4px'}}/>}
                                </button>
                                
                                <button className="audio-btn-sec" onClick={() => skip(10)}>
                                    <RotateCw size={28} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <audio 
                        ref={audioRef}
                        src={activeMedia.src}
                        onTimeUpdate={handleTimeUpdate}
                        onEnded={() => setPlayingStatus(false)}
                        autoPlay={isPlaying}
                    />
                 </div>
            </div>
        );
      }

      // MINIMIZED AUDIO PLAYER
      return (
          <div 
            ref={draggableRef}
            className="global-player-mini audio-mode"
            style={{ 
                transform: `translate(${position.x}px, ${position.y}px)`, 
                cursor: 'move',
                touchAction: 'none' // Key for some browsers
            }}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
          >
              <audio 
                  ref={audioRef}
                  src={activeMedia.src}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={() => setPlayingStatus(false)}
                  // Don't autoPlay here if re-rendering, rely on useEffect sync
              />
              <img src={activeMedia.posterUrl || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100"} className="audio-mini-poster" draggable={false} />
              <div className="audio-mini-info">
                  <div className="audio-mini-title">{activeMedia.title}</div>
                  <div className="audio-mini-artist">{activeMedia.artist || 'Unknown Artist'}</div>
                  
                  {/* Audio Controls */}
                  <div style={{display:'flex', alignItems:'center', gap:'10px', marginTop:'5px'}}>
                      <button 
                        onClick={(e) => {e.stopPropagation(); skip(-10)}} 
                        onTouchStart={(e) => e.stopPropagation()} 
                        style={{background:'none', border:'none', color:'#cbd5e1', cursor:'pointer'}}
                      >
                        <RotateCcw size={14}/>
                      </button>
                      <button 
                        onClick={(e) => {e.stopPropagation(); togglePlay()}}
                        onTouchStart={(e) => e.stopPropagation()} 
                        style={{background:'none', border:'none', color:'white', cursor:'pointer'}}
                      >
                          {isPlaying ? <Pause size={18} fill="white"/> : <Play size={18} fill="white"/>}
                      </button>
                      <button 
                         onClick={(e) => {e.stopPropagation(); skip(10)}}
                         onTouchStart={(e) => e.stopPropagation()}  
                         style={{background:'none', border:'none', color:'#cbd5e1', cursor:'pointer'}}
                      >
                        <RotateCw size={14}/>
                      </button>
                  </div>
              </div>

               <div style={{display:'flex', gap:'5px', paddingRight:'5px', alignItems: 'center'}}>
                  {/* Maximize */}
                  <button 
                    className="mini-btn" 
                    style={{width:'28px', height:'28px'}} 
                    onClick={(e) => {e.stopPropagation(); toggleMinimize()}}
                    onTouchStart={(e) => e.stopPropagation()}
                  >
                        <Maximize size={14}/>
                  </button>
                  
                  {/* Close */}
                  <button 
                    className="mini-btn" 
                    style={{width:'28px', height:'28px', background:'rgba(255,255,255,0.1)'}} 
                    onClick={(e) => {e.stopPropagation(); closePlayer()}}
                    onTouchStart={(e) => e.stopPropagation()}
                  >
                        <X size={14}/>
                  </button>
               </div>
          </div>
      )
  }

  // --- VIDEO RENDER ---
  return (
    <div 
      ref={draggableRef}
      className={`${isMinimized ? 'global-player-mini' : 'global-player-full'} ${showControls || isMinimized ? '' : 'hide-cursor'}`}
      style={isMinimized ? { 
          transform: `translate(${position.x}px, ${position.y}px)`, 
           cursor: 'move',
           touchAction: 'none' 
      } : {}}
      onMouseDown={isMinimized ? handleDragStart : undefined}
      onTouchStart={isMinimized ? handleDragStart : undefined}
    >
      <video 
        ref={videoRef}
        src={activeMedia.src}
        className="video-element"
        onTimeUpdate={handleTimeUpdate}
        autoPlay={isPlaying}
        onClick={() => {
            if (isMinimized) {
                toggleMinimize(); // Maximize on click if minimized
            } else {
                setShowSettings(false);
            }
        }}
        style={{
            background: 'black',
            objectFit: isMinimized ? 'cover' : 'contain'
        }}
      />
      
      {/* ---------------- MINIMIZED UI ---------------- */}
      {isMinimized && (
          <div 
            className="mini-controls" 
            onMouseDown={handleDragStart} /* Allow dragging from overlay too */
            onTouchStart={handleDragStart}
          >
              <button 
                className="mini-maximize" 
                onClick={(e) => { e.stopPropagation(); toggleMinimize(); }}
                onMouseDown={(e) => e.stopPropagation()} // Stop drag on click
                onTouchStart={(e) => e.stopPropagation()}
              >
                  <Maximize size={14} color="white" />
              </button>
              <button 
                className="mini-btn" 
                onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              >
                  {isPlaying ? <Pause fill="white" size={18} /> : <Play fill="white" size={18} />}
              </button>
              <button 
                 className="mini-close" 
                 onClick={(e) => { e.stopPropagation(); closePlayer(); }}
                 onMouseDown={(e) => e.stopPropagation()}
                 onTouchStart={(e) => e.stopPropagation()}
              >
                  <X size={14} color="white" />
              </button>
          </div>
      )}

      {/* ---------------- FULL SCREEN UI ---------------- */}
      {!isMinimized && (
        <>
          {/* Top Header */}
          <div className={`player-header ${showControls ? 'visible' : ''}`}>
            <button onClick={toggleMinimize} className="back-icon" title="Minimize & Keep Playing">
                <Minimize2 size={24} />
            </button>
            <span className="player-title">{activeMedia.title}</span>
            <div style={{flex:1}}></div>
            <button onClick={closePlayer} className="back-icon" title="Close Player">
                <X size={28} />
            </button>
          </div>

          {/* Settings Menu */}
          {showSettings && (
              <div className="settings-menu-overlay">
                 <div className="settings-column">
                    <h3>Speed</h3>
                    <div className="settings-options">
                        {[0.5, 0.75, 1, 1.25, 1.5].map(s => (
                            <div key={s} className={`settings-item ${playbackSpeed === s ? 'active' : ''}`} onClick={() => changeSpeed(s)}>
                                {playbackSpeed === s && <Check size={14} />}
                                <span>{s === 1 ? 'Normal' : `${s}x`}</span>
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
               <input type="range" min="0" max="100" value={progress} onChange={handleSeek} className="seek-slider"/>
            </div>

            <div className="controls-row">
               <div className="left-controls">
                  <button onClick={togglePlay} className="control-btn-play">
                     {isPlaying ? <Pause fill="white" size={28} /> : <Play fill="white" size={28} />}
                  </button>
                  <button onClick={() => skip(-10)} className="control-btn"><RotateCcw size={24} /></button>
                  <button onClick={() => skip(10)} className="control-btn"><RotateCw size={24} /></button>

                  <div className="volume-control">
                      <button onClick={toggleMute} className="control-btn">
                        {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                      </button>
                      <input 
                        type="range" min="0" max="1" step="0.1"
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
                  <button className={`control-btn ${showSettings ? 'active-btn' : ''}`} onClick={() => setShowSettings(!showSettings)}>
                     <Settings size={24} />
                  </button>
                  <button onClick={() => {
                        if (!document.fullscreenElement) {
                            document.documentElement.requestFullscreen();
                            setFullscreen(true);
                        } else {
                            document.exitFullscreen();
                            setFullscreen(false);
                        }
                  }} className="control-btn">
                     {fullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
                  </button>
               </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
