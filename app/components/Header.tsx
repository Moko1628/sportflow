'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Flame, Trophy, Search } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-sport-dark/80 border-b border-sport-card shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/">
          <motion.div 
            className="flex items-center space-x-3 cursor-pointer group"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-tr from-sport-blue via-sport-cyan to-sport-orange flex items-center justify-center shadow-lg shadow-sport-blue/30 group-hover:scale-105 transition-transform">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-wider text-white uppercase italic">
                Babi<span className="text-sport-cyan">flash</span>
              </span>
              <div className="text-[10px] text-sport-gray font-semibold tracking-widest uppercase">
                <span>Actualités sportives</span>
              </div>
            </div>
          </motion.div>
        </Link>

        {/* Search & Actions */}
        <div className="flex items-center space-x-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sport-gray" />
            <input
              type="text"
              placeholder="Rechercher un sport, équipe..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="bg-sport-card text-sm text-white placeholder-sport-gray px-4 py-2 pl-9 rounded-full border border-sport-cardHover focus:outline-none focus:border-sport-blue transition-colors w-48 lg:w-64"
            />
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              href="/"
              className="flex items-center space-x-2 bg-gradient-to-r from-sport-blue to-blue-600 hover:from-blue-600 hover:to-sport-blue text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-sport-blue/25 transition-all"
            >
              <Flame className="w-4 h-4 text-sport-orange" />
              <span>À la une</span>
            </Link>
          </motion.div>
        </div>

      </div>
    </header>
  );
}
