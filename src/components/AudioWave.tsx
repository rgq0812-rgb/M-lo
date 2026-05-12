import { motion } from 'motion/react';

interface AudioWaveProps {
  isAnimating: boolean;
  color?: string;
  count?: number;
}

export default function AudioWave({ isAnimating, color = '#5A5A40', count = 12 }: AudioWaveProps) {
  const bars = Array.from({ length: count });

  return (
    <div className="flex items-center justify-center gap-1.5 h-12 py-4" id="audio-wave-container">
      {bars.map((_, i) => (
        <motion.div
          key={i}
          initial={{ height: 4 }}
          animate={isAnimating ? {
            height: [4, 16, 8, 24, 12, 4],
            opacity: [0.3, 0.7, 0.5, 0.8, 0.4, 0.3]
          } : { 
            height: 4,
            opacity: 0.2
          }}
          transition={isAnimating ? {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.1,
          } : {
            duration: 0.5
          }}
          style={{ backgroundColor: color }}
          className="w-1 rounded-full"
        />
      ))}
      {isAnimating && (
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="ml-4 text-[10px] uppercase tracking-widest text-brand-olive font-bold animate-pulse italic"
        >
          Session en direct...
        </motion.span>
      )}
    </div>
  );
}
