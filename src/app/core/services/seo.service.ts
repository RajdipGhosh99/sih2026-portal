import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ProblemStatement } from '../models/problem-statement.model';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private doc = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);

  private readonly siteName = 'SIH 2026 Skill Navigator & Solution Architect';
  private readonly baseUrl = 'https://sih2026.gov.in'; // Representative canonical domain

  setGeneralSeo(title: string, description: string, keywords: string[] = [], path: string = ''): void {
    const fullTitle = `${title} | ${this.siteName}`;
    this.titleService.setTitle(fullTitle);

    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ name: 'keywords', content: ['SIH 2026', 'Smart India Hackathon', 'Problem Statements', ...keywords].join(', ') });
    this.metaService.updateTag({ name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' });

    // OpenGraph
    this.metaService.updateTag({ property: 'og:title', content: fullTitle });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: `${this.baseUrl}${path}` });
    this.metaService.updateTag({ property: 'og:site_name', content: this.siteName });

    // Twitter Card
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: fullTitle });
    this.metaService.updateTag({ name: 'twitter:description', content: description });

    this.setCanonicalUrl(`${this.baseUrl}${path}`);
  }

  setProblemStatementSeo(ps: ProblemStatement): void {
    const pageTitle = `${ps.ps_number}: ${ps.title}`;
    const pageDesc = ps.seo?.metaDescription || `${ps.title} (${ps.ps_number}) by ${ps.org}. Explore proposed architecture, tech stack, and solution ideas for SIH 2026.`;
    const keywords = [
      ps.ps_number,
      ps.category,
      ps.theme,
      ps.org,
      ...ps.skills,
      'Smart India Hackathon 2026 Solution'
    ];

    this.setGeneralSeo(pageTitle, pageDesc, keywords, `/ps/${ps.ps_number}`);

    // Inject JSON-LD Structured Data for Rich Snippets
    this.injectJsonLd({
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      'headline': ps.seo?.suggestedH1 || ps.title,
      'identifier': ps.ps_number,
      'name': ps.title,
      'description': pageDesc,
      'author': {
        '@type': 'Organization',
        'name': ps.org
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'Smart India Hackathon 2026'
      },
      'about': [
        { '@type': 'Thing', 'name': ps.theme },
        { '@type': 'Thing', 'name': ps.category },
        ...ps.skills.map(s => ({ '@type': 'Thing', 'name': s }))
      ],
      'inLanguage': 'en-IN',
      'keywords': keywords.join(', ')
    });
  }

  private setCanonicalUrl(url: string): void {
    let link: HTMLLinkElement | null = this.doc.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  injectJsonLd(schemaData: any): void {
    let script: HTMLScriptElement | null = this.doc.querySelector('script[id="structured-data-jsonld"]');
    if (!script) {
      script = this.doc.createElement('script');
      script.id = 'structured-data-jsonld';
      script.type = 'application/ld+json';
      this.doc.head.appendChild(script);
    }
    script.text = JSON.stringify(schemaData);
  }
}
