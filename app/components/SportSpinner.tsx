'use client';

import { motion } from 'framer-motion';

export default function SportSpinner({ text = "Chargement du direct..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative w-16 h-16 flex items-center justify-center">
        {/* Outer glowing ring */}
        <motion.div 
          className="absolute inset-0 rounded-full border-2 border-sport-blue/20 border-t-sport-blue"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        {/* Inner bouncing sports ball icon / dot */}
        <motion.div
          className="w-6 h-6 bg-gradient-to-r from-sport-blue to-sport-orange rounded-full shadow-lg shadow-sport-blue/50"
          animate={{ y: [-8, 8, -8], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <p className="mt-4 text-sport-gray text-sm font-medium tracking-wide animate-pulse">
        {text}
      </p>
    </div>
  );
}
