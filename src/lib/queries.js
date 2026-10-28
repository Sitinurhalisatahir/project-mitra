import { query } from './db';

export const tagsPengguna = (col) => `(SELECT COALESCE(json_agg(json_build_object(
  'tag_id', t.tag_id, 'nama_tag', t.nama_tag, 'jenis', t.jenis, 'level', pt.level)), '[]'::json)
  FROM pengguna_tag pt JOIN tag t ON t.tag_id = pt.tag_id WHERE pt.pengguna_id = ${col})`;

export const tagsProyek = (col) => `(SELECT COALESCE(json_agg(json_build_object(
  'tag_id', t.tag_id, 'nama_tag', t.nama_tag, 'jenis', t.jenis)), '[]'::json)
  FROM proyek_tag x JOIN tag t ON t.tag_id = x.tag_id WHERE x.proyek_id = ${col})`;

export const slotTerisi = (col) =>
  `(SELECT COUNT(*)::int FROM aplikasi a WHERE a.proyek_id = ${col} AND a.status = 'diterima')`;

export async function getProfilLengkap(id) {
  const { rows } = await query(
    `SELECT p.pengguna_id, p.nim, p.nama, p.email, p.jurusan, p.angkatan, p.role, p.is_verified,
            p.ketersediaan_waktu, p.profil_publik, p.created_at, ${tagsPengguna('p.pengguna_id')} AS tags
     FROM pengguna p WHERE p.pengguna_id = $1`,
    [id]
  );
  return rows[0] ?? null;
}
