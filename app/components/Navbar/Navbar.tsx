"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Play, Bell, X, Clock, TrendingUp, Film, Tv, Music, Sparkles, ArrowRight, User } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { searchContent, getPopularSuggestions, getRecentSearches, SearchItem } from '@/app/lib/searchData';
import { useAuth } from '@/app/context/AuthContext';
import './Navbar.css';

type SearchContext = 'movie' | 'series' | 'music' | 'animation' | 'shorts' | 'trending' | 'all';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role } = useAuth();
  const [isVisible, setIsVisible] = useState(true);

  // Hide Navbar on Admin/Superadmin pages
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollY = useRef(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Determine search context based on current page
  const getSearchContext = useCallback((): SearchContext => {
    if (pathname.includes('/movies') || pathname.includes('/movie')) return 'movie';
    if (pathname.includes('/series')) return 'series';
    if (pathname.includes('/music')) return 'music';
    if (pathname.includes('/animations') || pathname.includes('/animation')) return 'animation';
    if (pathname.includes('/shorts')) return 'shorts';
    if (pathname === '/') return 'trending';
    return 'all';
  }, [pathname]);

  const context = getSearchContext();
  const popularSuggestions = getPopularSuggestions(context);
  const recentSearches = getRecentSearches(context);

  const isActive = (path: string) => pathname === path;

  // Get placeholder based on context
  const getPlaceholder = () => {
    switch (context) {
      case 'movie': return 'Search movies...';
      case 'series': return 'Search series...';
      case 'music': return 'Search music...';
      case 'animation': return 'Search animations...';
      case 'shorts': return 'Search shorts...';
      case 'trending': return 'Search trending...';
      default: return 'Search everything...';
    }
  };

  // Get context label
  const getContextLabel = () => {
    switch (context) {
      case 'movie': return 'Movies';
      case 'series': return 'Series';
      case 'music': return 'Music';
      case 'animation': return 'Animations';
      case 'shorts': return 'Shorts';
      case 'trending': return 'Trending';
      default: return 'All';
    }
  };

  // Get context icon
  const getContextIcon = () => {
    switch (context) {
      case 'movie': return <Film size={14} />;
      case 'series': return <Tv size={14} />;
      case 'music': return <Music size={14} />;
      case 'animation': return <Sparkles size={14} />;
      case 'shorts': return <Play size={14} />;
      default: return <TrendingUp size={14} />;
    }
  };

  // Handle search input
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchContent(searchQuery, context);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, context]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(e.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 50) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }
      
      if (currentScrollY > lastScrollY.current) {
        setIsVisible(false);
        setShowSuggestions(false);
      }
      
      lastScrollY.current = currentScrollY;

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setIsVisible(true);
      }, 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page
      router.push(`/search?q=${encodeURIComponent(searchQuery)}&context=${context}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    const results = searchContent(suggestion, context);
    setSearchResults(results);
    searchInputRef.current?.focus();
  };

  const handleResultClick = (item: SearchItem) => {
    setShowSuggestions(false);
    setSearchQuery('');
    // Navigate based on type
    switch (item.type) {
      case 'movie':
        router.push(`/movie/${item.id}`);
        break;
      case 'series':
        router.push(`/movie/${item.id}`);
        break;
      case 'music':
        router.push(`/music`);
        break;
      case 'animation':
        router.push(`/animations`);
        break;
      case 'shorts':
        router.push(`/shorts`);
        break;
      default:
        router.push(`/movie/${item.id}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    searchInputRef.current?.focus();
  };

  const NavLinks = () => (
    <>
        <Link href="/" className={`tab ${isActive('/') ? 'active' : ''}`}>Trending</Link>
        <Link href="/movies" className={`tab ${isActive('/movies') ? 'active' : ''}`}>Movies</Link>
        <Link href="/series" className={`tab ${isActive('/series') ? 'active' : ''}`}>Series</Link>
        <Link href="/music" className={`tab ${isActive('/music') ? 'active' : ''}`}>Music</Link>     
    </>
  );

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/superadmin')) {
    return null;
  }

  return (
    <div className={`navbar-container ${isVisible ? 'navbar-visible' : 'navbar-hidden'}`}>
      <div className="top-bar">
        <div className="logo">
           <div className="logo-circle">
             <Play fill="white" size={14} className="logo-arrow" />
           </div>
        </div>

        <div className="desktop-nav">
            <NavLinks />
        </div>

        {/* Enhanced Search Bar */}
        <form className="search-bar-wrapper" onSubmit={handleSearchSubmit}>
          <div className={`search-bar ${isSearchFocused ? 'focused' : ''}`}>
            <Search size={18} className="search-icon" />
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder={getPlaceholder()}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => { setIsSearchFocused(true); setShowSuggestions(true); }}
              onBlur={() => setIsSearchFocused(false)}
            />
            {searchQuery && (
              <button type="button" className="clear-btn" onClick={clearSearch}>
                <X size={16} />
              </button>
            )}
            <div className="context-badge">
              {getContextIcon()}
              <span>{getContextLabel()}</span>
            </div>
          </div>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && (
            <div className="search-suggestions" ref={suggestionsRef}>
              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="suggestions-section">
                  <h4 className="suggestions-title">
                    <Search size={14} />
                    Results in {getContextLabel()}
                  </h4>
                  <div className="results-list">
                    {searchResults.map((item) => (
                      <div 
                        key={item.id} 
                        className="result-item"
                        onClick={() => handleResultClick(item)}
                      >
                        <img src={item.image} alt={item.title} className="result-img" />
                        <div className="result-info">
                          <span className="result-title">{item.title}</span>
                          <span className="result-subtitle">
                            {item.subtitle} {item.year && `• ${item.year}`}
                          </span>
                        </div>
                        {item.rating && (
                          <span className="result-rating">★ {item.rating}</span>
                        )}
                        <ArrowRight size={16} className="result-arrow" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {searchQuery && searchResults.length === 0 && (
                <div className="no-results">
                  <p>No results for "{searchQuery}" in {getContextLabel()}</p>
                  <span>Try searching with different keywords</span>
                </div>
              )}

              {/* Empty State - Show Suggestions */}
              {!searchQuery && (
                <>
                  {/* Recent Searches */}
                  <div className="suggestions-section">
                    <h4 className="suggestions-title">
                      <Clock size={14} />
                      Recent Searches
                    </h4>
                    <div className="suggestion-chips">
                      {recentSearches.map((term, idx) => (
                        <button 
                          key={idx} 
                          className="suggestion-chip recent"
                          onClick={() => handleSuggestionClick(term)}
                        >
                          <Clock size={12} />
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Popular in Context */}
                  <div className="suggestions-section">
                    <h4 className="suggestions-title">
                      <TrendingUp size={14} />
                      Popular in {getContextLabel()}
                    </h4>
                    <div className="suggestion-chips">
                      {popularSuggestions.map((term, idx) => (
                        <button 
                          key={idx} 
                          className="suggestion-chip popular"
                          onClick={() => handleSuggestionClick(term)}
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </form>

        <div className="top-actions">
           <div className="icon-btn-glass notification-btn">
             <Bell size={20} className="nav-icon" />
             <div className="notification-dot">3</div>
           </div>
           
           {user ? (
             <Link href="/account" className="icon-btn-glass profile-btn-nav">
               <div className="nav-avatar-small">
                 {user.user_metadata?.full_name ? user.user_metadata.full_name[0].toUpperCase() : 'U'}
               </div>
             </Link>
           ) : (
             <button className="btn-primary-small" onClick={() => {}} style={{marginLeft: '10px'}}>
               Sign In
             </button>
           )}
        </div>
      </div>
      
      <div className="nav-tabs mobile-nav">
        <NavLinks />
      </div>
    </div>
  );
}
