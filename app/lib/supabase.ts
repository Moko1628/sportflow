import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-supabase'));

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface Article {
  id: string;
  titre: string;
  resume: string;
  contenu?: string;
  source_url: string;
  source_nom: string;
  categorie: string;
  image_url?: string | null;
  created_at: string;
  is_breaking?: boolean;
}

export const MOCK_ARTICLES: Article[] = [
  {
    id: "1",
    titre: "Exploit monumental en Ligue des Champions : Le Real renverse City dans les arrêts de jeu !",
    resume: "Dans un match absolument irrespirable au Santiago Bernabéu, les Madrilènes ont arraché la qualification au bout du suspense grâce à un doublé stratosphérique.",
    contenu: "Dans un match absolument irrespirable au Santiago Bernabéu, les Madrilènes ont arraché la qualification au bout du suspense grâce à un doublé stratosphérique. Menés 2-1 à l'entame du temps additionnel, les hommes de Carlo Ancelotti ont su puiser dans leurs derniers retranchements pour renverser Manchester City (3-2). Une soirée historique qui restera gravée dans les annales de la reine des compétitions européennes.",
    source_url: "https://example.com/champions-league",
    source_nom: "SportFlow Live",
    categorie: "Football",
    image_url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
    created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 mins ago (< 1h = breaking)
    is_breaking: true,
  },
  {
    id: "2",
    titre: "NBA : Victor Wembanyama signe un triple-double historique avec 8 contres !",
    resume: "Le prodige français continue de réécrire les livres d'histoire du basketball en dominant outrageusement la raquette face aux champions en titre.",
    contenu: "Le prodige français continue de réécrire les livres d'histoire du basketball en dominant outrageusement la raquette face aux champions en titre. Avec 28 points, 15 rebonds et 8 contres monstrueux, Wembanyama a ébloui la planète basket et confirme son statut de superstar incontestée en NBA.",
    source_url: "https://example.com/nba-wembanyama",
    source_nom: "BasketActu",
    categorie: "Basketball",
    image_url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80",
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2h ago
    is_breaking: false,
  },
  {
    id: "3",
    titre: "Formule 1 : Grand Prix sous haute tension, Verstappen décroche la pole in extremis",
    resume: "Le pilote néerlandais a signé le meilleur temps des qualifications dans les toutes dernières secondes sous des trombes d'eau.",
    contenu: "Le pilote néerlandais a signé le meilleur temps des qualifications dans les toutes dernières secondes sous des trombes d'eau. La grille de départ s'annonce explosive pour la course de demain avec une concurrence plus affûtée que jamais.",
    source_url: "https://example.com/f1-pole",
    source_nom: "Motorsport Live",
    categorie: "F1",
    image_url: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80",
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago (< 1h)
    is_breaking: true,
  },
  {
    id: "4",
    titre: "Roland-Garros : Un choc générationnel s'annonce en demi-finale",
    resume: "Le tournoi parisien nous réserve une affiche de rêve entre la légende en quête d'un dernier sacre et le jeune prodige affamé de titres.",
    contenu: "Le tournoi parisien nous réserve une affiche de rêve entre la légende en quête d'un dernier sacre et le jeune prodige affamé de titres. Les experts s'accordent à dire que ce duel tactique et physique s'annonce d'une intensité rare sur le court ocre.",
    source_url: "https://example.com/tennis-rg",
    source_nom: "TennisMag",
    categorie: "Tennis",
    image_url: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1200&q=80",
    created_at: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    is_breaking: false,
  },
  {
    id: "5",
    titre: "Mercato : Le transfert XXL qui affole l'Europe du football",
    resume: "Un accord secret aurait été trouvé entre les deux cadors européens pour un montant estimé à plus de 120 millions d'euros.",
    contenu: "Un accord secret aurait été trouvé entre les deux cadors européens pour un montant estimé à plus de 120 millions d'euros. Le joueur devrait passer sa visite médicale dès lundi avant d'officialiser son arrivée.",
    source_url: "https://example.com/mercato",
    source_nom: "Mercato Live",
    categorie: "Football",
    image_url: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80",
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    is_breaking: false,
  },
  {
    id: "6",
    titre: "Cyclisme : Échappée royale et victoire en solitaire sur les pavés",
    resume: "Le puncheur français a terrassé ses rivaux au terme d'un numéro solitaire d'anthologie de plus de 50 kilomètres.",
    contenu: "Le puncheur français a terrassé ses rivaux au terme d'un numéro solitaire d'anthologie de plus de 50 kilomètres. Une démonstration de force pure qui fait lever les foules sur les routes de légende.",
    source_url: "https://example.com/cycling",
    source_nom: "CycloNews",
    categorie: "Cyclisme",
    image_url: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80",
    created_at: new Date(Date.now() - 1000 * 60 * 400).toISOString(),
    is_breaking: false,
  }
];
