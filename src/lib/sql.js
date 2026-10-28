export function paging(sp) {
  const page = Math.max(1, parseInt(sp.get('page')) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(sp.get('limit')) || 20));
  return { page, limit, offset: (page - 1) * limit };
}

// Builder WHERE dinamis: f.add('kolom = ?', nilai)
export function filters() {
  const c = [];
  const v = [];
  return {
    v,
    add(sql, val) {
      v.push(val);
      c.push(sql.replaceAll('?', '$' + v.length));
    },
    raw(sql) {
      c.push(sql);
    },
    where: () => (c.length ? 'WHERE ' + c.join(' AND ') : ''),
  };
}

// Rows harus memuat kolom `total` (COUNT(*) OVER())
export function paged(rows, { page, limit }) {
  const total = rows[0]?.total ?? 0;
  return {
    items: rows.map(({ total, ...r }) => r),
    meta: { page, limit, total, total_pages: Math.ceil(total / limit) },
  };
}

// UPDATE parsial. Nama kolom berasal dari key schema zod (bukan input mentah user).
export async function updateRow(client, table, idCol, id, fields) {
  const e = Object.entries(fields).filter(([, v]) => v !== undefined);
  if (!e.length) return null;
  const sets = e.map(([k], i) => `${k} = $${i + 1}`).join(', ');
  const { rows } = await client.query(
    `UPDATE ${table} SET ${sets} WHERE ${idCol} = $${e.length + 1} RETURNING *`,
    [...e.map(([, v]) => v), id]
  );
  return rows[0];
}
