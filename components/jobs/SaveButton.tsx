'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useJobs } from '@/store/useJobs';
import { Job } from '@/types';
import { cn } from '@/lib/utils';

interface SaveButtonProps {
  job: Job;
  variant?: 'default' | 'ghost';
  size?: 'sm' | 'md';
}

export function SaveButton({ job, variant = 'ghost', size = 'sm' }: SaveButtonProps) {
  const { saveJob, unsaveJob } = useJobs();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSave = () => {
    setIsAnimating(true);
    if (job.isSaved) {
      unsaveJob(job.id);
    } else {
      saveJob(job);
    }
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleSave}
      className={cn(
        "relative overflow-hidden",
        job.isSaved && "text-red-400 hover:text-red-300"
      )}
    >
      <motion.div
        animate={isAnimating ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Heart 
          className={cn(
            "h-4 w-4 transition-all",
            job.isSaved && "fill-current"
          )} 
        />
      </motion.div>
      {variant === 'default' && (
        <span className="ml-2">
          {job.isSaved ? 'Saved' : 'Save'}
        </span>
      )}
    </Button>
  );
}