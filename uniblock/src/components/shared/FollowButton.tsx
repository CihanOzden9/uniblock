"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Bell, BellRing, Loader2 } from "lucide-react";
import { toggleFollow } from "@/app/actions/follow";

interface FollowButtonProps {
  entity: "club" | "team";
  id: string;
  isFollowing: boolean;
  color?: string | null;
}

/**
 * Anlık takip et / takibi bırak butonu (detay sayfası).
 * Üyelikten (JoinLeaveButton) bağımsızdır.
 */
export default function FollowButton({ entity, id, isFollowing, color }: FollowButtonProps) {
  const [following, setFollowing] = useState(isFollowing);
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const accent = color || "#fd6c00";

  async function onToggle() {
    setPending(true);
    const prev = following;
    setFollowing(!prev); // iyimser
    const r = await toggleFollow(entity === "club" ? { clubId: id } : { teamId: id });
    if (r.success) {
      toast.success(r.following ? "Takip etmeye başladın." : "Takip bırakıldı.");
      router.refresh();
    } else {
      setFollowing(prev); // geri al
      toast.error(r.error);
    }
    setPending(false);
  }

  if (following) {
    return (
      <button
        onClick={onToggle}
        disabled={pending}
        className="group/fl inline-flex items-center justify-center gap-2 h-11 px-6 rounded-full border border-outline-variant bg-card text-on-surface text-[14px] font-semibold transition-colors hover:border-destructive hover:text-destructive disabled:opacity-60 min-w-[140px]"
      >
        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : (
          <>
            <span className="inline-flex items-center gap-2 group-hover/fl:hidden"><BellRing className="w-4 h-4" /> Takip Ediliyor</span>
            <span className="hidden group-hover/fl:inline">Takibi Bırak</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={onToggle}
      disabled={pending}
      style={{ backgroundColor: accent }}
      className="inline-flex items-center justify-center gap-2 h-11 px-7 rounded-full text-white text-[14px] font-semibold transition-opacity hover:opacity-90 disabled:opacity-60 min-w-[140px]"
    >
      {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Bell className="w-4 h-4" /> Takip Et</>}
    </button>
  );
}
