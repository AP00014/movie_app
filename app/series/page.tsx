"use client";

import { useState } from 'react';
import { Play, Info, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import '../movies/ContentGrid.css'; // Reuse styles

export default function SeriesPage() {
  const router = useRouter();
  
  // Custom hero for series
  const featuredSeries = {
    title: "Stranger Things",
    desc: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
    img: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1600&auto=format&fit=crop"
  };

  return (
    <div className="content-page-container">
       <div className="content-featured-hero static-hero">
           <img src={featuredSeries.img} alt="Hero" className="hero-img" />
           <div className="hero-overlay-gradient"></div>
           <div className="hero-content-wrapper">
               <div className="series-logo-placeholder">ORIGINAL SERIES</div>
               <h1 className="hero-main-title large">{featuredSeries.title}</h1>
               <div className="meta-hero-row">
                   <span className="match-green">99% Match</span>
                   <span className="year-badge">2024</span>
                   <span className="season-badge">4 Seasons</span>
                   <span className="hd-box">4K HDR</span>
               </div>
               <p className="hero-desc">{featuredSeries.desc}</p>
               <div className="hero-actions">
                  <button className="nf-btn-white" onClick={() => router.push('/movie/stranger-things')}>
                      <Play fill="black" size={24} /> Play
                  </button>
                  <button className="nf-btn-gray" onClick={() => router.push('/movie/stranger-things')}>
                      <Info size={24} /> More Info
                  </button>
               </div>
           </div>
       </div>

       <div className="content-rows-container">
           <ContentRow title="Binge-Worthy TV Shows" type="portrait" offset={10} />
           <ContentRow title="Trending Now" type="wide" offset={20} />
           <ContentRow title="New Releases" type="portrait" offset={30} />
           <ContentRow title="K-Dramas" type="portrait" offset={40} />
           <ContentRow title="Crime TV Shows" type="wide" offset={50} />
       </div>
    </div>
  );
}

function ContentRow({ title, type, offset }: { title: string, type: string, offset: number }) {
    const router = useRouter();
    return (
        <div className="content-row">
            <h2 className="row-header">{title}</h2>
            <div className={`row-scroll-container ${type}`}>
                {[1,2,3,4,5,6,7,8].map((i) => (
                    <div 
                      key={i} 
                      className={`row-card ${type}`}
                      onClick={() => router.push(`/movie/series-${offset}-${i}`)}
                    >
                        {type === 'wide' && <span className="top-10-corner-badge">TOP<br/>10</span>}
                       
                        <img 
                          src={`https://picsum.photos/seed/${offset * 10 + i}/${type === 'wide' ? '400/225' : '300/450'}`} 
                          alt="Series" 
                        />
                         {/* Card Badge for Series */}
                         <div className="series-n-badge">★</div>
                    </div>
                ))}
            </div>
        </div>
    )
}
