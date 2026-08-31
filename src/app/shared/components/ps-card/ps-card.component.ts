import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProblemStatement } from '../../../core/models/problem-statement.model';
import { BookmarkService } from '../../../core/services/bookmark.service';
import { TechBadgeComponent } from '../tech-badge/tech-badge.component';
import { TruncatePipe } from '../../../core/pipes/truncate.pipe';
import { HighlightPipe } from '../../../core/pipes/highlight.pipe';

@Component({
  selector: 'app-ps-card',
  standalone: true,
  imports: [CommonModule, RouterLink, TechBadgeComponent, TruncatePipe, HighlightPipe],
  template: `
    <div class="card h-100 human-card">
      <div class="card-body p-3 d-flex flex-column justify-content-between">
        <div>
          <!-- Header Meta -->
          <div class="d-flex align-items-center justify-content-between mb-2">
            <div class="d-flex align-items-center gap-2">
              <span class="ps-id-tag">{{ ps.ps_number }}</span>
              <span class="category-indicator" [class.is-hw]="ps.category === 'Hardware'">
                {{ ps.category }}
              </span>
              @if (ps.rank && ps.rank <= 10) {
                <span class="rank-tag">Top {{ ps.rank }}</span>
              }
            </div>

            <!-- Bookmark / Compare buttons -->
            <div class="d-flex align-items-center gap-1">
              <button 
                class="icon-btn" 
                [class.active]="bookmarkService.isInCompare(ps.ps_number)"
                (click)="bookmarkService.toggleCompare(ps.ps_number)"
                title="Add to comparison"
              >
                <i class="bi bi-layout-split"></i>
              </button>
              <button 
                class="icon-btn" 
                [class.active]="bookmarkService.isBookmarked(ps.ps_number)"
                (click)="bookmarkService.toggleBookmark(ps.ps_number)"
                title="Save for later"
              >
                <i class="bi" [ngClass]="bookmarkService.isBookmarked(ps.ps_number) ? 'bi-bookmark-fill text-warning' : 'bi-bookmark'"></i>
              </button>
            </div>
          </div>

          <!-- Title -->
          <h5 class="card-title fs-6 fw-bold mb-2">
            <a [routerLink]="['/ps', ps.ps_number]" class="title-link" [innerHTML]="ps.title | highlight:searchQuery"></a>
          </h5>

          <!-- Ministry & Theme info -->
          <div class="card-meta text-muted small mb-2">
            <span class="d-block text-truncate" title="{{ ps.org }}">
              <i class="bi bi-building me-1"></i>{{ ps.org | truncate:42 }}
            </span>
            <span>
              <i class="bi bi-tag me-1"></i>{{ ps.theme }}
            </span>
          </div>

          <!-- Description -->
          <p class="card-text small desc-text mb-3" [innerHTML]="(ps.description | truncate:140) | highlight:searchQuery"></p>
        </div>

        <div>
          <!-- Tech badges -->
          <div class="d-flex flex-wrap gap-1 mb-3">
            @for (skill of ps.skills.slice(0, 4); track skill) {
              <app-tech-badge [tech]="skill"></app-tech-badge>
            }
            @if (ps.skills.length > 4) {
              <span class="more-badge">+{{ ps.skills.length - 4 }}</span>
            }
          </div>

          <!-- Footer Action Buttons -->
          <div class="d-flex align-items-center justify-content-between pt-2 border-top border-subtle">
            <button class="btn btn-sm btn-outline-custom" (click)="openPitch.emit(ps)">
              <i class="bi bi-file-earmark-slides me-1"></i> Pitch Deck
            </button>
            <a [routerLink]="['/ps', ps.ps_number]" class="btn btn-sm btn-primary-custom">
              View Solution <i class="bi bi-arrow-right ms-1"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ps-id-tag {
      font-size: 0.75rem;
      font-weight: 700;
      font-family: 'JetBrains Mono', monospace;
      color: var(--primary);
      background: var(--bg-surface-subtle);
      border: 1px solid var(--border-color);
      padding: 0.15rem 0.45rem;
      border-radius: 5px;
    }

    .category-indicator {
      font-size: 0.7rem;
      font-weight: 600;
      color: var(--text-secondary);
      background: var(--badge-bg);
      padding: 0.15rem 0.45rem;
      border-radius: 4px;

      &.is-hw {
        color: var(--accent-amber);
        background: rgba(245, 158, 11, 0.1);
      }
    }

    .rank-tag {
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--accent-amber);
      background: rgba(245, 158, 11, 0.12);
      border: 1px solid rgba(245, 158, 11, 0.25);
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
    }

    .icon-btn {
      background: transparent;
      border: 1px solid var(--border-color);
      color: var(--text-secondary);
      width: 28px;
      height: 28px;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover {
        background: var(--bg-surface-subtle);
        color: var(--text-primary);
      }

      &.active {
        background: var(--badge-bg);
        border-color: var(--primary);
        color: var(--primary);
      }
    }

    .title-link {
      color: var(--text-primary);
      text-decoration: none;
      transition: color 0.15s ease;

      &:hover {
        color: var(--primary);
      }
    }

    .desc-text {
      color: var(--text-secondary);
      line-height: 1.5;
    }

    .card-meta {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .more-badge {
      font-size: 0.7rem;
      font-weight: 600;
      color: var(--text-muted);
      align-self: center;
      padding: 0.1rem 0.3rem;
    }

    .border-subtle {
      border-color: var(--border-color) !important;
    }

    .btn-outline-custom {
      background: transparent;
      border: 1px solid var(--border-color);
      color: var(--text-secondary);
      font-weight: 600;
      font-size: 0.8rem;
      border-radius: 6px;
      transition: all 0.15s ease;

      &:hover {
        background: var(--bg-surface-subtle);
        color: var(--text-primary);
      }
    }

    .btn-primary-custom {
      background: var(--primary);
      color: #ffffff;
      font-weight: 600;
      font-size: 0.8rem;
      border-radius: 6px;
      text-decoration: none;
      padding: 0.35rem 0.75rem;
      transition: background 0.15s ease;

      &:hover {
        background: var(--primary-hover);
        color: #ffffff;
      }
    }
  `]
})
export class PsCardComponent {
  @Input({ required: true }) ps!: ProblemStatement;
  @Input() matchScore?: number;
  @Input() searchQuery: string = '';
  @Output() openPitch = new EventEmitter<ProblemStatement>();

  bookmarkService = inject(BookmarkService);
}
