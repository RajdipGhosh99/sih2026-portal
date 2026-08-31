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

  private readonly siteName = 'SIH 2026 Problem Statement Navigator & Solution Architect';
  private readonly baseUrl = 'https://sih2026-portal.vercel.app';

  setGeneralSeo(title: string, description: string, keywords: string[] = [], path: string = ''): void {
    const fullTitle = `${title} | SIH 2026 Portal`;
    this.titleService.setTitle(fullTitle);

    const canonicalUrl = `${this.baseUrl}${path}`;

    // Standard Meta Tags
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ 
      name: 'keywords', 
      content: [
        'SIH 2026',
        'Smart India Hackathon 2026',
        'SIH 2026 Problem Statements',
        'SIH PS List with Solutions',
        'SIH 2026 PPT Template',
        'SIH Presentation 6 Slide Deck',
        'Full Stack SIH Projects',
        'AI ML SIH Problem Statements',
        'SIH Internal Hackathon Shortlisting',
        'SIH Problem Statement PDF Download',
        ...keywords
      ].join(', ') 
    });
    this.metaService.updateTag({ name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' });
    this.metaService.updateTag({ name: 'author', content: 'SIH 2026 Solutions Team' });
    this.metaService.updateTag({ name: 'language', content: 'English' });
    this.metaService.updateTag({ name: 'geo.region', content: 'IN' });
    this.metaService.updateTag({ name: 'geo.placename', content: 'India' });

    // OpenGraph Meta Tags (Facebook, LinkedIn, WhatsApp)
    this.metaService.updateTag({ property: 'og:title', content: fullTitle });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: canonicalUrl });
    this.metaService.updateTag({ property: 'og:site_name', content: this.siteName });
    this.metaService.updateTag({ property: 'og:image', content: `${this.baseUrl}/og-image.png` });
    this.metaService.updateTag({ property: 'og:image:alt', content: 'SIH 2026 Problem Statements & Architecture Hub' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Meta Tags (X / Twitter)
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@SIH2026' });
    this.metaService.updateTag({ name: 'twitter:title', content: fullTitle });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
    this.metaService.updateTag({ name: 'twitter:image', content: `${this.baseUrl}/og-image.png` });

    this.setCanonicalUrl(canonicalUrl);

    // If Home page, inject WebSite & FAQPage schema
    if (path === '/' || path === '') {
      this.injectJsonLd([
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          'name': 'SIH 2026 Problem Statement Navigator & Solution Architect',
          'url': this.baseUrl,
          'description': 'Comprehensive search, filter, and architecture roadmap for all 229 Smart India Hackathon 2026 problem statements.',
          'potentialAction': {
            '@type': 'SearchAction',
            'target': `${this.baseUrl}/?q={search_term_string}`,
            'query-input': 'required name=search_term_string'
          }
        },
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          'mainEntity': [
            {
              '@type': 'Question',
              'name': 'How many problem statements are released in SIH 2026?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'A total of 229 official problem statements have been released across 17 diverse technological themes including Full-Stack Web/Mobile, AI/ML, MedTech, Agriculture, Smart Vehicles, Disaster Management, Space Tech, and Cybersecurity.'
              }
            },
            {
              '@type': 'Question',
              'name': 'What is the recommended 6-slide presentation deck format for SIH 2026?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'The official SIH 2026 evaluation format consists of 6 core slides: 1) Title & Team Overview, 2) Problem Understanding & Severity, 3) Proposed Solution & Innovation USP, 4) Technical Architecture & Tech Stack, 5) Feasibility, Scalability & Roadmap, and 6) Impact, Deliverables & Value Matrix.'
              }
            },
            {
              '@type': 'Question',
              'name': 'What are the top full-stack and AI problem statements for SIH 2026?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Top curated challenges include SIH26044 (High-Speed Legal AI Search & Precedent Citation), SIH26001 (NER Landslide Early Warning AI), SIH26003 (Cognitive Dementia Gaming), SIH26019 (Railway Safety Vision), and SIH26027 (Heritage Virtual Metaverse).'
              }
            }
          ]
        }
      ]);
    }
  }

  setProblemStatementSeo(ps: ProblemStatement): void {
    const pageTitle = `${ps.ps_number}: ${ps.title} - Solution Architecture & Pitch Deck`;
    const pageDesc = ps.seo?.metaDescription || `${ps.title} (${ps.ps_number}) by ${ps.org}. Explore proposed full-stack architecture, AI models, 6-slide PPT deck, and deliverables for Smart India Hackathon 2026.`;
    
    const keywords = [
      ps.ps_number,
      ps.category,
      ps.theme,
      ps.org,
      `${ps.ps_number} solution`,
      `${ps.ps_number} ppt template`,
      `${ps.ps_number} architecture diagram`,
      ...ps.skills,
      'Smart India Hackathon 2026 Winning Idea',
      'SIH 2026 PPT Pitch Deck'
    ];

    this.setGeneralSeo(pageTitle, pageDesc, keywords, `/ps/${ps.ps_number}`);

    const canonicalUrl = `${this.baseUrl}/ps/${ps.ps_number}`;

    // Multi-Schema JSON-LD Graph: TechArticle + HowTo + FAQPage + BreadcrumbList
    const jsonLdGraph = [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        'headline': ps.seo?.suggestedH1 || `${ps.ps_number}: ${ps.title}`,
        'identifier': ps.ps_number,
        'name': ps.title,
        'description': pageDesc,
        'url': canonicalUrl,
        'author': {
          '@type': 'Organization',
          'name': ps.org
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'Smart India Hackathon 2026 Portal',
          'url': this.baseUrl
        },
        'about': [
          { '@type': 'Thing', 'name': ps.theme },
          { '@type': 'Thing', 'name': ps.category },
          ...ps.skills.map(s => ({ '@type': 'Thing', 'name': s }))
        ],
        'dependencies': [
          ...(ps.architecture.frontend || []),
          ...(ps.architecture.backend || []),
          ...(ps.architecture.aiMl || []),
          ...(ps.architecture.hardware || []),
          ...(ps.architecture.database || [])
        ].join(', '),
        'inLanguage': 'en-IN',
        'keywords': keywords.join(', ')
      },
      {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        'name': `How to Build and Pitch a Winning Solution for ${ps.ps_number}`,
        'description': `Step-by-step guide to implement the architecture and 6-slide presentation for ${ps.title}`,
        'step': [
          {
            '@type': 'HowToStep',
            'name': 'Step 1: Understand Problem Statement & Metrics',
            'text': ps.description
          },
          {
            '@type': 'HowToStep',
            'name': 'Step 2: Implement Technical Architecture',
            'text': `Build the solution using Frontend: ${(ps.architecture.frontend || []).join(', ')}, Backend: ${(ps.architecture.backend || []).join(', ')}, AI/ML: ${(ps.architecture.aiMl || []).join(', ')}.`
          },
          {
            '@type': 'HowToStep',
            'name': 'Step 3: Prepare the 6-Slide Submission Pitch Deck',
            'text': `Follow the 6 mandatory evaluation slides: 1) Title, 2) Problem Understanding, 3) Innovation USP, 4) Tech Stack Architecture, 5) Feasibility, 6) Impact & Deliverables.`
          }
        ]
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': `What is SIH 2026 Problem Statement ${ps.ps_number} about?`,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': `${ps.title} issued by ${ps.org}. Category: ${ps.category}, Theme: ${ps.theme}. Summary: ${ps.description}`
            }
          },
          {
            '@type': 'Question',
            'name': `What is the recommended tech stack for ${ps.ps_number}?`,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': `Recommended stack includes Frontend: ${(ps.architecture.frontend || ['Angular/React']).join(', ')}, Backend: ${(ps.architecture.backend || ['Node.js/FastAPI']).join(', ')}, AI/ML: ${(ps.architecture.aiMl || ['Python/TensorFlow']).join(', ')}, Database: ${(ps.architecture.database || ['PostgreSQL/MongoDB']).join(', ')}.`
            }
          },
          {
            '@type': 'Question',
            'name': `What are the mandatory deliverables for ${ps.ps_number}?`,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': ps.expectedDeliverables && ps.expectedDeliverables.length > 0 
                ? ps.expectedDeliverables.join('; ') 
                : 'Working prototype, scalable cloud deployment, architecture documentation, and live demo.'
            }
          },
          {
            '@type': 'Question',
            'name': `How to structure the 6-slide presentation deck for ${ps.ps_number}?`,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': ps.pitchDeck && ps.pitchDeck.length > 0
                ? ps.pitchDeck.map(s => `Slide ${s.slideNumber}: ${s.slideTitle} (${s.heading})`).join(' | ')
                : 'Standard 6-slide SIH evaluation deck covering Problem Understanding, Architecture, and Impact.'
            }
          }
        ]
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': this.baseUrl
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': ps.theme,
            'item': `${this.baseUrl}/?theme=${encodeURIComponent(ps.theme)}`
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': ps.ps_number,
            'item': canonicalUrl
          }
        ]
      }
    ];

    this.injectJsonLd(jsonLdGraph);
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
