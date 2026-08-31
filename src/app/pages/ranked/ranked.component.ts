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
    <div class="ranked-page">
      <header class="ranked-header">
        <div class="header-pill">
          <span>🏆 Curated Architectural Strategy</span>
        </div>
        <h1>SIH 2026 Ranked Problem Statements</h1>
        <p class="subtitle">
          SEO Content Blueprint & Full-Stack Architecture Strategy for Web Portals (Authored by Rajdip Ghosh)
        </p>
        <div class="strategy-callout">
          <strong>Strategic Overview:</strong> This ranking is optimized for building an SEO-friendly public repository or portfolio platform. Problem statements ranked 1 through 5 are highly suited for public search engine indexing (two-sided marketplaces, forums, directories, job boards) with Angular Server-Side Rendering (SSR). Problem statements 6 through 10 feature private secure dashboards with public landing page strategies.
        </div>
      </header>

      <div class="ranked-list">
        @for (ps of rankedList; track ps.ps_number) {
          <article class="ranked-item" id="rank-{{ ps.rank }}">
            <div class="rank-badge-col">
              <div class="rank-badge">
                <span class="lbl">RANK</span>
                <span class="num">#{{ ps.rank }}</span>
              </div>
            </div>

            <div class="content-col">
              <div class="item-meta-top">
                <span class="ps-id">{{ ps.ps_number }}</span>
                <span class="ministry">🏛️ {{ ps.org }}</span>
                <span class="category">{{ ps.category }}</span>
              </div>

              <h2 class="item-title">
                <a [routerLink]="['/ps', ps.ps_number]">{{ ps.title }}</a>
              </h2>

              <!-- Suggested SEO Strategy Box -->
              <div class="seo-blueprint-box">
                <div class="seo-field">
                  <span class="seo-label">Suggested SEO H1:</span>
                  <strong>{{ ps.seo.suggestedH1 }}</strong>
                </div>
                <div class="seo-field">
                  <span class="seo-label">Meta Description:</span>
                  <span>{{ ps.seo.metaDescription }}</span>
                </div>
              </div>

              <!-- Architecture & Tech Stack -->
              <div class="arch-section">
                <h4>Architecture & Tech Stack Blueprint:</h4>
                <div class="tech-row">
                  @for (t of ps.architecture.frontend; track t) {
                    <app-tech-badge [tech]="t" type="frontend"></app-tech-badge>
                  }
                  @for (t of ps.architecture.backend; track t) {
                    <app-tech-badge [tech]="t" type="backend"></app-tech-badge>
                  }
                  @for (t of ps.architecture.database; track t) {
                    <app-tech-badge [tech]="t" type="database"></app-tech-badge>
                  }
                </div>
              </div>

              <div class="item-footer">
                <a [routerLink]="['/ps', ps.ps_number]" class="btn-view-ps">
                  View Full Architecture & Pitch Deck →
                </a>
              </div>
            </div>
          </article>
        }
      </div>
    </div>
  `,
  styles: [`
    .ranked-page {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2.5rem 1.5rem 5rem;
      display: flex;
      flex-direction: column;
      gap: 2.5rem;
    }

    .ranked-header {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;

      .header-pill {
        background: rgba(234, 179, 8, 0.15);
        color: #fde047;
        border: 1px solid rgba(234, 179, 8, 0.3);
        font-weight: 800;
        font-size: 0.8rem;
        padding: 4px 12px;
        border-radius: 9999px;
      }

      h1 {
        font-size: 2.5rem;
        font-weight: 900;
        color: #f8fafc;
        letter-spacing: -0.02em;
        margin: 0;
      }

      .subtitle {
        font-size: 1.1rem;
        color: #94a3b8;
        max-width: 780px;
        margin: 0;
      }

      .strategy-callout {
        margin-top: 1.25rem;
        background: rgba(30, 41, 59, 0.5);
        border: 1px solid rgba(56, 189, 248, 0.2);
        border-left: 4px solid #38bdf8;
        border-radius: 12px;
        padding: 1.25rem;
        text-align: left;
        color: #cbd5e1;
        font-size: 0.9rem;
        line-height: 1.6;
      }
    }

    .ranked-list {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
    }

    .ranked-item {
      background: rgba(30, 41, 59, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 18px;
      padding: 1.75rem;
      display: grid;
      grid-template-columns: 100px 1fr;
      gap: 1.5rem;
      transition: all 0.25s ease;

      &:hover {
        background: rgba(30, 41, 59, 0.7);
        border-color: rgba(234, 179, 8, 0.4);
        transform: translateY(-2px);
      }

      @media (max-width: 640px) {
        grid-template-columns: 1fr;
      }
    }

    .rank-badge-col {
      display: flex;
      justify-content: center;

      .rank-badge {
        background: linear-gradient(135deg, #ef4444, #f59e0b);
        color: white;
        border-radius: 14px;
        width: 80px;
        height: 80px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);

        .lbl { font-size: 0.65rem; font-weight: 800; letter-spacing: 0.05em; opacity: 0.9; }
        .num { font-size: 1.6rem; font-weight: 900; line-height: 1; }
      }
    }

    .content-col {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .item-meta-top {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        font-size: 0.75rem;
        flex-wrap: wrap;

        .ps-id {
          background: #0f172a;
          color: #38bdf8;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 6px;
        }

        .ministry { color: #94a3b8; font-weight: 600; }
        .category { background: rgba(59, 130, 246, 0.15); color: #60a5fa; padding: 2px 6px; border-radius: 6px; }
      }

      .item-title {
        margin: 0;
        font-size: 1.35rem;
        font-weight: 800;

        a {
          color: #f8fafc;
          text-decoration: none;
          &:hover { color: #38bdf8; }
        }
      }

      .seo-blueprint-box {
        background: rgba(15, 23, 42, 0.7);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 10px;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        font-size: 0.85rem;

        .seo-field {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;

          .seo-label {
            font-size: 0.7rem;
            color: #38bdf8;
            font-weight: 800;
            text-transform: uppercase;
          }

          strong { color: #f1f5f9; }
          span { color: #94a3b8; line-height: 1.45; }
        }
      }

      .arch-section {
        h4 {
          font-size: 0.85rem;
          color: #94a3b8;
          margin: 0 0 0.5rem 0;
        }

        .tech-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }
      }

      .item-footer {
        padding-top: 0.5rem;

        .btn-view-ps {
          color: #38bdf8;
          font-weight: 700;
          font-size: 0.9rem;
          text-decoration: none;
          &:hover { text-decoration: underline; }
        }
      }
    }
  `]
})
export class RankedComponent implements OnInit {
  private psService = inject(PsDataService);
  private seoService = inject(SeoService);

  rankedList: ProblemStatement[] = [];

  ngOnInit(): void {
    this.rankedList = this.psService.getTop10RankedPortals();

    this.seoService.setGeneralSeo(
      'Top 10 Ranked SIH 2026 Problem Statements & SEO Architecture Strategy',
      'Curated Top 10 Web Portals for SIH 2026 with Angular SSR architecture, SEO content blueprints, and database optimization strategies.',
      ['SIH 2026 Ranked', 'Top 10 Problem Statements', 'SEO Blueprint', 'Angular SSR', 'Rajdip Ghosh'],
      '/ranked'
    );
  }
}
