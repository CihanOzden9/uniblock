"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Users, Compass } from "lucide-react";
import MessagingOverlay from "@/components/shared/MessagingOverlay";
import CommunityListCard from "@/components/shared/CommunityListCard";
import { toggleFollow } from "@/app/actions/follow";
import { requestJoinTeam, leaveTeam } from "@/app/actions/team";
import { toast } from "sonner";

interface TeamsClientProps {
  user: any;
  teams: any[];
  followedIds: string[];
}

export default function TeamsClient({ user, teams, followedIds }: TeamsClientProps) {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "takip" ? "joined" : "all";
  const [activeTab, setActiveTab] = useState<"all" | "joined">(initialTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [busyMembershipId, setBusyMembershipId] = useState<string | null>(null);
  const [followed, setFollowed] = useState<Set<string>>(new Set(followedIds));

  const isFollowing = (team: any) => followed.has(team.id);
  const membershipStatus = (team: any) =>
    team.members?.find((m: any) => m.userId === user.id)?.status ?? null;

  const onJoinClick = async (teamId: string) => {
    setBusyMembershipId(teamId);
    const result = await requestJoinTeam(teamId, user.id);
    if (result.success) toast.success("Katılım isteğiniz yönetime gönderildi!");
    else toast.error(result.error);
    setBusyMembershipId(null);
  };

  const onLeaveClick = async (teamId: string) => {
    if (!confirm("Bu takımdan ayrılmak istediğinize emin misiniz?")) return;
    setBusyMembershipId(teamId);
    const result = await leaveTeam(teamId, user.id);
    if (result.success) toast.success("Takımdan başarıyla ayrıldınız.");
    else toast.error(result.error);
    setBusyMembershipId(null);
  };

  const onCancelClick = async (teamId: string) => {
    setBusyMembershipId(teamId);
    const result = await leaveTeam(teamId, user.id);
    if (result.success) toast.success("Katılım isteği iptal edildi.");
    else toast.error(result.error);
    setBusyMembershipId(null);
  };

  const onToggleFollow = async (teamId: string) => {
    setBusyId(teamId);
    // İyimser güncelleme
    const wasFollowing = followed.has(teamId);
    setFollowed((prev) => {
      const next = new Set(prev);
      if (wasFollowing) next.delete(teamId);
      else next.add(teamId);
      return next;
    });

    const result = await toggleFollow({ teamId });
    if (result.success) {
      toast.success(result.following ? "Takip etmeye başladın." : "Takip bırakıldı.");
    } else {
      // Hata: geri al
      setFollowed((prev) => {
        const next = new Set(prev);
        if (wasFollowing) next.add(teamId);
        else next.delete(teamId);
        return next;
      });
      toast.error(result.error);
    }
    setBusyId(null);
  };

  const filteredTeams = teams.filter(
    (team) =>
      (team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (team.description || "").toLowerCase().includes(searchQuery.toLowerCase())) &&
      (activeTab === "all" || isFollowing(team))
  );
  const joinedCount = teams.filter(isFollowing).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="bg-surface-container-low px-8 py-12 border-b border-outline-variant">
          <div className="mx-auto max-w-[1280px]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-[640px]">
                <span className="text-[12px] font-semibold uppercase tracking-wide text-primary">
                  Kampüs Takımları
                </span>
                <h1 className="mt-2 font-heading text-[clamp(30px,4vw,46px)] font-bold leading-[1.1] tracking-tight text-on-surface">
                  Takımını Keşfet
                </h1>
                <p className="mt-3 text-[16px] leading-[1.6] text-on-surface-variant">
                  Yarışma ve proje takımlarını keşfet, ekibe katıl ve birlikte üret.
                </p>
              </div>

              {/* Kulüpler / Takımlar geçişi */}
              <div className="flex w-fit rounded-full border border-outline-variant bg-surface p-1">
                <Link
                  href="/clubs"
                  className="rounded-full px-6 py-2 text-[14px] font-semibold text-on-surface-variant transition-colors hover:text-on-surface"
                >
                  Kulüpler
                </Link>
                <span className="rounded-full bg-primary px-6 py-2 text-[14px] font-semibold text-white shadow-sm">
                  Takımlar
                </span>
              </div>
            </div>

            {/* Arama + filtre */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
                <Input
                  placeholder="İsim veya anahtar kelime ile ara..."
                  className="h-12 rounded-full border-outline-variant bg-surface pl-11"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex w-fit shrink-0 rounded-full border border-outline-variant bg-surface p-1">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`rounded-full px-5 py-2 text-[13px] font-semibold transition-colors ${
                    activeTab === "all" ? "bg-primary text-white" : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  Tümü
                </button>
                <button
                  onClick={() => setActiveTab("joined")}
                  className={`flex items-center gap-2 rounded-full px-5 py-2 text-[13px] font-semibold transition-colors ${
                    activeTab === "joined" ? "bg-primary text-white" : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  Takip Ettiklerim
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${
                      activeTab === "joined" ? "bg-white/20 text-white" : "bg-primary-fixed text-primary"
                    }`}
                  >
                    {joinedCount}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Liste */}
        <section className="min-h-[400px] px-8 py-10">
          <div className="mx-auto w-full max-w-[1280px]">
            <div className="mb-6 flex items-center gap-2 text-[13px] font-medium text-on-surface-variant">
              <Compass className="h-4 w-4" />
              {filteredTeams.length} takım listeleniyor
            </div>

            {filteredTeams.length === 0 ? (
              <div className="rounded-xl border border-outline-variant bg-card p-16 text-center shadow-ambient">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary-fixed">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-1.5 font-heading text-xl font-bold tracking-tight">
                  {activeTab === "joined" ? "Henüz Bir Takımı Takip Etmiyorsun" : "Sonuç Bulunamadı"}
                </h3>
                <p className="mb-6 text-[14px] text-on-surface-variant">
                  {activeTab === "joined"
                    ? "Yarışma ve proje takımlarını takip et, duyuru ve etkinliklerinden haberdar ol."
                    : "Aramana uygun bir takım bulunamadı."}
                </p>
                {activeTab === "joined" && (
                  <Button onClick={() => setActiveTab("all")} className="rounded-full text-[14px] font-semibold">
                    Takımları Keşfet
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredTeams.map((team) => (
                  <CommunityListCard
                    key={team.id}
                    href={`/teams/${team.slug}`}
                    name={team.name}
                    description={team.description}
                    memberCount={team._count?.members || 0}
                    color={team.color}
                    typeLabel="Takım"
                    leaderLabel="Kaptan"
                    isLeader={team.leader?.id === user.id}
                    isFollowing={isFollowing(team)}
                    busyFollow={busyId === team.id}
                    onToggleFollow={() => onToggleFollow(team.id)}
                    membershipStatus={membershipStatus(team)}
                    busyMembership={busyMembershipId === team.id}
                    onJoin={() => onJoinClick(team.id)}
                    onLeave={() => onLeaveClick(team.id)}
                    onCancel={() => onCancelClick(team.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="shrink-0 border-t border-outline-variant bg-card px-8 py-12">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-8 md:flex-row">
          <div className="font-heading text-[20px] font-extrabold text-primary">
            Uni<span className="text-accent">.</span>Block
          </div>
          <div className="flex gap-8 text-[14px] font-medium text-on-surface-variant">
            <Link href="#" className="transition-colors hover:text-primary">Hakkımızda</Link>
            <Link href="#" className="transition-colors hover:text-primary">İletişim</Link>
            <Link href="#" className="transition-colors hover:text-primary">Gizlilik</Link>
          </div>
          <p className="text-[13px] text-on-surface-variant">© 2026 Kampüs Haber Ağı</p>
        </div>
      </footer>

      <MessagingOverlay />
    </div>
  );
}
