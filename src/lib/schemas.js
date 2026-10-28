import { z } from 'zod';

export const proyekBase = z.object({
  judul: z.string().min(1).max(150),
  deskripsi: z.string().optional(),
  kategori: z.enum(['tugas_kuliah', 'lomba', 'personal']).optional(),
  slot_dibutuhkan: z.number().int().min(1).optional(),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format YYYY-MM-DD').optional(),
  tag_ids: z.array(z.number().int().positive()).optional(),
});
