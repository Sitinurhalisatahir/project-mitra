-- db/seed.sql
-- Master Data Seed untuk SkillMatch
-- Jalankan file ini pada database: db_mitra_proyek
-- Menggunakan ON CONFLICT (nama_tag) DO NOTHING agar aman dijalankan berulang kali tanpa duplikasi

INSERT INTO tag (nama_tag, jenis, kategori) VALUES
  -- === SKILL (Keahlian Teknis & Desain) ===
  -- Frontend
  ('React', 'skill', 'Frontend'),
  ('Next.js', 'skill', 'Frontend'),
  ('Vue.js', 'skill', 'Frontend'),
  ('Tailwind CSS', 'skill', 'Frontend'),
  ('TypeScript', 'skill', 'Frontend'),
  ('JavaScript', 'skill', 'Frontend'),
  ('HTML & CSS', 'skill', 'Frontend'),

  -- Backend
  ('Node.js', 'skill', 'Backend'),
  ('Express.js', 'skill', 'Backend'),
  ('Python', 'skill', 'Backend'),
  ('FastAPI', 'skill', 'Backend'),
  ('Django', 'skill', 'Backend'),
  ('PHP', 'skill', 'Backend'),
  ('Laravel', 'skill', 'Backend'),
  ('Golang', 'skill', 'Backend'),
  ('Java', 'skill', 'Backend'),
  ('Spring Boot', 'skill', 'Backend'),

  -- Database
  ('PostgreSQL', 'skill', 'Database'),
  ('MySQL', 'skill', 'Database'),
  ('MongoDB', 'skill', 'Database'),
  ('Redis', 'skill', 'Database'),
  ('Prisma ORM', 'skill', 'Database'),

  -- Mobile
  ('Flutter', 'skill', 'Mobile'),
  ('React Native', 'skill', 'Mobile'),
  ('Kotlin', 'skill', 'Mobile'),
  ('Swift', 'skill', 'Mobile'),

  -- Desain & Kreatif
  ('UI/UX Design', 'skill', 'Desain'),
  ('Figma', 'skill', 'Desain'),
  ('Adobe Photoshop', 'skill', 'Desain'),
  ('Adobe Illustrator', 'skill', 'Desain'),
  ('Wireframing & Prototyping', 'skill', 'Desain'),

  -- AI, Machine Learning & Data
  ('Machine Learning', 'skill', 'AI & Data'),
  ('Deep Learning', 'skill', 'AI & Data'),
  ('Data Analysis', 'skill', 'AI & Data'),
  ('Pandas & NumPy', 'skill', 'AI & Data'),
  ('TensorFlow / PyTorch', 'skill', 'AI & Data'),
  ('Natural Language Processing (NLP)', 'skill', 'AI & Data'),
  ('Computer Vision', 'skill', 'AI & Data'),

  -- Cloud, DevOps & Tools
  ('Git & GitHub', 'skill', 'DevOps & Tools'),
  ('Docker', 'skill', 'DevOps & Tools'),
  ('Linux', 'skill', 'DevOps & Tools'),
  ('RESTful API', 'skill', 'DevOps & Tools'),

  -- Hardware & IoT
  ('Arduino', 'skill', 'Hardware & IoT'),
  ('Raspberry Pi', 'skill', 'Hardware & IoT'),
  ('Internet of Things (IoT)', 'skill', 'Hardware & IoT'),

  -- === MINAT (Topik Proyek & Bidang Eksplorasi) ===
  ('Web Development', 'minat', 'Bidang Proyek'),
  ('Mobile App Development', 'minat', 'Bidang Proyek'),
  ('Artificial Intelligence & ML', 'minat', 'Bidang Proyek'),
  ('Data Science & Analytics', 'minat', 'Bidang Proyek'),
  ('IoT & Smart Device', 'minat', 'Bidang Proyek'),
  ('Game Development', 'minat', 'Bidang Proyek'),
  ('Cybersecurity', 'minat', 'Bidang Proyek'),
  ('Cloud Computing', 'minat', 'Bidang Proyek'),
  ('Desain Produk Digital', 'minat', 'Bidang Proyek'),
  ('Kewirausahaan & Startup', 'minat', 'Kategori Proyek'),
  ('Lomba Karya Tulis Ilmiah (LKTI)', 'minat', 'Kompetisi'),
  ('Hackathon & Coding Competition', 'minat', 'Kompetisi'),
  ('Proyek Tugas Akhir / Skripsi', 'minat', 'Akademik'),
  ('Pengabdian Masyarakat', 'minat', 'Sosial')
ON CONFLICT (nama_tag) DO NOTHING;
