import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-skill-guide',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container-xl py-4" style="max-width: 1080px;">
      <header class="text-center mb-4">
        <span class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-1 rounded-pill mb-2 fw-semibold">
          Stack Reference
        </span>
        <h1 class="fs-2 fw-bold text-main mb-2">SIH 2026 Technology Roadmaps</h1>
        <p class="text-secondary small mx-auto" style="max-width: 680px;">
          Grounded technology stacks for student teams building Full-Stack Web and AI solutions for Smart India Hackathon.
        </p>
      </header>

      <div class="row g-4">
        <!-- Full-Stack Web -->
        <div class="col-md-6">
          <div class="card card-evergreen p-4 h-100">
            <h2 class="fs-5 fw-bold text-main mb-2"><i class="bi bi-window-stack text-primary me-2"></i> Full-Stack Web Applications</h2>
            <p class="text-secondary small mb-3">For two-sided portals, crowdsourcing workflows, and public registries.</p>

            <div class="d-flex flex-column gap-2 small text-secondary bg-subtle p-3 rounded-3 border border-subtle mb-3">
              <div><strong class="text-main">Frontend:</strong> Angular 19 SSR, Tailwind CSS, Bootstrap 5, RxJS.</div>
              <div><strong class="text-main">Backend:</strong> Node.js / Express, Python FastAPI for AI microservices.</div>
              <div><strong class="text-main">Database:</strong> PostgreSQL, MongoDB, Redis for session & cache.</div>
              <div><strong class="text-main">Key Matches:</strong> SIH26044 (Skill Mapping), SIH26043 (Crowdsourcing), SIH26033 (Farmer D2C).</div>
            </div>

            <a routerLink="/" [queryParams]="{persona: 'full-stack'}" class="btn btn-sm btn-primary align-self-start">
              Filter Full-Stack Challenges →
            </a>
          </div>
        </div>

        <!-- AI & Machine Learning -->
        <div class="col-md-6">
          <div class="card card-evergreen p-4 h-100">
            <h2 class="fs-5 fw-bold text-main mb-2"><i class="bi bi-cpu text-indigo me-2"></i> AI & Machine Learning</h2>
            <p class="text-secondary small mb-3">For computer vision, NLP conversational tools, and predictive models.</p>

            <div class="d-flex flex-column gap-2 small text-secondary bg-subtle p-3 rounded-3 border border-subtle mb-3">
              <div><strong class="text-main">Vision:</strong> YOLOv11 for detection, OpenCV, PyTorch, ONNX runtime.</div>
              <div><strong class="text-main">NLP / LLMs:</strong> Hugging Face, LangChain, RAG with vector search, Bhashini speech.</div>
              <div><strong class="text-main">Predictive:</strong> Scikit-learn, XGBoost, Time-Series Prophet.</div>
              <div><strong class="text-main">Key Matches:</strong> SIH26167 (SatQuery), SIH26038 (Retinopathy), SIH26077 (Weather Early Warning).</div>
            </div>

            <a routerLink="/" [queryParams]="{persona: 'ai-ml'}" class="btn btn-sm btn-primary align-self-start">
              Filter AI/ML Challenges →
            </a>
          </div>
        </div>

        <!-- Cybersecurity -->
        <div class="col-md-6">
          <div class="card card-evergreen p-4 h-100">
            <h2 class="fs-5 fw-bold text-main mb-2"><i class="bi bi-shield-check text-danger me-2"></i> Cybersecurity & Forensics</h2>
            <p class="text-secondary small mb-3">For packet analysis, threat intelligence, and cryptocurrency tracing.</p>

            <div class="d-flex flex-column gap-2 small text-secondary bg-subtle p-3 rounded-3 border border-subtle mb-3">
              <div><strong class="text-main">Network Forensics:</strong> Scapy, PyShark, PCAP parsers, JA4 fingerprints.</div>
              <div><strong class="text-main">Blockchain Analytics:</strong> Web3.py, Bitcoin graph tracing, Smart contract audits.</div>
              <div><strong class="text-main">Key Matches:</strong> SIH26104 (Voice Cloning Detection), SIH26182 (Crypto VASP Attribution).</div>
            </div>

            <a routerLink="/" [queryParams]="{persona: 'cybersecurity'}" class="btn btn-sm btn-primary align-self-start">
              Filter Cyber Challenges →
            </a>
          </div>
        </div>

        <!-- Hardware & Embedded (ECE) -->
        <div class="col-md-6">
          <div class="card card-evergreen p-4 h-100">
            <h2 class="fs-5 fw-bold text-main mb-2"><i class="bi bi-motherboard text-warning me-2"></i> Hardware & Embedded (ECE)</h2>
            <p class="text-secondary small mb-3">For IoT sensor mesh, rovers, drones, and prototype test rigs.</p>

            <div class="d-flex flex-column gap-2 small text-secondary bg-subtle p-3 rounded-3 border border-subtle mb-3">
              <div><strong class="text-main">Microcontrollers:</strong> ESP32-S3, STM32, Raspberry Pi, Jetson Orin Nano.</div>
              <div><strong class="text-main">Communication:</strong> LoRaWAN, BLE, MQTT, CAN bus.</div>
              <div><strong class="text-main">Key Matches:</strong> SIH26025 (Wireless Subsidence Mesh), SIH26177 (Rescue Drone).</div>
            </div>

            <a routerLink="/" [queryParams]="{persona: 'ece-embedded'}" class="btn btn-sm btn-primary align-self-start">
              Filter Hardware Challenges →
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .text-main { color: var(--text-primary); }
    .bg-subtle { background-color: var(--bg-surface-subtle) !important; }
    .border-subtle { border-color: var(--border-color) !important; }
    .text-indigo { color: var(--accent-indigo); }
  `]
})
export class SkillGuideComponent implements OnInit {
  private seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.setGeneralSeo(
      'SIH 2026 Technology Roadmaps & Skill Guide',
      'Technology choices and stack guides for Full Stack Web and AI tracks in Smart India Hackathon 2026.',
      ['SIH Tech Stack', 'Full Stack Hackathon', 'AI ML Projects'],
      '/skills'
    );
  }
}
