import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class BookmarkService {
  private platformId = inject(PLATFORM_ID);
  private readonly BOOKMARKS_KEY = 'sih2026_bookmarks';
  private readonly COMPARE_KEY = 'sih2026_compare';

  bookmarks = signal<string[]>([]);
  compareList = signal<string[]>([]);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadFromStorage();
    }
  }

  private loadFromStorage(): void {
    try {
      const savedBookmarks = localStorage.getItem(this.BOOKMARKS_KEY);
      if (savedBookmarks) {
        this.bookmarks.set(JSON.parse(savedBookmarks));
      }
      const savedCompare = localStorage.getItem(this.COMPARE_KEY);
      if (savedCompare) {
        this.compareList.set(JSON.parse(savedCompare));
      }
    } catch (e) {
      console.warn('LocalStorage not available', e);
    }
  }

  isBookmarked(psNumber: string): boolean {
    return this.bookmarks().includes(psNumber);
  }

  toggleBookmark(psNumber: string): boolean {
    const current = this.bookmarks();
    let updated: string[];
    let isAdded = false;

    if (current.includes(psNumber)) {
      updated = current.filter(id => id !== psNumber);
    } else {
      updated = [...current, psNumber];
      isAdded = true;
    }

    this.bookmarks.set(updated);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.BOOKMARKS_KEY, JSON.stringify(updated));
    }
    return isAdded;
  }

  isInCompare(psNumber: string): boolean {
    return this.compareList().includes(psNumber);
  }

  toggleCompare(psNumber: string): boolean {
    const current = this.compareList();
    if (current.includes(psNumber)) {
      const updated = current.filter(id => id !== psNumber);
      this.compareList.set(updated);
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(this.COMPARE_KEY, JSON.stringify(updated));
      }
      return false;
    } else {
      if (current.length >= 3) {
        return false; // Max 3 items
      }
      const updated = [...current, psNumber];
      this.compareList.set(updated);
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(this.COMPARE_KEY, JSON.stringify(updated));
      }
      return true;
    }
  }

  clearCompare(): void {
    this.compareList.set([]);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.COMPARE_KEY);
    }
  }
}
