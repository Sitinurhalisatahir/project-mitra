INSERT INTO tag (nama_tag, jenis, kategori) VALUES
 ('React','skill','Programming'),('Next.js','skill','Programming'),('Node.js','skill','Programming'),
 ('PostgreSQL','skill','Database'),('Python','skill','Programming'),('UI/UX Design','skill','Desain'),
 ('Data Analysis','skill','Data'),('Machine Learning','minat','Data'),('Web Development','minat','Programming'),
 ('Mobile App','minat','Programming'),('Lomba Karya Ilmiah','minat','Akademik'),('Startup','minat','Bisnis')
ON CONFLICT DO NOTHING;
