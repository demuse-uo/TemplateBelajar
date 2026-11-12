/* ============================================================
   SERVICE WORKER — supaya aplikasi bisa dibuka tanpa internet
   Kalau file website diubah, naikkan angka VERSI di bawah
   (misalnya v1 → v2) supaya semua HP mengambil versi terbaru.
   ============================================================ */
const VERSI = "belajar-ujian-v17";

const FILE_UTAMA = [
  "./template-belajar-ujian.html",
  "./belajar-ujian.css",
  "./belajar-ujian.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon.png"
];

// Simpan file utama saat aplikasi dipasang
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSI).then((c) => c.addAll(FILE_UTAMA)));
  self.skipWaiting();
});

// Hapus simpanan versi lama
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSI).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Materi Bersama (Google Sheets) selalu lewat internet, tidak disimpan
  if (url.hostname.endsWith("script.google.com") || url.hostname.endsWith("googleusercontent.com")) return;

  const bolehSimpan = url.origin === self.location.origin ||
    url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com" ||
    url.hostname === "cdnjs.cloudflare.com"; // pembaca PDF/PowerPoint
  if (!bolehSimpan) return;

  // Pakai simpanan dulu supaya cepat & bisa offline, sambil ambil versi baru di belakang
  e.respondWith(
    caches.open(VERSI).then(async (cache) => {
      const simpanan = await cache.match(req, { ignoreSearch: url.origin === self.location.origin });
      const baru = fetch(req)
        .then((res) => {
          if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone());
          return res;
        })
        .catch(() => null);
      if (simpanan) { e.waitUntil(baru); return simpanan; }
      const res = await baru;
      if (res) return res;
      if (req.mode === "navigate") return cache.match("./template-belajar-ujian.html");
      return new Response("", { status: 504, statusText: "Offline" });
    })
  );
});
