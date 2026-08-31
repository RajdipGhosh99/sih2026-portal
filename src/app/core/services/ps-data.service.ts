import { Injectable, signal, computed } from '@angular/core';
import { 
  ProblemStatement, 
  SkillPersona, 
  FilterState, 
  PsCategory, 
  PsTheme, 
  TargetDepartment, 
  DifficultyLevel 
} from '../models/problem-statement.model';
import { SIH2026_PROBLEM_STATEMENTS } from '../data/sih2026-dataset';

export interface ScoredProblemStatement extends ProblemStatement {
  matchScore: number;
  matchPercentage: number;
  matchedSkills: string[];
}

@Injectable({
  providedIn: 'root'
})
export class PsDataService {
  readonly allStatements: ProblemStatement[] = SIH2026_PROBLEM_STATEMENTS;

  // Curated Personas / Tracks
  readonly personas: SkillPersona[] = [
    {
      id: 'full-stack',
      name: 'Full-Stack Web & Mobile',
      icon: 'bi-window-stack',
      badgeColor: '#0284c7',
      description: 'Web applications, APIs, real-time dashboards, mobile apps & cloud microservices.',
      recommendedDepartment: 'CSE/IT',
      primarySkills: ['Full Stack', 'Angular', 'React', 'Node.js', 'FastAPI', 'Python', 'REST APIs', 'PostgreSQL', 'MongoDB', 'Docker', 'WebSockets', 'Frontend', 'Backend', 'Flutter', 'Next.js'],
      featuredThemes: ['Smart Automation', 'Smart Education', 'Transportation & Logistics', 'Agriculture, FoodTech & Rural Development', 'Disaster Management', 'MedTech / BioTech / HealthTech', 'Miscellaneous']
    },
    {
      id: 'ai-ml',
      name: 'AI & Machine Learning',
      icon: 'bi-cpu',
      badgeColor: '#4f46e5',
      description: 'Computer Vision, NLP, LLMs, predictive modeling, Deep Learning & edge AI inference.',
      recommendedDepartment: 'AI & Data Science',
      primarySkills: ['AI / ML', 'Python', 'Computer Vision', 'PyTorch', 'TensorFlow', 'NLP', 'LLM', 'YOLO', 'OpenCV', 'Deep Learning', 'Data Science', 'Machine Learning', 'BERT', 'Transformers'],
      featuredThemes: ['Disaster Management', 'MedTech / BioTech / HealthTech', 'Smart Automation', 'Agriculture, FoodTech & Rural Development', 'Space Technology', 'Smart Vehicles']
    },
    {
      id: 'cybersecurity',
      name: 'Cybersecurity & Forensics',
      icon: 'bi-shield-check',
      badgeColor: '#dc2626',
      description: 'Threat detection, blockchain audit, cryptography, forensic analysis & identity security.',
      recommendedDepartment: 'Cybersecurity & Forensics',
      primarySkills: ['Cybersecurity', 'Blockchain', 'Forensics', 'Cryptography', 'Smart Contracts', 'Solidity', 'Network Security', 'Penetration Testing', 'SIEM', 'Zero Trust', 'Auth', 'Encryption'],
      featuredThemes: ['Blockchain & Cybersecurity', 'Smart Automation', 'Miscellaneous']
    },
    {
      id: 'ece-embedded',
      name: 'Hardware & Embedded (ECE)',
      icon: 'bi-motherboard',
      badgeColor: '#d97706',
      description: 'IoT sensors, microcontrollers, robotics, embedded Linux, drones & smart telemetry.',
      recommendedDepartment: 'ECE / Embedded & IoT',
      primarySkills: ['Embedded Systems', 'IoT', 'Arduino', 'ESP32', 'Raspberry Pi', 'Sensors', 'Robotics', 'C/C++', 'MQTT', 'Drones', 'Hardware', 'PCB Design', 'LoRaWAN', 'Telemetry'],
      featuredThemes: ['Robotics and Drones', 'Smart Vehicles', 'Clean & Green Technology', 'Renewable / Sustainable Energy', 'Disaster Management', 'Space Technology']
    }
  ];

  // Global Filter State Signal
  filterState = signal<FilterState>({
    searchQuery: '',
    category: 'All',
    theme: 'All',
    department: 'All',
    difficulty: 'All',
    ministry: 'All',
    selectedSkills: [],
    hasDatasetOnly: false,
    sortBy: 'relevance'
  });

  // Selected persona / track signal (or null for all tracks)
  activePersonaId = signal<string | null>(null);

