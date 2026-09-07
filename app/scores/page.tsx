import { Metadata } from 'next';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import PageTransition from '@/app/components/PageTransition';
import { 
  getLiveAfricanMatches, 
  getTodaysAfricanMatches, 
  getWeekAfricanMatches, 
  groupByLeague 
} from '@/app/lib/football/client';
import { PRIORITY_LABELS, classifyMatch } from '@/app/lib/football/filters';
import { Flame, Trophy, Calendar, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'BABIscore — Scores en Direct & Calendrier Football Africain',
  description: 'Tous les matchs en direct, scores et calendrier de football. Priorité absolue à la Côte d&apos;Ivoire, l&apos;Afrique et les compétitions CAF.',
};

export const revalidate = 30; // Revalidate every 30 seconds for live scores

export default async function ScoresPage() {
  // Fetch real data from provider (API-Football)
  const liveMatches = await getLiveAfricanMatches();
  const todaysMatches = await getTodaysAfricanMatches();
  const weekMatches = await getWeekAfricanMatches();

  // Group todays matches by league
  const todaysGroups = groupByLeague(todaysMatches);

  return (
    <div className="min-h-screen bg-sport-dark flex flex-col selection:bg-sport-blue selection:text-white">
      <Header />

      <main className="flex-grow">
        <PageTransition>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Page Header */}
            <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-sport-card pb-6">
              <div>
                <div className="flex items-center justify-center sm:justify-start space-x-2 mb-2">
                  <span className="bg-sport-cyan/10 text-sport-cyan text-xs font-bold px-3 py-1 rounded-xl border border-sport-cyan/20">
                    🇨🇮 Côte d&apos;Ivoire & 🌍 Afrique Prioritaires
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-white uppercase italic tracking-wider flex items-center justify-center sm:justify-start space-x-3">
                  <Trophy className="w-8 h-8 text-sport-cyan" />
                  <span>BABIscore — Scores en Direct</span>
                </h1>
                <p className="text-sport-gray text-sm sm:text-base mt-2">
                  Tous les matchs africains, résultats en temps réel et calendriers officiels 100% gratuits.
                </p>
              </div>

              <div className="mt-4 sm:mt-0 flex items-center justify-center space-x-2 bg-sport-card px-4 py-2 rounded-2xl border border-sport-cardHover">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Mise à jour Live Active</span>
              </div>
            </div>

            {/* SECTION 1 — EN DIRECT */}
            <section className="mb-14">
              <div className="flex items-center space-x-2 mb-6">
                <span className="bg-sport-red text-white text-xs font-black uppercase px-3 py-1.5 rounded-xl shadow-lg shadow-sport-red/40 flex items-center space-x-2 animate-pulse">
                  <Flame className="w-4 h-4 fill-current" />
                  <span>🔴 EN DIRECT</span>
                </span>
                <span className="text-xs text-sport-gray font-medium">({liveMatches.length} match{liveMatches.length > 1 ? 's' : ''} en cours)</span>
              </div>

              {liveMatches.length === 0 ? (
                <div className="bg-sport-card/50 border border-sport-cardHover rounded-3xl p-8 text-center">
                  <p className="text-sport-gray text-sm">Aucun match en direct actuellement. Consultez les matchs du jour ci-dessous.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {liveMatches.map((match) => {
                    const priority = classifyMatch(match);
                    const badge = PRIORITY_LABELS[priority];
                    return (
                      <div key={match.id} className="bg-sport-card border border-sport-cardHover hover:border-sport-cyan/50 transition-all rounded-3xl p-5 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 bg-sport-red/20 text-sport-red text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl border-l border-b border-sport-red/30">
                          {match.status.long}
                        </div>

                        <div className="flex items-center space-x-2 mb-4 text-xs text-sport-cyan font-bold">
                          <span>{badge?.emoji}</span>
                          <span className="truncate">{match.league.name}</span>
                        </div>

                        <div className="space-y-3 my-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {match.teams.home.logo ? (
                                <img src={match.teams.home.logo} alt="" className="w-6 h-6 object-contain" />
                              ) : null}
                              <span className="text-white font-bold text-sm">{match.teams.home.name}</span>
                            </div>
                            <span className="text-white font-black text-lg px-2.5 py-1 bg-sport-dark rounded-xl border border-sport-cardHover">
                              {match.goals.home ?? '0'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {match.teams.away.logo ? (
                                <img src={match.teams.away.logo} alt="" className="w-6 h-6 object-contain" />
                              ) : null}
                              <span className="text-white font-bold text-sm">{match.teams.away.name}</span>
                            </div>
                            <span className="text-white font-black text-lg px-2.5 py-1 bg-sport-dark rounded-xl border border-sport-cardHover">
                              {match.goals.away ?? '0'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-sport-cardHover text-xs text-sport-gray">
                          <span className="flex items-center space-x-1 text-sport-red font-bold animate-pulse">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{match.status.elapsed ? `${match.status.elapsed}'` : 'LIVE'}</span>
                          </span>
                          <span>{match.league.country}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* SECTION 2 — AUJOURD'HUI */}
            <section className="mb-14">
              <div className="flex items-center space-x-2 mb-6">
                <span className="bg-sport-blue text-white text-xs font-black uppercase px-3 py-1.5 rounded-xl shadow-lg shadow-sport-blue/30 flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>AUJOURD&apos;HUI</span>
                </span>
                <span className="text-xs text-sport-gray font-medium">({todaysMatches.length} match{todaysMatches.length > 1 ? 's' : ''} programmés aujourd&apos;hui)</span>
              </div>

              {todaysMatches.length === 0 ? (
                <div className="bg-sport-card/50 border border-sport-cardHover rounded-3xl p-8 text-center">
                  <p className="text-sport-gray text-sm">Aucun match programmé pour aujourd&apos;hui ou données en attente de synchronisation API.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Array.from(todaysGroups.entries()).map(([leagueKey, matches]) => {
                    const firstMatch = matches[0];
                    const league = firstMatch?.league;
                    const priority = firstMatch ? classifyMatch(firstMatch) : 'monde';
                    const badge = PRIORITY_LABELS[priority];

                    return (
                      <div key={leagueKey} className="bg-sport-card border border-sport-cardHover rounded-3xl overflow-hidden shadow-xl">
                        <div className="bg-sport-cardHover/50 px-6 py-3 border-b border-sport-cardHover flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {league?.logo && <img src={league.logo} alt="" className="w-5 h-5 object-contain" />}
                            <span className="text-white font-bold text-sm uppercase tracking-wider">
                              {badge?.emoji} {league?.name || leagueKey}
                            </span>
                          </div>
                          <span className="text-xs text-sport-gray font-medium">{league?.country}</span>
                        </div>

                        <div className="divide-y divide-sport-cardHover">
                          {matches.map((match) => {
                            const matchTime = new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            return (
                              <div key={match.id} className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between hover:bg-sport-cardHover/30 transition-colors">
                                <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-12 mb-2 sm:mb-0">
                                  <div className="flex items-center space-x-3 w-48 sm:w-64">
                                    {match.teams.home.logo && <img src={match.teams.home.logo} alt="" className="w-5 h-5 object-contain" />}
                                    <span className="text-white font-semibold text-sm truncate">{match.teams.home.name}</span>
                                  </div>

                                  <div className="px-4 py-1.5 bg-sport-dark rounded-xl border border-sport-cardHover text-center min-w-[70px]">
                                    <span className="text-xs font-bold text-sport-cyan">
                                      {match.goals.home !== null && match.goals.away !== null
                                        ? `${match.goals.home} - ${match.goals.away}`
                                        : matchTime}
                                    </span>
                                  </div>

                                  <div className="flex items-center space-x-3 w-48 sm:w-64 justify-end sm:justify-start">
                                    <span className="text-white font-semibold text-sm truncate text-right sm:text-left">{match.teams.away.name}</span>
                                    {match.teams.away.logo && <img src={match.teams.away.logo} alt="" className="w-5 h-5 object-contain" />}
                                  </div>
                                </div>

                                <div className="flex items-center space-x-3 text-xs text-sport-gray">
                                  <span className="px-2.5 py-1 bg-sport-dark rounded-lg border border-sport-cardHover font-medium">
                                    {match.status.short}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* SECTION 3 — 7 PROCHAINS JOURS */}
            <section className="mb-12">
              <div className="flex items-center space-x-2 mb-6">
                <span className="bg-sport-card border border-sport-cardHover text-white text-xs font-black uppercase px-3 py-1.5 rounded-xl shadow-lg flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-sport-cyan" />
                  <span>7 PROCHAINS JOURS</span>
                </span>
                <span className="text-xs text-sport-gray font-medium">({weekMatches.length} matchs à venir)</span>
              </div>

              {weekMatches.length === 0 ? (
                <div className="bg-sport-card/50 border border-sport-cardHover rounded-3xl p-8 text-center">
                  <p className="text-sport-gray text-sm">Données de calendrier hebdomadaire en cours de chargement ou indisponibles.</p>
                </div>
              ) : (
                <div className="bg-sport-card border border-sport-cardHover rounded-3xl p-6 shadow-xl">
                  <p className="text-xs text-sport-gray mb-4">Aperçu des rencontres programmées pour la semaine à venir à travers l&apos;Afrique et le monde.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2">
                    {weekMatches.slice(0, 30).map((match) => {
                      const d = new Date(match.date);
                      const dateStr = d.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' });
                      const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                      return (
                        <div key={match.id} className="bg-sport-dark/60 border border-sport-cardHover rounded-2xl p-4 text-xs space-y-2">
                          <div className="flex items-center justify-between text-sport-cyan font-bold">
                            <span className="truncate">{match.league.name}</span>
                            <span>{dateStr} • {timeStr}</span>
                          </div>
                          <div className="flex items-center justify-between font-semibold text-white">
                            <span className="truncate">{match.teams.home.name}</span>
                            <span className="text-sport-gray mx-2">vs</span>
                            <span className="truncate">{match.teams.away.name}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>

          </div>
        </PageTransition>
      </main>

      <Footer />
    </div>
  );
}
