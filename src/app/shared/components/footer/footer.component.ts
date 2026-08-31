import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="app-footer">
      <div class="footer-container">
        <div class="footer-grid">
          <!-- Col 1: About -->
          <div class="footer-col brand-col">
            <div class="brand">
              <span class="logo">⚡ SIH 2026</span>
              <span class="tagline">Skill Navigator & Solution Architecture Hub</span>
            </div>
            <p class="desc">
              An intelligent, SEO-optimized platform helping engineering & polytechnic students match their skills with all 229 Smart India Hackathon 2026 problem statements, complete with production-ready architectures and presentation slide decks.
            </p>
            <div class="copyright">
              © 2026 Rajdip Ghosh. All Rights Reserved. Built with Angular SSR.
            </div>
          </div>

          <!-- Col 2: Persona Quick Filters -->
          <div class="footer-col">
            <h4>Target Tracks & Personas</h4>
            <ul>
              <li><a routerLink="/" [queryParams]="{persona: 'full-stack'}">💻 Full Stack Web & Mobile</a></li>
              <li><a routerLink="/" [queryParams]="{persona: 'ai-ml'}">🤖 AI / ML & Computer Vision</a></li>
              <li><a routerLink="/" [queryParams]="{persona: 'ece-embedded'}">⚡ ECE, Embedded & Robotics</a></li>
              <li><a routerLink="/" [queryParams]="{persona: 'cybersecurity'}">🛡️ Cybersecurity & Blockchain</a></li>
              <li><a routerLink="/" [queryParams]="{persona: 'medtech'}">🏥 Healthcare & MedTech</a></li>
              <li><a routerLink="/" [queryParams]="{persona: 'space-defense'}">🛰️ Space Tech & Defense</a></li>
            </ul>
          </div>

          <!-- Col 3: Curated Top 10 Portals -->
          <div class="footer-col">
            <h4>Featured Web Solutions</h4>
            <ul>
              <li><a routerLink="/ps/SIH26044">#1 Ayush Skill Mapping (SIH26044)</a></li>
              <li><a routerLink="/ps/SIH26043">#2 Societal Crowdsourcing (SIH26043)</a></li>
              <li><a routerLink="/ps/SIH26033">#3 D2C Farmer Marketplace (SIH26033)</a></li>
              <li><a routerLink="/ps/SIH26090">#4 Smart Cataloging App (SIH26090)</a></li>
              <li><a routerLink="/ps/SIH26032">#5 Farmer Queue Scheduling (SIH26032)</a></li>
              <li><a routerLink="/ranked">View All Top 10 Web Portals →</a></li>
            </ul>
          </div>

          <!-- Col 4: Resources & SEO -->
          <div class="footer-col">
            <h4>Hackathon Resources</h4>
            <ul>
              <li><a routerLink="/skills">Department Skill Roadmaps</a></li>
              <li><a routerLink="/compare">Side-by-Side PS Comparator</a></li>
              <li><a href="https://sih.gov.in" target="_blank" rel="noopener">Official SIH Portal ↗</a></li>
              <li><a href="/sitemap.xml" target="_blank">Dynamic XML Sitemap</a></li>
              <li><a href="/public/sih2026-dataset.json" target="_blank">Raw JSON Dataset (229 PS)</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .app-footer {
      background: #090d16;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding: 4rem 1.5rem 2rem;
      color: #94a3b8;
      font-size: 0.875rem;
    }

    .footer-container {
      max-width: 1440px;
      margin: 0 auto;
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 2fr 1.2fr 1.2fr 1.2fr;
      gap: 3rem;

      @media (max-width: 1024px) {
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
      }

      @media (max-width: 640px) {
        grid-template-columns: 1fr;
      }
    }

    .footer-col {
      h4 {
        color: #f8fafc;
        font-size: 0.95rem;
        font-weight: 700;
        margin-bottom: 1.25rem;
        letter-spacing: -0.01em;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 0.65rem;

        a {
          color: #94a3b8;
          text-decoration: none;
          transition: color 0.2s ease;

          &:hover {
            color: #38bdf8;
          }
        }
      }
    }

    .brand-col {
      .brand {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        margin-bottom: 1rem;

        .logo {
          font-size: 1.25rem;
          font-weight: 800;
          color: #f8fafc;
        }

        .tagline {
          font-size: 0.8rem;
          color: #38bdf8;
          font-weight: 600;
        }
      }

      .desc {
        line-height: 1.6;
        margin-bottom: 1.5rem;
        max-width: 380px;
      }

      .copyright {
        font-size: 0.8rem;
        color: #64748b;
      }
    }
  `]
})
export class FooterComponent {}