  // Helper to check if a PS strictly matches a persona track
  private matchesTrack(ps: ProblemStatement, trackId: string): boolean {
    const skillsLower = ps.skills.map(s => s.toLowerCase());
    const skillsStr = skillsLower.join(' ');
    const depts = ps.departments.map(d => d.toLowerCase());

    switch (trackId) {
      case 'full-stack':
        return (
          depts.includes('cse/it') ||
          depts.includes('ai & data science') ||
          ps.category === 'Software' ||
          skillsLower.some(s => ['full stack', 'web', 'react', 'angular', 'node', 'django', 'fastapi', 'frontend', 'backend', 'api', 'mobile', 'flutter', 'next.js', 'vue', 'database', 'sql'].some(k => s.includes(k)))
        );
      case 'ai-ml':
        return (
          depts.includes('ai & data science') ||
          (ps.architecture.aiMl && ps.architecture.aiMl.length > 0) ||
          skillsLower.some(s => ['ai', 'ml', 'machine learning', 'deep learning', 'nlp', 'vision', 'llm', 'pytorch', 'tensorflow', 'yolo', 'data science', 'opencv', 'bert'].some(k => s.includes(k)))
        );
      case 'cybersecurity':
        return (
          ps.theme === 'Blockchain & Cybersecurity' ||
          depts.includes('cybersecurity & forensics') ||
          skillsLower.some(s => ['security', 'cybersecurity', 'blockchain', 'forensics', 'cryptography', 'smart contract', 'solidity', 'auth', 'encryption'].some(k => s.includes(k)))
        );
      case 'ece-embedded':
        return (
          ps.category === 'Hardware' ||
          (ps.architecture.hardware && ps.architecture.hardware.length > 0) ||
          depts.includes('ece / embedded & iot') ||
          depts.includes('electrical & instrumentation') ||
          depts.includes('mechanical & robotics') ||
          skillsLower.some(s => ['iot', 'embedded', 'sensor', 'arduino', 'esp32', 'raspberry', 'hardware', 'drone', 'robotics', 'mqtt', 'lora'].some(k => s.includes(k)))
        );
      default:
        return true;
    }
  }

