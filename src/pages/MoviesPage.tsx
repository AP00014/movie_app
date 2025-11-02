import React, { useState } from 'react';
import MovieCard from '../components/movies/MovieCard';

// Sample data (will be replaced with Supabase data)
const allMovies = [
  {
    id: '1',
    title: 'The Matrix',
    posterUrl: 'https://via.placeholder.com/300x450?text=The+Matrix',
    year: '1999',
    rating: 'PG-13',
    category: 'Sci-Fi'
  },
  {
    id: '2',
    title: 'Inception',
    posterUrl: 'https://via.placeholder.com/300x450?text=Inception',
    year: '2010',
    rating: 'PG-13',
    category: 'Sci-Fi'
  },
  {
    id: '3',
    title: 'The Dark Knight',
    posterUrl: 'https://via.placeholder.com/300x450?text=The+Dark+Knight',
    year: '2008',
    rating: 'PG-13',
    category: 'Action'
  },
  {
    id: '4',
    title: 'Pulp Fiction',
    posterUrl: 'https://via.placeholder.com/300x450?text=Pulp+Fiction',
    year: '1994',
    rating: 'R',
    category: 'Crime'
  },
  {
    id: '5',
    title: 'Forrest Gump',
    posterUrl: 'https://via.placeholder.com/300x450?text=Forrest+Gump',
    year: '1994',
    rating: 'PG-13',
    category: 'Drama'
  },
  {
    id: '6',
    title: 'Breaking Bad',
    posterUrl: 'https://via.placeholder.com/300x450?text=Breaking+Bad',
    year: '2008',
    rating: 'TV-MA',
    category: 'Drama'
  },
  {
    id: '7',
    title: 'Game of Thrones',
    posterUrl: 'https://via.placeholder.com/300x450?text=Game+of+Thrones',
    year: '2011',
    rating: 'TV-MA',
    category: 'Fantasy'
  },
  {
    id: '8',
    title: 'Stranger Things',
    posterUrl: 'https://via.placeholder.com/300x450?text=Stranger+Things',
    year: '2016',
    rating: 'TV-14',
    category: 'Sci-Fi'
  }
];

const categories = ['All', 'Action', 'Comedy', 'Crime', 'Drama', 'Fantasy', 'Sci-Fi'];
const years = ['All', '2020+', '2010-2019', '2000-2009', '1990-1999', 'Before 1990'];
const ratings = ['All', 'G', 'PG', 'PG-13', 'R', 'TV-14', 'TV-MA'];

const MoviesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedRating, setSelectedRating] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter movies based on selected filters
  const filteredMovies = allMovies.filter(movie => {
    const matchesCategory = selectedCategory === 'All' || movie.category === selectedCategory;
    const matchesRating = selectedRating === 'All' || movie.rating === selectedRating;
    
    let matchesYear = true;
    if (selectedYear !== 'All') {
      const movieYear = parseInt(movie.year);
      if (selectedYear === '2020+') matchesYear = movieYear >= 2020;
      else if (selectedYear === '2010-2019') matchesYear = movieYear >= 2010 && movieYear <= 2019;
      else if (selectedYear === '2000-2009') matchesYear = movieYear >= 2000 && movieYear <= 2009;
      else if (selectedYear === '1990-1999') matchesYear = movieYear >= 1990 && movieYear <= 1999;
      else if (selectedYear === 'Before 1990') matchesYear = movieYear < 1990;
    }
    
    const matchesSearch = searchQuery === '' || 
      movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesYear && matchesRating && matchesSearch;
  });

  return (
    <div className="movies-page">
      <h1>Movies & TV Shows</h1>
      
      <div className="filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <label>Category:</label>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>Year:</label>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.target.value)}
            className="filter-select"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>Rating:</label>
          <select 
            value={selectedRating} 
            onChange={(e) => setSelectedRating(e.target.value)}
            className="filter-select"
          >
            {ratings.map(rating => (
              <option key={rating} value={rating}>{rating}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="movies-grid">
        {filteredMovies.length > 0 ? (
          filteredMovies.map(movie => (
            <MovieCard key={movie.id} {...movie} />
          ))
        ) : (
          <div className="no-results">No movies found matching your filters.</div>
        )}
      </div>
    </div>
  );
};

export default MoviesPage;