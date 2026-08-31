import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareService } from '../../../core/services/share.service';

@Component({
  selector: 'app-share-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Share Dialog Backdrop -->
    @if (shareService.isModalOpen() && shareService.activeShareData(); as data) {
      <div class="modal-backdrop-custom" (click)="shareService.closeShare()">
        <div class="modal-dialog-custom" (click)="$event.stopPropagation()">
          <!-- Modal Header -->
          <div class="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom border-subtle">
            <div class="d-flex align-items-center gap-2">
              <i class="bi bi-share-fill text-primary"></i>
              <h5 class="fs-6 fw-bold text-main m-0">Share</h5>
            </div>
            <button type="button" class="btn-close-custom" (click)="shareService.closeShare()" aria-label="Close">✕</button>
          </div>

          <!-- Content Title -->
          <div class="mb-3">
            <span class="text-muted small d-block" style="font-size: 0.75rem;">Sharing Item:</span>
            <strong class="text-main small d-block text-truncate" title="{{ data.title }}">{{ data.title }}</strong>
          </div>

          <!-- Copy URL Box -->
          <div class="mb-3">
            <label class="form-label text-muted small fw-semibold">Direct Link</label>
            <div class="input-group input-group-sm">
              <input 
                type="text" 
                class="form-control input-evergreen shadow-none" 
                [value]="data.url" 
                readonly
              />
              <button class="btn btn-primary" type="button" (click)="shareService.copyLink(data.url)">
                <i class="bi bi-clipboard me-1"></i> Copy
              </button>
            </div>
          </div>

          <!-- Social Share Buttons -->
          <div class="mb-2">
            <span class="text-muted small d-block mb-2 fw-semibold">Share via:</span>
            <div class="d-grid grid-social-buttons gap-2">
              <!-- WhatsApp -->
              <a [href]="getWhatsAppUrl(data)" target="_blank" rel="noopener" class="social-btn whatsapp-btn">
                <i class="bi bi-whatsapp"></i> WhatsApp
              </a>

              <!-- Twitter / X -->
              <a [href]="getTwitterUrl(data)" target="_blank" rel="noopener" class="social-btn twitter-btn">
                <i class="bi bi-twitter-x"></i> Twitter / X
              </a>

              <!-- LinkedIn -->
              <a [href]="getLinkedInUrl(data)" target="_blank" rel="noopener" class="social-btn linkedin-btn">
                <i class="bi bi-linkedin"></i> LinkedIn
              </a>

              <!-- Telegram -->
              <a [href]="getTelegramUrl(data)" target="_blank" rel="noopener" class="social-btn telegram-btn">
                <i class="bi bi-telegram"></i> Telegram
              </a>

              <!-- Email -->
              <a [href]="getEmailUrl(data)" class="social-btn email-btn">
                <i class="bi bi-envelope-fill"></i> Email
              </a>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- Global Toast Notification -->
    @if (shareService.toastMessage(); as msg) {
      <div class="toast-floating-alert">
        <i class="bi bi-check-circle-fill text-success me-2"></i>
        <span>{{ msg }}</span>
      </div>
    }
  `,
  styles: [`
    .modal-backdrop-custom {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: var(--modal-overlay);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1100;
      padding: 1rem;
      backdrop-filter: blur(4px);
    }

    .modal-dialog-custom {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 8px;
      width: 100%;
      max-width: 440px;
      padding: 1.25rem;
      box-shadow: var(--card-shadow-hover);
    }

    .btn-close-custom {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 1.1rem;
      padding: 0;
      line-height: 1;

      &:hover {
        color: var(--text-main);
      }
    }

    .grid-social-buttons {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
    }

    .social-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      padding: 0.45rem 0.75rem;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.15s ease;
      border: 1px solid var(--border);
      background: var(--bg-subtle);
      color: var(--text-main);

      &:hover {
        transform: translateY(-1px);
        color: var(--text-main);
      }

      &.whatsapp-btn:hover { background: #25d366; color: white; border-color: #25d366; }
      &.twitter-btn:hover { background: #000000; color: white; border-color: #000000; }
      &.linkedin-btn:hover { background: #0a66c2; color: white; border-color: #0a66c2; }
      &.telegram-btn:hover { background: #229ed9; color: white; border-color: #229ed9; }
      &.email-btn:hover { background: var(--border-strong); }
    }

    .toast-floating-alert {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 1200;
      background: var(--bg-card-elevated);
      color: var(--text-main);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 0.75rem 1.25rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
      font-size: 0.875rem;
      font-weight: 500;
      animation: slideUp 0.2s ease-out;
    }

    @keyframes slideUp {
      from { transform: translateY(12px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .border-subtle { border-color: var(--border) !important; }
  `]
})
export class ShareModalComponent {
  shareService = inject(ShareService);

  getWhatsAppUrl(data: any): string {
    const text = encodeURIComponent(`${data.title}

${data.url}`);
    return `https://api.whatsapp.com/send?text=${text}`;
  }

  getTwitterUrl(data: any): string {
    const text = encodeURIComponent(`Explore this SIH 2026 Problem Statement: ${data.title}`);
    const url = encodeURIComponent(data.url);
    return `https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=SIH2026,Hackathon`;
  }

  getLinkedInUrl(data: any): string {
    const url = encodeURIComponent(data.url);
    return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
  }

  getTelegramUrl(data: any): string {
    const text = encodeURIComponent(data.title);
    const url = encodeURIComponent(data.url);
    return `https://t.me/share/url?url=${url}&text=${text}`;
  }

  getEmailUrl(data: any): string {
    const subject = encodeURIComponent(`SIH 2026: ${data.title}`);
    const body = encodeURIComponent(`Check out this SIH 2026 problem statement and solution architecture:

${data.title}

Link: ${data.url}`);
    return `mailto:?subject=${subject}&body=${body}`;
  }
}
