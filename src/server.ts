import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine, isMainModule } from '@angular/ssr/node';
import express from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import bootstrap from './main.server';
import { SIH2026_PROBLEM_STATEMENTS } from './app/core/data/sih2026-dataset';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const indexHtml = join(serverDistFolder, 'index.server.html');

const app = express();
const commonEngine = new CommonEngine();

/**
 * Dynamic XML Sitemap for SEO Indexing
 */
app.get('/sitemap.xml', (req, res) => {
  const baseUrl = 'https://sih2026.gov.in';
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Static core routes
  const staticRoutes = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/ranked', priority: '0.9', changefreq: 'weekly' },
    { path: '/skills', priority: '0.8', changefreq: 'weekly' },
    { path: '/compare', priority: '0.7', changefreq: 'weekly' }
  ];

  staticRoutes.forEach(r => {
    xml += `  <url>\n    <loc>${baseUrl}${r.path}</loc>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>\n`;
  });

  // All 229 problem statements
  SIH2026_PROBLEM_STATEMENTS.forEach(ps => {
    const priority = ps.rank ? '0.9' : '0.8';
    xml += `  <url>\n    <loc>${baseUrl}/ps/${ps.ps_number}</loc>\n    <lastmod>${ps.scraped_at}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
  });

  xml += '</urlset>';

  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

/**
 * Robots.txt
 */
app.get('/robots.txt', (req, res) => {
  const robots = `User-agent: *\nAllow: /\n\nSitemap: https://sih2026.gov.in/sitemap.xml\n`;
  res.header('Content-Type', 'text/plain');
  res.send(robots);
});

/**
 * REST API for programmatic problem statement search
 */
app.get('/api/ps', (req, res) => {
  res.json({
    total: SIH2026_PROBLEM_STATEMENTS.length,
    data: SIH2026_PROBLEM_STATEMENTS
  });
});

app.get('/api/ps/:id', (req, res) => {
  const ps = SIH2026_PROBLEM_STATEMENTS.find(p => p.ps_number.toUpperCase() === req.params.id.toUpperCase());
  if (ps) {
    res.json(ps);
  } else {
    res.status(404).json({ error: 'Problem statement not found' });
  }
});

/**
 * Serve static files from /browser
 */
app.get(
  '**',
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html'
  }),
);

/**
 * Handle all other requests by rendering the Angular application with SSR.
 */
app.get('**', (req, res, next) => {
  const { protocol, originalUrl, baseUrl, headers } = req;

  commonEngine
    .render({
      bootstrap,
      documentFilePath: indexHtml,
      url: `${protocol}://${headers.host}${originalUrl}`,
      publicPath: browserDistFolder,
      providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
    })
    .then((html) => res.send(html))
    .catch((err) => next(err));
});

/**
 * Start the server if this module is the main entry point.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`SIH 2026 SSR Express Server running at http://localhost:${port}`);
  });
}

export default app;
