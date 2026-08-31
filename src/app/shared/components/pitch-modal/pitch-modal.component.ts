import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProblemStatement } from '../../../core/models/problem-statement.model';

@Component({
  selector: 'app-pitch-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen && ps) {
      <div class="modal-backdrop-custom" (click)="close.emit()">
        <div class="modal-content-custom" (click)="$event.stopPropagation()">
          <!-- Header -->
          <div class="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom border-subtle">
            <div class="d-flex align-items-center gap-2">
              <span class="ps-badge">{{ ps.ps_number }}</span>
              <h4 class="fs-6 fw-bold text-main m-0">Pitch Presentation: {{ ps.title }}</h4>
            </div>
            <button type="button" class="btn-close-custom" (click)="close.emit()">✕</button>
          </div>

          <!-- Slide Tabs -->
          <div class="slide-nav-bar mb-3">
            <div class="d-flex gap-1 overflow-auto">
              @for (slide of ps.pitchDeck; track slide.slideNumber) {
                <button 
                  class="slide-tab-btn" 
                  [class.active]="activeSlideIndex() === $index"
                  (click)="activeSlideIndex.set($index)"
                >
                  Slide {{ slide.slideNumber }}: {{ slide.slideTitle }}
                </button>
              }
            </div>
          </div>

          <!-- Slide Body -->
          <div class="slide-body p-3 rounded mb-3">
            @if (ps.pitchDeck[activeSlideIndex()]; as currentSlide) {
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="text-muted fw-bold small" style="font-size: 0.75rem;">SLIDE {{ currentSlide.slideNumber }} OF 6</span>
                <span class="text-muted small">{{ currentSlide.slideTitle }}</span>
              </div>
              <h5 class="fs-6 fw-bold text-main mb-2">{{ currentSlide.heading }}</h5>
              <ul class="text-muted small ps-3 mb-3">
                @for (bullet of currentSlide.bulletPoints; track $index) {
                  <li class="mb-1">{{ bullet }}</li>
                }
              </ul>
              @if (currentSlide.callout) {
                <div class="p-2 bg-subtle rounded border border-subtle small text-muted">
                  <strong>Key Judge Takeaway:</strong> {{ currentSlide.callout }}
                </div>
              }
            }
          </div>

          <!-- Footer -->
          <div class="d-flex align-items-center justify-content-between pt-2 border-top border-subtle">
            <button class="btn btn-sm btn-outline-secondary" (click)="copyAllSlides()">
              {{ copied() ? '✓ Copied Markdown' : 'Copy All Slides (Markdown)' }}
            </button>
            <div class="d-flex gap-1">
              <button 
                class="btn btn-sm btn-outline-secondary" 
                [disabled]="activeSlideIndex() === 0"
                (click)="activeSlideIndex.set(activeSlideIndex() - 1)"
              >
                Previous
              </button>
              <button 
                class="btn btn-sm btn-primary" 
                [disabled]="activeSlideIndex() === ps.pitchDeck.length - 1"
                (click)="activeSlideIndex.set(activeSlideIndex() + 1)"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-backdrop-custom {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1050;
      padding: 1rem;
    }

    .modal-content-custom {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 8px;
      width: 100%;
      max-width: 680px;
      padding: 1.25rem;
      box-shadow: var(--card-shadow-hover);
    }

    .ps-badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--primary);
      background: var(--primary-subtle);
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
    }

    .btn-close-custom {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 1.1rem;

      &:hover {
        color: var(--text-main);
      }
    }

    .slide-tab-btn {
      background: var(--bg-subtle);
      border: 1px solid var(--border);
      color: var(--text-muted);
      font-size: 0.75rem;
      padding: 0.25rem 0.6rem;
      border-radius: 4px;
      white-space: nowrap;
      cursor: pointer;

      &.active {
        background: var(--primary);
        color: #ffffff;
        border-color: var(--primary);
      }
    }

    .slide-body {
      background: var(--bg-subtle);
      border: 1px solid var(--border);
    }

    .text-main { color: var(--text-main); }
    .border-subtle { border-color: var(--border) !important; }
  `]
})
export class PitchModalComponent {
  @Input() ps: ProblemStatement | null = null;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  activeSlideIndex = signal(0);
  copied = signal(false);

  copyAllSlides(): void {
    if (!this.ps) return;
    let md = `# SIH 2026 Pitch Deck Outline: ${this.ps.ps_number} - ${this.ps.title}

`;
    this.ps.pitchDeck.forEach(s => {
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
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2500);
    });
  }
}
