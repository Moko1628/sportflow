'use client';

import { useState } from 'react';
import { Article } from '@/app/lib/supabase';
import CategoryFilter from '@/app/components/CategoryFilter';
import ArticleCard from '@/app/components/ArticleCard';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchX } from 'lucide-react';

interface Props {
  articles: Article[];
  categories: string[];
}

export default function CategoryFilterClientWrapper({ articles, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState('Tous');

  const filteredArticles = activeCategory === 'Tous'
    ? articles
    : articles.filter(a => a.categorie.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div>
      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      <div className="mt-8">
        {filteredArticles.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredArticles.map((article, index) => (
                <ArticleCard key={article.id} article={article} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 bg-sport-card/40 rounded-3xl border border-sport-cardHover text-center"
          >
            <SearchX className="w-12 h-12 text-sport-gray mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">Aucun article trouvé</h3>
            <p className="text-sm text-sport-gray">Il n&apos;y a pas encore d&apos;articles pour la catégorie {activeCategory}.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
