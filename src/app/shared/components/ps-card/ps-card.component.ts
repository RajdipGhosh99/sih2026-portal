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
    <div class="card h-100 custom-ps-card shadow-sm" [class.border-warning]="ps.rank && ps.rank <= 10" [class.hardware-border]="ps.category === 'Hardware'">
      <div class="card-body d-flex flex-column justify-content-between p-3">
        <div>
          <!-- Top Badges & Actions -->
          <div class="d-flex align-items-center justify-content-between mb-2">
            <div class="d-flex align-items-center gap-1 flex-wrap">
              <span class="badge bg-dark text-info border border-info px-2 py-1 font-monospace">{{ ps.ps_number }}</span>
              <span class="badge" [ngClass]="ps.category === 'Hardware' ? 'bg-warning text-dark' : 'bg-primary'">
                <i class="bi" [ngClass]="ps.category === 'Hardware' ? 'bi-cpu-fill' : 'bi-code-slash'"></i>
                {{ ps.category }}
              </span>
              @if (ps.rank && ps.rank <= 10) {
                <span class="badge bg-warning text-dark fw-bold">
                  <i class="bi bi-trophy-fill"></i> Rank #{{ ps.rank }}
                </span>
              }
            </div>

            <!-- Card Actions -->
            <div class="btn-group btn-group-sm">
              <button 
                class="btn btn-outline-secondary py-0 px-2"
                [class.btn-warning]="bookmarkService.isInCompare(ps.ps_number)"
                [class.text-dark]="bookmarkService.isInCompare(ps.ps_number)"
                (click)="bookmarkService.toggleCompare(ps.ps_number)"
                title="Compare Side-by-Side"
              >
                <i class="bi bi-layout-split"></i>
              </button>
              <button 
                class="btn btn-outline-secondary py-0 px-2"
                [class.btn-warning]="bookmarkService.isBookmarked(ps.ps_number)"
                [class.text-dark]="bookmarkService.isBookmarked(ps.ps_number)"
                (click)="bookmarkService.toggleBookmark(ps.ps_number)"
                title="Bookmark Problem Statement"
              >
                <i class="bi" [ngClass]="bookmarkService.isBookmarked(ps.ps_number) ? 'bi-star-fill' : 'bi-star'"></i>
              </button>
            </div>
          </div>

          <!-- Title -->
          <h5 class="card-title fs-6 fw-bold mb-2">
            <a [routerLink]="['/ps', ps.ps_number]" class="text-decoration-none text-light ps-title-link" [innerHTML]="ps.title | highlight:searchQuery"></a>
          </h5>

          <!-- Ministry & Theme Meta -->
          <div class="small text-secondary mb-2 d-flex flex-column gap-1">
            <span class="text-truncate" title="{{ ps.org }}">
              <i class="bi bi-building me-1"></i>{{ ps.org | truncate:40 }}
            </span>
            <span>
              <i class="bi bi-tag me-1 text-info"></i>{{ ps.theme }}
            </span>
          </div>

          <!-- Description -->
          <p class="card-text small text-secondary-light line-clamp-3 mb-3" [innerHTML]="(ps.description | truncate:145) | highlight:searchQuery"></p>

          <!-- Match Score -->
          @if (matchScore) {
            <div class="mb-3 bg-dark bg-opacity-50 p-2 rounded border border-secondary border-opacity-25">
              <div class="d-flex justify-content-between small mb-1">
                <span class="text-secondary">Skill Match Score</span>
                <strong class="text-info">{{ matchScore }}%</strong>
              </div>
              <div class="progress" style="height: 5px;">
                <div class="progress-bar bg-info" role="progressbar" [style.width.%]="matchScore"></div>
              </div>
            </div>
          }
        </div>

        <div>
          <!-- Tech Tags -->
          <div class="d-flex flex-wrap gap-1 mb-3">
            @for (skill of ps.skills.slice(0, 4); track skill) {
              <app-tech-badge [tech]="skill"></app-tech-badge>
            }
            @if (ps.skills.length > 4) {
              <span class="badge bg-secondary bg-opacity-25 text-secondary">+{{ ps.skills.length - 4 }}</span>
            }
          </div>

          <!-- Card Footer Buttons -->
          <div class="d-flex align-items-center justify-content-between pt-2 border-top border-secondary border-opacity-25">
            <button class="btn btn-sm btn-outline-secondary text-light d-flex align-items-center gap-1" (click)="openPitch.emit(ps)">
              <i class="bi bi-easel"></i> 6-Slide Pitch
            </button>
            <a [routerLink]="['/ps', ps.ps_number]" class="btn btn-sm btn-outline-info fw-bold d-flex align-items-center gap-1">
              Explore <i class="bi bi-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .custom-ps-card {
      background: rgba(30, 41, 59, 0.45);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      transition: all 0.25s ease;

      &:hover {
        background: rgba(30, 41, 59, 0.7);
        border-color: rgba(56, 189, 248, 0.4);
        transform: translateY(-3px);
      }

      &.hardware-border {
        border-left: 3px solid #f59e0b;
      }
    }

    .ps-title-link:hover {
      color: #38bdf8 !important;
    }

    .text-secondary-light {
      color: #cbd5e1;
      line-height: 1.5;
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
