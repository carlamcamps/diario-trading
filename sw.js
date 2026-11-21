/* Diário de Trading: keeps a copy of the site so it opens without internet.
   Pages and scripts: always try the internet first (so updates arrive), the saved copy only when offline.
   Images, fonts and libraries: the saved copy first (faster). The data itself (Supabase) is never touched here. */
const CACHE = "diario-trading-v1";
const CORE = ["./", "./index.html", "./noticias.js", "./noticias-arquivo.json", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).catch(() => {}).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET") return;
  const u = new URL(r.url);
  if (u.hostname.endsWith("supabase.co")) return;
  const same = u.origin === self.location.origin;
  const fresh = same && (r.mode === "navigate" || /\.(html|js|json|webmanifest)$/.test(u.pathname) || u.pathname.endsWith("/"));
  if (fresh) {
    e.respondWith(
      fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); } return res; })
        .catch(() => caches.match(r, { ignoreSearch: true }).then(m => m || (r.mode === "navigate" ? caches.match("./index.html") : undefined)))
    );
    return;
  }
  e.respondWith(
    caches.match(r).then(m => m || fetch(r).then(res => {
      if (res.ok || res.type === "opaque") { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); }
      return res;
    }))
  );
});
