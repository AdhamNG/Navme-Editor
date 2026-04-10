/**
 * MultiSet API URL prefix.
 *
 * - Default: same-origin `/api/multiset` (Vite dev + `vite preview` proxy to api.multiset.ai).
 * - Optional: `VITE_MULTISET_API_URL=https://api.multiset.ai` at build time for static-only hosts;
 *   allowlist your site origin in the MultiSet dashboard (CORS).
 *
 * Respects `import.meta.env.BASE_URL` when the app is served under a subpath.
 */
export function multisetApiUrl(path) {
  const p = path.startsWith('/') ? path : `/${path}`;
  const raw = import.meta.env.VITE_MULTISET_API_URL;
  if (typeof raw === 'string' && raw.trim() !== '') {
    return `${raw.trim().replace(/\/$/, '')}${p}`;
  }
  const base = import.meta.env.BASE_URL || '/';
  const root = base === '/' ? '' : base.replace(/\/$/, '');
  return `${root}/api/multiset${p}`;
}
