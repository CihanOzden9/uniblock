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
          title="Engelle"
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
        {status === "REJECTED" ? "Reddedildi" : "Engelli"}
      </span>
    </div>
  );
}
