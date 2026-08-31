import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="site-footer mt-5">
      <div class="container-xl py-4">
        <div class="row g-4 justify-content-between align-items-center">
          <div class="col-md-6">
            <div class="d-flex align-items-center gap-2 mb-1">
              <i class="bi bi-code-square text-primary"></i>
              <span class="fw-bold text-title">SIH 2026 Project Navigator</span>
            </div>
            <p class="text-secondary small mb-0">
              An open, student-friendly exploration platform for Smart India Hackathon 2026 problem statements.
            </p>
          </div>

          <div class="col-md-6 text-md-end">
            <div class="d-flex flex-wrap justify-content-md-end gap-3 small text-muted mb-1">
              <a routerLink="/" class="footer-link">Home</a>
              <a routerLink="/ranked" class="footer-link">Top 10 Portals</a>
              <a routerLink="/skills" class="footer-link">Tech Stacks</a>
              <a routerLink="/compare" class="footer-link">Compare</a>
              <a href="/sitemap.xml" target="_blank" class="footer-link">Sitemap</a>
            </div>
            <span class="small text-muted">© 2026 Rajdip Ghosh. All Rights Reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .site-footer {
      background: var(--bg-surface);
      border-top: 1px solid var(--border-color);
      color: var(--text-secondary);
      transition: background-color 0.2s ease, border-color 0.2s ease;
    }

    .text-title {
      color: var(--text-primary);
    }

    .footer-link {
      color: var(--text-secondary);
      text-decoration: none;

      &:hover {
        color: var(--primary);
      }
    }
  `]
})
export class FooterComponent {}
