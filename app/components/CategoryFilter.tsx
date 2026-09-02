'use client';

import { motion } from 'framer-motion';

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  activeCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-4 scrollbar-none">
      {categories.map((cat) => {
        const isActive = activeCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`relative px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
              isActive
                ? 'text-white'
                : 'text-sport-gray hover:text-white hover:bg-sport-card/50'
            }`}
          >
            {/* Sliding active background / indicator */}
            {isActive && (
              <motion.div
                layoutId="activeCategoryIndicator"
                className="absolute inset-0 bg-gradient-to-r from-sport-blue to-blue-600 rounded-xl shadow-lg shadow-sport-blue/30 z-0"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">
              {cat === 'Tous' ? '🔥 Tous les sports' : cat}
            </span>
          </button>
        );
      })}
    </div>
  );
}
