import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PsDataService, ScoredProblemStatement } from '../../core/services/ps-data.service';
import { SeoService } from '../../core/services/seo.service';
import { ProblemStatement, SkillPersona } from '../../core/models/problem-statement.model';
import { PsCardComponent } from '../../shared/components/ps-card/ps-card.component';
import { FilterDrawerComponent } from '../../shared/components/filter-drawer/filter-drawer.component';
import { PitchModalComponent } from '../../shared/components/pitch-modal/pitch-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, PsCardComponent, FilterDrawerComponent, PitchModalComponent],
  template: `
    <div class="home-page">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="hero-pill">
            <span class="live-pulse"></span>
            <span>Official Smart India Hackathon 2026 Problem Statements</span>
          </div>
          <h1 class="hero-title">
            Find the <span class="gradient-text">Top 10 Problem Statements</span> for Your Tech Stack
          </h1>
          <p class="hero-subtitle">
            Match your skills in Full Stack Web, AI/ML, ECE Hardware, or Cybersecurity against all 229 SIH 2026 challenges. Access full architectural blueprints, solution hooks, and 6-slide presentation pitch decks.
          </p>

          <!-- Quick Stats Counter -->
          <div class="stats-row">
            <div class="stat-card">
              <span class="stat-num">{{ stats.total }}</span>
              <span class="stat-lbl">Problem Statements</span>
            </div>
            <div class="stat-card">
              <span class="stat-num">{{ stats.softwareCount }}</span>
              <span class="stat-lbl">💻 Software Tracks</span>
            </div>
            <div class="stat-card">
              <span class="stat-num">{{ stats.hardwareCount }}</span>
              <span class="stat-lbl">⚡ Hardware Tracks</span>
            </div>
            <div class="stat-card">
              <span class="stat-num">{{ stats.themesCount }}+</span>
              <span class="stat-lbl">National Themes</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Persona Selector Section -->
      <section class="personas-section">
        <div class="section-header">
          <div class="header-left">
            <h2>🎯 Step 1: Select Your Skillset or Academic Track</h2>
            <p>Select your track to dynamically rank the best 10 challenges for your team</p>
          </div>
          @if (psService.activePersonaId()) {
            <button class="clear-persona-btn" (click)="selectPersona(null)">Show All 229 PS</button>
          }
        </div>

        <div class="persona-grid">
          @for (persona of psService.personas; track persona.id) {
            <div 
              class="persona-card" 
              [class.selected]="psService.activePersonaId() === persona.id"
              (click)="selectPersona(persona.id)"
            >
              <div class="persona-top">
                <span class="persona-dept">{{ persona.recommendedDepartment }}</span>
                <span class="select-indicator">{{ psService.activePersonaId() === persona.id ? '✓ Selected' : '+ Filter' }}</span>
              </div>
              <h3 class="persona-name">{{ persona.name }}</h3>
              <p class="persona-desc">{{ persona.description }}</p>
              <div class="persona-skills">
                @for (sk of persona.primarySkills.slice(0, 3); track sk) {
                  <span class="sk-pill">{{ sk }}</span>
                }
              </div>
            </div>
          }
        </div>
      </section>

      <!-- Top 10 Showcase Section -->
      @if (psService.activePersonaId(); as activeId) {
        <section class="top10-showcase">
          <div class="top10-banner">
            <div class="banner-title">
              <span class="trophy">🏆</span>
              <div>
                <h2>Top 10 Recommendations for {{ getActivePersonaName() }}</h2>
                <p>Calculated using our skill-matching algorithm (Skill overlap + Department fit + Category feasibility)</p>
              </div>
            </div>
          </div>

          <div class="ps-grid top10-grid">
            @for (ps of psService.top10ForActivePersona(); track ps.ps_number; let i = $index) {
              <div class="top10-card-wrapper">
                <div class="rank-badge-floater">#{{ i + 1 }} MATCH</div>
                <app-ps-card 
                  [ps]="ps" 
                  [matchScore]="ps.matchPercentage"
                  [searchQuery]="psService.filterState().searchQuery"
                  (openPitch)="selectedPitchPs.set($event)"
                ></app-ps-card>
              </div>
            }
          </div>
        </section>
      }

      <!-- Main Directory Section -->
      <section class="directory-section">
        <div class="directory-layout">
          <!-- Left Sidebar Filters -->
          <div class="sidebar-wrapper">
            <app-filter-drawer></app-filter-drawer>
          </div>

          <!-- Right Content Area -->
          <div class="main-content">
            <!-- Controls Bar: Sort, View, Results count -->
            <div class="content-controls">
              <div class="results-count">
                Showing <strong>{{ psService.filteredStatements().length }}</strong> problem statements
                @if (psService.filterState().category !== 'All') {
                  <span class="active-chip">Category: {{ psService.filterState().category }}</span>
                }
                @if (psService.filterState().theme !== 'All') {
                  <span class="active-chip">Theme: {{ psService.filterState().theme }}</span>
                }
              </div>

              <div class="sort-controls">
                <label>Sort By:</label>
                <select 
                  [ngModel]="psService.filterState().sortBy"
                  (ngModelChange)="psService.setSortBy($event)"
                  class="sort-select"
                >
                  <option value="relevance">Relevance & Match Score</option>
                  <option value="rank">Curated Top Rank</option>
                  <option value="psNumber">Problem Statement ID</option>
                  <option value="title">Title (A-Z)</option>
                </select>
              </div>
            </div>

            <!-- Problem Statement Grid -->
            @if (psService.filteredStatements().length > 0) {
              <div class="ps-grid">
                @for (ps of paginatedStatements(); track ps.ps_number) {
                  <app-ps-card 
                    [ps]="ps" 
                    [matchScore]="ps.matchPercentage"
                    [searchQuery]="psService.filterState().searchQuery"
                    (openPitch)="selectedPitchPs.set($event)"
                  ></app-ps-card>
                }
              </div>

              <!-- Pagination -->
              @if (totalPages() > 1) {
                <div class="pagination-bar">
                  <button 
                    class="page-btn" 
                    [disabled]="currentPage() === 1"
                    (click)="currentPage.set(currentPage() - 1)"
                  >
                    ← Previous
                  </button>
                  <span class="page-info">Page {{ currentPage() }} of {{ totalPages() }}</span>
                  <button 
                    class="page-btn" 
                    [disabled]="currentPage() === totalPages()"
                    (click)="currentPage.set(currentPage() + 1)"
                  >
                    Next →
                  </button>
                </div>
              }
            } @else {
              <div class="empty-state">
                <span class="empty-icon">🔍</span>
                <h3>No Problem Statements Match Your Filters</h3>
                <p>Try resetting some filters or searching with broader keywords.</p>
                <button class="btn-primary" (click)="psService.resetFilters()">Reset All Filters</button>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Pitch Deck Modal -->
      <app-pitch-modal 
        [ps]="selectedPitchPs()"
        [isOpen]="!!selectedPitchPs()"
        (close)="selectedPitchPs.set(null)"
      ></app-pitch-modal>
    </div>
  `,
  styles: [`
    .home-page {
      display: flex;
      flex-direction: column;
      gap: 3rem;
      padding-bottom: 4rem;
    }

    .hero-section {
      background: radial-gradient(circle at 50% 20%, rgba(56, 189, 248, 0.15), transparent 70%),
                  radial-gradient(circle at 80% 80%, rgba(129, 140, 248, 0.1), transparent 60%);
      padding: 4rem 1.5rem 2rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      text-align: center;
    }

    .hero-content {
      max-width: 960px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .hero-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(56, 189, 248, 0.1);
      border: 1px solid rgba(56, 189, 248, 0.25);
      color: #38bdf8;
      font-size: 0.8rem;
      font-weight: 700;
      padding: 0.35rem 0.9rem;
      border-radius: 9999px;
      margin-bottom: 1.5rem;

      .live-pulse {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #38bdf8;
        box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.7);
        animation: pulse 1.8s infinite;
      }
    }

    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.7); }
      70% { box-shadow: 0 0 0 8px rgba(56, 189, 248, 0); }
      100% { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0); }
    }

    .hero-title {
      font-size: 2.75rem;
      font-weight: 900;
      line-height: 1.15;
      color: #f8fafc;
      margin: 0 0 1.25rem 0;
      letter-spacing: -0.03em;

      .gradient-text {
        background: linear-gradient(135deg, #38bdf8, #818cf8, #c084fc);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      @media (max-width: 768px) {
        font-size: 2rem;
      }
    }

    .hero-subtitle {
      font-size: 1.1rem;
      color: #94a3b8;
      line-height: 1.6;
      max-width: 780px;
      margin: 0 0 2.5rem 0;
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
      width: 100%;

      @media (max-width: 640px) {
        grid-template-columns: repeat(2, 1fr);
      }

      .stat-card {
        background: rgba(30, 41, 59, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;

        .stat-num {
          font-size: 1.75rem;
          font-weight: 800;
          color: #f8fafc;
        }

        .stat-lbl {
          font-size: 0.75rem;
          color: #94a3b8;
          font-weight: 600;
        }
      }
    }

    .personas-section, .top10-showcase, .directory-section {
      max-width: 1440px;
      margin: 0 auto;
      padding: 0 1.5rem;
      width: 100%;
    }

    .section-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      margin-bottom: 1.5rem;

      h2 {
        font-size: 1.35rem;
        font-weight: 800;
        color: #f8fafc;
        margin: 0 0 0.25rem 0;
      }

      p {
        font-size: 0.875rem;
        color: #94a3b8;
        margin: 0;
      }

      .clear-persona-btn {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: #cbd5e1;
        padding: 0.45rem 0.9rem;
        border-radius: 8px;
        font-size: 0.8rem;
        font-weight: 600;
        cursor: pointer;
        &:hover { background: rgba(255, 255, 255, 0.15); color: white; }
      }
    }

    .persona-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1rem;
    }

    .persona-card {
      background: rgba(30, 41, 59, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 1.25rem;
      cursor: pointer;
      transition: all 0.25s ease;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      &:hover {
        background: rgba(30, 41, 59, 0.7);
        border-color: rgba(56, 189, 248, 0.4);
        transform: translateY(-2px);
      }

      &.selected {
        background: linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(30, 41, 59, 0.9));
        border-color: #38bdf8;
        box-shadow: 0 0 20px rgba(56, 189, 248, 0.15);

        .select-indicator {
          background: #38bdf8;
          color: #0f172a;
        }
      }

      .persona-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;

        .persona-dept {
          font-size: 0.7rem;
          font-weight: 700;
          color: #38bdf8;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .select-indicator {
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.08);
          color: #cbd5e1;
        }
      }

      .persona-name {
        margin: 0 0 0.5rem 0;
        font-size: 1.05rem;
        font-weight: 700;
        color: #f8fafc;
      }

      .persona-desc {
        font-size: 0.8rem;
        color: #94a3b8;
        line-height: 1.45;
        margin: 0 0 1rem 0;
        flex: 1;
      }

      .persona-skills {
        display: flex;
        gap: 0.35rem;
        flex-wrap: wrap;

        .sk-pill {
          background: rgba(255, 255, 255, 0.05);
          font-size: 0.7rem;
          padding: 2px 6px;
          border-radius: 4px;
          color: #cbd5e1;
        }
      }
    }

    .top10-showcase {
      background: linear-gradient(180deg, rgba(56, 189, 248, 0.05), transparent);
      border-radius: 20px;
      border: 1px solid rgba(56, 189, 248, 0.2);
      padding: 1.75rem;

      .top10-banner {
        margin-bottom: 1.5rem;
        .banner-title {
          display: flex;
          align-items: center;
          gap: 1rem;

          .trophy { font-size: 2rem; }
          h2 { margin: 0; font-size: 1.35rem; font-weight: 800; color: #f8fafc; }
          p { margin: 0.2rem 0 0 0; font-size: 0.85rem; color: #94a3b8; }
        }
      }

      .top10-card-wrapper {
        position: relative;

        .rank-badge-floater {
          position: absolute;
          top: -8px;
          right: 12px;
          z-index: 10;
          background: linear-gradient(90deg, #f59e0b, #ef4444);
          color: white;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 9999px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        }
      }
    }

    .directory-layout {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 2rem;

      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
    }

    .content-controls {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
      background: rgba(30, 41, 59, 0.3);
      padding: 0.75rem 1.25rem;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.05);

      .results-count {
        font-size: 0.85rem;
        color: #94a3b8;
        display: flex;
        align-items: center;
        gap: 0.5rem;

        strong { color: #f8fafc; }

        .active-chip {
          background: rgba(56, 189, 248, 0.15);
          color: #38bdf8;
          font-size: 0.75rem;
          padding: 2px 8px;
          border-radius: 6px;
        }
      }

      .sort-controls {
        display: flex;
        align-items: center;
        gap: 0.5rem;

        label {
          font-size: 0.8rem;
          color: #94a3b8;
          font-weight: 600;
        }

        .sort-select {
          background: #0f172a;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #f8fafc;
          padding: 0.4rem 0.75rem;
          border-radius: 6px;
          font-size: 0.8rem;
          outline: none;
        }
      }
    }

    .ps-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 1.25rem;
    }

    .pagination-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-top: 2.5rem;

      .page-btn {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: #f8fafc;
        padding: 0.5rem 1.25rem;
        border-radius: 8px;
        font-weight: 600;
        font-size: 0.85rem;
        cursor: pointer;
        transition: all 0.2s;

        &:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        &:not(:disabled):hover {
          background: #38bdf8;
          color: #0f172a;
        }
      }

      .page-info {
        font-size: 0.85rem;
        color: #94a3b8;
        font-weight: 600;
      }
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: rgba(30, 41, 59, 0.3);
      border: 1px dashed rgba(255, 255, 255, 0.15);
      border-radius: 16px;

      .empty-icon { font-size: 3rem; margin-bottom: 1rem; display: block; }
      h3 { color: #f8fafc; font-size: 1.25rem; margin: 0 0 0.5rem 0; }
      p { color: #94a3b8; font-size: 0.9rem; margin: 0 0 1.5rem 0; }
      .btn-primary {
        background: #38bdf8;
        color: #0f172a;
        font-weight: 700;
        padding: 0.6rem 1.25rem;
        border-radius: 8px;
        border: none;
        cursor: pointer;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  psService = inject(PsDataService);
  private seoService = inject(SeoService);
  private route = inject(ActivatedRoute);

  stats = this.psService.getStatistics();
  selectedPitchPs = signal<ProblemStatement | null>(null);

  currentPage = signal(1);
  pageSize = 12;

  ngOnInit(): void {
    this.seoService.setGeneralSeo(
      'SIH 2026 Problem Statements & Skill Navigator',
      'Discover and filter the top 10 SIH 2026 problem statements matching your skills across Full Stack Web, AI/ML, ECE Hardware, and Cybersecurity with solution architectures and pitch decks.',
      ['Smart India Hackathon 2026', 'SIH 2026 PS list', 'Problem Statements', 'Full Stack', 'AI ML', 'ECE Hardware', 'Cybersecurity'],
      '/'
    );

    this.route.queryParams.subscribe(params => {
      if (params['persona']) {
        this.selectPersona(params['persona']);
      }
    });
  }

  selectPersona(id: string | null): void {
    this.psService.setActivePersona(id);
    this.currentPage.set(1);
  }

  getActivePersonaName(): string {
    const p = this.psService.personas.find(x => x.id === this.psService.activePersonaId());
    return p ? p.name : 'Your Selection';
  }

  paginatedStatements(): ScoredProblemStatement[] {
    const list = this.psService.filteredStatements();
    const start = (this.currentPage() - 1) * this.pageSize;
    return list.slice(start, start + this.pageSize);
  }

  totalPages(): number {
    return Math.ceil(this.psService.filteredStatements().length / this.pageSize) || 1;
  }
}
