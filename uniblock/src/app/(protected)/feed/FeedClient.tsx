"use client";

import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Share2, User, ArrowRight, Trophy, MoreHorizontal, AlertTriangle, Trash2, Edit2 } from "lucide-react";
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
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  // Map the real data to the structure the component expects
  const feedPosts = useMemo(() => initialPosts.map(post => ({
    ...post,
    date: new Date(post.createdAt).toLocaleDateString("tr-TR"),
    source: post.club?.name || post.team?.name || post.author?.name || "Bilinmeyen Kaynak",
    category: post.type === "NEWS" ? "Haber" : "Duyuru",
    excerpt: post.content.substring(0, 150) + "..."
  })), [initialPosts]);

  // Polling: Her 30 saniyede bir veriyi sessizce yeniler
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 30000);

    return () => clearInterval(interval);
  }, [router]);

  // Yeni veri geldiğinde (likes/comments sonrası) açık olan post detayını günceller
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



  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar user={currentUser} />

      <main className="flex-1 pt-20">
        <section className="py-12 px-8 border-b-2 border-accent/10">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-accent">
                04 — TOPLULUK AKIŞI
              </span>
              <div className="flex-1 h-[1px] bg-gray-200"></div>
            </div>
            
            <h1 className="font-heading text-[clamp(36px,5vw,64px)] font-extrabold tracking-tighter leading-[1.05] mb-4">
              Topluluklarda Neler Oluyor?
            </h1>
            <p className="text-[15px] leading-[1.6] text-gray-600 max-w-[700px] mb-6">
              Üniversite kulüplerinden ve topluluklarından en yeni etkinlik ve duyurular.
            </p>
          </div>
        </section>

        {/* DUYURULAR SECTION */}
        <section className="bg-gray-100 py-12 px-8 min-h-[400px]">
          <div className="max-w-[1200px] mx-auto w-full flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 bg-black border-2 border-black gap-[1px]">
                {feedPosts.length > 0 ? (
                  feedPosts.map((item) => (
                    <div 
                      key={item.id} 
                    onClick={() => setSelectedPost(item)}
                    className="bg-white p-8 flex flex-col min-h-[320px] transition-all hover:bg-gray-50 group cursor-pointer border-l-4 border-accent overflow-hidden min-w-0"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-black"></div>
                        <span className="text-[10px] font-semibold tracking-[0.15em] text-gray-400 uppercase">{item.category}</span>
                      </div>
                      <span className="text-[10px] font-black tracking-[0.1em] text-accent uppercase">{item.source}</span>
                      <span className="text-[10px] font-medium tracking-[0.1em] text-gray-400 uppercase">{item.date}</span>
                    </div>
                    <div className="h-[1px] w-full bg-gray-100 mb-5"></div>
                    <h3 className="font-heading text-[17px] font-extrabold tracking-tight leading-[1.4] mb-3 group-hover:text-accent transition-colors break-words overflow-wrap-anywhere">
                      {item.title}
                    </h3>
                    <p className="text-[13px] leading-[1.6] text-gray-600 mb-8 line-clamp-3 break-words overflow-wrap-anywhere">
                      {item.excerpt}
                    </p>
                    
                    <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={(e) => handleLike(e, item.id)}
                          className="flex items-center gap-1.5 group/btn"
                        >
                          <Heart 
                            className={`w-4 h-4 transition-colors ${
                              item.interactions?.some((i: any) => i.type === "LIKE" && i.userId === currentUser?.id)
                                ? "fill-red-500 text-red-500" 
                                : "text-gray-400 group-hover/btn:text-red-500"
                            }`} 
                          />
                          <span className="text-[11px] font-bold text-gray-400 group-hover/btn:text-black">
                            {item.interactions?.filter((i: any) => i.type === "LIKE").length || 0}
                          </span>
                        </button>
                        <button className="flex items-center gap-1.5 group/btn">
                          <MessageSquare className="w-4 h-4 text-gray-400 group-hover/btn:text-accent transition-colors" />
                          <span className="text-[11px] font-bold text-gray-400 group-hover/btn:text-black">
                            {item.interactions?.filter((i: any) => i.type === "COMMENT").length || 0}
                          </span>
                        </button>
                      </div>
                      <button className="p-2 hover:bg-gray-100 transition-colors">
                        <Share2 className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                ))
                ) : (
                  <div className="bg-white p-8 col-span-1 md:col-span-2 flex items-center justify-center min-h-[300px] text-gray-500 font-medium">
                    Şu an akışta gösterilecek bir içerik yok.
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Sadece Liderlik Tablosu */}
            <aside className="w-full lg:w-[350px] shrink-0 flex flex-col gap-8">
              <div className="bg-white border-2 border-black p-6">
                <div className="flex justify-between items-center mb-6 border-b-2 border-black pb-3">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-accent" />
                    <h3 className="font-heading text-xl font-extrabold uppercase tracking-tight">Liderlik</h3>
                  </div>
                  <span className="text-[9px] font-black bg-black text-white px-2 py-0.5 tracking-tighter">MAYIS '26</span>
                </div>
                
                <div className="flex flex-col gap-5">
                  {topClubs.length > 0 ? topClubs.map((club, idx) => (
                    <div key={idx} className="relative group cursor-pointer">
                      <div className="flex items-center gap-4 relative z-10">
                        <div className={`w-6 h-6 flex items-center justify-center font-heading font-black text-[10px] border-2 border-black shrink-0 transition-transform group-hover:-translate-y-1 ${
                          idx === 0 ? 'bg-accent text-white border-accent shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 
                          idx === 1 ? 'bg-gray-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 
                          idx === 2 ? 'bg-orange-100 border-orange-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white'
                        }`}>
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-end mb-1.5">
                            <h4 className="font-bold text-[13px] truncate group-hover:text-accent transition-colors tracking-tight">{club.name}</h4>
                            <span className="text-[10px] font-black tracking-tighter text-gray-400 group-hover:text-black transition-colors">{club.performanceScore} P</span>
                          </div>
                          {/* Progress Bar */}
                          <div className="h-[3px] w-full bg-gray-100 overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-1000 ${idx === 0 ? 'bg-accent' : 'bg-black'}`} 
                              style={{ width: `${(club.performanceScore / 1250) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center text-xs text-gray-400">Veri bulunamadı</div>
                  )}
                </div>
                
                <Button className="w-full mt-8 rounded-none bg-black text-white hover:bg-accent border-2 border-black hover:border-accent transition-all text-[10px] tracking-widest font-bold uppercase h-12">
                  Tüm Sıralamayı Gör
                </Button>
              </div>
            </aside>
          </div>
        </section>

        {/* ANKETLER SECTION - Duyuru kartları tarzında */}
        <section className="py-12 px-8 border-t-2 border-accent/10">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-accent">
                05 — AKTİF ANKETLER
              </span>
              <div className="flex-1 h-[1px] bg-gray-200"></div>
              <span className="text-[10px] font-bold bg-accent text-white px-3 py-1">{initialSurveys.length} AKTİF</span>
            </div>
            
            <h2 className="font-heading text-[clamp(28px,4vw,48px)] font-extrabold tracking-tighter leading-[1.05] mb-3">
              Sesini Duyur
            </h2>
            <p className="text-[15px] leading-[1.6] text-gray-600 max-w-[700px] mb-10">
              Toplulukların anketlerine katıl, fikirlerini paylaş ve puan kazan.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-black border-2 border-black">
              {initialSurveys.length > 0 ? initialSurveys.map((survey) => (
                <div key={survey.id} className="bg-white p-8 flex flex-col min-h-[300px] transition-all hover:bg-gray-50 group border-l-4 border-accent relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent"></div>
                      <span className="text-[10px] font-semibold tracking-[0.15em] text-gray-400 uppercase">Anket</span>
                    </div>
                    <span className="text-[10px] font-black tracking-[0.1em] text-accent uppercase">{survey.club?.name || survey.team?.name}</span>
                    <span className="text-[10px] font-medium tracking-[0.1em] text-gray-400 uppercase">{new Date(survey.createdAt).toLocaleDateString("tr-TR")}</span>
                  </div>
                  <div className="h-[1px] w-full bg-gray-100 mb-5"></div>
                  
                  <h3 className="font-heading text-[17px] font-extrabold tracking-tight leading-[1.4] mb-5 group-hover:text-accent transition-colors">
                    {survey.question}
                  </h3>

                  <div className="space-y-3 mb-4 flex-1">
                    {survey.options.map((option: any) => {
                      const totalVotes = survey.interactions?.length || 0;
                      const optionVotes = survey.interactions?.filter((i: any) => i.optionId === option.id).length || 0;
                      const percentage = totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0;
                      const hasVoted = survey.interactions?.some((i: any) => i.userId === currentUser?.id);
                      const isMyChoice = survey.interactions?.some((i: any) => i.userId === currentUser?.id && i.optionId === option.id);

                      return (
                        <button 
                          key={option.id} 
                          onClick={() => !hasVoted && handleVote(survey.id, option.id)}
                          disabled={hasVoted}
                          className={`w-full relative overflow-hidden p-3 border-2 transition-all text-left ${
                            isMyChoice ? "border-accent bg-accent/5" : "border-gray-200 hover:border-accent hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]"
                          }`}
                        >
                          {hasVoted && (
                            <div 
                              className="absolute inset-0 bg-accent/10 transition-all duration-1000" 
                              style={{ width: `${percentage}%` }}
                            />
                          )}
                          <div className="relative z-10 flex justify-between items-center">
                            <span className={`font-semibold text-[13px] ${isMyChoice ? "text-accent" : ""}`}>{option.text}</span>
                            {hasVoted ? (
                              <span className="text-[10px] font-black text-accent">%{percentage}</span>
                            ) : (
                              <span className="text-[10px] font-black text-accent bg-accent/10 px-2 py-0.5">+10 P</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-auto pt-5 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-[11px] font-bold text-gray-400">{survey.interactions?.length || 0} Katılımcı</span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{survey.club?.name || survey.team?.name}</span>
                  </div>
                </div>
              )) : (
                <div className="bg-white p-8 col-span-1 md:col-span-2 lg:col-span-3 flex items-center justify-center min-h-[200px] text-gray-500 font-medium">
                  Aktif anket bulunamadı.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Sheet open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <SheetContent side="right" className="w-full sm:max-w-[600px] p-0 rounded-none border-l-2 border-black overflow-y-auto">
          {selectedPost && (
            <div className="flex flex-col h-full">
              <SheetHeader className="p-10 border-b-2 border-gray-100 text-left">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-accent text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                    {selectedPost.category}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {selectedPost.date}
                  </span>
                </div>
                <SheetTitle className="font-heading text-3xl font-extrabold tracking-tighter leading-tight">
                  {selectedPost.title}
                </SheetTitle>
                <SheetDescription className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] pt-4">
                  Yayınlayan: {selectedPost.source}
                </SheetDescription>
              </SheetHeader>
              <div className="flex-1 p-10 overflow-y-auto">
                <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
                  {selectedPost.content}
                </div>

                {/* Interaction Stats */}
                <div className="mt-12 pt-8 border-t-2 border-gray-100 flex items-center gap-8">
                   <div className="flex items-center gap-2">
                     <Heart className={`w-5 h-5 ${selectedPost.interactions?.some((i: any) => i.type === "LIKE" && i.userId === currentUser?.id) ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                     <span className="font-bold text-sm">{selectedPost.interactions?.filter((i: any) => i.type === "LIKE").length || 0} Beğeni</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <MessageSquare className="w-5 h-5 text-gray-400" />
                     <span className="font-bold text-sm">{selectedPost.interactions?.filter((i: any) => i.type === "COMMENT").length || 0} Yorum</span>
                   </div>
                </div>

                {/* Comments Section */}
                <div className="mt-10 space-y-6">
                  <h4 className="font-heading text-lg font-black uppercase tracking-tight">Yorumlar</h4>
                  
                  <div className="flex flex-col gap-4">
                    {selectedPost.interactions?.filter((i: any) => i.type === "COMMENT").length > 0 ? (
                      selectedPost.interactions.filter((i: any) => i.type === "COMMENT").map((comment: any) => (
                        <div key={comment.id} className="bg-gray-50 p-4 border-l-4 border-black group/comment">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[11px] uppercase tracking-wider">{comment.user.name}</span>
                              <span className="text-[9px] text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 opacity-0 group-hover/comment:opacity-100 transition-opacity">
                              {currentUser?.id === comment.userId ? (
                                <>
                                  <button 
                                    onClick={() => {
                                      setEditingCommentId(comment.id);
                                      setEditCommentText(comment.content);
                                    }}
                                    className="p-1 hover:bg-gray-200 text-gray-500 transition-colors"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteComment(comment.id)}
                                    className="p-1 hover:bg-red-100 text-red-500 transition-colors"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </>
                              ) : (
                                <button 
                                  onClick={() => handleReportComment(comment.id)}
                                  className="p-1 hover:bg-orange-100 text-orange-500 transition-colors"
                                  title="Bildir"
                                >
                                  <AlertTriangle className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                          
                          {editingCommentId === comment.id ? (
                            <div className="space-y-2">
                              <textarea 
                                value={editCommentText}
                                onChange={(e) => setEditCommentText(e.target.value)}
                                className="w-full p-2 border-2 border-black text-sm outline-none resize-none"
                                rows={2}
                              />
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handleEditComment(comment.id)}
                                  className="text-[10px] font-black uppercase bg-black text-white px-3 py-1"
                                >
                                  Kaydet
                                </button>
                                <button 
                                  onClick={() => setEditingCommentId(null)}
                                  className="text-[10px] font-black uppercase bg-gray-200 px-3 py-1"
                                >
                                  İptal
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-700">{comment.content}</p>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-xs text-gray-400 font-bold uppercase tracking-widest border-2 border-dashed border-gray-100">
                        Henüz yorum yapılmamış. İlk yorumu sen yap!
                      </div>
                    )}
                  </div>

                  {/* Add Comment */}
                  <div className="mt-8 pt-8 border-t-2 border-gray-100">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Düşüncelerini Paylaş</label>
                    <textarea 
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Bu içerik hakkında ne düşünüyorsun?"
                      className="w-full p-4 rounded-none border-2 border-black focus:ring-accent outline-none text-sm min-h-[100px] resize-none"
                    />
                    <Button 
                      onClick={handleCommentSubmit}
                      disabled={isPending || !commentText.trim()}
                      className="mt-4 rounded-none bg-black text-white font-bold uppercase tracking-widest text-[10px] h-11 px-8 hover:bg-accent transition-all"
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

      <footer className="bg-black text-white border-t-4 border-accent px-8 py-12 shrink-0">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="font-heading font-extrabold text-[20px]">
            Uni<span className="text-accent">.</span>Block
          </div>
          <div className="flex gap-8 text-[11px] font-bold tracking-[0.2em] uppercase text-gray-500">
            <Link href="#" className="hover:text-accent">Hakkımızda</Link>
            <Link href="#" className="hover:text-accent">İletişim</Link>
            <Link href="#" className="hover:text-accent">Gizlilik</Link>
          </div>
          <p className="text-[11px] uppercase tracking-[0.1em] text-accent font-semibold">
            © 2026 KAMPÜS HABER AĞI
          </p>
        </div>
      </footer>

      <MessagingOverlay />
    </div>
  );
}
