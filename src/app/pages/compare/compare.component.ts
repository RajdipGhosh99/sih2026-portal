import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookmarkService } from '../../core/services/bookmark.service';
import { PsDataService } from '../../core/services/ps-data.service';
import { SeoService } from '../../core/services/seo.service';
import { ProblemStatement } from '../../core/models/problem-statement.model';
import { TechBadgeComponent } from '../../shared/components/tech-badge/tech-badge.component';

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [CommonModule, RouterLink, TechBadgeComponent],
  template: `
    <div class="container-xl py-4">
      <header class="text-center mb-4">
        <span class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-1 rounded-pill mb-2 fw-semibold">
          Decision Tool
        </span>
        <h1 class="fs-2 fw-bold text-main mb-2">Problem Statement Comparison</h1>
        <p class="text-secondary small">Compare up to 3 challenges side-by-side to evaluate tech stack and team feasibility.</p>
      </header>

      @if (compareItems.length > 0) {
        <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="small text-muted">Comparing {{ compareItems.length }} of max 3 problem statements</span>
          <button class="btn btn-sm btn-outline-danger" (click)="clearAll()">Clear Comparison</button>
        </div>

        <div class="card card-evergreen p-0 overflow-hidden">
          <div class="table-responsive">
            <table class="table table-bordered mb-0 align-middle">
              <thead>
                <tr class="bg-subtle">
                  <th style="width: 200px;" class="text-main">Parameter</th>
                  @for (item of compareItems; track item.ps_number) {
                    <th class="text-main">
                      <div class="d-flex justify-content-between align-items-center mb-1">
                        <span class="badge bg-primary text-white font-monospace">{{ item.ps_number }}</span>
                        <button class="btn btn-sm btn-link text-muted p-0" (click)="removeItem(item.ps_number)">✕</button>
                      </div>
                      <h6 class="mb-0 fw-bold fs-6">
                        <a [routerLink]="['/ps', item.ps_number]" class="text-decoration-none text-main">{{ item.title }}</a>
                      </h6>
                    </th>
                  }
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-muted fw-bold small">Organization</td>
                  @for (item of compareItems; track item.ps_number) {
                    <td class="small">{{ item.org }}</td>
                  }
                </tr>
                <tr>
                  <td class="text-muted fw-bold small">Category</td>
                  @for (item of compareItems; track item.ps_number) {
                    <td>
                      <span class="badge bg-secondary bg-opacity-25 text-secondary">{{ item.category }}</span>
                    </td>
                  }
                </tr>
                <tr>
                  <td class="text-muted fw-bold small">Theme</td>
                  @for (item of compareItems; track item.ps_number) {
                    <td class="small">{{ item.theme }}</td>
                  }
                </tr>
                <tr>
                  <td class="text-muted fw-bold small">Primary Skills</td>
                  @for (item of compareItems; track item.ps_number) {
                    <td>
                      <div class="d-flex flex-wrap gap-1">
                        @for (sk of item.skills; track sk) {
                          <app-tech-badge [tech]="sk"></app-tech-badge>
                        }
                      </div>
                    </td>
                  }
                </tr>
                <tr>
                  <td class="text-muted fw-bold small">Key Differentiator</td>
                  @for (item of compareItems; track item.ps_number) {
                    <td class="small text-secondary">
                      {{ (item.solutionIdeas[0] ? item.solutionIdeas[0].usp : '') || 'Modular scalable architecture.' }}
                    </td>
                  }
                </tr>
                <tr>
                  <td class="text-muted fw-bold small">Action</td>
                  @for (item of compareItems; track item.ps_number) {
                    <td>
                      <a [routerLink]="['/ps', item.ps_number]" class="btn btn-sm btn-primary">
                        View Solution →
                      </a>
                    </td>
                  }
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      } @else {
        <div class="card p-5 text-center bg-subtle border-subtle">
          <i class="bi bi-layout-split fs-1 text-muted mb-2"></i>
          <h5 class="fw-bold text-main">Comparison tray is empty</h5>
          <p class="text-secondary small mb-3">Click the compare icon on any problem statement card to compare.</p>
          <div>
            <a routerLink="/" class="btn btn-sm btn-primary">Browse Challenges</a>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .text-main { color: var(--text-primary); }
    .bg-subtle { background-color: var(--bg-surface-subtle) !important; }
    .border-subtle { border-color: var(--border-color) !important; }
  `]
})
export class CompareComponent implements OnInit {
  private bookmarkService = inject(BookmarkService);
  private psService = inject(PsDataService);
  private seoService = inject(SeoService);

  get compareItems(): ProblemStatement[] {
    return this.bookmarkService.compareList()
      .map(id => this.psService.getProblemStatementById(id))
      .filter((item): item is ProblemStatement => !!item);
  }

  ngOnInit(): void {
    this.seoService.setGeneralSeo(
      'Problem Statement Comparison | SIH 2026',
      'Compare Smart India Hackathon problem statements side-by-side.',
      ['SIH Comparison', 'Hackathon Matrix'],
      '/compare'
    );
  }

  removeItem(psNumber: string): void {
    this.bookmarkService.toggleCompare(psNumber);
  }

  clearAll(): void {
    this.bookmarkService.clearCompare();
  }
}
