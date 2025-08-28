'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, BarChart3, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useJobs } from '@/store/useJobs';
import { ScoreBadge } from './ScoreBadge';
import Link from 'next/link';

export function CompareTray() {
  const { compareList, removeFromCompare, clearCompareList } = useJobs();

  if (compareList.length === 0) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 p-4"
    >
      <div className="mx-auto max-w-4xl">
        <div className="rounded-t-2xl border border-white/10 bg-black/90 backdrop-blur-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-400" />
              <h3 className="font-semibold text-white">
                Compare Jobs ({compareList.length}/4)
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCompareList}
              className="text-gray-400 hover:text-white"
            >
              Clear All
            </Button>
          </div>

          <div className="flex gap-3 mb-4">
            <AnimatePresence>
              {compareList.map((job) => (
                <motion.div
                  key={job.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="relative min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-3"
                >
                  <button
                    onClick={() => removeFromCompare(job.id)}
                    className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-medium text-white truncate">
                        {job.title}
                      </h4>
                      <ScoreBadge score={job.matchScore || 0} size="sm" />
                    </div>
                    <p className="text-xs text-gray-400 truncate">
                      {job.company}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex justify-end">
            <Link href="/compare">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Compare Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}