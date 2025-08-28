'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  Building2,
  Plus,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Job } from '@/types';
import { SaveButton } from './SaveButton';
import { ScoreBadge } from './ScoreBadge';
import { useJobs } from '@/store/useJobs';
import { cn } from '@/lib/utils';

interface JobCardProps {
  job: Job;
  className?: string;
}

export function JobCard({ job, className }: JobCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { compareList, addToCompare, removeFromCompare } = useJobs();
  
  const isInCompare = compareList.some(j => j.id === job.id);
  const canAddToCompare = compareList.length < 4;

  const handleCompareToggle = () => {
    if (isInCompare) {
      removeFromCompare(job.id);
    } else if (canAddToCompare) {
      addToCompare(job);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:shadow-purple-500/10",
        className
      )}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white truncate group-hover:text-purple-300 transition-colors">
              {job.title}
            </h3>
            {job.titleTurkish && job.titleTurkish !== job.title && (
              <p className="text-sm text-gray-400 mt-1">
                {job.titleTurkish}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2 text-gray-400">
              <Building2 className="h-4 w-4" />
              <span className="text-sm">{job.company}</span>
            </div>
          </div>
          <ScoreBadge score={job.matchScore || 0} />
        </div>

        {/* Location and Date */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
            {job.isRemote && (
              <Badge variant="secondary" className="ml-2 text-xs">
                Remote
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formatDate(job.postedDate)}</span>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {[...job.requiredSkills, ...job.preferredSkills].slice(0, 4).map((skill) => {
              const isMatched = job.matchReasons?.skillsMatched.includes(skill);
              return (
                <Badge
                  key={skill}
                  variant="outline"
                  className={cn(
                    "text-xs",
                    isMatched 
                      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-400" 
                      : "border-gray-600 bg-gray-800/50 text-gray-300"
                  )}
                >
                  {skill}
                </Badge>
              );
            })}
            {[...job.requiredSkills, ...job.preferredSkills].length > 4 && (
              <Badge variant="outline" className="text-xs border-gray-600 bg-gray-800/50 text-gray-400">
                +{[...job.requiredSkills, ...job.preferredSkills].length - 4} more
              </Badge>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-white"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Less Details
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Why Matched?
                </>
              )}
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCompareToggle}
              disabled={!canAddToCompare && !isInCompare}
              className={cn(
                "text-gray-400 hover:text-white",
                isInCompare && "text-blue-400 hover:text-blue-300"
              )}
            >
              {isInCompare ? (
                <Check className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Compare
            </Button>
            
            <SaveButton job={job} />
            
            <Button
              variant="default"
              size="sm"
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => window.open(job.linkedinUrl, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              LinkedIn
            </Button>
          </div>
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-6 pt-6 border-t border-white/10"
            >
              <div className="space-y-4">
                {job.matchReasons && (
                  <>
                    <div>
                      <h4 className="text-sm font-medium text-emerald-400 mb-2">
                        ✅ Skills Matched ({job.matchReasons.skillsMatched.length})
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {job.matchReasons.skillsMatched.map((skill) => (
                          <Badge
                            key={skill}
                            variant="outline"
                            className="text-xs border-emerald-400/30 bg-emerald-400/10 text-emerald-400"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {job.matchReasons.skillsMissing.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-orange-400 mb-2">
                          📚 Skills to Learn ({job.matchReasons.skillsMissing.length})
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {job.matchReasons.skillsMissing.map((skill) => (
                            <Badge
                              key={skill}
                              variant="outline"
                              className="text-xs border-orange-400/30 bg-orange-400/10 text-orange-400"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className={job.matchReasons.titleMatch ? '✅' : '❌'}>
                          {job.matchReasons.titleMatch ? '✅' : '❌'}
                        </span>
                        <span className="text-gray-300">Title Match</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={job.matchReasons.locationMatch ? '✅' : '❌'}>
                          {job.matchReasons.locationMatch ? '✅' : '❌'}
                        </span>
                        <span className="text-gray-300">Location Match</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={job.matchReasons.seniorityMatch ? '✅' : '❌'}>
                          {job.matchReasons.seniorityMatch ? '✅' : '❌'}
                        </span>
                        <span className="text-gray-300">Seniority Match</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Gradient overlay for glassmorphism effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />
    </motion.div>
  );
}