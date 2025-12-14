// Search data for all content categories
export interface SearchItem {
  id: string;
  title: string;
  subtitle?: string;
  type: 'movie' | 'series' | 'music' | 'animation' | 'shorts' | 'trending';
  category?: string;
  year?: number;
  rating?: number;
  image: string;
  description?: string;
  duration?: string;
}

// Movies data
export const moviesData: SearchItem[] = [
  { id: 'm1', title: 'Inception', subtitle: 'Christopher Nolan', type: 'movie', category: 'Sci-Fi', year: 2010, rating: 8.8, image: 'https://picsum.photos/seed/inception/300/450', description: 'A thief who enters the dreams of others...' },
  { id: 'm2', title: 'Interstellar', subtitle: 'Christopher Nolan', type: 'movie', category: 'Sci-Fi', year: 2014, rating: 8.6, image: 'https://picsum.photos/seed/interstellar/300/450', description: 'Explorers travel through a wormhole in space...' },
  { id: 'm3', title: 'The Dark Knight', subtitle: 'Christopher Nolan', type: 'movie', category: 'Action', year: 2008, rating: 9.0, image: 'https://picsum.photos/seed/darkknight/300/450', description: 'Batman faces the Joker...' },
  { id: 'm4', title: 'Parasite', subtitle: 'Bong Joon-ho', type: 'movie', category: 'Thriller', year: 2019, rating: 8.5, image: 'https://picsum.photos/seed/parasite/300/450', description: 'A poor family schemes to become employed...' },
  { id: 'm5', title: 'Dune', subtitle: 'Denis Villeneuve', type: 'movie', category: 'Sci-Fi', year: 2021, rating: 8.0, image: 'https://picsum.photos/seed/dune/300/450', description: 'Paul Atreides leads nomadic tribes in a battle...' },
  { id: 'm6', title: 'Oppenheimer', subtitle: 'Christopher Nolan', type: 'movie', category: 'Biography', year: 2023, rating: 8.4, image: 'https://picsum.photos/seed/oppenheimer/300/450', description: 'The story of American scientist J. Robert Oppenheimer...' },
  { id: 'm7', title: 'Avatar: The Way of Water', subtitle: 'James Cameron', type: 'movie', category: 'Sci-Fi', year: 2022, rating: 7.6, image: 'https://picsum.photos/seed/avatar2/300/450', description: 'Jake Sully lives with his newfound family...' },
  { id: 'm8', title: 'Top Gun: Maverick', subtitle: 'Joseph Kosinski', type: 'movie', category: 'Action', year: 2022, rating: 8.3, image: 'https://picsum.photos/seed/topgun/300/450', description: 'After thirty years, Maverick is still pushing the envelope...' },
  { id: 'm9', title: 'Spider-Man: No Way Home', subtitle: 'Jon Watts', type: 'movie', category: 'Action', year: 2021, rating: 8.2, image: 'https://picsum.photos/seed/spiderman/300/450', description: 'Peter Parker seeks Doctor Strange\'s help...' },
  { id: 'm10', title: 'The Batman', subtitle: 'Matt Reeves', type: 'movie', category: 'Action', year: 2022, rating: 7.8, image: 'https://picsum.photos/seed/thebatman/300/450', description: 'Batman ventures into Gotham\'s underworld...' },
  { id: 'm11', title: 'Everything Everywhere All at Once', subtitle: 'Daniels', type: 'movie', category: 'Sci-Fi', year: 2022, rating: 7.8, image: 'https://picsum.photos/seed/everything/300/450', description: 'A middle-aged Chinese immigrant is swept up in an adventure...' },
  { id: 'm12', title: 'John Wick 4', subtitle: 'Chad Stahelski', type: 'movie', category: 'Action', year: 2023, rating: 7.7, image: 'https://picsum.photos/seed/johnwick4/300/450', description: 'John Wick uncovers a path to defeating The High Table...' },
];

