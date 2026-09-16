# BGP Project - Admin Dashboard

BGP Project Admin Dashboard adalah aplikasi antarmuka web (frontend) yang dirancang untuk mengelola dan memonitor aktivitas keamanan (satpam) di berbagai cabang dan klien. Sistem ini mempermudah admin, pengelola cabang, dan klien dalam melakukan pengawasan, pengelolaan data satpam, rekap absensi, jadwal patroli, hingga merespons laporan darurat (Panic Alert).

Aplikasi ini dibangun menggunakan ekosistem modern **React**, **TypeScript**, dan **Vite**, dengan antarmuka yang rapi dan responsif berkat integrasi **HeroUI** dan **Tailwind CSS**.

## 🌟 Fitur Utama

- **Role-Based Access Control (RBAC)**
  Sistem ini memiliki pembagian peran yang ketat untuk `admin`, `cabang`, dan `client`. Setiap peran memiliki akses dan visibilitas fitur yang disesuaikan (misal: client hanya dapat melihat satpam yang ditugaskan kepada mereka).
- **Manajemen Pengguna & Satpam**
  Pendaftaran, persetujuan akun, dan pengelolaan detail profil setiap satpam dan klien.
- **Monitoring Kehadiran & Patroli**
  Rekap absensi harian dan rute/pos patroli yang divisualisasikan dengan tabel informatif.
- **Panic Alert (Tombol Darurat)**
  Monitoring real-time untuk laporan darurat dari aplikasi satpam, lengkap dengan status (Aktif, Dalam Penanganan, Selesai) dan pelacakan lokasi.
- **Pengajuan Cuti & Lembur**
  Modul untuk menyetujui atau menolak permohonan izin, cuti, atau lembur yang diajukan oleh satpam.
- **Pengumuman & Repositori Dokumen**
  Pusat siaran informasi massal dan repositori untuk mengunggah dokumen (SOP, Peraturan) yang bisa diakses dan diunduh oleh anggota terkait.

## 🛠️ Teknologi yang Digunakan

- **Core**: React 19, TypeScript, Vite
- **Styling & UI**: Tailwind CSS v4, HeroUI, Framer Motion, GSAP
- **Routing**: React Router DOM v7
- **Maps**: Leaflet, React Leaflet, React Simple Maps
- **Charts**: Recharts
- **Date & Time**: Day.js
- **Icons**: React Icons (HeroIcons)

## 📋 Prasyarat Sistem

Pastikan sistem Anda telah menginstal:
- **Node.js** (versi 18.x atau lebih baru sangat disarankan)
- **npm** atau **yarn**
- **Git**

## 🚀 Cara Setup dan Instalasi (Local Development)

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi di lingkungan lokal:

1. **Clone repositori**
   ```bash
   git clone <url-repository-anda>
   cd BGP_Project_Admin
   ```

2. **Instalasi Dependencies**
   Gunakan npm untuk menginstal semua paket yang dibutuhkan:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment (Opsional)**
   Jika proyek ini memerlukan URL API atau konfigurasi khusus, buat file `.env` di root direktori proyek. Contoh (sesuaikan dengan URL backend Anda):
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```
   *(Catatan: Anda mungkin tidak perlu langkah ini jika endpoint sudah di-hardcode di service, namun ini adalah best practice).*

4. **Jalankan Server Development**
   Jalankan perintah berikut untuk memulai server lokal:
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di mode development. Buka browser dan akses URL lokal yang tertera di terminal (biasanya `http://localhost:5173`).

5. **Build untuk Production**
   Jika ingin melakukan kompilasi aplikasi untuk keperluan deployment, jalankan:
   ```bash
   npm run build
   ```
   Hasil build akan dibuat di dalam folder `dist/`.

## 📁 Struktur Folder Utama

```text
src/
 ├── Components/    # Komponen React yang reusable (Tabel, Modal, Sidebar, dll)
 ├── hooks/         # Custom React hooks untuk fetching data dan logic state
 ├── pages/         # Komponen Halaman (Views) utama untuk React Router
 ├── services/      # Layanan komunikasi API ke backend
 ├── types/         # Definisi interface/type TypeScript
 ├── Utils/         # Helper functions (format tanggal, auth cookie, dll)
 ├── App.tsx        # Entry point Router & Layout aplikasi
 └── main.tsx       # Root render & penyedia Context/Provider
```

## 📜 Skrip NPM

Berikut adalah daftar skrip yang dapat dijalankan melalui terminal:

- `npm run dev`: Memulai vite development server dengan HMR.
- `npm run build`: Menjalankan TypeScript compiler (`tsc -b`) dan membuat production build dengan Vite.
- `npm run lint`: Menjalankan ESLint untuk mengecek potensi error atau masalah penulisan kode.
- `npm run preview`: Membuka server preview lokal untuk menguji folder `dist/` hasil build.

---
*Dibuat & Dikelola oleh Tim Pengembang BGP Project.*
