import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { AVATAR_DIR, NAMA_FILE_RE, MIME_BY_EXT } from '@/lib/foto';


// Melayani foto profil. Publik (dipakai <img src>, yang tidak bisa mengirim header Authorization).
// Nama file dibatasi regex sehingga tidak bisa keluar dari folder avatars.
export async function GET(_req, ctx) {
  const { file } = await ctx.params;
  if (!NAMA_FILE_RE.test(file)) return new Response('Tidak ditemukan', { status: 404 });
  try {
    const data = await readFile(path.join(AVATAR_DIR, file));
    return new Response(data, {
      headers: {
        'Content-Type': MIME_BY_EXT[file.split('.').pop()],
        // Nama file unik tiap unggahan, jadi aman di-cache lama
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return new Response('Tidak ditemukan', { status: 404 });
  }
}
