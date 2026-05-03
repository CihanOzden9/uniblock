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

const MOCK_NEWS = [
  {
    id: 1,
    title: "Yapay Zeka ve Geleceğin Teknolojileri Konferansı",
    excerpt: "Bilgisayar Mühendisliği bölümü tarafından düzenlenen etkinlikte sektörün öncü isimleri ağırlanacak. Yapay zekanın etik boyutlarından, kuantum hesaplamaya kadar geniş bir yelpazede sunumlar yapılacak.",
    content: "Bilgisayar Mühendisliği bölümü tarafından düzenlenen etkinlikte sektörün öncü isimleri ağırlanacak. Yapay zekanın etik boyutlarından, kuantum hesaplamaya kadar geniş bir yelpazede sunumlar yapılacak. Etkinlik 12 Mayıs tarihinde ana kampüs konferans salonunda gerçekleşecektir. Kayıtlar öğrenci portalı üzerinden yapılabilir.",
    date: "12 MAYIS 2026",
    source: "BİLGİSAYAR MÜH.",
    category: "Akademik",
    likes: 124,
    comments: 12,
  },
  {
    id: 2,
    title: "Bahar Şenliği Konser Takvimi Açıklandı",
    excerpt: "Bu yılki bahar şenliklerinde sahne alacak sanatçılar ve etkinlik programı detayları belli oldu.",
    content: "Bu yılki bahar şenliklerinde sahne alacak sanatçılar ve etkinlik programı detayları belli oldu. Konserler açık hava tiyatrosunda yapılacak ve tüm öğrencilerimiz için ücretsiz olacaktır.",
    date: "10 MAYIS 2026",
    source: "KAMPÜS YAŞAMI",
    category: "Etkinlik",
    likes: 856,
    comments: 45,
  },
  {
    id: 3,
    title: "Erasmus+ Başvuruları Başladı",
    excerpt: "2026-2027 akademik yılı değişim programları için başvurular ve dil sınavı tarihleri ilan edildi.",
    content: "2026-2027 akademik yılı değişim programları için başvurular ve dil sınavı tarihleri ilan edildi. Başvurular OBS sistemi üzerinden yapılacaktır.",
    date: "08 MAYIS 2026",
    source: "DIŞ İLİŞKİLER",
    category: "Duyuru",
    likes: 230,
    comments: 8,
  },
];

const CATEGORIES = ["Tümü", "Mühendislik", "Tıp", "Ekonomi", "Kampüs"];

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [selectedNews, setSelectedNews] = useState<any>(null);

  const user = {
    firstName: "Ece",
    lastName: "Yılmaz",
    department: "Bilgisayar Mühendisliği",
    faculty: "Mühendislik Fakültesi"
  };

  const filteredNews = MOCK_NEWS.filter(news => {
    if (activeCategory === "Tümü") return true;
    return news.source.includes(activeCategory.toUpperCase());
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

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
              {user.faculty} Gündemi
            </h1>
            <p className="text-[15px] leading-[1.6] text-gray-600 max-w-[700px] mb-8">
              {user.department} bölümü ve fakültenizden en güncel akademik haberler.
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
                      <span className="text-[10px] font-medium tracking-[0.1em] text-gray-400 uppercase">{item.date}</span>
                    </div>
                    <div className="h-[1px] w-full bg-gray-100 mb-5"></div>
                    <h3 className="font-heading text-[17px] font-extrabold tracking-tight leading-[1.4] mb-3 group-hover:text-accent transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[13px] leading-[1.6] text-gray-600 mb-8 line-clamp-3">
                      {item.excerpt}
                    </p>
                    
                    <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1.5 group/btn">
                          <Heart className="w-4 h-4 text-gray-400 group-hover/btn:text-red-500 transition-colors" />
                          <span className="text-[11px] font-bold text-gray-400 group-hover/btn:text-black">{item.likes}</span>
                        </button>
                        <button className="flex items-center gap-1.5 group/btn">
                          <MessageSquare className="w-4 h-4 text-gray-400 group-hover/btn:text-accent transition-colors" />
                          <span className="text-[11px] font-bold text-gray-400 group-hover/btn:text-black">{item.comments}</span>
                        </button>
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
                    {selectedNews.date}
                  </span>
                </div>
                <SheetTitle className="font-heading text-3xl font-extrabold tracking-tighter leading-tight">
                  {selectedNews.title}
                </SheetTitle>
                <SheetDescription className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] pt-4">
                  Yayınlayan: {selectedNews.source}
                </SheetDescription>
              </SheetHeader>

              <div className="p-10">
                <div className="prose prose-slate max-w-none">
                  <p className="text-[17px] leading-[1.8] text-gray-700 whitespace-pre-wrap">
                    {selectedNews.content}
                  </p>
                </div>

                <div className="mt-12 pt-8 border-t-2 border-black flex items-center gap-8">
                  <button className="flex items-center gap-2 group">
                    <Heart className="w-6 h-6 group-hover:fill-red-500 group-hover:text-red-500 transition-all" />
                    <span className="font-bold">{selectedNews.likes} Beğeni</span>
                  </button>
                  <button className="flex items-center gap-2 group">
                    <MessageSquare className="w-6 h-6 group-hover:text-accent transition-all" />
                    <span className="font-bold">{selectedNews.comments} Yorum</span>
                  </button>
                </div>

                <div className="mt-12">
                  <h4 className="font-heading text-xl font-extrabold mb-6 uppercase tracking-tight border-b-2 border-gray-100 pb-2">
                    Yorumlar
                  </h4>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-none flex items-center justify-center shrink-0">
                        <User className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="flex-1 bg-gray-50 p-4 border border-gray-100">
                        <div className="flex justify-between mb-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider">Mert Demir</span>
                          <span className="text-[10px] text-gray-400">2 SAAT ÖNCE</span>
                        </div>
                        <p className="text-sm text-gray-600">Bu etkinlik için kontenjan sınırı var mı?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-10">
                    <textarea 
                      placeholder="Yorumunuzu yazın..." 
                      className="w-full h-32 p-4 border-2 border-black rounded-none resize-none focus:outline-none focus:border-accent text-sm"
                    />
                    <Button className="mt-4 w-full rounded-none bg-black text-white hover:bg-accent font-bold uppercase tracking-widest text-[11px] py-6">
                      YORUM GÖNDER
                    </Button>
                  </div>
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
