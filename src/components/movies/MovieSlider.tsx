import React, { useRef } from 'react';
import MovieCard from './MovieCard';
import '../../styles/main.css';

interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  year: string;
  rating: string;
  category: string;
  type?: 'movie' | 'series' | 'music' | 'game';
}

interface MovieSliderProps {
  title: string;
  movies: Movie[];
}

const MovieSlider: React.FC<MovieSliderProps> = ({ title, movies }) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const slideLeft = () => {
    if (sliderRef.current) {
      const width = sliderRef.current.offsetWidth;
      sliderRef.current.scrollLeft -= width / 2;
    }
  };

  const slideRight = () => {
    if (sliderRef.current) {
      const width = sliderRef.current.offsetWidth;
      sliderRef.current.scrollLeft += width / 2;
    }
  };

  return (
    <div className="slider-container">
      <h2 className="slider-title">{title}</h2>
      
      <div className="slider-controls">
        <button 
          className="slider-arrow slider-arrow-left" 
          onClick={slideLeft}
          aria-label="Scroll left"
        >
          &#10094;
        </button>
        
        <button 
          className="slider-arrow slider-arrow-right" 
          onClick={slideRight}
          aria-label="Scroll right"
        >
          &#10095;
        </button>
      </div>
      
      <div className="slider-content" ref={sliderRef}>
        <div className="slider-track">
          {movies.map((movie) => (
            <div className="slider-item" key={movie.id}>
              <MovieCard
                id={movie.id}
                title={movie.title}
                posterUrl={movie.posterUrl}
                year={movie.year}
                rating={movie.rating}
                category={movie.category}
                type={movie.type}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieSlider;