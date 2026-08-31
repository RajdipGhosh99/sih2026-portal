import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

export interface ShareDataPayload {
  title: string;
  text?: string;
  url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  private platformId = inject(PLATFORM_ID);
  private doc = inject(DOCUMENT);

  activeShareData = signal<ShareDataPayload | null>(null);
  isModalOpen = signal(false);
  toastMessage = signal<string | null>(null);

  private toastTimeout: any;

  /**
   * Open the share modal or use native share
   */
  openShare(payload: ShareDataPayload): void {
    if (!payload.url && isPlatformBrowser(this.platformId)) {
      payload.url = window.location.href;
    }
    this.activeShareData.set(payload);
    this.isModalOpen.set(true);
  }

  closeShare(): void {
    this.isModalOpen.set(false);
    this.activeShareData.set(null);
  }

  /**
   * Copy link directly and trigger toast notification
   */
  async copyLink(url?: string): Promise<boolean> {
    if (!isPlatformBrowser(this.platformId)) return false;

    const targetUrl = url || window.location.href;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(targetUrl);
      } else {
        // Fallback for older environments
        const textArea = this.doc.createElement('textarea');
        textArea.value = targetUrl;
        this.doc.body.appendChild(textArea);
        textArea.select();
        this.doc.execCommand('copy');
        this.doc.body.removeChild(textArea);
      }
      this.showToast('Link copied to clipboard!');
      return true;
    } catch (err) {
      this.showToast('Failed to copy link');
      return false;
    }
  }

  /**
   * Native device share if supported
   */
  async nativeShare(payload: ShareDataPayload): Promise<boolean> {
    if (isPlatformBrowser(this.platformId) && navigator.share) {
      try {
        await navigator.share({
          title: payload.title,
          text: payload.text || payload.title,
          url: payload.url || window.location.href
        });
        return true;
      } catch (err) {
        // User cancelled or share failed, fallback to modal
        return false;
      }
    }
    return false;
  }

  showToast(msg: string, durationMs: number = 3000): void {
    this.toastMessage.set(msg);
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.toastMessage.set(null);
    }, durationMs);
  }
}
