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

export async function getPelamarProyek(proyekId, status = "pending") {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return apiFetch(`/api/proyek/${proyekId}/aplikasi${query}`);
}

export async function getPercakapan() {
  return apiFetch("/api/pesan");
}

export async function getNotifikasi(unread = true) {
  const query = unread ? "?unread=true" : "";
  return apiFetch(`/api/notifikasi${query}`);
}
