'use client';

import { motion } from 'framer-motion';
import { Download, Heart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { JobCard } from '@/components/jobs/JobCard';
import { useJobs } from '@/store/useJobs';
import Link from 'next/link';

export default function SavedJobsPage() {
  const { savedJobs, exportSavedJobs } = useJobs();

  if (savedJobs.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">💼</div>
          <h2 className="text-2xl font-semibold text-white mb-4">
            No saved jobs yet
          </h2>
          <p className="text-gray-400 mb-8">
            Save jobs you're interested in to keep track of them
          </p>
          <Link href="/results">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Heart className="h-4 w-4 mr-2" />
              Find Jobs to Save
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/results">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Results
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Saved Jobs ({savedJobs.length})
            </h1>
            <p className="text-gray-400">
              Jobs you've saved for later review
            </p>
          </div>
        </div>

        <Button
          onClick={exportSavedJobs}
          variant="outline"
          className="border-white/20"
        >
          <Download className="h-4 w-4 mr-2" />
          Export to CSV
        </Button>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {savedJobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <JobCard job={job} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}