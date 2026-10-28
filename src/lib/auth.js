import jwt from 'jsonwebtoken';

export const signToken = (u) =>
  jwt.sign({ sub: u.pengguna_id, role: u.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// Ambil token dari header "Authorization: Bearer <token>"
export function readToken(req) {
  const h = req.headers.get('authorization') || '';
  if (!h.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(h.slice(7), process.env.JWT_SECRET);
  } catch {
    return null;
  }
}