// Series data
export const seriesData: SearchItem[] = [
  { id: 's1', title: 'Stranger Things', subtitle: 'Sci-Fi Drama', type: 'series', category: 'Sci-Fi', year: 2016, rating: 8.7, image: 'https://picsum.photos/seed/stranger/300/450', description: 'When a young boy vanishes, a small town uncovers a mystery...' },
  { id: 's2', title: 'Breaking Bad', subtitle: 'Crime Drama', type: 'series', category: 'Drama', year: 2008, rating: 9.5, image: 'https://picsum.photos/seed/breakingbad/300/450', description: 'A high school chemistry teacher turned meth manufacturer...' },
  { id: 's3', title: 'The Crown', subtitle: 'Historical Drama', type: 'series', category: 'Drama', year: 2016, rating: 8.7, image: 'https://picsum.photos/seed/crown/300/450', description: 'The life of Queen Elizabeth II from the 1940s...' },
  { id: 's4', title: 'Squid Game', subtitle: 'Thriller Series', type: 'series', category: 'Thriller', year: 2021, rating: 8.0, image: 'https://picsum.photos/seed/squidgame/300/450', description: 'Hundreds of cash-strapped players accept an invitation...' },
  { id: 's5', title: 'Wednesday', subtitle: 'Comedy Horror', type: 'series', category: 'Comedy', year: 2022, rating: 8.1, image: 'https://picsum.photos/seed/wednesday/300/450', description: 'Wednesday Addams is sent to Nevermore Academy...' },
  { id: 's6', title: 'The Last of Us', subtitle: 'HBO', type: 'series', category: 'Drama', year: 2023, rating: 8.8, image: 'https://picsum.photos/seed/lastofus/300/450', description: 'Joel and Ellie struggle to survive in a post-apocalyptic world...' },
  { id: 's7', title: 'House of the Dragon', subtitle: 'HBO', type: 'series', category: 'Fantasy', year: 2022, rating: 8.4, image: 'https://picsum.photos/seed/hotd/300/450', description: 'The story of the Targaryen dynasty 200 years before Game of Thrones...' },
  { id: 's8', title: 'The Mandalorian', subtitle: 'Disney+', type: 'series', category: 'Sci-Fi', year: 2019, rating: 8.7, image: 'https://picsum.photos/seed/mandalorian/300/450', description: 'A lone bounty hunter in the outer reaches of the galaxy...' },
  { id: 's9', title: 'Succession', subtitle: 'HBO', type: 'series', category: 'Drama', year: 2018, rating: 8.9, image: 'https://picsum.photos/seed/succession/300/450', description: 'The Roy family controls the biggest media conglomerate...' },
  { id: 's10', title: 'The Bear', subtitle: 'FX', type: 'series', category: 'Drama', year: 2022, rating: 8.6, image: 'https://picsum.photos/seed/thebear/300/450', description: 'A young chef from the fine dining world returns to Chicago...' },
];

