import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { FaPlay, FaTrash, FaHeart } from 'react-icons/fa';
import '../styles/main.css';
import '../styles/watchlist.css';

interface WatchlistItem {
  id: string;
  content_id: string;
  content_type: string;
  title: string;
  poster_url: string | null;
  year: string | null;
  rating: string | null;
  genre: string | null;
  created_at: string;
}

const WatchlistPage: React.FC = () => {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWatchlist = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWatchlist(data || []);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchWatchlist();
    }
  }, [user, fetchWatchlist]);

  const removeFromWatchlist = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setWatchlist(watchlist.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      alert('Failed to remove from watchlist');
    }
  };

  if (!user) {
    return (
      <div className="watchlist-page">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">My Watchlist</h1>
            <p className="text-gray-600 mb-6">Please login to view your watchlist.</p>
            <Link to="/login" className="btn btn-primary">Login</Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="watchlist-page">
        <div className="container mx-auto px-4 py-8" style={{ paddingTop: '120px' }}>
          <div className="watchlist-header">
            <h1 className="watchlist-title">My Watchlist</h1>
          </div>
          <div className="watchlist-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="watchlist-skeleton">
                <div className="watchlist-skeleton-image"></div>
                <div className="watchlist-skeleton-content">
                  <div className="watchlist-skeleton-title"></div>
                  <div className="watchlist-skeleton-meta"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="watchlist-page">
      <div className="container mx-auto px-4 py-8" style={{ paddingTop: '120px' }}>
        <div className="watchlist-header">
          <h1 className="watchlist-title">My Watchlist</h1>
          <div className="watchlist-stats">
            <div className="watchlist-stat">
              <FaHeart className="watchlist-stat-icon" />
              <span className="watchlist-stat-text">
                {watchlist.length} {watchlist.length === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>
        </div>

        {watchlist.length === 0 ? (
          <div className="watchlist-empty">
            <FaHeart className="watchlist-empty-icon" />
            <h2 className="watchlist-empty-title">Your watchlist is empty</h2>
            <p className="watchlist-empty-text">Start adding movies and shows to your watchlist!</p>
            <Link to="/" className="btn btn-primary">Browse Content</Link>
          </div>
        ) : (
          <div className="watchlist-grid">
            {watchlist.map((item) => (
              <div key={item.id} className="watchlist-card">
                <div className="watchlist-card-image">
                  <img
                    src={item.poster_url || '/placeholder-movie.jpg'}
                    alt={item.title}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-movie.jpg';
                    }}
                  />
                  <div className="watchlist-card-overlay">
                    <Link
                      to={`/${item.content_type}s/${item.content_id}`}
                      className="watchlist-card-play"
                    >
                      <FaPlay />
                    </Link>
                  </div>
                </div>

                <div className="watchlist-card-content">
                  <h3 className="watchlist-card-title">{item.title}</h3>

                  <div className="watchlist-card-meta">
                    {item.year && <span className="watchlist-card-year">{item.year}</span>}
                    {item.rating && (
                      <span className="watchlist-card-rating">
                        ★ {item.rating}
                      </span>
                    )}
                  </div>

                  {item.genre && (
                    <div className="watchlist-card-genre">{item.genre}</div>
                  )}

                  <div className="watchlist-card-actions">
                    <Link
                      to={`/${item.content_type}s/${item.content_id}`}
                      className="watchlist-card-watch"
                    >
                      <FaPlay className="mr-1" /> Watch Now
                    </Link>

                    <button
                      onClick={() => removeFromWatchlist(item.id)}
                      className="watchlist-card-remove"
                      title="Remove from watchlist"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchlistPage;