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
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[88vh] flex flex-col items-center justify-center overflow-hidden bg-surface-container-low">
          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle at 2px 2px, var(--edu-blue) 1px, transparent 0)", backgroundSize: "24px 24px" }}
          />

          <div className="container mx-auto px-8 relative z-10 text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary-fixed px-4 py-1.5">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-[12px] font-semibold tracking-wide text-primary">
                Kampüs Haber Ağı — v1.0
              </span>
            </div>

            <h1 className="font-heading text-[clamp(40px,8vw,72px)] font-bold leading-[1.05] tracking-tight text-on-surface mb-6">
              Kampüsünde{" "}
              <span className="relative inline-block text-primary">
                neler oluyor?
                <span className="absolute -bottom-1 left-0 right-0 h-[6px] bg-accent/30 rounded-full" />
              </span>
            </h1>

            <p className="max-w-[620px] mx-auto text-[18px] leading-[1.7] text-on-surface-variant mb-10">
              Üniversitendeki kulüpler, akademik duyurular ve kampüs yaşamı tek bir platformda. Topluluklara katıl, etkinlikleri keşfet ve sesini duyur.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className={cn(
                  buttonVariants(),
                  "w-full sm:w-auto h-14 px-10 rounded-full text-[15px] font-semibold shadow-ambient"
                )}
              >
                Hemen Başla <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full sm:w-auto h-14 px-10 rounded-full border-outline-variant bg-surface text-on-surface hover:bg-surface-container-high text-[15px] font-semibold"
                )}
              >
                Giriş Yap
              </Link>
            </div>
          </div>
        </section>

        {/* Ticker Bar */}
        <div className="bg-primary overflow-hidden py-3">
          <div className="flex animate-[ticker_18s_linear_infinite] gap-0 whitespace-nowrap">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-6 px-8 text-[12px] font-semibold tracking-wide text-primary-foreground">
                {item}
                <span className="w-1.5 h-1.5 bg-primary-foreground/40 rounded-full" />
              </span>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <section className="py-20 px-8 bg-background">
          <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-gutter">
            {[
              { icon: Users, value: "500+", label: "Aktif Öğrenci" },
              { icon: Shield, value: "30+", label: "Kulüp" },
              { icon: Calendar, value: "120+", label: "Etkinlik" },
              { icon: Newspaper, value: "1000+", label: "Duyuru" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center justify-center py-8 px-6 text-center rounded-xl bg-card border border-outline-variant shadow-ambient hover:shadow-ambient-lg hover:-translate-y-0.5 transition-all">
                <div className="w-11 h-11 rounded-full bg-primary-fixed flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className="font-heading text-4xl font-bold tracking-tight text-on-surface">{value}</span>
                <span className="text-[13px] font-medium text-on-surface-variant mt-1">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-28 px-8 bg-surface-container-low">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-center gap-4 mb-16">
              <span className="text-[12px] font-semibold tracking-wide text-primary uppercase">02 — Özellikler</span>
              <div className="flex-1 h-px bg-outline-variant" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <h2 className="font-heading text-[clamp(34px,6vw,56px)] font-bold leading-[1.05] tracking-tight text-on-surface mb-6">
                  Neden{" "}
                  <span className="text-primary underline decoration-accent decoration-4 underline-offset-[8px]">UniBlock?</span>
                </h2>
                <p className="text-[17px] text-on-surface-variant leading-[1.75] max-w-[480px]">
                  Geleneksel duyuru panolarının karmaşasından kurtulun. Sizin için önemli olan her şeyi tek bir platformda birleştiriyoruz.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  { n: "01", t: "Kişiselleştirilmiş Akış", d: "Sadece senin fakülten ve ilgi alanlarına göre filtrelenmiş, gürültüden arındırılmış içerik." },
                  { n: "02", t: "Modern & Okunaklı", d: "Gözü yormayan, okuma odaklı ve modern bir arayüz deneyimi sunar." },
                  { n: "03", t: "Anlık Etkileşim", d: "Kulüplere, etkinliklere ve duyurulara anında erişim, başvuru ve sosyal etkileşim." },
                ].map((item) => (
                  <div key={item.n} className="group flex gap-5 rounded-xl bg-card border border-outline-variant p-6 shadow-ambient hover:shadow-ambient-lg hover:-translate-y-0.5 transition-all">
                    <span className="font-heading text-[28px] font-bold leading-none text-primary shrink-0">
                      {item.n}
                    </span>
                    <div>
                      <h3 className="font-heading text-[18px] font-semibold tracking-tight mb-1.5 text-on-surface">
                        {item.t}
                      </h3>
                      <p className="text-[15px] text-on-surface-variant leading-relaxed">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-28 px-8 bg-background">
          <div className="max-w-[900px] mx-auto text-center rounded-xl bg-surface-container-low border border-outline-variant p-12 md:p-16 shadow-ambient">
            <span className="text-[12px] font-semibold tracking-wide text-primary uppercase">03 — Katıl</span>
            <h2 className="font-heading text-[clamp(30px,5vw,48px)] font-bold leading-[1.1] tracking-tight text-on-surface mt-4 mb-6">
              Kampüs ağına <span className="text-primary">dahil ol.</span>
            </h2>
            <p className="text-[17px] text-on-surface-variant max-w-[520px] mx-auto leading-[1.7] mb-10">
              Öğrenciysen akışa katıl. Kulüp başkanıysan topluluğunu büyüt.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-5 mb-10">
              {["Ücretsiz", "Kampüse Özel", "Hızlı Kurulum", "Güvenli"].map((tag) => (
                <div key={tag} className="flex items-center gap-2 text-[14px] font-medium text-on-surface-variant">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  {tag}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className={cn(
                  buttonVariants(),
                  "h-14 px-10 rounded-full text-[15px] font-semibold shadow-ambient"
                )}
              >
                Öğrenci Olarak Kaydol
              </Link>
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-14 px-10 rounded-full border-outline-variant bg-surface text-on-surface hover:bg-surface-container-high text-[15px] font-semibold"
                )}
              >
                Kulüp Başvurusu Yap
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-card px-8 py-12 border-t border-outline-variant">
          <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="font-heading font-extrabold text-[22px] tracking-tight text-primary">
              Uni<span className="text-accent">.</span>Block
            </div>
            <div className="flex gap-8 text-[14px] font-medium text-on-surface-variant">
              <Link href="#" className="hover:text-primary transition-colors">Hakkımızda</Link>
              <Link href="#" className="hover:text-primary transition-colors">İletişim</Link>
              <Link href="#" className="hover:text-primary transition-colors">Gizlilik</Link>
            </div>
            <p className="text-[13px] text-on-surface-variant">
              © 2026 Kampüs Haber Ağı
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
