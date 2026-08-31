import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PsDataService } from '../../core/services/ps-data.service';
import { SeoService } from '../../core/services/seo.service';
import { ProblemStatement } from '../../core/models/problem-statement.model';
import { TechBadgeComponent } from '../../shared/components/tech-badge/tech-badge.component';

@Component({
  selector: 'app-ranked',
  standalone: true,
  imports: [CommonModule, RouterLink, TechBadgeComponent],
  template: `
    <div class="container-xl py-4" style="max-width: 1080px;">
      <header class="text-center mb-4">
        <span class="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 px-3 py-1 rounded-pill mb-2 fw-semibold">
          Curated Web Strategy
        </span>
        <h1 class="fs-2 fw-bold text-title mb-2">SIH 2026 Ranked Problem Statements</h1>
        <p class="text-secondary small mx-auto" style="max-width: 680px;">
          Architecture and SEO Content Blueprint for Web Portals (Authored by Rajdip Ghosh). Highlights the top 10 candidates best suited for public indexing, two-sided marketplaces, and responsive portals.
        </p>
      </header>

      <div class="d-flex flex-column gap-3">
        @for (ps of rankedList; track ps.ps_number) {
          <article class="card human-card p-4">
            <div class="d-flex align-items-start justify-content-between gap-3 flex-wrap">
              <div class="d-flex align-items-center gap-2">
                <span class="badge bg-warning text-dark fw-bold px-2 py-1">Rank #{{ ps.rank }}</span>
                <span class="badge bg-primary bg-opacity-10 text-primary font-monospace">{{ ps.ps_number }}</span>
                <span class="text-muted small">{{ ps.org }}</span>
              </div>
              <a [routerLink]="['/ps', ps.ps_number]" class="btn btn-sm btn-outline-primary">
                View Architecture →
              </a>
            </div>

            <h2 class="fs-5 fw-bold text-title my-2">
              <a [routerLink]="['/ps', ps.ps_number]" class="text-decoration-none text-title">{{ ps.title }}</a>
            </h2>

            <!-- SEO Strategy info -->
            <div class="p-3 bg-subtle rounded-3 border border-subtle my-2 small">
              <div class="mb-1">
                <span class="text-muted fw-bold">Suggested SEO H1:</span>
                <strong class="text-title ms-1">{{ ps.seo.suggestedH1 }}</strong>
              </div>
              <div class="text-secondary">
                <span class="text-muted fw-bold">Meta Description:</span>
                <span class="ms-1">{{ ps.seo.metaDescription }}</span>
              </div>
            </div>

            <!-- Tech Stack Row -->
            <div class="d-flex flex-wrap gap-1 mt-1">
              @for (t of ps.architecture.frontend; track t) {
                <app-tech-badge [tech]="t" type="fullstack"></app-tech-badge>
              }
              @for (t of ps.architecture.backend; track t) {
                <app-tech-badge [tech]="t" type="fullstack"></app-tech-badge>
              }
              @for (t of ps.architecture.database; track t) {
                <app-tech-badge [tech]="t" type="emerald"></app-tech-badge>
              }
            </div>
          </article>
        }
      </div>
    </div>
  `,
  styles: [`
    .text-title { color: var(--text-primary); }
    .bg-subtle { background-color: var(--bg-surface-subtle) !important; }
    .border-subtle { border-color: var(--border-color) !important; }
  `]
})
export class RankedComponent implements OnInit {
  private psService = inject(PsDataService);
  private seoService = inject(SeoService);

  rankedList: ProblemStatement[] = [];

  ngOnInit(): void {
    this.rankedList = this.psService.getTop10RankedPortals();

    this.seoService.setGeneralSeo(
      'Top 10 Ranked SIH 2026 Problem Statements | Web Strategy',
      'Curated Top 10 Web Portals for SIH 2026 with Angular SSR architecture and database optimization strategies.',
      ['SIH 2026 Ranked', 'Top 10 Problem Statements', 'Rajdip Ghosh'],
      '/ranked'
    );
  }
}
