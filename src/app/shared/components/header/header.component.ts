import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { PsDataService } from '../../../core/services/ps-data.service';
import { BookmarkService } from '../../../core/services/bookmark.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  template: `
    <header class="navbar navbar-expand-lg navbar-dark sticky-top custom-navbar">
      <div class="container-xxl">
        <!-- Brand Logo -->
        <a routerLink="/" class="navbar-brand d-flex align-items-center gap-2">
          <div class="logo-box">
            <i class="bi bi-lightning-charge-fill text-warning fs-5"></i>
          </div>
          <div class="d-flex flex-column">
            <span class="fw-bolder brand-title">SIH 2026</span>
            <span class="brand-sub">Skill Navigator & Architect</span>
          </div>
        </a>

        <!-- Quick Search (Center) -->
        <div class="search-box-wrapper mx-auto d-none d-md-block">
          <div class="input-group">
            <span class="input-group-text bg-dark border-secondary text-secondary">
              <i class="bi bi-search"></i>
            </span>
            <input 
              type="text" 
              class="form-control bg-dark text-light border-secondary shadow-none search-input" 
              placeholder="Search 229 PS by title, ID (SIH26044), theme, tech..."
              [ngModel]="psService.filterState().searchQuery"
              (ngModelChange)="onSearchChange($event)"
            />
            @if (psService.filterState().searchQuery) {
              <button class="btn btn-outline-secondary" type="button" (click)="psService.setSearchQuery('')">
                <i class="bi bi-x-lg"></i>
              </button>
            }
          </div>
        </div>

        <!-- Nav Links & Badges -->
        <div class="d-flex align-items-center gap-3">
          <nav class="nav nav-pills d-none d-lg-flex">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link text-light">
              <i class="bi bi-compass me-1"></i> Explore PS
            </a>
            <a routerLink="/ranked" routerLinkActive="active" class="nav-link text-light">
              <i class="bi bi-trophy-fill text-warning me-1"></i> Top 10 Portals
            </a>
            <a routerLink="/skills" routerLinkActive="active" class="nav-link text-light">
              <i class="bi bi-journal-code me-1"></i> Tech Roadmaps
            </a>
            <a routerLink="/compare" routerLinkActive="active" class="nav-link text-light position-relative">
              <i class="bi bi-layout-split me-1"></i> Compare
              @if (bookmarkService.compareList().length > 0) {
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {{ bookmarkService.compareList().length }}
                </span>
              }
            </a>
          </nav>

          <!-- Saved Bookmarks Counter -->
          <a routerLink="/compare" class="btn btn-sm btn-outline-info rounded-pill px-3 py-1 d-flex align-items-center gap-1">
            <i class="bi bi-bookmark-star-fill text-warning"></i>
            <span class="fw-bold">{{ bookmarkService.bookmarks().length }}</span>
            <span class="d-none d-sm-inline">Saved</span>
          </a>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .custom-navbar {
      background: rgba(15, 23, 42, 0.9) !important;
      backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding: 0.75rem 0;
    }

    .logo-box {
      width: 38px;
      height: 38px;
      background: linear-gradient(135deg, #1e293b, #0f172a);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .brand-title {
      font-size: 1.15rem;
      background: linear-gradient(90deg, #38bdf8, #818cf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1.1;
    }

    .brand-sub {
      font-size: 0.7rem;
      color: #94a3b8;
      font-weight: 500;
    }

    .search-box-wrapper {
      width: 100%;
      max-width: 440px;

      .search-input {
        border-radius: 0 9999px 9999px 0;
        font-size: 0.85rem;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
        &:focus {
          border-color: #38bdf8;
        }
      }

      .input-group-text {
        border-radius: 9999px 0 0 9999px;
      }
    }

    .nav-pills .nav-link {
      font-size: 0.85rem;
      font-weight: 600;
      padding: 0.45rem 0.85rem;
      border-radius: 8px;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.06);
      }

      &.active {
        background: rgba(56, 189, 248, 0.15);
        color: #38bdf8 !important;
        border: 1px solid rgba(56, 189, 248, 0.3);
      }
    }
  `]
})
export class HeaderComponent {
  psService = inject(PsDataService);
  bookmarkService = inject(BookmarkService);
  private router = inject(Router);

  onSearchChange(q: string): void {
    this.psService.setSearchQuery(q);
    if (q && this.router.url !== '/') {
      this.router.navigate(['/']);
    }
  }
}
