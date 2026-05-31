"use client";

import { useState } from "react";
import { cancelEvent, createAdminEvent } from "@/app/actions/admin";
import { toast } from "sonner";
import { Ban, Plus, X, Eye, Calendar, Clock, MapPin, Users, Shield } from "lucide-react";

interface Club {
  id: string;
  name: string;
}

interface EventDetail {
  id: string;
  title: string;
  description: string;
  date: string | Date;
  location: string | null;
  capacity: number | null;
  cancelled: boolean;
  cancelReason: string | null;
  organizerName: string | null;
  attendance: number;
}

export function EventDetailButton({ event }: { event: EventDetail }) {
  const [open, setOpen] = useState(false);
  const d = new Date(event.date);
  const isPast = d.getTime() < Date.now();
  const status = event.cancelled ? "İptal Edildi" : isPast ? "Tamamlandı" : "Aktif";
  const statusChip = event.cancelled ? "bg-red-100 text-red-700" : isPast ? "bg-surface-container-high text-on-surface-variant" : "bg-emerald-100 text-emerald-700";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="Detayları gör"
        className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors"
      >
        <Eye className="w-4 h-4" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setOpen(false)}>
          <div className="bg-card rounded-xl border border-outline-variant shadow-ambient-lg w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <span className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full mb-2 ${statusChip}`}>{status}</span>
                <h3 className="font-heading text-xl font-bold text-on-surface tracking-tight">{event.title}</h3>
              </div>
              <button onClick={() => setOpen(false)} className="text-on-surface-variant hover:text-on-surface shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[14px] leading-relaxed text-on-surface-variant whitespace-pre-wrap mb-6">{event.description}</p>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-surface-container-low border border-outline-variant">
                <Calendar className="w-4 h-4 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] text-on-surface-variant">Tarih</p>
                  <p className="text-[13px] font-semibold text-on-surface truncate">{d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-surface-container-low border border-outline-variant">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] text-on-surface-variant">Saat</p>
                  <p className="text-[13px] font-semibold text-on-surface truncate">{d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-surface-container-low border border-outline-variant">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] text-on-surface-variant">Konum</p>
                  <p className="text-[13px] font-semibold text-on-surface truncate">{event.location || "Belirtilmemiş"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-surface-container-low border border-outline-variant">
                <Shield className="w-4 h-4 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] text-on-surface-variant">Düzenleyen</p>
                  <p className="text-[13px] font-semibold text-on-surface truncate">{event.organizerName || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-surface-container-low border border-outline-variant col-span-2">
                <Users className="w-4 h-4 text-accent shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] text-on-surface-variant">Katılım / Kontenjan</p>
                  <p className="text-[13px] font-semibold text-on-surface">{event.attendance}{event.capacity != null ? ` / ${event.capacity}` : " (sınırsız)"}</p>
                </div>
              </div>
            </div>

            {event.cancelled && event.cancelReason && (
              <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-[12px] font-semibold text-destructive">İptal sebebi</p>
                <p className="text-[13px] text-on-surface mt-0.5">{event.cancelReason}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
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
        className="p-1.5 rounded-lg text-red-700 hover:bg-red-100 transition-colors"
      >
        <Ban className="w-4 h-4" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-card rounded-xl border border-outline-variant shadow-ambient-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg font-bold text-on-surface tracking-tight">Etkinliği İptal Et</h3>
              <button onClick={() => setOpen(false)} className="text-on-surface-variant hover:text-on-surface">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[13px] text-on-surface-variant mb-4">
              <span className="text-on-surface font-semibold">"{title}"</span> etkinliği iptal edilecek.
              Sebep kulübe duyuru olarak iletilecektir.
            </p>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="İptal sebebini yazın..."
              rows={3}
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 text-[13px] text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed resize-none mb-4"
              disabled={loading}
            />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setOpen(false)} className="px-4 py-2 rounded-full text-[13px] font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors">
                Vazgeç
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="px-5 py-2 rounded-full bg-destructive hover:bg-destructive/90 text-white text-[13px] font-semibold transition-colors disabled:opacity-50"
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
        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-primary-container text-white text-[13px] font-semibold transition-colors"
      >
        <Plus className="w-4 h-4" />
        Etkinlik Oluştur
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-card rounded-xl border border-outline-variant shadow-ambient-lg w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading text-lg font-bold text-on-surface tracking-tight">Yeni Etkinlik Oluştur</h3>
              <button onClick={() => setOpen(false)} className="text-on-surface-variant hover:text-on-surface">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="text-[13px] font-medium text-on-surface block mb-1.5">Kulüp *</label>
                <select
                  name="clubId"
                  required
                  className="w-full bg-card border border-input rounded-lg px-4 py-2.5 text-[14px] text-on-surface outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring"
                >
                  <option value="">Kulüp seçin</option>
                  {clubs.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[13px] font-medium text-on-surface block mb-1.5">Başlık *</label>
                <input
                  name="title"
                  required
                  className="w-full bg-card border border-input rounded-lg px-4 py-2.5 text-[14px] text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring"
                  placeholder="Etkinlik başlığı"
                />
              </div>
              <div>
                <label className="text-[13px] font-medium text-on-surface block mb-1.5">Açıklama *</label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  className="w-full bg-card border border-input rounded-lg px-4 py-3 text-[14px] text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring resize-none"
                  placeholder="Etkinlik açıklaması"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[13px] font-medium text-on-surface block mb-1.5">Tarih *</label>
                  <input
                    name="date"
                    type="datetime-local"
                    required
                    className="w-full bg-card border border-input rounded-lg px-4 py-2.5 text-[14px] text-on-surface outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring"
                  />
                </div>
                <div>
                  <label className="text-[13px] font-medium text-on-surface block mb-1.5">Kapasite</label>
                  <input
                    name="capacity"
                    type="number"
                    min="1"
                    className="w-full bg-card border border-input rounded-lg px-4 py-2.5 text-[14px] text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring"
                    placeholder="Sınırsız"
                  />
                </div>
              </div>
              <div>
                <label className="text-[13px] font-medium text-on-surface block mb-1.5">Konum</label>
                <input
                  name="location"
                  className="w-full bg-card border border-input rounded-lg px-4 py-2.5 text-[14px] text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring"
                  placeholder="Etkinlik yeri"
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded-full text-[13px] font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors">
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-full bg-primary hover:bg-primary-container text-white text-[13px] font-semibold transition-colors disabled:opacity-50"
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
