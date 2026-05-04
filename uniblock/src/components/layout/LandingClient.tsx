"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import { buttonVariants } from "@/components/ui/button";

export default function LandingClient() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative h-[90vh] flex items-center justify-center overflow-hidden border-b-2 border-black bg-white">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          
          <div className="container mx-auto px-8 relative z-10 text-center">
            <div className="mb-8 inline-block animate-fade-in">
              <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-accent border-2 border-accent px-6 py-2">
                Kampüs Haber Ağı v1.0
              </span>
            </div>
            <h1 className="font-heading text-[clamp(60px,12vw,140px)] font-black leading-[0.9] tracking-tighter text-black mb-8 lowercase">
              bilgiye <span className="text-accent">blok</span>lanma.
            </h1>
            <p className="max-w-[700px] mx-auto text-[18px] md:text-[20px] leading-relaxed text-gray-600 mb-12 font-medium">
              Üniversitendeki kulüpler, akademik duyurular ve kampüs yaşamı tek bir ızgarada. 
              Minimalist, hızlı ve tamamen sana özel.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                href="/register" 
                className={cn(
                  buttonVariants(),
                  "w-full sm:w-auto h-14 px-12 rounded-none bg-black text-white hover:bg-accent transition-all duration-300 text-[13px] font-bold tracking-widest uppercase shadow-[8px_8px_0px_0px_rgba(5,150,105,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 flex items-center justify-center"
                )}
              >
                Hemen Katıl
              </Link>
              <Link 
                href="/news" 
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full sm:w-auto h-14 px-12 rounded-none border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300 text-[13px] font-bold tracking-widest uppercase flex items-center justify-center"
                )}
              >
                Haberleri Keşfet
              </Link>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
            <span className="text-[9px] font-black tracking-[0.4em] uppercase text-gray-400">Keşfet</span>
            <div className="w-[1.5px] h-12 bg-gradient-to-b from-accent to-transparent"></div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 px-8 bg-white border-b-2 border-black">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-center gap-4 mb-16">
              <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-accent">
                02 — ÖZELLİKLER
              </span>
              <div className="flex-1 h-[1px] bg-gray-200"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              <div className="flex flex-col justify-center">
                <h2 className="font-heading text-[clamp(48px,10vw,90px)] font-black leading-[0.85] tracking-tighter text-black mb-8 lowercase">
                  neden <br/> <span className="text-accent underline decoration-[6px] underline-offset-[12px]">uniblock?</span>
                </h2>
                <p className="text-[18px] md:text-[20px] text-gray-600 leading-relaxed max-w-[500px] font-medium">
                  Geleneksel duyuru panolarının karmaşasından kurtulun. Sizin için önemli olan her şeyi tek bir ızgarada birleştiriyoruz.
                </p>
              </div>

              <div className="space-y-16">
                {[
                  { t: "Kişiselleştirilmiş Akış", d: "Sadece senin fakülten ve ilgi alanlarına göre filtrelenmiş, gürültüden arındırılmış içerik.", n: "01" },
                  { t: "Minimalist / Editorial", d: "Gözü yormayan, okuma odaklı ve modern bir arayüz deneyimi sunar.", n: "02" },
                  { t: "Anlık Etkileşim", d: "Haberlere, kulüplere ve etkinliklere anında erişim, başvuru ve sosyal etkileşim.", n: "03" }
                ].map((item, i) => (
                  <div key={i} className="group relative pl-20">
                    <span className="absolute left-0 top-0 font-heading text-5xl font-black text-gray-300 group-hover:text-accent transition-all duration-500 opacity-70 group-hover:opacity-100">
                      {item.n}
                    </span>
                    <h3 className="font-heading text-2xl font-extrabold mb-4 uppercase tracking-tighter group-hover:text-accent transition-colors">
                      {item.t}
                    </h3>
                    <p className="text-gray-500 leading-relaxed text-[16px] max-w-[450px]">
                      {item.d}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
