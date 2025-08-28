import { Job, UserProfile } from '@/types';
import { userProfile } from './userData';

export class MatchEngine {
  private userProfile: UserProfile;

  constructor(profile: UserProfile) {
    this.userProfile = profile;
  }

  private calculateSkillsMatch(job: Job): { score: number; matched: string[]; missing: string[] } {
    const allJobSkills = [...job.requiredSkills, ...job.preferredSkills];
    const userSkills = this.userProfile.skills.map(skill => skill.toLowerCase());
    
    const matched: string[] = [];
    const missing: string[] = [];
    
    allJobSkills.forEach(skill => {
      const skillLower = skill.toLowerCase();
      if (userSkills.some(userSkill => 
        userSkill.includes(skillLower) || skillLower.includes(userSkill)
      )) {
        matched.push(skill);
      } else {
        missing.push(skill);
      }
    });

    const matchPercentage = allJobSkills.length > 0 ? (matched.length / allJobSkills.length) : 0;
    return { 
      score: Math.round(matchPercentage * 50), // 50% weight for skills
      matched, 
      missing 
    };
  }

  private calculateTitleMatch(job: Job): { score: number; matched: boolean } {
    const preferredRoles = this.userProfile.preferredRoles.map(role => role.toLowerCase());
    const jobTitle = job.title.toLowerCase();
    const jobTitleTurkish = job.titleTurkish?.toLowerCase() || '';
    
    const titleMatched = preferredRoles.some(role => 
      jobTitle.includes(role) || role.includes(jobTitle) ||
      jobTitleTurkish.includes(role) || role.includes(jobTitleTurkish)
    );

    return {
      score: titleMatched ? 25 : 0, // 25% weight for title match
      matched: titleMatched
    };
  }

  private calculateLocationAndSeniorityMatch(job: Job): { score: number; locationMatch: boolean; seniorityMatch: boolean } {
    const locationMatch = job.location === this.userProfile.preferredLocation || job.isRemote;
    
    // Seniority matching logic
    let seniorityMatch = false;
    const experience = this.userProfile.experience;
    
    if (experience >= 1 && experience < 3 && job.experienceLevel === 'junior') seniorityMatch = true;
    if (experience >= 2 && experience <= 5 && job.experienceLevel === 'mid') seniorityMatch = true;
    if (experience >= 4 && job.experienceLevel === 'senior') seniorityMatch = true;
    
    let score = 0;
    if (locationMatch) score += 8; // 8% for location
    if (seniorityMatch) score += 7; // 7% for seniority
    
    return { score, locationMatch, seniorityMatch };
  }

  private calculateFreshnessScore(job: Job): number {
    const daysSincePosted = Math.floor((Date.now() - job.postedDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSincePosted <= 1) return 10; // 10% for very fresh
    if (daysSincePosted <= 7) return 7;  // 7% for week old
    if (daysSincePosted <= 30) return 3; // 3% for month old
    return 1; // 1% for older
  }

  public calculateMatch(job: Job): Job {
    const skillsMatch = this.calculateSkillsMatch(job);
    const titleMatch = this.calculateTitleMatch(job);
    const locationSeniorityMatch = this.calculateLocationAndSeniorityMatch(job);
    const freshnessScore = this.calculateFreshnessScore(job);

    const totalScore = Math.min(100, 
      skillsMatch.score + 
      titleMatch.score + 
      locationSeniorityMatch.score + 
      freshnessScore
    );

    return {
      ...job,
      matchScore: totalScore,
      matchReasons: {
        skillsMatched: skillsMatch.matched,
        skillsMissing: skillsMatch.missing,
        titleMatch: titleMatch.matched,
        locationMatch: locationSeniorityMatch.locationMatch,
        seniorityMatch: locationSeniorityMatch.seniorityMatch
      },
      isSaved: false
    };
  }

  public searchJobs(jobs: Job[], keywords: string = ''): Job[] {
    let filteredJobs = [...jobs];

    if (keywords.trim()) {
      const keywordLower = keywords.toLowerCase();
      filteredJobs = jobs.filter(job => 
        job.title.toLowerCase().includes(keywordLower) ||
        job.titleTurkish?.toLowerCase().includes(keywordLower) ||
        job.company.toLowerCase().includes(keywordLower) ||
        job.description.toLowerCase().includes(keywordLower) ||
        job.requiredSkills.some(skill => skill.toLowerCase().includes(keywordLower)) ||
        job.preferredSkills.some(skill => skill.toLowerCase().includes(keywordLower))
      );
    }

    return filteredJobs
      .map(job => this.calculateMatch(job))
      .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }
}

export const matchEngine = new MatchEngine(userProfile);