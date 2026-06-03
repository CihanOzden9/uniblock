"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserPlus, Check, Loader2 } from "lucide-react";
import { requestJoinClub, leaveClub } from "@/app/actions/club";
import { requestJoinTeam, leaveTeam } from "@/app/actions/team";

interface JoinLeaveButtonProps {
  entity: "club" | "team";
  id: string;
  userId: string;
  status: "APPROVED" | "PENDING" | "REJECTED" | null;
  color?: string | null;
  isLeader?: boolean;
}

export default function JoinLeaveButton({ entity, id, userId, status, color, isLeader }: JoinLeaveButtonProps) {
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const accent = color || "#fd6c00";
  const join = entity === "club" ? requestJoinClub : requestJoinTeam;
  const leave = entity === "club" ? leaveClub : leaveTeam;
  const word = entity === "club" ? "kulüpten" : "takımdan";

  async function onJoin() {
    setPending(true);
    const r = await join(id, userId);
    if (r.success) { toast.success("Katılım isteğin gönderildi!"); router.refresh(); }
    else toast.error(r.error);
    setPending(false);
  }

  async function onLeave() {
    if (!confirm(`Bu ${word} ayrılmak istediğine emin misin?`)) return;
    setPending(true);
    const r = await leave(id, userId);
    if (r.success) { toast.success("Ayrıldın."); router.refresh(); }
    else toast.error(r.error);
    setPending(false);
  }

  async function onCancel() {
    setPending(true);
    const r = await leave(id, userId);
    if (r.success) { toast.success("Katılım isteği iptal edildi."); router.refresh(); }
    else toast.error(r.error);
    setPending(false);
  }

  if (isLeader) {
    return (
      <span className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-primary-fixed text-primary text-[14px] font-semibold">
        <Check className="w-4 h-4" /> {entity === "club" ? "Başkansın" : "Kaptansın"}
      </span>
    );
  }

  if (status === "APPROVED") {
    return (
      <button
        onClick={onLeave}
        disabled={pending}
        className="group/jl inline-flex items-center justify-center gap-2 h-11 px-6 rounded-full border border-outline-variant bg-card text-on-surface text-[14px] font-semibold transition-colors hover:border-destructive hover:text-destructive disabled:opacity-60 min-w-[120px]"
      >
        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : (
          <span className="grid">
            <span className="col-start-1 row-start-1 flex items-center justify-center gap-2 transition-opacity group-hover/jl:opacity-0"><Check className="w-4 h-4" /> Üyesin</span>
            <span className="col-start-1 row-start-1 flex items-center justify-center opacity-0 transition-opacity group-hover/jl:opacity-100">Ayrıl</span>
          </span>
        )}
      </button>
    );
  }

  if (status === "PENDING") {
    return (
      <button
        onClick={onCancel}
        disabled={pending}
        className="group/jl inline-flex items-center justify-center h-11 px-6 rounded-full border border-outline-variant bg-card text-on-surface-variant text-[14px] font-semibold transition-colors hover:border-destructive hover:text-destructive disabled:opacity-60 min-w-[150px]"
      >
        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : (
          <span className="grid">
            <span className="col-start-1 row-start-1 flex items-center justify-center transition-opacity group-hover/jl:opacity-0">İstek Gönderildi</span>
            <span className="col-start-1 row-start-1 flex items-center justify-center opacity-0 transition-opacity group-hover/jl:opacity-100">İsteği İptal Et</span>
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={onJoin}
      disabled={pending}
      style={{ backgroundColor: accent }}
      className="inline-flex items-center justify-center gap-2 h-11 px-7 rounded-full text-white text-[14px] font-semibold transition-opacity hover:opacity-90 disabled:opacity-60 min-w-[120px]"
    >
      {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><UserPlus className="w-4 h-4" /> Katıl</>}
    </button>
  );
}
