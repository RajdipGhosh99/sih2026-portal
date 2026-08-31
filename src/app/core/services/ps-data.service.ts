import { Injectable, signal, computed } from '@angular/core';
import { ProblemStatement, FilterState, SkillPersona, TargetDepartment, PsTheme, PsCategory } from '../models/problem-statement.model';
import { SIH2026_PROBLEM_STATEMENTS, SKILL_PERSONAS } from '../data/sih2026-dataset';

export interface ScoredProblemStatement extends ProblemStatement {
  matchScore: number;
  matchPercentage: number;
  matchedSkills: string[];
}

@Injectable({
  providedIn: 'root'
})
export class PsDataService {
  private readonly allStatements: ProblemStatement[] = SIH2026_PROBLEM_STATEMENTS;
  readonly personas: SkillPersona[] = SKILL_PERSONAS;

  // Active filter state signal
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

  // Selected persona signal (or null if manual filter)
  activePersonaId = signal<string | null>(null);

  // Filtered & Ranked Problem Statements
  filteredStatements = computed(() => {
    const filters = this.filterState();
    const activePersona = this.personas.find(p => p.id === this.activePersonaId());
    const query = filters.searchQuery.trim().toLowerCase();

    let list = this.allStatements.map(ps => {
      let score = 0;
      const matchedSkills: string[] = [];

      // Persona matching score
      if (activePersona) {
        // Skill overlap (40 pts max)
        const commonSkills = ps.skills.filter(s => 
          activePersona.primarySkills.some(psk => psk.toLowerCase() === s.toLowerCase() || s.toLowerCase().includes(psk.toLowerCase()))
        );
        matchedSkills.push(...commonSkills);
        score += Math.min(40, commonSkills.length * 15);

        // Department match (25 pts)
        if (ps.departments.includes(activePersona.recommendedDepartment)) {
          score += 25;
        }

        // Theme match (20 pts)
        if (activePersona.featuredThemes.includes(ps.theme)) {
          score += 20;
        }

        // Hardware alignment for ECE persona
        if (activePersona.id === 'ece-embedded' && ps.category === 'Hardware') {
          score += 15;
        }

        // Software alignment for Fullstack/Cyber
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

    // Apply strict criteria filters
    list = list.filter(ps => {
      if (filters.category !== 'All' && ps.category !== filters.category) return false;
      if (filters.theme !== 'All' && ps.theme !== filters.theme) return false;
      if (filters.department !== 'All' && !ps.departments.includes(filters.department as TargetDepartment)) return false;
      if (filters.difficulty !== 'All' && ps.difficulty !== filters.difficulty) return false;
      if (filters.ministry !== 'All' && ps.org !== filters.ministry) return false;
      if (filters.hasDatasetOnly && !ps.dataset_link) return false;

      if (filters.selectedSkills.length > 0) {
        const hasAnySkill = filters.selectedSkills.some(sel => 
          ps.skills.some(psSkill => psSkill.toLowerCase() === sel.toLowerCase())
        );
        if (!hasAnySkill) return false;
      }

      if (query) {
        const fullSearchText = `${ps.ps_number} ${ps.title} ${ps.org} ${ps.department} ${ps.theme} ${ps.skills.join(' ')} ${ps.description}`.toLowerCase();
        if (!fullSearchText.includes(query)) return false;
      }

      return true;
    });

    // Sorting
    switch (filters.sortBy) {
      case 'relevance':
        list.sort((a, b) => b.matchScore - a.matchScore || a.sno - b.sno);
        break;
      case 'rank':
        list.sort((a, b) => (a.rank || 999) - (b.rank || 999));
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
          return numB - numA;
        });
        break;
    }

    return list;
  });

  // Top 10 for the currently active persona or default
  top10ForActivePersona = computed(() => {
    return this.filteredStatements().slice(0, 10);
  });

  // Get Top 10 specifically for any persona id
  getTop10ForPersona(personaId: string): ScoredProblemStatement[] {
    const persona = this.personas.find(p => p.id === personaId);
    if (!persona) return this.allStatements.slice(0, 10).map(ps => ({ ...ps, matchScore: 80, matchPercentage: 80, matchedSkills: [] }));

    return this.allStatements.map(ps => {
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
    }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 10);
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

  getAllMinistries(): string[] {
    const orgs = Array.from(new Set(this.allStatements.map(ps => ps.org)));
    return orgs.sort();
  }

  getAllThemes(): PsTheme[] {
    const themes = Array.from(new Set(this.allStatements.map(ps => ps.theme)));
    return themes.sort() as PsTheme[];
  }

  getAllDepartments(): TargetDepartment[] {
    const depts = new Set<TargetDepartment>();
    this.allStatements.forEach(ps => ps.departments.forEach(d => depts.add(d)));
    return Array.from(depts).sort();
  }

  getAllSkills(): string[] {
    const skills = new Set<string>();
    this.allStatements.forEach(ps => ps.skills.forEach(s => skills.add(s)));
    return Array.from(skills).sort();
  }

  getStatistics() {
    const total = this.allStatements.length;
    const softwareCount = this.allStatements.filter(ps => ps.category === 'Software').length;
    const hardwareCount = this.allStatements.filter(ps => ps.category === 'Hardware').length;
    const themesCount = this.getAllThemes().length;
    const ministriesCount = this.getAllMinistries().length;
    const datasetsCount = this.allStatements.filter(ps => !!ps.dataset_link).length;

    return {
      total,
      softwareCount,
      hardwareCount,
      themesCount,
      ministriesCount,
      datasetsCount
    };
  }

  // Filter setters
  setSearchQuery(q: string): void {
    this.filterState.update(s => ({ ...s, searchQuery: q }));
  }

  setCategory(cat: 'All' | 'Software' | 'Hardware'): void {
    this.filterState.update(s => ({ ...s, category: cat }));
  }

  setTheme(theme: string): void {
    this.filterState.update(s => ({ ...s, theme }));
  }

  setDepartment(dept: string): void {
    this.filterState.update(s => ({ ...s, department: dept }));
  }

  setMinistry(ministry: string): void {
    this.filterState.update(s => ({ ...s, ministry }));
  }

  setDifficulty(diff: string): void {
    this.filterState.update(s => ({ ...s, difficulty: diff }));
  }

  setSortBy(sortBy: FilterState['sortBy']): void {
    this.filterState.update(s => ({ ...s, sortBy }));
  }

  toggleSkill(skill: string): void {
    this.filterState.update(s => {
      const exists = s.selectedSkills.includes(skill);
      const updated = exists ? s.selectedSkills.filter(x => x !== skill) : [...s.selectedSkills, skill];
      return { ...s, selectedSkills: updated };
    });
  }

  setActivePersona(personaId: string | null): void {
    this.activePersonaId.set(personaId);
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
}
