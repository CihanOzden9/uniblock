"use client";

import { useState } from "react";
import { cancelEvent, createAdminEvent } from "@/app/actions/admin";
import { toast } from "sonner";
import { Ban, Plus, X } from "lucide-react";

interface Club {
  id: string;
  name: string;
}

export function CancelEventButton({ eventId, title }: { eventId: string; title: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  async function onConfirm() {
    if (!reason.trim()) { toast.error("Sebep belirtmelisiniz."); return; }
    setLoading(true);
    const res = await cancelEvent(eventId, reason.trim());
    if (res.success) {
      toast.success("Etkinlik iptal edildi ve kulübe bildirildi.");
      setOpen(false);
      setReason("");
    } else {
      toast.error(res.error);
    }
    setLoading(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="Etkinliği iptal et"
        className="p-1.5 text-red-400 hover:bg-red-500/10 transition-colors"
      >
        <Ban className="w-4 h-4" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#181a24] border border-white/[0.08] w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-bold text-white uppercase tracking-wider">Etkinliği İptal Et</h3>
              <button onClick={() => setOpen(false)} className="text-white/30 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[12px] text-white/40 mb-4">
              <span className="text-white font-semibold">"{title}"</span> etkinliği iptal edilecek.
              Sebep kulübe duyuru olarak iletilecektir.
            </p>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="İptal sebebini yazın..."
              rows={3}
              className="w-full bg-[#0f1117] border border-white/[0.08] px-4 py-3 text-[13px] text-white placeholder:text-white/20 focus:outline-none focus:border-red-500/50 resize-none mb-4"
              disabled={loading}
            />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setOpen(false)} className="px-4 py-2 text-[12px] text-white/40 hover:text-white transition-colors">
                Vazgeç
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-[12px] font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {loading ? "İptal ediliyor..." : "İptal Et"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function CreateEventButton({ clubs }: { clubs: Club[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await createAdminEvent(formData);
    if (res.success) {
      toast.success("Etkinlik oluşturuldu.");
      setOpen(false);
      (e.target as HTMLFormElement).reset();
    } else {
      toast.error(res.error);
    }
    setLoading(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[12px] font-bold uppercase tracking-wider transition-colors"
      >
        <Plus className="w-4 h-4" />
        Etkinlik Oluştur
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#181a24] border border-white/[0.08] w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[14px] font-bold text-white uppercase tracking-wider">Yeni Etkinlik Oluştur</h3>
              <button onClick={() => setOpen(false)} className="text-white/30 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1.5">Kulüp *</label>
                <select
                  name="clubId"
                  required
                  className="w-full bg-[#0f1117] border border-white/[0.08] px-4 py-2.5 text-[13px] text-white focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="">Kulüp seçin</option>
                  {clubs.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1.5">Başlık *</label>
                <input
                  name="title"
                  required
                  className="w-full bg-[#0f1117] border border-white/[0.08] px-4 py-2.5 text-[13px] text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50"
                  placeholder="Etkinlik başlığı"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1.5">Açıklama *</label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  className="w-full bg-[#0f1117] border border-white/[0.08] px-4 py-3 text-[13px] text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 resize-none"
                  placeholder="Etkinlik açıklaması"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1.5">Tarih *</label>
                  <input
                    name="date"
                    type="datetime-local"
                    required
                    className="w-full bg-[#0f1117] border border-white/[0.08] px-4 py-2.5 text-[13px] text-white focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1.5">Kapasite</label>
                  <input
                    name="capacity"
                    type="number"
                    min="1"
                    className="w-full bg-[#0f1117] border border-white/[0.08] px-4 py-2.5 text-[13px] text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50"
                    placeholder="Sınırsız"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1.5">Konum</label>
                <input
                  name="location"
                  className="w-full bg-[#0f1117] border border-white/[0.08] px-4 py-2.5 text-[13px] text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50"
                  placeholder="Etkinlik yeri"
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-[12px] text-white/40 hover:text-white transition-colors">
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[12px] font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {loading ? "Oluşturuluyor..." : "Oluştur"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
