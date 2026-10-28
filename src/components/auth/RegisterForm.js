"use client";

import { useState } from "react";
import Link from "next/link";
import AuthCard from "./AuthCard";
import AuthInput from "./AuthInput";
import PasswordInput from "./PasswordInput";
import AuthButton from "./AuthButton";
import AuthNotice from "./AuthNotice";
import FormAlert from "./FormAlert";
import RegisterSuccess from "./RegisterSuccess";
import { register, ApiClientError } from "@/lib/frontend/api/auth";
import { validateRegister } from "@/lib/frontend/validators/auth";

export default function RegisterForm() {
  const [values, setValues] = useState({ nim: "", nama: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setFormError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    const clean = {
      nim: values.nim.trim(),
      nama: values.nama.trim(),
      email: values.email.trim(),
      password: values.password,
    };

    const found = validateRegister(clean);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }

    setLoading(true);
    setFormError("");
    try {
      await register(clean);
      setSuccess(true);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setErrors(err.fieldErrors);
        if (Object.keys(err.fieldErrors).length === 0) setFormError(err.message);
      } else {
        setFormError("Terjadi kesalahan. Coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <AuthCard
        title="Pendaftaran Berhasil"
        subtitle="Satu langkah lagi sebelum kamu bisa mencari tim"
      >
        <RegisterSuccess />
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Buat Akun Baru"
      subtitle="Daftarkan diri dengan identitas universitas kamu untuk mencari tim"
    >
      {/* Registration Form */}
      <form
        className="relative z-10 flex flex-col gap-4"
        onSubmit={handleSubmit}
        noValidate
      >
        <FormAlert message={formError} />

        <AuthInput
          icon="fa-solid fa-id-card"
          autoComplete="off"
          id="nim"
          name="nim"
          placeholder="NIM (Nomor Induk Mahasiswa)"
          required
          type="text"
          value={values.nim}
          onChange={handleChange}
          error={errors.nim}
        />

        <AuthInput
          icon="fa-solid fa-user"
          autoComplete="name"
          id="nama"
          name="nama"
          placeholder="Nama Lengkap"
          required
          type="text"
          value={values.nama}
          onChange={handleChange}
          error={errors.nama}
        />

        <AuthInput
          icon="fa-solid fa-envelope"
          autoComplete="email"
          id="email"
          name="email"
          placeholder="Email"
          required
          type="email"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
        />

        <PasswordInput
          autoComplete="new-password"
          id="password"
          name="password"
          placeholder="Password"
          required
          value={values.password}
          onChange={handleChange}
          error={errors.password}
        />

        <AuthNotice>Akun akan diverifikasi oleh admin sebelum dapat digunakan</AuthNotice>

        <AuthButton loading={loading}>Daftar</AuthButton>

        {/* Login Link */}
        <div className="text-center pt-2">
          <Link
            className="text-sm text-indigo-100 hover:text-white underline underline-offset-4 decoration-indigo-300/70 hover:decoration-white transition-colors duration-150 inline-block"
            href="/login"
          >
            Sudah punya akun? Login di sini
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}