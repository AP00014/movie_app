import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlay, FaPlus, FaStar } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import '../../styles/main.css';

interface MovieCardProps {
  id: string;
  title: string;
  posterUrl?: string;
  year: string;
  rating: string;
  category: string;
  type?: 'movie' | 'series' | 'music' | 'game';
}

// Online movie poster images
const moviePosters = [
  "https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg", // Deadpool
  "https://image.tmdb.org/t/p/w500/qhb1qOilapbapxWQn9jtRCL7QfX.jpg", // Avengers
  "https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg", // Interstellar
  "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg", // Shawshank
  "https://image.tmdb.org/t/p/w500/rktDFB0HOcgGwbj1fOKIGaAg2GQ.jpg", // Inception
  "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg", // Fight Club
  "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg", // The Dark Knight
  "https://image.tmdb.org/t/p/w500/velWPhVMQeQKcxggNEU8YmIo52R.jpg", // Pulp Fiction
];

const MovieCard: React.FC<MovieCardProps> = ({
  id,
  title,
  posterUrl,
  year,
  rating,
  category,
  type = 'movie'
}) => {
  const { user } = useAuth();
  // Use provided posterUrl or select a random one from our collection
  const imageSrc = posterUrl || moviePosters[Math.floor(Math.random() * moviePosters.length)];

  const addToWatchlist = async () => {
    if (!user) {
      alert('Please login to add to watchlist');
      return;
    }

    try {
      const { error } = await supabase
        .from('watchlist')
        .insert({
          user_id: user.id,
          content_id: id,
          content_type: type,
          title: title,
          poster_url: imageSrc,
          year: year,
          rating: rating
        });

      if (error) throw error;

      alert('Added to watchlist!');
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      alert('Failed to add to watchlist');
    }
  };

  return (
    <div className="card movie-card">
      <div className="card-image">
        <img src={imageSrc} alt={`${title} poster`} loading="lazy" />
        <div className="card-overlay">
          <span className="badge badge-primary">
            <FaStar className="star-icon" /> {rating}
          </span>
          <div className="card-actions">
            <Link to={`/movies/${id}`} className="btn btn-primary btn-icon">
              <FaPlay /> Watch
            </Link>
            <button
              className="btn btn-outline btn-icon btn-sm"
              onClick={addToWatchlist}
              disabled={!user}
            >
              <FaPlus /> Watchlist
            </button>
          </div>
        </div>
      </div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <div className="card-meta">
          <span className="card-year">{year}</span>
          <span className="card-category">{category}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;