import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PsDataService, ScoredProblemStatement } from '../../core/services/ps-data.service';
import { BookmarkService } from '../../core/services/bookmark.service';
import { ShareService } from '../../core/services/share.service';
import { SeoService } from '../../core/services/seo.service';
import { ProblemStatement } from '../../core/models/problem-statement.model';
import { PsCardComponent } from '../../shared/components/ps-card/ps-card.component';
import { TechBadgeComponent } from '../../shared/components/tech-badge/tech-badge.component';
import { PitchModalComponent } from '../../shared/components/pitch-modal/pitch-modal.component';
import { HighlightPipe } from '../../core/pipes/highlight.pipe';
import { TruncatePipe } from '../../core/pipes/truncate.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    FormsModule, 
    PsCardComponent, 
    TechBadgeComponent, 
    PitchModalComponent,
    HighlightPipe,
    TruncatePipe
  ],
  template: `
    <main class="container-xl py-3 py-md-4">
      <!-- Clean Hero Banner -->
      <section class="card card-evergreen p-3 p-md-4 mb-3">
        <div class="row align-items-center g-3">
          <div class="col-lg-9">
            <span class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1 mb-2 fw-semibold" style="font-size: 0.75rem;">
              Smart India Hackathon 2026
            </span>
            <h1 class="fs-3 fs-md-2 fw-bold text-main mb-2">
              Problem Statement Navigator & Architecture Hub
            </h1>
            <p class="text-muted small mb-3" style="max-width: 720px;">
              Filter, search, and sort all 229 official SIH 2026 problem statements with practical full-stack architectures, AI models, and presentation slide templates.
            </p>

            <!-- Quick Stats -->
            <div class="d-flex flex-wrap gap-2 gap-md-3 small text-muted">
              <span><strong>{{ stats.total }}</strong> Total Challenges</span>
              <span>•</span>
              <span><strong>{{ stats.softwareCount }}</strong> Software</span>
              <span>•</span>
              <span><strong>{{ stats.hardwareCount }}</strong> Hardware</span>
              <span>•</span>
              <span><strong>{{ stats.ministriesCount }}</strong> Ministries & Agencies</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Step 1: Skill Focus Filter Pills -->
      <section class="mb-3">
        <div class="d-flex align-items-center justify-content-between mb-2">
          <span class="text-muted small fw-bold text-uppercase" style="font-size: 0.75rem;">Filter by Primary Track:</span>
          @if (psService.activePersonaId()) {
            <button class="btn btn-sm btn-link text-decoration-none text-muted p-0" style="font-size: 0.8rem;" (click)="selectPersona(null)">
              Show All 229 Challenges
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
              <i class="bi bi-window-stack"></i> Full-Stack Web & Mobile
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

        <!-- Filter, Sort & View Controls Bar -->
        <div class="card card-evergreen p-2 p-md-3 mt-2 mb-3">
          <div class="row g-2 align-items-center">
            <!-- Search -->
            <div class="col-12 col-md-4">
              <div class="input-group input-group-sm">
                <span class="input-group-text bg-card border-end-0 border-subtle">
                  <i class="bi bi-search text-muted"></i>
                </span>
                <input 
                  type="text" 
                  class="form-control border-start-0 input-evergreen shadow-none" 
                  placeholder="Filter by keyword, ID, ministry, tech..."
                  [ngModel]="psService.filterState().searchQuery"
                  (ngModelChange)="psService.setSearchQuery($event); currentPage.set(1)"
                />
              </div>
            </div>

            <!-- Category Filter -->
            <div class="col-6 col-md-2">
              <select 
                class="form-select form-select-sm select-evergreen"
                [ngModel]="psService.filterState().category"
                (ngModelChange)="psService.setCategory($event); currentPage.set(1)"
              >
                <option value="All">All Categories</option>
                <option value="Software">Software Only</option>
                <option value="Hardware">Hardware Only</option>
              </select>
            </div>

            <!-- Theme Filter -->
            <div class="col-6 col-md-2">
              <select 
                class="form-select form-select-sm select-evergreen"
                [ngModel]="psService.filterState().theme"
                (ngModelChange)="psService.setTheme($event); currentPage.set(1)"
              >
                <option value="All">All Themes ({{ themes.length }})</option>
                @for (theme of themes; track theme) {
                  <option [value]="theme">{{ theme }}</option>
                }
              </select>
            </div>

            <!-- Sort By -->
            <div class="col-6 col-md-2">
              <select 
                class="form-select form-select-sm select-evergreen"
                [ngModel]="psService.filterState().sortBy"
                (ngModelChange)="psService.setSortBy($event)"
              >
                <option value="relevance">Sort: Top Match</option>
                <option value="psNumber">Sort: PS Number</option>
                <option value="title">Sort: Title (A-Z)</option>
                <option value="ministry">Sort: Ministry</option>
                <option value="category">Sort: Category</option>
                <option value="theme">Sort: Theme</option>
                <option value="rank">Sort: Curated Rank</option>
              </select>
            </div>

            <!-- Card View vs Table View Toggle Group -->
            <div class="col-6 col-md-2 text-end">
              <div class="view-mode-group">
                <button 
                  type="button" 
                  class="view-mode-btn" 
                  [class.active]="viewMode() === 'card'"
                  (click)="viewMode.set('card')"
                  title="Card Grid View"
                  aria-label="Card View"
                >
                  <i class="bi bi-grid-fill"></i>
                  <span class="d-none d-sm-inline">Cards</span>
                </button>
                <button 
                  type="button" 
                  class="view-mode-btn" 
                  [class.active]="viewMode() === 'table'"
                  (click)="viewMode.set('table')"
                  title="Compact Table View"
                  aria-label="Table View"
                >
                  <i class="bi bi-table"></i>
                  <span class="d-none d-sm-inline">Table</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Top 10 Spotlight (When Track Selected & Card View) -->
      @if (psService.activePersonaId() && viewMode() === 'card') {
        <section class="mb-4">
          <div class="d-flex align-items-center gap-2 mb-3">
            <span class="badge bg-primary px-2 py-1" style="font-size: 0.75rem;">Top 10 Spotlight</span>
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

      <!-- Main Directory Section -->
      <section>
        <!-- Results count & Page size selector -->
        <div class="d-flex align-items-center justify-content-between mb-2 flex-wrap gap-2">
          <span class="text-muted small">
            Showing <strong>{{ getShowingRange() }}</strong> of <strong>{{ psService.filteredStatements().length }}</strong> challenges
          </span>

          <div class="d-flex align-items-center gap-2">
            <label class="text-muted small d-none d-sm-inline">Per Page:</label>
            <select 
              class="form-select form-select-sm select-evergreen py-0 px-2" 
              style="width: auto; height: 28px; font-size: 0.8rem;"
              [ngModel]="pageSize()"
              (ngModelChange)="onPageSizeChange($event)"
            >
              <option [value]="12">12 per page</option>
              <option [value]="25">25 per page</option>
              <option [value]="50">50 per page</option>
              <option [value]="100">100 per page</option>
              <option [value]="229">Show All (229)</option>
            </select>
          </div>
        </div>

        @if (psService.filteredStatements().length > 0) {
          <!-- 1. CARD VIEW -->
          @if (viewMode() === 'card') {
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
          }

          <!-- 2. OPTIMIZED TABLE VIEW -->
          @if (viewMode() === 'table') {
            <div class="table-evergreen-wrapper">
              <div class="table-scroll-container">
                <table class="table-evergreen align-middle">
                  <thead>
                    <tr>
                      <th class="sortable col-ps-id" [class.sorted-active]="psService.filterState().sortBy === 'psNumber'" (click)="setSort('psNumber')">
                        PS ID <i class="bi" [ngClass]="psService.filterState().sortBy === 'psNumber' ? 'bi-arrow-down-short' : 'bi-arrow-down-up opacity-50'"></i>
                      </th>
                      <th class="sortable col-title" [class.sorted-active]="psService.filterState().sortBy === 'title'" (click)="setSort('title')">
                        Challenge Title <i class="bi" [ngClass]="psService.filterState().sortBy === 'title' ? 'bi-arrow-down-short' : 'bi-arrow-down-up opacity-50'"></i>
                      </th>
                      <th class="sortable col-category" [class.sorted-active]="psService.filterState().sortBy === 'category'" (click)="setSort('category')">
                        Category <i class="bi" [ngClass]="psService.filterState().sortBy === 'category' ? 'bi-arrow-down-short' : 'bi-arrow-down-up opacity-50'"></i>
                      </th>
                      <th class="sortable col-theme" [class.sorted-active]="psService.filterState().sortBy === 'theme'" (click)="setSort('theme')">
                        Theme <i class="bi" [ngClass]="psService.filterState().sortBy === 'theme' ? 'bi-arrow-down-short' : 'bi-arrow-down-up opacity-50'"></i>
                      </th>
                      <th class="sortable col-ministry" [class.sorted-active]="psService.filterState().sortBy === 'ministry'" (click)="setSort('ministry')">
                        Organization / Ministry <i class="bi" [ngClass]="psService.filterState().sortBy === 'ministry' ? 'bi-arrow-down-short' : 'bi-arrow-down-up opacity-50'"></i>
                      </th>
                      <th class="col-skills">Core Technologies</th>
                      <th class="col-actions" style="text-align: right;">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (ps of paginatedStatements(); track ps.ps_number) {
                      <tr>
                        <!-- PS Number -->
                        <td class="col-ps-id">
                          <div class="d-flex align-items-center gap-1">
                            <span class="ps-number-pill">{{ ps.ps_number }}</span>
                            @if (ps.rank && ps.rank <= 10) {
                              <span class="badge bg-warning text-dark fw-bold" style="font-size: 0.65rem;">#{{ ps.rank }}</span>
                            }
                          </div>
                        </td>

                        <!-- Title -->
                        <td class="col-title">
                          <a [routerLink]="['/ps', ps.ps_number]" class="text-main fw-semibold text-decoration-none table-title-link d-block" [innerHTML]="ps.title | highlight:psService.filterState().searchQuery"></a>
                          <div class="text-muted small mt-1 d-md-none">{{ ps.org | truncate:32 }}</div>
                        </td>

                        <!-- Category -->
                        <td class="col-category">
                          <span class="badge" [ngClass]="ps.category === 'Hardware' ? 'bg-warning text-dark' : 'bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25'" style="font-size: 0.725rem;">
                            {{ ps.category }}
                          </span>
                        </td>

                        <!-- Theme -->
                        <td class="col-theme small text-muted">
                          <span class="d-inline-block text-truncate" style="max-width: 150px;" title="{{ ps.theme }}">
                            {{ ps.theme }}
                          </span>
                        </td>

                        <!-- Ministry -->
                        <td class="col-ministry small text-muted">
                          <span class="d-inline-block text-truncate" style="max-width: 170px;" title="{{ ps.org }}">
                            {{ ps.org }}
                          </span>
                        </td>

                        <!-- Tech Stack Tags -->
                        <td class="col-skills">
                          <div class="d-flex flex-wrap gap-1">
                            @for (tech of ps.skills.slice(0, 3); track tech) {
                              <app-tech-badge [tech]="tech"></app-tech-badge>
                            }
                            @if (ps.skills.length > 3) {
                              <span class="text-muted small" style="font-size: 0.7rem;">+{{ ps.skills.length - 3 }}</span>
                            }
                          </div>
                        </td>

                        <!-- Actions -->
                        <td class="col-actions" style="text-align: right;">
                          <div class="d-inline-flex align-items-center gap-1">
                            <button 
                              class="btn btn-sm btn-outline-secondary p-1 px-2"
                              (click)="shareProblem(ps)"
                              title="Share challenge"
                              style="font-size: 0.75rem;"
                            >
                              <i class="bi bi-share"></i>
                            </button>
                            <button 
                              class="btn btn-sm btn-outline-secondary p-1 px-2"
                              (click)="bookmarkService.toggleBookmark(ps.ps_number)"
                              [title]="bookmarkService.isBookmarked(ps.ps_number) ? 'Remove bookmark' : 'Bookmark'"
                              style="font-size: 0.75rem;"
                            >
                              <i class="bi" [ngClass]="bookmarkService.isBookmarked(ps.ps_number) ? 'bi-bookmark-fill text-warning' : 'bi-bookmark'"></i>
                            </button>
                            <button 
                              class="btn btn-sm btn-outline-secondary p-1 px-2"
                              (click)="selectedPitchPs.set(ps)"
                              title="6-Slide Pitch Deck"
                              style="font-size: 0.75rem;"
                            >
                              <i class="bi bi-file-earmark-text"></i>
                            </button>
                            <a [routerLink]="['/ps', ps.ps_number]" class="btn btn-sm btn-primary p-1 px-2" style="font-size: 0.75rem; font-weight: 600;">
                              View
                            </a>
                          </div>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }

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

    .ps-number-pill {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.725rem;
      font-weight: 600;
      color: var(--primary);
      background: var(--bg-subtle);
      border: 1px solid var(--border);
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
    }

    .table-title-link {
      line-height: 1.4;
      &:hover {
        color: var(--primary) !important;
        text-decoration: underline;
      }
    }

    /* Column Widths */
    .col-ps-id { width: 115px; min-width: 115px; }
    .col-title { min-width: 260px; }
    .col-category { width: 95px; min-width: 95px; }
    .col-theme { width: 150px; min-width: 150px; }
    .col-ministry { width: 170px; min-width: 170px; }
    .col-skills { width: 190px; min-width: 190px; }
    .col-actions { width: 135px; min-width: 135px; }
  `]
})
export class HomeComponent implements OnInit {
  psService = inject(PsDataService);
  bookmarkService = inject(BookmarkService);
  shareService = inject(ShareService);
  private seoService = inject(SeoService);
  private route = inject(ActivatedRoute);

