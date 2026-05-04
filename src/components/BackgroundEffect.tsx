import { useMemo } from 'react';
import { motion } from 'motion/react';
import { ThemeType } from '../types';

interface BackgroundEffectProps {
  theme: ThemeType;
}

interface Particle {
  id: number;
  left: string;
  size: number;
  duration: number;
  delay: number;
  style: any;
}

export default function BackgroundEffect({ theme }: BackgroundEffectProps) {
  const particles = useMemo(() => {
    if (theme === 'classic') return [];
    
    return Array.from({ length: 30 }).map((_, i) => {
      const size = theme === 'rain' ? 1 : Math.random() * 15 + 5;
      const left = `${Math.random() * 100}%`;
      const duration = theme === 'rain' ? 0.8 + Math.random() * 0.5 : 10 + Math.random() * 15;
      const delay = Math.random() * 10;
      
      let style: any = {};
      switch (theme) {
        case 'spring':
          style = {
            width: size,
            height: size,
            backgroundColor: '#ffb7c5',
            borderRadius: '50% 0 50% 0',
            opacity: 0.6,
          };
          break;
        case 'winter':
          style = {
            width: size / 2,
            height: size / 2,
            backgroundColor: '#ffffff',
            borderRadius: '50%',
            opacity: 0.8,
            filter: 'blur(1px)',
          };
          break;
        case 'rain':
          style = {
            width: '1px',
            height: `${Math.random() * 20 + 20}px`,
            backgroundColor: '#ffffff',
            opacity: 0.4,
          };
          break;
        case 'autumn':
          style = {
            width: size,
            height: size * 0.7,
            backgroundColor: i % 2 === 0 ? '#d97706' : '#b91c1c',
            borderRadius: '50% 0 50% 0',
            opacity: 0.7,
          };
          break;
        case 'forest':
          style = {
            width: `${Math.random() * 150 + 100}px`,
            height: '200vh',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.15), transparent)',
            opacity: 0.1,
            transform: 'rotate(25deg)',
          };
          break;
        case 'summer':
          style = {
            width: size * 2,
            height: size * 2,
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            filter: 'blur(8px)',
          };
          break;
      }

      return { id: i, left, size, duration, delay, style };
    });
  }, [theme]);

  if (theme === 'classic') return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={`${theme}-${p.id}`}
          initial={{
            left: p.left,
            top: '-10vh',
            rotate: 0,
            opacity: theme === 'forest' ? 0 : 1,
          }}
          animate={{
            top: '110vh',
            left: theme === 'forest' ? p.left : [p.left, `${parseFloat(p.left) + (Math.random() - 0.5) * 10}%`],
            rotate: theme === 'forest' ? 25 : 720,
            opacity: theme === 'forest' ? [0, 0.3, 0] : 1,
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: theme === 'rain' ? 'linear' : 'easeInOut',
          }}
          style={{
            position: 'absolute',
            ...p.style,
          }}
        />
      ))}
    </div>
  );
}
