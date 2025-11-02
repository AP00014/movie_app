import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import VideoPlayer from '../components/player/VideoPlayer';
import '../styles/player.css';
import '../styles/movie-details.css';
import { useAuth } from '../hooks/useAuth';

interface MovieDetails {
  id: string;
  title: string;
  description: string;
  year: string;
  category: string;
  rating: string;
  duration: string;
  posterUrl: string;
  videoUrl: string;
}

const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    // In a real app, this would fetch from Supabase
    // For now, we'll use a mock movie
    const fetchMovie = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data
        setMovie({
          id: id || '1',
          title: 'The Matrix Resurrections',
          description: 'Return to a world of two realities: one, everyday life; the other, what lies behind it. To find out if his reality is a construct, Mr. Anderson will have to choose to follow the white rabbit once more.',
          year: '2021',
          category: 'Sci-Fi',
          rating: 'PG-13',
          duration: '2h 28m',
          posterUrl: 'https://m.media-amazon.com/images/M/MV5BMGJkNDJlZWUtOGM1Ny00YjNkLThiM2QtY2ZjMzQxMTIxNWNmXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=9ix7TUGVYIo' // Trailer URL for demo
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to load movie details');
        setLoading(false);
        console.error(err);
      }
    };

    fetchMovie();
  }, [id]);

  const handleWatchlistToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    // In a real app, this would call an API to add/remove from watchlist
    // For now, we'll just toggle the local state
    setIsInWatchlist(!isInWatchlist);

    // TODO: Implement actual watchlist API calls
    console.log(`${isInWatchlist ? 'Removing' : 'Adding'} movie ${movie?.id} to watchlist`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading movie...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error || 'Movie not found'}</p>
        <Link to="/movies" className="btn btn-primary">Back to Movies</Link>
      </div>
    );
  }

  return (
    <div className="movie-details-page">
      <div className="movie-details-header">
        <Link to="/movies" className="back-button">← Back to Movies</Link>
        <h1 className="movie-title">{movie.title}</h1>
        <div className="movie-meta">
          <span className="movie-year">{movie.year}</span>
          <span className="movie-rating">{movie.rating}</span>
          <span className="movie-duration">{movie.duration}</span>
          <span className="movie-category">{movie.category}</span>
        </div>
      </div>

      <div className="movie-player-container">
        <VideoPlayer
          url={movie.videoUrl}
          poster={movie.posterUrl}
        />
      </div>

      <div className="movie-details-content">
        <div className="movie-description">
          <h2>About the Movie</h2>
          <p>{movie.description}</p>
        </div>

        <div className="movie-actions">
          <button
            className={`btn ${isInWatchlist ? 'btn-secondary' : 'btn-primary'}`}
            onClick={handleWatchlistToggle}
            disabled={!user}
          >
            {user ? (isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist') : 'Login to Add to Watchlist'}
          </button>
          {!user && (
            <button
              className="btn btn-outline"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
          )}
          <button className="btn btn-outline">Share</button>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;