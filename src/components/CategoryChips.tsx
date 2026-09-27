import React from 'react';
import { CATEGORIES } from '../data/placesData';
import type { CategoryId } from '../types/place';
import { 
  Compass, 
  PlaneTakeoff, 
  Utensils, 
  Coffee, 
  Landmark, 
  ShoppingBag, 
  Train, 
  Hotel 
} from 'lucide-react';

interface CategoryChipsProps {
  selectedCategory: CategoryId;
  onSelectCategory: (categoryId: CategoryId) => void;
  categoryCounts: Record<CategoryId, number>;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass':
        return <Compass size={16} />;
      case 'PlaneTakeoff':
        return <PlaneTakeoff size={16} />;
      case 'Utensils':
        return <Utensils size={16} />;
      case 'Coffee':
        return <Coffee size={16} />;
      case 'Landmark':
        return <Landmark size={16} />;
      case 'ShoppingBag':
        return <ShoppingBag size={16} />;
      case 'Train':
        return <Train size={16} />;
      case 'Hotel':
        return <Hotel size={16} />;
      default:
        return <Compass size={16} />;
    }
  };

  return (
    <div className="category-chips-scroller">
      {CATEGORIES.map((category) => {
        const isActive = selectedCategory === category.id;
        const count = categoryCounts[category.id] ?? 0;

        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`chip-button ${isActive ? 'active' : ''}`}
            title={`${category.label} (${count})`}
          >
            <span style={{ display: 'flex', alignItems: 'center' }}>
              {getIcon(category.iconName)}
            </span>
            <span>{category.label}</span>
            <span
              style={{
                fontSize: '11px',
                padding: '2px 6px',
                borderRadius: '999px',
                backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
                color: isActive ? '#ffffff' : '#475569',
                marginLeft: '2px',
                fontWeight: 600,
              }}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
