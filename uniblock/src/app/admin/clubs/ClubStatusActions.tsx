"use client";

import { useState } from "react";
import { handleClubStatus } from "@/app/actions/admin";
import { toast } from "sonner";
import { Check, X, Ban } from "lucide-react";

interface ClubStatusActionsProps {
  clubId: string;
  status: string;
}

export default function ClubStatusActions({ clubId, status }: ClubStatusActionsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const onUpdate = async (newStatus: "ACTIVE" | "REJECTED" | "BANNED") => {
    setIsLoading(true);
    const result = await handleClubStatus(clubId, newStatus);
    if (result.success) {
      toast.success("Kulüp durumu güncellendi.");
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
          className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
          title="Onayla"
        >
          <Check className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onUpdate("REJECTED")}
          disabled={isLoading}
          className="p-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
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
          className="p-1.5 rounded-lg bg-surface-container-low text-on-surface-variant border border-outline-variant hover:bg-red-100 hover:text-red-700 hover:border-red-200 transition-all"
          title="Durdur/Engelle"
        >
          <Ban className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
        status === "REJECTED" ? "bg-red-100 text-red-700" : "bg-surface-container-high text-on-surface-variant"
      }`}>
        {status === "REJECTED" ? "Reddedildi" : "Askıda"}
      </span>
    </div>
  );
}
