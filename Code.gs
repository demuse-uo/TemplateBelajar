/* ============================================================
   BACKEND TEMPLATE BELAJAR UJIAN — deMuse (Google Apps Script)

   CARA PASANG (cukup sekali, dilakukan admin):
   1. Buat Google Sheets baru (kosong), beri nama misalnya
      "Materi Bersama deMuse".
   2. Menu Extensions > Apps Script. Hapus isi Code.gs,
      tempel SEMUA isi file ini, lalu Save.
   3. Klik Deploy > New deployment > pilih jenis "Web app".
        - Execute as      : Me
        - Who has access  : Anyone
      Klik Deploy, izinkan akses (Authorize).
   4. Copy "Web app URL", lalu tempel di belajar-ujian.js
      pada baris:  const API_URL = "....";
   Lembar "Materi" dan "Soal" akan dibuat otomatis saat
   pertama kali ada yang membagikan.

   KALAU KODE INI DIUBAH NANTI:
   Deploy > Manage deployments > ikon pensil > Version: New version
   > Deploy. URL-nya tetap sama.

   TUGAS ADMIN DI GOOGLE SHEETS:
   - Kolom "status" berisi: tampil / menunggu / disembunyikan.
   - Sembunyikan materi/soal yang salah: ubah status jadi
     "disembunyikan" (atau hapus barisnya).
   - Kalau TAMPIL_LANGSUNG = false, materi & soal baru berstatus
     "menunggu" dan baru muncul setelah admin mengubahnya jadi "tampil".
   ============================================================ */

/* ---------- PENGATURAN ---------- */
const TAMPIL_LANGSUNG = true;   // false = harus disetujui admin dulu
const BATAS_LAPORAN = 3;        // disembunyikan otomatis setelah dilaporkan sekian kali
const UKURAN_POTONGAN = 40000;  // batas isi satu sel Google Sheets ~50.000 huruf
const MAKS_MATERI = 2000000;    // batas ukuran satu materi yang dibagikan (± 1.000 halaman)

const KOLOM_MATERI = ["id", "waktu", "nama", "jurusan", "mataKuliah", "kode", "kunci", "daftarModul", "jumlahModul", "jumlahSoal", "status", "laporan", "data"];
const KOLOM_SOAL = ["id", "waktu", "kunci", "mataKuliah", "nomorModul", "judulModul", "tipe", "tanya", "pilihan", "jawaban", "pembahasan", "nama", "status", "laporan"];

/* ---------- HELPER ---------- */
function lembar_(nama, kolom) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(nama);
  if (!sh) {
    sh = ss.insertSheet(nama);
    sh.getRange(1, 1, 1, kolom.length).setValues([kolom]).setFontWeight("bold");
    sh.setFrozenRows(1);
  }
  return sh;
}

