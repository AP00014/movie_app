"use client";

import { useState, useEffect } from 'react';
import { Play, Info, ArrowRight, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import './ContentGrid.css';

export default function MoviesPage() {
  const router = useRouter();
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  const heroMovies = [
    { id: 'm1', title: 'Start Up', desc: 'Young entrepreneurs navigating the cutthroat world of Korea\'s high-tech industry.', img: 'https://picsum.photos/seed/startup/1600/900' },
    { id: 'm2', title: 'Interstellar', desc: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.', img: 'https://picsum.photos/seed/interstellar/1600/900' },
    { id: 'm3', title: 'Inception', desc: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.', img: 'https://picsum.photos/seed/inception/1600/900' },
  ];

  const categories = [
    { title: "Trending Now", type: "wide" },
    { title: "New Releases", type: "portrait" },
    { title: "Action Thrillers", type: "portrait" },
    { title: "Award Winning Movies", type: "wide" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % heroMovies.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="content-page-container">
      <div className="content-featured-hero">
        {heroMovies.map((movie, index) => (
           <div 
             key={movie.id} 
             className={`hero-slide ${index === activeHeroIndex ? 'active' : ''}`}
           >
              <img src={movie.img} alt={movie.title} className="hero-img" />
              <div className="hero-overlay-gradient"></div>
              <div className="hero-content-wrapper">
                  <h1 className="hero-main-title">{movie.title}</h1>
                  <p className="hero-desc">{movie.desc}</p>
                  <div className="hero-actions">
                      <button className="nf-btn-white" onClick={() => router.push(`/movie/${movie.id}`)}>
                          <Play fill="black" size={24} /> Play
                      </button>
                      <button className="nf-btn-gray" onClick={() => router.push(`/movie/${movie.id}`)}>
                          <Info size={24} /> More Info
                      </button>
                  </div>
              </div>
           </div>
        ))}
        
        <div className="hero-indicators">
            {heroMovies.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`indicator-dot ${idx === activeHeroIndex ? 'active' : ''}`}
                  onClick={() => setActiveHeroIndex(idx)}
                />
            ))}
        </div>
      </div>

      <div className="content-rows-container">
         {categories.map((cat, idx) => (
             <ContentRow key={idx} title={cat.title} type={cat.type} offset={idx} />
         ))}
      </div>
    </div>
  );
}

function ContentRow({ title, type, offset }: { title: string, type: string, offset: number }) {
    const router = useRouter();
    
    const handleExploreAll = () => {
      const slug = encodeURIComponent(title.toLowerCase().replace(/\s+/g, '-'));
      router.push(`/category/${slug}`);
    };
    
    return (
        <div className="content-row">
            <h2 className="row-header">
                {title} 
                <span className="explore-all" onClick={handleExploreAll} style={{cursor: 'pointer'}}>
                  Explore All <ArrowRight size={14} />
                </span>
            </h2>
            <div className={`row-scroll-container ${type}`}>
                {[1,2,3,4,5,6,7,8].map((i) => (
                    <div 
                      key={i} 
                      className={`row-card ${type}`}
                      onClick={() => router.push(`/movie/m${offset}-${i}`)}
                    >
                        <img 
                          src={`https://picsum.photos/seed/${offset * 10 + i}/${type === 'wide' ? '400/225' : '300/450'}`} 
                          alt="Movie" 
                        />
                        <div className="card-hover-info">
                            <div className="mini-actions">
                                <div className="icon-circle"><Play size={14} fill="white" /></div>
                                <div className="icon-circle"><Star size={14} /></div>
                            </div>
                            <span className="match-text">98% Match</span>
                            <div className="meta-tags">
                                <span>HD</span>
                                <span>Action</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
