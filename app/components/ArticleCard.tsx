'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Article } from '@/app/lib/supabase';
import { Clock, ExternalLink, Zap } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  index: number;
}

export default function ArticleCard({ article, index }: ArticleCardProps) {
  // Check if article is less than 1 hour old
  const isRecent = () => {
    if (article.is_breaking) return true;
    const diffHours = (Date.now() - new Date(article.created_at).getTime()) / (1000 * 60 * 60);
    return diffHours < 1;
  };

  const breaking = isRecent();

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const diffMinutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
      if (diffMinutes < 60) return `Il y a ${Math.max(1, diffMinutes)} min`;
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `Il y a ${diffHours}h`;
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    } catch {
      return dateString;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.35, 
        delay: Math.min(index * 0.08, 0.4),
        ease: "easeOut"
      }}
      whileHover={{ 
        scale: 1.03, 
        y: -4,
        transition: { duration: 0.2 }
      }}
      className="group relative bg-sport-card rounded-2xl overflow-hidden border border-sport-cardHover hover:border-sport-blue/50 shadow-lg hover:shadow-2xl hover:shadow-sport-blue/15 transition-colors flex flex-col h-full"
    >
      {/* Card Image Banner */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-sport-dark">
        {article.image_url ? (
          <img
            src={article.image_url}
            alt={article.titre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-sport-card to-sport-cardHover flex items-center justify-center">
            <span className="text-sport-gray text-xs font-bold uppercase tracking-wider">SportFlow News</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-sport-card via-transparent to-black/30" />

        {/* Category badge with pulse effect for breaking news */}
        <div className="absolute top-3 left-3 flex items-center space-x-2">
          <span className="bg-sport-dark/80 backdrop-blur-md text-white text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-lg border border-white/10 tracking-wider">
            {article.categorie}
          </span>
          {breaking && (
            <motion.span
              animate={{ opacity: [1, 0.6, 1], scale: [1, 1.05, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="flex items-center space-x-1 bg-sport-red text-white text-[10px] font-black uppercase px-2 py-1 rounded-lg shadow-md shadow-sport-red/40"
            >
              <Zap className="w-3 h-3 fill-current" />
              <span>Flash</span>
            </motion.span>
          )}
        </div>

        {/* Source info */}
        <div className="absolute bottom-3 left-3 flex items-center space-x-1.5 text-xs text-sport-gray bg-sport-dark/60 backdrop-blur-sm px-2 py-0.5 rounded-md">
          <span className="font-semibold text-white/90">{article.source_nom}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center text-xs text-sport-gray mb-2.5 space-x-2">
          <Clock className="w-3.5 h-3.5 text-sport-cyan" />
          <span>{formatDate(article.created_at)}</span>
        </div>

        <Link href={`/article/${article.id}`} className="group-hover:text-sport-cyan transition-colors">
          <h2 className="text-lg font-bold text-white leading-snug line-clamp-2 mb-2 tracking-tight">
            {article.titre}
          </h2>
        </Link>

        <p className="text-sport-gray text-sm line-clamp-3 mb-4 leading-relaxed flex-grow">
          {article.resume}
        </p>

        {/* Bottom actions */}
        <div className="pt-3 border-t border-sport-cardHover flex items-center justify-between mt-auto">
          <Link
            href={`/article/${article.id}`}
            className="text-xs font-bold text-sport-blue group-hover:text-sport-cyan flex items-center space-x-1 transition-colors"
          >
            <span>Lire l'analyse</span>
            <span>→</span>
          </Link>

          {article.source_url && (
            <a
              href={article.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sport-gray hover:text-white p-1 transition-colors"
              title="Lien source externe"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
