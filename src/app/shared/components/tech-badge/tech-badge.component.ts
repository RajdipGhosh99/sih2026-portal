import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tech-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge-tag" [ngClass]="badgeClass">
      {{ tech }}
    </span>
  `,
  styles: [`
    .badge-tag {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 500;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      background: var(--bg-subtle);
      color: var(--text-muted);
      border: 1px solid var(--border);

      &.tag-fullstack {
        background: var(--primary-subtle);
        color: var(--primary);
        border-color: rgba(2, 132, 199, 0.2);
      }

      &.tag-ai {
        background: rgba(99, 102, 241, 0.1);
        color: var(--accent-indigo);
        border-color: rgba(99, 102, 241, 0.25);
      }

      &.tag-hardware {
        background: rgba(217, 119, 6, 0.1);
        color: var(--accent-amber);
        border-color: rgba(217, 119, 6, 0.25);
      }

      &.tag-db {
        background: rgba(5, 150, 105, 0.1);
        color: var(--accent-green);
        border-color: rgba(5, 150, 105, 0.25);
      }
    }
  `]
})
export class TechBadgeComponent {
  @Input({ required: true }) tech!: string;
  @Input() type?: string;

  get badgeClass(): string {
    if (this.type === 'fullstack') return 'tag-fullstack';
    if (this.type === 'ai') return 'tag-ai';
    if (this.type === 'hardware') return 'tag-hardware';
    if (this.type === 'emerald' || this.type === 'db') return 'tag-db';

    const t = this.tech.toLowerCase();
    if (t.includes('angular') || t.includes('react') || t.includes('node') || t.includes('express') || t.includes('full stack') || t.includes('fastapi') || t.includes('pwa')) {
      return 'tag-fullstack';
    }
    if (t.includes('python') || t.includes('pytorch') || t.includes('ai') || t.includes('ml') || t.includes('vision') || t.includes('yolo') || t.includes('nlp')) {
      return 'tag-ai';
    }
    if (t.includes('esp32') || t.includes('stm32') || t.includes('sensor') || t.includes('hardware') || t.includes('lora')) {
      return 'tag-hardware';
    }
    if (t.includes('postgres') || t.includes('mongo') || t.includes('database') || t.includes('gis')) {
      return 'tag-db';
    }
    return '';
  }
}
