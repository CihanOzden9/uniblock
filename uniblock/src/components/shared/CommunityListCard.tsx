"use client";

import Link from "next/link";
import { Users, Eye, Loader2, Check, Crown, Plus, UserPlus } from "lucide-react";
import { accentOf, withAlpha } from "@/lib/colors";

interface CommunityListCardProps {
  href: string;
  name: string;
  description?: string | null;
  memberCount: number;
  color?: string | null;
  typeLabel: string; // "Kulüp" | "Takım"
  leaderLabel: string; // "Başkan" | "Kaptan"
  isLeader: boolean;
  // Takip (anlık, onaysız)
  isFollowing: boolean;
  busyFollow: boolean;
  onToggleFollow: () => void;
  // Üyelik / yönetime katılma (onaylı)
  membershipStatus: "APPROVED" | "PENDING" | "REJECTED" | null;
  busyMembership: boolean;
  onJoin: () => void;
  onLeave: () => void;
  onCancel: () => void;
}

export default function CommunityListCard({
  href,
  name,
  description,
  memberCount,
  color,
  typeLabel,
  leaderLabel,
  isLeader,
  isFollowing,
  busyFollow,
  onToggleFollow,
  membershipStatus,
  busyMembership,
  onJoin,
  onLeave,
  onCancel,
}: CommunityListCardProps) {
  const accent = accentOf(color);
  const initial = (name?.trim()?.[0] || "?").toUpperCase();

  // Üyelik butonu (Katıl / İstek Gönderildi / Üyesin)
  const membershipButton = (
    membershipStatus === "APPROVED" ? (
      <button
        onClick={onLeave}
        disabled={busyMembership}
        className="group/ms flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full border border-outline-variant bg-surface-container-low text-[13px] font-semibold text-on-surface transition-colors hover:border-destructive hover:text-destructive disabled:opacity-60"
      >
        {busyMembership ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <span className="grid">
            <span className="col-start-1 row-start-1 flex items-center justify-center gap-1.5 transition-opacity group-hover/ms:opacity-0">
              <Check className="h-3.5 w-3.5" /> Üyesin
            </span>
            <span className="col-start-1 row-start-1 flex items-center justify-center opacity-0 transition-opacity group-hover/ms:opacity-100">
              Ayrıl
            </span>
          </span>
        )}
      </button>
    ) : membershipStatus === "PENDING" ? (
      <button
        onClick={onCancel}
        disabled={busyMembership}
        className="group/ms flex h-10 flex-1 items-center justify-center rounded-full border border-outline-variant bg-surface-container-low text-[13px] font-semibold text-on-surface-variant transition-colors hover:border-destructive hover:text-destructive disabled:opacity-60"
      >
        {busyMembership ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <span className="grid">
            <span className="col-start-1 row-start-1 flex items-center justify-center transition-opacity group-hover/ms:opacity-0">İstek Gönderildi</span>
            <span className="col-start-1 row-start-1 flex items-center justify-center opacity-0 transition-opacity group-hover/ms:opacity-100">İsteği İptal Et</span>
          </span>
        )}
      </button>
    ) : (
      <button
        onClick={onJoin}
        disabled={busyMembership}
        className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full border border-outline-variant bg-surface text-[13px] font-semibold text-on-surface transition-colors hover:border-primary hover:text-primary disabled:opacity-60"
      >
        {busyMembership ? <Loader2 className="h-4 w-4 animate-spin" /> : (<><UserPlus className="h-3.5 w-3.5" /> Katıl</>)}
      </button>
    )
  );

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-outline-variant bg-card shadow-ambient transition-all hover:-translate-y-1 hover:shadow-ambient-lg">
      {/* Kapak */}
      <Link href={href} className="relative block h-28 overflow-hidden">
        <div
          className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
          style={{ background: `linear-gradient(135deg, ${accent}, #0b1c30)` }}
        />
        {/* Hafif doku */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.25), transparent 45%)",
          }}
        />
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/25 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
          <Users className="h-3 w-3" />
          {memberCount}
        </span>
      </Link>

      {/* İçerik */}
      <div className="relative flex flex-1 flex-col px-5 pb-5 pt-0">
        {/* Taşan rozet (baş harf) */}
        <div
          className="-mt-7 mb-3 flex h-14 w-14 items-center justify-center rounded-xl border-4 border-card text-xl font-bold text-white shadow-ambient"
          style={{ backgroundColor: accent }}
        >
          {initial}
        </div>

        <Link href={href}>
          <h3 className="font-heading text-[18px] font-bold leading-tight tracking-tight text-on-surface transition-colors group-hover:text-primary">
            {name}
          </h3>
        </Link>

        <span
          className="mt-2 inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide"
          style={{ backgroundColor: withAlpha(accent, 0.12), color: accent }}
        >
          {typeLabel}
        </span>

        <p className="mt-3 line-clamp-2 min-h-[40px] text-[13.5px] leading-relaxed text-on-surface-variant">
          {description || "Henüz bir açıklama eklenmemiş."}
        </p>

        {/* Aksiyonlar */}
        <div className="mt-4 flex flex-col gap-2">
          {isLeader ? (
            <div className="flex items-center gap-2">
              <span
                className="flex h-10 flex-1 items-center justify-center gap-2 rounded-full text-[13px] font-semibold"
                style={{ backgroundColor: withAlpha(accent, 0.12), color: accent }}
              >
                <Crown className="h-3.5 w-3.5" />
                {leaderLabel}sın
              </span>
              <Link
                href={href}
                title="Detayları gör"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
              >
                <Eye className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <>
              {/* Takip (birincil) */}
              {isFollowing ? (
                <button
                  onClick={onToggleFollow}
                  disabled={busyFollow}
                  className="group/fl flex h-10 w-full items-center justify-center gap-2 rounded-full border border-outline-variant bg-surface-container-low text-[13px] font-semibold text-on-surface transition-colors hover:border-destructive hover:text-destructive disabled:opacity-60"
                >
                  {busyFollow ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <span className="grid">
                      <span className="col-start-1 row-start-1 flex items-center justify-center gap-1.5 transition-opacity group-hover/fl:opacity-0">
                        <Check className="h-3.5 w-3.5" /> Takip Ediliyor
                      </span>
                      <span className="col-start-1 row-start-1 flex items-center justify-center opacity-0 transition-opacity group-hover/fl:opacity-100">
                        Takibi Bırak
                      </span>
                    </span>
                  )}
                </button>
              ) : (
                <button
                  onClick={onToggleFollow}
                  disabled={busyFollow}
                  style={{ backgroundColor: accent }}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-full text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {busyFollow ? <Loader2 className="h-4 w-4 animate-spin" /> : (<><Plus className="h-3.5 w-3.5" /> Takip Et</>)}
                </button>
              )}

              {/* Üyelik (Katıl) + Detay */}
              <div className="flex items-center gap-2">
                {membershipButton}
                <Link
                  href={href}
                  title="Detayları gör"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                >
                  <Eye className="h-4 w-4" />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
