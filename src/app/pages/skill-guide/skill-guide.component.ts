import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { PsDataService } from '../../core/services/ps-data.service';

@Component({
  selector: 'app-skill-guide',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="skill-guide-page">
      <header class="guide-header">
        <span class="guide-pill">🧭 Departmental Tech Roadmaps</span>
        <h1>SIH 2026 Skill & Technology Guide</h1>
        <p>Comprehensive stack recommendations, sensor choices, frameworks, and architecture blueprints for student hackathon teams.</p>
      </header>

      <div class="tracks-container">
        <!-- Track 1: CSE / IT & Full Stack Web -->
        <div class="track-card">
          <div class="track-icon">💻</div>
          <h2>CSE / IT: Full Stack & Cloud Web Portals</h2>
          <p class="track-desc">Ideal for two-sided marketplaces, grievance dashboards, crowdsourcing platforms, and public registries.</p>

          <div class="stack-list">
            <div class="stack-item">
              <strong>Frontend Architecture:</strong> Angular 19 Standalone Components + Angular SSR, Tailwind CSS, RxJS, NgRx, PWA.
            </div>
            <div class="stack-item">
              <strong>Backend & API Services:</strong> Node.js / Express, Python FastAPI for microservices, WebSockets for live queues.
            </div>
            <div class="stack-item">
              <strong>Database & Caching:</strong> PostgreSQL with PostGIS extensions, MongoDB Atlas, Redis for sub-millisecond caching.
            </div>
            <div class="stack-item">
              <strong>Recommended Challenges:</strong> SIH26044 (Skill Mapping), SIH26043 (Crowdsourcing), SIH26033 (Farmer D2C), SIH26014 (Land Stack).
            </div>
          </div>
          <a routerLink="/" [queryParams]="{persona: 'full-stack'}" class="btn-track">Explore Full Stack Top 10 →</a>
        </div>

        <!-- Track 2: AI & Data Science -->
        <div class="track-card">
          <div class="track-icon">🧠</div>
          <h2>AI, Machine Learning & Computer Vision</h2>
          <p class="track-desc">Tailored for satellite Earth observation, medical diagnostics, nowcasting, and NLP chatbots.</p>

          <div class="stack-list">
            <div class="stack-item">
              <strong>Vision Models:</strong> YOLOv11 for real-time detection, U-Net for semantic segmentation, PointNet++ for LiDAR 3D.
            </div>
            <div class="stack-item">
              <strong>NLP & Generative AI:</strong> LangChain, LlamaIndex, Bhashini multilingual speech API, Retrieval-Augmented Generation (RAG).
            </div>
            <div class="stack-item">
              <strong>Spatiotemporal Forecasting:</strong> Graph Neural Networks (GNNs), Temporal Transformers, Diffusion Downscaling.
            </div>
            <div class="stack-item">
              <strong>Recommended Challenges:</strong> SIH26167 (SatQuery AI), SIH26038 (Diabetic Retinopathy), SIH26077 (Weather Nowcasting), SIH26171 (Browser Agent).
            </div>
          </div>
          <a routerLink="/" [queryParams]="{persona: 'ai-ml'}" class="btn-track">Explore AI/ML Top 10 →</a>
        </div>

        <!-- Track 3: ECE / Embedded & Robotics -->
        <div class="track-card">
          <div class="track-icon">⚡</div>
          <h2>ECE, Embedded Systems & Robotics</h2>
          <p class="track-desc">Designed for smart mine rovers, anti-drone radar, LoRa sensor mesh, and hardware prototypes.</p>

          <div class="stack-list">
            <div class="stack-item">
              <strong>Microcontrollers & SBCs:</strong> ESP32-S3, STM32H7, Raspberry Pi 5, NVIDIA Jetson Orin Nano for Edge AI.
            </div>
            <div class="stack-item">
              <strong>Sensors & Telemetry:</strong> Solid-state LiDAR, Thermal Cameras, Infrasound, Sonar DAC, LoRaWAN (865-867 MHz in India).
            </div>
            <div class="stack-item">
              <strong>Robotics Middleware:</strong> ROS2 Humble, Micro-ROS, CAN bus OBD-II, Stateflow motor control.
            </div>
            <div class="stack-item">
              <strong>Recommended Challenges:</strong> SIH26058 (SDR Sonar AUV), SIH26025 (Wireless Subsidence Mesh), SIH26177 (Rescue Drone), SIH26007 (Fog Mine Vehicle).
            </div>
          </div>
          <a routerLink="/" [queryParams]="{persona: 'ece-embedded'}" class="btn-track">Explore ECE & Hardware Top 10 →</a>
        </div>

        <!-- Track 4: Cybersecurity & Blockchain -->
        <div class="track-card">
          <div class="track-icon">🛡️</div>
          <h2>Cybersecurity, Forensics & Blockchain</h2>
          <p class="track-desc">Focuses on network packet forensics, dark web OSINT, voice cloning defense, and crypto attribution.</p>

          <div class="stack-list">
            <div class="stack-item">
              <strong>Forensics Toolkits:</strong> Scapy, PyShark, Volatility, Tshark, custom LLVM compiler obfuscation engines.
            </div>
            <div class="stack-item">
              <strong>Web3 & Crypto:</strong> Ethereum, Solidity Smart Contracts, Web3.py, Graph analytics for Bitcoin/USDT wallet tracing.
            </div>
            <div class="stack-item">
              <strong>Threat Analytics:</strong> World Models for attack prediction, Post-Quantum Cryptography (PQC) assessment, JA4 TLS fingerprinting.
            </div>
            <div class="stack-item">
              <strong>Recommended Challenges:</strong> SIH26104 (Voice Cloning Impersonation), SIH26182 (VASP Attribution), SIH26153 (World Models), SIH26164 (Post-Quantum ECDAT).
            </div>
          </div>
          <a routerLink="/" [queryParams]="{persona: 'cybersecurity'}" class="btn-track">Explore Cyber & Crypto Top 10 →</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .skill-guide-page {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2.5rem 1.5rem 5rem;
      display: flex;
      flex-direction: column;
      gap: 2.5rem;
    }

    .guide-header {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;

      .guide-pill {
        background: rgba(56, 189, 248, 0.15);
        color: #38bdf8;
        border: 1px solid rgba(56, 189, 248, 0.3);
        font-weight: 800;
        font-size: 0.8rem;
        padding: 4px 12px;
        border-radius: 9999px;
      }

      h1 { font-size: 2.5rem; font-weight: 900; color: #f8fafc; margin: 0; }
      p { font-size: 1.1rem; color: #94a3b8; max-width: 780px; margin: 0; }
    }

    .tracks-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.75rem;
    }

    .track-card {
      background: rgba(30, 41, 59, 0.45);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 18px;
      padding: 1.75rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .track-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
      h2 { font-size: 1.35rem; font-weight: 800; color: #f8fafc; margin: 0 0 0.5rem 0; }
      .track-desc { font-size: 0.875rem; color: #94a3b8; line-height: 1.5; margin: 0 0 1.25rem 0; }

      .stack-list {
        display: flex;
        flex-direction: column;
        gap: 0.85rem;
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        padding: 1.25rem;
        margin-bottom: 1.5rem;

        .stack-item {
          font-size: 0.85rem;
          color: #cbd5e1;
          line-height: 1.45;

          strong { color: #38bdf8; display: block; margin-bottom: 0.2rem; font-size: 0.75rem; text-transform: uppercase; }
        }
      }

      .btn-track {
        background: rgba(56, 189, 248, 0.12);
        color: #38bdf8;
        border: 1px solid rgba(56, 189, 248, 0.25);
        padding: 0.65rem 1.25rem;
        border-radius: 8px;
        text-align: center;
        text-decoration: none;
        font-weight: 700;
        font-size: 0.9rem;
        transition: all 0.2s;

        &:hover {
          background: #38bdf8;
          color: #0f172a;
        }
      }
    }
  `]
})
export class SkillGuideComponent implements OnInit {
  private seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.setGeneralSeo(
      'SIH 2026 Technology Stacks & Departmental Roadmaps',
      'Explore official engineering and technology roadmaps for ECE, CSE/IT, AI/ML, and Cybersecurity tracks in Smart India Hackathon 2026.',
      ['SIH Tech Stack', 'ECE Projects', 'Full Stack Hackathon', 'AI ML Models', 'IoT ESP32', 'Robotics ROS2'],
      '/skills'
    );
  }
}
