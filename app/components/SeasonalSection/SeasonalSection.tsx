"use client";

import { Snowflake, Gift, Calendar, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import './SeasonalSection.css';

export default function SeasonalSection() {
  const router = useRouter();

  const seasonMovies = [
    { title: "Klaus", image: "https://picsum.photos/seed/klaus/300/400" },
    { title: "The Grinch", image: "https://picsum.photos/seed/grinch/300/400" },
    { title: "Home Alone", image: "https://picsum.photos/seed/homealone/300/400" }, 
    { title: "Frozen III", image: "https://picsum.photos/seed/frozen3/300/400" },
    { title: "Last Christmas", image: "https://picsum.photos/seed/lastxmas/300/400" }
  ];

  const handleViewAll = () => {
    router.push('/category/holiday-specials');
  };

  return (
    <div className="seasonal-container">
       <div className="seasonal-banner">
          <div className="snow-overlay"></div>
          <div className="banner-content">
             <div className="season-badge">
                <Snowflake size={14} className="spin-slow" />
                <span>WINTER FEST</span>
             </div>
             <h2 className="season-title">Holiday Specials</h2>
             <p className="season-subtitle">Cozy up with these festive favorites</p>
          </div>
          <Gift size={48} className="gift-icon-bg" />
       </div>

       <div className="season-rail-header">
           <span className="rail-title">Trending This Season</span>
           <span className="see-more" onClick={handleViewAll} style={{cursor: 'pointer'}}>
             View All <ChevronRight size={14} />
           </span>
       </div>

       <div className="season-rail">
           {seasonMovies.map((m, i) => (
               <div 
                 key={i} 
                 className="season-card" 
                 onClick={() => router.push('/movie/1')}
               >
                  <div className="img-box">
                      <img src={m.image} alt={m.title} />
                      <div className="frost-overlay"></div>
                      <div className="card-badge">
                          <Calendar size={10} /> 25 Dec
                      </div>
                  </div>
                  <span className="season-movie-title">{m.title}</span>
               </div>
           ))}
       </div>
    </div>
  );
}
