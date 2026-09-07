import { supabase, isSupabaseConfigured, Article } from '@/app/lib/supabase';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import CategoryFilterClientWrapper from '@/app/components/CategoryFilterClientWrapper';
import StatsCounter from '@/app/components/StatsCounter';
import PageTransition from '@/app/components/PageTransition';
import { Flame, Trophy, ArrowRight } from 'lucide-react';
import Link from 'next/link';

async function getArticles(): Promise<{ articles: Article[]; error: string | null }> {
  if (!isSupabaseConfigured || !supabase) {
    return { articles: [], error: 'Supabase n\'est pas configuré. Veuillez définir les variables d\'environnement.' };
  }

  try {
    const { data, error } = await supabase
      .from('articles')
      .select('id, titre, resume, contenu, source_url, source_nom, categorie, image_url, created_at, origine')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Supabase fetch error:', error.message);
      return { articles: [], error: 'Impossible de charger les articles pour le moment.' };
    }

    return { articles: (data as Article[]) ?? [], error: null };
  } catch (e) {
    console.error('Unexpected error fetching articles:', e);
    return { articles: [], error: 'Une erreur inattendue est survenue lors du chargement.' };
  }
}

export const revalidate = 60;

const CATEGORIES = ['Tous', 'Football', 'Basketball', 'Athlétisme', 'Sport local', 'Autre'];

export default async function Home() {
  const { articles, error } = await getArticles();

  const breakingArticle = articles.length > 0 ? articles[0] : null;

  return (
    <div className="min-h-screen bg-sport-dark flex flex-col selection:bg-sport-blue selection:text-white">
      <Header />

      <main className="flex-grow">
        <PageTransition>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {error && (
              <div className="mb-8 bg-sport-card/70 border border-sport-red/40 text-sport-red px-5 py-4 rounded-2xl text-sm font-semibold">
                {error}
              </div>
            )}

            {!error && articles.length === 0 && (
              <div className="mb-8 bg-sport-card/70 border border-sport-cardHover text-sport-gray px-5 py-4 rounded-2xl text-sm font-semibold">
                Aucun article disponible pour le moment.
              </div>
            )}

            {/* Hero / Breaking Spotlight Banner */}
            {breakingArticle && (
              <section className="mb-12">
                <div className="relative rounded-3xl overflow-hidden border border-sport-cardHover bg-gradient-to-r from-sport-card via-sport-cardHover to-sport-card shadow-2xl">
                  <div className="absolute inset-0 z-0">
                    {breakingArticle.image_url && (
                      <img
                        src={breakingArticle.image_url}
                        alt={breakingArticle.titre}
                        className="w-full h-full object-cover opacity-30 transform hover:scale-105 transition-transform duration-700"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-sport-dark via-sport-dark/80 to-transparent" />
                  </div>

                  <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-3xl flex flex-col items-start justify-end min-h-[380px]">
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="bg-sport-red text-white text-xs font-black uppercase px-3 py-1 rounded-xl shadow-lg shadow-sport-red/40 flex items-center space-x-1.5 animate-pulse">
                        <Flame className="w-3.5 h-3.5 fill-current" />
                        <span>À la Une</span>
                      </span>
                      <span className="bg-sport-dark/80 backdrop-blur-md text-sport-cyan text-xs font-bold px-3 py-1 rounded-xl border border-sport-cyan/20">
                        {breakingArticle.categorie}
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4 tracking-tight">
                      {breakingArticle.titre}
                    </h1>

                    <p className="text-sport-gray text-sm sm:text-base line-clamp-2 mb-6 leading-relaxed">
                      {breakingArticle.resume}
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                      <Link
                        href={`/article/${breakingArticle.id}`}
                        className="flex items-center space-x-2 bg-gradient-to-r from-sport-blue to-sport-cyan hover:from-blue-600 hover:to-sport-blue text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-sport-blue/30 transition-all transform hover:-translate-y-0.5"
                      >
                        <span>Lire l&apos;article complet</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>

                      <div className="flex items-center space-x-2 text-xs text-sport-gray bg-sport-card/80 backdrop-blur-md px-4 py-3 rounded-2xl border border-sport-cardHover">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Source : <strong className="text-white">{breakingArticle.source_nom}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Category Filter */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white uppercase italic tracking-wider flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-sport-cyan" />
                  <span>Filtrer par discipline</span>
                </h2>
                <span className="text-xs text-sport-gray font-medium">Actualités en continu</span>
              </div>

              <CategoryFilterClientWrapper articles={articles} categories={CATEGORIES} />
            </section>

            {/* Stats Counter Section */}
            <StatsCounter />

          </div>
        </PageTransition>
      </main>

      <Footer />
    </div>
  );
}
