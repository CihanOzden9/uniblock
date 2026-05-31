"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Users, ExternalLink, Loader2, Crown, LogOut, ChevronDown, ChevronUp } from "lucide-react";
import MessagingOverlay from "@/components/shared/MessagingOverlay";
import { requestJoinTeam, leaveTeam } from "@/app/actions/team";
import { toast } from "sonner";

interface TeamsClientProps {
  user: any;
  teams: any[];
}

export default function TeamsClient({ user, teams }: TeamsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, setIsPending] = useState<string | null>(null);
  const [leavingTeam, setLeavingTeam] = useState<string | null>(null);
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);

  const onJoinClick = async (teamId: string) => {
    setIsPending(teamId);
    const result = await requestJoinTeam(teamId, user.id);
    if (result.success) {
      toast.success("Katılım isteğiniz başarıyla gönderildi!");
    } else {
      toast.error(result.error);
    }
    setIsPending(null);
  };

  const onLeaveClick = async (teamId: string) => {
    if (!confirm("Bu takımdan ayrılmak istediğinize emin misiniz?")) return;
    setLeavingTeam(teamId);
    const result = await leaveTeam(teamId, user.id);
    if (result.success) {
      toast.success("Takımdan başarıyla ayrıldınız.");
    } else {
      toast.error(result.error);
    }
    setLeavingTeam(null);
  };

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (team.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      <main className="flex-1 pt-20">
        <section className="bg-surface-container-low py-14 px-8 border-b border-outline-variant">
          <div className="max-w-[1200px] mx-auto">
            <span className="text-[12px] font-semibold tracking-wide uppercase text-primary">
              Takımlar ve Topluluklar
            </span>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-3">
              <div className="flex-1">
                <h1 className="font-heading text-[clamp(32px,4.5vw,52px)] font-bold tracking-tight leading-[1.1] mb-3 text-on-surface">
                  Kampüs Takımları
                </h1>
                <p className="text-[16px] leading-[1.6] text-on-surface-variant max-w-[700px]">
                  Yarışma ve proje takımlarını keşfet, ekibe katıl ve birlikte üret.
                </p>
              </div>

              <div className="relative w-full md:w-[320px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                <Input
                  placeholder="Takım ara..."
                  className="pl-11 rounded-full bg-surface border-outline-variant h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 px-8 min-h-[400px]">
          <div className="max-w-[1200px] mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {filteredTeams.map((team) => {
                // Separate current user's membership from board members
                const userMembership = team.members?.find((m: any) => m.userId === user.id);
                const boardMembers = team.members?.filter((m: any) => m.role !== "MEMBER" && m.userId !== user.id && m.userId !== team.leader?.id) || [];
                const userStatus = userMembership?.status;
                const isLoading = isPending === team.id;
                const isLeaving = leavingTeam === team.id;
                const isExpanded = expandedTeam === team.id;

                // Build management team: leader + board members
                const managementTeam = [
                  ...(team.leader ? [{ name: team.leader.name, department: team.leader.department, role: "KAPTAN" }] : []),
                  ...boardMembers.map((m: any) => ({ name: m.user.name, department: m.user.department, role: m.role }))
                ];

                return (
                  <Card key={team.id} className="overflow-hidden flex flex-col hover:shadow-ambient-lg hover:-translate-y-0.5 transition-all">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <span className="text-[11px] font-semibold text-primary tracking-wide bg-primary-fixed px-2.5 py-1 rounded-full">
                          {team.category || "Takım"}
                        </span>
                        <div className="flex items-center gap-1.5 text-[12px] font-medium text-on-surface-variant">
                          <Users className="w-3.5 h-3.5" />
                          {team._count?.members || 0} üye
                        </div>
                      </div>
                      <CardTitle className="font-heading text-xl font-bold tracking-tight mt-4">
                        {team.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-4">
                      <p className="text-[14px] text-on-surface-variant leading-relaxed">
                        {team.description || "Henüz bir açıklama eklenmemiş."}
                      </p>

                      {/* Management Team Section */}
                      {managementTeam.length > 0 && (
                        <div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedTeam(isExpanded ? null : team.id);
                            }}
                            className="flex items-center gap-2 text-[12px] font-semibold text-on-surface-variant hover:text-primary transition-colors w-full"
                          >
                            <Crown className="w-3.5 h-3.5" />
                            Yönetim Kadrosu ({managementTeam.length})
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5 ml-auto" /> : <ChevronDown className="w-3.5 h-3.5 ml-auto" />}
                          </button>

                          {isExpanded && (
                            <div className="mt-3 space-y-2.5 border-l-2 border-primary/30 pl-3 animate-in slide-in-from-top-2">
                              {managementTeam.map((person: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between gap-2">
                                  <div>
                                    <p className="text-[13px] font-semibold text-on-surface">{person.name}</p>
                                    <p className="text-[11px] text-on-surface-variant">{person.department || "—"}</p>
                                  </div>
                                  <span className={`text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full shrink-0 ${
                                    person.role === "KAPTAN"
                                      ? "bg-accent/15 text-[color:var(--community-orange-deep)]"
                                      : "bg-surface-container-high text-on-surface-variant"
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
                    <CardFooter className="border-t border-outline-variant bg-surface-container-low flex gap-3">
                      {(() => {
                        if (userStatus === "APPROVED") {
                          return (
                            <>
                              <Button
                                onClick={() => onLeaveClick(team.id)}
                                disabled={isLeaving}
                                variant="outline"
                                className="flex-1 rounded-full text-[13px] font-semibold h-10 border-outline-variant text-on-surface-variant hover:border-destructive hover:text-destructive transition-all"
                              >
                                {isLeaving ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                  <>
                                    <LogOut className="w-3.5 h-3.5 mr-2" />
                                    Ayrıl
                                  </>
                                )}
                              </Button>
                              <Button disabled className="flex-1 rounded-full text-[13px] font-semibold h-10 bg-primary-fixed text-primary border-transparent disabled:opacity-100">
                                Üyesiniz
                              </Button>
                            </>
                          );
                        }

                        if (userStatus === "PENDING" || isLoading) {
                          return (
                            <Button disabled className="flex-1 rounded-full text-[13px] font-semibold h-10 bg-surface-container-high text-on-surface-variant border-transparent disabled:opacity-100">
                              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "İstek Gönderildi"}
                            </Button>
                          );
                        }

                        return (
                          <Button
                            onClick={() => onJoinClick(team.id)}
                            className="flex-1 rounded-full text-[13px] font-semibold h-10"
                          >
                            Katılma İsteği
                          </Button>
                        );
                      })()}
                      <Button variant="outline" className="w-10 h-10 p-0 rounded-full border-outline-variant text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-all">
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
