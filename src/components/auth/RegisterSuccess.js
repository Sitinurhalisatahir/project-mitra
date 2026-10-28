import AuthButton from "./AuthButton";

export default function RegisterSuccess() {
  return (
    <div className="relative z-10 flex flex-col items-center text-center gap-4">
      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#4F46E5] text-2xl shadow-sm">
        <i className="fa-solid fa-check"></i>
      </div>
      <p className="text-sm text-indigo-100 leading-relaxed">
        Akun kamu sudah dibuat. Akun akan diverifikasi oleh admin sebelum dapat
        digunakan, jadi kamu belum bisa login sampai verifikasi selesai.
      </p>
      <div className="w-full">
        <AuthButton href="/login">Ke Halaman Login</AuthButton>
      </div>
    </div>
  );
}