  stats = this.psService.getStatistics();
  themes = this.psService.getAllThemes();
  selectedPitchPs = signal<ProblemStatement | null>(null);

  viewMode = signal<'card' | 'table'>('card');
  currentPage = signal(1);
  pageSize = signal(12);

  ngOnInit(): void {
    this.seoService.setGeneralSeo(
      'SIH 2026 Problem Statement Navigator',
      'Discover problem statements for Full Stack Web, AI/ML, and ECE with practical architectures, tools, and presentation slides.',
      ['Smart India Hackathon 2026', 'Full Stack Hackathon', 'AI ML Projects', 'SIH PS List'],
      '/'
    );

    const initialView = this.route.snapshot.queryParamMap.get('view');
    if (initialView === 'table') {
      this.viewMode.set('table');
    }
    const initialPersona = this.route.snapshot.queryParamMap.get('persona');
    if (initialPersona) {
      this.selectPersona(initialPersona);
    }

    this.route.queryParams.subscribe(params => {
      if (params['persona'] !== undefined) {
        this.selectPersona(params['persona'] || null);
      }
      if (params['view']) {
        this.viewMode.set(params['view'] === 'table' ? 'table' : 'card');
      }
    });
  }

  selectPersona(id: string | null): void {
    this.psService.setActivePersona(id);
    this.currentPage.set(1);
  }

