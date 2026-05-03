"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Users, ExternalLink } from "lucide-react";
import MessagingOverlay from "@/components/shared/MessagingOverlay";

export default function ClubsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [requestedClubs, setRequestedClubs] = useState<number[]>([]);

  const clubs = [
    { id: 1, name: "Robotik Kulübü", members: 450, category: "Teknoloji", description: "Robotik ve otonom sistemler üzerine projeler geliştiriyoruz." },
    { id: 2, name: "Girişimcilik Kulübü", members: 320, category: "Kariyer", description: "Kendi işini kurmak isteyen öğrencileri bir araya getiriyoruz." },
    { id: 3, name: "Yazılım Topluluğu", members: 890, category: "Teknoloji", description: "Açık kaynak projeler ve hackathonlar düzenliyoruz." },
    { id: 4, name: "Tiyatro Topluluğu", members: 120, category: "Sanat", description: "Her dönem sonu büyük bir oyun sahneliyoruz." },
    { id: 5, name: "Müzik Kulübü", members: 210, category: "Sanat", description: "Kampüs içi konserler ve workshoplar düzenliyoruz." },
    { id: 6, name: "E-Spor Kulübü", members: 560, category: "Eğlence", description: "Üniversiteler arası turnuvalara katılıyoruz." },
  ];

  const handleJoinRequest = (id: number) => {
    if (!requestedClubs.includes(id)) {
      setRequestedClubs([...requestedClubs, id]);
    }
  };

  const filteredClubs = clubs.filter(club => 
    club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    club.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="flex-1 pt-20">
        <section className="py-12 px-8 border-b-2 border-accent/10">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-accent">
                02 — KULÜPLER VE TOPLULUKLAR
              </span>
              <div className="flex-1 h-[1px] bg-gray-200"></div>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex-1">
                <h1 className="font-heading text-[clamp(36px,5vw,64px)] font-extrabold tracking-tighter leading-[1.05] mb-4">
                  Kampüs Toplulukları
                </h1>
                <p className="text-[15px] leading-[1.6] text-gray-600 max-w-[700px] mb-2">
                  İlgi alanlarına uygun kulüpleri keşfet, projelerine dahil ol ve kampüs ağını genişlet.
                </p>
              </div>
              
              <div className="relative w-full md:w-[300px] mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  placeholder="Kulüp ara..." 
                  className="pl-10 rounded-none border-2 border-black focus-visible:ring-accent h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-100 py-12 px-8 min-h-[400px]">
          <div className="max-w-[1200px] mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredClubs.map((club) => (
                <Card key={club.id} className="border-black border-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none bg-white overflow-hidden flex flex-col hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                  <CardHeader className="border-b-2 border-gray-100 pb-4">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-accent uppercase tracking-widest bg-accent/10 px-2 py-1 border border-accent/20">
                        {club.category}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                        <Users className="w-3 h-3" />
                        {club.members} ÜYE
                      </div>
                    </div>
                    <CardTitle className="font-heading text-xl font-extrabold tracking-tight mt-4">
                      {club.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-6 flex-1">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {club.description}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-4 pb-6 border-t-2 border-gray-50 bg-[#fafafa] flex gap-3">
                    <Button 
                      onClick={() => handleJoinRequest(club.id)}
                      disabled={requestedClubs.includes(club.id)}
                      className={`flex-1 rounded-none uppercase tracking-widest text-[10px] font-bold h-10 transition-all ${
                        requestedClubs.includes(club.id) 
                          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" 
                          : "bg-accent text-white hover:bg-black border-accent hover:border-black"
                      }`}
                    >
                      {requestedClubs.includes(club.id) ? "İstek Gönderildi" : "Katılma İsteği"}
                    </Button>
                    <Button variant="outline" className="w-10 h-10 p-0 rounded-none border-black hover:bg-black hover:text-white transition-all">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
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
