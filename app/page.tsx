import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import CategoryRail from "./components/CategoryRail/CategoryRail";
import MovieSection from "./components/MovieSection/MovieSection";
import SeriesSection from "./components/SeriesSection/SeriesSection";
import SeasonalSection from "./components/SeasonalSection/SeasonalSection";
import BottomNav from "./components/BottomNav/BottomNav";

export default function Home() {
  return (
    <main style={{ paddingBottom: '90px', background: 'var(--bg-primary)', minHeight: '100vh', position: 'relative' }}>
      <Hero />
      <CategoryRail />
      <SeasonalSection />
      <SeriesSection title="Binge-Worthy Series" />
      <MovieSection title="Trending Now" fireIcon={true} />
      <MovieSection title="Hollywood Movie" />
    </main>
  );
}
