import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { query } from './db';
import { readToken } from './auth';

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const ok = (data, status = 200, meta) =>
  NextResponse.json({ success: true, data, ...(meta && { meta }) }, { status });

const fail = (status, message, errors) =>
  NextResponse.json({ success: false, message, ...(errors && { errors }) }, { status });

/**
 * Pembungkus handler: auth, cek role/verifikasi, dan penanganan error terpusat.
 * opts: { auth, verified, admin }  (verified & admin otomatis mengaktifkan auth)
 */
export function route(fn, opts = {}) {
  return async (req, ctx) => {
    try {
      let user = null;
      if (opts.auth || opts.verified || opts.admin) {
        const t = readToken(req);
        if (!t) throw new ApiError(401, 'Silakan login terlebih dahulu');
        const { rows } = await query(
          'SELECT pengguna_id, nim, nama, email, role, is_verified FROM pengguna WHERE pengguna_id = $1',
          [t.sub]
        );
        user = rows[0];
        if (!user) throw new ApiError(401, 'Akun tidak ditemukan');
        if (opts.admin && user.role !== 'admin') throw new ApiError(403, 'Hanya admin yang boleh mengakses');
        if (opts.verified && !user.is_verified && user.role !== 'admin')
          throw new ApiError(403, 'Akun Anda belum diverifikasi admin');
      }
      const params = ctx?.params ? await ctx.params : {}; // kompatibel Next 14 & 15
      return await fn({ req, user, params });
    } catch (e) {
      if (e instanceof ApiError) return fail(e.status, e.message);
      if (e instanceof ZodError)
        return fail(400, 'Validasi gagal', e.issues.map((i) => ({ field: i.path.join('.'), message: i.message })));
      if (e instanceof SyntaxError) return fail(400, 'Body JSON tidak valid');
      if (e?.code === '23505') return fail(409, `Data sudah ada (${e.constraint || 'duplikat'})`);
      if (e?.code === '23503') return fail(400, 'Referensi data tidak valid');
      if (e?.code === '23514') return fail(400, 'Nilai tidak sesuai aturan data');
      console.error(e);
      return fail(500, 'Terjadi kesalahan pada server');
    }
  };
}

export const body = async (req, schema) => schema.parse(await req.json());

export function intParam(v, name = 'id') {
  const n = Number(v);
  if (!Number.isInteger(n) || n <= 0) throw new ApiError(400, `${name} tidak valid`);
  return n;
}

export const intList = (s) =>
  (s || '').split(',').map(Number).filter((n) => Number.isInteger(n) && n > 0);
