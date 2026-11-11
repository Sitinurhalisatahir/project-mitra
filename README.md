# SkillMatch — Platform Kolaborasi & Pencarian Mitra Proyek

> **Tugas Proyek — Kelompok 7**

**SkillMatch** adalah platform berbasis web yang dirancang untuk membantu mahasiswa menemukan rekan tim dan mitra proyek yang tepat berdasarkan keselarasan keahlian (*skills*), minat (*interests*), serta ketersediaan waktu untuk tugas kuliah, kompetisi/lomba, maupun proyek mandiri.

---

## 👥 Anggota Kelompok 7

| No | Nama | NIM |
|:--:|:-----|:---:|
| 1 | NAA’ILAH MAZAYA | H071241061 |
| 2 | NAYLA ZAKY FAUZIAH | H071241064 |
| 3 | ERLY WINARNI | H071241074 |
| 4 | SITI NUR HALISA TAHIR | H071241086 |
| 5 | MUH. ANUGRAH ASHARY PUTRA | H071241087 |

---

## 🚀 Fitur Utama

- **Profil & Portofolio Skill**: Pengelolaan keahlian (*skills*), minat, dan ketersediaan waktu mahasiswa.
- **Pencarian & Rekomendasi Mitra**: Menemukan rekan tim yang cocok sesuai kebutuhan kualifikasi proyek.
- **Manajemen Proyek**: Membuat proyek (tugas kuliah, lomba, personal), menentukan slot anggota, dan mengelola lamaran masuk.
- **Lamaran & Aplikasi**: Mendaftar ke proyek yang dibuka serta memantau status lamaran (*pending*, diterima, ditolak).
- **Fitur Chat/Diskusi**: Koordinasi awal antar mahasiswa secara langsung di dalam platform.
- **Panel Admin**: Verifikasi pengguna, pengelolaan tag (kategori skill/minat), serta statistik platform.
- **Dokumentasi API**: Swagger UI interaktif di endpoint `/api-docs`.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend & Backend**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Autentikasi**: JWT (JSON Web Token) & bcryptjs
- **Validasi Data**: Zod
- **Dokumentasi API**: Swagger UI (`next-swagger-doc` & `swagger-ui-react`)

---

## ⚙️ Panduan Menjalankan Proyek

### 1. Instalasi Dependensi
```bash
npm install
```

### 2. Konfigurasi Environment (`.env.local`)
Buat file `.env.local` di root folder dan sesuaikan variabel berikut:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/db_mitra_proyek
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@kampus.ac.id
ADMIN_PASSWORD=admin12345
```

### 3. Setup Database & Admin
Eksekusi file skrip database berikut secara berurutan pada PostgreSQL:
1. `db/schema.sql`
2. `db/seed_tags.sql` *(opsional)*
3. `db/seed.sql` *(opsional)*

Lalu buat akun admin default:
```bash
node --env-file=.env.local scripts/seed-admin.mjs
```

### 4. Jalankan Aplikasi
```bash
npm run dev
```
Akses aplikasi melalui browser di [http://localhost:3000](http://localhost:3000) dan dokumentasi API di [http://localhost:3000/api-docs](http://localhost:3000/api-docs).
