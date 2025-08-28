import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Job, JobFilter } from '@/types';
import { dummyJobs } from '@/lib/dummyJobs';
import { matchEngine } from '@/lib/matchEngine';

interface JobsState {
  jobs: Job[];
  savedJobs: Job[];
  compareList: Job[];
  filters: JobFilter;
  searchResults: Job[];
  
  // Actions
  searchJobs: (keywords?: string) => void;
  saveJob: (job: Job) => void;
  unsaveJob: (jobId: string) => void;
  addToCompare: (job: Job) => void;
  removeFromCompare: (jobId: string) => void;
  clearCompareList: () => void;
  updateFilters: (filters: Partial<JobFilter>) => void;
  exportSavedJobs: () => void;
  initializeJobs: () => void;
}

export const useJobs = create<JobsState>()(
  persist(
    (set, get) => ({
      jobs: [],
      savedJobs: [],
      compareList: [],
      searchResults: [],
      filters: {
        keywords: '',
        location: 'İstanbul',
        experienceLevel: [],
        isRemote: null,
        datePosted: 'any',
        minMatchScore: 0
      },

      initializeJobs: () => {
        const processedJobs = dummyJobs.map(job => matchEngine.calculateMatch({ ...job, isSaved: false }));
        set({ 
          jobs: processedJobs,
          searchResults: processedJobs.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
        });
      },

      searchJobs: (keywords) => {
        const { filters, jobs } = get();
        const searchKeywords = keywords !== undefined ? keywords : filters.keywords;
        
        let filteredJobs = matchEngine.searchJobs(jobs, searchKeywords);

        // Apply additional filters
        if (filters.experienceLevel.length > 0) {
          filteredJobs = filteredJobs.filter(job => 
            filters.experienceLevel.includes(job.experienceLevel)
          );
        }

        if (filters.isRemote !== null) {
          filteredJobs = filteredJobs.filter(job => job.isRemote === filters.isRemote);
        }

        if (filters.location && filters.location !== 'any') {
          filteredJobs = filteredJobs.filter(job => 
            job.location === filters.location || job.isRemote
          );
        }

        if (filters.datePosted !== 'any') {
          const now = Date.now();
          const cutoff = filters.datePosted === '24h' ? 24 * 60 * 60 * 1000 :
                        filters.datePosted === '7d' ? 7 * 24 * 60 * 60 * 1000 :
                        30 * 24 * 60 * 60 * 1000;
          
          filteredJobs = filteredJobs.filter(job => 
            now - job.postedDate.getTime() <= cutoff
          );
        }

        filteredJobs = filteredJobs.filter(job => 
          (job.matchScore || 0) >= filters.minMatchScore
        );

        set({ searchResults: filteredJobs });
      },

      saveJob: (job) => {
        set(state => {
          const updatedJob = { ...job, isSaved: true };
          const updatedSavedJobs = [...state.savedJobs.filter(j => j.id !== job.id), updatedJob];
          const updatedJobs = state.jobs.map(j => j.id === job.id ? updatedJob : j);
          const updatedSearchResults = state.searchResults.map(j => j.id === job.id ? updatedJob : j);
          
          return {
            savedJobs: updatedSavedJobs,
            jobs: updatedJobs,
            searchResults: updatedSearchResults
          };
        });
      },

      unsaveJob: (jobId) => {
        set(state => {
          const updatedSavedJobs = state.savedJobs.filter(job => job.id !== jobId);
          const updatedJobs = state.jobs.map(j => j.id === jobId ? { ...j, isSaved: false } : j);
          const updatedSearchResults = state.searchResults.map(j => j.id === jobId ? { ...j, isSaved: false } : j);
          
          return {
            savedJobs: updatedSavedJobs,
            jobs: updatedJobs,
            searchResults: updatedSearchResults
          };
        });
      },

      addToCompare: (job) => {
        set(state => {
          if (state.compareList.length >= 4) return state;
          if (state.compareList.find(j => j.id === job.id)) return state;
          return { compareList: [...state.compareList, job] };
        });
      },

      removeFromCompare: (jobId) => {
        set(state => ({
          compareList: state.compareList.filter(job => job.id !== jobId)
        }));
      },

      clearCompareList: () => {
        set({ compareList: [] });
      },

      updateFilters: (newFilters) => {
        set(state => {
          const updatedFilters = { ...state.filters, ...newFilters };
          return { filters: updatedFilters };
        });
        get().searchJobs();
      },

      exportSavedJobs: () => {
        const { savedJobs } = get();
        const csv = [
          ['Title', 'Company', 'Location', 'Match Score', 'Posted Date', 'LinkedIn URL'].join(','),
          ...savedJobs.map(job => [
            `"${job.title}"`,
            `"${job.company}"`,
            `"${job.location}"`,
            job.matchScore || 0,
            job.postedDate.toLocaleDateString(),
            job.linkedinUrl || ''
          ].join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `saved-jobs-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
      }
    }),
    {
      name: 'jobs-storage',
      partialize: (state) => ({ 
        savedJobs: state.savedJobs,
        compareList: state.compareList,
        filters: state.filters 
      }),
    }
  )
);