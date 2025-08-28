'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScoreBadge } from '@/components/jobs/ScoreBadge';
import { useJobs } from '@/store/useJobs';
import Link from 'next/link';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend
} from 'recharts';

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompareList } = useJobs();

  if (compareList.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-semibold text-white mb-4">
            No jobs to compare
          </h2>
          <p className="text-gray-400 mb-8">
            Add jobs to your comparison list from the job results page
          </p>
          <Link href="/results">
            <Button className="bg-purple-600 hover:bg-purple-700">
              Browse Jobs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Prepare radar chart data
  const radarData = [
    {
      category: 'Skills Match',
      ...compareList.reduce((acc, job, index) => ({
        ...acc,
        [`job${index}`]: Math.round(((job.matchReasons?.skillsMatched.length || 0) / 
          ([...job.requiredSkills, ...job.preferredSkills].length || 1)) * 100)
      }), {})
    },
    {
      category: 'Title Match',
      ...compareList.reduce((acc, job, index) => ({
        ...acc,
        [`job${index}`]: job.matchReasons?.titleMatch ? 100 : 0
      }), {})
    },
    {
      category: 'Location',
      ...compareList.reduce((acc, job, index) => ({
        ...acc,
        [`job${index}`]: job.matchReasons?.locationMatch ? 100 : 0
      }), {})
    },
    {
      category: 'Seniority',
      ...compareList.reduce((acc, job, index) => ({
        ...acc,
        [`job${index}`]: job.matchReasons?.seniorityMatch ? 100 : 0
      }), {})
    },
    {
      category: 'Freshness',
      ...compareList.reduce((acc, job, index) => {
        const daysSincePosted = Math.floor((Date.now() - job.postedDate.getTime()) / (1000 * 60 * 60 * 24));
        let freshnessScore = 0;
        if (daysSincePosted <= 1) freshnessScore = 100;
        else if (daysSincePosted <= 7) freshnessScore = 70;
        else if (daysSincePosted <= 30) freshnessScore = 30;
        else freshnessScore = 10;
        
        return {
          ...acc,
          [`job${index}`]: freshnessScore
        };
      }, {})
    }
  ];

  const colors = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'];

  const exportComparison = () => {
    const csvData = [
      ['Metric', ...compareList.map(job => job.title)].join(','),
      ['Company', ...compareList.map(job => `"${job.company}"`)].join(','),
      ['Location', ...compareList.map(job => `"${job.location}"`)].join(','),
      ['Match Score', ...compareList.map(job => `${job.matchScore || 0}%`)].join(','),
      ['Skills Matched', ...compareList.map(job => job.matchReasons?.skillsMatched.length || 0)].join(','),
      ['Posted Date', ...compareList.map(job => job.postedDate.toLocaleDateString())].join(','),
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `job-comparison-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

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
              Job Comparison ({compareList.length})
            </h1>
            <p className="text-gray-400">
              Compare up to 4 jobs side by side
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={exportComparison}
            variant="outline"
            className="border-white/20"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={clearCompareList}
            variant="destructive"
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* Radar Chart */}
      <Card className="mb-8 border-white/10 bg-white/5 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Match Score Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis 
                  dataKey="category" 
                  tick={{ fill: '#D1D5DB', fontSize: 12 }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]}
                  tick={{ fill: '#9CA3AF', fontSize: 10 }}
                />
                {compareList.map((job, index) => (
                  <Radar
                    key={job.id}
                    name={job.title}
                    dataKey={`job${index}`}
                    stroke={colors[index]}
                    fill={colors[index]}
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                ))}
                <Legend 
                  wrapperStyle={{ color: '#fff' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Job Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {compareList.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full border-white/10 bg-white/5 backdrop-blur-sm relative">
              <button
                onClick={() => removeFromCompare(job.id)}
                className="absolute top-4 right-4 p-1 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-400"
              >
                <X className="h-4 w-4" />
              </button>

              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg text-white truncate">
                      {job.title}
                    </CardTitle>
                    {job.titleTurkish && job.titleTurkish !== job.title && (
                      <p className="text-sm text-gray-400 mt-1 truncate">
                        {job.titleTurkish}
                      </p>
                    )}
                  </div>
                  <ScoreBadge score={job.matchScore || 0} size="sm" />
                </div>
                
                <div className="space-y-1 text-sm text-gray-400">
                  <p className="truncate">{job.company}</p>
                  <p className="truncate">{job.location}</p>
                  <p>{job.postedDate.toLocaleDateString()}</p>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Skills Matched */}
                <div>
                  <h4 className="text-sm font-medium text-emerald-400 mb-2">
                    ✅ Skills Matched ({job.matchReasons?.skillsMatched.length || 0})
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {(job.matchReasons?.skillsMatched || []).slice(0, 3).map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="text-xs border-emerald-400/30 bg-emerald-400/10 text-emerald-400"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {(job.matchReasons?.skillsMatched.length || 0) > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{(job.matchReasons?.skillsMatched.length || 0) - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Skills Missing */}
                {(job.matchReasons?.skillsMissing.length || 0) > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-orange-400 mb-2">
                      📚 To Learn ({job.matchReasons?.skillsMissing.length || 0})
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {(job.matchReasons?.skillsMissing || []).slice(0, 3).map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="text-xs border-orange-400/30 bg-orange-400/10 text-orange-400"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {(job.matchReasons?.skillsMissing.length || 0) > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{(job.matchReasons?.skillsMissing.length || 0) - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Match Criteria */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span>{job.matchReasons?.titleMatch ? '✅' : '❌'}</span>
                    <span className="text-gray-300 text-xs">Title</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{job.matchReasons?.locationMatch ? '✅' : '❌'}</span>
                    <span className="text-gray-300 text-xs">Location</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{job.matchReasons?.seniorityMatch ? '✅' : '❌'}</span>
                    <span className="text-gray-300 text-xs">Seniority</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{job.isRemote ? '✅' : '❌'}</span>
                    <span className="text-gray-300 text-xs">Remote</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs border-white/20"
                    onClick={() => window.open(job.linkedinUrl, '_blank')}
                  >
                    LinkedIn
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}