import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaPlay, FaPlus, FaChevronLeft, FaChevronRight, FaDownload, FaBookmark } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

interface FeaturedMovie {
  id: string;
  title: string;
  backdropUrl: string;
  description: string;
  year: string;
  rating: string;
  genre: string;
  type: 'movie' | 'series' | 'music' | 'game';
  trailerUrl?: string;
  duration?: string;
  director?: string;
  cast?: string[];
}

interface FeaturedSliderProps {
  movies: FeaturedMovie[];
}

const FeaturedSlider: React.FC<FeaturedSliderProps> = ({ movies }) => {
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState<boolean[]>(Array(movies.length).fill(false));
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState<boolean[]>(Array(movies.length).fill(false));
  const [isInLibrary, setIsInLibrary] = useState<boolean[]>(Array(movies.length).fill(false));
  const sliderRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<number | null>(null);

  // Function to handle image load
  const handleImageLoad = (index: number) => {
    const newLoadedState = [...isLoaded];
    newLoadedState[index] = true;
    setIsLoaded(newLoadedState);
  };

  // Enhanced auto-advance with pause on hover
  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      if (isAutoPlaying) {
        setCurrentSlide((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
      }
    }, 6000);
  }, [movies.length, isAutoPlaying]);

  // Pause/resume autoplay on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  // Enhanced navigation with smooth transitions
  const goToSlide = useCallback((index: number) => {
    if (index !== currentSlide) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide(index);
        setIsTransitioning(false);
      }, 150);
    }
  }, [currentSlide]);

  // Check if content is in watchlist/library
  useEffect(() => {
    const checkUserLists = async () => {
      if (!user?.id || !movies.length) return;

      try {
        // Check watchlist status for all movies at once
        const watchlistPromises = movies.map(async (movie) => {
          try {
            const { data, error } = await supabase
              .from('watchlist')
              .select('id')
              .eq('user_id', user.id)
              .eq('content_id', movie.id)
              .eq('content_type', movie.type)
              .limit(1);

            if (error) {
              return false;
            }

            return Boolean(data && data.length > 0);
          } catch {
            return false;
          }
        });

        // Check library status for all movies at once
        const libraryPromises = movies.map(async (movie) => {
          try {
            const { data, error } = await supabase
              .from('library')
              .select('id')
              .eq('user_id', user.id)
              .eq('content_id', movie.id)
              .eq('content_type', movie.type)
              .limit(1);

            if (error) {
              return false;
            }

            return Boolean(data && data.length > 0);
          } catch {
            return false;
          }
        });

        const [watchlistResults, libraryResults] = await Promise.all([
          Promise.all(watchlistPromises),
          Promise.all(libraryPromises)
        ]);

        setIsInWatchlist(watchlistResults);
        setIsInLibrary(libraryResults);
      } catch {
        // Silently handle main error
      }
    };

    checkUserLists();
  }, [user?.id, movies]);

  // Add to watchlist function
  const addToWatchlist = async (movie: FeaturedMovie) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('watchlist')
        .insert({
          user_id: user.id,
          content_id: movie.id,
          content_type: movie.type,
          title: movie.title,
          poster_url: movie.backdropUrl,
          year: movie.year,
          rating: movie.rating
          // Removed genre field as it doesn't exist in the schema
        });

      if (error) throw error;

      // Update local state
      const newWatchlistState = [...isInWatchlist];
      const movieIndex = movies.findIndex(m => m.id === movie.id);
      if (movieIndex !== -1) {
        newWatchlistState[movieIndex] = true;
        setIsInWatchlist(newWatchlistState);
      }

      alert('Added to watchlist!');
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      alert('Failed to add to watchlist');
    }
  };

  // Add to library function
  const addToLibrary = async (movie: FeaturedMovie) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('library')
        .insert({
          user_id: user.id,
          content_id: movie.id,
          content_type: movie.type,
          title: movie.title,
          poster_url: movie.backdropUrl,
          year: movie.year,
          rating: movie.rating
          // Removed genre field as it doesn't exist in the schema
        });

      if (error) throw error;

      // Update local state
      const newLibraryState = [...isInLibrary];
      const movieIndex = movies.findIndex(m => m.id === movie.id);
      if (movieIndex !== -1) {
        newLibraryState[movieIndex] = true;
        setIsInLibrary(newLibraryState);
      }

      alert('Added to library!');
    } catch (error) {
      console.error('Error adding to library:', error);
      alert('Failed to add to library');
    }
  };

  useEffect(() => {
    startAutoPlay();
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [startAutoPlay]);

  // Navigation functions
  const goToNextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
  }, [movies.length]);

  const goToPrevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
  }, [movies.length]);


  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToNextSlide();
      } else if (e.key === 'ArrowLeft') {
        goToPrevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextSlide, goToPrevSlide]);

  return (
    <div className="featured-movie" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="featured-slider" ref={sliderRef}>
        {movies.map((movie, index) => (
          <div
            key={movie.id}
            className={`featured-slide ${index === currentSlide ? 'active' : ''} ${isTransitioning ? 'transitioning' : ''}`}
          >
            {/* Enhanced image with better loading states */}
            <img
              src={movie.backdropUrl}
              alt={movie.title}
              className="featured-movie-image"
              onLoad={() => handleImageLoad(index)}
              onError={() => handleImageLoad(index)} // Treat error as loaded to prevent infinite loading
              loading="eager" // Changed from lazy to eager for immediate loading
              style={{
                opacity: index === currentSlide ? 1 : 0,
                transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'absolute',
                zIndex: index === currentSlide ? 1 : 0,
                objectFit: 'cover',
                width: '100%',
                height: '100%'
              }}
            />

            {/* Fallback background for failed loads */}
            {index === currentSlide && !isLoaded[index] && (
              <div
                className="featured-fallback-bg"
                style={{
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#666',
                  fontSize: '1.5rem',
                  fontWeight: '500'
                }}
              >
                {movie.title}
              </div>
            )}
          </div>
        ))}

        <div className="featured-movie-content">
          <div className="featured-content-wrapper">
            <h1 className="featured-title">{movies[currentSlide].title}</h1>

            <div className="featured-meta">
              <span className="featured-year">{movies[currentSlide].year}</span>
              <span className="featured-rating">
                <span className="rating-star">★</span> {movies[currentSlide].rating}
              </span>
              <span className="featured-genre">{movies[currentSlide].genre}</span>
              {movies[currentSlide].duration && (
                <span className="featured-duration">{movies[currentSlide].duration}</span>
              )}
            </div>

            {movies[currentSlide].director && (
              <div className="featured-director">
                <span className="director-label">Directed by:</span> {movies[currentSlide].director}
              </div>
            )}

            {movies[currentSlide].cast && movies[currentSlide].cast.length > 0 && (
              <div className="featured-cast">
                <span className="cast-label">Starring:</span> {movies[currentSlide].cast.slice(0, 3).join(', ')}
                {movies[currentSlide].cast.length > 3 && ' ...'}
              </div>
            )}

            <p className="featured-description">{movies[currentSlide].description}</p>

            <div className="featured-actions">
              {movies[currentSlide].type === 'game' ? (
                <>
                  <Link to={`/gaming/${movies[currentSlide].id}`} className="btn btn-primary btn-lg">
                    <FaDownload /> Download Now
                  </Link>
                  <button
                    className={`btn btn-outline btn-lg ${isInLibrary[currentSlide] ? 'active' : ''}`}
                    onClick={() => user ? addToLibrary(movies[currentSlide]) : alert('Please login to add to library')}
                    disabled={!user}
                  >
                    <FaBookmark /> {isInLibrary[currentSlide] ? 'In Library' : 'Add to Library'}
                  </button>
                </>
              ) : (
                <>
                  <Link to={`/${movies[currentSlide].type}s/${movies[currentSlide].id}`} className="btn btn-primary btn-lg">
                    <FaPlay /> Watch Now
                  </Link>
                  <button
                    className={`btn btn-outline btn-lg ${isInWatchlist[currentSlide] ? 'active' : ''}`}
                    onClick={() => user ? addToWatchlist(movies[currentSlide]) : alert('Please login to add to watchlist')}
                    disabled={!user}
                  >
                    <FaPlus /> {isInWatchlist[currentSlide] ? 'In Watchlist' : 'Add to Watchlist'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced navigation */}
        <button className="slider-nav slider-nav-prev" onClick={goToPrevSlide} aria-label="Previous slide">
          <FaChevronLeft />
        </button>
        <button className="slider-nav slider-nav-next" onClick={goToNextSlide} aria-label="Next slide">
          <FaChevronRight />
        </button>

        {/* Progress indicators - Hidden by default, shown on hover */}
        <div className="slider-indicators" style={{ opacity: 0, transition: 'opacity 0.3s ease' }}>
          {movies.map((_, index) => (
            <button
              key={index}
              className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Auto-play indicator */}
        <div className="autoplay-indicator">
          <div className="autoplay-progress" style={{ width: `${((currentSlide + 1) / movies.length) * 100}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedSlider;
