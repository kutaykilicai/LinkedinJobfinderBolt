'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Filter, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchPresets } from '@/components/jobs/SearchPresets';
import { useJobs } from '@/store/useJobs';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const { initializeJobs, updateFilters, filters, searchJobs } = useJobs();
  const [keywords, setKeywords] = useState('');
  const [location, setLocation] = useState('İstanbul');
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    initializeJobs();
  }, [initializeJobs]);

  const handleSearch = () => {
    updateFilters({ keywords, location });
    searchJobs(keywords);
    router.push('/results');
  };

  const handlePresetClick = (presetKeywords: string) => {
    setKeywords(presetKeywords);
    updateFilters({ keywords: presetKeywords, location });
    searchJobs(presetKeywords);
    router.push('/results');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-sm mb-6"
          >
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">
              AI-Powered Job Matching for IT Professionals
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find Your Perfect
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              {' '}IT Role
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Specialized job search for IT Audit, Security, and Cloud professionals.
            Bilingual support with smart matching algorithms.
          </p>

          <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-400 mb-8">
            <span className="px-3 py-1 rounded-full border border-gray-700 bg-gray-800/50">
              3+ Years Experience
            </span>
            <span className="px-3 py-1 rounded-full border border-gray-700 bg-gray-800/50">
              Banking & Finance
            </span>
            <span className="px-3 py-1 rounded-full border border-gray-700 bg-gray-800/50">
              Istanbul Based
            </span>
            <span className="px-3 py-1 rounded-full border border-gray-700 bg-gray-800/50">
              English + Turkish
            </span>
          </div>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          {/* Quick Search Presets */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4 text-center">
              Quick Search by Role
            </h2>
            <SearchPresets onPresetClick={handlePresetClick} />
          </div>

          {/* Advanced Search */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search jobs (e.g., 'IT Audit', 'BT Denetçi', 'Security')"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10 h-12 border-white/20 bg-white/5 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="w-40 h-12 border-white/20 bg-white/5 text-white">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="İstanbul">İstanbul</SelectItem>
                    <SelectItem value="Ankara">Ankara</SelectItem>
                    <SelectItem value="İzmir">İzmir</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="any">Any Location</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="h-12 w-12 border border-white/20 bg-white/5 hover:bg-white/10"
                >
                  <Filter className="h-5 w-5" />
                </Button>

                <Button
                  onClick={handleSearch}
                  className="h-12 px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
                >
                  Search Jobs
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showAdvanced && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-white/10 pt-4 space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select>
                    <SelectTrigger className="border-white/20 bg-white/5 text-white">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <SelectValue placeholder="Posted Date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any time</SelectItem>
                      <SelectItem value="24h">Last 24 hours</SelectItem>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger className="border-white/20 bg-white/5 text-white">
                      <SelectValue placeholder="Experience Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="junior">Junior (1-2 years)</SelectItem>
                      <SelectItem value="mid">Mid (2-5 years)</SelectItem>
                      <SelectItem value="senior">Senior (5+ years)</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select>
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
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
        >
          {[
            { label: 'Active Jobs', value: '8+' },
            { label: 'Companies', value: '6+' },
            { label: 'Match Accuracy', value: '95%' },
            { label: 'Avg Response', value: '<24h' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="text-center p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm"
            >
              <div className="text-2xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}