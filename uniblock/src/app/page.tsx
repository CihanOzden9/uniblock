import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar - Fixed & Minimal */}
      <header className="fixed top-0 w-full h-16 bg-white z-50 flex items-center justify-between px-8 border-b-2 border-accent transition-colors duration-300">
        <div className="font-heading font-extrabold text-[18px] tracking-tight">
          Uni<span className="text-accent">.</span>Block
        </div>
        <nav className="flex items-center gap-6">
          <Link href="/login" className="text-[13px] font-medium tracking-[0.05em] uppercase hover:text-accent transition-colors">
            Giriş Yap
          </Link>
          <Link href="/register">
            <Button className="px-[36px] py-[14px] text-[12px] font-semibold tracking-[0.15em] uppercase bg-accent text-white hover:bg-black hover:text-white transition-colors rounded-none">
              Kayıt Ol
            </Button>
          </Link>
        </nav>
      </header>
      
      {/* Hero Section */}
      <main 
        className="flex-1 flex flex-col items-center justify-center text-center px-8 relative"
        style={{
          minHeight: "100vh",
          paddingTop: "64px",
          backgroundImage: `
            linear-gradient(rgba(5,150,105,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(5,150,105,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px"
        }}
      >
        <div className="max-w-[900px] w-full flex flex-col items-center pb-24">
          <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-accent mb-6 bg-accent/10 px-4 py-1 border border-accent/20">
            01 — KAMPÜS AĞI
          </span>
          <h1 className="font-heading text-[clamp(40px,10vw,120px)] leading-[1.05] tracking-tight font-light mb-8">
            Kampüsü <br />
            <span className="font-extrabold text-accent">Keşfet</span>
          </h1>
          <p className="text-[16px] leading-[1.9] text-[#525252] max-w-[600px] mb-12">
            Öğrenciler, kulüpler, proje takımları ve işletmeleri bir araya getiren
            minimalist, veri odaklı ekosisteme katılın.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <Link href="/register">
              <Button className="px-[36px] h-14 text-[12px] font-semibold tracking-[0.15em] uppercase bg-accent text-white hover:bg-black transition-colors rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                Hemen Başla
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" className="px-[36px] h-14 text-[12px] font-semibold tracking-[0.15em] uppercase border-accent text-accent hover:bg-accent hover:text-white transition-colors rounded-none">
                Nasıl Çalışır?
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold animate-pulse">Aşağı Kaydır</span>
          <div className="w-[2px] h-[40px] bg-accent opacity-50"></div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-black text-[#525252] border-t-4 border-accent px-8 py-12">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="font-heading font-extrabold text-[16px] text-white">
            Uni<span className="text-accent">.</span>Block
          </div>
          <p className="text-[11px] uppercase tracking-[0.1em] text-accent">
            © 2026 Tüm Hakları Saklıdır.
          </p>
        </div>
      </footer>
    </div>
  );
}
