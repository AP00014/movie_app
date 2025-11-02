import React from 'react';
import MovieSlider from '../components/movies/MovieSlider';
import FeaturedSlider from '../components/movies/FeaturedSlider';

// Featured slider data
const featuredSliderMovies = [
  {
    id: '1',
    title: 'Dune: Part Two',
    backdropUrl: 'https://image.tmdb.org/t/p/original/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg',
    description: 'Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.',
    year: '2024',
    rating: '8.5',
    genre: 'Sci-Fi',
    type: 'movie' as const
  },
  {
    id: '2',
    title: 'Oppenheimer',
    backdropUrl: 'https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    year: '2023',
    rating: '8.9',
    genre: 'Drama',
    type: 'movie' as const
  },
  {
    id: '3',
    title: 'FIFA 25',
    backdropUrl: 'https://www.budgetgaming.nl/plaatjes/reviews/EA%20Sports%20FC%2025/EAFC25_-_Screen1.jpg',
    description: 'Experience the most realistic football simulation ever created. Play as your favorite teams and players in stunning detail with enhanced gameplay mechanics.',
    year: '2024',
    rating: '9.2',
    genre: 'Sports',
    type: 'game' as const
  },
  {
    id: '4',
    title: 'Joker: Folie à Deux',
    backdropUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1920&h=1080&fit=crop',
    description: 'Arthur Fleck, now institutionalized at Arkham, falls in love with a fellow patient as he continues his transformation into the Joker.',
    year: '2024',
    rating: '8.7',
    genre: 'Thriller',
    type: 'movie' as const
  }
];

// Sample data with online images
const featuredMovies = [
  {
    id: '1',
    title: 'The Matrix',
    posterUrl: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    year: '1999',
    rating: '8.7',
    category: 'Sci-Fi',
    type: 'movie' as const
  },
  {
    id: '2',
    title: 'Inception',
    posterUrl: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    year: '2010',
    rating: '8.8',
    category: 'Sci-Fi',
    type: 'movie' as const
  },
  {
    id: '3',
    title: 'The Dark Knight',
    posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    year: '2008',
    rating: '9.0',
    category: 'Action',
    type: 'movie' as const
  },
  {
    id: '4',
    title: 'Pulp Fiction',
    posterUrl: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
    year: '1994',
    rating: '8.9',
    category: 'Crime',
    type: 'movie' as const
  },
  {
    id: '5',
    title: 'Forrest Gump',
    posterUrl: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
    year: '1994',
    rating: '8.8',
    category: 'Drama',
    type: 'movie' as const
  }
];

const tvSeries = [
  {
    id: '6',
    title: 'Breaking Bad',
    posterUrl: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
    year: '2008',
    rating: '9.5',
    category: 'Drama',
    type: 'series' as const
  },
  {
    id: '7',
    title: 'Game of Thrones',
    posterUrl: 'https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg',
    year: '2011',
    rating: '9.3',
    category: 'Fantasy',
    type: 'series' as const
  },
  {
    id: '8',
    title: 'Stranger Things',
    posterUrl: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
    year: '2016',
    rating: '8.7',
    category: 'Sci-Fi',
    type: 'series' as const
  },
  {
    id: '9',
    title: 'The Office',
    posterUrl: 'https://image.tmdb.org/t/p/w500/qWnJzyZhyy74gjpSjIXWmuk0ifX.jpg',
    year: '2005',
    rating: '8.9',
    category: 'Comedy',
    type: 'series' as const
  },
  {
    id: '10',
    title: 'Friends',
    posterUrl: 'https://image.tmdb.org/t/p/w500/f496cm9enuEsZkSPzCwnTESEK5s.jpg',
    year: '1994',
    rating: '8.4',
    category: 'Comedy',
    type: 'series' as const
  }
];

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <FeaturedSlider movies={featuredSliderMovies} />

      <section className="section">
        <MovieSlider title="Trending Movies" movies={featuredMovies} />
      </section>

      <section className="section">
        <MovieSlider title="Popular TV Series" movies={tvSeries} />
      </section>

      <section className="section">
        <MovieSlider title="New Releases" movies={featuredMovies} />
      </section>

      <section className="section">
        <MovieSlider title="Featured Games" movies={featuredMovies} />
      </section>
    </div>
  );
};

export default HomePage;