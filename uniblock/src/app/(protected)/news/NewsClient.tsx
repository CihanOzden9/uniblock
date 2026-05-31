"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Share2, User } from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "@/components/ui/sheet";
import MessagingOverlay from "@/components/shared/MessagingOverlay";

interface NewsClientProps {
  user: any;
  posts: any[];
}

const CATEGORIES = ["Tümü", "Mühendislik", "Tıp", "Ekonomi", "Kampüs"];

export default function NewsClient({ user, posts }: NewsClientProps) {
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [selectedNews, setSelectedNews] = useState<any>(null);

  const filteredNews = posts.filter(news => {
    if (activeCategory === "Tümü") return true;
    return news.source?.includes(activeCategory.toUpperCase()) || news.category?.includes(activeCategory);
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar user={user} />

      <main className="flex-1 pt-20">
        <section className="bg-surface-container-low py-14 px-8 border-b border-outline-variant">
          <div className="max-w-[1200px] mx-auto">
            <span className="text-[12px] font-semibold tracking-wide uppercase text-primary">
              Resmî Haberler
            </span>

            <h1 className="font-heading text-[clamp(32px,4.5vw,52px)] font-bold tracking-tight leading-[1.1] mt-3 mb-3 text-on-surface">
              {user.faculty || "Kampüs"} Gündemi
            </h1>
            <p className="text-[16px] leading-[1.6] text-on-surface-variant max-w-[700px] mb-7">
              {user.department || "Bölümünüzden"} ve fakültenizden en güncel akademik haberler.
            </p>
            <div className="flex flex-wrap gap-2.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-[14px] font-medium transition-all duration-200 border ${activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-surface text-on-surface-variant border-outline-variant hover:bg-surface-container-high hover:text-on-surface"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 px-8 min-h-[400px]">
          <div className="max-w-[1200px] mx-auto w-full">
            {filteredNews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                {filteredNews.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedNews(item)}
                    className="bg-card rounded-xl border border-outline-variant shadow-ambient p-7 flex flex-col min-h-[320px] transition-all hover:shadow-ambient-lg hover:-translate-y-0.5 group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[11px] font-semibold tracking-wide text-primary bg-primary-fixed px-2.5 py-1 rounded-full">{item.category}</span>
                      <span className="text-[12px] font-medium text-on-surface-variant">
                        {new Date(item.createdAt).toLocaleDateString("tr-TR")}
                      </span>
                    </div>
                    <h3 className="font-heading text-[18px] font-bold tracking-tight leading-[1.4] mb-3 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[14px] leading-[1.6] text-on-surface-variant mb-8 line-clamp-3">
                      {item.content.substring(0, 150)}...
                    </p>

                    <div className="mt-auto pt-5 border-t border-outline-variant flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <Heart className="w-4 h-4 text-on-surface-variant" />
                          <span className="text-[12px] font-semibold text-on-surface-variant">{item.likes?.length || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MessageSquare className="w-4 h-4 text-on-surface-variant" />
                          <span className="text-[12px] font-semibold text-on-surface-variant">{item.comments?.length || 0}</span>
                        </div>
                      </div>
                      <button className="p-2 rounded-full hover:bg-surface-container-high transition-colors">
                        <Share2 className="w-4 h-4 text-on-surface-variant" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-outline-variant shadow-ambient p-20 text-center">
                <div className="w-16 h-16 rounded-full bg-primary-fixed mx-auto mb-6 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">!</span>
                </div>
                <h3 className="font-heading text-2xl font-bold mb-2 tracking-tight">İçerik Bulunamadı</h3>
                <p className="text-on-surface-variant text-[15px]">
                  Bu kategoride henüz bir duyuru veya haber paylaşılmamış.
                </p>
                <Button
                  onClick={() => setActiveCategory("Tümü")}
                  variant="outline"
                  className="mt-8 rounded-full border-outline-variant text-[14px] font-semibold"
                >
                  Tüm Haberlere Dön
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Sheet open={!!selectedNews} onOpenChange={() => setSelectedNews(null)}>
        <SheetContent side="right" className="w-full sm:max-w-[600px] p-0 border-l border-outline-variant overflow-y-auto">
          {selectedNews && (
            <div className="flex flex-col h-full">
              <SheetHeader className="p-10 border-b border-outline-variant text-left">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-primary-fixed text-primary text-[11px] font-semibold px-3 py-1 rounded-full tracking-wide">
                    {selectedNews.category}
                  </span>
                  <span className="text-[12px] font-medium text-on-surface-variant">
                    {new Date(selectedNews.createdAt).toLocaleDateString("tr-TR")}
                  </span>
                </div>
                <SheetTitle className="font-heading text-3xl font-bold tracking-tight leading-tight">
                  {selectedNews.title}
                </SheetTitle>
                <SheetDescription className="text-on-surface-variant text-[13px] pt-3">
                  Yayınlayan: {selectedNews.source || selectedNews.club?.name || selectedNews.team?.name}
                </SheetDescription>
              </SheetHeader>

              <div className="p-10">
                <div className="prose prose-slate max-w-none">
                  <p className="text-[17px] leading-[1.8] text-on-surface whitespace-pre-wrap">
                    {selectedNews.content}
                  </p>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <footer className="bg-card border-t border-outline-variant px-8 py-12 shrink-0">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="font-heading font-extrabold text-[20px] text-primary">
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

      <MessagingOverlay />
    </div>
  );
}
