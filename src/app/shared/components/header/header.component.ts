import { Component, inject, signal } from '@angular/core';
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
    <header class="app-header sticky-top">
      <div class="container-xl">
        <div class="d-flex align-items-center justify-content-between py-2 gap-3">
          <!-- Logo & Brand -->
          <a routerLink="/" class="brand-link d-flex align-items-center gap-2 text-decoration-none">
            <span class="brand-icon"><i class="bi bi-layers-fill"></i></span>
            <div class="d-flex flex-column">
              <span class="brand-title">SIH 2026 Portal</span>
              <span class="brand-tagline d-none d-sm-inline">Problem Statements & Architecture Hub</span>
            </div>
          </a>

          <!-- Search (Desktop / Tablet) -->
          <div class="search-wrap d-none d-md-block flex-grow-1 mx-3" style="max-width: 420px;">
            <div class="input-group input-group-sm">
              <span class="input-group-text bg-search border-end-0">
                <i class="bi bi-search text-muted"></i>
              </span>
              <input 
                type="text" 
                class="form-control border-start-0 input-evergreen shadow-none" 
                placeholder="Search by title, PS ID (SIH26044), skill..."
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

          <!-- Nav Links & Actions -->
          <div class="d-flex align-items-center gap-2">
            <nav class="d-none d-lg-flex align-items-center gap-1">
              <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-btn">
                Challenges
              </a>
              <a routerLink="/ranked" routerLinkActive="active" class="nav-btn">
                Top 10 Ranked
              </a>
              <a routerLink="/skills" routerLinkActive="active" class="nav-btn">
                Tech Roadmaps
              </a>
              <a routerLink="/compare" routerLinkActive="active" class="nav-btn position-relative">
                Compare
                @if (bookmarkService.compareList().length > 0) {
                  <span class="badge rounded-pill bg-danger ms-1">{{ bookmarkService.compareList().length }}</span>
                }
              </a>
            </nav>

            <!-- Theme Switcher -->
            <button 
              class="theme-btn" 
              (click)="themeService.toggleTheme()" 
              [title]="themeService.currentTheme() === 'dark' ? 'Switch to Light theme' : 'Switch to Dark theme'"
              aria-label="Toggle color theme"
            >
              <i class="bi" [ngClass]="themeService.currentTheme() === 'dark' ? 'bi-sun-fill text-warning' : 'bi-moon-stars-fill text-primary'"></i>
            </button>

            <!-- Mobile Menu Toggle Button -->
            <button 
              class="mobile-toggle-btn d-lg-none" 
              (click)="mobileMenuOpen.set(!mobileMenuOpen())"
              aria-label="Toggle navigation"
            >
              <i class="bi" [ngClass]="mobileMenuOpen() ? 'bi-x-lg' : 'bi-list'"></i>
            </button>
          </div>
        </div>

        <!-- Mobile Search (below brand on mobile) -->
        <div class="d-md-none pb-2 pt-1">
          <div class="input-group input-group-sm">
            <span class="input-group-text bg-search border-end-0">
              <i class="bi bi-search text-muted"></i>
            </span>
            <input 
              type="text" 
              class="form-control border-start-0 input-evergreen shadow-none" 
              placeholder="Search challenges..."
              [ngModel]="psService.filterState().searchQuery"
              (ngModelChange)="onSearchChange($event)"
            />
          </div>
        </div>

        <!-- Mobile Drawer Navigation -->
        @if (mobileMenuOpen()) {
          <div class="mobile-nav-panel d-lg-none py-3 border-top border-subtle">
            <div class="d-flex flex-column gap-2">
              <a routerLink="/" (click)="mobileMenuOpen.set(false)" class="mobile-nav-item">
                <i class="bi bi-grid-fill me-2"></i> All Challenges
              </a>
              <a routerLink="/ranked" (click)="mobileMenuOpen.set(false)" class="mobile-nav-item">
                <i class="bi bi-trophy-fill me-2"></i> Top 10 Ranked Portals
              </a>
              <a routerLink="/skills" (click)="mobileMenuOpen.set(false)" class="mobile-nav-item">
                <i class="bi bi-journal-code me-2"></i> Department Tech Roadmaps
              </a>
              <a routerLink="/compare" (click)="mobileMenuOpen.set(false)" class="mobile-nav-item">
                <i class="bi bi-layout-split me-2"></i> Side-by-Side Comparator
              </a>
            </div>
          </div>
        }
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      background-color: var(--navbar-bg);
      border-bottom: 1px solid var(--border);
      transition: background-color 0.2s ease, border-color 0.2s ease;
    }

    .brand-icon {
      width: 32px;
      height: 32px;
      background: var(--primary);
      color: #ffffff;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
    }

    .brand-title {
      font-weight: 700;
      font-size: 1.05rem;
      color: var(--text-main);
      line-height: 1.1;
    }

    .brand-tagline {
      font-size: 0.7rem;
      color: var(--text-subtle);
    }

    .bg-search {
      background-color: var(--bg-card);
      border-color: var(--border);
    }

    .nav-btn {
      color: var(--text-muted);
      font-size: 0.875rem;
      font-weight: 500;
      padding: 0.4rem 0.75rem;
      border-radius: 6px;
      text-decoration: none;
      transition: all 0.15s ease;

      &:hover {
        color: var(--text-main);
        background: var(--bg-subtle);
      }

      &.active {
        color: var(--primary);
        background: var(--primary-subtle);
        font-weight: 600;
      }
    }

    .theme-btn, .mobile-toggle-btn {
      background: var(--bg-card);
      border: 1px solid var(--border);
      color: var(--text-main);
      width: 34px;
      height: 34px;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 0.95rem;
      transition: background 0.15s ease;

      &:hover {
        background: var(--bg-subtle);
      }
    }

    .mobile-nav-item {
      color: var(--text-main);
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 500;
      font-size: 0.9rem;

      &:hover {
        background: var(--bg-subtle);
      }
    }

    .border-subtle {
      border-color: var(--border) !important;
    }
  `]
})
export class HeaderComponent {
  psService = inject(PsDataService);
  bookmarkService = inject(BookmarkService);
  themeService = inject(ThemeService);
  private router = inject(Router);

  mobileMenuOpen = signal(false);

  onSearchChange(q: string): void {
    this.psService.setSearchQuery(q);
    if (q && this.router.url !== '/') {
      this.router.navigate(['/']);
    }
  }
}
