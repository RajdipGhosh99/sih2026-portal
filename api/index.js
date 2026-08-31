export default async function handler(req, res) {
  const module = await import('../dist/sih2026-portal/server/server.mjs');
  const app = module.default;
  return app(req, res);
}
