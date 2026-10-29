import { apiFetch } from "./client";

export async function getAdminMe() {
  return await apiFetch("/api/auth/me");
}

export async function getStatistik() {
  return await apiFetch("/api/admin/statistik");
}

export async function getPenggunaMenunggu(limit = 5) {
  return await apiFetch(`/api/admin/pengguna?is_verified=false&limit=${limit}`);
}

export async function verifikasiPengguna(id) {
  return await apiFetch(`/api/admin/pengguna/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ is_verified: true }),
  });
}

export async function getTags() {
  return await apiFetch("/api/tag");
}

export async function createTag(payload) {
  return await apiFetch("/api/tag", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateTag(id, payload) {
  return await apiFetch(`/api/tag/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteTag(id) {
  return await apiFetch(`/api/tag/${id}`, {
    method: "DELETE",
  });
}

export async function getSemuaPengguna(params = {}) {
  const sp = new URLSearchParams();
  if (params.is_verified !== undefined && params.is_verified !== null && params.is_verified !== "all") {
    sp.set("is_verified", String(params.is_verified));
  }
  if (params.q) {
    sp.set("q", params.q);
  }
  if (params.page) {
    sp.set("page", String(params.page));
  }
  sp.set("limit", String(params.limit || 100));

  const qs = sp.toString();
  return await apiFetch(`/api/admin/pengguna${qs ? `?${qs}` : ""}`);
}
