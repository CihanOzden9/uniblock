"use client";

import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Heart, MessageSquare, Share2, User, Users, Calendar, Bookmark,
  BarChart3, AlertTriangle, Trash2, Edit2, Search, MapPin
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { likePost, commentPost, voteSurvey, editComment, deleteComment, reportComment } from "@/app/actions/interaction";
import { toast } from "sonner";
import MessagingOverlay from "@/components/shared/MessagingOverlay";

export default function FeedClient({
  initialPosts,
  topClubs,
  initialSurveys,
  currentUser
}: {
  initialPosts: any[],
  topClubs: any[],
  initialSurveys: any[],
  currentUser: any
}) {
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  // Gerçek veriyi bileşenin beklediği yapıya eşliyoruz
  const feedPosts = useMemo(() => initialPosts.map(post => ({
    ...post,
    date: new Date(post.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long" }),
    source: post.club?.name || post.team?.name || post.author?.name || "Bilinmeyen Kaynak",
    category: post.type === "NEWS" ? "Haber" : "Duyuru",
    excerpt: post.content.substring(0, 160) + (post.content.length > 160 ? "…" : "")
  })), [initialPosts]);

  const visiblePosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return feedPosts;
    return feedPosts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q) ||
      p.source.toLowerCase().includes(q)
    );
  }, [feedPosts, searchQuery]);

  // Polling: Her 30 saniyede bir veriyi sessizce yeniler
  useEffect(() => {
    const interval = setInterval(() => router.refresh(), 30000);
    return () => clearInterval(interval);
  }, [router]);

  // Açık post detayını yeni veriyle senkronize tutar
  useEffect(() => {
    if (selectedPost) {
      const updatedPost = feedPosts.find(p => p.id === selectedPost.id);
      if (updatedPost) setSelectedPost(updatedPost);
    }
  }, [feedPosts, selectedPost]);

  async function handleLike(e: React.MouseEvent, postId: string) {
    e.stopPropagation();
    if (!currentUser) return toast.error("Giriş yapmalısınız.");
    const res = await likePost(postId, currentUser.id);
    if (res.success) router.refresh();
  }

  async function handleVote(surveyId: string, optionId: string) {
    if (!currentUser) return toast.error("Giriş yapmalısınız.");
    setIsPending(true);
    const res = await voteSurvey(surveyId, optionId, currentUser.id);
    if (res.success) {
      toast.success("Oyunuz kaydedildi!");
      router.refresh();
    } else {
      toast.error(res.error);
    }
    setIsPending(false);
  }

  async function handleCommentSubmit() {
    if (!currentUser || !selectedPost) return;
    if (!commentText.trim()) return;
    setIsPending(true);
    const res = await commentPost(selectedPost.id, currentUser.id, commentText);
    if (res.success) {
      setCommentText("");
      toast.success("Yorum eklendi!");
      router.refresh();
    }
    setIsPending(false);
  }

  async function handleEditComment(commentId: string) {
    if (!editCommentText.trim()) return;
    setIsPending(true);
    const res = await editComment(commentId, currentUser.id, editCommentText);
    if (res.success) {
      setEditingCommentId(null);
      toast.success("Yorum güncellendi.");
      router.refresh();
    }
    setIsPending(false);
  }

  async function handleDeleteComment(commentId: string) {
    if (!confirm("Yorumu silmek istediğinize emin misiniz?")) return;
    const res = await deleteComment(commentId, currentUser.id);
    if (res.success) {
      toast.success("Yorum silindi.");
      router.refresh();
    }
  }

  async function handleReportComment(commentId: string) {
    const reason = prompt("Şikayet nedeninizi belirtin:");
    if (!reason) return;
    const res = await reportComment(commentId, currentUser.id, reason);
    if (res.success) toast.success("Şikayetiniz iletildi.");
  }

  const sourceInitials = (name: string) =>
    name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar user={currentUser} />

      <main className="flex-1 pt-20">
        {/* ===== Hero Bandı ===== */}
        <header className="w-full bg-surface-container-low py-16 px-margin-mobile md:px-margin-desktop relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, var(--edu-blue) 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="max-w-[1280px] mx-auto relative z-10 text-center">
            <h1 className="font-heading text-[clamp(36px,5vw,48px)] font-bold tracking-tight leading-[1.1] text-on-surface mb-3">
              Kampüsünde Neler Oluyor?
            </h1>
            <p className="text-[18px] leading-[1.6] text-on-surface-variant max-w-2xl mx-auto mb-8">
              Topluluklara katıl, etkinlikleri keşfet ve sesini duyur. Kampüs hayatının merkezinde ol.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 max-w-xl mx-auto">
              <div className="relative w-full">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Akışta ara…"
                  className="w-full pl-12 pr-6 py-4 bg-surface border border-outline-variant rounded-full shadow-sm text-[15px] text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed transition-all"
                />
              </div>
            </div>
          </div>
        </header>

        {/* ===== 3 Kolonlu Grid ===== */}
        <div className="max-w-[1280px] mx-auto w-full px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-12 gap-gutter py-stack-lg">

          {/* --- Sol kenar: Sana Özel --- */}
          <aside className="md:col-span-3 space-y-stack-md hidden md:block">
            <div className="bg-card rounded-xl p-stack-md shadow-ambient border border-outline-variant sticky top-24">
              <h2 className="font-heading text-[22px] font-bold tracking-tight text-on-surface mb-4">Sana Özel</h2>
              <h3 className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider mb-3">Kısayollar</h3>
              <ul className="space-y-1">
                <li>
                  <Link href="/clubs" className="flex items-center gap-3 text-[15px] text-on-surface hover:text-primary hover:bg-surface-container-low rounded-lg px-2.5 py-2 transition-colors">
                    <Users className="w-[18px] h-[18px] text-outline" /> Takip Ettiğim Topluluklar
                  </Link>
                </li>
                <li>
                  <Link href="/events" className="flex items-center gap-3 text-[15px] text-on-surface hover:text-primary hover:bg-surface-container-low rounded-lg px-2.5 py-2 transition-colors">
                    <Calendar className="w-[18px] h-[18px] text-outline" /> Yaklaşan Etkinliklerim
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="flex items-center gap-3 text-[15px] text-on-surface hover:text-primary hover:bg-surface-container-low rounded-lg px-2.5 py-2 transition-colors">
                    <Bookmark className="w-[18px] h-[18px] text-outline" /> Kaydettiklerim
                  </Link>
                </li>
              </ul>
            </div>
          </aside>

          {/* --- Orta: Akış --- */}
          <section className="md:col-span-6 space-y-stack-md min-w-0">
            <h2 className="font-heading text-[22px] font-bold tracking-tight text-on-surface hidden md:block">Akış</h2>

            {visiblePosts.length > 0 ? visiblePosts.map((item) => {
              const liked = item.interactions?.some((i: any) => i.type === "LIKE" && i.userId === currentUser?.id);
              const likeCount = item.interactions?.filter((i: any) => i.type === "LIKE").length || 0;
              const commentCount = item.interactions?.filter((i: any) => i.type === "COMMENT").length || 0;
              return (
                <article
                  key={item.id}
                  onClick={() => setSelectedPost(item)}
                  className="bg-card rounded-xl border border-outline-variant shadow-ambient p-stack-md transition-all hover:shadow-ambient-lg hover:-translate-y-0.5 cursor-pointer group overflow-hidden"
                >
                  {/* Üst: avatar + kaynak + kategori */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold text-[13px] shrink-0">
                      {sourceInitials(item.source)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-semibold text-on-surface truncate">{item.source}</p>
                      <p className="text-[12px] text-on-surface-variant">{item.date}</p>
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                      item.category === "Haber"
                        ? "bg-primary-fixed text-primary"
                        : "bg-accent/15 text-[color:var(--community-orange-deep)]"
                    }`}>
                      {item.category}
                    </span>
                  </div>

                  <h3 className="font-heading text-[18px] font-bold tracking-tight leading-snug mb-2 text-on-surface group-hover:text-primary transition-colors break-words overflow-wrap-anywhere">
                    {item.title}
                  </h3>
                  <p className="text-[15px] leading-[1.6] text-on-surface-variant mb-4 line-clamp-3 break-words overflow-wrap-anywhere">
                    {item.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-outline-variant">
                    <div className="flex items-center gap-4">
                      <button onClick={(e) => handleLike(e, item.id)} className="flex items-center gap-1.5 group/btn">
                        <Heart className={`w-[18px] h-[18px] transition-colors ${liked ? "fill-red-500 text-red-500" : "text-on-surface-variant group-hover/btn:text-red-500"}`} />
                        <span className="text-[13px] font-semibold text-on-surface-variant">{likeCount}</span>
                      </button>
                      <span className="flex items-center gap-1.5">
                        <MessageSquare className="w-[18px] h-[18px] text-on-surface-variant" />
                        <span className="text-[13px] font-semibold text-on-surface-variant">{commentCount}</span>
                      </span>
                    </div>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-full hover:bg-surface-container-high transition-colors"
                    >
                      <Share2 className="w-[18px] h-[18px] text-on-surface-variant" />
                    </button>
                  </div>
                </article>
              );
            }) : (
              <div className="bg-card rounded-xl border border-outline-variant shadow-ambient p-12 flex flex-col items-center justify-center text-center min-h-[280px]">
                <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center mb-5">
                  <Search className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-bold tracking-tight mb-1.5">
                  {searchQuery ? "Sonuç Bulunamadı" : "Akış Boş"}
                </h3>
                <p className="text-[14px] text-on-surface-variant max-w-sm">
                  {searchQuery
                    ? "Aradığın kriterlere uygun içerik bulamadık. Farklı bir anahtar kelime dene."
                    : "Şu an akışta gösterilecek bir içerik yok. Toplulukları takip etmeye başla."}
                </p>
                {searchQuery && (
                  <Button onClick={() => setSearchQuery("")} variant="outline" className="mt-6 rounded-full border-outline-variant text-[14px] font-semibold">
                    Aramayı Temizle
                  </Button>
                )}
              </div>
            )}
          </section>

          {/* --- Sağ kenar: Anketler + Popüler Topluluklar --- */}
          <aside className="md:col-span-3 space-y-stack-md hidden lg:block">
            {/* Aktif Anketler */}
            {initialSurveys.length > 0 && initialSurveys.slice(0, 2).map((survey) => {
              const totalVotes = survey.interactions?.length || 0;
              const hasVoted = survey.interactions?.some((i: any) => i.userId === currentUser?.id);
              return (
                <div key={survey.id} className="bg-card rounded-xl p-stack-md shadow-ambient border border-outline-variant">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="w-5 h-5 text-accent" />
                    <h2 className="font-heading text-[16px] font-bold text-on-surface">Aktif Anket</h2>
                  </div>
                  <p className="text-[14px] font-medium text-on-surface mb-3.5">{survey.question}</p>
                  <div className="space-y-2.5">
                    {survey.options.map((option: any) => {
                      const optionVotes = survey.interactions?.filter((i: any) => i.optionId === option.id).length || 0;
                      const pct = totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0;
                      const isMyChoice = survey.interactions?.some((i: any) => i.userId === currentUser?.id && i.optionId === option.id);
                      return (
                        <button
                          key={option.id}
                          onClick={() => !hasVoted && !isPending && handleVote(survey.id, option.id)}
                          disabled={hasVoted}
                          className={`w-full relative overflow-hidden flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-colors ${
                            isMyChoice ? "border-accent bg-accent/5" : "border-outline-variant hover:bg-surface-container-low"
                          } ${hasVoted ? "cursor-default" : "cursor-pointer"}`}
                        >
                          {hasVoted && (
                            <div className="absolute inset-y-0 left-0 bg-accent/15 transition-all duration-700" style={{ width: `${pct}%` }} />
                          )}
                          <span className="relative z-10 flex-1 text-[13px] font-medium text-on-surface">{option.text}</span>
                          {hasVoted && <span className="relative z-10 text-[12px] font-bold text-[color:var(--community-orange-deep)]">%{pct}</span>}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-3 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> {totalVotes} katılımcı · {survey.club?.name || survey.team?.name}
                  </p>
                </div>
              );
            })}

            {/* Popüler Topluluklar */}
            <div className="bg-card rounded-xl p-stack-md shadow-ambient border border-outline-variant">
              <h2 className="font-heading text-[16px] font-bold text-on-surface mb-4">Popüler Topluluklar</h2>
              <div className="space-y-3.5">
                {topClubs.length > 0 ? topClubs.map((club, idx) => (
                  <div key={club.id ?? idx} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[13px] shrink-0 ${
                        idx === 0 ? "bg-accent/15 text-[color:var(--community-orange-deep)]" : "bg-primary-fixed text-primary"
                      }`}>
                        {sourceInitials(club.name)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-[14px] font-semibold text-on-surface truncate">{club.name}</h4>
                        <span className="text-[12px] text-on-surface-variant">{club.performanceScore} P</span>
                      </div>
                    </div>
                    <Link href="/clubs" className="text-[13px] font-bold text-accent hover:text-[color:var(--community-orange-deep)] transition-colors shrink-0">
                      Katıl
                    </Link>
                  </div>
                )) : (
                  <p className="text-[13px] text-on-surface-variant text-center py-2">Veri bulunamadı</p>
                )}
              </div>
              <Link href="/clubs">
                <Button variant="outline" className="w-full mt-5 rounded-full text-[13px] font-semibold h-10 border-outline-variant">
                  Tüm Toplulukları Gör
                </Button>
              </Link>
            </div>
          </aside>
        </div>
      </main>

      {/* ===== Post Detay Sheet ===== */}
      <Sheet open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <SheetContent side="right" className="w-full sm:max-w-[600px] p-0 border-l border-outline-variant overflow-y-auto">
          {selectedPost && (
            <div className="flex flex-col h-full">
              <SheetHeader className="p-10 border-b border-outline-variant text-left">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-primary-fixed text-primary text-[11px] font-semibold px-3 py-1 rounded-full tracking-wide">
                    {selectedPost.category}
                  </span>
                  <span className="text-[12px] font-medium text-on-surface-variant">
                    {selectedPost.date}
                  </span>
                </div>
                <SheetTitle className="font-heading text-3xl font-bold tracking-tight leading-tight">
                  {selectedPost.title}
                </SheetTitle>
                <SheetDescription className="text-on-surface-variant text-[13px] pt-3">
                  Yayınlayan: {selectedPost.source}
                </SheetDescription>
              </SheetHeader>
              <div className="flex-1 p-10 overflow-y-auto">
                <div className="prose prose-sm max-w-none text-on-surface leading-relaxed whitespace-pre-wrap">
                  {selectedPost.content}
                </div>

                {/* Etkileşim İstatistikleri */}
                <div className="mt-12 pt-8 border-t border-outline-variant flex items-center gap-8">
                  <div className="flex items-center gap-2">
                    <Heart className={`w-5 h-5 ${selectedPost.interactions?.some((i: any) => i.type === "LIKE" && i.userId === currentUser?.id) ? "fill-red-500 text-red-500" : "text-on-surface-variant"}`} />
                    <span className="font-semibold text-sm text-on-surface">{selectedPost.interactions?.filter((i: any) => i.type === "LIKE").length || 0} Beğeni</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-on-surface-variant" />
                    <span className="font-semibold text-sm text-on-surface">{selectedPost.interactions?.filter((i: any) => i.type === "COMMENT").length || 0} Yorum</span>
                  </div>
                </div>

                {/* Yorumlar */}
                <div className="mt-10 space-y-6">
                  <h4 className="font-heading text-lg font-bold tracking-tight">Yorumlar</h4>
                  <div className="flex flex-col gap-4">
                    {selectedPost.interactions?.filter((i: any) => i.type === "COMMENT").length > 0 ? (
                      selectedPost.interactions.filter((i: any) => i.type === "COMMENT").map((comment: any) => (
                        <div key={comment.id} className="bg-surface-container-low rounded-lg p-4 border border-outline-variant group/comment">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-[13px] text-on-surface">{comment.user.name}</span>
                              <span className="text-[11px] text-on-surface-variant">{new Date(comment.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover/comment:opacity-100 transition-opacity">
                              {currentUser?.id === comment.userId ? (
                                <>
                                  <button
                                    onClick={() => { setEditingCommentId(comment.id); setEditCommentText(comment.content); }}
                                    className="p-1.5 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteComment(comment.id)}
                                    className="p-1.5 rounded-full hover:bg-destructive/10 text-destructive transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => handleReportComment(comment.id)}
                                  className="p-1.5 rounded-full hover:bg-accent/15 text-accent transition-colors"
                                  title="Bildir"
                                >
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                          {editingCommentId === comment.id ? (
                            <div className="space-y-2">
                              <textarea
                                value={editCommentText}
                                onChange={(e) => setEditCommentText(e.target.value)}
                                className="w-full p-2.5 rounded-lg border border-input bg-card text-sm outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring resize-none"
                                rows={2}
                              />
                              <div className="flex gap-2">
                                <button onClick={() => handleEditComment(comment.id)} className="text-[12px] font-semibold rounded-full bg-primary text-primary-foreground px-3.5 py-1.5">Kaydet</button>
                                <button onClick={() => setEditingCommentId(null)} className="text-[12px] font-semibold rounded-full bg-surface-container-high text-on-surface-variant px-3.5 py-1.5">İptal</button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-on-surface">{comment.content}</p>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-[13px] text-on-surface-variant rounded-lg border border-dashed border-outline-variant">
                        Henüz yorum yapılmamış. İlk yorumu sen yap!
                      </div>
                    )}
                  </div>

                  {/* Yorum Ekle */}
                  <div className="mt-8 pt-8 border-t border-outline-variant">
                    <label className="text-[13px] font-medium text-on-surface mb-2 block">Düşüncelerini Paylaş</label>
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Bu içerik hakkında ne düşünüyorsun?"
                      className="w-full p-4 rounded-lg border border-input bg-card outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring text-sm min-h-[100px] resize-none"
                    />
                    <Button
                      onClick={handleCommentSubmit}
                      disabled={isPending || !commentText.trim()}
                      className="mt-4 rounded-full text-[14px] font-semibold h-11 px-8"
                    >
                      {isPending ? "Gönderiliyor..." : "Yorum Yap"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <footer className="mt-auto bg-card border-t border-outline-variant px-margin-desktop py-stack-lg shrink-0">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="font-heading font-extrabold text-[20px] text-primary">
            Uni<span className="text-accent">.</span>Block
          </div>
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
