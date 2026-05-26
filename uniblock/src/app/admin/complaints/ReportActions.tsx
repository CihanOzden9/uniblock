"use client";

import { useState } from "react";
import { handleReport, deleteReportContent } from "@/app/actions/admin";
import { toast } from "sonner";
import { CheckCircle, XCircle, Trash2 } from "lucide-react";

interface ReportActionsProps {
  reportId: string;
  status: string;
}

export default function ReportActions({ reportId, status }: ReportActionsProps) {
  const [loading, setLoading] = useState(false);

  if (status !== "PENDING") return null;

  async function resolve() {
    setLoading(true);
    const res = await handleReport(reportId, "RESOLVED");
    if (res.success) toast.success("Şikayet çözümlendi.");
    else toast.error(res.error);
    setLoading(false);
  }

  async function dismiss() {
    setLoading(true);
    const res = await handleReport(reportId, "DISMISSED");
    if (res.success) toast.success("Şikayet reddedildi.");
    else toast.error(res.error);
    setLoading(false);
  }

  async function removeContent() {
    if (!confirm("İçerik kalıcı olarak silinecek. Devam edilsin mi?")) return;
    setLoading(true);
    const res = await deleteReportContent(reportId);
    if (res.success) toast.success("İçerik kaldırıldı.");
    else toast.error(res.error);
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-1 justify-end">
      <button
        onClick={resolve}
        disabled={loading}
        title="Çözümlendi olarak işaretle"
        className="p-1.5 text-emerald-400 hover:bg-emerald-500/10 transition-colors disabled:opacity-40"
      >
        <CheckCircle className="w-4 h-4" />
      </button>
      <button
        onClick={removeContent}
        disabled={loading}
        title="İçeriği kaldır"
        className="p-1.5 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
      >
        <Trash2 className="w-4 h-4" />
      </button>
      <button
        onClick={dismiss}
        disabled={loading}
        title="Reddet"
        className="p-1.5 text-white/30 hover:bg-white/[0.05] transition-colors disabled:opacity-40"
      >
        <XCircle className="w-4 h-4" />
      </button>
    </div>
  );
}
