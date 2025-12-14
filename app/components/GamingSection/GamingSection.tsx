import { Gamepad2, Trophy, Zap } from 'lucide-react';
import './GamingSection.css';

export default function GamingSection() {
  const games = [
    { id: 1, title: "Cyber Race", category: "Racing", rating: "4.8", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=300" },
    { id: 2, title: "Space Warrior", category: "Action", rating: "4.5", image: "https://images.unsplash.com/photo-1614294149010-950b698f72c0?auto=format&fit=crop&q=80&w=300" },
    { id: 3, title: "Pixel Quest", category: "RPG", rating: "4.9", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=300" },
    { id: 4, title: "Neon City", category: "Adventure", rating: "4.7", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=300" }
  ];

  return (
    <div className="gaming-section">
      <div className="gaming-header">
        <div className="header-left">
          <Gamepad2 className="gaming-icon" size={24} />
          <h3 className="section-title">Instant Games</h3>
        </div>
        <div className="xp-badge">
           <Trophy size={12} />
           <span>Lvl 3</span>
        </div>
      </div>
      
      <div className="games-rail">
        {games.map((game) => (
          <div className="game-card" key={game.id}>
            <div className="game-image-wrapper">
              <img src={game.image} alt={game.title} />
              <div className="play-overlay">
                 <div className="play-btn-small">
                    <Zap size={14} fill="currentColor" />
                 </div>
              </div>
              <span className="game-rating">★ {game.rating}</span>
            </div>
            <div className="game-info">
               <span className="game-title">{game.title}</span>
               <span className="game-cat">{game.category}</span>
            </div>
            <button className="play-action-btn">Play</button>
          </div>
        ))}
      </div>
    </div>
  );
}
