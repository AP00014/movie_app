"use client";
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import './MovieSection.css';

export default function MovieSection({ title, fireIcon = false }: { title: string, fireIcon?: boolean }) {
  const router = useRouter();
  
  // Using reliable images simulating movie posters
  const movies = [
    { 
      title: 'Wednesday', 
      image: 'https://picsum.photos/seed/wednesday/300/400' 
    },
    { 
      title: 'Beauty in Black', 
      image: 'https://picsum.photos/seed/beautyinblack/300/400' 
    },
    { 
      title: 'Fatal Seduction', 
      image: 'https://picsum.photos/seed/fatalseduction/300/400' 
    },
    { 
      title: 'Weapons', 
      image: 'https://picsum.photos/seed/weapons/300/400' 
    },
    { 
      title: 'Love in Paris', 
      image: 'https://picsum.photos/seed/loveinparis/300/400' 
    }
  ];

  const handleViewAll = () => {
    const slug = encodeURIComponent(title.toLowerCase().replace(/\s+/g, '-'));
    router.push(`/category/${slug}`);
  };

  return (
    <div className="movie-section">
      <div className="section-header">
        <h3 className="section-title-row">
           {title} {fireIcon && <span className="fire">🔥</span>}
        </h3>
        <span className="see-all" onClick={handleViewAll}>
          All <ChevronRight size={14} />
        </span>
      </div>
      <div className="movie-rail">
         {movies.map((m, i) => (
           <div className="movie-card-vertical" key={i} onClick={() => router.push('/movie/1')} style={{cursor: 'pointer'}}>
              <div className="poster-wrapper">
                 <img src={m.image} alt={m.title} />
                 {i === 0 && <span className="series-tag">SEASON 2</span>}
              </div>
              <div className="movie-info-bottom">
                 <span className="m-title">{m.title}</span>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
}
