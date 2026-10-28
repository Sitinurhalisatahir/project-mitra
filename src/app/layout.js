import "./globals.css";

export const metadata = {
  title: "SkillMatch - Campus Hub",
  description: "Platform Pencarian Mitra Proyek Mahasiswa",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        {/* Google Fonts: Plus Jakarta Sans */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Font Awesome untuk ikon form */}
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#F8FAFC] text-slate-800 min-h-screen flex items-center justify-center p-0 m-0 overflow-x-hidden font-sans">
        {children}
      </body>
    </html>
  );
}