export type PsCategory = 'Software' | 'Hardware';

export type PsTheme = 
  | 'Disaster Management'
  | 'Transportation & Logistics'
  | 'MedTech / BioTech / HealthTech'
  | 'Agriculture, FoodTech & Rural Development'
  | 'Smart Automation'
  | 'Space Technology'
  | 'Blockchain & Cybersecurity'
  | 'Clean & Green Technology'
  | 'Smart Education'
  | 'Smart Vehicles'
  | 'Robotics and Drones'
  | 'Heritage & Culture'
  | 'Renewable / Sustainable Energy'
  | 'Fitness & Sports'
  | 'Travel & Tourism'
  | 'Toys & Games'
  | 'Miscellaneous';

export type TargetDepartment = 
  | 'CSE/IT'
  | 'AI & Data Science'
  | 'ECE / Embedded & IoT'
  | 'Electrical & Instrumentation'
  | 'Mechanical & Robotics'
  | 'Cybersecurity & Forensics'
  | 'Biotech & Biomedical'
  | 'Civil & Geospatial'
  | 'Interdisciplinary';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface ArchitectureLayer {
  frontend?: string[];
  backend?: string[];
  aiMl?: string[];
  hardware?: string[];
  database?: string[];
  cloudDevOps?: string[];
  protocols?: string[];
  tools?: string[];
}

export interface SolutionIdea {
  title: string;
  hook: string;
  description: string;
  keyFeatures: string[];
  usp: string;
}

export interface PitchSlide {
  slideNumber: number;
  slideTitle: string;
  heading: string;
  bulletPoints: string[];
  callout?: string;
}

export interface SeoMetadata {
  suggestedH1: string;
  metaDescription: string;
  focusKeywords: string[];
  schemaType: string;
}

export interface ProblemStatement {
  sno: number;
  ps_number: string;
  title: string;
  org: string;
  department: string;
  category: PsCategory;
  theme: PsTheme;
  deadline: string;
  deadline_date: string;
  ideas: string;
  dataset_link?: string;
  contact?: string;
  youtube?: string;
  description: string;
  scraped_at: string;
  
  // Enriched fields for Discovery & Architecture
  skills: string[];
  departments: TargetDepartment[];
  difficulty: DifficultyLevel;
  rank?: number; // 1-10 for curated web portal strategy
  architecture: ArchitectureLayer;
  solutionIdeas: SolutionIdea[];
  pitchDeck: PitchSlide[];
  seo: SeoMetadata;
  keyChallenges: string[];
  expectedDeliverables: string[];
}

export interface SkillPersona {
  id: string;
  name: string;
  icon: string;
  badgeColor: string;
  description: string;
  recommendedDepartment: TargetDepartment;
  primarySkills: string[];
  featuredThemes: PsTheme[];
}

export interface FilterState {
  searchQuery: string;
  category: 'All' | 'Software' | 'Hardware';
  theme: string;
  department: string;
  difficulty: string;
  ministry: string;
  selectedSkills: string[];
  hasDatasetOnly: boolean;
  sortBy: 'relevance' | 'psNumber' | 'rank' | 'title' | 'ideas' | 'ministry' | 'category' | 'theme';
}
