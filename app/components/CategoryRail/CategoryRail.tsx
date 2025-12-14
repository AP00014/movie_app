import { Filter } from 'lucide-react';
import './CategoryRail.css';

export default function CategoryRail() {
  return (
    <div className="category-section">
      <h3 className="section-title">Categories</h3>
      <div className="category-rail">
        <div className="cat-chip special">
           <span>All</span>
           <Filter size={16} />
        </div>
        
        <div className="cat-chip">
           <img src="https://picsum.photos/seed/catHollywood/300/150" className="cat-bg" alt="Hollywood" />
           <div className="cat-overlay"></div>
           <span className="cat-name">Hollywood</span>
        </div>

        <div className="cat-chip">
           <img src="https://picsum.photos/seed/catNollywood/300/150" className="cat-bg" alt="Nollywood" />
           <div className="cat-overlay"></div>
           <span className="cat-name">Nollywood</span>
        </div>

         <div className="cat-chip">
           <img src="https://picsum.photos/seed/catBollywood/300/150" className="cat-bg" alt="Bollywood" />
           <div className="cat-overlay"></div>
           <span className="cat-name">Bollywood</span>
        </div>

        <div className="cat-chip">
           <img src="https://picsum.photos/seed/catAction/300/150" className="cat-bg" alt="Action" />
           <div className="cat-overlay"></div>
           <span className="cat-name">Action</span>
        </div>
      </div>
    </div>
  );
}
