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
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar user={user} />

      <main className="flex-1 pt-20">
        <section className="py-12 px-8 border-b-2 border-accent/10">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-accent">
                03 — RESMİ HABERLER
              </span>
              <div className="flex-1 h-[1px] bg-gray-200"></div>
            </div>
            
            <h1 className="font-heading text-[clamp(36px,5vw,64px)] font-extrabold tracking-tighter leading-[1.05] mb-4">
              {user.faculty || "Kampüs"} Gündemi
            </h1>
            <p className="text-[15px] leading-[1.6] text-gray-600 max-w-[700px] mb-8">
              {user.department || "Bölümünüzden"} ve fakültenizden en güncel akademik haberler.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 border-2 border-black bg-black gap-[1px]">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`py-3 text-[10px] font-bold tracking-[0.15em] uppercase transition-all duration-200 ${activeCategory === cat
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-gray-100"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-100 py-12 px-8 min-h-[400px]">
          <div className="max-w-[1200px] mx-auto w-full">
            {filteredNews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-black border-2 border-black gap-[1px]">
                {filteredNews.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => setSelectedNews(item)}
                    className="bg-white p-8 flex flex-col min-h-[320px] transition-all hover:bg-gray-50 group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-accent"></div>
                        <span className="text-[10px] font-semibold tracking-[0.15em] text-gray-400 uppercase">{item.category}</span>
                      </div>
                      <span className="text-[10px] font-medium tracking-[0.1em] text-gray-400 uppercase">
                        {new Date(item.createdAt).toLocaleDateString("tr-TR")}
                      </span>
                    </div>
                    <div className="h-[1px] w-full bg-gray-100 mb-5"></div>
                    <h3 className="font-heading text-[17px] font-extrabold tracking-tight leading-[1.4] mb-3 group-hover:text-accent transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[13px] leading-[1.6] text-gray-600 mb-8 line-clamp-3">
                      {item.content.substring(0, 150)}...
                    </p>
                    
                    <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <Heart className="w-4 h-4 text-gray-400" />
                          <span className="text-[11px] font-bold text-gray-400">{item.likes?.length || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MessageSquare className="w-4 h-4 text-gray-400" />
                          <span className="text-[11px] font-bold text-gray-400">{item.comments?.length || 0}</span>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-100 transition-colors">
                        <Share2 className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border-2 border-black p-20 text-center">
                <div className="w-16 h-16 bg-accent/10 border-2 border-accent mx-auto mb-6 flex items-center justify-center">
                  <span className="text-2xl font-bold text-accent">!</span>
                </div>
                <h3 className="font-heading text-2xl font-extrabold mb-2 uppercase tracking-tight">İçerik Bulunamadı</h3>
                <p className="text-gray-400 uppercase tracking-widest text-xs font-semibold">
                  Bu kategoride henüz bir duyuru veya haber paylaşılmamış.
                </p>
                <Button 
                  onClick={() => setActiveCategory("Tümü")}
                  variant="outline" 
                  className="mt-8 rounded-none border-black hover:bg-black hover:text-white uppercase tracking-widest text-[10px] font-bold"
                >
                  Tüm Haberlere Dön
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Sheet open={!!selectedNews} onOpenChange={() => setSelectedNews(null)}>
        <SheetContent side="right" className="w-full sm:max-w-[600px] p-0 rounded-none border-l-2 border-black overflow-y-auto">
          {selectedNews && (
            <div className="flex flex-col h-full">
              <SheetHeader className="p-10 border-b-2 border-gray-100 text-left">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-accent text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                    {selectedNews.category}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {new Date(selectedNews.createdAt).toLocaleDateString("tr-TR")}
                  </span>
                </div>
                <SheetTitle className="font-heading text-3xl font-extrabold tracking-tighter leading-tight">
                  {selectedNews.title}
                </SheetTitle>
                <SheetDescription className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] pt-4">
                  Yayınlayan: {selectedNews.source || selectedNews.club?.name || selectedNews.team?.name}
                </SheetDescription>
              </SheetHeader>

              <div className="p-10">
                <div className="prose prose-slate max-w-none">
                  <p className="text-[17px] leading-[1.8] text-gray-700 whitespace-pre-wrap">
                    {selectedNews.content}
                  </p>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <footer className="bg-black text-white border-t-4 border-accent px-8 py-12 shrink-0">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="font-heading font-extrabold text-[20px]">
            Uni<span className="text-accent">.</span>Block
          </div>
          <div className="flex gap-8 text-[11px] font-bold tracking-[0.2em] uppercase text-gray-500">
            <Link href="#" className="hover:text-accent">Hakkımızda</Link>
            <Link href="#" className="hover:text-accent">İletişim</Link>
            <Link href="#" className="hover:text-accent">Gizlilik</Link>
          </div>
          <p className="text-[11px] uppercase tracking-[0.1em] text-accent font-semibold">
            © 2026 KAMPÜS HABER AĞI
          </p>
        </div>
      </footer>

      <MessagingOverlay />
    </div>
  );
}
