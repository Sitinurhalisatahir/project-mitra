import { createSwaggerSpec } from "next-swagger-doc";

const ref = (n) => ({ $ref: `#/components/schemas/${n}` });
const err = (description) => ({
  description,
  content: { "application/json": { schema: ref("Error") } },
});

export const getApiDocs = () =>
  createSwaggerSpec({
    apiFolder: "src/app/api",
    definition: {
      openapi: "3.0.3",
      info: {
        title: "Mitra Proyek API",
        version: "1.0.0",
        description:
          "Klik Authorize lalu isi token dari POST /api/auth/login (tanpa kata 'Bearer').",
      },
      servers: [{ url: "/" }],
      tags: [
        { name: "Auth" }, { name: "Profil" }, { name: "Pengguna" }, { name: "Mitra" },
        { name: "Proyek" }, { name: "Aplikasi" }, { name: "Rekomendasi" },
        { name: "Pesan" }, { name: "Notifikasi" }, { name: "Tag" }, { name: "Admin" },
      ],
      components: {
        securitySchemes: {
          bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
        },
        parameters: {
          Id: { in: "path", name: "id", required: true, schema: { type: "integer" } },
          Page: { in: "query", name: "page", schema: { type: "integer", default: 1, minimum: 1 } },
          Limit: { in: "query", name: "limit", schema: { type: "integer", default: 20, minimum: 1 } },
        },
        responses: {
          BadRequest: err("Input tidak valid"),
          Unauthorized: err("Belum login / token tidak valid"),
          Forbidden: err("Tidak punya akses (bukan admin / bukan pemilik / belum diverifikasi)"),
          NotFound: err("Data tidak ditemukan"),
          Conflict: err("Konflik status data"),
        },
        schemas: {
          Error: {
            type: "object",
            properties: { error: { type: "string", example: "Pengguna tidak ditemukan" } },
          },
          Meta: {
            type: "object",
            additionalProperties: true,
            properties: {
              page: { type: "integer" },
              limit: { type: "integer" },
              total: { type: "integer" },
            },
          },
          AuthUser: {
            type: "object",
            properties: {
              pengguna_id: { type: "integer" },
              nim: { type: "string" },
              nama: { type: "string" },
              email: { type: "string", format: "email" },
              role: { type: "string", enum: ["mahasiswa", "admin"] },
              is_verified: { type: "boolean" },
            },
          },
          Pengguna: {
            allOf: [
              ref("AuthUser"),
              {
                type: "object",
                properties: {
                  jurusan: { type: "string", nullable: true },
                  angkatan: { type: "integer", nullable: true },
                  created_at: { type: "string", format: "date-time" },
                },
              },
            ],
          },
          PenggunaAdmin: { $ref: "#/components/schemas/Pengguna" },
          ProfilLengkap: {
            type: "object",
            additionalProperties: true,
            properties: {
              pengguna_id: { type: "integer" },
              nim: { type: "string" },
              nama: { type: "string" },
              email: { type: "string" },
              jurusan: { type: "string", nullable: true },
              angkatan: { type: "integer", nullable: true },
              ketersediaan_waktu: { type: "string", nullable: true },
              profil_publik: { type: "boolean" },
              tags: { type: "array", items: { type: "object", additionalProperties: true } },
            },
          },
          ProfilInput: {
            type: "object",
            properties: {
              nama: { type: "string", maxLength: 100 },
              jurusan: { type: "string", maxLength: 100 },
              angkatan: { type: "integer" },
              ketersediaan_waktu: { type: "string", maxLength: 100 },
              profil_publik: { type: "boolean" },
              tags: {
                type: "array",
                items: {
                  type: "object",
                  required: ["tag_id"],
                  properties: {
                    tag_id: { type: "integer", minimum: 1 },
                    level: { type: "string", enum: ["pemula", "menengah", "mahir"] },
                  },
                },
              },
            },
          },
          Tag: {
            type: "object",
            properties: {
              tag_id: { type: "integer" },
              nama_tag: { type: "string" },
              jenis: { type: "string", enum: ["skill", "minat"] },
              kategori: { type: "string", nullable: true },
            },
          },
          TagInput: {
            type: "object",
            required: ["nama_tag", "jenis"],
            properties: {
              nama_tag: { type: "string", maxLength: 100 },
              jenis: { type: "string", enum: ["skill", "minat"] },
              kategori: { type: "string", maxLength: 50 },
            },
          },
          TagUpdate: {
            type: "object",
            properties: {
              nama_tag: { type: "string", maxLength: 100 },
              jenis: { type: "string", enum: ["skill", "minat"] },
              kategori: { type: "string", maxLength: 50 },
            },
          },
          Proyek: {
            type: "object",
            properties: {
              proyek_id: { type: "integer" },
              pemilik_id: { type: "integer" },
              pemilik_nama: { type: "string" },
              judul: { type: "string" },
              deskripsi: { type: "string", nullable: true },
              kategori: { type: "string", nullable: true },
              slot_dibutuhkan: { type: "integer" },
              slot_terisi: { type: "integer" },
              deadline: { type: "string", format: "date", nullable: true },
              status: { type: "string", enum: ["buka", "ditutup", "selesai"] },
              created_at: { type: "string", format: "date-time" },
              tags: { type: "array", items: { type: "object", additionalProperties: true } },
            },
          },
         
          ProyekInput: {
            type: "object",
            required: ["judul"],
            properties: {
              judul: { type: "string" },
              deskripsi: { type: "string" },
              kategori: { type: "string" },
              slot_dibutuhkan: { type: "integer", minimum: 1, default: 1 },
              deadline: { type: "string", format: "date" },
              tag_ids: { type: "array", items: { type: "integer" } },
            },
          },
          ProyekUpdate: {
            type: "object",
            properties: {
              judul: { type: "string" },
              deskripsi: { type: "string" },
              kategori: { type: "string" },
              slot_dibutuhkan: { type: "integer", minimum: 1 },
              deadline: { type: "string", format: "date" },
              tag_ids: { type: "array", items: { type: "integer" } },
              status: { type: "string", enum: ["buka", "ditutup", "selesai"] },
            },
          },
          Aplikasi: {
            type: "object",
            properties: {
              aplikasi_id: { type: "integer" },
              proyek_id: { type: "integer" },
              pelamar_id: { type: "integer" },
              status: { type: "string", enum: ["pending", "diterima", "ditolak"] },
              pesan: { type: "string", nullable: true },
              applied_at: { type: "string", format: "date-time" },
            },
          },
          Notifikasi: {
            type: "object",
            properties: {
              notifikasi_id: { type: "integer" },
              tipe: { type: "string", example: "status_lamaran" },
              isi: { type: "string" },
              is_read: { type: "boolean" },
              created_at: { type: "string", format: "date-time" },
            },
          },
          Pesan: {
            type: "object",
            properties: {
              pesan_id: { type: "integer" },
              pengirim_id: { type: "integer" },
              penerima_id: { type: "integer" },
              isi_pesan: { type: "string" },
              sent_at: { type: "string", format: "date-time" },
              is_read: { type: "boolean" },
            },
          },
        },
      },
    },
  });
