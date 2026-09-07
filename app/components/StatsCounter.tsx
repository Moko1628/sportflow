'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Trophy, Users, Zap, Award, type LucideIcon } from 'lucide-react';

interface StatItem {
  icon: LucideIcon;
  label: string;
  value: number;
  suffix: string;
}

const STATS: StatItem[] = [
  { icon: Users, label: "Fans Actifs", value: 250, suffix: "k+" },
  { icon: Zap, label: "Matchs en Direct", value: 1400, suffix: "+" },
  { icon: Trophy, label: "Compétitions", value: 45, suffix: "" },
  { icon: Award, label: "Experts & Rédacteurs", value: 80, suffix: "+" },
];

export default function StatsCounter() {
  return (
    <section className="my-16 py-12 bg-gradient-to-r from-sport-card/80 via-sport-card to-sport-card/80 rounded-3xl border border-sport-cardHover shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, idx) => (
            <StatCard key={idx} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ stat }: { stat: StatItem }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    const duration = 1500; // 1.5s

    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Easing out
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeProgress * stat.value));

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };

    requestAnimationFrame(animateCount);
  }, [isInView, stat.value]);

  const Icon = stat.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center text-center p-4 bg-sport-dark/40 rounded-2xl border border-sport-cardHover"
    >
      <div className="w-12 h-12 rounded-xl bg-sport-blue/10 border border-sport-blue/30 flex items-center justify-center text-sport-cyan mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1">
        {count.toLocaleString()}
        <span className="text-sport-cyan">{stat.suffix}</span>
      </div>
      <p className="text-xs sm:text-sm text-sport-gray font-medium uppercase tracking-wider">
        {stat.label}
      </p>
    </motion.div>
  );
}
