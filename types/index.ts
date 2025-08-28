export interface Job {
  id: string;
  title: string;
  titleTurkish?: string;
  company: string;
  location: string;
  isRemote: boolean;
  postedDate: Date;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  experienceLevel: 'junior' | 'mid' | 'senior';
  matchScore?: number;
  matchReasons?: {
    skillsMatched: string[];
    skillsMissing: string[];
    titleMatch: boolean;
    locationMatch: boolean;
    seniorityMatch: boolean;
  };
  linkedinUrl?: string;
  isSaved: boolean;
}

export interface JobFilter {
  keywords: string;
  location: string;
  experienceLevel: string[];
  isRemote: boolean | null;
  datePosted: 'any' | '24h' | '7d' | '30d';
  minMatchScore: number;
}

export interface UserProfile {
  name: string;
  title: string;
  experience: number;
  skills: string[];
  preferredRoles: string[];
  preferredLocation: string;
  languages: string[];
}