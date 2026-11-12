/* ============================================================
   SCRIPT TEMPLATE BELAJAR UJIAN — deMuse
   Dipakai oleh template-belajar-ujian.html
   ============================================================ */

/* ============================================================
   ⚙️ PENGATURAN (diisi admin)
   ============================================================ */

// Tempel "Web app URL" dari Google Apps Script (lihat Code.gs).
// Kalau dikosongkan "", fitur Materi Bersama & Soal dari Teman disembunyikan.
const API_URL = "https://script.google.com/macros/s/AKfycbyptUMpQjVmeTKEJ_bE-Q9uw4OxD2OrERYJmjfM0_VHEqE2ahG3wY27Tze2rf5GQGYf/exec";

// Daftar jurusan di menu "Bagikan" dan filter "Materi Bersama".
const JURUSAN = [
  "Administrasi Bisnis",
  "Administrasi Negara",
  "Ilmu Komunikasi",
  "Ilmu Hukum",
  "Ilmu Perpustakaan",
  "Sosiologi",
  "Manajemen",
  "Akuntansi",
  "Ekonomi Pembangunan",
  "Pariwisata",
  "Sistem Informasi",
  "PGSD",
  "PG PAUD",
  "Sastra Inggris"
];

/* ============================================================
   CONTOH SUSUNAN CATATAN (cara "Tempel catatan")
   ============================================================ */
const CONTOH_SEDERHANA = `MATA KULIAH: Pengantar Ilmu Administrasi
MODUL 1: Konsep Dasar Administrasi

Administrasi adalah proses kerja sama sekelompok orang untuk mencapai tujuan yang telah ditetapkan.

Administrasi dalam arti sempit sering disamakan dengan ketatausahaan, yaitu kegiatan mencatat dan menyimpan surat.
- Unsur administrasi: sekelompok orang, kerja sama, dan tujuan bersama.`;

const CONTOH_SUSUNAN = `MATA KULIAH: Pengantar Ilmu Ekonomi
KODE: FSAB4102
TANGGAL UJIAN: 6 Desember 2026 pukul 07.30

MODUL 1: Konsep Dasar Ilmu Ekonomi
RINGKASAN:
## Pengertian
Ilmu ekonomi mempelajari cara manusia memakai **sumber daya yang terbatas** untuk memenuhi kebutuhan yang *tidak terbatas*.
POIN PENTING:
- Masalah pokok ekonomi adalah kelangkaan.
- Setiap pilihan punya biaya peluang.
ISTILAH:
- Kelangkaan: sumber daya terbatas dibanding kebutuhan.
- Biaya peluang: pilihan terbaik yang dikorbankan.
SOAL:
1. Masalah pokok dalam ilmu ekonomi adalah...
A. Inflasi
B. Kelangkaan
C. Pajak
D. Pengangguran
JAWABAN: B
PEMBAHASAN: Kebutuhan tidak terbatas, sumber daya terbatas.
ESAI:
1. Jelaskan apa itu biaya peluang!
JAWABAN: Nilai pilihan terbaik yang dikorbankan saat memilih.`;

/* ============================================================
   CONTOH MATERI (untuk tombol "Coba pakai contoh")
   ============================================================ */
const CONTOH = {
  mataKuliah: "Contoh: Pengantar Ilmu Ekonomi",
  kode: "CONTOH",
  info: "Materi contoh · hapus kalau sudah tidak dipakai",
  tanggalUjian: "",
  catatan: "Baca ringkasan dulu, hafalkan istilah dengan kartu hafalan, lalu latihan soal.",
  modul: [
    {
      nomor: 1,
      judul: "Konsep Dasar Ilmu Ekonomi",
      ringkasan: "Ilmu ekonomi mempelajari bagaimana manusia memilih cara menggunakan sumber daya yang terbatas untuk memenuhi kebutuhan yang tidak terbatas.",
      poin: ["Masalah pokok ekonomi adalah kelangkaan.", "Ekonomi dibagi menjadi mikroekonomi dan makroekonomi.", "Setiap pilihan memiliki biaya peluang."],
      istilah: [
        { kata: "Kelangkaan", arti: "Keadaan ketika sumber daya terbatas dibanding kebutuhan manusia." },
        { kata: "Biaya peluang", arti: "Nilai alternatif terbaik yang dikorbankan saat membuat pilihan." }
      ],
      soal: [
        { tanya: "Masalah pokok yang menjadi dasar ilmu ekonomi adalah...", pilihan: ["Inflasi", "Kelangkaan", "Pengangguran", "Pajak"], jawaban: 1, pembahasan: "Kelangkaan muncul karena kebutuhan tidak terbatas sedangkan sumber daya terbatas." },
        { tanya: "Nilai alternatif terbaik yang dikorbankan disebut...", pilihan: ["Biaya tetap", "Biaya variabel", "Biaya peluang", "Biaya marginal"], jawaban: 2, pembahasan: "Biaya peluang adalah pengorbanan dari pilihan terbaik yang tidak diambil." }
      ],
      esai: [{ tanya: "Jelaskan perbedaan mikroekonomi dan makroekonomi beserta contohnya!", jawaban: "Mikroekonomi membahas unit kecil seperti keputusan konsumen, sedangkan makroekonomi membahas perekonomian secara keseluruhan seperti inflasi." }]
    },
    {
      nomor: 2,
      judul: "Permintaan dan Penawaran",
      ringkasan: "Harga di pasar terbentuk dari pertemuan antara permintaan pembeli dan penawaran penjual.",
      poin: ["Hukum permintaan: harga naik, jumlah diminta turun.", "Hukum penawaran: harga naik, jumlah ditawarkan naik.", "Keseimbangan terjadi saat jumlah diminta = jumlah ditawarkan."],
      istilah: [{ kata: "Ceteris paribus", arti: "Asumsi bahwa faktor lain dianggap tetap." }],
      soal: [{ tanya: "Menurut hukum permintaan, jika harga naik maka...", pilihan: ["Jumlah diminta naik", "Jumlah diminta turun", "Jumlah diminta tetap", "Penawaran turun"], jawaban: 1, pembahasan: "Hubungan harga dan jumlah diminta berbanding terbalik." }],
      esai: [{ tanya: "Apa yang terjadi pada harga jika permintaan naik sementara penawaran tetap?", jawaban: "Harga keseimbangan akan naik karena barang yang diminta lebih banyak dari yang tersedia." }]
    }
  ]
};

/* ============================================================
   PENYIMPANAN DI HP/LAPTOP (localStorage)
   ============================================================ */
const LIB_KEY = "demuse-belajar-library-v1";
const NAMA_KEY = "demuse-belajar-nama";
const JURUSAN_KEY = "demuse-belajar-jurusan";
const LAPOR_KEY = "demuse-belajar-dilaporkan";
const memoryFallback = {};
function readStore(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch (e) { return memoryFallback[key] ?? fallback; }
}
function writeStore(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch (e) { memoryFallback[key] = value; return false; }
}
let library = readStore(LIB_KEY, { active: null, subjects: {} });
if (!library || typeof library !== "object" || !library.subjects) library = { active: null, subjects: {} };
const saveLibrary = () => {
  if (!writeStore(LIB_KEY, library)) toast("⚠️ Materi tidak bisa tersimpan otomatis. Tekan \"Simpan ke file\" supaya tidak hilang.");
};
const current = () => library.subjects[library.active] || null;
const progressKey = () => "demuse-belajar-progress-" + library.active;

/* ============================================================
   HELPER
   ============================================================ */
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const shuffle = (arr) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const slug = (s) => String(s ?? "").toLowerCase().normalize("NFKD").replace(/[^\w]+/g, "-").replace(/^-|-$/g, "") || "materi";
const courseKey = (d) => slug(d.kode || d.mataKuliah);
const hasApi = () => /^https:\/\//.test(API_URL.trim());
const fmtTanggal = (iso) => { const t = new Date(iso); return isNaN(t) ? "" : t.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }); };
let toastTimer;
function toast(text) {
  const t = $("toast"); t.textContent = text; t.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 3200);
}
function showMsg(id, text, type = "err") {
  const m = $(id);
  m.textContent = text; m.className = "msg " + type;
  m.classList.toggle("hidden", !text);
}

/* ============================================================
   HUBUNGAN KE GOOGLE SHEETS
   ============================================================ */
const PESAN_OFFLINE = "Tidak bisa terhubung. Periksa internet, lalu coba lagi.";
async function apiGet(params) {
  const res = await fetch(API_URL.trim() + "?" + new URLSearchParams(params));
  const data = await res.json();
  if (!data.ok) throw new Error(data.pesan || "Terjadi kesalahan.");
  return data;
}
async function apiPost(body) {
  const res = await fetch(API_URL.trim(), {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" }, // supaya tidak diblokir CORS
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.pesan || "Terjadi kesalahan.");
  return data;
}
const errText = (err) => (err instanceof TypeError || /JSON|Unexpected/.test(String(err.message)) ? PESAN_OFFLINE : err.message);

/* ============================================================
   MODAL (jendela pop-up)
   ============================================================ */
// Tombol back HP/browser: menutup jendela pop-up dulu, lalu kembali ke Beranda, baru keluar.
const modalStack = [];
let abaikanPop = 0;
const adaRiwayat = () => !!(window.history && history.pushState);
function sembunyikanModal(id) {
  $(id).classList.add("hidden");
  const i = modalStack.lastIndexOf(id); if (i >= 0) modalStack.splice(i, 1);
  if (!modalStack.length) document.body.style.overflow = "";
}
function openModal(id) {
  if (!$(id).classList.contains("hidden") && modalStack.includes(id)) return;
  $(id).classList.remove("hidden");
  modalStack.push(id);
  document.body.style.overflow = "hidden";
  if (adaRiwayat() && !(history.state && history.state.modal)) history.pushState({ ...(history.state || {}), modal: true }, "");
}
function closeModal(id) {
  sembunyikanModal(id);
  // tunggu sebentar: kadang jendela berikutnya langsung dibuka (misalnya "Simpan ke mana?")
  setTimeout(() => {
    if (!modalStack.length && adaRiwayat() && history.state && history.state.modal) { abaikanPop++; history.back(); }
  }, 60);
}
document.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", () => closeModal(b.dataset.close)));
document.querySelectorAll(".modal").forEach((m) => m.addEventListener("click", (e) => { if (e.target === m) closeModal(m.id); }));
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (modalStack.length) closeModal(modalStack[modalStack.length - 1]);
});
// tombol "← Kembali" di setiap jendela pop-up
document.querySelectorAll(".modal .modal-box").forEach((box) => {
  const id = box.parentElement.id;
  const b = document.createElement("button");
  b.type = "button"; b.className = "modal-back"; b.innerHTML = "← Kembali";
  b.addEventListener("click", () => closeModal(id));
  box.insertBefore(b, box.firstChild);
});
window.addEventListener("popstate", () => {
  if (abaikanPop) { abaikanPop--; return; }
  if (modalStack.length) {
    sembunyikanModal(modalStack[modalStack.length - 1]);
    if (modalStack.length) history.pushState({ ...(history.state || {}), modal: true }, "");
    return;
  }
  if (tampilan === "materi") tampilkanBeranda(false);
});

/* ============================================================
   MEMBACA & MERAPIKAN MATERI DARI CATATAN / FILE
   ============================================================ */
function extractJSON(raw) {
  let t = String(raw).trim().replace(/^﻿/, "");
  t = t.replace(/```[a-zA-Z]*\s*/g, "").replace(/```/g, "");
  const start = t.search(/[\[{]/);
  const end = Math.max(t.lastIndexOf("}"), t.lastIndexOf("]"));
  if (start === -1 || end <= start) throw new Error("Isi file belum lengkap. Coba minta teman mengirim ulang file-nya.");
  t = t.slice(start, end + 1);
  try { return JSON.parse(t); } catch (e) { /* coba perbaiki di bawah */ }
  const repaired = t
    .replace(/^\s*\/\/.*$/gm, "")                          // komentar satu baris
    .replace(/[“”]/g, '"')                                  // tanda kutip miring
    .replace(/,\s*([}\]])/g, "$1")                          // koma berlebih
    .replace(/([{,]\s*)([A-Za-z_][\w]*)\s*:/g, '$1"$2":');  // key tanpa tanda kutip
  try { return JSON.parse(repaired); }
  catch (e) { throw new Error("Isi file tidak bisa dibaca. Coba minta teman mengirim ulang file-nya."); }
}

/* ---------- Membaca susunan teks biasa (MATA KULIAH / MODUL / SOAL ...) ---------- */
const BULAN = { jan: 1, feb: 2, mar: 3, apr: 4, mei: 5, may: 5, jun: 6, jul: 7, agu: 8, agt: 8, aug: 8, sep: 9, okt: 10, oct: 10, nov: 11, des: 12, dec: 12 };
const NAMA_BULAN = ["", "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const pad = (n) => String(n).padStart(2, "0");

function parseTanggal(raw) {
  const s = String(raw || "").trim().toLowerCase();
  if (!s || /^[-–—]$|tidak|belum|kosong/.test(s)) return "";
  let y, mo, d, rest = s;
  let m = s.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) { [y, mo, d] = [m[1], m[2], m[3]]; rest = s.slice(m.index + m[0].length); }
  else if ((m = s.match(/(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})/))) { [d, mo, y] = [m[1], m[2], m[3]]; rest = s.slice(m.index + m[0].length); }
  else if ((m = s.match(/(\d{1,2})\s+([a-z]+)\s+(\d{4})/)) && BULAN[m[2].slice(0, 3)]) { d = m[1]; mo = BULAN[m[2].slice(0, 3)]; y = m[3]; rest = s.slice(m.index + m[0].length); }
  else return "";
  const t = rest.match(/(\d{1,2})[:.](\d{2})/);
  const out = `${y}-${pad(mo)}-${pad(d)}T${t ? pad(t[1]) + ":" + t[2] : "07:00"}`;
  return isNaN(new Date(out)) ? "" : out;
}
function tulisTanggal(iso) {
  const m = String(iso || "").match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  return m ? `${Number(m[3])} ${NAMA_BULAN[Number(m[2])]} ${m[1]} pukul ${m[4]}.${m[5]}` : "-";
}