  // Filtered & Ranked Problem Statements (Calculates filters and sorting TOGETHER)
  filteredStatements = computed(() => {
    const filters = this.filterState();
    const activePersona = this.personas.find(p => p.id === this.activePersonaId());
    const activeTrackId = this.activePersonaId();
    const query = filters.searchQuery.trim().toLowerCase();

    // 1. First score all statements
    let list = this.allStatements.map(ps => {
      let score = 0;
      const matchedSkills: string[] = [];

      // Persona matching score
      if (activePersona) {
        const commonSkills = ps.skills.filter(s => 
          activePersona.primarySkills.some(psk => psk.toLowerCase() === s.toLowerCase() || s.toLowerCase().includes(psk.toLowerCase()))
        );
        matchedSkills.push(...commonSkills);
        score += Math.min(40, commonSkills.length * 15);

        if (ps.departments.includes(activePersona.recommendedDepartment)) {
          score += 25;
        }
        if (activePersona.featuredThemes.includes(ps.theme)) {
          score += 20;
        }
        if (activePersona.id === 'ece-embedded' && ps.category === 'Hardware') {
          score += 15;
        }
        if ((activePersona.id === 'full-stack' || activePersona.id === 'cybersecurity') && ps.category === 'Software') {
          score += 15;
        }
      }

      // Manual skill filter scoring
      if (filters.selectedSkills.length > 0) {
        const manualMatches = ps.skills.filter(s => 
          filters.selectedSkills.some(sel => sel.toLowerCase() === s.toLowerCase())
        );
        matchedSkills.push(...manualMatches);
        score += manualMatches.length * 20;
      }

      // Search query relevance
      if (query) {
        if (ps.ps_number.toLowerCase().includes(query)) score += 50;
        if (ps.title.toLowerCase().includes(query)) score += 30;
        if (ps.org.toLowerCase().includes(query)) score += 20;
        if (ps.theme.toLowerCase().includes(query)) score += 15;
        if (ps.description.toLowerCase().includes(query)) score += 10;
        if (ps.skills.some(s => s.toLowerCase().includes(query))) score += 20;
      }

      // Bonus for curated top rank
      if (ps.rank) {
        score += (11 - ps.rank) * 2;
      }

      const matchPercentage = Math.min(99, Math.max(45, Math.round(score > 0 ? (score / 110) * 100 : 50)));

      return {
        ...ps,
        matchScore: score,
        matchPercentage,
        matchedSkills: Array.from(new Set(matchedSkills))
      } as ScoredProblemStatement;
    });

    // 2. Apply strict filters (Track, Category, Theme, Difficulty, Ministry, Search Query) TOGETHER
    list = list.filter(ps => {
      // Primary Track Filter
      if (activeTrackId && !this.matchesTrack(ps, activeTrackId)) {
        return false;
      }

      // Category Filter (Software / Hardware)
      if (filters.category !== 'All' && ps.category !== filters.category) {
        return false;
      }

      // Theme Filter
      if (filters.theme !== 'All' && ps.theme !== filters.theme) {
        return false;
      }

      // Department Filter
      if (filters.department !== 'All' && !ps.departments.includes(filters.department as TargetDepartment)) {
        return false;
      }

      // Difficulty Filter
      if (filters.difficulty !== 'All' && ps.difficulty !== filters.difficulty) {
        return false;
      }

      // Ministry Filter
      if (filters.ministry !== 'All' && ps.org !== filters.ministry) {
        return false;
      }

      // Dataset Filter
      if (filters.hasDatasetOnly && !ps.dataset_link) {
        return false;
      }

      // Selected Skills Filter
      if (filters.selectedSkills.length > 0) {
        const hasAnySkill = filters.selectedSkills.some(sel => 
          ps.skills.some(psSkill => psSkill.toLowerCase() === sel.toLowerCase())
        );
        if (!hasAnySkill) return false;
      }

      // Search Query Filter
      if (query) {
        const fullSearchText = `${ps.ps_number} ${ps.title} ${ps.org} ${ps.department} ${ps.theme} ${ps.skills.join(' ')} ${ps.description}`.toLowerCase();
        if (!fullSearchText.includes(query)) return false;
      }

      return true;
    });

    // 3. Apply Sorting strictly on the filtered results
    switch (filters.sortBy) {
      case 'relevance':
        list.sort((a, b) => b.matchScore - a.matchScore || a.sno - b.sno);
        break;
      case 'rank':
        list.sort((a, b) => (a.rank || 999) - (b.rank || 999) || a.sno - b.sno);
        break;
      case 'psNumber':
        list.sort((a, b) => a.ps_number.localeCompare(b.ps_number));
        break;
      case 'title':
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'ideas':
        list.sort((a, b) => {
          const numA = parseInt(a.ideas.split('/')[0]) || 0;
          const numB = parseInt(b.ideas.split('/')[0]) || 0;
          return numB - numA || a.sno - b.sno;
        });
        break;
      case 'ministry':
        list.sort((a, b) => a.org.localeCompare(b.org) || a.sno - b.sno);
        break;
      case 'category':
        list.sort((a, b) => a.category.localeCompare(b.category) || a.sno - b.sno);
        break;
      case 'theme':
        list.sort((a, b) => a.theme.localeCompare(b.theme) || a.sno - b.sno);
        break;
      case 'difficulty-asc': {
        const diffRankAsc: Record<string, number> = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Expert': 4 };
        list.sort((a, b) => (diffRankAsc[a.difficulty] || 2) - (diffRankAsc[b.difficulty] || 2) || a.sno - b.sno);
        break;
      }
      case 'difficulty-desc': {
        const diffRankDesc: Record<string, number> = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Expert': 4 };
        list.sort((a, b) => (diffRankDesc[b.difficulty] || 2) - (diffRankDesc[a.difficulty] || 2) || a.sno - b.sno);
        break;
      }
    }

    return list;
  });

  // Top 10 for the currently active persona or default
  top10ForActivePersona = computed(() => {
    const activeId = this.activePersonaId();
    if (activeId) {
      return this.getTop10ForPersona(activeId);
    }
    return this.getTop10RankedPortals().map(ps => ({
      ...ps,
      matchScore: 90,
      matchPercentage: 90,
      matchedSkills: ps.skills
    } as ScoredProblemStatement));
  });

