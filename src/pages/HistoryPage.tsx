import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/movie.css';

interface HistoryItem {
  id: string;
  title: string;
  poster_url: string;
  watched_at: string;
  progress: number;
}

const HistoryPage = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Sample watch history data - in a real app, this would come from an API
    const sampleHistory: HistoryItem[] = [
      {
        id: '1',
        title: 'Inception',
        poster_url: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
        watched_at: '2023-06-15T14:30:00Z',
        progress: 100
      },
      {
        id: '2',
        title: 'The Dark Knight',
        poster_url: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        watched_at: '2023-06-10T20:15:00Z',
        progress: 100
      },
      {
        id: '3',
        title: 'Interstellar',
        poster_url: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        watched_at: '2023-06-05T19:45:00Z',
        progress: 75
      }
    ];

    // Simulate API call to get watch history
    setTimeout(() => {
      setHistory(sampleHistory);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="page-container">
      <div className="content-container">
        <h1 className="page-title">Watch History</h1>
        
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your watch history...</p>
          </div>
        ) : history.length > 0 ? (
          <div className="history-list">
            {history.map(item => (
              <div key={item.id} className="history-item">
                <div className="history-poster">
                  <img src={item.poster_url} alt={item.title} />
                  {item.progress < 100 && (
                    <div className="progress-overlay">
                      <div className="progress-bar" style={{ width: `${item.progress}%` }}></div>
                    </div>
                  )}
                </div>
                <div className="history-details">
                  <h3>{item.title}</h3>
                  <p className="history-date">Watched on {formatDate(item.watched_at)}</p>
                  {item.progress < 100 ? (
                    <p className="history-progress">{item.progress}% completed</p>
                  ) : (
                    <p className="history-completed">Completed</p>
                  )}
                  <Link to={`/movies/${item.id}`} className="btn btn-outline btn-sm">
                    {item.progress < 100 ? 'Continue Watching' : 'Watch Again'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>Your watch history is empty</h3>
            <p>Movies you watch will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;