function parseSederhana(text) {
  const out = { mataKuliah: "", kode: "", info: "", tanggalUjian: "", catatan: "", modul: [] };
  let mod = null, section = null, q = null, field = null;
  let para = [];   // paragraf teks bebas yang sedang dikumpulkan
  const flushPara = () => {
    if (!para.length || !mod) { para = []; return; }
    const p = para.join(" ").replace(/\s+/g, " ").trim(); para = [];
    if (!p) return;
    if (!mod.ringkasan && !mod.poin.length) mod.ringkasan = p;
    else mod.poin.push(...potongParagraf(p, 700));
  };
  const newModul = (nomor, judul) => { flushPara(); mod = { nomor, judul, subjudul: [], ringkasan: "", poin: [], istilah: [], soal: [], esai: [] }; out.modul.push(mod); section = "ringkasan"; q = null; field = null; };
  const ensureModul = () => { if (!mod) newModul(null, ""); };
  const add = (a, b) => (a ? a + " " + b : b);
  const addLn = (a, b) => (a ? a + "\n" + b : b);       // ringkasan: pertahankan baris & judul
  const BUL = /^([-•–]|\*(?=\s)|\d+[.)])\s+/;            // tanda poin (bukan *miring*)

  const lines = String(text).replace(/\r/g, "").replace(/```[a-zA-Z]*/g, "").split("\n");
  for (let raw of lines) {
    // fmt = baris asli (format **tebal**, *miring*, ## judul tetap ada)
    const fmt = raw.replace(/\s?\[\d+(?:\s*[,\-–]\s*\d+)*\]/g, "") // angka sumber NotebookLM [1]
      .replace(/^\s*>\s*/, "").trim();
    const fl = fmt.replace(/^#+\s*/, "").replace(/^=+\s*|\s*=+$/g, "").trim();
    // line = versi polos, untuk mengenali judul seperti MODUL 1: / RINGKASAN:
    const line = fl.replace(/\*\*|__/g, "").trim();
    if (!line) { if (section === "bebas") flushPara(); if (section === "ringkasan" && mod && mod.ringkasan && !mod.ringkasan.endsWith("\n\n")) mod.ringkasan += "\n"; continue; }
    const isBullet = BUL.test(line);
    const two = (re) => fl.match(re) || line.match(re);    // ambil isi dengan format kalau bisa
    let m;

    // Info mata kuliah
    const labelBaru = /^(mata\s*kuliah|kode|tanggal\s*ujian|info|keterangan|catatan|tips)\s*[:：]|^(modul|bab)\s+\d+\s*([:.\-–—)]|$)|^(ringkasan|poin(\s*-?\s*poin)?(\s*penting)?|istilah|kata\s*kunci|(soal\s*|latihan\s*)?esai|(latihan\s*)?soal(\s*pilihan\s*ganda|\s*pg)?)\s*[:：]?/i.test(line);
    if (labelBaru && section === "bebas") flushPara();
    // Keterangan (MATA KULIAH, KODE, ...) hanya dibaca sebelum isi materi dimulai
    const belumAdaIsi = !mod || !(mod.ringkasan || mod.poin.length || mod.istilah.length || mod.soal.length || mod.esai.length);
    if (belumAdaIsi && (m = line.match(/^mata\s*kuliah\s*[:：]\s*(.*)$/i))) { out.mataKuliah = m[1].trim(); continue; }
    if (belumAdaIsi && (m = line.match(/^kode(?:\s*mata\s*kuliah)?\s*[:：]\s*(.*)$/i))) { out.kode = m[1].replace(/^[-–—]$/, "").trim(); continue; }
    if (belumAdaIsi && (m = line.match(/^tanggal\s*ujian\s*[:：]\s*(.*)$/i))) { out.tanggalUjian = parseTanggal(m[1]); continue; }
    if (belumAdaIsi && (m = line.match(/^(?:info|keterangan)\s*[:：]\s*(.*)$/i))) { out.info = m[1].trim(); continue; }
    if (belumAdaIsi && (m = line.match(/^(?:catatan|tips)\s*[:：]\s*(.*)$/i))) { if (!out.catatan) out.catatan = m[1].trim(); continue; }

    // Sub-judul modul: "SUB-JUDUL: Kegiatan Belajar 1"
    if (mod && (m = line.match(/^sub[\s-]*judul\s*[:：]\s*(.+)$/i))) { flushPara(); if (mod.subjudul.length < 3) mod.subjudul.push(m[1].trim()); continue; }

    // Judul modul: "MODUL 1: Judul" atau "BAB 2 - Judul"
    if (!isBullet && (m = line.match(/^(?:modul|bab)\s+(\d+)\s*(?:[:.\-–—)]\s*(.*)|$)/i))) { newModul(Number(m[1]), (m[2] || "").trim()); continue; }

    // Judul bagian
    // Judul bagian hanya dikenali kalau pakai titik dua (SOAL:) atau HURUF BESAR semua (SOAL),
    // supaya kalimat biasa seperti "Soal ini membahas..." tetap jadi isi materi
    const judulBagian = (re) => re.test(line) && (/[:：]/.test(line) || line === line.toUpperCase());
    if ((m = two(/^ringkasan\s*[:：]\s*(.*)$/i)) || line === "RINGKASAN") { ensureModul(); section = "ringkasan"; if (m && m[1].trim()) mod.ringkasan = addLn(mod.ringkasan, m[1].trim()); continue; }
    if (judulBagian(/^poin(\s*-?\s*poin)?(\s*penting)?\s*[:：]?$/i)) { ensureModul(); section = "poin"; continue; }
    if (judulBagian(/^(istilah|kata\s*kunci)(\s*penting)?\s*[:：]?$/i)) { ensureModul(); section = "istilah"; continue; }
    if (judulBagian(/^(soal\s*|latihan\s*)?esai\s*[:：]?$/i)) { ensureModul(); section = "esai"; q = null; continue; }
    if (judulBagian(/^(latihan\s*)?soal(\s*pilihan\s*ganda|\s*pg)?\s*[:：]?$/i)) { ensureModul(); section = "soal"; q = null; continue; }
    if (!section) { ensureModul(); section = "ringkasan"; }

    // Teks bebas: paragraf pertama = ringkasan, sisanya poin penting; judul (##) & poin (-) tetap
    if (section === "bebas") {
      if (/^#{1,3}\s/.test(fmt)) { flushPara(); mod.poin.push(fmt); continue; }
      if (BUL.test(fl)) { flushPara(); mod.poin.push(fmt.replace(BUL, "")); continue; }
      para.push(fmt);
      continue;
    }

    if (section === "ringkasan") { mod.ringkasan = addLn(mod.ringkasan, fmt); continue; }
    if (section === "poin") { mod.poin.push(fmt.replace(BUL, "")); continue; }
    if (section === "istilah") {
      const t = line.replace(BUL, "");
      const sp = t.match(/^(.+?)\s*(?:[:：=]|\s[-–—]\s)\s*(.+)$/);
      if (sp) mod.istilah.push({ kata: sp[1].trim(), arti: sp[2].trim() });
      else mod.ringkasan = addLn(mod.ringkasan, fmt);          // jangan dibuang
      continue;
    }

    const nomorSoal = two(/^(?:soal\s*)?\d+\s*[.):]\s*(.+)$/i);
    if (section === "soal") {
      if (nomorSoal) { q = { tanya: nomorSoal[1], pilihan: [], jawaban: "", pembahasan: "" }; mod.soal.push(q); field = "tanya"; continue; }
      if (!q) { mod.ringkasan = addLn(mod.ringkasan, fmt); continue; }
      if ((m = two(/^\(?([A-Ha-h])[.)]\s*(.+)$/))) { q.pilihan.push(m[2].trim()); field = null; continue; }
      if ((m = line.match(/^(?:kunci\s*)?jawaban(?:\s*benar)?\s*[:：]\s*(.*)$/i))) {
        const h = m[1].trim().match(/^\(?([A-Ha-h])(?:[.)\s]|$)/);
        q.jawaban = h ? h[1].toUpperCase() : m[1].trim(); field = null; continue;
      }
      if ((m = two(/^pembahasan\s*[:：]\s*(.*)$/i))) { q.pembahasan = m[1].trim(); field = "pembahasan"; continue; }
      if (field === "tanya" && !q.pilihan.length) q.tanya = add(q.tanya, fl);
      else if (field === "pembahasan") q.pembahasan = add(q.pembahasan, fl);
      else mod.ringkasan = addLn(mod.ringkasan, fmt);          // jangan dibuang
      continue;
    }
    if (section === "esai") {
      if (nomorSoal) { q = { tanya: nomorSoal[1], jawaban: "" }; mod.esai.push(q); field = "tanya"; continue; }
      if (!q) { mod.ringkasan = addLn(mod.ringkasan, fmt); continue; }
      if ((m = two(/^(?:contoh\s*)?jawaban\s*[:：]\s*(.*)$/i))) { q.jawaban = m[1].trim(); field = "jawaban"; continue; }
      q[field] = field === "jawaban" ? addLn(q[field], fmt.replace(BUL, "")) : add(q[field], fl);
    }
  }
  flushPara();
  out.modul = out.modul.filter((x) => x.judul || x.ringkasan || x.poin.length || x.istilah.length || x.soal.length || x.esai.length);
  // buang kalimat pembuka tanpa judul modul (misalnya "Berikut materinya:") kalau ada modul sungguhan
  out.modul.forEach((x) => { x.ringkasan = x.ringkasan.replace(/\n{3,}/g, "\n\n").trim(); });
  if (!out.modul.length) throw new Error("Belum ada materi yang terbaca. Pastikan baris paling atas berisi MATA KULIAH: dan MODUL 1:, lalu materinya di bawahnya.");
  return out;
}

// Ubah materi jadi teks biasa (untuk "Simpan ke file")
function toText(d) {
  const L = [`MATA KULIAH: ${d.mataKuliah}`];
  if (d.kode) L.push(`KODE: ${d.kode}`);
  L.push(`TANGGAL UJIAN: ${tulisTanggal(d.tanggalUjian)}`);
  if (d.info) L.push(`INFO: ${d.info}`);
  if (d.catatan) L.push(`CATATAN: ${d.catatan}`);
  d.modul.forEach((m) => {
    L.push("", `MODUL ${m.nomor}: ${m.judul}`);
    (m.subjudul || []).forEach((sj) => L.push(`SUB-JUDUL: ${sj}`));
    if (m.ringkasan) L.push("RINGKASAN:", m.ringkasan);
    if (m.poin.length) L.push("POIN PENTING:", ...m.poin.map((p) => `- ${p}`));
    if (m.istilah.length) L.push("ISTILAH:", ...m.istilah.map((t) => `- ${t.kata}: ${t.arti}`));
    if (m.soal.length) {
      L.push("SOAL:");
      m.soal.forEach((s, i) => {
        L.push(`${i + 1}. ${s.tanya}`, ...s.pilihan.map((p, j) => `${String.fromCharCode(65 + j)}. ${p}`), `JAWABAN: ${String.fromCharCode(65 + s.jawaban)}`);
        if (s.pembahasan) L.push(`PEMBAHASAN: ${s.pembahasan}`);
      });
    }
    if (m.esai.length) {
      L.push("ESAI:");
      m.esai.forEach((s, i) => L.push(`${i + 1}. ${s.tanya}`, `JAWABAN: ${s.jawaban || "-"}`));
    }
  });
  return L.join("\n") + "\n";
}

// Pilih cara baca: susunan teks biasa (utama) atau JSON (file lama)
function bacaMateri(text) {
  const t = String(text).replace(/```[a-zA-Z]*/g, "").trim().replace(/^﻿/, "");
  if (/^[\[{]/.test(t)) return extractJSON(t);
  return parseSederhana(t);
}

function toAnswerIndex(jawaban, pilihan) {
  if (typeof jawaban === "number") return jawaban;
  const s = String(jawaban ?? "").trim();
  if (/^\d+$/.test(s)) return Number(s);
  if (/^[A-Ha-h][.)]?$/.test(s)) return s.toUpperCase().charCodeAt(0) - 65;
  return pilihan.findIndex((p) => p.trim().toLowerCase() === s.toLowerCase());
}

function normalize(obj) {
  let d = obj;
  if (Array.isArray(d)) d = { modul: d };
  if (d && !d.modul && d.judul) d = { modul: [d] };
  if (!d || !Array.isArray(d.modul) || !d.modul.length) throw new Error("Materinya masih kosong.");

  const str = (v) => (v == null ? "" : String(v).trim());
  const arr = (v) => (Array.isArray(v) ? v : []);
  const num = (v) => { const n = Math.round(Number(v)); return n > 0 && n < 1000 ? n : null; };

  const modul = d.modul.filter((m) => m && typeof m === "object").map((m, i) => ({
    nomor: num(m.nomor),
    judul: str(m.judul) || `Modul ${num(m.nomor) || i + 1}`,
    subjudul: arr(m.subjudul).map(str).filter(Boolean).slice(0, 3),
    ringkasan: str(m.ringkasan),
    poin: arr(m.poin).map(str).filter(Boolean),
    istilah: arr(m.istilah).map((t) => ({ kata: str(t?.kata ?? t?.istilah), arti: str(t?.arti ?? t?.definisi) })).filter((t) => t.kata && t.arti),
    soal: arr(m.soal).map((q) => {
      const pilihan = arr(q?.pilihan).map(str).filter(Boolean);
      return { tanya: str(q?.tanya ?? q?.pertanyaan), pilihan, jawaban: toAnswerIndex(q?.jawaban, pilihan), pembahasan: str(q?.pembahasan) };
    }).filter((q) => q.tanya && q.pilihan.length >= 2 && q.jawaban >= 0 && q.jawaban < q.pilihan.length),
    esai: arr(m.esai).map((q) => ({ tanya: str(q?.tanya ?? q?.pertanyaan), jawaban: str(q?.jawaban) })).filter((q) => q.tanya)
  }));
  if (!modul.length) throw new Error("Materinya masih kosong.");

  return {
    mataKuliah: str(d.mataKuliah) || "Mata Kuliah Tanpa Nama",
    kode: str(d.kode),
    info: str(d.info),
    tanggalUjian: str(d.tanggalUjian),
    catatan: str(d.catatan),
    modul
  };
}

// Pastikan setiap modul punya nomor unik, lalu urutkan
function fillNomor(list) {
  const used = new Set();
  list.forEach((m) => { if (m.nomor && !used.has(m.nomor)) used.add(m.nomor); else m.nomor = null; });
  let n = 1;
  list.forEach((m) => { if (!m.nomor) { while (used.has(n)) n++; m.nomor = n; used.add(n); } });
  return list.sort((a, b) => a.nomor - b.nomor);
}

// Materi dari versi lama belum punya nomor modul
Object.values(library.subjects).forEach((s) => { if (Array.isArray(s.modul)) fillNomor(s.modul); });

/* ============================================================
   MENYIMPAN: MATA KULIAH BARU / TAMBAHKAN KE YANG ADA
   ============================================================ */
function saveNew(data) {
  const base = courseKey(data);
  let id = base, n = 2;
  while (library.subjects[id]) id = `${base}-${n++}`;
  data.modul = fillNomor(data.modul);
  library.subjects[id] = data;
  saveLibrary();
  bukaMateri(id);
  toast(`🎉 Tersimpan: ${data.mataKuliah} · ${data.modul.length} modul`);
}

function mergeInto(id, incoming) {
  const target = library.subjects[id];
  let added = 0, updated = 0;
  incoming.modul.forEach((m) => {
    const idx = target.modul.findIndex((e) => (m.nomor && e.nomor === m.nomor) || slug(e.judul) === slug(m.judul));
    if (idx >= 0) { target.modul[idx] = { ...m, nomor: m.nomor || target.modul[idx].nomor }; updated++; }
    else { target.modul.push({ ...m }); added++; }
  });
  ["kode", "info", "tanggalUjian", "catatan"].forEach((k) => { if (!target[k] && incoming[k]) target[k] = incoming[k]; });
  fillNomor(target.modul);
  saveLibrary();
  bukaMateri(id);
  const parts = [];
  if (added) parts.push(`${added} modul ditambahkan`);
  if (updated) parts.push(`${updated} modul diperbarui`);
  toast(`🎉 ${target.mataKuliah}: ${parts.join(", ")}`);
}

