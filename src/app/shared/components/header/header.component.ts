import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { PsDataService } from '../../../core/services/ps-data.service';
import { BookmarkService } from '../../../core/services/bookmark.service';
import { ThemeService } from '../../../core/services/theme.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  template: `
    <header class="site-navbar sticky-top">
      <div class="container-xl d-flex align-items-center justify-content-between gap-3">
        <!-- Brand -->
        <a routerLink="/" class="navbar-brand d-flex align-items-center gap-2 text-decoration-none">
          <div class="brand-badge">
            <i class="bi bi-code-square"></i>
          </div>
          <div class="brand-text">
            <span class="fw-bold fs-5 text-title">SIH 2026</span>
            <span class="sub-title">Project Navigator</span>
          </div>
        </a>

        <!-- Search Bar -->
        <div class="search-container d-none d-md-block flex-grow-1 mx-lg-4" style="max-width: 460px;">
          <div class="input-group input-group-sm">
            <span class="input-group-text border-end-0 bg-subtle">
              <i class="bi bi-search text-muted"></i>
            </span>
            <input 
              type="text" 
              class="form-control border-start-0 bg-subtle text-title shadow-none" 
              placeholder="Search problem statements (e.g. SIH26044, crop, drone)..."
              [ngModel]="psService.filterState().searchQuery"
              (ngModelChange)="onSearchChange($event)"
            />
            @if (psService.filterState().searchQuery) {
              <button class="btn btn-outline-secondary border-start-0" type="button" (click)="psService.setSearchQuery('')">
                <i class="bi bi-x"></i>
              </button>
            }
          </div>
        </div>

        <!-- Navigation Links -->
        <nav class="d-flex align-items-center gap-1">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item-link">
            Problem Statements
          </a>
          <a routerLink="/ranked" routerLinkActive="active" class="nav-item-link">
            Top 10 Ranked
          </a>
          <a routerLink="/skills" routerLinkActive="active" class="nav-item-link d-none d-sm-inline-block">
            Tech Stacks
          </a>
          <a routerLink="/compare" routerLinkActive="active" class="nav-item-link position-relative">
            Compare
            @if (bookmarkService.compareList().length > 0) {
              <span class="badge rounded-pill bg-danger ms-1">{{ bookmarkService.compareList().length }}</span>
            }
          </a>

          <!-- Theme Toggle (Light / Dark) -->
          <button 
            class="btn btn-sm theme-toggle-btn ms-2" 
            (click)="themeService.toggleTheme()" 
            [title]="themeService.currentTheme() === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          >
            <i class="bi" [ngClass]="themeService.currentTheme() === 'dark' ? 'bi-sun-fill text-warning' : 'bi-moon-stars-fill text-primary'"></i>
          </button>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .site-navbar {
      background: var(--navbar-bg);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-color);
      padding: 0.75rem 0;
      transition: background-color 0.2s ease, border-color 0.2s ease;
    }

    .brand-badge {
      width: 34px;
      height: 34px;
      background: var(--primary);
      color: #ffffff;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
    }

    .brand-text {
      display: flex;
      flex-direction: column;
      line-height: 1.1;

      .text-title {
        color: var(--text-primary);
        font-weight: 800;
        letter-spacing: -0.01em;
      }

      .sub-title {
        font-size: 0.7rem;
        color: var(--text-secondary);
        font-weight: 500;
      }
    }

    .bg-subtle {
      background-color: var(--bg-surface-subtle) !important;
      border-color: var(--border-color) !important;
      color: var(--text-primary) !important;
    }

    .nav-item-link {
      color: var(--text-secondary);
      font-size: 0.85rem;
      font-weight: 600;
      text-decoration: none;
      padding: 0.45rem 0.75rem;
      border-radius: 6px;
      transition: all 0.15s ease;

      &:hover {
        color: var(--text-primary);
        background: var(--bg-surface-subtle);
      }

      &.active {
        color: var(--primary);
        background: var(--badge-bg);
        font-weight: 700;
      }
    }

    .theme-toggle-btn {
      background: var(--bg-surface-subtle);
      border: 1px solid var(--border-color);
      color: var(--text-primary);
      width: 34px;
      height: 34px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.15s ease;

      &:hover {
        background: var(--border-color);
      }
    }
  `]
})
export class HeaderComponent {
  psService = inject(PsDataService);
  bookmarkService = inject(BookmarkService);
  themeService = inject(ThemeService);
  private router = inject(Router);

  onSearchChange(q: string): void {
    this.psService.setSearchQuery(q);
    if (q && this.router.url !== '/') {
      this.router.navigate(['/']);
    }
  }
}