function keluar_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Teks aman untuk Sheets: dipotong, dan tidak dibaca sebagai rumus (= + - @)
function teks_(v, maks) {
  let s = v == null ? "" : String(v).trim();
  if (maks) s = s.slice(0, maks);
  return amanRumus_(s);
}
function amanRumus_(s) {
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function idBaru_(awalan) {
  return awalan + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function baris_(sh) {
  const nilai = sh.getDataRange().getValues();
  const kepala = nilai.shift().map(String);
  return { kepala: kepala, baris: nilai };
}

function tulisBaris_(sh, isi) {
  const r = sh.getLastRow() + 1;
  sh.getRange(r, 1, 1, isi.length).setNumberFormat("@").setValues([isi]);
}

/* ---------- MEMBACA (GET) ---------- */
function doGet(e) {
  const p = (e && e.parameter) || {};
  try {
    if (p.aksi === "daftar") return keluar_({ ok: true, data: daftarMateri_() });
    if (p.aksi === "ambil") return keluar_({ ok: true, data: ambilMateri_(p.id) });
    if (p.aksi === "soal") return keluar_({ ok: true, data: daftarSoal_(p.kunci) });
    return keluar_({ ok: true, pesan: "API Template Belajar deMuse aktif" });
  } catch (err) {
    return keluar_({ ok: false, pesan: String(err.message || err) });
  }
}

function daftarMateri_() {
  const sh = lembar_("Materi", KOLOM_MATERI);
  const t = baris_(sh), k = (n) => t.kepala.indexOf(n);
  return t.baris
    .filter((r) => String(r[k("status")]) === "tampil")
    .map((r) => ({
      id: String(r[k("id")]),
      waktu: String(r[k("waktu")]),
      nama: String(r[k("nama")]),
      jurusan: String(r[k("jurusan")]),
      mataKuliah: String(r[k("mataKuliah")]),
      kode: String(r[k("kode")]),
      daftarModul: String(r[k("daftarModul")]),
      jumlahModul: Number(r[k("jumlahModul")]) || 0,
      jumlahSoal: Number(r[k("jumlahSoal")]) || 0
    }))
    .reverse();
}

function ambilMateri_(id) {
  const sh = lembar_("Materi", KOLOM_MATERI);
  const t = baris_(sh), k = (n) => t.kepala.indexOf(n);
  const r = t.baris.find((x) => String(x[k("id")]) === String(id) && String(x[k("status")]) === "tampil");
  if (!r) throw new Error("Materi tidak ditemukan atau sudah disembunyikan.");
  const json = r.slice(k("data")).map((v) => (v == null ? "" : String(v))).join("");
  return JSON.parse(json);
}

function daftarSoal_(kunci) {
  const sh = lembar_("Soal", KOLOM_SOAL);
  const t = baris_(sh), k = (n) => t.kepala.indexOf(n);
  return t.baris
    .filter((r) => String(r[k("kunci")]) === String(kunci) && String(r[k("status")]) === "tampil")
    .map((r) => {
      let pilihan = [];
      try { pilihan = JSON.parse(String(r[k("pilihan")]) || "[]"); } catch (e) {}
      return {
        id: String(r[k("id")]),
        nomorModul: Number(r[k("nomorModul")]) || 0,
        judulModul: String(r[k("judulModul")]),
        tipe: String(r[k("tipe")]),
        tanya: String(r[k("tanya")]),
        pilihan: pilihan,
        jawaban: String(r[k("jawaban")]),
        pembahasan: String(r[k("pembahasan")]),
        nama: String(r[k("nama")])
      };
    });
}

/* ---------- MENULIS (POST) ---------- */
function doPost(e) {
  const kunci = LockService.getScriptLock();
  kunci.waitLock(20000);
  try {
    const b = JSON.parse(e.postData.contents);
    if (b.aksi === "bagikan") return keluar_(bagikan_(b));
    if (b.aksi === "tambahSoal") return keluar_(tambahSoal_(b));
    if (b.aksi === "lapor") return keluar_(lapor_(b));
    return keluar_({ ok: false, pesan: "Aksi tidak dikenal." });
  } catch (err) {
    return keluar_({ ok: false, pesan: String(err.message || err) });
  } finally {
    kunci.releaseLock();
  }
}

function bagikan_(b) {
  const d = b.data;
  if (!d || !Array.isArray(d.modul) || !d.modul.length) throw new Error("Materi kosong.");
  if (!String(b.nama || "").trim()) throw new Error("Nama wajib diisi.");
  const json = JSON.stringify(d);
  if (json.length > MAKS_MATERI) throw new Error("Materi terlalu besar. Coba bagikan beberapa modul saja.");

  const potongan = [];
  for (let i = 0; i < json.length; i += UKURAN_POTONGAN) potongan.push(amanRumus_(json.slice(i, i + UKURAN_POTONGAN)));

  const jumlahSoal = d.modul.reduce((a, m) => a + (Array.isArray(m.soal) ? m.soal.length : 0), 0);
  const daftarModul = d.modul.map((m) => "Modul " + (m.nomor || "?") + ": " + (m.judul || "")).join(" | ");
  const status = TAMPIL_LANGSUNG ? "tampil" : "menunggu";
  const id = idBaru_("M");

  tulisBaris_(lembar_("Materi", KOLOM_MATERI), [
    id, new Date().toISOString(), teks_(b.nama, 60), teks_(b.jurusan, 80),
    teks_(d.mataKuliah, 150), teks_(d.kode, 40), teks_(b.kunci, 100),
    teks_(daftarModul, 1500), String(d.modul.length), String(jumlahSoal),
    status, "0"
  ].concat(potongan));

  return { ok: true, id: id, status: status };
}

function tambahSoal_(b) {
  const tipe = b.tipe === "esai" ? "esai" : "pg";
  const tanya = String(b.tanya || "").trim();
  if (!tanya) throw new Error("Pertanyaan wajib diisi.");
  if (!String(b.nama || "").trim()) throw new Error("Nama wajib diisi.");
  if (!String(b.kunci || "").trim()) throw new Error("Mata kuliah tidak dikenali.");

  let pilihan = [], jawaban = "";
  if (tipe === "pg") {
    pilihan = (Array.isArray(b.pilihan) ? b.pilihan : []).map((p) => String(p).trim().slice(0, 300)).filter(Boolean).slice(0, 6);
    const j = Number(b.jawaban);
    if (pilihan.length < 2) throw new Error("Isi minimal 2 pilihan jawaban.");
    if (!(j >= 0 && j < pilihan.length)) throw new Error("Pilih jawaban yang benar.");
    jawaban = String(j);
  } else {
    jawaban = String(b.jawaban || "").trim().slice(0, 3000);
  }

  const status = TAMPIL_LANGSUNG ? "tampil" : "menunggu";
  const id = idBaru_("S");
  tulisBaris_(lembar_("Soal", KOLOM_SOAL), [
    id, new Date().toISOString(), teks_(b.kunci, 100), teks_(b.mataKuliah, 150),
    String(Number(b.nomorModul) || 0), teks_(b.judulModul, 200), tipe,
    teks_(tanya, 1000), amanRumus_(JSON.stringify(pilihan)), amanRumus_(jawaban),
    teks_(b.pembahasan, 1500), teks_(b.nama, 60), status, "0"
  ]);

  return { ok: true, id: id, status: status };
}

function lapor_(b) {
  const sh = b.tipe === "materi" ? lembar_("Materi", KOLOM_MATERI) : lembar_("Soal", KOLOM_SOAL);
  const t = baris_(sh), k = (n) => t.kepala.indexOf(n);
  const i = t.baris.findIndex((r) => String(r[k("id")]) === String(b.id));
  if (i === -1) return { ok: true };
  const row = i + 2;
  const jumlah = (Number(t.baris[i][k("laporan")]) || 0) + 1;
  sh.getRange(row, k("laporan") + 1).setValue(String(jumlah));
  if (jumlah >= BATAS_LAPORAN) sh.getRange(row, k("status") + 1).setValue("disembunyikan");
  return { ok: true };
}
