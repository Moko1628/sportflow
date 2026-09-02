import { supabase, isSupabaseConfigured, MOCK_ARTICLES, Article } from '@/app/lib/supabase';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ArticleCard from '@/app/components/ArticleCard';
import PageTransition from '@/app/components/PageTransition';
import { Clock, ExternalLink, ArrowLeft, Share2, Bookmark, Trophy } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    id: string;
  };
}

async function getArticleById(id: string): Promise<Article | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (!error && data) {
        return data as Article;
      }
    } catch (e) {
      console.error('Supabase fetch article error:', e);
    }
  }

  // Fallback to mock data
  const found = MOCK_ARTICLES.find(a => a.id === id);
  return found || null;
}

async function getSimilarArticles(currentId: string, category: string): Promise<Article[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase
        .from('articles')
        .select('*')
        .neq('id', currentId)
        .eq('categorie', category)
        .limit(3);
      
      if (data && data.length > 0) return data as Article[];
    } catch (e) {
      console.error('Supabase similar error:', e);
    }
  }

  return MOCK_ARTICLES.filter(a => a.id !== currentId && a.categorie === category).slice(0, 3);
}

export default async function ArticlePage({ params }: PageProps) {
  const article = await getArticleById(params.id);

  if (!article) {
    notFound();
  }

  const similarArticles = await getSimilarArticles(article.id, article.categorie);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-sport-dark flex flex-col selection:bg-sport-blue selection:text-white">
      <Header />

      <main className="flex-grow">
        <PageTransition>
          <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            
            {/* Back button */}
            <div className="mb-8">
              <Link
                href="/"
                className="inline-flex items-center space-x-2 text-sport-gray hover:text-white bg-sport-card hover:bg-sport-cardHover px-4 py-2.5 rounded-xl border border-sport-cardHover transition-colors text-sm font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Retour au fil d'actualités</span>
              </Link>
            </div>

            {/* Article Header */}
            <header className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <span className="bg-sport-blue text-white text-xs font-extrabold uppercase px-3.5 py-1.5 rounded-xl tracking-wider">
                  {article.categorie}
                </span>
                <div className="flex items-center space-x-2 text-xs text-sport-gray">
                  <Clock className="w-4 h-4 text-sport-cyan" />
                  <span>{formatDate(article.created_at)}</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-6 tracking-tight">
                {article.titre}
              </h1>

              <p className="text-lg sm:text-xl text-sport-gray font-medium leading-relaxed mb-6 border-l-4 border-sport-blue pl-4 py-1 bg-sport-card/30 rounded-r-xl">
                {article.resume}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-sport-cardHover">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sport-blue to-sport-cyan flex items-center justify-center text-white font-bold text-sm">
                    {article.source_nom ? article.source_nom.charAt(0) : 'S'}
                  </div>
                  <div>
                    <p className="text-xs text-sport-gray">Publié par</p>
                    <p className="text-sm font-bold text-white">{article.source_nom}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {article.source_url && (
                    <a
                      href={article.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 bg-sport-card hover:bg-sport-cardHover text-white px-4 py-2 rounded-xl border border-sport-cardHover text-xs font-bold transition-colors"
                    >
                      <span>Article Source</span>
                      <ExternalLink className="w-3.5 h-3.5 text-sport-cyan" />
                    </a>
                  )}
                </div>
              </div>
            </header>

            {/* Featured Image */}
            {article.image_url && (
              <div className="mb-10 rounded-3xl overflow-hidden border border-sport-cardHover shadow-2xl">
                <img
                  src={article.image_url}
                  alt={article.titre}
                  className="w-full h-[360px] sm:h-[480px] object-cover"
                />
              </div>
            )}

            {/* Article Content */}
            <div className="bg-sport-card/50 border border-sport-cardHover rounded-3xl p-6 sm:p-10 mb-16 shadow-xl">
              <div className="prose prose-invert max-w-none text-sport-light text-base sm:text-lg leading-relaxed space-y-6">
                <p>
                  {article.contenu || article.resume}
                </p>
                <p>
                  L'intensité de cette rencontre a tenu toutes ses promesses, confirmant l'excellente dynamique observée ces dernières semaines dans cette compétition. Les observateurs retiendront la maîtrise tactique et l'engagement physique total des protagonistes sur le terrain.
                </p>
                <h3 className="text-xl font-bold text-white pt-4">Les temps forts de la rencontre</h3>
                <ul className="space-y-3 list-disc pl-5 text-sport-gray">
                  <li>Une entame de match tambour battant avec un pressing étouffant dès la première minute.</li>
                  <div>Ouverture du score suite à une action collective d'école menée de main de maître.</div>
                  <li>Gestion tactique rigoureuse en seconde période pour préserver l'avantage au tableau d'affichage.</li>
                </ul>
                <p>
                  La suite de la saison s'annonce palpitante avec des échéances décisives qui marqueront sans aucun doute un tournant dans la course aux trophées. Restez connectés sur SportFlow pour ne rien manquer de l'actualité sportive en direct.
                </p>
              </div>
            </div>

            {/* Similar Articles */}
            {similarArticles.length > 0 && (
              <section className="pt-8 border-t border-sport-cardHover">
                <div className="flex items-center space-x-2 mb-6">
                  <Trophy className="w-5 h-5 text-sport-cyan" />
                  <h2 className="text-xl font-bold text-white uppercase italic tracking-wider">
                    Articles similaires ({article.categorie})
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {similarArticles.map((sim, idx) => (
                    <ArticleCard key={sim.id} article={sim} index={idx} />
                  ))}
                </div>
              </section>
            )}

          </article>
        </PageTransition>
      </main>

      <Footer />
    </div>
  );
}
