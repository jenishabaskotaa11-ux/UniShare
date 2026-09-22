import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { AcademicCategory } from '../types.ts';

interface CategoryItem {
  id: AcademicCategory | 'All';
  label: string;
  icon: string;
  countBadge?: string;
}

export const CATEGORIES: CategoryItem[] = [
  { id: 'All', label: 'All Items', icon: 'grid_view' },
  { id: 'Calculators & Academic Tools', label: 'Calculators & Academic', icon: 'calculate', countBadge: 'Midterm Peak' },
  { id: 'Laptop & Tech Accessories', label: 'Laptop & Tech', icon: 'laptop_chromebook' },
  { id: 'Lab Materials', label: 'Lab Materials', icon: 'biotech', countBadge: 'Sanitized' },
  { id: 'Presentation Equipment', label: 'Presentation Clickers', icon: 'co_present' },
  { id: 'IT & Engineering Project Kits', label: 'Project Kits & Boards', icon: 'memory' },
  { id: 'Textbooks & Study Materials', label: 'Textbooks & Cheatsheets', icon: 'menu_book' },
  { id: 'Art & Design Materials', label: 'Art & Drafters', icon: 'draw' },
  { id: 'Campus Event & Project Equipment', label: 'Event & Video Gear', icon: 'videocam' },
];

export const CategoryPills: React.FC = () => {
  const { selectedCategory, setSelectedCategory, setActiveTab } = useApp();

  const handleSelect = (cat: AcademicCategory | 'All') => {
    setSelectedCategory(cat);
  };

  return (
    <div className="w-full overflow-x-auto py-2.5 no-scrollbar scroll-smooth">
      <div className="flex items-center space-x-2 min-w-max pb-1">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleSelect(cat.id)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-primary text-on-primary border-primary shadow-sm scale-[1.02]'
                  : 'bg-surface text-on-surface-variant hover:text-on-surface hover:bg-surface-container border-outline-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {cat.icon}
              </span>
              <span>{cat.label}</span>
              {cat.countBadge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                    isSelected
                      ? 'bg-on-primary/20 text-on-primary'
                      : 'bg-primary-container text-on-primary'
                  }`}
                >
                  {cat.countBadge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
