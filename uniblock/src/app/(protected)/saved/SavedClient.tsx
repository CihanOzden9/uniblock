"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bookmark, Calendar, MapPin, Megaphone } from "lucide-react";
import MessagingOverlay from "@/components/shared/MessagingOverlay";
import { toggleSave } from "@/app/actions/interaction";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SavedClientProps {
  user: any;
  savedPosts: any[];
  savedEvents: any[];
}

export default function SavedClient({ user, savedPosts, savedEvents }: SavedClientProps) {
  const router = useRouter();
  const [tab, setTab] = useState<"all" | "posts" | "events">("all");

  const accentOf = (c?: string | null) => c || "#fd6c00";
  const withAlpha = (hex: string, a: string) => /^#[0-9a-fA-F]{6}$/.test(hex) ? `${hex}${a}` : hex;
  const initials = (name: string) => name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  const items = useMemo(() => {
    const posts = savedPosts.map(p => ({ ...p, kind: "post" as const }));
    const events = savedEvents.map(e => ({ ...e, kind: "event" as const }));
    let merged = [...posts, ...events].sort((a, b) => +new Date(b.savedAt) - +new Date(a.savedAt));
    if (tab === "posts") merged = merged.filter(i => i.kind === "post");
    if (tab === "events") merged = merged.filter(i => i.kind === "event");
    return merged;
  }, [savedPosts, savedEvents, tab]);

  async function handleRemove(item: any) {
    const res = await toggleSave(item.kind === "post" ? { postId: item.id } : { eventId: item.id }, user.id);
    if (res.success) {
      toast.success("Kayıt kaldırıldı.");
      router.refresh();
    } else {
      toast.error(res.error);
    }
  }

  const total = savedPosts.length + savedEvents.length;

  const segBtn = (active: boolean) =>
    `px-5 py-2 rounded-full text-[14px] font-medium transition-colors ${active ? "bg-primary text-white" : "text-on-surface-variant hover:text-on-surface"}`;

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar user={user} />

      <main className="flex-1 pt-20">
        {/* Hero */}
        <header className="w-full bg-surface-container-low py-12 px-margin-mobile md:px-margin-desktop border-b border-outline-variant">
          <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div>
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-primary" />
                <span className="text-[12px] font-semibold tracking-wide uppercase text-primary">Kaydettiklerim</span>
              </div>
              <h1 className="font-heading text-[clamp(32px,4.5vw,48px)] font-bold tracking-tight leading-[1.1] mt-2 text-on-surface">
                Kaydettiğin İçerikler
              </h1>
              <p className="text-[16px] leading-[1.6] text-on-surface-variant max-w-[640px] mt-2">
                Sonra bakmak için kaydettiğin duyuru ve etkinlikler burada toplanır.
              </p>
            </div>

            <div className="flex gap-1 bg-surface p-1 rounded-full border border-outline-variant shrink-0 w-fit">
              <button onClick={() => setTab("all")} className={segBtn(tab === "all")}>Tümü</button>
              <button onClick={() => setTab("posts")} className={segBtn(tab === "posts")}>Duyurular</button>
              <button onClick={() => setTab("events")} className={segBtn(tab === "events")}>Etkinlikler</button>
            </div>
          </div>
        </header>

        <div className="max-w-[1100px] mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-lg">
          {items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              {items.map((item) => {
                const accent = accentOf(item.color);
                const isEvent = item.kind === "event";
                return (
                  <article key={item.kind + "-" + item.id} style={{ borderLeftColor: accent }} className="bg-card rounded-xl border border-outline-variant border-l-4 shadow-ambient p-stack-md flex flex-col transition-all hover:shadow-ambient-lg hover:-translate-y-0.5">
                    <div className="flex items-center gap-3 mb-3">
                      <div style={{ backgroundColor: withAlpha(accent, "26"), color: accent }} className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[13px] shrink-0">{initials(item.source)}</div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[14px] font-semibold text-on-surface truncate">{item.source}</p>
                        <p className="text-[12px] text-on-surface-variant">{new Date(item.savedAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long" })} tarihinde kaydettin</p>
                      </div>
                      <span style={{ backgroundColor: withAlpha(accent, "26"), color: accent }} className="text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 flex items-center gap-1">
                        {isEvent ? <Calendar className="w-3 h-3" /> : <Megaphone className="w-3 h-3" />}
                        {isEvent ? "Etkinlik" : "Duyuru"}
                      </span>
                    </div>

                    <h3 className="font-heading text-[18px] font-bold tracking-tight leading-snug mb-2 text-on-surface break-words overflow-wrap-anywhere">{item.title}</h3>
                    <p className="text-[15px] leading-[1.6] text-on-surface-variant mb-4 line-clamp-3 break-words overflow-wrap-anywhere flex-1">{item.excerpt}</p>

                    <div className="flex items-center justify-between pt-3 border-t border-outline-variant gap-3">
                      <span className="text-[13px] text-on-surface-variant flex items-center gap-1.5 min-w-0">
                        {isEvent
                          ? <><MapPin className="w-4 h-4 shrink-0" /> <span className="truncate">{item.location || new Date(item.date).toLocaleDateString("tr-TR")}</span></>
                          : <Link href="/feed" className="hover:text-primary transition-colors">Akışta gör →</Link>}
                      </span>
                      <button onClick={() => handleRemove(item)} title="Kaydı kaldır" className="flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:text-destructive transition-colors shrink-0">
                        <Bookmark className="w-4 h-4 fill-current" /> Kaldır
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-outline-variant shadow-ambient p-16 text-center">
              <div className="w-16 h-16 rounded-full bg-primary-fixed mx-auto mb-5 flex items-center justify-center">
                <Bookmark className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-bold tracking-tight mb-1.5">
                {total === 0 ? "Henüz Bir Şey Kaydetmedin" : "Bu Sekmede Kayıt Yok"}
              </h3>
              <p className="text-[14px] text-on-surface-variant mb-6">Akıştaki duyuru ve etkinliklerdeki <span className="inline-flex items-center"><Bookmark className="w-3.5 h-3.5 mx-0.5" /></span> simgesine dokunarak içerikleri buraya kaydedebilirsin.</p>
              <Link href="/feed">
                <Button className="rounded-full text-[14px] font-semibold">Akışa Git</Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-auto bg-card border-t border-outline-variant px-margin-desktop py-stack-lg shrink-0">
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="font-heading font-extrabold text-[20px] text-primary">
            Uni<span className="text-accent">.</span>Block
          </div>
          <p className="text-[13px] text-on-surface-variant">© 2026 Kampüs Haber Ağı</p>
        </div>
      </footer>

      <MessagingOverlay />
    </div>
  );
}
