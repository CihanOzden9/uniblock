"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Users, ExternalLink, Loader2, Crown, LogOut, ChevronDown, ChevronUp } from "lucide-react";
import MessagingOverlay from "@/components/shared/MessagingOverlay";
import { requestJoinClub, leaveClub } from "@/app/actions/club";
import { toast } from "sonner";

interface ClubsClientProps {
  user: any;
  clubs: any[];
}

export default function ClubsClient({ user, clubs }: ClubsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, setIsPending] = useState<string | null>(null);
  const [leavingClub, setLeavingClub] = useState<string | null>(null);
  const [expandedClub, setExpandedClub] = useState<string | null>(null);

  const onJoinClick = async (clubId: string) => {
    setIsPending(clubId);
    const result = await requestJoinClub(clubId, user.id);
    if (result.success) {
      toast.success("Katılım isteğiniz başarıyla gönderildi!");
    } else {
      toast.error(result.error);
    }
    setIsPending(null);
  };

  const onLeaveClick = async (clubId: string) => {
    if (!confirm("Bu kulüpten ayrılmak istediğinize emin misiniz?")) return;
    setLeavingClub(clubId);
    const result = await leaveClub(clubId, user.id);
    if (result.success) {
      toast.success("Kulüpten başarıyla ayrıldınız.");
    } else {
      toast.error(result.error);
    }
    setLeavingClub(null);
  };

  const filteredClubs = clubs.filter(club => 
    club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (club.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar user={user} />

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
              {filteredClubs.map((club) => {
                // Separate current user's membership from board members
                const userMembership = club.members?.find((m: any) => m.userId === user.id);
                const boardMembers = club.members?.filter((m: any) => m.role !== "MEMBER" && m.userId !== user.id) || [];
                const userStatus = userMembership?.status;
                const isLoading = isPending === club.id;
                const isLeaving = leavingClub === club.id;
                const isExpanded = expandedClub === club.id;

                // Build management team: leader + board members
                const managementTeam = [
                  ...(club.leader ? [{ name: club.leader.name, department: club.leader.department, role: "BAŞKAN" }] : []),
                  ...boardMembers.map((m: any) => ({ name: m.user.name, department: m.user.department, role: m.role }))
                ];

                return (
                  <Card key={club.id} className="border-black border-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none bg-white overflow-hidden flex flex-col hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                    <CardHeader className="border-b-2 border-gray-100 pb-4">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-accent uppercase tracking-widest bg-accent/10 px-2 py-1 border border-accent/20">
                          {club.category || "Topluluk"}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                          <Users className="w-3 h-3" />
                          {club._count?.members || 0} ÜYE
                        </div>
                      </div>
                      <CardTitle className="font-heading text-xl font-extrabold tracking-tight mt-4">
                        {club.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-6 flex-1 space-y-4">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {club.description || "Henüz bir açıklama eklenmemiş."}
                      </p>

                      {/* Management Team Section */}
                      {managementTeam.length > 0 && (
                        <div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedClub(isExpanded ? null : club.id);
                            }}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-accent transition-colors w-full"
                          >
                            <Crown className="w-3 h-3" />
                            YÖNETİM KADROSU ({managementTeam.length})
                            {isExpanded ? <ChevronUp className="w-3 h-3 ml-auto" /> : <ChevronDown className="w-3 h-3 ml-auto" />}
                          </button>
                          
                          {isExpanded && (
                            <div className="mt-3 space-y-2 border-l-2 border-accent/30 pl-3 animate-in slide-in-from-top-2">
                              {managementTeam.map((person: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between">
                                  <div>
                                    <p className="text-xs font-bold text-gray-800">{person.name}</p>
                                    <p className="text-[9px] text-gray-400 font-medium">{person.department || "—"}</p>
                                  </div>
                                  <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 ${
                                    person.role === "BAŞKAN" 
                                      ? "bg-accent/10 text-accent border border-accent/20" 
                                      : "bg-gray-100 text-gray-500"
                                  }`}>
                                    {person.role}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="pt-4 pb-6 border-t-2 border-gray-50 bg-[#fafafa] flex gap-3">
                      {(() => {
                        if (userStatus === "APPROVED") {
                          return (
                            <>
                              <Button 
                                onClick={() => onLeaveClick(club.id)}
                                disabled={isLeaving}
                                variant="outline"
                                className="flex-1 rounded-none uppercase tracking-widest text-[10px] font-bold h-10 border-2 border-gray-200 text-gray-500 hover:border-red-500 hover:text-red-500 hover:bg-red-50 transition-all"
                              >
                                {isLeaving ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                  <>
                                    <LogOut className="w-3 h-3 mr-2" />
                                    Ayrıl
                                  </>
                                )}
                              </Button>
                              <Button disabled className="flex-1 rounded-none uppercase tracking-widest text-[10px] font-bold h-10 bg-green-50 text-green-600 border-green-100">
                                Üyesiniz
                              </Button>
                            </>
                          );
                        }

                        if (userStatus === "PENDING" || isLoading) {
                          return (
                            <Button disabled className="flex-1 rounded-none uppercase tracking-widest text-[10px] font-bold h-10 bg-gray-100 text-gray-400 border-gray-200">
                              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "İstek Gönderildi"}
                            </Button>
                          );
                        }

                        return (
                          <Button 
                            onClick={() => onJoinClick(club.id)}
                            className="flex-1 rounded-none uppercase tracking-widest text-[10px] font-bold h-10 bg-accent text-white hover:bg-black border-accent hover:border-black transition-all"
                          >
                            Katılma İsteği
                          </Button>
                        );
                      })()}
                      <Button variant="outline" className="w-10 h-10 p-0 rounded-none border-black hover:bg-black hover:text-white transition-all">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
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
