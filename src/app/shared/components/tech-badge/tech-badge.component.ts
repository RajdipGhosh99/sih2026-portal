import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tech-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="custom-badge" [ngClass]="badgeClass">
      {{ tech }}
    </span>
  `,
  styles: [`
    .custom-badge {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.55rem;
      border-radius: 6px;
      letter-spacing: 0.01em;
      border: 1px solid var(--border-color);
      background: var(--bg-surface-subtle);
      color: var(--text-secondary);
      transition: all 0.15s ease;

      &.badge-fullstack {
        background: rgba(2, 132, 199, 0.08);
        color: var(--primary);
        border-color: rgba(2, 132, 199, 0.2);
      }

      &.badge-ai {
        background: rgba(99, 102, 241, 0.08);
        color: var(--accent-indigo);
        border-color: rgba(99, 102, 241, 0.2);
      }

      &.badge-hardware {
        background: rgba(217, 119, 6, 0.08);
        color: var(--accent-amber);
        border-color: rgba(217, 119, 6, 0.2);
      }

      &.badge-emerald {
        background: rgba(5, 150, 105, 0.08);
        color: var(--accent-emerald);
        border-color: rgba(5, 150, 105, 0.2);
      }
    }
  `]
})
export class TechBadgeComponent {
  @Input({ required: true }) tech!: string;
  @Input() type?: string;

  get badgeClass(): string {
    if (this.type) return `badge-${this.type}`;
    const t = this.tech.toLowerCase();
    if (t.includes('angular') || t.includes('react') || t.includes('node') || t.includes('express') || t.includes('full stack') || t.includes('api') || t.includes('pwa')) {
      return 'badge-fullstack';
    }
    if (t.includes('python') || t.includes('pytorch') || t.includes('ai') || t.includes('ml') || t.includes('vision') || t.includes('nlp') || t.includes('yolo') || t.includes('rag')) {
      return 'badge-ai';
    }
    if (t.includes('esp32') || t.includes('stm32') || t.includes('sensor') || t.includes('hardware') || t.includes('drone') || t.includes('iot')) {
      return 'badge-hardware';
    }
    if (t.includes('postgres') || t.includes('database') || t.includes('gis') || t.includes('cloud')) {
      return 'badge-emerald';
    }
    return 'badge-default';
  }
}
