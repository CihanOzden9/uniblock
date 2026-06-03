"use client";

import Link from "next/link";
import { Users, Eye, Loader2, Check, Crown } from "lucide-react";
import { accentOf, withAlpha } from "@/lib/colors";

interface CommunityListCardProps {
  href: string;
  name: string;
  description?: string | null;
  memberCount: number;
  color?: string | null;
  typeLabel: string; // "Kulüp" | "Takım"
  leaderLabel: string; // "Başkan" | "Kaptan"
  status: "APPROVED" | "PENDING" | "REJECTED" | null;
  isLeader: boolean;
  busyJoin: boolean;
  busyLeave: boolean;
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
  status,
  isLeader,
  busyJoin,
  busyLeave,
  onJoin,
  onLeave,
  onCancel,
}: CommunityListCardProps) {
  const accent = accentOf(color);
  const initial = (name?.trim()?.[0] || "?").toUpperCase();

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
        <div className="mt-4 flex items-center gap-2">
          {isLeader ? (
            <span
              className="flex h-10 flex-1 items-center justify-center gap-2 rounded-full text-[13px] font-semibold"
              style={{ backgroundColor: withAlpha(accent, 0.12), color: accent }}
            >
              <Crown className="h-3.5 w-3.5" />
              {leaderLabel}sın
            </span>
          ) : status === "APPROVED" ? (
            <button
              onClick={onLeave}
              disabled={busyLeave}
              className="group/jl flex h-10 flex-1 items-center justify-center gap-2 rounded-full border border-outline-variant bg-surface-container-low text-[13px] font-semibold text-on-surface transition-colors hover:border-destructive hover:text-destructive disabled:opacity-60"
            >
              {busyLeave ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span className="inline-flex items-center gap-1.5 group-hover/jl:hidden">
                    <Check className="h-3.5 w-3.5" /> Üyesin
                  </span>
                  <span className="hidden group-hover/jl:inline">Ayrıl</span>
                </>
              )}
            </button>
          ) : status === "PENDING" ? (
            <button
              onClick={onCancel}
              disabled={busyLeave}
              className="group/req flex h-10 flex-1 items-center justify-center rounded-full border border-outline-variant bg-surface-container-low text-[13px] font-semibold text-on-surface-variant transition-colors hover:border-destructive hover:text-destructive disabled:opacity-60"
            >
              {busyLeave ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span className="inline group-hover/req:hidden">İstek Gönderildi</span>
                  <span className="hidden group-hover/req:inline">İsteği İptal Et</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={onJoin}
              disabled={busyJoin}
              style={{ backgroundColor: accent }}
              className="flex h-10 flex-1 items-center justify-center gap-2 rounded-full text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {busyJoin ? <Loader2 className="h-4 w-4 animate-spin" /> : "Katıl"}
            </button>
          )}

          <Link
            href={href}
            title="Detayları gör"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
          >
            <Eye className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
