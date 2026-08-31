import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tech-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge rounded-pill fw-semibold custom-badge" [ngClass]="badgeClass">
      <i class="bi" [ngClass]="badgeIcon"></i>
      {{ tech }}
    </span>
  `,
  styles: [`
    .custom-badge {
      font-size: 0.75rem;
      padding: 0.35rem 0.65rem;
      letter-spacing: 0.02em;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      border: 1px solid transparent;

      &.badge-frontend {
        background: rgba(59, 130, 246, 0.15);
        color: #60a5fa;
        border-color: rgba(59, 130, 246, 0.3);
      }

      &.badge-backend {
        background: rgba(16, 185, 129, 0.15);
        color: #34d399;
        border-color: rgba(16, 185, 129, 0.3);
      }

      &.badge-aiml {
        background: rgba(168, 85, 247, 0.15);
        color: #c084fc;
        border-color: rgba(168, 85, 247, 0.3);
      }

      &.badge-hardware {
        background: rgba(245, 158, 11, 0.15);
        color: #fbbf24;
        border-color: rgba(245, 158, 11, 0.3);
      }

      &.badge-database {
        background: rgba(236, 72, 153, 0.15);
        color: #f472b6;
        border-color: rgba(236, 72, 153, 0.3);
      }

      &.badge-cyber {
        background: rgba(239, 68, 68, 0.15);
        color: #f87171;
        border-color: rgba(239, 68, 68, 0.3);
      }

      &.badge-default {
        background: rgba(148, 163, 184, 0.15);
        color: #cbd5e1;
        border-color: rgba(148, 163, 184, 0.3);
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
    if (t.includes('angular') || t.includes('react') || t.includes('pwa') || t.includes('tailwind') || t.includes('three.js') || t.includes('leaflet') || t.includes('mapbox')) return 'badge-frontend';
    if (t.includes('node') || t.includes('express') || t.includes('fastapi') || t.includes('django') || t.includes('rest') || t.includes('websocket')) return 'badge-backend';
    if (t.includes('pytorch') || t.includes('tensorflow') || t.includes('yolo') || t.includes('ai') || t.includes('ml') || t.includes('nlp') || t.includes('vision') || t.includes('llm') || t.includes('rag')) return 'badge-aiml';
    if (t.includes('esp32') || t.includes('stm32') || t.includes('sensor') || t.includes('drone') || t.includes('robot') || t.includes('lora') || t.includes('mcu') || t.includes('jetson') || t.includes('hardware')) return 'badge-hardware';
    if (t.includes('postgres') || t.includes('mongo') || t.includes('redis') || t.includes('database') || t.includes('ipfs')) return 'badge-database';
    if (t.includes('crypto') || t.includes('cyber') || t.includes('forensic') || t.includes('blockchain') || t.includes('security') || t.includes('pcap')) return 'badge-cyber';
    return 'badge-default';
  }

  get badgeIcon(): string {
    const cls = this.badgeClass;
    if (cls === 'badge-frontend') return 'bi-window-stack';
    if (cls === 'badge-backend') return 'bi-hdd-network';
    if (cls === 'badge-aiml') return 'bi-cpu';
    if (cls === 'badge-hardware') return 'bi-motherboard';
    if (cls === 'badge-database') return 'bi-database';
    if (cls === 'badge-cyber') return 'bi-shield-lock';
    return 'bi-tag';
  }
}
