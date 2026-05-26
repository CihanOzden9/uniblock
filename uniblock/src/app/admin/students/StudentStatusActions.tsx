"use client";

import { useState } from "react";
import { handleUserStatus } from "@/app/actions/admin";
import { toast } from "sonner";
import { Check, X, Ban } from "lucide-react";

interface StudentStatusActionsProps {
  userId: string;
  status: string;
}

export default function StudentStatusActions({ userId, status }: StudentStatusActionsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const onUpdate = async (newStatus: "ACTIVE" | "REJECTED" | "BANNED") => {
    setIsLoading(true);
    const result = await handleUserStatus(userId, newStatus);
    if (result.success) {
      toast.success("Öğrenci durumu güncellendi.");
    } else {
      toast.error(result.error);
    }
    setIsLoading(false);
  };

  if (status === "PENDING") {
    return (
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => onUpdate("ACTIVE")}
          disabled={isLoading}
          className="p-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
          title="Onayla"
        >
          <Check className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onUpdate("REJECTED")}
          disabled={isLoading}
          className="p-1.5 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
          title="Reddet"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  if (status === "ACTIVE") {
    return (
      <div className="flex items-center justify-center">
        <button
          onClick={() => onUpdate("BANNED")}
          disabled={isLoading}
          className="p-1.5 bg-white/[0.04] text-white/30 border border-white/[0.06] hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all"
          title="Engelle"
        >
          <Ban className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <span className={`text-[9px] font-black px-2 py-0.5 uppercase tracking-widest ${
        status === "REJECTED" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-white/[0.04] text-white/30 border border-white/[0.06]"
      }`}>
        {status === "REJECTED" ? "Reddedildi" : "Engelli"}
      </span>
    </div>
  );
}
