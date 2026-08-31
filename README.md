# ⚡ SIH 2026 Skill Navigator & Solution Architecture Portal

> **Live SEO-Optimized Angular 19 SSR Web Platform for Smart India Hackathon 2026**

An intelligent web platform for engineering & technology students to match their skill sets (Full Stack, AI/ML, ECE Hardware, Cybersecurity) with all **229 official SIH 2026 problem statements**, explore production-ready architectures, innovative solution angles, and export 6-slide presentation pitch decks.

---

## 🌟 Key Features

1. **Skill-Based Discovery & "Top 10" Recommendation Engine**:
   - Persona filters for **Full Stack**, **AI / ML & Vision**, **ECE / Embedded & Robotics**, **Cybersecurity & Blockchain**, **MedTech**, and **Space Tech**.
   - Dynamic relevance scoring formula calculating custom skill overlap and feasibility.
2. **Complete 229 Problem Statement Database**:
   - Official titles, ministries, themes, and full problem descriptions.
   - **System Architecture Blueprints**: Frontend, Backend, AI/ML models, Hardware/Sensors, Database, and Protocols.
   - **Curated Innovation Hooks**: 2–4 unique technical angles to stand out in jury evaluation.
   - **6-Slide SIH Pitch Deck**: Slide-by-slide structure with one-click Markdown copy for PPT preparation.
3. **Top 10 Curated Web Portal Strategy (`/ranked`)**:
   - Features the **SEO Content Blueprint & Architecture Strategy** authored by Rajdip Ghosh.
4. **Interactive Tools**:
   - 3-Way Side-by-Side Comparison Matrix (`/compare`).
   - Departmental Technology Roadmaps (`/skills`).
   - Bookmarking and full-text keyword search with live highlight.
5. **Server-Side Rendering (SSR) & Advanced SEO**:
   - Universal SSR powered by Express.js and `@angular/ssr`.
   - Dynamic XML Sitemap at `/sitemap.xml` listing all 229 problem statements.
   - JSON-LD Structured Data (`TechArticle`, `ItemList`, `WebApplication`) for Google Rich Results.
   - **Bootstrap 5 & Bootstrap Icons** responsive UI with dark glassmorphism design.

---

## 🚀 Local Development

```bash
# Install dependencies
npm install

# Start development server with SSR live-reload
npm run dev:ssr

# Or standard dev server:
npm start
```
Open **`http://localhost:4200`** in your browser.

---

## 🛠️ Production Build & Local SSR Server

```bash
# Build production client and server bundles
npm run build

# Start production Express SSR server (Port 4000)
node dist/sih2026-portal/server/server.mjs
```
Open **`http://localhost:4000`**.

---

## ☁️ Deployment on Vercel

The repository includes pre-configured **`vercel.json`** and **`api/index.js`** for instant serverless SSR deployment.

### Option 1: Deploy via Vercel CLI
```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy preview
vercel

# Deploy to production
vercel --prod
```

### Option 2: Deploy via Git (GitHub / GitLab)
1. Push this directory to your GitHub repository.
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Vercel will automatically detect the **Angular** framework and `vercel.json` configuration.
5. Click **"Deploy"**.

---

## 📄 License & Attribution
© 2026 Rajdip Ghosh. All Rights Reserved. Built for Smart India Hackathon (SIH 2026).
