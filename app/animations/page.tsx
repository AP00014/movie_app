"use client";

import { useState, useEffect } from 'react';
import { Play, Info, ArrowRight, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import '../movies/ContentGrid.css'; 

export default function AnimationsPage() {
  const router = useRouter();
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  const heroMovies = [
    { id: 'a1', title: 'Spider-Man: Across the Spider-Verse', desc: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.', img: 'https://images.unsplash.com/photo-1535446202450-e773be1222e1?w=1600&q=80' },
    { id: 'a2', title: 'Arcane', desc: 'Amid the stark discord of twin cities Piltover and Zaun, two sisters fight on rival sides of a war between magic technologies and clashing convictions.', img: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1600&q=80' },
    { id: 'a3', title: 'Cyberpunk: Edgerunners', desc: 'In a dystopia riddled with corruption and cybernetic implants, a talented but reckless street kid strives to become a mercenary outlaw — an edgerunner.', img: 'https://images.unsplash.com/photo-1520038410233-71423527967c?w=1600&q=80' },
  ];

  const categories = [
    { title: "Trending Animations", type: "wide" },
    { title: "New Anime Releases", type: "portrait" },
    { title: "Family Friendly", type: "wide" },
    { title: "Cyberpunk & Sci-Fi", type: "portrait" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % heroMovies.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="content-page-container">
      {/* Dynamic Hero Section */}
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
    return (
        <div className="content-row">
            <h2 className="row-header">
                {title} <span className="explore-all">Explore All <ArrowRight size={14} /></span>
            </h2>
            <div className={`row-scroll-container ${type}`}>
                {[1,2,3,4,5,6,7,8].map((i) => (
                    <div 
                      key={i} 
                      className={`row-card ${type}`}
                      onClick={() => router.push(`/movie/a${offset}-${i}`)}
                    >
                        <img 
                          src={`https://picsum.photos/seed/${offset * 20 + i}/${type === 'wide' ? '400/225' : '300/450'}`} 
                          alt="Animation" 
                        />
                        <div className="card-hover-info">
                            <div className="mini-actions">
                                <div className="icon-circle"><Play size={14} fill="white" /></div>
                                <div className="icon-circle"><Star size={14} /></div>
                            </div>
                            <span className="match-text">98% Match</span>
                            <div className="meta-tags">
                                <span>HD</span>
                                <span>Anime</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
