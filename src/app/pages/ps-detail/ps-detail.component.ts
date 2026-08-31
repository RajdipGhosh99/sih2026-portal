import { PsCardComponent } from '../../shared/components/ps-card/ps-card.component';
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PsDataService } from '../../core/services/ps-data.service';
import { SeoService } from '../../core/services/seo.service';
import { BookmarkService } from '../../core/services/bookmark.service';
import { ProblemStatement } from '../../core/models/problem-statement.model';
import { TechBadgeComponent } from '../../shared/components/tech-badge/tech-badge.component';
import { PitchModalComponent } from '../../shared/components/pitch-modal/pitch-modal.component';

@Component({
  selector: 'app-ps-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, TechBadgeComponent, PitchModalComponent, PsCardComponent],
  template: `
    @if (ps(); as item) {
      <div class="ps-detail-page">
        <!-- Breadcrumb Bar -->
        <nav class="breadcrumb-bar">
          <a routerLink="/">← Back to All Problem Statements</a>
          <span class="sep">/</span>
          <span class="current">{{ item.ps_number }}</span>
        </nav>

        <!-- Detail Hero Header -->
        <header class="detail-header" [class.ranked-header]="item.rank && item.rank <= 10">
          <div class="header-badges">
            <span class="ps-number-pill">{{ item.ps_number }}</span>
            <span class="category-pill" [ngClass]="item.category.toLowerCase()">
              {{ item.category === 'Hardware' ? '⚡ Hardware' : '💻 Software' }}
            </span>
            <span class="theme-pill">🏷️ {{ item.theme }}</span>
            @if (item.rank) {
              <span class="rank-badge">🏆 Curated Rank #{{ item.rank }}</span>
            }
          </div>

          <h1 class="main-title">{{ item.title }}</h1>

          <div class="org-metadata">
            <div class="meta-item">
              <span class="lbl">Organization / Ministry</span>
              <strong>{{ item.org }}</strong>
            </div>
            @if (item.department) {
              <div class="meta-item">
                <span class="lbl">Department</span>
                <strong>{{ item.department }}</strong>
              </div>
            }
            <div class="meta-item">
              <span class="lbl">Ideas Submitted</span>
              <strong>{{ item.ideas }}</strong>
            </div>
            <div class="meta-item">
              <span class="lbl">Submission Deadline</span>
              <strong>{{ item.deadline }}</strong>
            </div>
          </div>

          <!-- Action Buttons Bar -->
          <div class="header-cta-bar">
            <button class="btn-pitch-deck" (click)="isPitchModalOpen.set(true)">
              📑 6-Slide Pitch Presentation Guide
            </button>
            <button 
              class="btn-bookmark" 
              [class.saved]="bookmarkService.isBookmarked(item.ps_number)"
              (click)="bookmarkService.toggleBookmark(item.ps_number)"
            >
              {{ bookmarkService.isBookmarked(item.ps_number) ? '★ Bookmarked' : '☆ Save Problem Statement' }}
            </button>
            <button 
              class="btn-compare"
              [class.active]="bookmarkService.isInCompare(item.ps_number)"
              (click)="bookmarkService.toggleCompare(item.ps_number)"
            >
              ⚖️ {{ bookmarkService.isInCompare(item.ps_number) ? 'Remove from Compare' : 'Add to Compare' }}
            </button>
            @if (item.dataset_link) {
              <a [href]="item.dataset_link" target="_blank" rel="noopener" class="btn-dataset">
                🔗 Official Dataset Link ↗
              </a>
            }
          </div>
        </header>

        <!-- Navigation Tabs -->
        <div class="tab-nav-container">
          <div class="tab-nav">
            <button [class.active]="activeTab() === 'overview'" (click)="activeTab.set('overview')">
              📋 Problem & Challenges
            </button>
            <button [class.active]="activeTab() === 'architecture'" (click)="activeTab.set('architecture')">
              🏗️ System Architecture & Stack
            </button>
            <button [class.active]="activeTab() === 'solutions'" (click)="activeTab.set('solutions')">
              💡 Solution Angles & USPs
            </button>
            <button [class.active]="activeTab() === 'pitch'" (click)="activeTab.set('pitch')">
              🎯 6-Slide Pitch Deck
            </button>
          </div>
        </div>

        <!-- Tab 1: Overview & Official Background -->
        @if (activeTab() === 'overview') {
          <section class="tab-pane">
            <div class="card-box">
              <h2>Official Background & Problem Statement</h2>
              <div class="description-text">
                <p>{{ item.description }}</p>
              </div>
            </div>

            <!-- Key Challenges -->
            <div class="card-box">
              <h2>Key Technical Challenges</h2>
              <ul class="challenges-list">
                @for (ch of item.keyChallenges; track ch) {
                  <li>
                    <span class="bullet-icon">⚠️</span>
                    <span>{{ ch }}</span>
                  </li>
                }
              </ul>
            </div>

            <!-- Expected Deliverables -->
            <div class="card-box">
              <h2>Expected SIH Deliverables</h2>
              <div class="deliverables-grid">
                @for (del of item.expectedDeliverables; track del) {
                  <div class="deliverable-item">
                    <span class="del-icon">📦</span>
                    <span>{{ del }}</span>
                  </div>
                }
              </div>
            </div>
          </section>
        }

        <!-- Tab 2: System Architecture & Recommended Tech Stack -->
        @if (activeTab() === 'architecture') {
          <section class="tab-pane">
            <div class="card-box">
              <h2>Recommended System Architecture Blueprint</h2>
              <p class="section-intro">
                A modular, high-availability architecture tailored to satisfy SIH jury evaluation metrics for scalability, performance, and security.
              </p>

              <div class="architecture-grid">
                <!-- Frontend Layer -->
                <div class="arch-col">
                  <div class="arch-header frontend">
                    <span class="layer-title">🖥️ Client / Frontend Layer</span>
                  </div>
                  <div class="arch-body">
                    <div class="tags">
                      @for (t of item.architecture.frontend; track t) {
                        <app-tech-badge [tech]="t" type="frontend"></app-tech-badge>
                      }
                    </div>
                    <p class="arch-note">Responsive web and PWA clients with server-side rendering for optimal SEO and offline sync.</p>
                  </div>
                </div>

                <!-- Backend Layer -->
                <div class="arch-col">
                  <div class="arch-header backend">
                    <span class="layer-title">⚙️ Backend & API Services</span>
                  </div>
                  <div class="arch-body">
                    <div class="tags">
                      @for (t of item.architecture.backend; track t) {
                        <app-tech-badge [tech]="t" type="backend"></app-tech-badge>
                      }
                    </div>
                    <p class="arch-note">Microservices architecture with REST, gRPC, and WebSockets for real-time telemetry.</p>
                  </div>
                </div>

                <!-- AI / ML Core (if applicable) -->
                @if (item.architecture.aiMl && item.architecture.aiMl.length > 0) {
                  <div class="arch-col">
                    <div class="arch-header aiml">
                      <span class="layer-title">🧠 AI/ML & Analytics Core</span>
                    </div>
                    <div class="arch-body">
                      <div class="tags">
                        @for (t of item.architecture.aiMl; track t) {
                          <app-tech-badge [tech]="t" type="aiml"></app-tech-badge>
                        }
                      </div>
                      <p class="arch-note">Deep learning models for predictive analytics, vision segmentation, and NLP assistants.</p>
                    </div>
                  </div>
                }

                <!-- Hardware Layer (if applicable) -->
                @if (item.architecture.hardware && item.architecture.hardware.length > 0) {
                  <div class="arch-col">
                    <div class="arch-header hardware">
                      <span class="layer-title">🔌 Embedded Hardware & Sensors</span>
                    </div>
                    <div class="arch-body">
                      <div class="tags">
                        @for (t of item.architecture.hardware; track t) {
                          <app-tech-badge [tech]="t" type="hardware"></app-tech-badge>
                        }
                      </div>
                      <p class="arch-note">Edge compute nodes, sensor fusion telemetry, and low-power mesh radios.</p>
                    </div>
                  </div>
                }

                <!-- Database & Storage Layer -->
                <div class="arch-col">
                  <div class="arch-header database">
                    <span class="layer-title">🗄️ Database & Storage</span>
                  </div>
                  <div class="arch-body">
                    <div class="tags">
                      @for (t of item.architecture.database; track t) {
                        <app-tech-badge [tech]="t" type="database"></app-tech-badge>
                      }
                    </div>
                    <p class="arch-note">Relational, spatial (PostGIS), and caching layers with immutable audit logs.</p>
                  </div>
                </div>

                <!-- Protocols & DevOps -->
                <div class="arch-col">
                  <div class="arch-header devops">
                    <span class="layer-title">🚀 Protocols & Deployment</span>
                  </div>
                  <div class="arch-body">
                    <div class="tags">
                      @for (t of item.architecture.cloudDevOps; track t) {
                        <app-tech-badge [tech]="t"></app-tech-badge>
                      }
                      @for (p of item.architecture.protocols; track p) {
                        <app-tech-badge [tech]="p"></app-tech-badge>
                      }
                    </div>
                    <p class="arch-note">Containerized Docker builds ready for sovereign air-gapped deployment or Gov cloud.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        }

        <!-- Tab 3: Solution Angles & Innovation Hooks -->
        @if (activeTab() === 'solutions') {
          <section class="tab-pane">
            <div class="card-box">
              <h2>Innovative Implementation Angles</h2>
              <p class="section-intro">
                Proven architectural angles designed to differentiate your submission from generic proposals.
              </p>

              <div class="solution-ideas-list">
                @for (sol of item.solutionIdeas; track sol.title) {
                  <div class="solution-card">
                    <div class="sol-top">
                      <h3>💡 {{ sol.title }}</h3>
                      <span class="hook-badge">{{ sol.hook }}</span>
                    </div>
                    <p class="sol-desc">{{ sol.description }}</p>

                    <div class="sol-features">
                      <h4>Core Capabilities:</h4>
                      <ul>
                        @for (feat of sol.keyFeatures; track feat) {
                          <li>{{ feat }}</li>
                        }
                      </ul>
                    </div>

                    <div class="sol-usp">
                      <span class="usp-icon">⭐</span>
                      <span><strong>Key Innovation Hook:</strong> {{ sol.usp }}</span>
                    </div>
                  </div>
                }
              </div>
            </div>
          </section>
        }

        <!-- Tab 4: 6-Slide Pitch Presentation Deck -->
        @if (activeTab() === 'pitch') {
          <section class="tab-pane">
            <div class="card-box">
              <div class="deck-header">
                <div>
                  <h2>Official 6-Slide Pitch Presentation Structure</h2>
                  <p>Matches the mandatory evaluation criteria for SIH 2026 idea submissions.</p>
                </div>
                <button class="btn-copy-md" (click)="copyPitchMarkdown(item)">
                  {{ copiedPitch() ? '✓ Copied Markdown!' : '📋 Copy All Slides (Markdown)' }}
                </button>
              </div>

              <div class="pitch-deck-grid">
                @for (slide of item.pitchDeck; track slide.slideNumber) {
                  <div class="pitch-slide-card">
                    <div class="slide-badge-header">
                      <span class="slide-tag">SLIDE {{ slide.slideNumber }}</span>
                      <span class="slide-category">{{ slide.slideTitle }}</span>
                    </div>
                    <h3 class="slide-main-heading">{{ slide.heading }}</h3>
                    <ul class="slide-points">
                      @for (pt of slide.bulletPoints; track pt) {
                        <li>{{ pt }}</li>
                      }
                    </ul>
                    @if (slide.callout) {
                      <div class="slide-callout-box">
                        <strong>Judge Impact:</strong> {{ slide.callout }}
                      </div>
                    }
                  </div>
                }
              </div>
            </div>
          </section>
        }

        <!-- Similar Problem Statements -->
        @if (similarStatements().length > 0) {
          <section class="similar-section">
            <h2>Related Problem Statements</h2>
            <div class="ps-grid">
              @for (sim of similarStatements(); track sim.ps_number) {
                <app-ps-card [ps]="sim"></app-ps-card>
              }
            </div>
          </section>
        }

        <!-- Pitch Modal -->
        <app-pitch-modal 
          [ps]="ps()"
          [isOpen]="isPitchModalOpen()"
          (close)="isPitchModalOpen.set(false)"
        ></app-pitch-modal>
      </div>
    } @else {
      <div class="not-found-page">
        <h2>Problem Statement Not Found</h2>
        <p>The requested problem statement ID does not exist in the SIH 2026 database.</p>
        <a routerLink="/" class="btn-primary">Browse All Problem Statements</a>
      </div>
    }
  `,
  styles: [`
    .ps-detail-page {
      max-width: 1440px;
      margin: 0 auto;
      padding: 1.5rem 1.5rem 4rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .breadcrumb-bar {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: #94a3b8;

      a {
        color: #38bdf8;
        text-decoration: none;
        font-weight: 600;
        &:hover { text-decoration: underline; }
      }
      .sep { color: #475569; }
      .current { color: #cbd5e1; font-weight: 700; }
    }

    .detail-header {
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9));
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 2.25rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);

      &.ranked-header {
        border-color: rgba(234, 179, 8, 0.4);
      }

      .header-badges {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        flex-wrap: wrap;

        .ps-number-pill {
          background: #38bdf8;
          color: #0f172a;
          font-weight: 900;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 0.85rem;
        }

        .category-pill {
          font-weight: 700;
          font-size: 0.75rem;
          padding: 4px 8px;
          border-radius: 6px;
          &.software { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
          &.hardware { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
        }

        .theme-pill {
          background: rgba(255, 255, 255, 0.08);
          color: #e2e8f0;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 6px;
        }

        .rank-badge {
          background: rgba(234, 179, 8, 0.2);
          color: #fde047;
          border: 1px solid rgba(234, 179, 8, 0.4);
          font-weight: 800;
          font-size: 0.75rem;
          padding: 4px 8px;
          border-radius: 6px;
        }
      }

      .main-title {
        font-size: 1.85rem;
        font-weight: 800;
        color: #f8fafc;
        line-height: 1.3;
        margin: 0;
      }

      .org-metadata {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.25rem;
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        padding: 1rem 1.25rem;

        .meta-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;

          .lbl { font-size: 0.75rem; color: #94a3b8; font-weight: 600; text-transform: uppercase; }
          strong { font-size: 0.95rem; color: #f1f5f9; }
        }
      }

      .header-cta-bar {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex-wrap: wrap;
        margin-top: 0.5rem;

        button, a {
          padding: 0.6rem 1.25rem;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }

        .btn-pitch-deck {
          background: #38bdf8;
          color: #0f172a;
          border: none;
          &:hover { background: #7dd3fc; }
        }

        .btn-bookmark {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #e2e8f0;
          &.saved { background: rgba(234, 179, 8, 0.2); color: #fde047; border-color: #eab308; }
          &:hover { background: rgba(255, 255, 255, 0.15); }
        }

        .btn-compare {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #e2e8f0;
          &.active { background: rgba(239, 68, 68, 0.2); color: #f87171; border-color: #ef4444; }
          &:hover { background: rgba(255, 255, 255, 0.15); }
        }

        .btn-dataset {
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #34d399;
          &:hover { background: rgba(16, 185, 129, 0.25); }
        }
      }
    }

    .tab-nav-container {
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);

      .tab-nav {
        display: flex;
        gap: 0.5rem;
        overflow-x: auto;

        button {
          background: transparent;
          border: none;
          border-bottom: 3px solid transparent;
          color: #94a3b8;
          padding: 0.75rem 1.25rem;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;

          &:hover { color: #f8fafc; }
          &.active {
            color: #38bdf8;
            border-bottom-color: #38bdf8;
          }
        }
      }
    }

    .tab-pane {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .card-box {
      background: rgba(30, 41, 59, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 1.75rem;

      h2 {
        font-size: 1.35rem;
        font-weight: 800;
        color: #f8fafc;
        margin: 0 0 1rem 0;
      }

      .section-intro {
        font-size: 0.9rem;
        color: #94a3b8;
        margin: 0 0 1.5rem 0;
      }

      .description-text p {
        font-size: 1rem;
        color: #cbd5e1;
        line-height: 1.7;
        white-space: pre-line;
      }
    }

    .challenges-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;

      li {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: #cbd5e1;
        font-size: 0.95rem;
        background: rgba(15, 23, 42, 0.5);
        padding: 0.75rem 1rem;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.05);
      }
    }

    .deliverables-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1rem;

      .deliverable-item {
        background: rgba(15, 23, 42, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.05);
        padding: 1rem;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: #f1f5f9;
        font-size: 0.9rem;
        font-weight: 600;
      }
    }

    .architecture-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.25rem;

      .arch-col {
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        overflow: hidden;

        .arch-header {
          padding: 0.75rem 1rem;
          font-weight: 800;
          font-size: 0.85rem;
          color: white;

          &.frontend { background: rgba(59, 130, 246, 0.3); color: #93c5fd; }
          &.backend { background: rgba(16, 185, 129, 0.3); color: #6ee7b7; }
          &.aiml { background: rgba(168, 85, 247, 0.3); color: #d8b4fe; }
          &.hardware { background: rgba(245, 158, 11, 0.3); color: #fde68a; }
          &.database { background: rgba(236, 72, 153, 0.3); color: #fbcfe8; }
          &.devops { background: rgba(148, 163, 184, 0.3); color: #e2e8f0; }
        }

        .arch-body {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;

          .tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.4rem;
          }

          .arch-note {
            font-size: 0.8rem;
            color: #94a3b8;
            margin: 0;
            line-height: 1.4;
          }
        }
      }
    }

    .solution-ideas-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;

      .solution-card {
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 14px;
        padding: 1.5rem;

        .sol-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 0.75rem;

          h3 { margin: 0; font-size: 1.15rem; color: #f8fafc; }
          .hook-badge {
            background: rgba(56, 189, 248, 0.15);
            color: #38bdf8;
            font-size: 0.75rem;
            font-weight: 700;
            padding: 3px 8px;
            border-radius: 6px;
          }
        }

        .sol-desc {
          color: #cbd5e1;
          font-size: 0.95rem;
          line-height: 1.6;
          margin: 0 0 1rem 0;
        }

        .sol-features {
          h4 { font-size: 0.85rem; color: #94a3b8; margin: 0 0 0.5rem 0; }
          ul {
            margin: 0 0 1rem 0;
            padding-left: 1.25rem;
            display: flex;
            flex-direction: column;
            gap: 0.35rem;
            li { color: #e2e8f0; font-size: 0.9rem; }
          }
        }

        .sol-usp {
          background: rgba(245, 158, 11, 0.1);
          border-left: 3px solid #f59e0b;
          padding: 0.75rem 1rem;
          border-radius: 0 8px 8px 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #fde68a;
          font-size: 0.85rem;
        }
      }
    }

    .deck-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;

      h2 { margin: 0 0 0.25rem 0; font-size: 1.35rem; }
      p { margin: 0; color: #94a3b8; font-size: 0.85rem; }

      .btn-copy-md {
        background: rgba(56, 189, 248, 0.15);
        border: 1px solid rgba(56, 189, 248, 0.3);
        color: #38bdf8;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        font-weight: 700;
        font-size: 0.85rem;
        cursor: pointer;
        &:hover { background: #38bdf8; color: #0f172a; }
      }
    }

    .pitch-deck-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.25rem;

      .pitch-slide-card {
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        padding: 1.25rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .slide-badge-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;

          .slide-tag {
            font-size: 0.7rem;
            font-weight: 800;
            color: #38bdf8;
          }

          .slide-category {
            font-size: 0.75rem;
            color: #94a3b8;
            font-weight: 600;
          }
        }

        .slide-main-heading {
          margin: 0 0 0.75rem 0;
          font-size: 1.05rem;
          font-weight: 700;
          color: #f8fafc;
        }

        .slide-points {
          margin: 0 0 1rem 0;
          padding-left: 1.15rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          flex: 1;

          li { color: #cbd5e1; font-size: 0.85rem; line-height: 1.45; }
        }

        .slide-callout-box {
          background: rgba(245, 158, 11, 0.1);
          border-left: 3px solid #f59e0b;
          padding: 0.5rem 0.75rem;
          font-size: 0.75rem;
          color: #fde68a;
          border-radius: 0 6px 6px 0;
        }
      }
    }

    .similar-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      h2 {
        color: #f8fafc;
        font-size: 1.35rem;
        font-weight: 800;
        margin: 0;
      }
    }

    .not-found-page {
      text-align: center;
      padding: 6rem 2rem;
      h2 { color: #f8fafc; font-size: 2rem; }
      p { color: #94a3b8; margin-bottom: 1.5rem; }
      .btn-primary {
        background: #38bdf8;
        color: #0f172a;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 700;
      }
    }
  `]
})
export class PsDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private psService = inject(PsDataService);
  private seoService = inject(SeoService);
  bookmarkService = inject(BookmarkService);

  ps = signal<ProblemStatement | null>(null);
  similarStatements = signal<ProblemStatement[]>([]);
  activeTab = signal<'overview' | 'architecture' | 'solutions' | 'pitch'>('overview');
  isPitchModalOpen = signal(false);
  copiedPitch = signal(false);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        const item = this.psService.getProblemStatementById(id);
        if (item) {
          this.ps.set(item);
          this.seoService.setProblemStatementSeo(item);
          this.similarStatements.set(this.psService.getSimilarProblemStatements(item));
        } else {
          this.ps.set(null);
        }
      }
    });
  }

  copyPitchMarkdown(ps: ProblemStatement): void {
    let md = `# SIH 2026 Pitch Deck Outline: ${ps.ps_number} - ${ps.title}

`;
    ps.pitchDeck.forEach(s => {
      md += `## Slide ${s.slideNumber}: ${s.slideTitle}
### ${s.heading}
`;
      s.bulletPoints.forEach(b => md += `- ${b}
`);
      if (s.callout) md += `> **Judge Impact**: ${s.callout}
`;
      md += `
`;
    });

    navigator.clipboard.writeText(md).then(() => {
      this.copiedPitch.set(true);
      setTimeout(() => this.copiedPitch.set(false), 2500);
    });
  }
}