// Music data
export const musicData: SearchItem[] = [
  { id: 'mu1', title: 'Blinding Lights', subtitle: 'The Weeknd', type: 'music', category: 'Pop', year: 2020, image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&q=80' },
  { id: 'mu2', title: 'Starboy', subtitle: 'The Weeknd', type: 'music', category: 'Pop', year: 2016, image: 'https://images.unsplash.com/photo-1619983081593-e2ba5b543e68?w=300&q=80' },
  { id: 'mu3', title: 'Levitating', subtitle: 'Dua Lipa', type: 'music', category: 'Pop', year: 2020, image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=300&q=80' },
  { id: 'mu4', title: 'Stay', subtitle: 'The Kid LAROI, Justin Bieber', type: 'music', category: 'Pop', year: 2021, image: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&q=80' },
  { id: 'mu5', title: 'Heat Waves', subtitle: 'Glass Animals', type: 'music', category: 'Indie', year: 2020, image: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=300&q=80' },
  { id: 'mu6', title: 'Save Your Tears', subtitle: 'The Weeknd', type: 'music', category: 'Pop', year: 2020, image: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=300&q=80' },
  { id: 'mu7', title: 'As It Was', subtitle: 'Harry Styles', type: 'music', category: 'Pop', year: 2022, image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=80' },
  { id: 'mu8', title: 'Anti-Hero', subtitle: 'Taylor Swift', type: 'music', category: 'Pop', year: 2022, image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80' },
  { id: 'mu9', title: 'Flowers', subtitle: 'Miley Cyrus', type: 'music', category: 'Pop', year: 2023, image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&q=80' },
  { id: 'mu10', title: 'Calm Down', subtitle: 'Rema, Selena Gomez', type: 'music', category: 'Afrobeats', year: 2022, image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80' },
];

// Animation data
export const animationData: SearchItem[] = [
  { id: 'a1', title: 'Spirited Away', subtitle: 'Studio Ghibli', type: 'animation', category: 'Fantasy', year: 2001, rating: 8.6, image: 'https://picsum.photos/seed/spirited/300/450', description: 'A young girl enters a world of spirits...' },
  { id: 'a2', title: 'Your Name', subtitle: 'CoMix Wave Films', type: 'animation', category: 'Romance', year: 2016, rating: 8.4, image: 'https://picsum.photos/seed/yourname/300/450', description: 'Two strangers find themselves linked...' },
  { id: 'a3', title: 'Demon Slayer', subtitle: 'ufotable', type: 'animation', category: 'Action', year: 2019, rating: 8.7, image: 'https://picsum.photos/seed/demonslayer/300/450', description: 'A young boy becomes a demon slayer...' },
  { id: 'a4', title: 'Attack on Titan', subtitle: 'MAPPA', type: 'animation', category: 'Action', year: 2013, rating: 9.1, image: 'https://picsum.photos/seed/aot/300/450', description: 'Humanity fights for survival against giants...' },
  { id: 'a5', title: 'Jujutsu Kaisen', subtitle: 'MAPPA', type: 'animation', category: 'Action', year: 2020, rating: 8.5, image: 'https://picsum.photos/seed/jjk/300/450', description: 'A boy swallows a cursed talisman...' },
  { id: 'a6', title: 'One Piece', subtitle: 'Toei Animation', type: 'animation', category: 'Adventure', year: 1999, rating: 9.0, image: 'https://picsum.photos/seed/onepiece/300/450', description: 'A pirate searches for the ultimate treasure...' },
  { id: 'a7', title: 'Spider-Man: Across the Spider-Verse', subtitle: 'Sony Pictures', type: 'animation', category: 'Action', year: 2023, rating: 8.6, image: 'https://picsum.photos/seed/spiderverse/300/450', description: 'Miles Morales catapults across the Multiverse...' },
  { id: 'a8', title: 'Puss in Boots: The Last Wish', subtitle: 'DreamWorks', type: 'animation', category: 'Adventure', year: 2022, rating: 7.9, image: 'https://picsum.photos/seed/pussinboots/300/450', description: 'Puss in Boots discovers his passion for adventure...' },
  { id: 'a9', title: 'Suzume', subtitle: 'CoMix Wave Films', type: 'animation', category: 'Fantasy', year: 2022, rating: 7.8, image: 'https://picsum.photos/seed/suzume/300/450', description: 'A 17-year-old girl discovers a door...' },
  { id: 'a10', title: 'My Hero Academia', subtitle: 'Bones', type: 'animation', category: 'Action', year: 2016, rating: 8.4, image: 'https://picsum.photos/seed/mha/300/450', description: 'A boy born without powers dreams of becoming a hero...' },
];

// Trending data (mix of all types)
export const trendingData: SearchItem[] = [
  { id: 't1', title: 'Oppenheimer', subtitle: 'Now Streaming', type: 'trending', category: 'Movie', year: 2023, rating: 8.4, image: 'https://picsum.photos/seed/oppenheimer/300/450' },
  { id: 't2', title: 'The Last of Us', subtitle: 'Season 2 Coming', type: 'trending', category: 'Series', year: 2023, rating: 8.8, image: 'https://picsum.photos/seed/lastofus/300/450' },
  { id: 't3', title: 'Flowers', subtitle: 'Miley Cyrus', type: 'trending', category: 'Music', year: 2023, image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&q=80' },
  { id: 't4', title: 'Spider-Verse', subtitle: '#1 Animated', type: 'trending', category: 'Animation', year: 2023, rating: 8.6, image: 'https://picsum.photos/seed/spiderverse/300/450' },
  { id: 't5', title: 'Barbie', subtitle: 'Box Office Hit', type: 'trending', category: 'Movie', year: 2023, rating: 7.0, image: 'https://picsum.photos/seed/barbie/300/450' },
  { id: 't6', title: 'Wednesday', subtitle: 'Most Watched', type: 'trending', category: 'Series', year: 2022, rating: 8.1, image: 'https://picsum.photos/seed/wednesday/300/450' },
  { id: 't7', title: 'Kill Bill', subtitle: 'SZA', type: 'trending', category: 'Music', year: 2023, image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=80' },
  { id: 't8', title: 'Demon Slayer', subtitle: 'Season 4', type: 'trending', category: 'Animation', year: 2024, rating: 8.7, image: 'https://picsum.photos/seed/demonslayer/300/450' },
];

// Shorts data
export const shortsData: SearchItem[] = [
  { id: 'sh1', title: 'Movie Fails Compilation', subtitle: '@CinemaBloopers', type: 'shorts', category: 'Comedy', duration: '0:58', image: 'https://picsum.photos/seed/short1/300/533' },
  { id: 'sh2', title: 'Behind the Scenes: Dune', subtitle: '@MovieMagic', type: 'shorts', category: 'BTS', duration: '1:15', image: 'https://picsum.photos/seed/short2/300/533' },
  { id: 'sh3', title: 'Best Plot Twists Ever', subtitle: '@FilmFacts', type: 'shorts', category: 'Lists', duration: '0:45', image: 'https://picsum.photos/seed/short3/300/533' },
  { id: 'sh4', title: 'Anime in Real Life', subtitle: '@AnimeVibes', type: 'shorts', category: 'Comedy', duration: '0:32', image: 'https://picsum.photos/seed/short4/300/533' },
  { id: 'sh5', title: 'Movie vs Reality', subtitle: '@TruthInFilm', type: 'shorts', category: 'Educational', duration: '1:00', image: 'https://picsum.photos/seed/short5/300/533' },
  { id: 'sh6', title: 'Actor Transformations', subtitle: '@HollywoodSecrets', type: 'shorts', category: 'BTS', duration: '0:55', image: 'https://picsum.photos/seed/short6/300/533' },
  { id: 'sh7', title: 'Iconic Movie Lines', subtitle: '@QuoteThis', type: 'shorts', category: 'Lists', duration: '0:40', image: 'https://picsum.photos/seed/short7/300/533' },
  { id: 'sh8', title: 'Fan Theories Explained', subtitle: '@TheoryZone', type: 'shorts', category: 'Discussion', duration: '1:20', image: 'https://picsum.photos/seed/short8/300/533' },
  { id: 'sh9', title: 'Movie Easter Eggs', subtitle: '@HiddenGems', type: 'shorts', category: 'Easter Eggs', duration: '0:50', image: 'https://picsum.photos/seed/short9/300/533' },
  { id: 'sh10', title: 'Soundtrack Spotlight', subtitle: '@FilmScore', type: 'shorts', category: 'Music', duration: '0:35', image: 'https://picsum.photos/seed/short10/300/533' },
];

// Get all data
export const getAllData = (): SearchItem[] => [
  ...moviesData,
  ...seriesData,
  ...musicData,
  ...animationData,
  ...shortsData,
];

// Search function
export const searchContent = (query: string, context?: 'movie' | 'series' | 'music' | 'animation' | 'shorts' | 'trending' | 'all'): SearchItem[] => {
  const searchTerm = query.toLowerCase().trim();
  if (!searchTerm) return [];

  let dataSource: SearchItem[];
  
  switch (context) {
    case 'movie':
      dataSource = moviesData;
      break;
    case 'series':
      dataSource = seriesData;
      break;
    case 'music':
      dataSource = musicData;
      break;
    case 'animation':
      dataSource = animationData;
      break;
    case 'shorts':
      dataSource = shortsData;
      break;
    case 'trending':
      dataSource = trendingData;
      break;
    default:
      dataSource = getAllData();
  }

  return dataSource.filter(item => 
    item.title.toLowerCase().includes(searchTerm) ||
    item.subtitle?.toLowerCase().includes(searchTerm) ||
    item.category?.toLowerCase().includes(searchTerm) ||
    item.description?.toLowerCase().includes(searchTerm)
  ).slice(0, 10);
};

// Get popular suggestions based on context
export const getPopularSuggestions = (context?: string): string[] => {
  switch (context) {
    case 'movie':
      return ['Inception', 'Oppenheimer', 'Dune', 'The Dark Knight', 'Spider-Man'];
    case 'series':
      return ['Stranger Things', 'The Last of Us', 'Wednesday', 'Squid Game', 'Breaking Bad'];
    case 'music':
      return ['Blinding Lights', 'Flowers', 'As It Was', 'Anti-Hero', 'Calm Down'];
    case 'animation':
      return ['Demon Slayer', 'Attack on Titan', 'Spirited Away', 'Your Name', 'One Piece'];
    case 'shorts':
      return ['Movie Fails', 'Behind the Scenes', 'Plot Twists', 'Fan Theories', 'Easter Eggs'];
    case 'trending':
      return ['Oppenheimer', 'Barbie', 'The Last of Us', 'Flowers', 'Spider-Verse'];
    default:
      return ['Oppenheimer', 'Stranger Things', 'Blinding Lights', 'Demon Slayer', 'Dune'];
  }
};

// Get recent searches based on context (simulated - in real app this would be stored in localStorage)
export const getRecentSearches = (context?: string): string[] => {
  switch (context) {
    case 'movie':
      return ['Action movies', 'Christopher Nolan', 'Sci-fi 2023', 'Marvel films'];
    case 'series':
      return ['Korean drama', 'New series 2024', 'Crime thriller', 'Top rated'];
    case 'music':
      return ['The Weeknd', 'Pop hits 2024', 'Workout playlist', 'Chill vibes'];
    case 'animation':
      return ['Anime 2024', 'Studio Ghibli', 'Shonen anime', 'New releases'];
    case 'shorts':
      return ['Funny clips', 'BTS moments', 'Quick reviews', 'Viral videos'];
    case 'trending':
      return ['This week', 'Top 10', 'New releases', 'Popular now'];
    default:
      return ['Trending now', 'New releases', 'Top rated', 'Popular'];
  }
};
