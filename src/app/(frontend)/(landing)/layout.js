import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function LandingLayout({ children }) {
  return (
    <div className="w-full bg-surface text-on-surface antialiased">
      <Navbar />
      <main className="w-full pt-20 bg-surface min-h-[calc(100vh-200px)]">
        {children}
      </main>
      <Footer />
    </div>
  );
}