"use client";

import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, ShieldCheck, Star, Calendar } from "lucide-react";
import MessagingOverlay from "@/components/shared/MessagingOverlay";

export default function EventsPage() {
  const events = [
    { title: "Yapay Zeka Zirvesi '26", date: "12 MAYIS 2026", club: "Robotik Kulübü", points: 100 },
    { title: "Python Workshop", date: "05 MAYIS 2026", club: "Bilişim Topluluğu", points: 50 },
    { title: "Kariyer Günleri", date: "28 NİSAN 2026", club: "Kariyer Merkezi", points: 200 },
    { title: "Startup Weekend", date: "15 NİSAN 2026", club: "Girişimcilik Kulübü", points: 100 },
  ];

  const memberships = [
    { name: "Yazılım Topluluğu", type: "KULÜP", role: "Yönetim Kurulu", date: "Ekim 2024", icon: <ShieldCheck className="w-5 h-5 text-accent" /> },
    { name: "Robotik Kulübü", type: "KULÜP", role: "Aktif Üye", date: "Kasım 2024", icon: <Users className="w-5 h-5 text-blue-500" /> },
    { name: "UniBlock Core Team", type: "TAKIM", role: "Frontend Dev", date: "Ocak 2025", icon: <Star className="w-5 h-5 text-yellow-500" /> },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="flex-1 pt-20">
        <section className="py-12 px-8 border-b-2 border-accent/10">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-accent">
                02 — PANELİM
              </span>
              <div className="flex-1 h-[1px] bg-gray-200"></div>
            </div>
            
            <h1 className="font-heading text-[clamp(36px,5vw,64px)] font-extrabold tracking-tighter leading-[1.05] mb-4">
              Etkinlik ve Üyelikler
            </h1>
            <p className="text-[15px] leading-[1.6] text-gray-600 max-w-[700px] mb-6">
              Katıldığınız etkinlikler, kazandığınız puanlar ve üyesi olduğunuz kampüs toplulukları.
            </p>
          </div>
        </section>

        <section className="bg-gray-100 py-12 px-8 min-h-[400px]">
          <div className="max-w-[1200px] mx-auto w-full">
            <Tabs defaultValue="events" className="w-full">
              <TabsList className="flex flex-wrap w-full justify-start rounded-none bg-transparent p-0 border-b-2 border-accent/20 mb-8 h-auto gap-10">
                <TabsTrigger value="events" className="rounded-none px-0 pb-4 pt-2 text-[13px] uppercase tracking-wider font-semibold text-[#a3a3a3] hover:text-accent transition-colors border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:text-accent !bg-transparent !shadow-none outline-none ring-0 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Etkinliklerim
                </TabsTrigger>
                <TabsTrigger value="memberships" className="rounded-none px-0 pb-4 pt-2 text-[13px] uppercase tracking-wider font-semibold text-[#a3a3a3] hover:text-accent transition-colors border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:text-accent !bg-transparent !shadow-none outline-none ring-0 flex items-center gap-2">
                  <Users className="w-4 h-4" /> Üyeliklerim
                </TabsTrigger>
              </TabsList>

              <TabsContent value="events" className="focus-visible:outline-none focus-visible:ring-0">
                <Card className="border-accent border-2 shadow-[12px_12px_0px_0px_rgba(5,150,105,0.1)] rounded-none bg-white overflow-hidden">
                  <CardHeader className="border-b-2 border-accent/10 pb-5 bg-[#fafafa]">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="font-heading text-xl font-extrabold tracking-tight">Etkinlik Geçmişi</CardTitle>
                        <CardDescription className="text-xs uppercase tracking-widest text-accent font-medium mt-1">
                          Geçmiş ve yaklaşan katılım durumları
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">TOPLAM PUAN</div>
                        <div className="text-3xl font-black text-accent leading-none mt-1">450</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y-2 divide-gray-100">
                      {events.map((event, i) => (
                        <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-black text-white flex flex-col items-center justify-center font-bold">
                              <span className="text-[10px] leading-none mb-1">{event.date.split(' ')[1]}</span>
                              <span className="text-sm leading-none">{event.date.split(' ')[0]}</span>
                            </div>
                            <div>
                              <h4 className="font-bold text-[15px]">{event.title}</h4>
                              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">{event.club}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-[11px] font-black text-accent bg-accent/10 px-3 py-1 border border-accent/20">+{event.points} P</span>
                            <span className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-tight">Tamamlandı</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4 pb-5 border-t-2 border-accent/10 bg-[#fafafa]">
                    <Button variant="outline" className="w-full rounded-none uppercase tracking-[0.15em] text-[10px] font-bold border-black hover:bg-black hover:text-white transition-all">
                      TÜM GEÇMİŞİ GÖR
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="memberships" className="focus-visible:outline-none focus-visible:ring-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {memberships.map((membership, i) => (
                    <Card key={i} className="border-black border-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none bg-white overflow-hidden hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer group">
                      <CardHeader className="border-b-2 border-gray-100 pb-4 flex flex-row items-center justify-between">
                        <span className="text-[10px] font-bold text-accent uppercase tracking-widest bg-accent/10 px-2 py-1 border border-accent/20">
                          {membership.type}
                        </span>
                        {membership.icon}
                      </CardHeader>
                      <CardContent className="py-6">
                        <h3 className="font-heading text-xl font-extrabold tracking-tight mb-1 group-hover:text-accent transition-colors">
                          {membership.name}
                        </h3>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">
                          {membership.role}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500">
                          <Calendar className="w-3 h-3" />
                          KATILIM: {membership.date.toUpperCase()}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0 pb-6">
                        <Button variant="link" className="p-0 h-auto text-accent text-[10px] font-bold uppercase tracking-widest hover:no-underline flex items-center gap-1 group/btn">
                          DETAYLARI GÖR <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

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
