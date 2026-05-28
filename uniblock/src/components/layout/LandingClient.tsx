"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import { buttonVariants } from "@/components/ui/button";
import { Users, Newspaper, Calendar, Shield, ArrowRight, CheckCircle } from "lucide-react";

const TICKER_ITEMS = [
  "Üniversite Kulüpleri",
  "Etkinlik Takibi",
  "Duyuru Akışı",
  "Anket & Katılım",
  "Kulüp Yönetimi",
  "Kampüs Haberleri",
  "Topluluk Ağı",
  "Akademik Duyurular",
];

export default function LandingClient() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden border-b-2 border-black bg-white">
          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "32px 32px" }}
          />

          <div className="container mx-auto px-8 relative z-10 text-center">
            <div className="mb-8 inline-flex items-center gap-3">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-[11px] font-bold tracking-[0.35em] uppercase text-accent">
                Kampüs Haber Ağı — v1.0
              </span>
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            </div>

            <h1 className="font-heading text-[clamp(56px,11vw,132px)] font-black leading-[0.88] tracking-tighter text-black mb-8 lowercase">
              bilgiye{" "}
              <span className="relative inline-block">
                <span className="text-accent">blok</span>
                <span className="absolute -bottom-2 left-0 right-0 h-[6px] bg-accent/20" />
              </span>
              lanma.
            </h1>

            <p className="max-w-[620px] mx-auto text-[18px] leading-[1.7] text-gray-500 mb-12 font-medium">
              Üniversitendeki kulüpler, akademik duyurular ve kampüs yaşamı tek bir platformda.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className={cn(
                  buttonVariants(),
                  "w-full sm:w-auto h-14 px-12 rounded-none bg-black text-white hover:bg-accent transition-all duration-300 text-[12px] font-black tracking-[0.2em] uppercase shadow-[6px_6px_0px_0px_rgba(5,150,105,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
                )}
              >
                Hemen Başla <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full sm:w-auto h-14 px-12 rounded-none border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-200 text-[12px] font-black tracking-[0.2em] uppercase"
                )}
              >
                Giriş Yap
              </Link>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-[9px] font-black tracking-[0.4em] uppercase text-gray-300">Keşfet</span>
            <div className="w-px h-10 bg-gradient-to-b from-accent to-transparent" />
          </div>
        </section>

        {/* Ticker Bar */}
        <div className="bg-accent overflow-hidden py-3 border-y-2 border-black">
          <div className="flex animate-[ticker_18s_linear_infinite] gap-0 whitespace-nowrap">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-6 px-8 text-[11px] font-black uppercase tracking-[0.25em] text-white">
                {item}
                <span className="w-1.5 h-1.5 bg-white/40 rounded-full" />
              </span>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <section className="py-16 px-8 bg-black text-white border-b-2 border-black">
          <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/10">
            {[
              { icon: Users, value: "500+", label: "Aktif Öğrenci" },
              { icon: Shield, value: "30+", label: "Kulüp" },
              { icon: Calendar, value: "120+", label: "Etkinlik" },
              { icon: Newspaper, value: "1000+", label: "Duyuru" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center justify-center py-8 px-6 text-center group hover:bg-white/[0.03] transition-colors">
                <Icon className="w-5 h-5 text-accent mb-3" />
                <span className="font-heading text-4xl font-black tracking-tighter text-white">{value}</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mt-1">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 px-8 bg-white border-b-2 border-black">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-center gap-4 mb-20">
              <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-accent">02 — Özellikler</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div>
                <h2 className="font-heading text-[clamp(44px,9vw,84px)] font-black leading-[0.88] tracking-tighter text-black mb-8 lowercase">
                  neden <br />
                  <span className="text-accent underline decoration-[5px] underline-offset-[10px]">uniblock?</span>
                </h2>
                <p className="text-[17px] text-gray-500 leading-[1.75] max-w-[480px]">
                  Geleneksel duyuru panolarının karmaşasından kurtulun. Sizin için önemli olan her şeyi tek bir platformda birleştiriyoruz.
                </p>
              </div>

              <div className="space-y-12">
                {[
                  { n: "01", t: "Kişiselleştirilmiş Akış", d: "Sadece senin fakülten ve ilgi alanlarına göre filtrelenmiş, gürültüden arındırılmış içerik." },
                  { n: "02", t: "Minimalist & Editorial", d: "Gözü yormayan, okuma odaklı ve modern bir arayüz deneyimi sunar." },
                  { n: "03", t: "Anlık Etkileşim", d: "Kulüplere, etkinliklere ve duyurulara anında erişim, başvuru ve sosyal etkileşim." },
                ].map((item) => (
                  <div key={item.n} className="group relative pl-16 cursor-default">
                    <span className="absolute left-0 top-0 font-heading text-[42px] font-black leading-none text-gray-100 group-hover:text-accent transition-all duration-300">
                      {item.n}
                    </span>
                    <h3 className="font-heading text-[20px] font-extrabold uppercase tracking-tight mb-2 group-hover:text-accent transition-colors">
                      {item.t}
                    </h3>
                    <p className="text-[15px] text-gray-500 leading-relaxed">{item.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-8 bg-[#f5f5f5] border-b-2 border-black">
          <div className="max-w-[1200px] mx-auto text-center">
            <div className="flex items-center justify-center gap-4 mb-10">
              <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-accent">03 — Katıl</span>
            </div>
            <h2 className="font-heading text-[clamp(40px,8vw,80px)] font-black leading-[0.9] tracking-tighter text-black mb-6 lowercase">
              kampüs ağına <br /> <span className="text-accent">dahil ol.</span>
            </h2>
            <p className="text-[17px] text-gray-500 max-w-[520px] mx-auto leading-[1.7] mb-12">
              Öğrenciysen akışa katıl. Kulüp başkanıysan topluluğunu büyüt.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
              {["Ücretsiz", "Kampüse Özel", "Hızlı Kurulum", "Güvenli"].map((tag) => (
                <div key={tag} className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-600">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  {tag}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className={cn(
                  buttonVariants(),
                  "h-14 px-14 rounded-none bg-black text-white hover:bg-accent transition-all text-[12px] font-black tracking-[0.2em] uppercase shadow-[6px_6px_0px_0px_rgba(5,150,105,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
                )}
              >
                Öğrenci Olarak Kaydol
              </Link>
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-14 px-14 rounded-none border-2 border-black text-black hover:bg-black hover:text-white transition-all text-[12px] font-black tracking-[0.2em] uppercase"
                )}
              >
                Kulüp Başvurusu Yap
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black text-white px-8 py-12 border-t-4 border-accent">
          <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="font-heading font-black text-[22px] tracking-tight">
              Uni<span className="text-accent">.</span>Block
            </div>
            <div className="flex gap-8 text-[11px] font-bold tracking-[0.2em] uppercase text-white/30">
              <Link href="#" className="hover:text-accent transition-colors">Hakkımızda</Link>
              <Link href="#" className="hover:text-accent transition-colors">İletişim</Link>
              <Link href="#" className="hover:text-accent transition-colors">Gizlilik</Link>
            </div>
            <p className="text-[11px] uppercase tracking-widest text-accent font-bold">
              © 2026 Kampüs Haber Ağı
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
