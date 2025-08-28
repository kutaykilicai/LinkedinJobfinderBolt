'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ScoreBadge({ score, size = 'md', className }: ScoreBadgeProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10';
    if (score >= 60) return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
    if (score >= 40) return 'text-orange-400 border-orange-400/30 bg-orange-400/10';
    return 'text-red-400 border-red-400/30 bg-red-400/10';
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        'rounded-full border font-semibold backdrop-blur-sm',
        getScoreColor(score),
        sizeClasses[size],
        className
      )}
    >
      {score}%
    </motion.div>
  );
}