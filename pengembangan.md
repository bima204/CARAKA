# 🚀 Visi & Peta Jalan Pengembangan CARAKA (Platform Edukasi SD/MI)

Dokumen ini berisi *unek-unek*, impian besar, dan arah pengembangan platform CARAKA ke depan. Saat ini, kita sudah berhasil merancang pondasi awal berupa Halaman Utama, Peta Interaktif, dan Sistem Level dasar (Visual Novel & Kuis). Namun, karena target utama kita adalah **mengcover SELURUH materi pelajaran SD/MI secara interaktif**, skala aplikasi ini akan menjadi sangat masif.

---

## 🎯 1. Visi Besar (The Grand Vision)
CARAKA bukan sekadar "game tebak-tebakan" biasa. Aplikasi ini akan menjadi **"Dunia Virtual Belajar"** di mana anak-anak bisa masuk, berpetualang, dan belajar materi secara organik melalui interaksi dengan karakter-karakter wayang (seperti Abimanyu, Lulu, Petruk, dll). Guru juga nantinya bisa menggunakan ini sebagai media penugasan resmi di kelas.

## 📚 2. Ekspansi Materi (Konten)
Saat ini kita baru menyentuh kulit luar dari:
- **Unggah-ungguh Basa** (Ngoko & Krama)
- **Aksara Jawa Dasar** (Ngapalake aksara)

Ke depannya, materi yang harus bisa diakomodasi oleh sistem level:
- **Tembang Macapat:** Audio interaktif, anak-anak menebak cengkok atau melengkapi lirik.
- **Wayang & Kasusastraan:** Cerita interaktif (*branching storyline*) di mana pilihan pemain mengubah alur cerita pewayangan.
- **Paribasan, Bebasan, Saloka:** Mini-game mencocokkan makna.
- **Penugasan Guru:** Mode khusus di mana guru bisa membuat kuis *custom* dan anak-anak mengerjakannya dalam mode "Ujian" berwaktu.

## 🛠️ 3. Skalabilitas & Arsitektur (Technical Debt)
Karena konten akan membengkak, kita tidak bisa selamanya bergantung pada metode yang ada sekarang. Unek-unek teknis yang harus segera dibenahi seiring waktu:
- **Dari JSON ke Database:** Saat ini data dialog dan soal *hardcoded* di JSON. Jika nanti ada 100 level, JSON akan terlalu berat. Kita butuh **Backend (Node.js/Supabase/Firebase)** untuk mengambil data level secara asinkron (*lazy loading*).
- **Sistem Asset Management:** Gambar `background`, `karakter`, dan `audio` akan mencapai ratusan Megabyte. Kita harus menerapkan teknik *Pre-loading* dan *Caching* agar layar tidak *blank* saat pindah level.
- **Sistem State Management:** Saat ini skor dan *progress unlock* level tidak tersimpan jika di-*refresh*. Ke depan, harus menggunakan `Zustand` atau `Redux`, ditambah `localStorage` atau Database (User Login) agar *progress* anak tidak hilang.
- **Komponen Modular:** File `LevelAbimanyu.tsx` dan `LevelLulu.tsx` berpotensi menjadi "Spaghetti Code" jika fiturnya nambah. Kita harus memecah *DialogBox*, *ChoiceButton*, dan *FeedbackOverlay* menjadi komponen React terpisah yang bisa dipakai berulang (Reusable Components).

## ✨ 4. Fitur-fitur Impian Selanjutnya (Wishlist)
- **Sistem "Voice Acting" (Suara Karakter):** Anak SD/MI akan jauh lebih paham jika teks dialog juga disuarakan. Kita butuh tombol *Speaker* di dialog box agar teks dibacakan.
- **Ekspresi Dinamis Karakter:** Sprite Abimanyu dan Lulu tidak hanya diam; mereka bisa tersenyum saat benar, menangis/bingung saat salah, dan marah. (Membutuhkan pergantian *src image* dinamis).
- **Gamifikasi Tingkat Lanjut:** 
  - Sistem Nyawa (Hati/Bintang) yang berkurang kalau salah jawab.
  - *Inventory* (Ransel) tempat pemain mengumpulkan pusaka setelah menyelesaikan candi tertentu.
  - Papan Peringkat (*Leaderboard*) antar kelas.
- **Dashboard Guru:** Portal terpisah (Admin) untuk Pak/Bu Guru melihat statistik anak murid: "Si Budi sering salah di Aksara 'Na'".

## 🚧 5. Langkah Terdekat (Next Steps)
Sebelum melompat terlalu jauh, tugas terdekat kita adalah:
1. Menyempurnakan Halaman Level (Membuat komponen React modular yang bisa membaca tipe level apa pun, bukan hanya *hardcode* LevelLulu/LevelAbimanyu).
2. Menyimpan *progress* buka kunci level (Unlock) ke penyimpanan lokal sementara.
3. Memoles transisi dan efek suara (BGM/SFX) agar Halaman Utama dan Map tidak terasa "sepi".

---
*Dokumen ini akan terus diperbarui seiring berjalannya proses ngoding bersama. Mari wujudkan media belajar terbaik untuk anak Indonesia!* 🇮🇩
