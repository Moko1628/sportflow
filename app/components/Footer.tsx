'use client';

import Link from 'next/link';
import { Trophy, Globe, ArrowUp, Share2, MessageSquare, Radio, Mail, Phone } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-sport-card/50 border-t border-sport-card mt-20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sport-blue via-sport-cyan to-sport-orange flex items-center justify-center shadow-lg shadow-sport-blue/30">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black tracking-wider text-white uppercase italic">
                BABI<span className="text-sport-cyan">score</span>
              </span>
            </div>
            <p className="text-sport-gray text-sm max-w-sm leading-relaxed">
              Votre plateforme 100% gratuite de scores en direct et matchs à venir. Priorité absolue aux sports africains (Côte d&apos;Ivoire, CAF) puis internationaux.
            </p>
            <div className="space-y-2 pt-1 text-xs text-sport-gray font-medium">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-sport-cyan" />
                <a href="mailto:konemoh203@gmail.com" className="hover:text-white transition-colors">konemoh203@gmail.com</a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-sport-cyan" />
                <a href="tel:+2250712867483" className="hover:text-white transition-colors">+225 07 12 86 74 83</a>
              </div>
            </div>
            <div className="flex items-center space-x-3 pt-2">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-sport-card border border-sport-cardHover flex items-center justify-center text-sport-gray hover:text-white hover:border-sport-blue transition-colors" aria-label="Twitter">
                <Globe className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-sport-card border border-sport-cardHover flex items-center justify-center text-sport-gray hover:text-white hover:border-sport-blue transition-colors" aria-label="Instagram">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-sport-card border border-sport-cardHover flex items-center justify-center text-sport-gray hover:text-white hover:border-sport-blue transition-colors" aria-label="YouTube">
                <Radio className="w-4 h-4" />
              </a>
              <a href="https://example.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-sport-card border border-sport-cardHover flex items-center justify-center text-sport-gray hover:text-white hover:border-sport-blue transition-colors" aria-label="Website">
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Sports Categories */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Focus Sportif</h3>
            <ul className="space-y-2 text-sm text-sport-gray">
              <li><Link href="/scores" className="hover:text-sport-cyan transition-colors">🇨🇮 Côte d&apos;Ivoire (Ligue 1)</Link></li>
              <li><Link href="/scores" className="hover:text-sport-cyan transition-colors">🌍 Compétitions CAF</Link></li>
              <li><Link href="/scores" className="hover:text-sport-cyan transition-colors">⚽ Football Africain</Link></li>
              <li><Link href="/scores" className="hover:text-sport-cyan transition-colors">🏆 International & UEFA</Link></li>
              <li><Link href="/" className="hover:text-sport-cyan transition-colors">🏀 Autres Sports</Link></li>
            </ul>
          </div>

          {/* Legal / Info */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Informations</h3>
            <ul className="space-y-2 text-sm text-sport-gray">
              <li><span className="hover:text-white cursor-pointer">100% Gratuit</span></li>
              <li><span className="hover:text-white cursor-pointer">Mentions légales</span></li>
              <li><span className="hover:text-white cursor-pointer">Politique de confidentialité</span></li>
              <li><a href="mailto:konemoh203@gmail.com" className="hover:text-white transition-colors">Contact Direct</a></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-sport-card pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-sport-gray">
          <p>© {new Date().getFullYear()} BABIscore. 100% Gratuit. Propulsé par Next.js & Supabase.</p>
          <button 
            onClick={scrollToTop}
            className="mt-4 sm:mt-0 flex items-center space-x-2 bg-sport-card hover:bg-sport-cardHover text-white px-4 py-2 rounded-xl border border-sport-cardHover transition-colors"
          >
            <span>Retour en haut</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
