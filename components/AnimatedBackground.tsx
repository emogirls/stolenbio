import { motion } from 'framer-motion';
import { Theme } from './constants/themes';

interface AnimatedBackgroundProps {
  theme: Theme;
  mousePosition: { x: number; y: number };
}

export function AnimatedBackground({ theme, mousePosition }: AnimatedBackgroundProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Floating Geometric Shapes */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute opacity-10"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            rotate: [0, 360],
            scale: [1, Math.random() * 0.5 + 0.5, 1],
          }}
          transition={{
            duration: Math.random() * 25 + 15,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div 
            className={`w-${Math.floor(Math.random() * 16) + 8} h-${Math.floor(Math.random() * 16) + 8} bg-gradient-to-br ${theme.accent} blur-sm`}
            style={{
              clipPath: i % 4 === 0 ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 
                       i % 4 === 1 ? 'circle(50%)' : 
                       i % 4 === 2 ? 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)' :
                       'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
            }}
          />
        </motion.div>
      ))}
      
      {/* Interactive Mouse Trail */}
      <motion.div
        className="absolute w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${theme.primary}15 0%, transparent 70%)`,
          x: mousePosition.x - 192,
          y: mousePosition.y - 192,
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}