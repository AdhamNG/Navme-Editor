/**
 * Parse a fetch Response as JSON without throwing on empty or non-JSON bodies.
 * @param {Response} res
 * @param {{ allowEmpty?: boolean }} [options]  If true, empty body returns null (e.g. some REST writes).
 */
export async function readJsonResponse(res, options = {}) {
  const { allowEmpty = false } = options;
  const text = await res.text();
  const trimmed = (text ?? '').trim();
  if (!trimmed) {
    if (allowEmpty) return null;
    const ct = (res.headers.get('content-type') || '').toLowerCase();
    let hint = '';
    if (ct.includes('text/html')) {
      hint =
        ' The response is HTML (usually your app’s index page) — this URL is not proxied to MultiSet. Serve with `npm run preview` or `npm run dev` from antimatpvs, or put a server proxy at /api/multiset → https://api.multiset.ai.';
    } else if (res.ok) {
      hint =
        ' Empty 200 often means a broken or missing proxy. Use Vite preview (Render: startCommand `npm run preview --prefix antimatpvs`), or build with VITE_MULTISET_API_URL=https://api.multiset.ai and allowlist your origin in MultiSet.';
    }
    throw new Error(`Empty response body (HTTP ${res.status}).${hint}`);
  }
  try {
    return JSON.parse(trimmed);
  } catch {
    throw new Error(
      `Expected JSON but got (${res.status}): ${trimmed.slice(0, 160)}${trimmed.length > 160 ? '…' : ''}`,
    );
  }
}
