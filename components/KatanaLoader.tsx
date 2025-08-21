import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface KatanaLoaderProps {
  onComplete: () => void;
}

export function KatanaLoader({ onComplete }: KatanaLoaderProps) {
  const [showSlice, setShowSlice] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSlice(true);
      setTimeout(onComplete, 1000);
    }, 1000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Background particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-pink-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Katana */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        initial={{ rotate: -45, x: -200, y: 200, opacity: 0 }}
        animate={{ 
          rotate: showSlice ? 45 : -45, 
          x: showSlice ? 200 : -200, 
          y: showSlice ? -200 : 200,
          opacity: 1 
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* Katana blade */}
        <div className="relative">
          <div className="w-96 h-2 bg-gradient-to-r from-gray-300 via-white to-gray-300 rounded-full shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 rounded-full animate-pulse" />
          </div>
          {/* Handle */}
          <div className="w-16 h-4 bg-gradient-to-r from-red-900 to-black rounded-full -ml-2 mt-1" />
          
          {/* Slash effect */}
          {showSlice && (
            <motion.div
              className="absolute -inset-20 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-70"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 4, opacity: [0.7, 0] }}
              transition={{ duration: 0.3 }}
            />
          )}
        </div>
      </motion.div>

      {/* Screen split effect */}
      {showSlice && (
        <>
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"
            style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
            initial={{ x: 0 }}
            animate={{ x: '-100%' }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"
            style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
            initial={{ x: 0 }}
            animate={{ x: '100%' }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </>
      )}

      {/* Loading text */}
      <motion.div
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 mb-2">
          stolen.bio
        </div>
        <div className="text-lg text-purple-300">Loading your digital identity...</div>
      </motion.div>
    </div>
  );
}