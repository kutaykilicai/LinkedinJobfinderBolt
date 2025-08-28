'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { JobCard } from '@/components/jobs/JobCard';
import { useJobs } from '@/store/useJobs';
import { Badge } from '@/components/ui/badge';

export default function ResultsPage() {
  const { 
    searchResults, 
    filters, 
    updateFilters, 
    searchJobs, 
    initializeJobs 
  } = useJobs();
  
  const [localKeywords, setLocalKeywords] = useState(filters.keywords);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (searchResults.length === 0) {
      initializeJobs();
    }
  }, [searchResults.length, initializeJobs]);

  const handleSearch = () => {
    updateFilters({ keywords: localKeywords });
    searchJobs(localKeywords);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    updateFilters({ [key]: value });
  };

  const getResultsText = () => {
    const total = searchResults.length;
    const hasKeywords = filters.keywords.trim().length > 0;
    
    if (hasKeywords) {
      return `${total} jobs found for "${filters.keywords}"`;
    }
    return `${total} jobs available`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row gap-4 mb-6"
        >
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search jobs..."
                value={localKeywords}
                onChange={(e) => setLocalKeywords(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 h-12 border-white/20 bg-white/5 text-white placeholder:text-gray-400"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => setShowFilters(!showFilters)}
              className="h-12 px-4 border border-white/20 bg-white/5 hover:bg-white/10"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
            
            <div className="flex border border-white/20 bg-white/5 rounded-lg overflow-hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('grid')}
                className={`h-12 px-3 rounded-none ${viewMode === 'grid' ? 'bg-white/10' : ''}`}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('list')}
                className={`h-12 px-3 rounded-none ${viewMode === 'list' ? 'bg-white/10' : ''}`}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            
            <Button
              onClick={handleSearch}
              className="h-12 px-6 bg-purple-600 hover:bg-purple-700"
            >
              Search
            </Button>
          </div>
        </motion.div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6 p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select
                  value={filters.location}
                  onValueChange={(value) => handleFilterChange('location', value)}
                >
                  <SelectTrigger className="border-white/20 bg-white/5 text-white">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Location</SelectItem>
                    <SelectItem value="İstanbul">İstanbul</SelectItem>
                    <SelectItem value="Ankara">Ankara</SelectItem>
                    <SelectItem value="İzmir">İzmir</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.datePosted}
                  onValueChange={(value) => handleFilterChange('datePosted', value)}
                >
                  <SelectTrigger className="border-white/20 bg-white/5 text-white">
                    <SelectValue placeholder="Posted Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any time</SelectItem>
                    <SelectItem value="24h">Last 24 hours</SelectItem>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  onValueChange={(value) => handleFilterChange('experienceLevel', value ? [value] : [])}
                >
                  <SelectTrigger className="border-white/20 bg-white/5 text-white">
                    <SelectValue placeholder="Experience Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Level</SelectItem>
                    <SelectItem value="junior">Junior</SelectItem>
                    <SelectItem value="mid">Mid-level</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.minMatchScore.toString()}
                  onValueChange={(value) => handleFilterChange('minMatchScore', parseInt(value))}
                >
                  <SelectTrigger className="border-white/20 bg-white/5 text-white">
                    <SelectValue placeholder="Min Match Score" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any Score</SelectItem>
                    <SelectItem value="60">60%+ Match</SelectItem>
                    <SelectItem value="70">70%+ Match</SelectItem>
                    <SelectItem value="80">80%+ Match</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-white">
              {getResultsText()}
            </h2>
            {filters.keywords && (
              <Badge variant="outline" className="border-purple-400/30 bg-purple-400/10 text-purple-400">
                {filters.keywords}
              </Badge>
            )}
          </div>
          
          {searchResults.length > 0 && (
            <Select
              defaultValue="match"
              onValueChange={(value) => {
                // In a real app, this would trigger re-sorting
                console.log('Sort by:', value);
              }}
            >
              <SelectTrigger className="w-40 border-white/20 bg-white/5 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="match">Best Match</SelectItem>
                <SelectItem value="date">Most Recent</SelectItem>
                <SelectItem value="company">Company A-Z</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {searchResults.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No jobs found
            </h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your search criteria or keywords
            </p>
            <Button
              onClick={() => {
                setLocalKeywords('');
                updateFilters({ keywords: '', minMatchScore: 0 });
                searchJobs();
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {searchResults.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <JobCard 
                  job={job} 
                  className={viewMode === 'list' ? 'max-w-none' : ''}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}