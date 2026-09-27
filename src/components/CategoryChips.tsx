import React from 'react';
import { CATEGORIES } from '../data/placesData';
import type { CategoryId } from '../types/place';
import { 
  Compass, 
  Hotel,
  Fish,
  Utensils, 
  Flame,
  Beer,
  Coffee, 
  Landmark, 
  ShoppingBag, 
  PlaneTakeoff,
  Train 
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
        return <Compass size={15} />;
      case 'Hotel':
        return <Hotel size={15} />;
      case 'Fish':
        return <Fish size={15} />;
      case 'Utensils':
        return <Utensils size={15} />;
      case 'Flame':
        return <Flame size={15} />;
      case 'Beer':
        return <Beer size={15} />;
      case 'Coffee':
        return <Coffee size={15} />;
      case 'Landmark':
        return <Landmark size={15} />;
      case 'ShoppingBag':
        return <ShoppingBag size={15} />;
      case 'PlaneTakeoff':
        return <PlaneTakeoff size={15} />;
      case 'Train':
        return <Train size={15} />;
      default:
        return <Compass size={15} />;
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
            style={{
              borderColor: isActive ? category.color : undefined,
              boxShadow: isActive ? `0 4px 12px ${category.color}40` : undefined,
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', color: isActive ? '#ffffff' : category.color }}>
              {getIcon(category.iconName)}
            </span>
            <span>{category.label}</span>
            <span
              style={{
                fontSize: '11px',
                padding: '2px 6px',
                borderRadius: '999px',
                backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
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
