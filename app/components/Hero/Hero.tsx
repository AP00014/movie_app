"use client";

import { useState, useEffect, useRef } from 'react';
import { Download, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';
import './Hero.css';

const HERO_SLIDES = [
  {
    id: 1,
    title: "The Naked Gun",
    image: "https://picsum.photos/seed/hero1/1600/900", 
    poster: "https://picsum.photos/seed/hero1poster/200/300",
    year: "2025",
    rating: "18+",
    genre: "Action"
  },
  {
    id: 2,
    title: "Nobody 2",
    image: "https://picsum.photos/seed/hero2/1600/900", 
    poster: "https://picsum.photos/seed/hero2poster/200/300",
    year: "2025",
    rating: "16+",
    genre: "Thriller"
  },
  {
    id: 3,
    title: "Cyberpunk 2077",
    image: "https://picsum.photos/seed/hero3/1600/900", 
    poster: "https://picsum.photos/seed/hero3poster/200/300",
    year: "2077",
    rating: "18+",
    genre: "Sci-Fi"
  }
];

export default function Hero() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
        handleNext(); // Auto slide
    }, 5000); // 5 seconds

    return () => resetTimeout();
  }, [current]);

  const handleNext = () => {
    setCurrent(current === HERO_SLIDES.length - 1 ? 0 : current + 1);
  };

  const handlePrev = () => {
    setCurrent(current === 0 ? HERO_SLIDES.length - 1 : current - 1);
  };

  const handleDetails = (id: number) => {
    router.push(`/movie/${id}`);
  };

  // Touch handling for mobile "flip" / swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe Left -> Next
      handleNext();
    } 

    if (touchStart - touchEnd < -75) {
      // Swipe Right -> Prev
      handlePrev();
    }
  };

  return (
    <div 
      className="hero-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="hero-slider" style={{ transform: `translateX(-${current * 100}%)` }}>
        {HERO_SLIDES.map((slide) => (
          <div className="hero-slide" key={slide.id}>
             <div className="image-wrapper">
                 <img src={slide.image} alt={slide.title} className="hero-img" />
                 <div className="overlay-gradient"></div>
             </div>
             
             {/* Content Layer */}
             <div className="card-content">
                <div className="poster-thumb" onClick={() => handleDetails(slide.id)} style={{cursor: 'pointer'}}>
                   <img src={slide.poster} alt="poster" />
                </div>
                <div className="text-info" onClick={() => handleDetails(slide.id)} style={{cursor: 'pointer'}}>
                  <h2 className="movie-title">{slide.title}</h2>
                  <div className="meta-row">
                     <span className="age-rating">{slide.rating}</span>
                     <span className="separator">|</span>
                     <span>{slide.year}</span>
                     <span className="separator">|</span>
                     <span>{slide.genre}</span>
                  </div>
                </div>
                <div className="action-buttons">
                    <button className="icon-btn" onClick={() => handleDetails(slide.id)}>
                        <Play size={20} fill="#0f1014" color="#0f1014" />
                    </button>
                    <button className="download-circle-btn">
                        <Download size={20} />
                    </button>
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* PC Controls */}
      <div className="slider-controls">
         <button className="control-btn left" onClick={handlePrev}>
            <ChevronLeft size={32} />
         </button>
         <button className="control-btn right" onClick={handleNext}>
            <ChevronRight size={32} />
         </button>
      </div>

      {/* Dots Indicator */}
      <div className="slider-dots">
         {HERO_SLIDES.map((_, idx) => (
             <div 
               key={idx} 
               className={`dot ${current === idx ? 'active' : ''}`}
               onClick={() => setCurrent(idx)}
             ></div>
         ))}
      </div>
    </div>
  );
}
