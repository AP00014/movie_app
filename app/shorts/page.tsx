"use client";

import { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Play } from 'lucide-react';
import './Shorts.css'; 

export default function ShortsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mock Shorts Data
  const shortsData = [
    {
      id: 1,
      videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      poster: "https://picsum.photos/seed/short1/600/900",
      channel: "@funny_clips",
      desc: "When the joyride goes wrong 😂 #funny #fail",
      song: "Funny Song - Original Sound",
      likes: "1.2M",
      comments: "4K"
    },
    {
      id: 2,
      videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      poster: "https://picsum.photos/seed/short2/600/900",
      channel: "@action_shorts",
      desc: "Wait for the drop! 🤯🔥 #epic",
      song: "Epic Beats - Remix",
      likes: "850K",
      comments: "1.2K"
    },
    {
      id: 3,
      videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      poster: "https://picsum.photos/seed/short3/600/900",
      channel: "@travel_vlog",
      desc: "Best escape ever vs reality 🤣 #travel #meme",
      song: "Vacation Vibes - Summer Hit",
      likes: "2.1M",
      comments: "8.5K"
    },
  ];

  return (
    <div className="shorts-page-container" ref={containerRef}>
      {shortsData.map((item) => (
        <ShortVideoItem key={item.id} item={item} />
      ))}
    </div>
  );
}

function ShortVideoItem({ item }: { item: any }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);

  // Intersection Observer to handle auto-play
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play().then(() => setIsPlaying(true)).catch(e => console.log("Autoplay blocked", e));
          } else {
            videoRef.current?.pause();
            setIsPlaying(false);
            if (videoRef.current) videoRef.current.currentTime = 0; // Reset
          }
        });
      },
      { threshold: 0.6 } // Needs to be 60% visible
    );

    if (videoRef.current) observer.observe(videoRef.current);

    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="short-item-snap-container">
      {/* PC Aesthetic Background */}
      <div className="pc-blur-bg" style={{ backgroundImage: `url(${item.poster})` }}></div>
      <div className="short-video-wrapper" onClick={togglePlay}>
        <video
          ref={videoRef}
          src={item.videoUrl}
          className="short-video-el"
          poster={item.poster}
          loop
          playsInline
        />
        {!isPlaying && (
           <div className="play-icon-overlay">
              <Play fill="white" size={48} />
           </div>
        )}
      </div>

      {/* Overlay UI */}
      <div className="short-overlay-ui">
          {/* Right Action Bar */}
          <div className="short-actions-bar">
              <div className="action-btn" onClick={() => setLiked(!liked)}>
                 <Heart size={32} fill={liked ? 'red' : 'rgba(0,0,0,0.2)'} color={liked ? 'red' : 'white'} />
                 <span className="action-text">{item.likes}</span>
              </div>
              
              <div className="action-btn">
                 <MessageCircle size={32} fill="white" color="white" />
                 <span className="action-text">{item.comments}</span>
              </div>

              <div className="action-btn">
                 <Share2 size={32} fill="white" color="white" />
                 <span className="action-text">Share</span>
              </div>

              <div className="action-btn">
                 <MoreHorizontal size={32} color="white" />
              </div>
          </div>

          {/* Bottom Info */}
          <div className="short-bottom-info">
             <div className="user-row">
                <div className="user-avatar-circle"></div>
                <span className="channel-name">{item.channel}</span>
             </div>
             <p className="description-text">{item.desc}</p>
          </div>
      </div>
    </div>
  );
}
