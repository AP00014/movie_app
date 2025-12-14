"use client";

import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import './SeriesSection.css';

export default function SeriesSection({ title }: { title: string }) {
  const router = useRouter();

  const series = [
    { 
      id: 'money-heist',
      title: 'Money Heist', 
      image: 'https://picsum.photos/seed/moneyheist/300/400', 
      tag: 'New Season' 
    },
    { 
      id: 'spartacus',
      title: 'Spartacus', 
      image: 'https://picsum.photos/seed/spartacus/300/400', 
      tag: 'Trending' 
    },
    { 
      id: 'merlin',
      title: 'Merlin', 
      image: 'https://picsum.photos/seed/merlin/300/400', 
      tag: 'Completed' 
    },
    { 
      id: 'got',
      title: 'Game of Thrones', 
      image: 'https://picsum.photos/seed/got/300/400', 
      tag: 'Must Watch' 
    }
  ];

  const handleViewAll = () => {
    const slug = encodeURIComponent(title.toLowerCase().replace(/\s+/g, '-'));
    router.push(`/category/${slug}`);
  };

  return (
    <div className="series-section">
      <div className="section-header">
        <h3 className="section-title-row">
           {title} 
        </h3>
        <span className="see-all" onClick={handleViewAll}>
          All <ChevronRight size={14} />
        </span>
      </div>
      <div className="series-rail">
         {series.map((s, i) => (
           <div 
             className="series-card" 
             key={i} 
             onClick={() => router.push(`/movie/${s.id}`)}
           >
              <div className="series-poster">
                 <img src={s.image} alt={s.title} />
                 <div className="series-tag-badge">{s.tag}</div>
              </div>
              <div className="series-info">
                 <span className="s-title">{s.title}</span>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
}