  setSort(field: any): void {
    this.psService.setSortBy(field);
  }

  onPageSizeChange(newSize: number): void {
    this.pageSize.set(Number(newSize));
    this.currentPage.set(1);
  }

  getShowingRange(): string {
    const total = this.psService.filteredStatements().length;
    if (total === 0) return '0';
    const start = (this.currentPage() - 1) * this.pageSize() + 1;
    const end = Math.min(start + this.pageSize() - 1, total);
    return `${start}–${end}`;
  }

  shareProblem(ps: ProblemStatement): void {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://sih2026.gov.in';
    this.shareService.openShare({
      title: `${ps.ps_number}: ${ps.title}`,
      text: `${ps.ps_number} (${ps.category} - ${ps.theme}): ${ps.title}`,
      url: `${origin}/ps/${ps.ps_number}`
    });
  }

  getActivePersonaTitle(): string {
    const active = this.psService.personas.find(p => p.id === this.psService.activePersonaId());
    return active ? active.name : 'Selected Track';
  }

  paginatedStatements(): ScoredProblemStatement[] {
    const list = this.psService.filteredStatements();
    const size = this.pageSize();
    const start = (this.currentPage() - 1) * size;
    return list.slice(start, start + size);
  }

  totalPages(): number {
    return Math.ceil(this.psService.filteredStatements().length / this.pageSize()) || 1;
  }
}
