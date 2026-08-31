import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PsDataService } from '../../core/services/ps-data.service';
import { SeoService } from '../../core/services/seo.service';
import { BookmarkService } from '../../core/services/bookmark.service';
import { ShareService } from '../../core/services/share.service';
import { ProblemStatement } from '../../core/models/problem-statement.model';
import { TechBadgeComponent } from '../../shared/components/tech-badge/tech-badge.component';
import { PitchModalComponent } from '../../shared/components/pitch-modal/pitch-modal.component';
import { PsCardComponent } from '../../shared/components/ps-card/ps-card.component';

export type DetailTab = 'overview' | 'architecture' | 'solutions' | 'pitch';

@Component({
  selector: 'app-ps-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, TechBadgeComponent, PitchModalComponent, PsCardComponent],
  template: `
    @if (ps(); as item) {
      <main class="container-xl py-4">
        <!-- Breadcrumb & Top Share Bar -->
        <div class="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
          <nav>
            <a routerLink="/" class="text-decoration-none small text-muted">
              <i class="bi bi-arrow-left me-1"></i> Back to Problem Statements
            </a>
          </nav>

          <!-- Quick Share Page Button -->
          <button class="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1" (click)="shareProblem(item)">
            <i class="bi bi-share-fill text-primary"></i>
            <span>Share Problem Statement</span>
          </button>
        </div>

        <!-- Header Card -->
        <div class="card card-evergreen p-3 p-md-4 mb-4">
          <div class="d-flex align-items-center gap-2 flex-wrap mb-2">
            <span class="badge bg-primary text-white font-monospace px-2 py-1">{{ item.ps_number }}</span>
            <span class="badge bg-secondary bg-opacity-25 text-secondary">{{ item.category }}</span>
            <span class="badge bg-secondary bg-opacity-25 text-secondary">{{ item.theme }}</span>
            @if (item.rank) {
              <span class="badge bg-warning text-dark fw-bold">Top {{ item.rank }} Curated</span>
            }
          </div>

          <h1 class="fs-3 fw-bold text-main mb-3">{{ item.title }}</h1>

          <div class="row g-3 small text-secondary bg-subtle p-3 rounded mb-3 border border-subtle">
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
            <button class="btn btn-sm btn-outline-secondary" (click)="shareProblem(item)">
              <i class="bi bi-share me-1"></i> Share
            </button>
            @if (item.dataset_link) {
              <a [href]="item.dataset_link" target="_blank" rel="noopener" class="btn btn-sm btn-outline-info">
                <i class="bi bi-box-arrow-up-right me-1"></i> Official Dataset
              </a>
            }
          </div>
        </div>

        <!-- Tab Navigation with Tab-Sharing -->
        <div class="d-flex align-items-center justify-content-between border-bottom border-subtle mb-4 pb-1 flex-wrap gap-2">
          <div class="d-flex gap-1 overflow-auto">
            <button 
              class="tab-btn" 
              [class.active]="activeTab() === 'overview'"
              (click)="selectTab('overview')"
            >
              <i class="bi bi-card-text me-1"></i> Overview & Challenges
            </button>
            <button 
              class="tab-btn" 
              [class.active]="activeTab() === 'architecture'"
              (click)="selectTab('architecture')"
            >
              <i class="bi bi-diagram-3 me-1"></i> Architecture & Stack
            </button>
            <button 
              class="tab-btn" 
              [class.active]="activeTab() === 'solutions'"
              (click)="selectTab('solutions')"
            >
              <i class="bi bi-lightbulb me-1"></i> Solution Concepts
            </button>
            <button 
              class="tab-btn" 
              [class.active]="activeTab() === 'pitch'"
              (click)="selectTab('pitch')"
            >
              <i class="bi bi-easel me-1"></i> 6-Slide Pitch Outline
            </button>
          </div>

          <!-- Share Specific Tab Link Button -->
          <button 
            class="btn btn-sm btn-outline-secondary py-1 px-2 d-flex align-items-center gap-1"
            style="font-size: 0.8rem;"
            (click)="shareActiveTab(item)"
            title="Share direct link to this specific tab"
          >
            <i class="bi bi-link-45deg"></i> Share This Tab
          </button>
        </div>

        <!-- TAB 1: OVERVIEW -->
        @if (activeTab() === 'overview') {
          <div class="row g-4">
            <div class="col-lg-8">
              <div class="card card-evergreen p-4 mb-4">
                <h2 class="fs-5 fw-bold text-main mb-3">
                  <i class="bi bi-card-text text-primary me-2"></i> Problem Background
                </h2>
                <p class="text-muted leading-relaxed mb-0" style="white-space: pre-line; line-height: 1.7;">
                  {{ item.description }}
                </p>
              </div>

              <!-- Deliverables -->
              <div class="card card-evergreen p-4">
                <h2 class="fs-5 fw-bold text-main mb-3">
                  <i class="bi bi-check-circle text-success me-2"></i> Expected SIH Deliverables
                </h2>
                <ul class="text-muted mb-0 ps-3 d-flex flex-column gap-2">
                  @for (del of item.expectedDeliverables; track del) {
                    <li>{{ del }}</li>
                  }
                </ul>
              </div>
            </div>

            <div class="col-lg-4">
              <!-- Key Challenges -->
              <div class="card card-evergreen p-3 mb-4">
                <strong class="text-main small mb-2 d-block"><i class="bi bi-exclamation-triangle text-warning me-1"></i> Key Challenges</strong>
                <ul class="text-muted small ps-3 mb-0 d-flex flex-column gap-1">
                  @for (ch of item.keyChallenges; track ch) {
                    <li>{{ ch }}</li>
                  }
                </ul>
              </div>

              <!-- Quick Meta Box -->
              <div class="card card-evergreen p-3">
                <strong class="text-main small mb-2 d-block"><i class="bi bi-tag text-primary me-1"></i> Target Skillsets</strong>
                <div class="d-flex flex-wrap gap-1">
                  @for (sk of item.skills; track sk) {
                    <app-tech-badge [tech]="sk"></app-tech-badge>
                  }
                </div>
              </div>
            </div>
          </div>
        }

        <!-- TAB 2: ARCHITECTURE & TECH STACK -->
        @if (activeTab() === 'architecture') {
          <div class="row g-4">
            <div class="col-lg-8">
              <div class="card card-evergreen p-4">
                <div class="d-flex align-items-center justify-content-between mb-3">
                  <h2 class="fs-5 fw-bold text-main m-0">
                    <i class="bi bi-diagram-3 text-primary me-2"></i> System Architecture Blueprint
                  </h2>
                  <button class="btn btn-sm btn-link text-primary p-0 text-decoration-none" (click)="shareActiveTab(item)">
                    <i class="bi bi-share me-1"></i> Share Stack
                  </button>
                </div>

                <div class="d-flex flex-column gap-3">
                  <!-- Frontend -->
                  <div class="p-3 bg-subtle rounded border border-subtle">
                    <strong class="text-main small d-block mb-2"><i class="bi bi-window-stack text-primary me-1"></i> Client / Frontend</strong>
                    <div class="d-flex flex-wrap gap-1">
                      @for (t of item.architecture.frontend; track t) {
                        <app-tech-badge [tech]="t" type="fullstack"></app-tech-badge>
                      }
                    </div>
                  </div>

                  <!-- Backend -->
                  <div class="p-3 bg-subtle rounded border border-subtle">
                    <strong class="text-main small d-block mb-2"><i class="bi bi-hdd-network text-success me-1"></i> Backend & APIs</strong>
                    <div class="d-flex flex-wrap gap-1">
                      @for (t of item.architecture.backend; track t) {
                        <app-tech-badge [tech]="t" type="fullstack"></app-tech-badge>
                      }
                    </div>
                  </div>

                  <!-- AI / ML -->
                  @if (item.architecture.aiMl && item.architecture.aiMl.length > 0) {
                    <div class="p-3 bg-subtle rounded border border-subtle">
                      <strong class="text-main small d-block mb-2"><i class="bi bi-cpu text-indigo me-1"></i> AI / ML Models</strong>
                      <div class="d-flex flex-wrap gap-1">
                        @for (t of item.architecture.aiMl; track t) {
                          <app-tech-badge [tech]="t" type="ai"></app-tech-badge>
                        }
                      </div>
                    </div>
                  }

                  <!-- Hardware -->
                  @if (item.architecture.hardware && item.architecture.hardware.length > 0) {
                    <div class="p-3 bg-subtle rounded border border-subtle">
                      <strong class="text-main small d-block mb-2"><i class="bi bi-motherboard text-warning me-1"></i> Embedded Hardware</strong>
                      <div class="d-flex flex-wrap gap-1">
                        @for (t of item.architecture.hardware; track t) {
                          <app-tech-badge [tech]="t" type="hardware"></app-tech-badge>
                        }
                      </div>
                    </div>
                  }

                  <!-- Database & Cloud -->
                  <div class="p-3 bg-subtle rounded border border-subtle">
                    <strong class="text-main small d-block mb-2"><i class="bi bi-database text-info me-1"></i> Database & Deployment</strong>
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
            </div>

            <div class="col-lg-4">
              <div class="card card-evergreen p-3">
                <strong class="text-main small mb-2 d-block">Recommended Architecture Note</strong>
                <p class="text-muted small mb-0">
                  Designed for high judge evaluation scoring: modular microservices, responsive web clients, robust database indexing, and containerized Docker deployments.
                </p>
              </div>
            </div>
          </div>
        }

        <!-- TAB 3: SOLUTION CONCEPTS -->
        @if (activeTab() === 'solutions') {
          <div class="card card-evergreen p-4">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <h2 class="fs-5 fw-bold text-main m-0">
                <i class="bi bi-lightbulb text-warning me-2"></i> Solution Concepts & Differentiators
              </h2>
              <button class="btn btn-sm btn-link text-primary p-0 text-decoration-none" (click)="shareActiveTab(item)">
                <i class="bi bi-share me-1"></i> Share Concepts
              </button>
            </div>

            <div class="d-flex flex-column gap-3">
              @for (sol of item.solutionIdeas; track sol.title) {
                <div class="p-3 bg-subtle rounded border border-subtle">
                  <h5 class="fs-6 fw-bold text-main mb-1">{{ sol.title }}</h5>
                  <p class="text-muted small mb-2">{{ sol.description }}</p>
                  <div class="small text-muted">
                    <strong class="text-main">Judge Value Hook:</strong> {{ sol.usp }}
                  </div>
                </div>
              }
            </div>
          </div>
        }

        <!-- TAB 4: PITCH DECK OUTLINE -->
        @if (activeTab() === 'pitch') {
          <div class="card card-evergreen p-4">
            <div class="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
              <div>
                <h2 class="fs-5 fw-bold text-main m-0">
                  <i class="bi bi-easel text-primary me-2"></i> 6-Slide Pitch Presentation Structure
                </h2>
                <span class="text-muted small">Standard mandatory format for SIH evaluation submissions</span>
              </div>
              <div class="d-flex gap-2">
                <button class="btn btn-sm btn-outline-secondary" (click)="shareActiveTab(item)">
                  <i class="bi bi-share me-1"></i> Share Deck
                </button>
                <button class="btn btn-sm btn-primary" (click)="copyPitchMarkdown(item)">
                  {{ copiedPitch() ? '✓ Copied Markdown' : 'Copy All Slides' }}
                </button>
              </div>
            </div>

            <div class="row row-cols-1 row-cols-md-2 g-3">
              @for (s of item.pitchDeck; track s.slideNumber) {
                <div class="col">
                  <div class="p-3 bg-subtle rounded border border-subtle h-100 d-flex flex-column justify-content-between">
                    <div>
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge bg-primary text-white font-monospace" style="font-size: 0.7rem;">SLIDE {{ s.slideNumber }}</span>
                        <span class="text-muted small">{{ s.slideTitle }}</span>
                      </div>
                      <h5 class="fs-6 fw-bold text-main mb-2">{{ s.heading }}</h5>
                      <ul class="text-muted small ps-3 mb-2">
                        @for (b of s.bulletPoints; track $index) {
                          <li class="mb-1">{{ b }}</li>
                        }
                      </ul>
                    </div>
                    @if (s.callout) {
                      <div class="p-2 bg-card rounded border border-subtle small text-muted">
                        <strong>Judge Impact:</strong> {{ s.callout }}
                      </div>
                    }
                  </div>
                </div>
              }
            </div>
          </div>
        }

                <!-- SEO & AI Question-Answer Rich Accordion Section -->
        <section class="mt-5 pt-4 border-top border-subtle" itemscope itemtype="https://schema.org/FAQPage">
          <div class="d-flex align-items-center gap-2 mb-3">
            <span class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1" style="font-size: 0.75rem;">
              SIH 2026 Evaluation FAQ
            </span>
            <h3 class="fs-5 fw-bold text-main m-0">Frequently Asked Questions: {{ item.ps_number }}</h3>
          </div>

          <div class="d-flex flex-column gap-3">
            <div class="card card-evergreen p-3" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
              <h4 class="fs-6 fw-bold text-main mb-2" itemprop="name">
                <i class="bi bi-question-circle text-primary me-2"></i> What is the objective of {{ item.ps_number }}?
              </h4>
              <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                <p class="text-muted small mb-0" itemprop="text">
                  <strong>{{ item.title }}</strong> is a <strong>{{ item.category }}</strong> challenge by <strong>{{ item.org }}</strong> under the <strong>{{ item.theme }}</strong> theme. The goal is to develop a production-ready, scalable prototype addressing {{ item.description }}.
                </p>
              </div>
            </div>

            <div class="card card-evergreen p-3" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
              <h4 class="fs-6 fw-bold text-main mb-2" itemprop="name">
                <i class="bi bi-cpu text-success me-2"></i> What tech stack gives the highest scoring potential for {{ item.ps_number }}?
              </h4>
              <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                <p class="text-muted small mb-0" itemprop="text">
                  The recommended stack combines 
                  <strong>Frontend:</strong> {{ (item.architecture.frontend || []).join(', ') || 'Angular / React' }}; 
                  <strong>Backend:</strong> {{ (item.architecture.backend || []).join(', ') || 'Node.js / FastAPI' }}; 
                  @if (item.architecture.aiMl && item.architecture.aiMl.length > 0) {
                    <strong>AI/ML:</strong> {{ item.architecture.aiMl.join(', ') }};
                  }
                  @if (item.architecture.hardware && item.architecture.hardware.length > 0) {
                    <strong>Embedded Hardware:</strong> {{ item.architecture.hardware.join(', ') }};
                  }
                  <strong>Database & DevOps:</strong> {{ (item.architecture.database || []).join(', ') }}, Docker & Cloud Deployment.
                </p>
              </div>
            </div>

            <div class="card card-evergreen p-3" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
              <h4 class="fs-6 fw-bold text-main mb-2" itemprop="name">
                <i class="bi bi-file-earmark-slides text-warning me-2"></i> How should our team structure the 6-slide presentation for SIH jury?
              </h4>
              <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                <p class="text-muted small mb-0" itemprop="text">
                  Follow the official 6-slide sequence: 
                  <strong>Slide 1:</strong> Title, Team & Mentor | 
                  <strong>Slide 2:</strong> Problem Understanding & Impact Metrics | 
                  <strong>Slide 3:</strong> Innovation & USP Hook | 
                  <strong>Slide 4:</strong> System Architecture & Stack Diagram | 
                  <strong>Slide 5:</strong> Feasibility, Security & 36-hr Hackathon Roadmap | 
                  <strong>Slide 6:</strong> Measurable Impact, Expected Deliverables & Government Value.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Similar Challenges -->
        @if (similarStatements().length > 0) {
          <section class="mt-5">
            <h3 class="fs-5 fw-bold text-main mb-3">Related Challenges</h3>
            <div class="row row-cols-1 row-cols-md-3 g-3">
              @for (sim of similarStatements(); track sim.ps_number) {
                <div class="col">
                  <app-ps-card [ps]="sim"></app-ps-card>
                </div>
              }
            </div>
          </section>
        }

        <!-- Pitch Deck Modal -->
        <app-pitch-modal 
          [ps]="ps()"
          [isOpen]="isPitchModalOpen()"
          (close)="isPitchModalOpen.set(false)"
        ></app-pitch-modal>
      </main>
    }
  `,
  styles: [`
    .text-main { color: var(--text-main); }
    .bg-subtle { background-color: var(--bg-subtle) !important; }
    .border-subtle { border-color: var(--border) !important; }
    .text-indigo { color: var(--accent-indigo); }

    .tab-btn {
      background: transparent;
      border: none;
      border-bottom: 2px solid transparent;
      color: var(--text-muted);
      font-size: 0.875rem;
      font-weight: 500;
      padding: 0.5rem 0.85rem;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.15s ease;

      &:hover {
        color: var(--text-main);
      }

      &.active {
        color: var(--primary);
        border-bottom-color: var(--primary);
        font-weight: 600;
      }
    }
  `]
})
export class PsDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private psService = inject(PsDataService);
  private seoService = inject(SeoService);
  bookmarkService = inject(BookmarkService);
  private shareService = inject(ShareService);

  ps = signal<ProblemStatement | null>(null);
  similarStatements = signal<ProblemStatement[]>([]);
  activeTab = signal<DetailTab>('overview');
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

    this.route.queryParamMap.subscribe(qparams => {
      const tab = qparams.get('tab') as DetailTab | null;
      if (tab && ['overview', 'architecture', 'solutions', 'pitch'].includes(tab)) {
        this.activeTab.set(tab);
      }
    });
  }

  selectTab(tab: DetailTab): void {
    this.activeTab.set(tab);
    // Update query params without reloading
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab },
      queryParamsHandling: 'merge'
    });
  }

  shareProblem(ps: ProblemStatement): void {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://sih2026.gov.in';
    this.shareService.openShare({
      title: `${ps.ps_number}: ${ps.title}`,
      text: `${ps.ps_number} (${ps.category} - ${ps.theme}): ${ps.title}`,
      url: `${origin}/ps/${ps.ps_number}`
    });
  }

  shareActiveTab(ps: ProblemStatement): void {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://sih2026.gov.in';
    const tabName = this.activeTab();
    const tabLabels: Record<DetailTab, string> = {
      overview: 'Overview & Challenges',
      architecture: 'Architecture & Tech Stack',
      solutions: 'Solution Concepts',
      pitch: '6-Slide Pitch Presentation Deck'
    };

    const url = `${origin}/ps/${ps.ps_number}?tab=${tabName}`;
    this.shareService.openShare({
      title: `${ps.ps_number} [${tabLabels[tabName]}]: ${ps.title}`,
      text: `Check out the ${tabLabels[tabName]} for SIH 2026 Challenge ${ps.ps_number}`,
      url
    });
  }

  copyPitchMarkdown(ps: ProblemStatement): void {
    let md = `# SIH 2026 Pitch Deck Outline: ${ps.ps_number} - ${ps.title}\n\n`;
    ps.pitchDeck.forEach(s => {
      md += `## Slide ${s.slideNumber}: ${s.slideTitle}\n### ${s.heading}\n`;
      s.bulletPoints.forEach(b => md += `- ${b}\n`);
      if (s.callout) md += `> **Key Focus**: ${s.callout}\n`;
      md += `\n`;
    });

    navigator.clipboard.writeText(md).then(() => {
      this.copiedPitch.set(true);
      setTimeout(() => this.copiedPitch.set(false), 2500);
    });
  }
}
