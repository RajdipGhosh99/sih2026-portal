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
    <div class="container-xl py-4">
      <!-- Simple Clean Hero -->
      <section class="mb-4">
        <div class="p-4 p-md-5 rounded-4 hero-banner">
          <div class="row align-items-center">
            <div class="col-lg-8">
              <span class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-1 rounded-pill mb-3 fw-semibold">
                Smart India Hackathon 2026 Explorer
              </span>
              <h1 class="fw-bold tracking-tight text-title mb-2 fs-2 fs-md-1">
                Find the Right Problem Statement for Your Stack
              </h1>
              <p class="text-secondary fs-6 mb-4" style="max-width: 620px;">
                Explore all 229 SIH 2026 problem statements with practical full-stack architectures, AI models, and presentation slide templates.
              </p>
              
              <!-- Quick Stats -->
              <div class="d-flex flex-wrap gap-3 small text-muted">
                <span class="d-flex align-items-center gap-1">
                  <i class="bi bi-collection-fill text-primary"></i> <strong>{{ stats.total }}</strong> Challenges
                </span>
                <span class="d-flex align-items-center gap-1">
                  <i class="bi bi-window-stack text-success"></i> <strong>{{ stats.softwareCount }}</strong> Software
                </span>
                <span class="d-flex align-items-center gap-1">
                  <i class="bi bi-motherboard text-warning"></i> <strong>{{ stats.hardwareCount }}</strong> Hardware
                </span>
                <span class="d-flex align-items-center gap-1">
                  <i class="bi bi-building text-info"></i> <strong>{{ stats.ministriesCount }}</strong> Ministries
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Step 1: Simple Skillset Focus Filter Pills -->
      <section class="mb-4">
        <div class="d-flex flex-column gap-2 mb-3">
          <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <span class="text-muted small fw-bold text-uppercase">Filter by Primary Skillset / Track:</span>
            @if (psService.activePersonaId()) {
              <button class="btn btn-sm btn-link text-decoration-none text-muted p-0" (click)="selectPersona(null)">
                Show All Problem Statements
              </button>
            }
          </div>

          <div class="d-flex flex-wrap gap-2">
            <button 
              class="filter-pill" 
              [class.active]="psService.activePersonaId() === null"
              (click)="selectPersona(null)"
            >
              All Tracks ({{ stats.total }})
            </button>
            <button 
              class="filter-pill" 
              [class.active]="psService.activePersonaId() === 'full-stack'"
              (click)="selectPersona('full-stack')"
            >
              💻 Full-Stack Development
            </button>
            <button 
              class="filter-pill" 
              [class.active]="psService.activePersonaId() === 'ai-ml'"
              (click)="selectPersona('ai-ml')"
            >
              🧠 AI & Machine Learning
            </button>
            <button 
              class="filter-pill" 
              [class.active]="psService.activePersonaId() === 'cybersecurity'"
              (click)="selectPersona('cybersecurity')"
            >
              🛡️ Cybersecurity & Forensics
            </button>
            <button 
              class="filter-pill" 
              [class.active]="psService.activePersonaId() === 'ece-embedded'"
              (click)="selectPersona('ece-embedded')"
            >
              ⚡ Hardware & Embedded (ECE)
            </button>
          </div>
        </div>

        <!-- Simple Search & Secondary Filters Bar -->
        <div class="card p-3 filter-bar mb-4">
          <div class="row g-2 align-items-center">
            <!-- Search -->
            <div class="col-md-5">
              <div class="input-group input-group-sm">
                <span class="input-group-text bg-subtle border-subtle text-muted">
                  <i class="bi bi-search"></i>
                </span>
                <input 
                  type="text" 
                  class="form-control form-control-sm bg-subtle border-subtle text-title shadow-none" 
                  placeholder="Filter by keyword, title, or ministry..."
                  [ngModel]="psService.filterState().searchQuery"
                  (ngModelChange)="psService.setSearchQuery($event)"
                />
              </div>
            </div>

            <!-- Category Filter -->
            <div class="col-6 col-md-2">
              <select 
                class="form-select form-select-sm bg-subtle border-subtle text-title"
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
                class="form-select form-select-sm bg-subtle border-subtle text-title"
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
            <div class="col-md-2">
              <select 
                class="form-select form-select-sm bg-subtle border-subtle text-title"
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

      <!-- Top 10 Spotlight (When track is selected) -->
      @if (psService.activePersonaId()) {
        <section class="mb-4">
          <div class="d-flex align-items-center gap-2 mb-3">
            <span class="badge bg-primary px-2 py-1">Top 10 Spotlight</span>
            <h2 class="fs-5 fw-bold text-title m-0">Recommended for {{ getActivePersonaTitle() }}</h2>
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

      <!-- Main Results Directory -->
      <section>
        <div class="d-flex align-items-center justify-content-between mb-3">
          <div class="text-secondary small">
            Showing <strong>{{ psService.filteredStatements().length }}</strong> results
          </div>
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

          <!-- Pagination -->
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
          <div class="card p-5 text-center bg-subtle border-subtle">
            <i class="bi bi-search fs-1 text-muted mb-2"></i>
            <h5 class="fw-bold text-title">No matching problem statements found</h5>
            <p class="text-secondary small mb-3">Try clearing search keywords or selecting 'All Tracks'.</p>
            <div>
              <button class="btn btn-sm btn-primary" (click)="psService.resetFilters()">Reset Filters</button>
            </div>
          </div>
        }
      </section>

      <!-- Pitch Modal -->
      <app-pitch-modal 
        [ps]="selectedPitchPs()"
        [isOpen]="!!selectedPitchPs()"
        (close)="selectedPitchPs.set(null)"
      ></app-pitch-modal>
    </div>
  `,
  styles: [`
    .hero-banner {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      box-shadow: var(--card-shadow);
    }

    .text-title {
      color: var(--text-primary);
    }

    .filter-bar {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 10px;
    }

    .bg-subtle {
      background-color: var(--bg-surface-subtle) !important;
    }

    .border-subtle {
      border-color: var(--border-color) !important;
    }
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
      'SIH 2026 Problem Statements & Project Navigator',
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
