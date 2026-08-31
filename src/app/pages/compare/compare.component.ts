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
    <div class="compare-page">
      <header class="compare-header">
        <div class="header-pill">⚖️ Decision Matrix</div>
        <h1>Problem Statement Comparison Matrix</h1>
        <p>Compare up to 3 Smart India Hackathon 2026 challenges side-by-side on complexity, tech stack, and evaluation feasibility.</p>
      </header>

      @if (compareItems.length > 0) {
        <div class="compare-actions-bar">
          <span class="count-info">Comparing {{ compareItems.length }} of max 3 problem statements</span>
          <button class="btn-clear" (click)="clearAll()">Clear Comparison</button>
        </div>

        <div class="comparison-table-wrapper">
          <table class="comparison-table">
            <thead>
              <tr>
                <th class="matrix-label">Feature / Parameter</th>
                @for (item of compareItems; track item.ps_number) {
                  <th class="ps-col-header">
                    <div class="th-content">
                      <span class="ps-badge">{{ item.ps_number }}</span>
                      <button class="remove-btn" (click)="removeItem(item.ps_number)">✕</button>
                    </div>
                    <h3><a [routerLink]="['/ps', item.ps_number]">{{ item.title }}</a></h3>
                  </th>
                }
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="row-title">Ministry / Organization</td>
                @for (item of compareItems; track item.ps_number) {
                  <td>{{ item.org }}</td>
                }
              </tr>
              <tr>
                <td class="row-title">Category & Track</td>
                @for (item of compareItems; track item.ps_number) {
                  <td>
                    <span class="pill" [class.hardware]="item.category === 'Hardware'">
                      {{ item.category }}
                    </span>
                  </td>
                }
              </tr>
              <tr>
                <td class="row-title">Theme</td>
                @for (item of compareItems; track item.ps_number) {
                  <td>{{ item.theme }}</td>
                }
              </tr>
              <tr>
                <td class="row-title">Technical Difficulty</td>
                @for (item of compareItems; track item.ps_number) {
                  <td><strong>{{ item.difficulty }}</strong></td>
                }
              </tr>
              <tr>
                <td class="row-title">Target Departments</td>
                @for (item of compareItems; track item.ps_number) {
                  <td>
                    <div class="cell-tags">
                      @for (dept of item.departments; track dept) {
                        <span class="dept-tag">{{ dept }}</span>
                      }
                    </div>
                  </td>
                }
              </tr>
              <tr>
                <td class="row-title">Required Skills</td>
                @for (item of compareItems; track item.ps_number) {
                  <td>
                    <div class="cell-tags">
                      @for (sk of item.skills; track sk) {
                        <app-tech-badge [tech]="sk"></app-tech-badge>
                      }
                    </div>
                  </td>
                }
              </tr>
              <tr>
                <td class="row-title">Key Innovation Hook</td>
                @for (item of compareItems; track item.ps_number) {
                  <td>
                    <p class="hook-text">{{ (item.solutionIdeas[0] ? item.solutionIdeas[0].usp : '') || 'Modular architecture with high evaluation feasibility.' }}</p>
                  </td>
                }
              </tr>
              <tr>
                <td class="row-title">Explore Full Blueprint</td>
                @for (item of compareItems; track item.ps_number) {
                  <td>
                    <a [routerLink]="['/ps', item.ps_number]" class="btn-detail">
                      View Solution Architecture →
                    </a>
                  </td>
                }
              </tr>
            </tbody>
          </table>
        </div>
      } @else {
        <div class="empty-compare">
          <span class="empty-icon">⚖️</span>
          <h2>No Problem Statements in Comparison Tray</h2>
          <p>Click the ⚖️ icon on any Problem Statement card to compare up to 3 challenges side-by-side.</p>
          <a routerLink="/" class="btn-primary">Browse All Problem Statements</a>
        </div>
      }
    </div>
  `,
  styles: [`
    .compare-page {
      max-width: 1440px;
      margin: 0 auto;
      padding: 2.5rem 1.5rem 5rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .compare-header {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;

      .header-pill {
        background: rgba(56, 189, 248, 0.15);
        color: #38bdf8;
        border: 1px solid rgba(56, 189, 248, 0.3);
        font-weight: 800;
        font-size: 0.8rem;
        padding: 4px 12px;
        border-radius: 9999px;
      }

      h1 { font-size: 2.5rem; font-weight: 900; color: #f8fafc; margin: 0; }
      p { font-size: 1.1rem; color: #94a3b8; max-width: 780px; margin: 0; }
    }

    .compare-actions-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(30, 41, 59, 0.4);
      padding: 0.75rem 1.25rem;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.08);

      .count-info { font-size: 0.85rem; color: #94a3b8; font-weight: 600; }
      .btn-clear {
        background: none;
        border: 1px solid rgba(239, 68, 68, 0.3);
        color: #f87171;
        padding: 0.4rem 0.8rem;
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 600;
        cursor: pointer;
        &:hover { background: rgba(239, 68, 68, 0.15); }
      }
    }

    .comparison-table-wrapper {
      overflow-x: auto;
      background: rgba(30, 41, 59, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
    }

    .comparison-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.9rem;
      color: #cbd5e1;

      th, td {
        padding: 1.25rem 1.5rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        text-align: left;
        vertical-align: top;
      }

      thead th {
        background: rgba(15, 23, 42, 0.8);
      }

      .matrix-label {
        width: 220px;
        font-weight: 800;
        color: #f8fafc;
      }

      .row-title {
        font-weight: 700;
        color: #94a3b8;
        background: rgba(15, 23, 42, 0.4);
      }

      .ps-col-header {
        min-width: 280px;

        .th-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;

          .ps-badge {
            background: #38bdf8;
            color: #0f172a;
            font-weight: 800;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.75rem;
          }

          .remove-btn {
            background: none;
            border: none;
            color: #94a3b8;
            cursor: pointer;
            &:hover { color: #ef4444; }
          }
        }

        h3 {
          margin: 0;
          font-size: 1.05rem;
          a { color: #f8fafc; text-decoration: none; &:hover { color: #38bdf8; } }
        }
      }

      .pill {
        background: rgba(59, 130, 246, 0.15);
        color: #60a5fa;
        padding: 3px 8px;
        border-radius: 6px;
        font-size: 0.75rem;
        font-weight: 700;
        &.hardware { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
      }

      .cell-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;

        .dept-tag {
          background: rgba(255, 255, 255, 0.05);
          color: #e2e8f0;
          font-size: 0.75rem;
          padding: 2px 6px;
          border-radius: 4px;
        }
      }

      .hook-text {
        font-size: 0.85rem;
        line-height: 1.5;
        color: #fde68a;
      }

      .btn-detail {
        color: #38bdf8;
        font-weight: 700;
        text-decoration: none;
        font-size: 0.85rem;
        &:hover { text-decoration: underline; }
      }
    }

    .empty-compare {
      text-align: center;
      padding: 6rem 2rem;
      background: rgba(30, 41, 59, 0.3);
      border: 1px dashed rgba(255, 255, 255, 0.15);
      border-radius: 16px;

      .empty-icon { font-size: 3.5rem; margin-bottom: 1rem; display: block; }
      h2 { color: #f8fafc; margin: 0 0 0.5rem 0; font-size: 1.5rem; }
      p { color: #94a3b8; margin: 0 0 1.5rem 0; font-size: 0.95rem; }
      .btn-primary {
        background: #38bdf8;
        color: #0f172a;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: 700;
        text-decoration: none;
        display: inline-block;
      }
    }
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
      'Side-by-Side Problem Statement Comparison Matrix | SIH 2026',
      'Compare multiple Smart India Hackathon 2026 problem statements across technical complexity, hardware requirements, skills, and solution feasibility.',
      ['Compare SIH Problem Statements', 'Decision Matrix', 'SIH 2026'],
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
