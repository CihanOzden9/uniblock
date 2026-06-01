import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import MessagingOverlay from "@/components/shared/MessagingOverlay";
import JoinLeaveButton from "@/components/shared/JoinLeaveButton";
import { Users, Calendar, Globe, Mail, Megaphone, Clock, Crown, Camera, AtSign, Briefcase } from "lucide-react";

interface Person { name: string; department?: string | null; image?: string | null; role?: string }
interface EventItem { id: string; title: string; description: string; date: string | Date; location?: string | null }
interface PostItem { id: string; title: string; content: string; createdAt: string | Date }

export interface CommunityDetailData {
  entity: "club" | "team";
  id: string;
  name: string;
  description?: string | null;
  color?: string | null;
  website?: string | null;
  contactEmail?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  createdAt: string | Date;
  memberCount: number;
  leader: Person;
  board: Person[];
  upcomingEvents: EventItem[];
  pastEvents: EventItem[];
  posts: PostItem[];
}

const initials = (name: string) => name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
const withAlpha = (hex: string, a: string) => /^#[0-9a-fA-F]{6}$/.test(hex) ? `${hex}${a}` : hex;

export default function CommunityDetail({
  data, user, membershipStatus, isLeader,
}: {
  data: CommunityDetailData;
  user: any;
  membershipStatus: "APPROVED" | "PENDING" | "REJECTED" | null;
  isLeader: boolean;
}) {
  const accent = data.color || "#fd6c00";
  const leaderTitle = data.entity === "club" ? "Başkan" : "Kaptan";
  const fmtDate = (d: string | Date) => new Date(d).toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
  const fmtTime = (d: string | Date) => new Date(d).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar user={user} />

      <main className="flex-1 pt-20">
        <div className="max-w-[1200px] mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-lg">
          {/* Kapak + başlık */}
          <div className="bg-card rounded-2xl border border-outline-variant shadow-ambient overflow-hidden">
            <div className="h-44 md:h-56 relative" style={{ background: `linear-gradient(135deg, ${accent}, #0b1c30)` }}>
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #ffffff 1px, transparent 0)", backgroundSize: "22px 22px" }} />
            </div>
            <div className="px-6 md:px-8 pb-6 flex flex-col sm:flex-row sm:items-end gap-5">
              <div className="-mt-12 w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-card border border-outline-variant shadow-ambient flex items-center justify-center shrink-0 relative z-10" style={{ color: accent }}>
                <span className="font-heading font-extrabold text-3xl">{initials(data.name)}</span>
              </div>
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 sm:pt-0">
                <div className="min-w-0">
                  <h1 className="font-heading text-[clamp(22px,3.2vw,32px)] font-bold tracking-tight text-on-surface leading-tight break-words">{data.name}</h1>
                  <p className="text-[14px] text-on-surface-variant flex items-center gap-1.5 mt-1">
                    <Users className="w-4 h-4" /> {data.memberCount} üye
                  </p>
                </div>
                {user && (
                  <div className="shrink-0">
                    <JoinLeaveButton entity={data.entity} id={data.id} userId={user.id} status={membershipStatus} color={accent} isLeader={isLeader} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* İki kolon */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mt-stack-lg">
            {/* Sol: Hakkında + Yönetim Kurulu */}
            <aside className="lg:col-span-4 space-y-stack-md">
              <div className="bg-card rounded-xl border border-outline-variant shadow-ambient p-stack-md">
                <h2 className="font-heading text-xl font-bold tracking-tight text-on-surface mb-4">Hakkında</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-[18px] h-[18px] text-outline shrink-0" />
                    <span className="text-[14px] text-on-surface">Kuruluş: {new Date(data.createdAt).getFullYear()}</span>
                  </div>
                  {data.contactEmail && (
                    <a href={`mailto:${data.contactEmail}`} className="flex items-center gap-3 text-[14px] text-on-surface hover:text-primary transition-colors">
                      <Mail className="w-[18px] h-[18px] text-outline shrink-0" />
                      <span className="truncate">{data.contactEmail}</span>
                    </a>
                  )}

                  {/* Sosyal Medya */}
                  {(() => {
                    const socials = [
                      { href: data.website, Icon: Globe, label: "Web sitesi" },
                      { href: data.instagram, Icon: Camera, label: "Instagram" },
                      { href: data.twitter, Icon: AtSign, label: "X / Twitter" },
                      { href: data.linkedin, Icon: Briefcase, label: "LinkedIn" },
                    ].filter((s) => !!s.href);
                    if (socials.length === 0) return null;
                    return (
                      <div className="pt-2">
                        <p className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wide mb-2.5">Sosyal Medya</p>
                        <div className="flex flex-wrap items-center gap-2.5">
                          {socials.map((s, i) => (
                            <a
                              key={i}
                              href={s.href as string}
                              target="_blank"
                              rel="noreferrer"
                              title={s.label}
                              aria-label={s.label}
                              className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-75"
                              style={{ backgroundColor: withAlpha(accent, "1A"), color: accent }}
                            >
                              <s.Icon className="w-[18px] h-[18px]" />
                            </a>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div className="bg-card rounded-xl border border-outline-variant shadow-ambient p-stack-md">
                <h2 className="font-heading text-xl font-bold tracking-tight text-on-surface mb-4">Yönetim Kurulu</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[13px] shrink-0" style={{ backgroundColor: withAlpha(accent, "26"), color: accent }}>{initials(data.leader.name)}</div>
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold text-on-surface truncate flex items-center gap-1.5">{data.leader.name} <Crown className="w-3.5 h-3.5 text-accent" /></p>
                      <p className="text-[12px] text-on-surface-variant">{leaderTitle}</p>
                    </div>
                  </div>
                  {data.board.map((m, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold text-[13px] shrink-0">{initials(m.name)}</div>
                      <div className="min-w-0">
                        <p className="text-[14px] font-semibold text-on-surface truncate">{m.name}</p>
                        <p className="text-[12px] text-on-surface-variant truncate">{m.role}</p>
                      </div>
                    </div>
                  ))}
                  {data.board.length === 0 && (
                    <p className="text-[13px] text-on-surface-variant">Henüz yönetim kadrosu atanmamış.</p>
                  )}
                </div>
              </div>
            </aside>

            {/* Sağ: Hakkımızda + Etkinlikler + Duyurular */}
            <section className="lg:col-span-8 space-y-stack-lg">
              <div>
                <h2 className="font-heading text-2xl font-bold tracking-tight text-on-surface mb-3">Hakkımızda</h2>
                <p className="text-[16px] leading-[1.8] text-on-surface-variant whitespace-pre-wrap">
                  {data.description || "Bu topluluk henüz bir açıklama eklememiş."}
                </p>
              </div>

              {/* Yaklaşan Etkinlikler */}
              <div>
                <h2 className="font-heading text-2xl font-bold tracking-tight text-on-surface mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" style={{ color: accent }} /> Yaklaşan Etkinlikler
                </h2>
                {data.upcomingEvents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter">
                    {data.upcomingEvents.map((ev) => (
                      <article key={ev.id} className="bg-card rounded-xl border border-outline-variant shadow-ambient overflow-hidden flex flex-col transition-all hover:shadow-ambient-lg hover:-translate-y-0.5">
                        <div className="h-32 relative flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${withAlpha(accent, "33")}, ${withAlpha(accent, "10")})` }}>
                          <Calendar className="w-10 h-10" style={{ color: accent }} />
                          <span className="absolute top-3 right-3 bg-card text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm" style={{ color: accent }}>{fmtDate(ev.date)}</span>
                        </div>
                        <div className="p-stack-md flex flex-col flex-1">
                          <h3 className="font-heading text-[16px] font-bold tracking-tight text-on-surface mb-1.5 break-words">{ev.title}</h3>
                          <p className="text-[13px] leading-[1.6] text-on-surface-variant line-clamp-2 mb-4 flex-1">{ev.description}</p>
                          <div className="flex items-center justify-between pt-3 border-t border-outline-variant">
                            <span className="text-[12px] text-on-surface-variant flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {fmtTime(ev.date)}</span>
                            <Link href="/events" className="text-[13px] font-semibold transition-colors hover:opacity-80" style={{ color: accent }}>Detaylar</Link>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="bg-card rounded-xl border border-dashed border-outline-variant p-8 text-center text-[14px] text-on-surface-variant">Yaklaşan etkinlik yok.</div>
                )}
              </div>

              {/* Geçmiş Etkinlikler */}
              {data.pastEvents.length > 0 && (
                <div>
                  <h2 className="font-heading text-2xl font-bold tracking-tight text-on-surface mb-4">Geçmiş Etkinlikler</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-gutter">
                    {data.pastEvents.map((ev) => (
                      <div key={ev.id} className="rounded-xl overflow-hidden border border-outline-variant shadow-ambient relative h-36 flex items-end p-4" style={{ background: `linear-gradient(135deg, ${accent}, #0b1c30)` }}>
                        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #ffffff 1px, transparent 0)", backgroundSize: "20px 20px" }} />
                        <div className="relative">
                          <p className="text-[11px] text-white/70 font-semibold">{fmtDate(ev.date)}</p>
                          <h4 className="text-[14px] font-bold text-white leading-tight line-clamp-2">{ev.title}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Son Duyurular */}
              {data.posts.length > 0 && (
                <div>
                  <h2 className="font-heading text-2xl font-bold tracking-tight text-on-surface mb-4 flex items-center gap-2">
                    <Megaphone className="w-5 h-5" style={{ color: accent }} /> Son Duyurular
                  </h2>
                  <div className="flex flex-col gap-3">
                    {data.posts.map((p) => (
                      <div key={p.id} className="bg-card rounded-xl border border-outline-variant shadow-ambient p-stack-md">
                        <div className="flex items-center justify-between gap-3 mb-1.5">
                          <h3 className="font-heading text-[16px] font-bold tracking-tight text-on-surface break-words">{p.title}</h3>
                          <span className="text-[12px] text-on-surface-variant shrink-0">{new Date(p.createdAt).toLocaleDateString("tr-TR")}</span>
                        </div>
                        <p className="text-[14px] leading-[1.6] text-on-surface-variant line-clamp-2">{p.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <footer className="mt-auto bg-card border-t border-outline-variant px-margin-desktop py-stack-lg shrink-0">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="font-heading font-extrabold text-[20px] text-primary">Uni<span className="text-accent">.</span>Block</div>
          <div className="flex gap-8 text-[14px] font-medium text-on-surface-variant">
            <Link href="#" className="hover:text-primary transition-colors">Hakkımızda</Link>
            <Link href="#" className="hover:text-primary transition-colors">İletişim</Link>
            <Link href="#" className="hover:text-primary transition-colors">Gizlilik</Link>
          </div>
          <p className="text-[13px] text-on-surface-variant">© 2026 Kampüs Haber Ağı</p>
        </div>
      </footer>

      <MessagingOverlay />
    </div>
  );
}