  // Get Top 10 specifically for any persona id
  getTop10ForPersona(personaId: string): ScoredProblemStatement[] {
    const persona = this.personas.find(p => p.id === personaId);
    if (!persona) {
      return this.allStatements.slice(0, 10).map(ps => ({ ...ps, matchScore: 80, matchPercentage: 80, matchedSkills: [] }));
    }

    return this.allStatements
      .filter(ps => this.matchesTrack(ps, personaId))
      .map(ps => {
        let score = 0;
        const commonSkills = ps.skills.filter(s => 
          persona.primarySkills.some(psk => psk.toLowerCase() === s.toLowerCase() || s.toLowerCase().includes(psk.toLowerCase()))
        );
        score += Math.min(40, commonSkills.length * 15);

        if (ps.departments.includes(persona.recommendedDepartment)) score += 25;
        if (persona.featuredThemes.includes(ps.theme)) score += 20;
        if (persona.id === 'ece-embedded' && ps.category === 'Hardware') score += 15;
        if ((persona.id === 'full-stack' || persona.id === 'cybersecurity') && ps.category === 'Software') score += 15;
        if (ps.rank) score += (11 - ps.rank) * 3;

        const matchPercentage = Math.min(99, Math.max(50, Math.round((score / 115) * 100)));

        return {
          ...ps,
          matchScore: score,
          matchPercentage,
          matchedSkills: commonSkills
        } as ScoredProblemStatement;
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);
  }

  // Get Curated Top 10 Web Portals (Rajdip Ghosh's Strategy)
  getTop10RankedPortals(): ProblemStatement[] {
    return this.allStatements
      .filter(ps => ps.rank !== undefined && ps.rank > 0)
      .sort((a, b) => (a.rank || 0) - (b.rank || 0));
  }

  getProblemStatementById(id: string): ProblemStatement | undefined {
    if (!id) return undefined;
    const cleanId = id.trim().toUpperCase();
    return this.allStatements.find(ps => ps.ps_number.toUpperCase() === cleanId || ps.sno.toString() === cleanId);
  }

  getSimilarProblemStatements(currentPs: ProblemStatement, limit: number = 3): ProblemStatement[] {
    return this.allStatements
      .filter(ps => ps.ps_number !== currentPs.ps_number)
      .map(ps => {
        let similarity = 0;
        if (ps.theme === currentPs.theme) similarity += 30;
        if (ps.category === currentPs.category) similarity += 15;
        if (ps.org === currentPs.org) similarity += 20;
        const skillOverlap = ps.skills.filter(s => currentPs.skills.includes(s)).length;
        similarity += skillOverlap * 10;
        return { ps, similarity };
      })
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(item => item.ps);
  }

  setActivePersona(id: string | null): void {
    this.activePersonaId.set(id);
  }

  setSearchQuery(q: string): void {
    this.filterState.update(s => ({ ...s, searchQuery: q }));
  }

  setCategory(category: PsCategory | 'All'): void {
    this.filterState.update(s => ({ ...s, category }));
  }

  setTheme(theme: string): void {
    this.filterState.update(s => ({ ...s, theme }));
  }

  setDepartment(department: string): void {
    this.filterState.update(s => ({ ...s, department }));
  }

  setDifficulty(difficulty: string): void {
    this.filterState.update(s => ({ ...s, difficulty }));
  }

  setMinistry(ministry: string): void {
    this.filterState.update(s => ({ ...s, ministry }));
  }

  setSortBy(sortBy: FilterState['sortBy']): void {
    this.filterState.update(s => ({ ...s, sortBy }));
  }

  toggleSkill(skill: string): void {
    this.filterState.update(s => {
      const exists = s.selectedSkills.includes(skill);
      return {
        ...s,
        selectedSkills: exists 
          ? s.selectedSkills.filter(x => x !== skill)
          : [...s.selectedSkills, skill]
      };
    });
  }

  toggleDatasetOnly(): void {
    this.filterState.update(s => ({ ...s, hasDatasetOnly: !s.hasDatasetOnly }));
  }

  resetFilters(): void {
    this.filterState.set({
      searchQuery: '',
      category: 'All',
      theme: 'All',
      department: 'All',
      difficulty: 'All',
      ministry: 'All',
      selectedSkills: [],
      hasDatasetOnly: false,
      sortBy: 'relevance'
    });
    this.activePersonaId.set(null);
  }

  getAllThemes(): PsTheme[] {
    const set = new Set<PsTheme>();
    this.allStatements.forEach(ps => set.add(ps.theme));
    return Array.from(set).sort();
  }

  getAllMinistries(): string[] {
    const set = new Set<string>();
    this.allStatements.forEach(ps => set.add(ps.org));
    return Array.from(set).sort();
  }

  getAllSkills(): string[] {
    const set = new Set<string>();
    this.allStatements.forEach(ps => ps.skills.forEach(s => set.add(s)));
    return Array.from(set).sort();
  }

  getStatistics() {
    const total = this.allStatements.length;
    const softwareCount = this.allStatements.filter(p => p.category === 'Software').length;
    const hardwareCount = this.allStatements.filter(p => p.category === 'Hardware').length;
    const ministries = new Set(this.allStatements.map(p => p.org)).size;
    const departments = new Set(this.allStatements.map(p => p.department)).size;

    return { total, softwareCount, hardwareCount, ministriesCount: ministries, departmentsCount: departments };
  }
}
