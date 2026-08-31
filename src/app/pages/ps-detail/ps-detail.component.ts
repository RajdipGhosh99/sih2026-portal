import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PsDataService } from '../../core/services/ps-data.service';
import { SeoService } from '../../core/services/seo.service';
import { BookmarkService } from '../../core/services/bookmark.service';
import { ProblemStatement } from '../../core/models/problem-statement.model';
import { TechBadgeComponent } from '../../shared/components/tech-badge/tech-badge.component';
import { PitchModalComponent } from '../../shared/components/pitch-modal/pitch-modal.component';
import { PsCardComponent } from '../../shared/components/ps-card/ps-card.component';

@Component({
  selector: 'app-ps-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, TechBadgeComponent, PitchModalComponent, PsCardComponent],
  template: `
    @if (ps(); as item) {
      <div class="container-xl py-4">
        <!-- Breadcrumb -->
        <nav class="mb-3">
          <a routerLink="/" class="text-decoration-none small text-muted">
            <i class="bi bi-arrow-left me-1"></i> Back to Problem Statements
          </a>
        </nav>

        <!-- Header Card -->
        <div class="card card-evergreen p-4 mb-4">
          <div class="d-flex align-items-center gap-2 flex-wrap mb-2">
            <span class="badge bg-primary text-white font-monospace px-2 py-1">{{ item.ps_number }}</span>
            <span class="badge bg-secondary bg-opacity-25 text-secondary">{{ item.category }}</span>
            <span class="badge bg-secondary bg-opacity-25 text-secondary">{{ item.theme }}</span>
            @if (item.rank) {
              <span class="badge bg-warning text-dark fw-bold">Top {{ item.rank }} Curated</span>
            }
          </div>

          <h1 class="fs-3 fw-bold text-main mb-3">{{ item.title }}</h1>

          <div class="row g-3 small text-secondary bg-subtle p-3 rounded-3 mb-3 border border-subtle">
            <div class="col-sm-6 col-md-3">
              <span class="d-block text-muted text-uppercase" style="font-size: 0.7rem;">Organization</span>
              <strong class="text-main">{{ item.org }}</strong>
            </div>
            <div class="col-sm-6 col-md-3">
              <span class="d-block text-muted text-uppercase" style="font-size: 0.7rem;">Department</span>
              <strong class="text-main">{{ item.department || 'N/A' }}</strong>
            </div>
            <div class="col-sm-6 col-md-3">
              <span class="d-block text-muted text-uppercase" style="font-size: 0.7rem;">Category</span>
              <strong class="text-main">{{ item.category }}</strong>
            </div>
            <div class="col-sm-6 col-md-3">
              <span class="d-block text-muted text-uppercase" style="font-size: 0.7rem;">Ideas Count</span>
              <strong class="text-main">{{ item.ideas }}</strong>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="d-flex flex-wrap gap-2">
            <button class="btn btn-sm btn-primary" (click)="isPitchModalOpen.set(true)">
              <i class="bi bi-file-earmark-slides me-1"></i> View 6-Slide Pitch Deck
            </button>
            <button 
              class="btn btn-sm btn-outline-secondary" 
              [class.btn-warning]="bookmarkService.isBookmarked(item.ps_number)"
              [class.text-dark]="bookmarkService.isBookmarked(item.ps_number)"
              (click)="bookmarkService.toggleBookmark(item.ps_number)"
            >
              <i class="bi" [ngClass]="bookmarkService.isBookmarked(item.ps_number) ? 'bi-bookmark-fill' : 'bi-bookmark'"></i>
              {{ bookmarkService.isBookmarked(item.ps_number) ? 'Bookmarked' : 'Bookmark' }}
            </button>
            <button 
              class="btn btn-sm btn-outline-secondary"
              [class.btn-warning]="bookmarkService.isInCompare(item.ps_number)"
              [class.text-dark]="bookmarkService.isInCompare(item.ps_number)"
              (click)="bookmarkService.toggleCompare(item.ps_number)"
            >
              <i class="bi bi-layout-split me-1"></i>
              {{ bookmarkService.isInCompare(item.ps_number) ? 'Remove Compare' : 'Add to Compare' }}
            </button>
            @if (item.dataset_link) {
              <a [href]="item.dataset_link" target="_blank" rel="noopener" class="btn btn-sm btn-outline-info">
                <i class="bi bi-box-arrow-up-right me-1"></i> Official Dataset
              </a>
            }
          </div>
        </div>

        <!-- Main Body: Tabs or Sections -->
        <div class="row g-4">
          <!-- Left Column: Problem & Architecture -->
          <div class="col-lg-8">
            <!-- Problem Description Card -->
            <div class="card card-evergreen p-4 mb-4">
              <h2 class="fs-5 fw-bold text-main mb-3">
                <i class="bi bi-card-text text-primary me-2"></i> Problem Overview & Background
              </h2>
              <p class="text-secondary leading-relaxed mb-0" style="white-space: pre-line; line-height: 1.7;">
                {{ item.description }}
              </p>
            </div>

            <!-- Architecture & Tools Breakdown -->
            <div class="card card-evergreen p-4 mb-4">
              <h2 class="fs-5 fw-bold text-main mb-3">
                <i class="bi bi-diagram-3 text-primary me-2"></i> Recommended Architecture & Tech Stack
              </h2>

              <div class="d-flex flex-column gap-3">
                <!-- Frontend -->
                <div class="p-3 bg-subtle rounded-3 border border-subtle">
                  <div class="d-flex align-items-center justify-content-between mb-2">
                    <strong class="text-main small"><i class="bi bi-window-stack text-primary me-1"></i> Frontend & UI</strong>
                  </div>
                  <div class="d-flex flex-wrap gap-1">
                    @for (t of item.architecture.frontend; track t) {
                      <app-tech-badge [tech]="t" type="fullstack"></app-tech-badge>
                    }
                  </div>
                </div>

                <!-- Backend -->
                <div class="p-3 bg-subtle rounded-3 border border-subtle">
                  <div class="d-flex align-items-center justify-content-between mb-2">
                    <strong class="text-main small"><i class="bi bi-hdd-network text-success me-1"></i> Backend & APIs</strong>
                  </div>
                  <div class="d-flex flex-wrap gap-1">
                    @for (t of item.architecture.backend; track t) {
                      <app-tech-badge [tech]="t" type="fullstack"></app-tech-badge>
                    }
                  </div>
                </div>

                <!-- AI / ML (if applicable) -->
                @if (item.architecture.aiMl && item.architecture.aiMl.length > 0) {
                  <div class="p-3 bg-subtle rounded-3 border border-subtle">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                      <strong class="text-main small"><i class="bi bi-cpu text-indigo me-1"></i> AI / ML Models</strong>
                    </div>
                    <div class="d-flex flex-wrap gap-1">
                      @for (t of item.architecture.aiMl; track t) {
                        <app-tech-badge [tech]="t" type="ai"></app-tech-badge>
                      }
                    </div>
                  </div>
                }

                <!-- Hardware (if applicable) -->
                @if (item.architecture.hardware && item.architecture.hardware.length > 0) {
                  <div class="p-3 bg-subtle rounded-3 border border-subtle">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                      <strong class="text-main small"><i class="bi bi-motherboard text-warning me-1"></i> Embedded / Hardware</strong>
                    </div>
                    <div class="d-flex flex-wrap gap-1">
                      @for (t of item.architecture.hardware; track t) {
                        <app-tech-badge [tech]="t" type="hardware"></app-tech-badge>
                      }
                    </div>
                  </div>
                }

                <!-- Database & Cloud -->
                <div class="p-3 bg-subtle rounded-3 border border-subtle">
                  <div class="d-flex align-items-center justify-content-between mb-2">
                    <strong class="text-main small"><i class="bi bi-database text-info me-1"></i> Database & Deployment</strong>
                  </div>
                  <div class="d-flex flex-wrap gap-1">
                    @for (t of item.architecture.database; track t) {
                      <app-tech-badge [tech]="t" type="emerald"></app-tech-badge>
                    }
                    @for (t of item.architecture.cloudDevOps; track t) {
                      <app-tech-badge [tech]="t"></app-tech-badge>
                    }
                  </div>
                </div>
              </div>
            </div>

            <!-- Solution Angles & Ideas -->
            <div class="card card-evergreen p-4 mb-4">
              <h2 class="fs-5 fw-bold text-main mb-3">
                <i class="bi bi-lightbulb text-warning me-2"></i> Practical Solution Concepts
              </h2>

              <div class="d-flex flex-column gap-3">
                @for (sol of item.solutionIdeas; track sol.title) {
                  <div class="p-3 bg-subtle rounded-3 border border-subtle">
                    <h5 class="fs-6 fw-bold text-main mb-1">{{ sol.title }}</h5>
                    <p class="text-secondary small mb-2">{{ sol.description }}</p>
                    <div class="small text-muted">
                      <strong>Differentiator:</strong> {{ sol.usp }}
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- Right Column: Pitch Deck & Deliverables -->
          <div class="col-lg-4">
            <!-- 6-Slide Pitch Structure Summary -->
            <div class="card card-evergreen p-3 mb-4">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <strong class="text-main small"><i class="bi bi-easel text-primary me-1"></i> Pitch Deck Outline</strong>
                <button class="btn btn-sm btn-link text-decoration-none text-primary p-0" (click)="copyPitchMarkdown(item)">
                  {{ copiedPitch() ? '✓ Copied' : 'Copy All' }}
                </button>
              </div>

              <div class="d-flex flex-column gap-2 small">
                @for (s of item.pitchDeck; track s.slideNumber) {
                  <div class="p-2 bg-subtle rounded border border-subtle">
                    <span class="text-muted fw-bold" style="font-size: 0.7rem;">SLIDE {{ s.slideNumber }}</span>
                    <strong class="d-block text-main">{{ s.slideTitle }}</strong>
                    <span class="text-secondary" style="font-size: 0.75rem;">{{ s.heading }}</span>
                  </div>
                }
              </div>
            </div>

            <!-- Key Challenges -->
            <div class="card card-evergreen p-3 mb-4">
              <strong class="text-main small mb-2 d-block"><i class="bi bi-exclamation-triangle text-warning me-1"></i> Critical Challenges</strong>
              <ul class="text-secondary small ps-3 mb-0 d-flex flex-column gap-1">
                @for (ch of item.keyChallenges; track ch) {
                  <li>{{ ch }}</li>
                }
              </ul>
            </div>

            <!-- Expected Deliverables -->
            <div class="card card-evergreen p-3 mb-4">
              <strong class="text-main small mb-2 d-block"><i class="bi bi-check-circle text-success me-1"></i> Expected Deliverables</strong>
              <ul class="text-secondary small ps-3 mb-0 d-flex flex-column gap-1">
                @for (del of item.expectedDeliverables; track del) {
                  <li>{{ del }}</li>
                }
              </ul>
            </div>
          </div>
        </div>

        <!-- Related Problem Statements -->
        @if (similarStatements().length > 0) {
          <section class="mt-4">
            <h3 class="fs-5 fw-bold text-main mb-3">Related Problem Statements</h3>
            <div class="row row-cols-1 row-cols-md-3 g-3">
              @for (sim of similarStatements(); track sim.ps_number) {
                <div class="col">
                  <app-ps-card [ps]="sim"></app-ps-card>
                </div>
              }
            </div>
          </section>
        }

        <!-- Pitch Modal -->
        <app-pitch-modal 
          [ps]="ps()"
          [isOpen]="isPitchModalOpen()"
          (close)="isPitchModalOpen.set(false)"
        ></app-pitch-modal>
      </div>
    }
  `,
  styles: [`
    .text-main { color: var(--text-primary); }
    .bg-subtle { background-color: var(--bg-surface-subtle) !important; }
    .border-subtle { border-color: var(--border-color) !important; }
    .text-indigo { color: var(--accent-indigo); }
  `]
})
export class PsDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private psService = inject(PsDataService);
  private seoService = inject(SeoService);
  bookmarkService = inject(BookmarkService);

  ps = signal<ProblemStatement | null>(null);
  similarStatements = signal<ProblemStatement[]>([]);
  isPitchModalOpen = signal(false);
  copiedPitch = signal(false);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        const item = this.psService.getProblemStatementById(id);
        if (item) {
          this.ps.set(item);
          this.seoService.setProblemStatementSeo(item);
          this.similarStatements.set(this.psService.getSimilarProblemStatements(item));
        } else {
          this.ps.set(null);
        }
      }
    });
  }

  copyPitchMarkdown(ps: ProblemStatement): void {
    let md = `# SIH 2026 Pitch Deck Outline: ${ps.ps_number} - ${ps.title}

`;
    ps.pitchDeck.forEach(s => {
      md += `## Slide ${s.slideNumber}: ${s.slideTitle}
### ${s.heading}
`;
      s.bulletPoints.forEach(b => md += `- ${b}
`);
      if (s.callout) md += `> **Key Focus**: ${s.callout}
`;
      md += `
`;
    });

    navigator.clipboard.writeText(md).then(() => {
      this.copiedPitch.set(true);
      setTimeout(() => this.copiedPitch.set(false), 2500);
    });
  }
}