let pending = null, pendingDraf = false;
function chooseDestination(data, dariDraf = false) {
  const ids = Object.keys(library.subjects);
  if (!ids.length) { saveNew(data); if (dariDraf) hapusDrafMateri(); return; }
  pending = data; pendingDraf = dariDraf;
  const key = courseKey(data);
  const match = ids.find((id) => { const s = library.subjects[id]; return courseKey(s) === key || slug(s.mataKuliah) === slug(data.mataKuliah); });
  const nomorList = data.modul.map((m) => m.nomor).filter(Boolean);
  $("destSummary").textContent = `"${data.mataKuliah}" · ${data.modul.length} modul` + (nomorList.length ? ` (Modul ${nomorList.join(", ")})` : "");
  const opt = (value, label, sub, checked) => `
    <label class="choice"><input type="radio" name="dest" value="${esc(value)}" ${checked ? "checked" : ""}>
      <span>${label}${sub ? `<small>${sub}</small>` : ""}</span></label>`;
  $("destOptions").innerHTML =
    ids.map((id) => {
      const s = library.subjects[id];
      return opt(id, `Tambahkan ke: <b>${esc(s.mataKuliah)}</b>`, `Sekarang ada ${s.modul.length} modul`, id === match);
    }).join("") +
    opt("__baru", "Simpan sebagai <b>mata kuliah baru</b>", "", !match);
  openModal("destModal");
}
$("destSave").addEventListener("click", () => {
  if (!pending) return;
  const pick = document.querySelector('input[name="dest"]:checked');
  const data = pending; pending = null;
  closeModal("destModal");
  if (!pick || pick.value === "__baru" || !library.subjects[pick.value]) saveNew(data);
  else mergeInto(pick.value, data);
  if (pendingDraf) { hapusDrafMateri(); pendingDraf = false; }
});

/* ============================================================
   MODAL MASUKKAN MATERI
   ============================================================ */
/* ---------- Cara 1: formulir ---------- */
let rowSeq = 0;
const letter = (i) => String.fromCharCode(65 + i);
function rowHead(label) {
  return `<div class="row-head"><b>${label} <span class="no"></span></b><button type="button" class="link-btn" data-hapus>✕ Hapus</button></div>`;
}
function addRow(boxId, html) {
  const div = document.createElement("div");
  div.className = "form-row";
  div.innerHTML = html;
  $(boxId).appendChild(div);
  renumber(boxId);
  return div;
}
function renumber(boxId) { $(boxId).querySelectorAll(".form-row").forEach((r, i) => (r.querySelector(".no").textContent = i + 1)); }
function addIstilahRow() {
  addRow("fIstilah", rowHead("Istilah") + `
    <div class="two"><input type="text" class="i-kata" maxlength="150" placeholder="Istilah, contoh: Kelangkaan">
    <input type="text" class="i-arti" maxlength="500" placeholder="Artinya"></div>`);
}
/* ---------- Kotak tulisan langsung jadi (tebal, miring, judul tanpa tanda # atau *) ----------
   Di balik layar isi tetap disimpan dengan tanda sederhana (## judul, **tebal**, *miring*)
   di <textarea> tersembunyi, supaya simpan otomatis, berbagi, dan file .txt tetap jalan. */
try { document.execCommand("defaultParagraphSeparator", false, "div"); } catch (e) {}
const nilaiAsli = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value");

