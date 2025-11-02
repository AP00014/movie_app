import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { FaPlay, FaTrash, FaFolder, FaDownload } from 'react-icons/fa';
import '../styles/main.css';
import '../styles/library.css';

interface LibraryItem {
  id: string;
  content_id: string;
  content_type: string;
  title: string;
  poster_url: string | null;
  year: string | null;
  rating: string | null;
  genre: string | null;
  download_date: string;
  file_path: string | null;
}

const LibraryPage: React.FC = () => {
  const { user } = useAuth();
  const [library, setLibrary] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLibrary = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('library')
        .select('*')
        .eq('user_id', user.id)
        .order('download_date', { ascending: false });

      if (error) throw error;
      setLibrary(data || []);
    } catch (error) {
      console.error('Error fetching library:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user) {
      fetchLibrary();
    }
  }, [user, fetchLibrary]);

  const removeFromLibrary = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('library')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setLibrary(library.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing from library:', error);
      alert('Failed to remove from library');
    }
  };

  const downloadFile = (filePath: string | null, fileName: string) => {
    if (!filePath) {
      alert('File path not available');
      return;
    }
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    link.click();
  };

  if (!user) {
    return (
      <div className="library-page">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="library-title">My Library</h1>
            <p className="text-gray-400 mb-6">Please login to view your library.</p>
            <Link to="/login" className="btn btn-primary">Login</Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="library-page">
        <div className="container mx-auto px-4">
          <div className="library-header">
            <h1 className="library-title">My Library</h1>
          </div>
          <div className="library-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="library-skeleton">
                <div className="library-skeleton-image"></div>
                <div className="library-skeleton-content">
                  <div className="library-skeleton-title"></div>
                  <div className="library-skeleton-meta"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="library-page" style={{ paddingTop: '120px' }}>
      <div className="container mx-auto px-4">
        <div className="library-header">
          <h1 className="library-title">My Library</h1>
          <div className="library-stats">
            <div className="library-stat">
              <FaFolder className="library-stat-icon" />
              <span className="library-stat-text">
                {library.length} {library.length === 1 ? 'Item' : 'Items'}
              </span>
            </div>
          </div>
        </div>

        {library.length === 0 ? (
          <div className="library-empty">
            <FaFolder className="library-empty-icon" />
            <h2 className="library-empty-title">Your Library is Empty</h2>
            <p className="library-empty-text">
              Start building your collection by downloading movies, games, and music to enjoy offline!
            </p>
            <Link to="/" className="btn btn-primary">
              <FaDownload className="mr-2" />
              Browse Content
            </Link>
          </div>
        ) : (
          <div className="library-grid">
            {library.map((item) => (
              <div key={item.id} className="library-card">
                <div className="library-card-image">
                  <img
                    src={item.poster_url || '/placeholder-movie.jpg'}
                    alt={item.title}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-movie.jpg';
                    }}
                  />
                  <div className="library-card-overlay">
                    <Link
                      to={`/${item.content_type}s/${item.content_id}`}
                      className="library-card-play"
                    >
                      <FaPlay />
                    </Link>
                  </div>
                  <div className="library-owned-badge">OWNED</div>
                </div>

                <div className="library-card-content">
                  <h3 className="library-card-title">{item.title}</h3>

                  <div className="library-card-meta">
                    {item.year && <span className="library-card-year">{item.year}</span>}
                    {item.rating && (
                      <>
                        <span>•</span>
                        <span className="library-card-rating">
                          <FaPlay className="mr-1" style={{ fontSize: '0.75rem' }} />
                          {item.rating}
                        </span>
                      </>
                    )}
                  </div>

                  {item.genre && (
                    <div className="library-card-genre">{item.genre}</div>
                  )}

                  <div className="library-card-downloaded">
                    Downloaded {new Date(item.download_date).toLocaleDateString()}
                  </div>

                  <div className="library-card-actions">
                    <Link
                      to={`/${item.content_type}s/${item.content_id}`}
                      className="library-card-watch"
                    >
                      <FaPlay className="mr-1" />
                      Watch Now
                    </Link>

                    <button
                      onClick={() => downloadFile(item.file_path, item.title)}
                      className="library-card-download"
                      title="Download file"
                    >
                      <FaDownload />
                    </button>

                    <button
                      onClick={() => removeFromLibrary(item.id)}
                      className="library-card-remove"
                      title="Remove from library"
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

export default LibraryPage;