# Task List Pengembangan Game "CARAKA" 📋

Dokumen ini berisi daftar tugas (tasks) dari awal pembuatan hingga game selesai. Kita bisa memberi tanda centang (✅) jika tugas sudah diselesaikan.

## Tahap 1: Persiapan & Setup Proyek
- [x] Inisialisasi proyek menggunakan Vite + React (TypeScript / TSX).
- [x] Setup struktur folder standar (`src/components`, `src/pages`, `src/assets`, `src/data`).
- [x] Memindahkan semua folder aset (*aset karakter*, *aset background*, dll) ke dalam folder `public` atau `src/assets`.
- [x] Pengaturan Global CSS (warna tema, jenis font yang ramah anak dan mudah dibaca dari proyektor).

## Tahap 2: Struktur Data (JSON)
- [x] Membuat file `data/abimanyu.json` (berisi alur cerita, level 1-3, teks dialog, dan pilihan jawaban untuk Unggah-ungguh).
- [x] Membuat file `data/lulu.json` (berisi materi Aksara Jawa, kuis level 4 hingga Borobudur).
- [x] Membuat file `data/levels.json` (status *unlock* level dan skor).

## Tahap 3: Pembuatan UI & Halaman Utama
- [x] **Halaman Awal (Home):** Membuat tampilan beranda dengan *background* `aset halaman awal.jpg` dan tombol "Mulai Dolan".
- [x] **Halaman Peta (Map):** Membuat layar pemilihan level menggunakan `aset halaman peta atau level.jpg` dengan ikon interaktif untuk memilih desa atau candi.

## Tahap 4: Sistem Game Abimanyu (Unggah-ungguh)
- [x] Membuat komponen *Dialog Box* (gaya *Visual Novel*).
- [x] Memasukkan *sprite* karakter Abimanyu dan NPC ke dalam layar.
- [x] Membuat sistem tombol pilihan jawaban (Ngoko / Krama).
- [x] Menambahkan sistem umpan balik (Benar/Salah) dengan animasi ringan.

## Tahap 5: Sistem Game Lulu (Aksara Jawa)
- [x] Membuat antarmuka untuk kuis tebak Aksara Jawa.
- [x] Memasukkan *background* candi (`aset level lulu`).
- [x] Membuat komponen interaktif (tombol pilihan ganda atau susun kata) untuk menjawab kuis.

## Tahap 6: Polishing (Penyempurnaan)
- [x] Menambahkan efek transisi halaman (supaya perpindahan mulus layaknya game).
- [x] Mengintegrasikan efek suara (BGM dan SFX: gamelan click, tetot salah, bonang benar, fanfare kemenangan, dan nada game over).
- [x] Uji coba game (Testing) layout responsif & kontras tinggi proyektor kampus.
- [x] Optimalisasi akhir (Build production sukses & bebas error linting).
