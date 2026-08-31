import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

export type AppTheme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private doc = inject(DOCUMENT);
  private readonly THEME_KEY = 'sih2026_portal_theme';

  currentTheme = signal<AppTheme>('dark');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.initTheme();
    }
  }

  private initTheme(): void {
    const saved = localStorage.getItem(this.THEME_KEY) as AppTheme | null;
    if (saved === 'light' || saved === 'dark') {
      this.setTheme(saved);
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark ? 'dark' : 'dark');
    }
  }

  toggleTheme(): void {
    const next = this.currentTheme() === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  }

  setTheme(theme: AppTheme): void {
    this.currentTheme.set(theme);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.THEME_KEY, theme);
      const root = this.doc.documentElement;
      root.setAttribute('data-theme', theme);
      root.setAttribute('data-bs-theme', theme);
      root.classList.remove('theme-light', 'theme-dark');
      root.classList.add(`theme-${theme}`);
    }
  }
}
