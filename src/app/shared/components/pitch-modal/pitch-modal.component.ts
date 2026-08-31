import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProblemStatement } from '../../../core/models/problem-statement.model';

@Component({
  selector: 'app-pitch-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen && ps) {
      <div class="modal d-block show" tabindex="-1" style="background: rgba(10, 15, 29, 0.85); backdrop-filter: blur(8px);" (click)="close.emit()">
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" (click)="$event.stopPropagation()">
          <div class="modal-content bg-dark text-light border border-secondary border-opacity-50 rounded-4 shadow-lg">
            <!-- Modal Header -->
            <div class="modal-header border-secondary border-opacity-25 pb-3">
              <div class="d-flex align-items-center gap-2">
                <span class="badge bg-info text-dark fw-bold font-monospace px-2 py-1">{{ ps.ps_number }}</span>
                <h5 class="modal-title fs-6 fw-bold text-light m-0">
                  <i class="bi bi-easel-fill text-warning me-1"></i> 6-Slide Pitch: {{ ps.title }}
                </h5>
              </div>
              <button type="button" class="btn-close btn-close-white" (click)="close.emit()"></button>
            </div>

            <!-- Slide Tabs (Nav Pills) -->
            <div class="bg-black bg-opacity-25 border-bottom border-secondary border-opacity-25 p-2 overflow-auto">
              <ul class="nav nav-pills flex-nowrap gap-1">
                @for (slide of ps.pitchDeck; track slide.slideNumber) {
                  <li class="nav-item">
                    <button 
                      class="nav-link py-1 px-2 small text-nowrap rounded-3" 
                      [ngClass]="activeSlideIndex() === $index ? 'active bg-info text-dark fw-bold' : 'text-secondary'"
                      (click)="activeSlideIndex.set($index)"
                    >
                      Slide {{ slide.slideNumber }}: {{ slide.slideTitle }}
                    </button>
                  </li>
                }
              </ul>
            </div>

            <!-- Modal Body (Slide Content) -->
            <div class="modal-body p-4">
              @if (ps.pitchDeck[activeSlideIndex()]; as currentSlide) {
                <div class="card bg-secondary bg-opacity-10 border border-secondary border-opacity-25 rounded-3 p-4">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="badge bg-dark text-info border border-info px-2 py-1">SLIDE {{ currentSlide.slideNumber }} OF 6</span>
                    <span class="text-secondary small fw-semibold">{{ currentSlide.slideTitle }}</span>
                  </div>
                  <h4 class="fs-5 fw-bold text-light mb-3">{{ currentSlide.heading }}</h4>
                  <ul class="text-secondary-light mb-3 ps-3">
                    @for (bullet of currentSlide.bulletPoints; track $index) {
                      <li class="mb-2">{{ bullet }}</li>
                    }
                  </ul>
                  @if (currentSlide.callout) {
                    <div class="alert alert-warning bg-warning bg-opacity-10 border-warning border-opacity-25 text-warning small mb-0 d-flex align-items-center gap-2">
                      <i class="bi bi-lightbulb-fill fs-5"></i>
                      <span><strong>Judge Value Hook:</strong> {{ currentSlide.callout }}</span>
                    </div>
                  }
                </div>
              }
            </div>

            <!-- Modal Footer -->
            <div class="modal-footer border-secondary border-opacity-25 d-flex justify-content-between">
              <button class="btn btn-sm btn-outline-light d-flex align-items-center gap-1" (click)="copyAllSlides()">
                <i class="bi" [ngClass]="copied() ? 'bi-check-lg text-success' : 'bi-clipboard'"></i>
                {{ copied() ? 'Copied Markdown!' : 'Copy All 6 Slides (Markdown)' }}
              </button>
              <div class="btn-group btn-group-sm">
                <button 
                  class="btn btn-outline-info" 
                  [disabled]="activeSlideIndex() === 0"
                  (click)="activeSlideIndex.set(activeSlideIndex() - 1)"
                >← Previous</button>
                <button 
                  class="btn btn-info text-dark fw-bold" 
                  [disabled]="activeSlideIndex() === ps.pitchDeck.length - 1"
                  (click)="activeSlideIndex.set(activeSlideIndex() + 1)"
                >Next →</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .text-secondary-light {
      color: #cbd5e1;
      line-height: 1.6;
    }
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