// Kotak tulisan (HTML) → teks bertanda
function editorKeTeks(root) {
  const lines = []; let cur = ""; let habisBr = false;
  const baris = () => { lines.push(cur); cur = ""; };
  const tebal = (el) => /^(B|STRONG)$/.test(el.tagName) || Number(el.style && el.style.fontWeight) >= 600 || (el.style && el.style.fontWeight === "bold");
  const miring = (el) => /^(I|EM)$/.test(el.tagName) || (el.style && el.style.fontStyle === "italic");
  const BLOK = /^(DIV|P|H1|H2|H3|H4|H5|H6|LI|BLOCKQUOTE|PRE|TR|SECTION|ARTICLE|HEADER|FOOTER)$/;
  const jalan = (node) => {
    node.childNodes.forEach((n) => {
      if (n.nodeType === 3) { const t = n.nodeValue.replace(/[\r\n]+/g, " ").replace(/ /g, " "); if (t) { cur += t; habisBr = false; } return; }
      if (n.nodeType !== 1) return;
      const tag = n.tagName;
      if (tag === "BR") { baris(); habisBr = true; return; }
      if (/^(SCRIPT|STYLE|META|TITLE)$/.test(tag)) return;
      if (BLOK.test(tag)) {
        if (cur !== "") baris();
        habisBr = false;
        if (/^H[12]$/.test(tag)) cur = "## ";
        else if (/^H[3-6]$/.test(tag)) cur = "### ";
        else if (tag === "LI") cur = "- ";
        jalan(n);
        if (cur !== "" || !habisBr) baris();
        habisBr = false;
        return;
      }
      const b = tebal(n), i = miring(n);
      if (b) cur += "**"; if (i) cur += "*";
      jalan(n);
      if (i) cur += "*"; if (b) cur += "**";
    });
  };
  jalan(root);
  if (cur !== "") baris();
  return lines
    .map((l) => l.replace(/\*{4}/g, "").replace(/^(#{2,3} |- )\s*$/, "").replace(/\s+$/, ""))
    .join("\n").replace(/\n{3,}/g, "\n\n").replace(/^\n+|\n+$/g, "");
}
// Teks bertanda → kotak tulisan (HTML)
function teksKeEditor(teks, inline) {
  const v = String(teks ?? "");
  if (!v) return "";
  return v.split("\n").map((l) => {
    let m;
    if (!inline && (m = l.match(/^###\s+(.*)$/))) return `<h3>${fmtInline(esc(m[1])) || "<br>"}</h3>`;
    if (!inline && (m = l.match(/^##?\s+(.*)$/))) return `<h2>${fmtInline(esc(m[1])) || "<br>"}</h2>`;
    return `<div>${fmtInline(esc(l)) || "<br>"}</div>`;
  }).join("");
}

function enhanceRich(ta, kind = "block") {
  if (!ta || ta.dataset.rich) return;
  ta.dataset.rich = kind;
  const inline = kind === "inline";
  const bar = document.createElement("div");
  bar.className = "rich-tools";
  bar.innerHTML = (!inline ? `<button type="button" data-fmt="h" title="Judul" aria-pressed="false"><span class="fh">Judul</span></button>
    <button type="button" data-fmt="h2" title="Sub-judul" aria-pressed="false"><span class="fh2">Sub-judul</span></button>` : "") +
    `<button type="button" data-fmt="b" title="Tebal (Ctrl+B)" aria-pressed="false"><b>B</b> <small>Tebal</small></button>
    <button type="button" data-fmt="i" title="Miring (Ctrl+I)" aria-pressed="false"><i>I</i> <small>Miring</small></button>`;
  const ed = document.createElement("div");
  ed.className = "editor rich" + (inline ? " inline" : "");
  ed.contentEditable = "true";
  ed.setAttribute("role", "textbox");
  ed.setAttribute("aria-multiline", "true");
  ed.dataset.placeholder = ta.placeholder || "";
  if (ta.style.minHeight) ed.style.minHeight = ta.style.minHeight;
  ta.parentNode.insertBefore(bar, ta);
  ta.parentNode.insertBefore(ed, ta);
  ta.classList.add("hidden");
  ta.tabIndex = -1;
  ta._editor = ed;
  ed._ta = ta;
  // setiap kali kode mengisi ta.value (draf, kosongkan, contoh), kotak tulisan ikut berubah
  Object.defineProperty(ta, "value", {
    configurable: true,
    get() { return nilaiAsli.get.call(ta); },
    set(v) { nilaiAsli.set.call(ta, v); if (!ta._sinkron) { ed.innerHTML = teksKeEditor(v, inline); } }
  });
  ed.innerHTML = teksKeEditor(nilaiAsli.get.call(ta), inline);
  ed.addEventListener("input", () => {
    ta._sinkron = true; ta.value = editorKeTeks(ed); ta._sinkron = false;
    if (!ed.textContent.trim() && !ed.querySelector("h2,h3")) ed.innerHTML = "";
    perbaruiTombol();
  });
  // tempel: ambil tebal/miring/judul saja, buang gaya lain dari Word/PDF/web
  ed.addEventListener("paste", (e) => {
    const cd = e.clipboardData; if (!cd) return;
    e.preventDefault();
    const html = cd.getData("text/html"), plain = cd.getData("text/plain");
    let teks;
    if (html) { const tmp = document.createElement("div"); tmp.innerHTML = html; teks = editorKeTeks(tmp); }
    else teks = plain.replace(/\r/g, "");
    // sisipkan sendiri (bukan insertHTML) supaya browser tidak menambah warna/font tersembunyi
    const html2 = inline ? fmtInline(esc(teks.replace(/^#{1,3}\s+/gm, ""))).replace(/\n/g, "<br>") : teksKeEditor(teks, false);
    const sel = window.getSelection();
    if (!sel.rangeCount || !ed.contains(sel.anchorNode)) { ed.focus(); const r0 = document.createRange(); r0.selectNodeContents(ed); r0.collapse(false); sel.removeAllRanges(); sel.addRange(r0); }
    const r = sel.getRangeAt(0);
    r.deleteContents();
    const frag = r.createContextualFragment(html2);
    const akhir = frag.lastChild;
    r.insertNode(frag);
    if (akhir) { const r2 = document.createRange(); r2.selectNodeContents(akhir); r2.collapse(false); sel.removeAllRanges(); sel.addRange(r2); }
    ed.dispatchEvent(new Event("input", { bubbles: true }));
  });
  if (ta.labels && ta.labels[0]) ed.setAttribute("aria-label", ta.labels[0].firstChild.textContent.trim());
}
function enhanceAll(root) {
  root.querySelectorAll("textarea.s-tanya, textarea.e-tanya").forEach((t) => enhanceRich(t, "inline"));
  root.querySelectorAll("textarea.e-jawab").forEach((t) => enhanceRich(t, "block"));
}
function editorAktif() {
  const sel = window.getSelection();
  const node = sel && sel.anchorNode;
  const el = node && (node.nodeType === 1 ? node : node.parentElement);
  return el ? el.closest(".editor") : null;
}
function blokSekarang(ed) {
  const sel = window.getSelection(); let n = sel && sel.anchorNode;
  while (n && n !== ed) { if (n.nodeType === 1 && /^(H2|H3|DIV|P)$/.test(n.tagName)) return n.tagName; n = n.parentNode; }
  return "";
}
function perbaruiTombol() {
  const ed = editorAktif();
  document.querySelectorAll(".rich-tools").forEach((bar) => {
    const milik = bar.nextElementSibling === ed;
    const blok = milik ? blokSekarang(ed) : "";
    bar.querySelectorAll("[data-fmt]").forEach((b) => {
      let on = false;
      if (milik) {
        if (b.dataset.fmt === "b") on = document.queryCommandState("bold");
        if (b.dataset.fmt === "i") on = document.queryCommandState("italic");
        if (b.dataset.fmt === "h") on = blok === "H2";
        if (b.dataset.fmt === "h2") on = blok === "H3";
      }
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
  });
}
document.addEventListener("selectionchange", perbaruiTombol);
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-fmt]");
  if (!b) return;
  const bar = b.closest(".rich-tools");
  const ed = bar && bar.nextElementSibling;
  if (!ed || !ed.classList.contains("editor")) return;
  e.preventDefault();
  if (editorAktif() !== ed) {             // belum ada kursor di kotak ini: taruh di akhir
    ed.focus();
    const r = document.createRange(); r.selectNodeContents(ed); r.collapse(false);
    const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
  }
  const f = b.dataset.fmt;
  if (f === "b") document.execCommand("bold");
  else if (f === "i") document.execCommand("italic");
  else {
    if (!ed.innerHTML.trim()) { ed.innerHTML = "<div><br></div>"; const r = document.createRange(); r.setStart(ed.firstChild, 0); r.collapse(true); const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r); }
    const tag = f === "h" ? "H2" : "H3";
    document.execCommand("formatBlock", false, blokSekarang(ed) === tag ? "<div>" : `<${tag.toLowerCase()}>`);
  }
  ed.dispatchEvent(new Event("input", { bubbles: true }));
});
// tombol format tidak mencuri kursor dari kotak tulisan
document.addEventListener("mousedown", (e) => { if (e.target.closest("[data-fmt]")) e.preventDefault(); });
document.addEventListener("click", (e) => {
  const lab = e.target.closest("label.field");
  if (!lab || e.target.closest(".editor, .rich-tools, input, select, button")) return;
  const ta = lab.querySelector("textarea[data-rich]");
  if (ta && ta._editor) ta._editor.focus();
});
enhanceRich($("fRingkasan"), "block");
enhanceRich($("fPoin"), "poin");
enhanceRich($("pasteInput"), "block");
enhanceRich($("soalTanya"), "inline");
enhanceRich($("soalJawabEsai"), "block");
enhanceRich($("soalBahas"), "inline");

function addSoalRow() {
  const id = ++rowSeq;
  addRow("fSoal", rowHead("Soal") + `
    <textarea class="s-tanya" maxlength="1000" placeholder="Tulis pertanyaannya..."></textarea>
    <small class="hint">Isi pilihannya, lalu tekan bulatan di samping jawaban yang <b>benar</b>.</small>
    ${[0, 1, 2, 3].map((i) => `<label class="opt-row"><input type="radio" name="benar-${id}" value="${i}" aria-label="Jawaban ${letter(i)} benar">
      <input type="text" class="s-opt" maxlength="300" placeholder="Pilihan ${letter(i)}"></label>`).join("")}
    <input type="text" class="s-bahas" maxlength="1500" placeholder="Pembahasan (boleh kosong)" style="margin-top:8px;width:100%">`);
  enhanceAll($("fSoal"));
}
function addEsaiRow() {
  addRow("fEsai", rowHead("Esai") + `
    <textarea class="e-tanya" maxlength="1000" placeholder="Tulis pertanyaan esai..."></textarea>
    <textarea class="e-jawab" maxlength="3000" placeholder="Contoh jawabannya..."></textarea>`);
  enhanceAll($("fEsai"));
}
$("addIstilah").addEventListener("click", addIstilahRow);
$("addSoal").addEventListener("click", addSoalRow);
$("addEsai").addEventListener("click", addEsaiRow);
["fIstilah", "fSoal", "fEsai"].forEach((boxId) => $(boxId).addEventListener("click", (e) => {
  const del = e.target.closest("[data-hapus]");
  if (!del) return;
  del.closest(".form-row").remove();
  renumber(boxId);
  simpanDrafSegera();
}));
["addIstilah", "addSoal", "addEsai"].forEach((id) => $(id).addEventListener("click", () => simpanDrafSegera()));

/* Judul modul: Enter = baris sub-judul baru (maks. 3), kotak ikut memanjang */
const MAKS_BARIS_JUDUL = 4;
function tinggiJudul() { const t = $("fJudul"); t.style.height = "auto"; t.style.height = t.scrollHeight + 2 + "px"; }
$("fJudul").addEventListener("keydown", (e) => {
  if (e.key === "Enter" && $("fJudul").value.split("\n").filter((x) => x.trim()).length >= MAKS_BARIS_JUDUL) {
    e.preventDefault(); toast("Sub-judul maksimal 3 baris ya.");
  }
});
$("fJudul").addEventListener("input", () => {
  const t = $("fJudul");
  let baris = t.value.split("\n");
  if (baris.length > MAKS_BARIS_JUDUL) {
    baris = baris.filter((x, i) => x.trim() || i === baris.length - 1);   // buang baris kosong di tengah
    if (baris.length > MAKS_BARIS_JUDUL) baris = baris.slice(0, MAKS_BARIS_JUDUL);
    t.value = baris.join("\n");
  }
  tinggiJudul();
});

function resetForm() {
  const d = current();
  $("fMkList").innerHTML = Object.values(library.subjects).map((s) => `<option value="${esc(s.mataKuliah)}">`).join("");
  $("fMk").value = d ? d.mataKuliah : "";
  $("fKode").value = d ? d.kode : "";
  $("fTgl").value = d && d.tanggalUjian ? d.tanggalUjian.slice(0, 10) : "";
  $("fNomor").value = d ? Math.max(0, ...d.modul.map((m) => m.nomor)) + 1 : 1;
  ["fJudul", "fRingkasan", "fPoin"].forEach((id) => ($(id).value = ""));
  ["fIstilah", "fSoal", "fEsai"].forEach((id) => ($(id).innerHTML = ""));
  addIstilahRow(); addIstilahRow(); addSoalRow(); addEsaiRow();
  setTimeout(tinggiJudul, 0);
}

function collectForm() {
  const val = (id) => $(id).value.trim();
  const judulBaris = $("fJudul").value.split("\n").map((x) => x.trim()).filter(Boolean);
  const mataKuliah = val("fMk"), judul = judulBaris[0] || "", subjudul = judulBaris.slice(1, 4);
  if (!mataKuliah) throw new Error("Nama mata kuliah belum diisi.");
  if (!judul) throw new Error("Judul modul belum diisi.");

  const istilah = [];
  $("fIstilah").querySelectorAll(".form-row").forEach((r, i) => {
    const kata = r.querySelector(".i-kata").value.trim(), arti = r.querySelector(".i-arti").value.trim();
    if (!kata && !arti) return;
    if (!kata || !arti) throw new Error(`Istilah ${i + 1}: isi istilah dan artinya.`);
    istilah.push({ kata, arti });
  });

  const soal = [];
  $("fSoal").querySelectorAll(".form-row").forEach((r, i) => {
    const tanya = r.querySelector(".s-tanya").value.trim();
    const raw = [...r.querySelectorAll(".s-opt")].map((x) => x.value.trim());
    const benar = r.querySelector('input[type="radio"]:checked');
    const bahas = r.querySelector(".s-bahas").value.trim();
    if (!tanya && !raw.some(Boolean) && !bahas) return;
    if (!tanya) throw new Error(`Soal ${i + 1}: pertanyaannya belum diisi.`);
    if (raw.filter(Boolean).length < 2) throw new Error(`Soal ${i + 1}: isi minimal 2 pilihan jawaban.`);
    if (!benar) throw new Error(`Soal ${i + 1}: tekan bulatan di samping jawaban yang benar.`);
    if (!raw[Number(benar.value)]) throw new Error(`Soal ${i + 1}: jawaban yang dipilih sebagai benar masih kosong.`);
    const pilihan = []; let jawaban = 0;
    raw.forEach((p, j) => { if (p) { if (j === Number(benar.value)) jawaban = pilihan.length; pilihan.push(p); } });
    soal.push({ tanya, pilihan, jawaban, pembahasan: bahas });
  });

  const esai = [];
  $("fEsai").querySelectorAll(".form-row").forEach((r, i) => {
    const tanya = r.querySelector(".e-tanya").value.trim(), jawaban = r.querySelector(".e-jawab").value.trim();
    if (!tanya && !jawaban) return;
    if (!tanya) throw new Error(`Esai ${i + 1}: pertanyaannya belum diisi.`);
    esai.push({ tanya, jawaban });
  });

  const ringkasan = val("fRingkasan");
  const poin = $("fPoin").value.split("\n").map((p) => p.replace(/^\s*([-•–]|\*(?=\s)|\d+[.)])\s+/, "").trim()).filter(Boolean);
  if (!ringkasan && !poin.length && !istilah.length && !soal.length && !esai.length) {
    throw new Error("Isi minimal salah satu: ringkasan, poin penting, istilah, atau soal.");
  }
  const tgl = val("fTgl");
  return {
    mataKuliah, kode: val("fKode"), tanggalUjian: tgl ? tgl + "T07:00" : "",
    modul: [{ nomor: Number(val("fNomor")) || null, judul, subjudul, ringkasan, poin, istilah, soal, esai }]
  };
}

/* ---------- Simpan otomatis (draf) ---------- */
const DRAF_MATERI = "demuse-belajar-draf-materi";
const DRAF_SOAL = "demuse-belajar-draf-soal";
const adaIsi = (...xs) => xs.some((x) => String(x ?? "").trim());

function ambilDrafMateri() {
  const rows = (id) => [...$(id).querySelectorAll(".form-row")];
  return {
    mode: importMode,
    mk: $("fMk").value, kode: $("fKode").value, tgl: $("fTgl").value, nomor: $("fNomor").value,
    judul: $("fJudul").value, ringkasan: $("fRingkasan").value, poin: $("fPoin").value,
    istilah: rows("fIstilah").map((r) => [r.querySelector(".i-kata").value, r.querySelector(".i-arti").value]),
    soal: rows("fSoal").map((r) => ({
      t: r.querySelector(".s-tanya").value,
      o: [...r.querySelectorAll(".s-opt")].map((x) => x.value),
      b: (r.querySelector('input[type="radio"]:checked') || {}).value ?? null,
      p: r.querySelector(".s-bahas").value
    })),
    esai: rows("fEsai").map((r) => [r.querySelector(".e-tanya").value, r.querySelector(".e-jawab").value]),
    tempel: $("pasteInput").value
  };
}
function drafMateriBerisi(d) {
  if (!d || typeof d !== "object") return false;
  return adaIsi(d.judul, d.ringkasan, d.poin) || tempelBerisi(d.tempel) ||
    (d.istilah || []).some((r) => adaIsi(...r)) ||
    (d.soal || []).some((x) => adaIsi(x.t, x.p, ...(x.o || []))) ||
    (d.esai || []).some((r) => adaIsi(...r));
}
function pulihkanDrafMateri(d) {
  resetForm();
  ["mk", "kode", "tgl", "nomor", "judul", "ringkasan", "poin"].forEach((k) => {
    const id = { mk: "fMk", kode: "fKode", tgl: "fTgl", nomor: "fNomor", judul: "fJudul", ringkasan: "fRingkasan", poin: "fPoin" }[k];
    if (d[k] != null && (d[k] !== "" || ["judul", "ringkasan", "poin"].includes(k))) $(id).value = d[k];
  });
  if ((d.istilah || []).length) {
    $("fIstilah").innerHTML = "";
    d.istilah.forEach(([k, a]) => { addIstilahRow(); const r = $("fIstilah").lastElementChild; r.querySelector(".i-kata").value = k || ""; r.querySelector(".i-arti").value = a || ""; });
  }
  if ((d.soal || []).length) {
    $("fSoal").innerHTML = "";
    d.soal.forEach((x) => {
      addSoalRow(); const r = $("fSoal").lastElementChild;
      r.querySelector(".s-tanya").value = x.t || "";
      r.querySelectorAll(".s-opt").forEach((inp, i) => (inp.value = (x.o || [])[i] || ""));
      if (x.b != null) { const rb = r.querySelector(`input[type="radio"][value="${Number(x.b)}"]`); if (rb) rb.checked = true; }
      r.querySelector(".s-bahas").value = x.p || "";
    });
  }
  if ((d.esai || []).length) {
    $("fEsai").innerHTML = "";
    d.esai.forEach(([t, j]) => { addEsaiRow(); const r = $("fEsai").lastElementChild; r.querySelector(".e-tanya").value = t || ""; r.querySelector(".e-jawab").value = j || ""; });
  }
  $("pasteInput").value = d.tempel || "";
  setTimeout(tinggiJudul, 0);
}
let drafTimer = null;
function tandaiTersimpan(id) {
  const el = $(id); if (!el) return;
  el.textContent = "✓ Tersimpan otomatis";
  el.classList.add("show");
  clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove("show"), 1800);
}
function simpanDrafSegera() {
  if ($("importModal").classList.contains("hidden")) return;
  clearTimeout(drafTimer);
  drafTimer = setTimeout(() => {
    const d = ambilDrafMateri();
    writeStore(DRAF_MATERI, drafMateriBerisi(d) ? d : null);
    if (drafMateriBerisi(d)) tandaiTersimpan("autosaveMateri");
  }, 400);
}
const hapusDrafMateri = () => { clearTimeout(drafTimer); writeStore(DRAF_MATERI, null); };
$("importModal").addEventListener("input", simpanDrafSegera);
$("importModal").addEventListener("change", simpanDrafSegera);
$("draftClear").addEventListener("click", () => {
  if (!confirm("Hapus semua isian ini dan mulai dari kosong?")) return;
  hapusDrafMateri();
  resetForm();
  $("pasteInput").value = "";
  $("draftNote").classList.add("hidden");
  showMsg("importMsg", "");
});

/* ---------- Pilih cara (formulir / tempel) ---------- */
let importMode = "form";
function templatTempel() {
  const d = current();
  const nomor = d ? Math.max(0, ...d.modul.map((m) => m.nomor)) + 1 : 1;
  return `MATA KULIAH: ${d ? d.mataKuliah : ""}\nMODUL ${nomor}: `;
}
const tempelBerisi = (t) => String(t || "").split("\n").some((l) => l.trim() && !/^(mata\s*kuliah|modul\s+\d+)\s*:\s*.*$/i.test(l.trim()) ) ||
  /modul\s+\d+\s*:\s*\S/i.test(String(t || ""));
function setMode(mode) {
  importMode = mode;
  if (mode === "tempel" && !$("pasteInput").value.trim()) {
    const t = templatTempel();
    $("pasteInput").value = t + "\n\n";
    setTimeout(() => {      // kursor di akhir baris MODUL, siap mengetik judul modul
      const ed = $("pasteInput")._editor; if (!ed || !ed.children[1]) return;
      try { ed.focus(); const r = document.createRange(); r.selectNodeContents(ed.children[1]); r.collapse(false); const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r); } catch (e) {}
    }, 50);
  }
  document.querySelectorAll(".mode-btn").forEach((b) => b.classList.toggle("active", b.dataset.mode === mode));
  $("modeForm").classList.toggle("hidden", mode !== "form");
  $("modeTempel").classList.toggle("hidden", mode !== "tempel");
  $("modeFile").classList.toggle("hidden", mode !== "file");
  $("saveImport").classList.toggle("hidden", mode === "file");
  showMsg("importMsg", "");
}
document.querySelectorAll(".mode-btn").forEach((b) => b.addEventListener("click", () => { setMode(b.dataset.mode); simpanDrafSegera(); }));

function openImport() {
  const draf = readStore(DRAF_MATERI, null);
  $("fileInput").value = "";
  if (drafMateriBerisi(draf)) {
    pulihkanDrafMateri(draf);
    setMode(draf.mode === "tempel" ? "tempel" : "form");
    $("draftNote").classList.remove("hidden");
  } else {
    resetForm();
    $("pasteInput").value = "";
    setMode("form");
    $("draftNote").classList.add("hidden");
  }
  openModal("importModal");
  $("importModal").scrollTop = 0;
}
document.querySelectorAll("[data-open-import]").forEach((b) => b.addEventListener("click", openImport));

/* ---------- Cara 2: tempel catatan / file ---------- */
function tryImport(text) {
  try {
    const raw = bacaMateri(text);
    const d = current();
    if (d && raw && !Array.isArray(raw) && !String(raw.mataKuliah || "").trim()) { raw.mataKuliah = d.mataKuliah; raw.kode = raw.kode || d.kode; }
    const data = normalize(raw);
    closeModal("importModal");
    chooseDestination(data, true);
  } catch (err) {
    showMsg("importMsg", "😕 " + err.message);
  }
}

/* ---------- Cara 3: pilih file (PDF, PowerPoint, Word, .txt) ---------- */
const LIB_PDF = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
const LIB_PDF_WORKER = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
const LIB_ZIP = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
const scriptCache = {};
function loadScript(src) {
  if (!scriptCache[src]) {
    scriptCache[src] = new Promise((res, rej) => {
      const el = document.createElement("script");
      el.src = src; el.onload = res;
      el.onerror = () => { delete scriptCache[src]; rej(new Error("Pembaca file gagal dimuat. Pastikan HP/laptop tersambung ke internet, lalu coba lagi.")); };
      document.head.appendChild(el);
    });
  }
  return scriptCache[src];
}

const SUSUNAN_RE = /^\s*(modul|bab)\s+\d+\s*[:.\-–]|^\s*(ringkasan|poin penting|soal)\s*:/im;
const judulDariFile = (name) => name.replace(/\.[^.]+$/, "").replace(/[_]+/g, " ").replace(/\s+/g, " ").trim() || "Materi dari file";
const bersih = (t) => String(t).replace(/\s+/g, " ").trim();

// Pecah paragraf yang terlalu panjang menjadi beberapa bagian di akhir kalimat
function potongParagraf(p, maks = 600) {
  if (p.length <= maks) return [p];
  const out = []; let cur = "";
  (p.match(/[^.!?]+[.!?]+["')\]]*\s*|[^.!?]+$/g) || [p]).forEach((k) => {
    if ((cur + k).length > maks && cur) { out.push(cur.trim()); cur = ""; }
    cur += k;
  });
  if (cur.trim()) out.push(cur.trim());
  return out;
}

// Baris-baris teks → paragraf (dipakai PDF & Word)
function barisKeParagraf(lines) {
  const paras = []; let cur = "";
  const tutup = () => { if (cur.trim()) paras.push(bersih(cur)); cur = ""; };
  lines.forEach((raw) => {
    const line = raw.trim();
    if (!line) { tutup(); return; }
    if (/^(halaman\s*)?\d{1,4}$/i.test(line)) return;          // nomor halaman
    cur = cur.endsWith("-") ? cur.slice(0, -1) + line : (cur ? cur + " " + line : line);
    if (/[.!?:]["')\]]?$/.test(line) && cur.length > 220) tutup();
  });
  tutup();
  return paras.filter((p) => p.trim().length >= 2);
}

function paragrafKeMateri(paras, judul) {
  if (!paras.length) throw new Error("Tidak ada tulisan yang bisa dibaca di file ini. Kalau file-nya hasil scan/foto, silakan ketik materinya di formulir.");
  return { mataKuliah: judul, modul: [{ judul, ringkasan: paras.join("\n\n"), poin: [] }] };
}

async function bacaPdf(file) {
  await loadScript(LIB_PDF);
  const lib = window.pdfjsLib;
  lib.GlobalWorkerOptions.workerSrc = LIB_PDF_WORKER;
  const pdf = await lib.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const lines = [];
  for (let p = 1; p <= pdf.numPages; p++) {
    showMsg("importMsg", `⏳ Membaca halaman ${p} dari ${pdf.numPages}...`, "ok");
    const isi = await (await pdf.getPage(p)).getTextContent();
    let line = "";
    isi.items.forEach((it) => { line += it.str || ""; if (it.hasEOL) { lines.push(line); line = ""; } });
    if (line) lines.push(line);
    lines.push("");
  }
  const teks = lines.join("\n");
  if (SUSUNAN_RE.test(teks)) return bacaMateri(teks);
  if (teks.replace(/\s/g, "").length < 40) throw new Error("PDF ini sepertinya hasil scan/foto, jadi tulisannya tidak bisa dibaca. Silakan ketik materinya di formulir.");
  return paragrafKeMateri(barisKeParagraf(lines), judulDariFile(file.name));
}

const tagNS = (el, name) => [...el.getElementsByTagNameNS("*", name)];
const teksParagraf = (p) => tagNS(p, "t").map((t) => t.textContent).join("").trim();

async function bacaPptx(file) {
  await loadScript(LIB_ZIP);
  const zip = await window.JSZip.loadAsync(await file.arrayBuffer());
  const nomor = (f) => Number(f.match(/slide(\d+)\.xml$/)[1]);
  const files = Object.keys(zip.files).filter((f) => /^ppt\/slides\/slide\d+\.xml$/.test(f)).sort((x, y) => nomor(x) - nomor(y));
  if (!files.length) throw new Error("Isi PowerPoint tidak ditemukan.");
  const slides = [];
  for (const f of files) {
    const doc = new DOMParser().parseFromString(await zip.file(f).async("string"), "application/xml");
    let judul = "", sub = "", isi = [];
    tagNS(doc, "sp").forEach((sp) => {
      const ph = tagNS(sp, "ph")[0];
      const type = ph ? ph.getAttribute("type") || "body" : "";
      if (/^(sldNum|dt|ftr|hdr)$/.test(type)) return;
      const paras = tagNS(sp, "p").map(teksParagraf).filter(Boolean);
      if (!paras.length) return;
      if (type === "title" || type === "ctrTitle") judul = bersih(paras.join(" "));
      else if (type === "subTitle") sub = bersih(paras.join(" "));
      else isi.push(...paras.map(bersih));
    });
    tagNS(doc, "tbl").forEach((tbl) => tagNS(tbl, "tr").forEach((tr) => {
      const sel = tagNS(tr, "tc").map((tc) => tagNS(tc, "p").map(teksParagraf).join(" ").trim()).filter(Boolean);
      if (sel.length) isi.push(sel.join(" – "));
    }));
    if (!judul && isi.length) judul = isi.shift();
    if (judul || sub || isi.length) slides.push({ judul, sub, isi });
  }
  const semua = slides.map((s) => [s.judul, s.sub, ...s.isi].join("\n")).join("\n");
  if (SUSUNAN_RE.test(semua)) return bacaMateri(semua);
  if (!slides.length) throw new Error("Tidak ada tulisan di slide. Kalau isinya gambar semua, silakan ketik materinya di formulir.");

  const pertama = slides[0];
  const slideJudul = pertama.sub || !pertama.isi.length;           // slide 1 = slide judul?
  const judul = (slideJudul && pertama.judul) || judulDariFile(file.name);
  const ringkasan = slideJudul ? pertama.sub : "";
  const poin = [], istilah = [];
  (slideJudul ? slides.slice(1) : slides).forEach((s) => {
    const isi = s.isi.join("; ");
    const p = s.judul && isi ? `${s.judul}: ${isi}` : s.judul || isi;
    if (p) poin.push(...potongParagraf(p, 800));
    s.isi.forEach((baris) => {
      const m = baris.match(/^([^:–]{2,50}?)\s*[:–]\s+(.{3,300})$/);
      if (m && m[1].trim().split(/\s+/).length <= 6) istilah.push({ kata: m[1].trim(), arti: m[2].trim() });
    });
  });
  return { mataKuliah: judul, modul: [{ judul, ringkasan, poin, istilah }] };
}

async function bacaDocx(file) {
  await loadScript(LIB_ZIP);
  const zip = await window.JSZip.loadAsync(await file.arrayBuffer());
  const xml = zip.file("word/document.xml");
  if (!xml) throw new Error("Isi dokumen Word tidak ditemukan.");
  const doc = new DOMParser().parseFromString(await xml.async("string"), "application/xml");
  const lines = tagNS(doc, "p").map(teksParagraf).flatMap((t) => [t, ""]);
  const teks = lines.join("\n");
  if (SUSUNAN_RE.test(teks)) return bacaMateri(teks);
  return paragrafKeMateri(barisKeParagraf(lines), judulDariFile(file.name));
}

async function readFile(file) {
  if (!file) return;
  const name = file.name.toLowerCase();
  if (/\.(ppt|doc)$/.test(name)) { showMsg("importMsg", "📄 File PowerPoint/Word versi lama belum bisa dibaca. Buka file-nya, pilih Save As (Simpan Sebagai), lalu simpan sebagai .pptx atau .docx."); return; }
  if (/\.(jpe?g|png|heic|webp|gif)$/.test(name)) { showMsg("importMsg", "🖼️ Foto tidak bisa dibaca langsung. Silakan ketik materinya di formulir."); return; }
  const besar = /\.(pdf|pptx|docx)$/.test(name);
  if (file.size > (besar ? 40 : 5) * 1024 * 1024) { showMsg("importMsg", `😕 File terlalu besar (maks ${besar ? 40 : 5} MB).`); return; }
  showMsg("importMsg", "⏳ Membaca file, tunggu sebentar...", "ok");
  try {
    let raw;
    if (name.endsWith(".pdf")) raw = await bacaPdf(file);
    else if (name.endsWith(".pptx")) raw = await bacaPptx(file);
    else if (name.endsWith(".docx")) raw = await bacaDocx(file);
    else raw = bacaMateri(await file.text());
    const data = normalize(raw);
    showMsg("importMsg", "");
    closeModal("importModal");
    chooseDestination(data);
  } catch (err) {
    showMsg("importMsg", "😕 " + (err && err.message ? err.message : "File tidak bisa dibaca."));
  } finally {
    $("fileInput").value = "";
  }
}

const dz = $("dropzone");
["dragenter", "dragover"].forEach((ev) => dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.add("over"); }));
["dragleave", "drop"].forEach((ev) => dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.remove("over"); }));
dz.addEventListener("drop", (e) => readFile(e.dataTransfer.files[0]));
$("fileInput").addEventListener("change", (e) => readFile(e.target.files[0]));
$("saveImport").addEventListener("click", () => {
  if (importMode === "form") {
    try {
      const data = normalize(collectForm());
      closeModal("importModal");
      chooseDestination(data, true);
    } catch (err) {
      showMsg("importMsg", "😕 " + err.message);
      $("importMsg").scrollIntoView({ block: "nearest" });
    }
    return;
  }
  const text = $("pasteInput").value.trim();
  if (!text || !String(text).split("\n").some((l) => l.trim() && !/^(mata\s*kuliah|modul\s+\d+)\s*:/i.test(l.trim()))) {
    showMsg("importMsg", "Materinya belum ada. Tempel materi kalian di bawah baris MODUL ya."); return;
  }
  tryImport(text);
});
window.addEventListener("dragover", (e) => e.preventDefault());
window.addEventListener("drop", (e) => e.preventDefault());

$("tryExample").addEventListener("click", () => {
  saveNew(normalize(CONTOH));
  toast("Ini contohnya. Tekan \"Tambah materi\" untuk memasukkan materi kalian sendiri.");
});

/* ============================================================
   PILIH / SIMPAN KE FILE / HAPUS MATA KULIAH
   ============================================================ */
$("subjectSelect").addEventListener("change", (e) => { library.active = e.target.value; saveLibrary(); renderAll(); });

$("downloadBtn").addEventListener("click", () => {
  const d = current(); if (!d) return;
  const blob = new Blob([toText(d)], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `materi-${courseKey(d)}.txt`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  toast("💾 File materi tersimpan. Bisa dikirim ke teman lewat WhatsApp.");
});

$("deleteBtn").addEventListener("click", () => {
  const d = current(); if (!d) return;
  if (!confirm(`Hapus materi "${d.mataKuliah}"? Materi yang dihapus tidak bisa dikembalikan.`)) return;
  try { localStorage.removeItem(progressKey()); } catch (e) {}
  delete library.subjects[library.active];
  library.active = Object.keys(library.subjects)[0] || null;
  saveLibrary();
  tampilkanBeranda();
});

/* ============================================================
   TABS
   ============================================================ */
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".panel").forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    $(btn.dataset.tab).classList.add("active");
  });
});

/* ============================================================
   COUNTDOWN
   ============================================================ */
function tickCountdown() {
  const box = $("countdown"); const d = tampilan === "materi" ? current() : null;
  if (!d || !d.tanggalUjian) { box.innerHTML = ""; return; }
  const diff = new Date(d.tanggalUjian) - new Date();
  if (isNaN(diff)) { box.innerHTML = ""; return; }
  if (diff <= 0) { box.innerHTML = "<div><strong>🎓</strong><span>Hari ujian! Semangat!</span></div>"; return; }
  const dd = Math.floor(diff / 864e5), h = Math.floor(diff / 36e5) % 24, m = Math.floor(diff / 6e4) % 60;
  box.innerHTML = `<div><strong>${dd}</strong><span>hari</span></div><div><strong>${h}</strong><span>jam</span></div><div><strong>${m}</strong><span>menit</span></div><div style="display:flex;align-items:center"><span>menuju ujian</span></div>`;
}
setInterval(tickCountdown, 30000);

/* ============================================================
   RINGKASAN
   ============================================================ */
function highlight(text, q) {
  const safe = esc(text);
  if (!q) return safe;
  const re = new RegExp("(" + esc(q).replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi");
  return safe.replace(re, "<mark>$1</mark>");
}
/* ---------- Format tulisan: ## Judul, ### Sub-judul, **tebal**, *miring* ---------- */
function fmtInline(html) {
  return html
    .replace(/\*\*(?=\S)([\s\S]*?\S)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*\w])\*(?=[^\s*])([^*\n]*?[^\s*])\*(?![\w*])/g, "$1<em>$2</em>")
    .replace(/(^|[^*\w])\*(?=[^\s*])([^*\n])\*(?![\w*])/g, "$1<em>$2</em>");
}
function richInline(text, q = "") { return fmtInline(highlight(String(text ?? ""), q)).replace(/\n/g, "<br>"); }
function richBlock(text, q = "") {
  const out = []; let para = [], daftar = [];
  const flushPara = () => { if (para.length) { out.push(`<p>${para.map((l) => richInline(l, q)).join("<br>")}</p>`); para = []; } };
  const tutupDaftar = () => { if (daftar.length) { out.push(`<ul>${daftar.map((l) => `<li>${richInline(l, q)}</li>`).join("")}</ul>`); daftar = []; } };
  const flush = () => { flushPara(); tutupDaftar(); };
  String(text ?? "").split("\n").forEach((raw) => {
    const t = raw.trim(); let m;
    if (!t || /^#{1,3}$/.test(t)) { flush(); return; }
    if ((m = t.match(/^###\s+(.+)/))) { flush(); out.push(`<h6 class="rsub">${richInline(m[1], q)}</h6>`); return; }
    if ((m = t.match(/^#{1,2}\s+(.+)/))) { flush(); out.push(`<h5 class="rhead">${richInline(m[1], q)}</h5>`); return; }
    if ((m = t.match(/^([-•–]|\*(?=\s))\s+(.+)/))) { flushPara(); daftar.push(m[2]); return; }
    tutupDaftar();
    para.push(t);
  });
  flush();
  return out.join("");
}
function richPoin(list, q = "") {
  let html = "", open = false;
  list.forEach((p) => {
    if (/^#{1,3}\s*$/.test(String(p).trim())) return;
    const m = String(p).match(/^(#{1,3})\s+(.+)/);
    if (m) {
      if (open) { html += "</ul>"; open = false; }
      html += m[1].length === 3 ? `<h6 class="rsub">${richInline(m[2], q)}</h6>` : `<h5 class="rhead">${richInline(m[2], q)}</h5>`;
    } else {
      if (!open) { html += "<ul>"; open = true; }
      html += `<li>${richInline(p, q)}</li>`;
    }
  });
  if (open) html += "</ul>";
  return html;
}

function renderRingkasan(q = "") {
  const query = q.trim().toLowerCase();
  const html = current().modul.map((m) => {
    const all = [m.judul, ...(m.subjudul || []), m.ringkasan, ...m.poin, ...m.istilah.flatMap((t) => [t.kata, t.arti])].join(" ").toLowerCase();
    if (query && !all.includes(query)) return "";
    return `
      <details class="card modul" ${query ? "open" : ""}>
        <summary><div><span class="num">MODUL ${m.nomor}</span><h3>${highlight(m.judul, query)}</h3>${(m.subjudul || []).map((sj) => `<span class="subjudul">${highlight(sj, query)}</span>`).join("")}</div></summary>
        <div class="modul-body">
          ${m.ringkasan ? `<div class="rich">${richBlock(m.ringkasan, query)}</div>` : ""}
          ${m.poin.length ? `<h4>📌 Poin penting</h4><div class="rich">${richPoin(m.poin, query)}</div>` : ""}
          ${m.istilah.length ? `<h4>🔑 Istilah</h4><div class="istilah-grid">${m.istilah.map((t) => `<div class="istilah-item"><b>${richInline(t.kata, query)}</b> — ${richInline(t.arti, query)}</div>`).join("")}</div>` : ""}
        </div>
      </details>`;
  }).join("");
  $("modulList").innerHTML = html || `<div class="card">Tidak ada materi yang cocok dengan "<b>${esc(q)}</b>".</div>`;
}
$("searchInput").addEventListener("input", (e) => renderRingkasan(e.target.value));

const inFilter = (f, nomor) => f === "all" || String(nomor) === String(f);

/* ============================================================
   SOAL & KARTU HAFALAN OTOMATIS (tanpa AI, pakai aturan)
   - Pengertian: kalimat "X adalah/merupakan/yaitu Y" dan baris "X: Y"
   - Soal pengertian: "Apa yang dimaksud dengan X?" (pilihan = pengertian lain)
   - Soal lengkapi kalimat: satu kata penting dikosongkan
   - Esai: dari istilah dan judul bagian
   ============================================================ */
const STOP = new Set(("yang dan di ke dari untuk dengan pada adalah merupakan dalam atau ini itu oleh sebagai juga karena akan dapat " +
  "tidak ada lebih para serta secara bahwa setiap telah sudah harus bisa mereka kita kami yaitu ialah antara tersebut hal " +
  "sangat maka agar saat suatu sebuah seperti namun tetapi jika bila hanya masih sendiri tentang terhadap melalui bagi kepada " +
  "sehingga menjadi memiliki banyak beberapa semua dimana bagaimana mengapa kapan siapa begitu pula hingga sampai setelah " +
  "sebelum sedang selalu sering kali pertama kedua ketiga lain lainnya berbagai biasanya disebut dilakukan melakukan " +
  "the and of to in is are for with that this from which their there these those about").split(" "));
const polos = (t) => String(t ?? "").replace(/^\s*#{1,3}\s*/, "").replace(/\*\*|__/g, "").replace(/(^|[^*])\*([^*\n]+)\*/g, "$1$2").replace(/\s+/g, " ").trim();
const huruf1 = (t) => (t ? t[0].toUpperCase() + t.slice(1) : t);
const singkat = (t, n = 190) => (t.length > n ? t.slice(0, n).replace(/\s+\S*$/, "") + "…" : t);
function acakBenih(teks) {          // angka acak yang selalu sama untuk teks yang sama
  let h = 1779033703 ^ teks.length;
  for (let i = 0; i < teks.length; i++) { h = Math.imul(h ^ teks.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
  return () => { h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; };
}
const acakDengan = (arr, r) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

function kalimatModul(m) {
  const sumber = [...String(m.ringkasan || "").split("\n"), ...m.poin].filter((t) => !/^\s*#/.test(t)).map(polos).filter(Boolean);
  return sumber.flatMap((t) => t.split(/(?<=[.!?])\s+(?=[A-Z0-9"“(])/)).map((k) => k.trim()).filter((k) => k.length >= 35 && k.length <= 260 && k.split(/\s+/).length >= 7 && !/:$/.test(k));
}
const otoCache = new Map();
function istilahOtomatis(m) {
  const key = "i|" + m.judul + "|" + m.ringkasan + "|" + m.poin.join("|");
  if (otoCache.has(key)) return otoCache.get(key);
  const out = [], seen = new Set(m.istilah.map((t) => polos(t.kata).toLowerCase()));
  const add = (k, a) => {
    k = polos(k).replace(/^(yang dimaksud dengan|pengertian( dari)?|definisi( dari)?|arti( dari)?)\s+/i, "").replace(/[:,;.]+$/, "").trim();
    a = polos(a).replace(/^[:\-–\s]+/, "").trim();
    const low = k.toLowerCase();
    if (k.length < 3 || k.split(/\s+/).length > 6 || a.length < 12 || seen.has(low) || /^(ini|itu|hal|dia|mereka|hal ini|tujuannya)$/i.test(k)) return;
    seen.add(low);
    out.push({ kata: huruf1(k), arti: huruf1(a), otomatis: true });
  };
  kalimatModul(m).forEach((k) => {
    const x = k.match(/^(.{3,70}?)\s+(?:adalah|merupakan|ialah|yaitu|didefinisikan sebagai|diartikan sebagai)\s+(.{12,})$/i);
    if (x && !/[,;]/.test(x[1])) add(x[1], x[2]);
  });
  [...String(m.ringkasan || "").split("\n"), ...m.poin].forEach((p) => {
    if (/^\s*#/.test(p)) return;
    const x = polos(p).replace(/^([-•–]|\d+[.)])\s+/, "").match(/^([^:]{3,50}):\s+(.{12,300})$/);
    if (x) add(x[1], x[2]);
  });
  const hasil = out.slice(0, 15);
  otoCache.set(key, hasil);
  return hasil;
}
const semuaIstilah = (m) => [...m.istilah, ...istilahOtomatis(m)];

function konteksKuis(d) {
  const istilah = d.modul.flatMap(semuaIstilah).map((t) => ({ kata: polos(t.kata), arti: polos(t.arti) }));
  const kata = new Map();
  const istilahKata = new Set(istilah.map((t) => t.kata.toLowerCase()));
  d.modul.forEach((m) => kalimatModul(m).forEach((k) => (k.match(/[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ0-9-]*|\d[\d.,%]*/g) || []).forEach((w, i) => {
    const low = w.toLowerCase();
    if (i === 0 && !istilahKata.has(low)) return;          // kata awal kalimat (Berikut, Keputusan...) bukan pilihan yang baik
    if (!STOP.has(low) && (w.length >= 5 || /\d/.test(w))) kata.set(low, w);
  })));
  return { istilah, kata: [...kata.values()], istilahKata };
}

function kataKunci(k, penting) {
  const words = k.match(/[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ0-9-]*|\d[\d.,%]*/g) || [];
  let best = null, skor = -1;
  words.forEach((w, i) => {
    const low = w.toLowerCase();
    if (STOP.has(low) || (w.length < 5 && !/\d/.test(w))) return;
    let sc = Math.min(w.length, 12);
    if (penting.has(low)) sc += 8;
    if (i > 0 && /^[A-Z]/.test(w)) sc += 4;
    if (/\d/.test(w)) sc += 3;
    if (i === 0) sc -= 3;
    if (sc > skor) { skor = sc; best = w; }
  });
  return best;
}
const reKata = (w) => new RegExp(`(^|[^A-Za-zÀ-ÿ0-9])${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![A-Za-zÀ-ÿ0-9])`);

function soalOtomatis(m, ctx) {
  const key = "s|" + m.nomor + "|" + m.judul + "|" + m.ringkasan + "|" + m.poin.join("|") + "|" + ctx.istilah.length + "|" + ctx.kata.length;
  if (otoCache.has(key)) return otoCache.get(key);
  const r = acakBenih(key);
  const hasil = [], sudah = new Set(m.soal.map((s) => polos(s.tanya).toLowerCase()));
  const pilihanJadi = (benar, salah) => {
    const opsi = acakDengan([benar, ...salah.slice(0, 3)], r);
    return { pilihan: opsi, jawaban: opsi.indexOf(benar) };
  };
  // 1) soal pengertian
  const milik = semuaIstilah(m).map((t) => ({ kata: polos(t.kata), arti: polos(t.arti) }));
  milik.slice(0, 5).forEach((t, i) => {
    const lainArti = acakDengan(ctx.istilah.filter((x) => x.kata.toLowerCase() !== t.kata.toLowerCase() && x.arti !== t.arti).map((x) => singkat(x.arti)), r);
    const lainKata = acakDengan(ctx.istilah.filter((x) => x.kata.toLowerCase() !== t.kata.toLowerCase()).map((x) => x.kata), r);
    if (i % 2 === 0 && lainArti.length >= 3) {
      const tanya = `Apa yang dimaksud dengan **${t.kata}**?`;
      if (!sudah.has(polos(tanya).toLowerCase())) hasil.push({ tanya, ...pilihanJadi(singkat(t.arti), [...new Set(lainArti)]), pembahasan: `${t.kata} adalah ${t.arti.replace(/^[A-Z]/, (c) => c.toLowerCase())}` });
    } else if (lainKata.length >= 3) {
      hasil.push({ tanya: `Istilah yang tepat untuk pengertian berikut adalah...\n"${singkat(t.arti, 220)}"`, ...pilihanJadi(t.kata, [...new Set(lainKata)]), pembahasan: `Pengertian tersebut adalah pengertian dari **${t.kata}**.` });
    }
  });
  // 2) soal lengkapi kalimat
  const penting = new Set(milik.flatMap((t) => t.kata.toLowerCase().split(/\s+/)));
  const pakai = new Set();
  acakDengan(kalimatModul(m), r).forEach((k) => {
    if (hasil.length >= 8) return;
    const w = kataKunci(k, penting);
    if (!w || pakai.has(w.toLowerCase())) return;
    const angka = /\d/.test(w), besar = /^[A-Z]/.test(w);
    const isiKalimat = new Set((k.match(/[A-Za-zÀ-ÿ0-9][A-Za-zÀ-ÿ0-9-]*/g) || []).map((x) => x.toLowerCase()));
    const kelas = (x) => (/^(me|ber|di|ter|ke)[a-z]{3,}/i.test(x) && !ctx.istilahKata.has(x.toLowerCase()) ? "kerja" : "benda");
    const cocok = (x) => x.toLowerCase() !== w.toLowerCase() && !isiKalimat.has(x.toLowerCase()) && /\d/.test(x) === angka && (angka || /^[A-Z]/.test(x) === besar);
    let calon = ctx.istilahKata.has(w.toLowerCase())
      ? ctx.istilah.map((t) => (besar ? t.kata : t.kata.toLowerCase())).filter((x) => !/\s/.test(x) && x.toLowerCase() !== w.toLowerCase() && !isiKalimat.has(x.toLowerCase()))
      : [];
    if (calon.length < 3) {
      const semua = ctx.kata.filter(cocok);
      const sejenis = semua.filter((x) => kelas(x) === kelas(w));
      calon = [...new Set([...calon, ...(sejenis.length >= 3 ? sejenis : semua)])];
    }
    const salah = acakDengan(calon, r).sort((a, b) => Math.abs(a.length - w.length) - Math.abs(b.length - w.length)).slice(0, 6);
    const tiga = acakDengan(salah, r).slice(0, 3);
    if (tiga.length < 3) return;
    pakai.add(w.toLowerCase());
    const kosong = k.replace(reKata(w), "$1_______");
    const lengkap = k.replace(reKata(w), "$1**" + w + "**");
    hasil.push({ tanya: `Lengkapi kalimat berikut:\n"${kosong}"`, ...pilihanJadi(w, tiga), pembahasan: `Kalimat lengkapnya: "${lengkap}"` });
  });
  otoCache.set(key, hasil);
  return hasil;
}

function esaiOtomatis(m) {
  const out = [];
  semuaIstilah(m).slice(0, 2).forEach((t) => out.push({ tanya: `Jelaskan apa yang dimaksud dengan **${polos(t.kata)}**!`, jawaban: polos(t.arti) }));
  // dari judul bagian (##) di poin penting
  let judul = null, isi = [];
  const tutup = () => { if (judul && isi.length && out.length < 4) out.push({ tanya: `Jelaskan tentang **${judul}**!`, jawaban: singkat(isi.join(" "), 900) }); judul = null; isi = []; };
  [...String(m.ringkasan || "").split("\n"), ...m.poin].forEach((p) => { if (!p.trim()) return; if (/^\s*#{1,3}\s/.test(p)) { tutup(); judul = polos(p); } else if (judul) isi.push(polos(p)); });
  tutup();
  if (!out.length && (m.ringkasan || m.poin.length)) {
    out.push({ tanya: `Jelaskan isi materi **${m.judul}** dengan kata-kata kalian sendiri!`, jawaban: singkat(polos(m.ringkasan || m.poin.join(" ")), 900) });
  }
  const sudah = new Set(m.esai.map((s) => polos(s.tanya).toLowerCase()));
  return out.filter((s) => !sudah.has(polos(s.tanya).toLowerCase())).slice(0, 3);
}

/* ============================================================
   KARTU HAFALAN
   ============================================================ */
let cards = [], fcIndex = 0;
function buildCards() {
  const f = $("fcFilter").value;
  cards = current().modul.flatMap((m) => (inFilter(f, m.nomor) ? semuaIstilah(m) : []));
  fcIndex = 0; showCard();
}
function showCard() {
  $("fcCard").classList.remove("flipped");
  if (!cards.length) {
    $("fcFront").textContent = "Belum ada istilah";
    $("fcBack").textContent = "Modul ini belum punya daftar istilah.";
    $("fcCount").textContent = "0 / 0"; return;
  }
  setTimeout(() => { $("fcFront").innerHTML = richInline(cards[fcIndex].kata); $("fcBack").innerHTML = richInline(cards[fcIndex].arti); }, 150);
  $("fcCount").textContent = `${fcIndex + 1} / ${cards.length}`;
}
$("fcCard").addEventListener("click", () => $("fcCard").classList.toggle("flipped"));
$("fcNext").addEventListener("click", () => { if (cards.length) { fcIndex = (fcIndex + 1) % cards.length; showCard(); } });
$("fcPrev").addEventListener("click", () => { if (cards.length) { fcIndex = (fcIndex - 1 + cards.length) % cards.length; showCard(); } });
$("fcShuffle").addEventListener("click", () => { cards = shuffle(cards); fcIndex = 0; showCard(); });
$("fcFilter").addEventListener("change", buildCards);

/* ============================================================
   SOAL DARI TEMAN (disimpan terpisah, soal asli tidak berubah)
   ============================================================ */
const temanKey = (key) => "demuse-belajar-teman-" + key;
function cleanTeman(list) {
  return (Array.isArray(list) ? list : []).map((s) => {
    const tipe = s.tipe === "esai" ? "esai" : "pg";
    const pilihan = Array.isArray(s.pilihan) ? s.pilihan.map((p) => String(p ?? "").trim()).filter(Boolean) : [];
    const jawaban = tipe === "pg" ? Number(s.jawaban) : String(s.jawaban ?? "");
    return { id: String(s.id ?? ""), tipe, nomorModul: Number(s.nomorModul) || 0, tanya: String(s.tanya ?? "").trim(), pilihan, jawaban, pembahasan: String(s.pembahasan ?? ""), nama: String(s.nama ?? "Teman").trim() || "Teman" };
  }).filter((s) => s.id && s.tanya && (s.tipe === "esai" || (s.pilihan.length >= 2 && s.jawaban >= 0 && s.jawaban < s.pilihan.length)));
}
function temanSoal() {
  const d = current(); if (!d || !hasApi()) return [];
  const dilaporkan = new Set(readStore(LAPOR_KEY, []));
  return cleanTeman(readStore(temanKey(courseKey(d)), [])).filter((s) => !dilaporkan.has(s.id));
}
async function loadTemanSoal() {
  const d = current(); if (!d || !hasApi()) return;
  const key = courseKey(d);
  try {
    const res = await apiGet({ aksi: "soal", kunci: key });
    const fresh = cleanTeman(res.data);
    const old = readStore(temanKey(key), []);
    writeStore(temanKey(key), fresh);
    if (current() && courseKey(current()) === key && JSON.stringify(fresh) !== JSON.stringify(old)) { buildQuiz(); renderEsai(); }
  } catch (e) { /* tetap pakai soal teman yang tersimpan */ }
}

async function laporkan(tipe, id) {
  if (!confirm("Laporkan karena isinya salah atau tidak pantas? Admin akan mengeceknya.")) return false;
  const list = readStore(LAPOR_KEY, []);
  if (!list.includes(id)) { list.push(id); writeStore(LAPOR_KEY, list); }
  try { await apiPost({ aksi: "lapor", tipe, id }); } catch (e) {}
  toast("Terima kasih, laporan terkirim. 🙏");
  return true;
}

/* ============================================================
   LATIHAN SOAL PILIHAN GANDA
   ============================================================ */
let quiz = [], answered = 0, correct = 0;
function buildQuiz(random = false) {
  const f = $("quizFilter").value;
  const src = $("quizSource").value || "all";
  const d = current();
  const ai = src === "all" || src === "ai" ? d.modul.flatMap((m) => (inFilter(f, m.nomor) ? m.soal.map((s) => ({ ...s, modul: m.nomor })) : [])) : [];
  const ctx = src === "all" || src === "auto" ? konteksKuis(d) : null;
  const auto = ctx ? d.modul.flatMap((m) => (inFilter(f, m.nomor) ? soalOtomatis(m, ctx).map((s) => ({ ...s, modul: m.nomor, auto: true })) : [])) : [];
  const teman = !(src === "all" || src === "teman") ? [] : temanSoal().filter((s) => s.tipe === "pg" && inFilter(f, s.nomorModul))
    .map((s) => ({ tanya: s.tanya, pilihan: s.pilihan, jawaban: s.jawaban, pembahasan: s.pembahasan, modul: s.nomorModul, dari: s.nama, id: s.id }));
  quiz = [...ai, ...auto, ...teman];
  if (random) quiz = shuffle(quiz);
  answered = 0; correct = 0; renderQuiz();
}
function renderQuiz() {
  if (!quiz.length) {
    const src = $("quizSource").value;
    $("quizList").innerHTML = `<div class="card empty">${src === "teman" ? "Belum ada soal dari teman untuk pilihan ini. Yuk jadi yang pertama membuat soal! ✍️" :
      src === "auto" ? "Materinya masih terlalu sedikit untuk dibuatkan soal otomatis. Tambahkan ringkasan atau poin penting yang lebih lengkap." : "Belum ada soal pilihan ganda."}</div>`;
    updateScore(); return;
  }
  $("quizList").innerHTML = quiz.map((q, qi) => `
    <div class="card q-card" data-q="${qi}">
      <div class="q-meta">SOAL ${qi + 1} · MODUL ${esc(q.modul)}${q.dari ? `<span class="by">✍️ dari ${esc(q.dari)}</span>` : ""}${q.auto ? `<span class="by auto">⚙️ otomatis</span>` : ""}</div>
      <p class="q-text">${richInline(q.tanya)}</p>
      ${q.pilihan.map((p, pi) => `<button class="opt" data-p="${pi}">${String.fromCharCode(65 + pi)}. ${richInline(p)}</button>`).join("")}
      <div class="explain">${q.pembahasan ? "💬 " + richInline(q.pembahasan) : "✅ Jawaban benar sudah ditandai hijau."}</div>
      ${q.id ? `<button class="link-btn" data-lapor="${esc(q.id)}">⚠️ Laporkan soal salah</button>` : ""}
    </div>`).join("");
  updateScore();
}
$("quizList").addEventListener("click", async (e) => {
  const lapor = e.target.closest("[data-lapor]");
  if (lapor) { if (await laporkan("soal", lapor.dataset.lapor)) { buildQuiz(); renderEsai(); } return; }
  const opt = e.target.closest(".opt");
  if (!opt || opt.disabled) return;
  const card = opt.closest(".q-card");
  const q = quiz[card.dataset.q];
  const pick = Number(opt.dataset.p);
  card.querySelectorAll(".opt").forEach((b, i) => { b.disabled = true; if (i === q.jawaban) b.classList.add("correct"); });
  if (pick !== q.jawaban) opt.classList.add("wrong"); else correct++;
  answered++;
  card.querySelector(".explain").classList.add("show");
  updateScore();
});
function updateScore() {
  const pct = answered ? Math.round((correct / answered) * 100) : 0;
  $("scoreText").textContent = `Skor: ${correct} / ${answered} dijawab (${pct}%) · total ${quiz.length} soal`;
}
$("quizFilter").addEventListener("change", () => buildQuiz());
$("quizSource").addEventListener("change", () => buildQuiz());
$("quizShuffle").addEventListener("click", () => buildQuiz(true));
$("quizReset").addEventListener("click", () => buildQuiz());

/* ============================================================
   LATIHAN ESAI
   ============================================================ */
function renderEsai() {
  const ai = current().modul.flatMap((m) => m.esai.map((s) => ({ ...s, modul: m.nomor })));
  const auto = current().modul.flatMap((m) => esaiOtomatis(m).map((s) => ({ ...s, modul: m.nomor, auto: true })));
  const teman = temanSoal().filter((s) => s.tipe === "esai").map((s) => ({ tanya: s.tanya, jawaban: s.jawaban, modul: s.nomorModul, dari: s.nama, id: s.id }));
  const items = [...ai, ...auto, ...teman].sort((a, b) => a.modul - b.modul);
  if (!items.length) { $("esaiList").innerHTML = `<div class="card empty">Belum ada soal esai.</div>`; return; }
  $("esaiList").innerHTML = items.map((s, i) => `
    <div class="card q-card">
      <div class="q-meta">ESAI ${i + 1} · MODUL ${esc(s.modul)}${s.dari ? `<span class="by">✍️ dari ${esc(s.dari)}</span>` : ""}${s.auto ? `<span class="by auto">⚙️ otomatis</span>` : ""}</div>
      <p class="q-text">${richInline(s.tanya)}</p>
      <textarea placeholder="Tulis jawaban kalian di sini..."></textarea>
      <button class="btn primary" data-esai="${i}">Lihat contoh jawaban</button>
      <div class="esai-answer rich" id="esai-${i}">✅ ${richBlock(s.jawaban || "Belum ada contoh jawaban.")}</div>
      ${s.id ? `<div><button class="link-btn" data-lapor="${esc(s.id)}">⚠️ Laporkan soal salah</button></div>` : ""}
    </div>`).join("");
}
$("esaiList").addEventListener("click", async (e) => {
  const lapor = e.target.closest("[data-lapor]");
  if (lapor) { if (await laporkan("soal", lapor.dataset.lapor)) { buildQuiz(); renderEsai(); } return; }
  const btn = e.target.closest("[data-esai]");
  if (!btn) return;
  const box = $("esai-" + btn.dataset.esai);
  box.classList.toggle("show");
  btn.textContent = box.classList.contains("show") ? "Sembunyikan jawaban" : "Lihat contoh jawaban";
});

/* ============================================================
   FORMULIR: BUAT SOAL UNTUK TEMAN
   ============================================================ */
function setSoalTipe(tipe) {
  document.querySelectorAll('input[name="soalTipe"]').forEach((r) => (r.checked = r.value === tipe));
  $("pgFields").classList.toggle("hidden", tipe !== "pg");
  $("esaiFields").classList.toggle("hidden", tipe !== "esai");
}
function openSoalForm(tipe) {
  const d = current(); if (!d || !hasApi()) return;
  $("soalModul").innerHTML = d.modul.map((m) => `<option value="${m.nomor}">Modul ${m.nomor}: ${esc(m.judul)}</option>`).join("");
  const f = $("quizFilter").value;
  if (f !== "all") $("soalModul").value = f;
  $("pgOptions").innerHTML = [0, 1, 2, 3].map((i) => `
    <label class="opt-row"><input type="radio" name="soalBenar" value="${i}" aria-label="Jawaban ${String.fromCharCode(65 + i)} benar">
      <input type="text" class="pg-opt" maxlength="300" placeholder="Pilihan ${String.fromCharCode(65 + i)}"></label>`).join("");
  ["soalTanya", "soalJawabEsai", "soalBahas"].forEach((id) => ($(id).value = ""));
  $("soalNama").value = readStore(NAMA_KEY, "");
  showMsg("soalMsg", "");
  setSoalTipe(tipe === "esai" ? "esai" : "pg");
  const draf = readStore(DRAF_SOAL, null);
  const berisi = draf && adaIsi(draf.tanya, draf.jawab, draf.bahas, ...(draf.opts || []));
  if (berisi && draf.kunci === courseKey(d)) {
    setSoalTipe(draf.tipe === "esai" ? "esai" : "pg");
    if ([...$("soalModul").options].some((o) => o.value === String(draf.modul))) $("soalModul").value = draf.modul;
    $("soalTanya").value = draf.tanya || ""; $("soalJawabEsai").value = draf.jawab || ""; $("soalBahas").value = draf.bahas || "";
    document.querySelectorAll(".pg-opt").forEach((inp, i) => (inp.value = (draf.opts || [])[i] || ""));
    if (draf.benar != null) { const rb = document.querySelector(`input[name="soalBenar"][value="${Number(draf.benar)}"]`); if (rb) rb.checked = true; }
    $("soalDraftNote").classList.remove("hidden");
  } else {
    $("soalDraftNote").classList.add("hidden");
  }
  openModal("soalModal");
}
document.querySelectorAll("[data-open-soal]").forEach((b) => b.addEventListener("click", () => openSoalForm(b.dataset.openSoal)));
let drafSoalTimer = null;
function simpanDrafSoal() {
  const d = current(); if (!d || $("soalModal").classList.contains("hidden")) return;
  clearTimeout(drafSoalTimer);
  drafSoalTimer = setTimeout(() => {
    const draf = {
      kunci: courseKey(d),
      tipe: (document.querySelector('input[name="soalTipe"]:checked') || {}).value || "pg",
      modul: $("soalModul").value,
      tanya: $("soalTanya").value, jawab: $("soalJawabEsai").value, bahas: $("soalBahas").value,
      opts: [...document.querySelectorAll(".pg-opt")].map((x) => x.value),
      benar: (document.querySelector('input[name="soalBenar"]:checked') || {}).value ?? null
    };
    const berisi = adaIsi(draf.tanya, draf.jawab, draf.bahas, ...draf.opts);
    writeStore(DRAF_SOAL, berisi ? draf : null);
    if (berisi) tandaiTersimpan("autosaveSoal");
  }, 400);
}
$("soalModal").addEventListener("input", (e) => { if (e.target.id === "soalNama") writeStore(NAMA_KEY, e.target.value.trim()); else simpanDrafSoal(); });
$("soalModal").addEventListener("change", (e) => { if (e.target.id !== "soalNama") simpanDrafSoal(); });
$("shareNama").addEventListener("input", (e) => writeStore(NAMA_KEY, e.target.value.trim()));
$("soalDraftClear").addEventListener("click", () => {
  if (!confirm("Hapus isian soal ini dan mulai dari kosong?")) return;
  clearTimeout(drafSoalTimer); writeStore(DRAF_SOAL, null);
  ["soalTanya", "soalJawabEsai", "soalBahas"].forEach((id) => ($(id).value = ""));
  document.querySelectorAll(".pg-opt").forEach((x) => (x.value = ""));
  document.querySelectorAll('input[name="soalBenar"]').forEach((x) => (x.checked = false));
  $("soalDraftNote").classList.add("hidden");
});
document.querySelectorAll('input[name="soalTipe"]').forEach((r) => r.addEventListener("change", () => setSoalTipe(r.value)));

$("soalSend").addEventListener("click", async () => {
  const d = current(); if (!d) return;
  const tipe = document.querySelector('input[name="soalTipe"]:checked').value;
  const tanya = $("soalTanya").value.trim();
  const nama = $("soalNama").value.trim();
  const nomor = Number($("soalModul").value);
  const modul = d.modul.find((m) => m.nomor === nomor);
  if (!tanya) return showMsg("soalMsg", "Pertanyaannya belum diisi.");

  let pilihan = [], jawaban = "";
  if (tipe === "pg") {
    const raw = [...document.querySelectorAll(".pg-opt")].map((i) => i.value.trim());
    const benar = document.querySelector('input[name="soalBenar"]:checked');
    if (raw.filter(Boolean).length < 2) return showMsg("soalMsg", "Isi minimal 2 pilihan jawaban.");
    if (!benar) return showMsg("soalMsg", "Tekan bulatan di samping jawaban yang benar.");
    if (!raw[Number(benar.value)]) return showMsg("soalMsg", "Jawaban yang dipilih sebagai benar masih kosong.");
    raw.forEach((p, i) => { if (p) { if (i === Number(benar.value)) jawaban = pilihan.length; pilihan.push(p); } });
  } else {
    jawaban = $("soalJawabEsai").value.trim();
    if (!jawaban) return showMsg("soalMsg", "Contoh jawabannya belum diisi.");
  }
  if (!nama) return showMsg("soalMsg", "Nama kalian belum diisi.");
  writeStore(NAMA_KEY, nama);

  const btn = $("soalSend");
  btn.disabled = true; btn.textContent = "Mengirim...";
  try {
    const body = { aksi: "tambahSoal", kunci: courseKey(d), mataKuliah: d.mataKuliah, nomorModul: nomor, judulModul: modul ? modul.judul : "", tipe, tanya, pilihan, jawaban, pembahasan: $("soalBahas").value.trim(), nama };
    const res = await apiPost(body);
    if (res.status === "tampil") {
      const key = courseKey(d);
      const list = readStore(temanKey(key), []);
      list.push({ id: res.id, tipe, nomorModul: nomor, tanya, pilihan, jawaban, pembahasan: body.pembahasan, nama });
      writeStore(temanKey(key), list);
      buildQuiz(); renderEsai();
      toast("🎉 Terima kasih! Soal kalian sudah bisa dipakai teman-teman.");
    } else {
      toast("🎉 Terima kasih! Soal kalian akan tampil setelah dicek admin.");
    }
    clearTimeout(drafSoalTimer); writeStore(DRAF_SOAL, null);
    closeModal("soalModal");
  } catch (err) {
    showMsg("soalMsg", "😕 " + errText(err));
  } finally {
    btn.disabled = false; btn.textContent = "📤 Kirim soal";
  }
});

/* ============================================================
   BAGIKAN MATERI KE TEMAN-TEMAN
   ============================================================ */
function jurusanOptions(selected, withAll) {
  const list = [...JURUSAN];
  if (selected && !list.includes(selected) && selected !== "Lainnya") list.push(selected);
  return (withAll ? `<option value="all">Semua jurusan</option>` : `<option value="">— Pilih jurusan —</option>`) +
    list.map((j) => `<option value="${esc(j)}" ${j === selected ? "selected" : ""}>${esc(j)}</option>`).join("") +
    (withAll ? "" : `<option value="Lainnya">Lainnya (tulis sendiri)</option>`);
}
$("shareBtn").addEventListener("click", () => {
  const d = current(); if (!d || !hasApi()) return;
  $("shareSubject").textContent = `Mata kuliah: ${d.mataKuliah}`;
  $("shareNama").value = readStore(NAMA_KEY, "");
  const savedJur = readStore(JURUSAN_KEY, "");
  $("shareJurusan").innerHTML = jurusanOptions(savedJur, false);
  $("shareJurusanLainWrap").classList.add("hidden");
  $("shareJurusanLain").value = "";
  $("shareModules").innerHTML = d.modul.map((m) => `
    <label class="choice"><input type="checkbox" value="${m.nomor}" checked>
      <span>Modul ${m.nomor}: ${esc(m.judul)}<small>${m.soal.length} soal PG · ${m.esai.length} esai · ${m.istilah.length} istilah</small></span></label>`).join("");
  showMsg("shareMsg", "");
  openModal("shareModal");
});
$("shareJurusan").addEventListener("change", (e) => $("shareJurusanLainWrap").classList.toggle("hidden", e.target.value !== "Lainnya"));

$("shareSend").addEventListener("click", async () => {
  const d = current(); if (!d) return;
  const nama = $("shareNama").value.trim();
  let jurusan = $("shareJurusan").value;
  if (jurusan === "Lainnya") jurusan = $("shareJurusanLain").value.trim();
  const picked = [...$("shareModules").querySelectorAll("input:checked")].map((i) => Number(i.value));
  if (!nama) return showMsg("shareMsg", "Nama kalian belum diisi.");
  if (!jurusan) return showMsg("shareMsg", "Jurusannya belum dipilih.");
  if (!picked.length) return showMsg("shareMsg", "Centang minimal satu modul.");

  const data = { ...d, modul: d.modul.filter((m) => picked.includes(m.nomor)) };
  if (JSON.stringify(data).length > 1900000) return showMsg("shareMsg", "Materinya sangat besar. Coba bagikan sebagian modul dulu.");
  writeStore(NAMA_KEY, nama);
  writeStore(JURUSAN_KEY, jurusan);

  const btn = $("shareSend");
  btn.disabled = true; btn.textContent = "Mengirim...";
  try {
    const res = await apiPost({ aksi: "bagikan", nama, jurusan, kunci: courseKey(d), data });
    closeModal("shareModal");
    toast(res.status === "tampil" ? "🎉 Terkirim! Materi kalian sekarang tampil di Beranda, bagian Materi dari teman-teman." : "🎉 Terkirim! Materi kalian akan tampil di Beranda setelah dicek admin.");
    muatBersama();
  } catch (err) {
    showMsg("shareMsg", "😕 " + errText(err));
  } finally {
    btn.disabled = false; btn.textContent = "📤 Bagikan";
  }
});

/* ============================================================
   MATERI BERSAMA (daftar materi dari teman)
   ============================================================ */
let libItems = [];
async function loadLibrary() {
  $("libList").innerHTML = `<div class="empty">⏳ Memuat materi...</div>`;
  try {
    const res = await apiGet({ aksi: "daftar" });
    const dilaporkan = new Set(readStore(LAPOR_KEY, []));
    libItems = (Array.isArray(res.data) ? res.data : []).filter((x) => !dilaporkan.has(String(x.id)));
    const jur = [...new Set(libItems.map((x) => x.jurusan).filter(Boolean))].sort();
    const keep = $("libJurusan").value || readStore(JURUSAN_KEY, "all");
    $("libJurusan").innerHTML = `<option value="all">Semua jurusan</option>` + jur.map((j) => `<option value="${esc(j)}">${esc(j)}</option>`).join("");
    $("libJurusan").value = jur.includes(keep) ? keep : "all";
    renderLibrary();
  } catch (err) {
    $("libList").innerHTML = `<div class="empty">😕 ${esc(errText(err))}</div>`;
  }
}
function renderLibrary() {
  const jur = $("libJurusan").value;
  const q = $("libSearch").value.trim().toLowerCase();
  const items = libItems.filter((x) => (jur === "all" || x.jurusan === jur) &&
    (!q || [x.mataKuliah, x.kode, x.daftarModul].join(" ").toLowerCase().includes(q)));
  if (!items.length) {
    $("libList").innerHTML = `<div class="empty">${libItems.length ? "Tidak ada materi yang cocok." : "Belum ada materi yang dibagikan. Jadilah yang pertama! 🌱"}</div>`;
    return;
  }
  $("libList").innerHTML = items.map((x) => `
    <div class="lib-card">
      ${x.jurusan ? `<span class="jur">${esc(x.jurusan)}</span>` : ""}
      <h3>${esc(x.mataKuliah)}${x.kode ? ` <small class="muted">(${esc(x.kode)})</small>` : ""}</h3>
      <div class="lib-meta">${Number(x.jumlahModul) || 0} modul · ${Number(x.jumlahSoal) || 0} soal · dibagikan oleh ${esc(x.nama || "Teman")}${x.waktu ? " · " + esc(fmtTanggal(x.waktu)) : ""}</div>
      ${x.daftarModul ? `<div class="lib-modules">${esc(x.daftarModul).split(" | ").join("<br>")}</div>` : ""}
      <div class="row">
        <button class="btn pink" data-ambil="${esc(x.id)}">📥 Pakai materi ini</button>
        <button class="link-btn" data-lapor-materi="${esc(x.id)}">⚠️ Laporkan</button>
      </div>
    </div>`).join("");
}
document.querySelectorAll("[data-open-library]").forEach((b) => b.addEventListener("click", () => { if (hasApi()) keBersama(); }));
$("libRefresh").addEventListener("click", loadLibrary);
$("libJurusan").addEventListener("change", renderLibrary);
$("libSearch").addEventListener("input", renderLibrary);
async function klikMateriBersama(e) {
  const lapor = e.target.closest("[data-lapor-materi]");
  if (lapor) {
    if (await laporkan("materi", lapor.dataset.laporMateri)) {
      libItems = libItems.filter((x) => String(x.id) !== lapor.dataset.laporMateri);
      renderLibrary(); renderBersama();
    }
    return;
  }
  const btn = e.target.closest("[data-ambil]");
  if (!btn || btn.disabled) return;
  const label = btn.textContent;
  btn.disabled = true; btn.textContent = "⏳ Mengambil...";
  try {
    const res = await apiGet({ aksi: "ambil", id: btn.dataset.ambil });
    const data = normalize(res.data);
    if (!$("libraryModal").classList.contains("hidden")) closeModal("libraryModal");
    chooseDestination(data);
  } catch (err) {
    toast("😕 " + errText(err));
  } finally {
    btn.disabled = false; btn.textContent = label;
  }
}
$("libList").addEventListener("click", klikMateriBersama);

/* ---------- Materi dari teman-teman, tampil di Beranda (dikelompokkan per jurusan) ---------- */
const BERSAMA_CACHE = "demuse-belajar-bersama-cache";
let bersamaStatus = "belum";   // belum | memuat | siap | gagal
async function muatBersama() {
  if (!hasApi()) return;
  bersamaStatus = "memuat"; renderBersama();
  try {
    const res = await apiGet({ aksi: "daftar" });
    const dilaporkan = new Set(readStore(LAPOR_KEY, []));
    libItems = (Array.isArray(res.data) ? res.data : []).filter((x) => !dilaporkan.has(String(x.id)));
    writeStore(BERSAMA_CACHE, libItems);
    bersamaStatus = "siap";
  } catch (err) {
    const simpanan = readStore(BERSAMA_CACHE, []);
    if (!libItems.length && simpanan.length) libItems = simpanan;
    bersamaStatus = libItems.length ? "siap" : "gagal";
  }
  renderBersama();
}
function renderBersama() {
  const box = $("bersamaList"); if (!box || !hasApi()) return;
  if (bersamaStatus === "memuat" && !libItems.length) { box.innerHTML = `<div class="empty">⏳ Memuat materi dari teman-teman...</div>`; return; }
  if (bersamaStatus === "gagal") { box.innerHTML = `<div class="empty">😕 ${esc(PESAN_OFFLINE)}</div>`; return; }
  const jurAll = [...new Set(libItems.map((x) => x.jurusan || "Lainnya"))].sort((a, b) => (a === "Lainnya") - (b === "Lainnya") || a.localeCompare(b));
  const pilih = $("bJurusan").value;
  $("bJurusan").innerHTML = `<option value="all">Semua jurusan</option>` + jurAll.map((j) => `<option value="${esc(j)}">${esc(j)}</option>`).join("");
  $("bJurusan").value = jurAll.includes(pilih) ? pilih : "all";
  const jurPilih = $("bJurusan").value;
  const q = $("bSearch").value.trim().toLowerCase();
  const items = libItems.filter((x) => (jurPilih === "all" || (x.jurusan || "Lainnya") === jurPilih) &&
    (!q || [x.mataKuliah, x.kode, x.daftarModul, x.nama].join(" ").toLowerCase().includes(q)));
  if (!libItems.length) { box.innerHTML = `<div class="empty">Belum ada materi yang dibagikan.<br>Bagikan materi kalian lewat tombol <b>📤 Bagikan</b> di halaman mata kuliah. 🌱</div>`; return; }
  if (!items.length) { box.innerHTML = `<div class="empty">Tidak ada materi yang cocok.</div>`; return; }
  const namaSaya = String(readStore(NAMA_KEY, "") || "").trim().toLowerCase();
  const jurSaya = readStore(JURUSAN_KEY, "");
  const punyaLokal = new Set(Object.values(library.subjects).flatMap((s) => [courseKey(s), slug(s.mataKuliah)]));
  const grup = {};
  items.forEach((x) => { (grup[x.jurusan || "Lainnya"] = grup[x.jurusan || "Lainnya"] || []).push(x); });
  const urutan = Object.keys(grup).sort((a, b) => (b === jurSaya) - (a === jurSaya) || (a === "Lainnya") - (b === "Lainnya") || a.localeCompare(b));
  const bukaSemua = urutan.length <= 3 || jurPilih !== "all" || q;
  box.innerHTML = urutan.map((j) => `
    <details class="b-group" ${bukaSemua || j === jurSaya ? "open" : ""}>
      <summary><span>🎓 ${esc(j)}</span><span class="b-count">${grup[j].length} materi</span></summary>
      <div class="b-grid">${grup[j].map((x) => {
        const milikSaya = namaSaya && String(x.nama || "").trim().toLowerCase() === namaSaya;
        const sudahAda = punyaLokal.has(slug(x.kode || x.mataKuliah)) || punyaLokal.has(slug(x.mataKuliah));
        return `<div class="lib-card">
          ${milikSaya ? `<span class="jur saya">⭐ Dibagikan oleh kalian</span>` : ""}${sudahAda ? `<span class="jur ada">✓ Ada di daftar kalian</span>` : ""}
          <h3>${esc(x.mataKuliah)}${x.kode ? ` <small class="muted">(${esc(x.kode)})</small>` : ""}</h3>
          <div class="lib-meta">${Number(x.jumlahModul) || 0} modul · oleh <b>${esc(x.nama || "Teman")}</b>${x.waktu ? " · " + esc(fmtTanggal(x.waktu)) : ""}</div>
          ${x.daftarModul ? `<div class="lib-modules">${esc(x.daftarModul).split(" | ").join("<br>")}</div>` : ""}
          <div class="row">
            <button class="btn pink" data-ambil="${esc(x.id)}">📥 Pakai materi ini</button>
            <button class="link-btn" data-lapor-materi="${esc(x.id)}">⚠️ Laporkan</button>
          </div>
        </div>`;
      }).join("")}</div>
    </details>`).join("");
}
$("bersamaList").addEventListener("click", klikMateriBersama);
$("bJurusan").addEventListener("change", renderBersama);
$("bSearch").addEventListener("input", renderBersama);
$("bersamaRefresh").addEventListener("click", muatBersama);
function keBersama() {
  const lanjut = () => setTimeout(() => $("bersamaSection").scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  if (tampilan === "materi") { tampilkanBeranda(); setTimeout(lanjut, 150); } else lanjut();
}

/* ============================================================
   PROGRES
   ============================================================ */
const TASKS = [["baca", "Sudah baca"], ["hafal", "Hafal istilah"], ["latihan", "Sudah latihan"]];
const progKey = (m, key) => `m${m.nomor}-${key}`;
function renderChecklist() {
  const store = readStore(progressKey(), {});
  $("checkList").innerHTML = `<h3 style="margin-bottom:8px">Progres per modul</h3>` + current().modul.map((m) => `
    <div class="check-row">
      <div><b>Modul ${m.nomor}</b><br><small>${esc(m.judul)}</small></div>
      <div class="check-opts">
        ${TASKS.map(([key, label]) => `<label><input type="checkbox" data-key="${progKey(m, key)}" ${store[progKey(m, key)] ? "checked" : ""}>${label}</label>`).join("")}
      </div>
    </div>`).join("");
  updateProgress();
}
function updateProgress() {
  const store = readStore(progressKey(), {});
  const keys = current().modul.flatMap((m) => TASKS.map(([key]) => progKey(m, key)));
  const done = keys.filter((k) => store[k]).length;
  const pct = keys.length ? Math.round((done / keys.length) * 100) : 0;
  $("progressText").textContent = `Progres belajar: ${pct}%`;
  $("progressBar").style.width = pct + "%";
}
$("checkList").addEventListener("change", (e) => {
  if (e.target.type !== "checkbox") return;
  const store = readStore(progressKey(), {});
  store[e.target.dataset.key] = e.target.checked;
  writeStore(progressKey(), store);
  updateProgress();
});
$("resetProgress").addEventListener("click", () => {
  if (confirm("Hapus semua centang di mata kuliah ini?")) { writeStore(progressKey(), {}); renderChecklist(); }
});
$("printBtn").addEventListener("click", () => {
  $("searchInput").value = ""; renderRingkasan();
  document.querySelectorAll("details.modul").forEach((d) => (d.open = true));
  window.print();
});

/* ============================================================
   TAMPILKAN SEMUA
   ============================================================ */
document.querySelectorAll(".needs-api").forEach((el) => el.classList.toggle("api-off", !hasApi()));
if (!hasApi()) { const o = $("quizSource").querySelector('option[value="teman"]'); if (o) o.remove(); }

/* ---------- Beranda (daftar mata kuliah) & halaman materi ---------- */
let tampilan = "beranda";
const TEKS_AWAL = $("mkInfo").textContent;
function persenProgres(id) {
  const s = library.subjects[id]; if (!s) return 0;
  const store = readStore("demuse-belajar-progress-" + id, {});
  const keys = s.modul.flatMap((m) => TASKS.map(([key]) => `m${m.nomor}-${key}`));
  return keys.length ? Math.round((keys.filter((k) => store[k]).length / keys.length) * 100) : 0;
}
function sisaHari(iso) {
  const t = new Date(iso); if (!iso || isNaN(t)) return "";
  const hari = Math.ceil((t - new Date()) / 864e5);
  return hari > 0 ? `⏳ ${hari} hari lagi ujian` : hari === 0 ? "🎓 Ujian hari ini!" : "";
}
function renderBeranda() {
  renderBersama();
  const ids = Object.keys(library.subjects);
  $("courseList").classList.toggle("hidden", !ids.length);
  $("caraPakai").classList.toggle("hidden", ids.length > 0);
  $("caraPakaiLink").classList.toggle("hidden", !ids.length);
  $("tryExample").classList.toggle("hidden", ids.length > 0);
  $("courseCards").innerHTML = ids.map((id) => {
    const s = library.subjects[id], p = persenProgres(id), hari = sisaHari(s.tanggalUjian);
    return `<button type="button" class="course-card" data-buka="${esc(id)}">
      <span class="cc-name">📘 ${esc(s.mataKuliah)}</span>
      <span class="cc-meta">${[s.kode, s.modul.length + " modul"].filter(Boolean).map(esc).join(" · ")}${hari ? ` · <b>${hari}</b>` : ""}</span>
      <span class="cc-bar"><i style="width:${p}%"></i></span>
      <span class="cc-prog">Progres ${p}% <span class="cc-go">Buka →</span></span>
    </button>`;
  }).join("");
}
function tampilkanBeranda(pakaiRiwayat = true) {
  if (pakaiRiwayat && tampilan === "materi" && adaRiwayat() && history.state && history.state.view === "materi") { history.back(); return; }
  tampilan = "beranda";
  renderAll();
  window.scrollTo(0, 0);
}
function bukaMateri(id, pakaiRiwayat = true) {
  if (!library.subjects[id]) return;
  const dariBeranda = tampilan !== "materi";
  library.active = id; saveLibrary();
  tampilan = "materi";
  if (pakaiRiwayat && dariBeranda && adaRiwayat()) history.pushState({ view: "materi" }, "");
  renderAll();
  window.scrollTo(0, 0);
}
$("courseCards").addEventListener("click", (e) => { const c = e.target.closest("[data-buka]"); if (c) bukaMateri(c.dataset.buka); });
$("backHome").addEventListener("click", () => tampilkanBeranda());
$("caraPakaiLink").addEventListener("click", () => { $("caraPakai").classList.toggle("hidden"); });

function renderAll() {
  if (library.active && !library.subjects[library.active]) library.active = null;
  if (!library.active) library.active = Object.keys(library.subjects)[0] || null;
  if (!current()) tampilan = "beranda";
  const d = tampilan === "materi" ? current() : null;
  const has = !!d;
  $("welcome").classList.toggle("hidden", has);
  $("app").classList.toggle("hidden", !has);
  $("subjectBar").classList.toggle("hidden", !has);
  $("progressWrap").classList.toggle("hidden", !has);
  $("backHome").classList.toggle("hidden", !has);

  if (!has) {
    document.title = "Template Belajar Ujian – deMuse";
    $("mkTitle").textContent = "Belajar Ujian Jadi Lebih Ringan";
    $("mkInfo").textContent = TEKS_AWAL;
    $("countdown").innerHTML = "";
    renderBeranda();
    return;
  }

  document.title = "Belajar " + d.mataKuliah;
  $("mkTitle").textContent = d.mataKuliah;
  $("mkInfo").textContent = [d.kode, d.info].filter(Boolean).join(" · ");
  $("catatanUmum").textContent = d.catatan ? "💡 " + d.catatan : "";
  $("catatanUmum").classList.toggle("hidden", !d.catatan);

  $("subjectSelect").innerHTML = Object.entries(library.subjects)
    .map(([id, s]) => `<option value="${esc(id)}" ${id === library.active ? "selected" : ""}>📘 ${esc(s.mataKuliah)}</option>`).join("");

  const opts = `<option value="all">Semua modul</option>` + d.modul.map((m) => `<option value="${m.nomor}">Modul ${m.nomor}: ${esc(m.judul)}</option>`).join("");
  $("fcFilter").innerHTML = opts;
  $("quizFilter").innerHTML = opts;

  $("searchInput").value = "";
  tickCountdown();
  renderRingkasan();
  buildCards();
  buildQuiz();
  renderEsai();
  renderChecklist();
  loadTemanSoal();
}

if (adaRiwayat()) history.replaceState({ view: "beranda" }, "");
libItems = readStore(BERSAMA_CACHE, []) || [];
renderAll();
muatBersama();

/* ============================================================
   APLIKASI (PWA): bisa dipasang & dibuka tanpa internet
   ============================================================ */
if ("serviceWorker" in navigator && /^https:|^http:\/\/(localhost|127\.0\.0\.1)/.test(location.href)) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}

const sudahDipasang = () => window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
const iniIphone = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
let promptPasang = null;

// Android / Chrome / Edge: browser memberi izin pasang
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  promptPasang = e;
  if (!sudahDipasang()) $("installBtn").classList.remove("hidden");
});
// iPhone tidak punya tombol otomatis, jadi tampilkan panduan
if (iniIphone && !sudahDipasang()) $("installBtn").classList.remove("hidden");

$("installBtn").addEventListener("click", async () => {
  if (promptPasang) {
    promptPasang.prompt();
    const pilihan = await promptPasang.userChoice;
    promptPasang = null;
    if (pilihan.outcome === "accepted") $("installBtn").classList.add("hidden");
  } else {
    openModal("iosModal");
  }
});
window.addEventListener("appinstalled", () => {
  $("installBtn").classList.add("hidden");
  toast("🎉 Aplikasi terpasang! Cari ikon \"Belajar Ujian\" di layar HP kalian.");
});
