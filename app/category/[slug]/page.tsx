"use client";

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Play, Star } from 'lucide-react';
import './CategoryPage.css';

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const decodedTitle = decodeURIComponent(slug).replace(/-/g, ' ').toUpperCase();

  // Mock data for the category grid
  const movies = Array.from({ length: 24 }).map((_, i) => ({
    id: i,
    title: `${decodedTitle} Movie ${i + 1}`,
    image: `https://picsum.photos/seed/${slug}${i}/300/450`,
    rating: '98%',
    year: '2024'
  }));

  return (
    <div className="category-page-container">
      <div className="category-header">
        <button className="back-btn" onClick={() => router.back()}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="category-title">{decodedTitle}</h1>
      </div>

      <div className="category-grid">
        {movies.map((movie) => (
          <div key={movie.id} className="grid-item" onClick={() => router.push('/movie/1')}>
             <div className="poster-wrap">
               <img src={movie.image} alt={movie.title} />
               <div className="grid-item-overlay">
                  <div className="overlay-content">
                     <button className="grid-play-btn"><Play fill="white" size={16} /></button>
                     <div className="grid-meta">
                        <span className="match-score">{movie.rating} Match</span>
                        <div className="row-meta">
                           <span className="meta-tag">HD</span>
                           <span className="meta-tag">{movie.year}</span>
                        </div>
                     </div>
                  </div>
               </div>
             </div>
             <p className="grid-item-title">{movie.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
