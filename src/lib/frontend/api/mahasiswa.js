import { apiFetch } from "@/lib/frontend/api/client";

export async function getMahasiswaMe() {
  return apiFetch("/api/auth/me");
}

export async function getMahasiswaProfil() {
  return apiFetch("/api/profil");
}

export async function updateMahasiswaProfil(data) {
  return apiFetch("/api/profil", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function getAllTags(jenis) {
  const query = jenis ? `?jenis=${encodeURIComponent(jenis)}` : "";
  return apiFetch(`/api/tag${query}`);
}

export async function getProyekSaya() {
  return apiFetch("/api/proyek?mine=true&status=all");
}

export async function createProyek(data) {
  return apiFetch("/api/proyek", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProyek(id, data) {
  return apiFetch(`/api/proyek/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteProyek(id) {
  return apiFetch(`/api/proyek/${id}`, {
    method: "DELETE",
  });
}

export async function getProyek(params = {}) {
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.kategori) query.set("kategori", params.kategori);
  if (params.status) query.set("status", params.status);
  if (params.tag_id) query.set("tag_id", params.tag_id);
  if (params.sort) query.set("sort", params.sort);

  const qs = query.toString();
  return apiFetch(`/api/proyek${qs ? `?${qs}` : ""}`);
}

export async function getRekomendasiProyek(limit = 10) {
  return apiFetch(`/api/rekomendasi/proyek?limit=${limit}`);
}

export async function getDetailProyek(id) {
  return apiFetch(`/api/proyek/${id}`);
}

export async function ajukanLamaran(proyekId, pesan) {
  return apiFetch(`/api/proyek/${proyekId}/aplikasi`, {
    method: "POST",
    body: JSON.stringify({ pesan }),
  });
}

export async function getAplikasiSaya() {
  return apiFetch("/api/aplikasi");
}

export async function getPelamarProyek(proyekId, status = "") {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return apiFetch(`/api/proyek/${proyekId}/aplikasi${query}`);
}

export async function updateStatusLamaran(aplikasiId, status) {
  return apiFetch(`/api/aplikasi/${aplikasiId}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function getRekomendasiMitra(proyekId, limit = 10) {
  return apiFetch(`/api/rekomendasi/mitra?proyek_id=${proyekId}&limit=${limit}`);
}

export async function kirimPesan(penerimaId, isiPesan) {
  return apiFetch("/api/pesan", {
    method: "POST",
    body: JSON.stringify({
      penerima_id: Number(penerimaId),
      isi_pesan: isiPesan,
    }),
  });
}

export async function getPercakapan() {
  return apiFetch("/api/pesan");
}

export async function getRiwayatPesan(userId, limit = 50, before = null) {
  const query = new URLSearchParams();
  if (limit) query.set("limit", limit);
  if (before) query.set("before", before);
  const qs = query.toString();
  return apiFetch(`/api/pesan/${userId}${qs ? `?${qs}` : ""}`);
}

export async function getProfilPengguna(userId) {
  return apiFetch(`/api/pengguna/${userId}`);
}

export async function getNotifikasi(unread = false, limit = 50) {
  const query = new URLSearchParams();
  if (unread) query.set("unread", "true");
  if (limit) query.set("limit", limit);
  const qs = query.toString();
  return apiFetch(`/api/notifikasi${qs ? `?${qs}` : ""}`);
}

export async function tandaiNotifikasiDibaca(notifikasiId) {
  return apiFetch(`/api/notifikasi/${notifikasiId}`, {
    method: "PATCH",
  });
}

export async function tandaiSemuaNotifikasiDibaca() {
  return apiFetch("/api/notifikasi", {
    method: "PATCH",
  });
}
