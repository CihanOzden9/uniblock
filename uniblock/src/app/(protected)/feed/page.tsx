"use client";

import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Share2, User, ArrowRight, Trophy } from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "@/components/ui/sheet";
import { useState } from "react";
import MessagingOverlay from "@/components/shared/MessagingOverlay";

const MOCK_COMMUNITY_POSTS = [
  {
    id: 4,
    title: "Robotik Takımı Yeni Üyelerini Arıyor!",
    excerpt: "Dünya çapındaki yarışmalara katılacak olan ekibimize katılmak ister misin? Başvurular için standımıza bekliyoruz.",
    content: "Dünya çapındaki yarışmalara katılacak olan ekibimize katılmak ister misin? Başvurular için standımıza bekliyoruz. Elektronik, yazılım ve mekanik alanlarında heyecanlı ekip arkadaşları arıyoruz.",
    date: "14 MAYIS 2026",
    source: "ROBOTİK KULÜBÜ",
    category: "Topluluk",
    likes: 45,
    comments: 3,
  },
  {
    id: 5,
    title: "Girişimcilik Zirvesi '26",
    excerpt: "Sektörün dev isimleriyle tanışma ve staj imkanı yakalayacağınız dev zirve kampüsümüzde!",
    content: "Sektörün dev isimleriyle tanışma ve staj imkanı yakalayacağınız dev zirve kampüsümüzde! 20'den fazla CEO ve kurucu ortak bizlerle olacak.",
    date: "20 MAYIS 2026",
    source: "GİRİŞİMCİLİK KULÜBÜ",
    category: "Etkinlik",
    likes: 312,
    comments: 24,
  },
];

