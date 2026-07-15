'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [show, setShow] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setShow(false), 400);
          return 100;
        }
        return p + Math.random() * 12 + 4;
      });
    }, 90);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-wood-900"
        >
          {/* Efeito de tochas */}
          <div className="absolute top-10 left-10 torch" />
          <div className="absolute top-10 right-10 torch" />
          <div className="absolute bottom-10 left-10 torch" />
          <div className="absolute bottom-10 right-10 torch" />

          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 flex flex-col items-center"
          >
            {/* Brasão */}
            <motion.div
              animate={{ rotate: [0, 3, -3, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-28 h-28 mb-6"
            >
              <div className="absolute inset-0 coat-of-arms rounded-full shadow-gold-glow" />
              <div className="absolute inset-2 bg-wood-800 rounded-full flex items-center justify-center border-2 border-gold-400">
                <span className="text-4xl">🍁</span>
              </div>
            </motion.div>

            <h1 className="font-medieval text-4xl md:text-5xl font-bold text-gold-glow tracking-widest mb-1">
              CANADÁ
            </h1>
            <p className="font-medieval text-sm md:text-base text-parchment-200/80 tracking-[0.3em] uppercase mb-8">
              Reino Medieval
            </p>

            {/* Barra de progresso */}
            <div className="w-64 md:w-80 h-2 bg-wood-700 border-2 border-wood-400 rounded-sm overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-300"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <p className="mt-3 text-xs text-parchment-200/60 font-mono tracking-widest">
              {Math.min(Math.floor(progress), 100)}%
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
