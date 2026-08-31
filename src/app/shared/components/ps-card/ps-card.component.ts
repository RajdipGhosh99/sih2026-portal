import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProblemStatement } from '../../../core/models/problem-statement.model';
import { BookmarkService } from '../../../core/services/bookmark.service';
import { ShareService } from '../../../core/services/share.service';
import { TechBadgeComponent } from '../tech-badge/tech-badge.component';
import { TruncatePipe } from '../../../core/pipes/truncate.pipe';
import { HighlightPipe } from '../../../core/pipes/highlight.pipe';

@Component({
  selector: 'app-ps-card',
  standalone: true,
  imports: [CommonModule, RouterLink, TechBadgeComponent, TruncatePipe, HighlightPipe],
  template: `
    <article class="card card-evergreen h-100 p-3 d-flex flex-column justify-content-between">
      <div>
        <!-- Top Meta Row -->
        <div class="d-flex align-items-center justify-content-between mb-2">
          <div class="d-flex align-items-center gap-1">
            <span class="ps-number-pill">{{ ps.ps_number }}</span>
            <span class="category-pill" [class.hw-tag]="ps.category === 'Hardware'">
              {{ ps.category }}
            </span>
            @if (ps.rank && ps.rank <= 10) {
              <span class="rank-pill">Top {{ ps.rank }}</span>
            }
          </div>

          <!-- Bookmark, Compare & Share actions -->
          <div class="d-flex align-items-center gap-1">
            <button 
              class="action-btn" 
              (click)="shareProblem(ps)"
              title="Share challenge"
              aria-label="Share"
            >
              <i class="bi bi-share"></i>
            </button>
            <button 
              class="action-btn" 
              [class.active]="bookmarkService.isInCompare(ps.ps_number)"
              (click)="bookmarkService.toggleCompare(ps.ps_number)"
              title="Add to compare"
              aria-label="Compare"
            >
              <i class="bi bi-layout-split"></i>
            </button>
            <button 
              class="action-btn" 
              [class.active]="bookmarkService.isBookmarked(ps.ps_number)"
              (click)="bookmarkService.toggleBookmark(ps.ps_number)"
              title="Bookmark challenge"
              aria-label="Bookmark"
            >
              <i class="bi" [ngClass]="bookmarkService.isBookmarked(ps.ps_number) ? 'bi-bookmark-fill text-warning' : 'bi-bookmark'"></i>
            </button>
          </div>
        </div>

        <!-- Title -->
        <h3 class="fs-6 fw-bold mb-2 ps-card-heading">
          <a [routerLink]="['/ps', ps.ps_number]" class="ps-title-link" [innerHTML]="ps.title | highlight:searchQuery"></a>
        </h3>

        <!-- Ministry & Theme -->
        <div class="ps-meta small text-muted mb-2">
          <div class="text-truncate" title="{{ ps.org }}">
            <i class="bi bi-building me-1"></i>{{ ps.org | truncate:44 }}
          </div>
          <div>
            <i class="bi bi-tag me-1"></i>{{ ps.theme }}
          </div>
        </div>

        <!-- Description -->
        <p class="ps-description small text-muted mb-3" [innerHTML]="(ps.description | truncate:135) | highlight:searchQuery"></p>
      </div>

      <div>
        <!-- Tech Stack Tags -->
        <div class="d-flex flex-wrap gap-1 mb-3">
          @for (skill of ps.skills.slice(0, 4); track skill) {
            <app-tech-badge [tech]="skill"></app-tech-badge>
          }
          @if (ps.skills.length > 4) {
            <span class="more-count">+{{ ps.skills.length - 4 }}</span>
          }
        </div>

        <!-- Footer Buttons -->
        <div class="d-flex align-items-center justify-content-between pt-2 border-top border-subtle">
          <button class="btn btn-sm btn-outline-secondary py-1 px-2" style="font-size: 0.8rem;" (click)="openPitch.emit(ps)">
            <i class="bi bi-file-earmark-text me-1"></i> Pitch Deck
          </button>
          <a [routerLink]="['/ps', ps.ps_number]" class="btn btn-sm btn-primary py-1 px-3" style="font-size: 0.8rem; font-weight: 600;">
            View Solution →
          </a>
        </div>
      </div>
    </article>
  `,
  styles: [`
    .ps-card-heading {
      line-height: 1.35;
      margin: 0;
    }

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

    .category-pill {
      font-size: 0.7rem;
      font-weight: 500;
      color: var(--text-muted);
      background: var(--bg-subtle);
      padding: 0.15rem 0.4rem;
      border-radius: 4px;

      &.hw-tag {
        color: var(--accent-amber);
        background: rgba(217, 119, 6, 0.1);
      }
    }

    .rank-pill {
      font-size: 0.7rem;
      font-weight: 600;
      color: var(--accent-amber);
      background: rgba(217, 119, 6, 0.12);
      border: 1px solid rgba(217, 119, 6, 0.25);
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
    }

    .action-btn {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--text-muted);
      width: 26px;
      height: 26px;
      border-radius: 4px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover {
        background: var(--bg-subtle);
        color: var(--text-main);
      }

      &.active {
        border-color: var(--primary);
        color: var(--primary);
        background: var(--primary-subtle);
      }
    }

    .ps-title-link {
      color: var(--text-main);
      text-decoration: none;

      &:hover {
        color: var(--primary);
      }
    }

    .ps-meta {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .ps-description {
      line-height: 1.45;
    }

    .more-count {
      font-size: 0.7rem;
      color: var(--text-subtle);
      align-self: center;
    }

    .border-subtle {
      border-color: var(--border) !important;
    }
  `]
})
export class PsCardComponent {
  @Input({ required: true }) ps!: ProblemStatement;
  @Input() matchScore?: number;
  @Input() searchQuery: string = '';
  @Output() openPitch = new EventEmitter<ProblemStatement>();

  bookmarkService = inject(BookmarkService);
  private shareService = inject(ShareService);

  shareProblem(ps: ProblemStatement): void {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://sih2026.gov.in';
    this.shareService.openShare({
      title: `${ps.ps_number}: ${ps.title}`,
      text: `${ps.ps_number} (${ps.category} - ${ps.theme}): ${ps.title}`,
      url: `${origin}/ps/${ps.ps_number}`
    });
  }
}
