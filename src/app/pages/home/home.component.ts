import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PsDataService, ScoredProblemStatement } from '../../core/services/ps-data.service';
import { SeoService } from '../../core/services/seo.service';
import { ProblemStatement } from '../../core/models/problem-statement.model';
import { PsCardComponent } from '../../shared/components/ps-card/ps-card.component';
import { PitchModalComponent } from '../../shared/components/pitch-modal/pitch-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, PsCardComponent, PitchModalComponent],
  template: `
    <main class="container-xl py-3 py-md-4">
      <!-- Clean Hero Header -->
      <section class="card-evergreen p-3 p-md-4 mb-4">
        <div class="row align-items-center g-3">
          <div class="col-lg-9">
            <span class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1 mb-2 fw-semibold" style="font-size: 0.75rem;">
              Smart India Hackathon 2026
            </span>
            <h1 class="fs-3 fs-md-2 fw-bold text-main mb-2">
              Problem Statement Navigator & Architecture Guide
            </h1>
            <p class="text-muted small mb-3" style="max-width: 680px;">
              Filter 229 official SIH 2026 problem statements by your team's skillset. Access grounded full-stack system architectures, AI models, and presentation pitch deck outlines.
            </p>

            <!-- Stats strip -->
            <div class="d-flex flex-wrap gap-3 small text-muted">
              <span><strong>{{ stats.total }}</strong> Challenges</span>
              <span>•</span>
              <span><strong>{{ stats.softwareCount }}</strong> Software</span>
              <span>•</span>
              <span><strong>{{ stats.hardwareCount }}</strong> Hardware</span>
              <span>•</span>
              <span><strong>{{ stats.ministriesCount }}</strong> Ministries</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Step 1: Horizontal Scrollable Filter Pills -->
      <section class="mb-3">
        <div class="d-flex align-items-center justify-content-between mb-2">
          <span class="text-muted small fw-bold text-uppercase" style="font-size: 0.75rem;">Select Focus Track:</span>
          @if (psService.activePersonaId()) {
            <button class="btn btn-sm btn-link text-decoration-none text-muted p-0" style="font-size: 0.8rem;" (click)="selectPersona(null)">
              Reset to All
            </button>
          }
        </div>

        <div class="horizontal-scroll-container pb-2">
          <div class="d-flex gap-2">
            <button 
              class="pill-filter" 
              [class.active]="psService.activePersonaId() === null"
              (click)="selectPersona(null)"
            >
              All Tracks ({{ stats.total }})
            </button>
            <button 
              class="pill-filter" 
              [class.active]="psService.activePersonaId() === 'full-stack'"
              (click)="selectPersona('full-stack')"
            >
              <i class="bi bi-window-stack"></i> Full-Stack Development
            </button>
            <button 
              class="pill-filter" 
              [class.active]="psService.activePersonaId() === 'ai-ml'"
              (click)="selectPersona('ai-ml')"
            >
              <i class="bi bi-cpu"></i> AI & Machine Learning
            </button>
            <button 
              class="pill-filter" 
              [class.active]="psService.activePersonaId() === 'cybersecurity'"
              (click)="selectPersona('cybersecurity')"
            >
              <i class="bi bi-shield-check"></i> Cybersecurity & Forensics
            </button>
            <button 
              class="pill-filter" 
              [class.active]="psService.activePersonaId() === 'ece-embedded'"
              (click)="selectPersona('ece-embedded')"
            >
              <i class="bi bi-motherboard"></i> Hardware & Embedded (ECE)
            </button>
          </div>
        </div>

        <!-- Filter Controls Bar -->
        <div class="card card-evergreen p-2 p-md-3 mt-2 mb-3">
          <div class="row g-2 align-items-center">
            <!-- Search -->
            <div class="col-12 col-md-5">
              <div class="input-group input-group-sm">
                <span class="input-group-text bg-card border-end-0 border-subtle">
                  <i class="bi bi-search text-muted"></i>
                </span>
                <input 
                  type="text" 
                  class="form-control border-start-0 input-evergreen shadow-none" 
                  placeholder="Filter by keyword, title, ministry, tech..."
                  [ngModel]="psService.filterState().searchQuery"
                  (ngModelChange)="psService.setSearchQuery($event)"
                />
              </div>
            </div>

            <!-- Category Filter -->
            <div class="col-6 col-md-2">
              <select 
                class="form-select form-select-sm select-evergreen"
                [ngModel]="psService.filterState().category"
                (ngModelChange)="psService.setCategory($event)"
              >
                <option value="All">All Categories</option>
                <option value="Software">Software Only</option>
                <option value="Hardware">Hardware Only</option>
              </select>
            </div>

            <!-- Theme Filter -->
            <div class="col-6 col-md-3">
              <select 
                class="form-select form-select-sm select-evergreen"
                [ngModel]="psService.filterState().theme"
                (ngModelChange)="psService.setTheme($event)"
              >
                <option value="All">All Themes ({{ themes.length }})</option>
                @for (theme of themes; track theme) {
                  <option [value]="theme">{{ theme }}</option>
                }
              </select>
            </div>

            <!-- Sort By -->
            <div class="col-12 col-md-2">
              <select 
                class="form-select form-select-sm select-evergreen"
                [ngModel]="psService.filterState().sortBy"
                (ngModelChange)="psService.setSortBy($event)"
              >
                <option value="relevance">Top Match</option>
                <option value="psNumber">Problem ID</option>
                <option value="rank">Curated Rank</option>
                <option value="title">Title (A-Z)</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <!-- Top 10 Spotlight (When Track Selected) -->
      @if (psService.activePersonaId()) {
        <section class="mb-4">
          <div class="d-flex align-items-center gap-2 mb-3">
            <span class="badge bg-primary px-2 py-1" style="font-size: 0.75rem;">Top 10 Recommendations</span>
            <h2 class="fs-6 fw-bold text-main m-0">Recommended for {{ getActivePersonaTitle() }}</h2>
          </div>

          <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3 mb-4">
            @for (ps of psService.top10ForActivePersona(); track ps.ps_number) {
              <div class="col">
                <app-ps-card 
                  [ps]="ps" 
                  [searchQuery]="psService.filterState().searchQuery"
                  (openPitch)="selectedPitchPs.set($event)"
                ></app-ps-card>
              </div>
            }
          </div>
        </section>
      }

      <!-- Main Directory Grid -->
      <section>
        <div class="d-flex align-items-center justify-content-between mb-2">
          <span class="text-muted small">
            Showing <strong>{{ psService.filteredStatements().length }}</strong> problem statements
          </span>
        </div>

        @if (psService.filteredStatements().length > 0) {
          <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
            @for (ps of paginatedStatements(); track ps.ps_number) {
              <div class="col">
                <app-ps-card 
                  [ps]="ps" 
                  [searchQuery]="psService.filterState().searchQuery"
                  (openPitch)="selectedPitchPs.set($event)"
                ></app-ps-card>
              </div>
            }
          </div>

          <!-- Pagination Bar -->
          @if (totalPages() > 1) {
            <div class="d-flex align-items-center justify-content-center gap-2 mt-4 pt-2">
              <button 
                class="btn btn-sm btn-outline-secondary" 
                [disabled]="currentPage() === 1"
                (click)="currentPage.set(currentPage() - 1)"
              >
                Previous
              </button>
              <span class="small text-muted px-2">Page {{ currentPage() }} of {{ totalPages() }}</span>
              <button 
                class="btn btn-sm btn-outline-secondary" 
                [disabled]="currentPage() === totalPages()"
                (click)="currentPage.set(currentPage() + 1)"
              >
                Next
              </button>
            </div>
          }
        } @else {
          <div class="card card-evergreen p-5 text-center my-4">
            <i class="bi bi-search fs-2 text-muted mb-2"></i>
            <h4 class="fs-6 fw-bold text-main">No problem statements match your criteria</h4>
            <p class="text-muted small mb-3">Try adjusting your search terms or clearing selected category filters.</p>
            <div>
              <button class="btn btn-sm btn-primary" (click)="psService.resetFilters()">Reset All Filters</button>
            </div>
          </div>
        }
      </section>

      <!-- Pitch Deck Modal -->
      <app-pitch-modal 
        [ps]="selectedPitchPs()"
        [isOpen]="!!selectedPitchPs()"
        (close)="selectedPitchPs.set(null)"
      ></app-pitch-modal>
    </main>
  `,
  styles: [`
    .text-main { color: var(--text-main); }
    .bg-card { background-color: var(--bg-card); }
    .border-subtle { border-color: var(--border) !important; }
  `]
})
export class HomeComponent implements OnInit {
  psService = inject(PsDataService);
  private seoService = inject(SeoService);
  private route = inject(ActivatedRoute);

  stats = this.psService.getStatistics();
  themes = this.psService.getAllThemes();
  selectedPitchPs = signal<ProblemStatement | null>(null);

  currentPage = signal(1);
  pageSize = 12;

  ngOnInit(): void {
    this.seoService.setGeneralSeo(
      'SIH 2026 Problem Statement Navigator',
      'Discover problem statements for Full Stack Web, AI/ML, and ECE with practical architectures, tools, and presentation slides.',
      ['Smart India Hackathon 2026', 'Full Stack Hackathon', 'AI ML Projects', 'SIH PS List'],
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

  getActivePersonaTitle(): string {
    const active = this.psService.personas.find(p => p.id === this.psService.activePersonaId());
    return active ? active.name : 'Selected Track';
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
