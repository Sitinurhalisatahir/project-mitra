-- Jalankan di database db_mitra_proyek
CREATE TABLE pengguna (
  pengguna_id SERIAL PRIMARY KEY,
  nim VARCHAR(20) UNIQUE NOT NULL,
  nama VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  jurusan VARCHAR(100),
  angkatan INT,
  role VARCHAR(20) NOT NULL DEFAULT 'mahasiswa' CHECK (role IN ('admin', 'mahasiswa')),
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  ketersediaan_waktu VARCHAR(100),
  profil_publik BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE tag (
  tag_id SERIAL PRIMARY KEY,
  nama_tag VARCHAR(100) UNIQUE NOT NULL,
  jenis VARCHAR(10) NOT NULL CHECK (jenis IN ('skill', 'minat')),
  kategori VARCHAR(50)
);
CREATE TABLE pengguna_tag (
  pengguna_id INT NOT NULL REFERENCES pengguna(pengguna_id) ON DELETE CASCADE,
  tag_id INT NOT NULL REFERENCES tag(tag_id) ON DELETE CASCADE,
  level VARCHAR(20) CHECK (level IN ('pemula', 'menengah', 'mahir')),
  PRIMARY KEY (pengguna_id, tag_id)
);
CREATE TABLE proyek (
  proyek_id SERIAL PRIMARY KEY,
  pemilik_id INT NOT NULL REFERENCES pengguna(pengguna_id) ON DELETE CASCADE,
  judul VARCHAR(150) NOT NULL,
  deskripsi TEXT,
  kategori VARCHAR(50) CHECK (kategori IN ('tugas_kuliah', 'lomba', 'personal')),
  slot_dibutuhkan INT NOT NULL DEFAULT 1,
  deadline DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'buka' CHECK (status IN ('buka', 'ditutup', 'selesai')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE proyek_tag (
  proyek_id INT NOT NULL REFERENCES proyek(proyek_id) ON DELETE CASCADE,
  tag_id INT NOT NULL REFERENCES tag(tag_id) ON DELETE CASCADE,
  PRIMARY KEY (proyek_id, tag_id)
);
CREATE TABLE aplikasi (
  aplikasi_id SERIAL PRIMARY KEY,
  proyek_id INT NOT NULL REFERENCES proyek(proyek_id) ON DELETE CASCADE,
  pelamar_id INT NOT NULL REFERENCES pengguna(pengguna_id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'diterima', 'ditolak')),
  pesan TEXT,
  applied_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (proyek_id, pelamar_id)
);
CREATE TABLE pesan (
  pesan_id SERIAL PRIMARY KEY,
  pengirim_id INT NOT NULL REFERENCES pengguna(pengguna_id) ON DELETE CASCADE,
  penerima_id INT NOT NULL REFERENCES pengguna(pengguna_id) ON DELETE CASCADE,
  isi_pesan TEXT NOT NULL,
  sent_at TIMESTAMP NOT NULL DEFAULT NOW(),
  is_read BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE TABLE notifikasi (
  notifikasi_id SERIAL PRIMARY KEY,
  pengguna_id INT NOT NULL REFERENCES pengguna(pengguna_id) ON DELETE CASCADE,
  tipe VARCHAR(30) CHECK (tipe IN ('pesan', 'pelamar', 'rekomendasi', 'status_lamaran')),
  isi TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_proyek_status ON proyek(status);
CREATE INDEX idx_proyek_kategori ON proyek(kategori);
CREATE INDEX idx_proyek_deadline ON proyek(deadline);
CREATE INDEX idx_aplikasi_status ON aplikasi(status);
CREATE INDEX idx_notifikasi_pengguna ON notifikasi(pengguna_id, is_read);
CREATE INDEX idx_pesan_pengirim_penerima ON pesan(pengirim_id, penerima_id);