export default function FeedPage() {
  const [selectedPost, setSelectedPost] = useState<any>(null);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 pt-20">
        <section className="py-12 px-8 border-b-2 border-accent/10">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-accent">
                04 — TOPLULUK AKIŞI
              </span>
              <div className="flex-1 h-[1px] bg-gray-200"></div>
            </div>
            
            <h1 className="font-heading text-[clamp(36px,5vw,64px)] font-extrabold tracking-tighter leading-[1.05] mb-4">
              Topluluklarda Neler Oluyor?
            </h1>
            <p className="text-[15px] leading-[1.6] text-gray-600 max-w-[700px] mb-6">
              Üniversite kulüplerinden ve topluluklarından en yeni etkinlik ve duyurular.
            </p>
          </div>
        </section>

        <section className="bg-gray-100 py-12 px-8 min-h-[400px]">
          <div className="max-w-[1200px] mx-auto w-full flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 bg-black border-2 border-black gap-[1px]">
                {MOCK_COMMUNITY_POSTS.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => setSelectedPost(item)}
                    className="bg-white p-8 flex flex-col min-h-[320px] transition-all hover:bg-gray-50 group cursor-pointer border-l-4 border-accent"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-black"></div>
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
            </div>

            {/* Sidebar */}
            <aside className="w-full lg:w-[350px] shrink-0 flex flex-col gap-8">
              {/* Liderlik Tablosu */}
              <div className="bg-white border-2 border-black p-6">
                <div className="flex justify-between items-center mb-6 border-b-2 border-black pb-3">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-accent" />
                    <h3 className="font-heading text-xl font-extrabold uppercase tracking-tight">Liderlik</h3>
                  </div>
                  <span className="text-[9px] font-black bg-black text-white px-2 py-0.5 tracking-tighter">MAYIS '26</span>
                </div>
                
                <div className="flex flex-col gap-5">
                  {[
                    { name: "Yazılım Kulübü", points: 1250 },
                    { name: "Girişimcilik Kulübü", points: 1050 },
                    { name: "Robotik Kulübü", points: 850 },
                    { name: "Münazara Topluluğu", points: 600 },
                    { name: "Fotoğrafçılık Kulübü", points: 450 }
                  ].map((club, idx) => (
                    <div key={idx} className="relative group cursor-pointer">
                      <div className="flex items-center gap-4 relative z-10">
                        <div className={`w-6 h-6 flex items-center justify-center font-heading font-black text-[10px] border-2 border-black shrink-0 transition-transform group-hover:-translate-y-1 ${
                          idx === 0 ? 'bg-accent text-white border-accent shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 
                          idx === 1 ? 'bg-gray-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 
                          idx === 2 ? 'bg-orange-100 border-orange-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white'
                        }`}>
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-end mb-1.5">
                            <h4 className="font-bold text-[13px] truncate group-hover:text-accent transition-colors tracking-tight">{club.name}</h4>
                            <span className="text-[10px] font-black tracking-tighter text-gray-400 group-hover:text-black transition-colors">{club.points} P</span>
                          </div>
                          {/* Progress Bar */}
                          <div className="h-[3px] w-full bg-gray-100 overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-1000 ${idx === 0 ? 'bg-accent' : 'bg-black'}`} 
                              style={{ width: `${(club.points / 1250) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button className="w-full mt-8 rounded-none bg-black text-white hover:bg-accent border-2 border-black hover:border-accent transition-all text-[10px] tracking-widest font-bold uppercase h-12">
                  Tüm Sıralamayı Gör
                </Button>
              </div>

              {/* Aktif Anketler */}
              <div className="bg-white border-2 border-black p-6">
                <div className="flex justify-between items-center mb-4 border-b-2 border-gray-100 pb-2">
                  <h3 className="font-heading text-xl font-extrabold uppercase tracking-tight">Aktif Anketler</h3>
                  <span className="text-[10px] font-bold bg-accent text-white px-2 py-1">3 YENİ</span>
                </div>
                
                <div className="relative group/scroll">
                  <div className="max-h-[460px] overflow-y-auto pr-1 space-y-6 scrollbar-hide">
                    {/* Anket 1 */}
                    <div className="border border-gray-200 p-4 relative group">
                      <div className="absolute top-0 left-0 w-1 h-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Yazılım Kulübü</span>
                        <span className="text-[9px] text-gray-400 font-bold">12 MAYIS 2026</span>
                      </div>
                      <p className="font-bold text-[13px] text-gray-800 mb-3 leading-snug">Hangi alanda workshop istersiniz?</p>
                      <div className="space-y-2 mb-3">
                        <button className="w-full flex justify-between items-center p-2 border border-gray-200 hover:border-accent hover:bg-accent/5 transition-all text-left">
                          <span className="font-semibold text-xs transition-colors">UI/UX Design</span>
                          <span className="text-[9px] font-black text-accent bg-accent/10 px-1.5 py-0.5">+10 P</span>
                        </button>
                        <button className="w-full flex justify-between items-center p-2 border border-gray-200 hover:border-accent hover:bg-accent/5 transition-all text-left">
                          <span className="font-semibold text-xs transition-colors">Cyber Security</span>
                          <span className="text-[9px] font-black text-accent bg-accent/10 px-1.5 py-0.5">+10 P</span>
                        </button>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-gray-500 font-medium mt-4 pt-3 border-t border-gray-100">
                        <span>👤 124 Katılımcı</span>
                        <span>Oluşturan: Mert D.</span>
                      </div>
                    </div>

                    {/* Anket 2 */}
                    <div className="border border-gray-200 p-4 relative group">
                      <div className="absolute top-0 left-0 w-1 h-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Kariyer Merkezi</span>
                        <span className="text-[9px] text-gray-400 font-bold">10 MAYIS 2026</span>
                      </div>
                      <p className="font-bold text-[13px] text-gray-800 mb-3 leading-snug">Yaz stajı arıyor musunuz?</p>
                      <div className="space-y-2 mb-3">
                        <button className="w-full flex justify-between items-center p-2 border border-gray-200 hover:border-accent hover:bg-accent/5 transition-all text-left">
                          <span className="font-semibold text-xs transition-colors">Evet, arıyorum</span>
                          <span className="text-[9px] font-black text-accent bg-accent/10 px-1.5 py-0.5">+5 P</span>
                        </button>
                        <button className="w-full flex justify-between items-center p-2 border border-gray-200 hover:border-accent hover:bg-accent/5 transition-all text-left">
                          <span className="font-semibold text-xs transition-colors">Hayır, buldum</span>
                          <span className="text-[9px] font-black text-accent bg-accent/10 px-1.5 py-0.5">+5 P</span>
                        </button>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-gray-500 font-medium mt-4 pt-3 border-t border-gray-100">
                        <span>👤 342 Katılımcı</span>
                        <span>Oluşturan: Sistem</span>
                      </div>
                    </div>

                    {/* Anket 3 (Yeni) */}
                    <div className="border border-gray-200 p-4 relative group">
                      <div className="absolute top-0 left-0 w-1 h-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Spor Birliği</span>
                        <span className="text-[9px] text-gray-400 font-bold">08 MAYIS 2026</span>
                      </div>
                      <p className="font-bold text-[13px] text-gray-800 mb-3 leading-snug">Kampüs içi turnuva branşı seçin?</p>
                      <div className="space-y-2 mb-3">
                        <button className="w-full flex justify-between items-center p-2 border border-gray-200 hover:border-accent hover:bg-accent/5 transition-all text-left">
                          <span className="font-semibold text-xs transition-colors">Basketbol 3x3</span>
                          <span className="text-[9px] font-black text-accent bg-accent/10 px-1.5 py-0.5">+15 P</span>
                        </button>
                        <button className="w-full flex justify-between items-center p-2 border border-gray-200 hover:border-accent hover:bg-accent/5 transition-all text-left">
                          <span className="font-semibold text-xs transition-colors">Voleybol</span>
                          <span className="text-[9px] font-black text-accent bg-accent/10 px-1.5 py-0.5">+15 P</span>
                        </button>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-gray-500 font-medium mt-4 pt-3 border-t border-gray-100">
                        <span>👤 89 Katılımcı</span>
                        <span>Oluşturan: Selin K.</span>
                      </div>
                    </div>
                  </div>

                  {/* Scroll Indicator Overlay */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none group-hover/scroll:opacity-0 transition-opacity duration-300">
                    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 px-3 py-1 flex items-center gap-2 animate-bounce">
                      <ArrowRight size={10} className="text-accent rotate-90" />
                      <span className="text-[8px] font-black text-accent uppercase tracking-tighter">Daha Fazla Gör</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Sheet open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <SheetContent side="right" className="w-full sm:max-w-[600px] p-0 rounded-none border-l-2 border-black overflow-y-auto">
          {selectedPost && (
            <div className="flex flex-col h-full">
              <SheetHeader className="p-10 border-b-2 border-gray-100 text-left">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-accent text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                    {selectedPost.category}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {selectedPost.date}
                  </span>
                </div>
                <SheetTitle className="font-heading text-3xl font-extrabold tracking-tighter leading-tight">
                  {selectedPost.title}
                </SheetTitle>
                <SheetDescription className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] pt-4">
                  Yayınlayan: {selectedPost.source}
                </SheetDescription>
              </SheetHeader>

              <div className="p-10">
                <div className="prose prose-slate max-w-none">
                  <p className="text-[17px] leading-[1.8] text-gray-700 whitespace-pre-wrap">
                    {selectedPost.content}
                  </p>
                </div>

                <div className="mt-12 pt-8 border-t-2 border-black flex items-center gap-8">
                  <button className="flex items-center gap-2 group">
                    <Heart className="w-6 h-6 group-hover:fill-red-500 group-hover:text-red-500 transition-all" />
                    <span className="font-bold">{selectedPost.likes} Beğeni</span>
                  </button>
                  <button className="flex items-center gap-2 group">
                    <MessageSquare className="w-6 h-6 group-hover:text-accent transition-all" />
                    <span className="font-bold">{selectedPost.comments} Yorum</span>
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
                        <p className="text-sm text-gray-600">Harika bir haber!</p>
                      </div>
                    </div>
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
