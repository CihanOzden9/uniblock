"use client";

import { useState } from "react";
import AdminNavbar from "@/components/layout/AdminNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Calendar, Activity, Plus, TrendingUp, Settings } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { createPost, updatePost, deletePost } from "@/app/actions/post";
import { createSurvey, deleteSurvey } from "@/app/actions/survey";
import { addClubMember, removeClubMember, updateClubMemberRole } from "@/app/actions/club";
import { toast } from "sonner";
import { Trash2, Edit, PlusCircle, CheckCircle2, ListFilter } from "lucide-react";

export default function ClubDashboardClient({ club }: { club: any }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [contentSubTab, setContentSubTab] = useState<"posts" | "surveys">("posts");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"create_post" | "edit_post" | "create_survey">("create_post");
  const [editingPost, setEditingPost] = useState<any>(null);
  const [isPending, setIsPending] = useState(false);

  async function handlePostSubmit(formData: FormData) {
    setIsPending(true);
    formData.append("clubId", club.id);
    formData.append("authorId", club.leaderId);

    let result;
    if (sheetMode === "edit_post" && editingPost) {
      formData.append("id", editingPost.id);
      result = await updatePost(formData);
    } else {
      result = await createPost(formData);
    }

    if (result.success) {
      toast.success(sheetMode === "edit_post" ? "İçerik güncellendi!" : "İçerik yayınlandı!");
      setIsSheetOpen(false);
      setEditingPost(null);
    } else {
      toast.error(result.error);
    }
    setIsPending(false);
  }

  async function handleSurveySubmit(formData: FormData) {
    setIsPending(true);
    formData.append("clubId", club.id);
    const result = await createSurvey(formData);
    if (result.success) {
      toast.success("Anket başarıyla oluşturuldu!");
      setIsSheetOpen(false);
    } else {
      toast.error(result.error);
    }
    setIsPending(false);
  }

  async function handleAddMember(formData: FormData) {
    setIsPending(true);
    formData.append("clubId", club.id);
    const result = await addClubMember(formData);
    if (result.success) {
      toast.success("Üye başarıyla eklendi!");
    } else {
      toast.error(result.error);
    }
    setIsPending(false);
  }

  async function handleRemoveMember(userId: string) {
    if (confirm("Bu üyeyi kulüpten çıkarmak istediğinize emin misiniz?")) {
      setIsPending(true);
      const result = await removeClubMember(club.id, userId);
      if (result.success) {
        toast.success("Üye başarıyla çıkarıldı.");
      } else {
        toast.error(result.error);
      }
      setIsPending(false);
    }
  }

  async function handleDeletePost(id: string) {
    if (confirm("Bu içeriği silmek istediğinize emin misiniz?")) {
      const result = await deletePost(id);
      if (result.success) toast.success("İçerik silindi.");
      else toast.error(result.error);
    }
  }

  async function handleRoleChange(userId: string, currentRole: string) {
    const newRole = currentRole === "MEMBER" ? "BOARD_MEMBER" : "MEMBER";
    setIsPending(true);
    const result = await updateClubMemberRole(club.id, userId, newRole);
    if (result.success) toast.success("Üye rolü güncellendi.");
    else toast.error(result.error);
    setIsPending(false);
  }

  async function handleDeleteSurvey(id: string) {
    if (confirm("Bu anketi silmek istediğinize emin misiniz?")) {
      const result = await deleteSurvey(id);
      if (result.success) toast.success("Anket silindi.");
      else toast.error(result.error);
    }
  }

  const openCreatePost = () => {
    setSheetMode("create_post");
    setEditingPost(null);
    setIsSheetOpen(true);
  };

  const openEditPost = (post: any) => {
    setSheetMode("edit_post");
    setEditingPost(post);
    setIsSheetOpen(true);
  };

  const openCreateSurvey = () => {
    setSheetMode("create_survey");
    setIsSheetOpen(true);
  };

  const TABS = [
    { id: "overview", label: "Genel Bakış", icon: Activity },
    { id: "posts", label: "İçerikler", icon: FileText },
    { id: "events", label: "Etkinlikler", icon: Calendar },
    { id: "members", label: "Üyeler", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <AdminNavbar />

      <main className="flex-1 pt-24 pb-12 px-4 md:px-8 max-w-[1400px] mx-auto w-full flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Nav */}
        <aside className="w-full lg:w-[280px] shrink-0 flex flex-col gap-6">
          <div className="bg-black text-white p-8 rounded-none border-b-8 border-accent">
            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-accent mb-2 block">
              Yönetim Paneli
            </span>
            <h1 className="font-heading text-2xl font-extrabold tracking-tight leading-tight uppercase">
              {club.name}
            </h1>
          </div>

          <nav className="flex flex-col gap-2">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-4 px-6 py-4 rounded-none transition-all font-bold uppercase tracking-widest text-[11px] border-2 ${
                    isActive 
                      ? "bg-accent border-accent text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]" 
                      : "bg-white border-transparent text-gray-500 hover:border-black hover:text-black"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto pt-8">
            <Button variant="outline" className="w-full rounded-none border-2 border-black text-black font-bold uppercase tracking-widest text-[10px] h-12 hover:bg-black hover:text-white transition-all flex gap-2">
              <Settings className="w-4 h-4" /> Kulüp Ayarları
            </Button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12 min-h-[600px]">
          
          {/* Header Action */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6 border-b-2 border-gray-100 pb-8">
            <div>
              <h2 className="font-heading text-3xl font-black uppercase tracking-tighter text-black">
                {TABS.find(t => t.id === activeTab)?.label}
              </h2>
              <p className="text-gray-500 font-medium text-sm mt-2">
                Kulüp performansınızı ve içeriklerinizi buradan yönetin.
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={openCreateSurvey}
                variant="outline"
                className="rounded-none border-2 border-black font-bold uppercase tracking-widest text-[11px] h-12 px-6 flex gap-2 hover:bg-black hover:text-white transition-all"
              >
                Anket Yap
              </Button>
              <Button 
                onClick={openCreatePost}
                className="rounded-none bg-accent text-white border-2 border-accent hover:bg-black hover:border-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 font-bold uppercase tracking-widest text-[11px] h-12 px-8 flex gap-2"
              >
                <Plus className="w-4 h-4" /> Yeni Duyuru
              </Button>
            </div>
          </div>

          {/* Tab Contents Container */}
          <div className="mt-8">

          {/* Overview Tab Content */}
          {activeTab === "overview" && (
            <div className="space-y-12 animate-fade-in">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-[#f4f4f5]">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-none">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-accent bg-accent/10 px-2 py-1">Liderlik: #3</span>
                    </div>
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1">Performans Puanı</h3>
                    <p className="font-heading text-4xl font-black tracking-tighter">{club.performanceScore}</p>
                  </CardContent>
                </Card>

                <Card className="rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 bg-accent text-white flex items-center justify-center rounded-none">
                        <Users className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1">Toplam Üye</h3>
                    <p className="font-heading text-4xl font-black tracking-tighter">{club.members?.length || 0}</p>
                  </CardContent>
                </Card>

                <Card className="rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-none">
                        <ListFilter className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1">Aktif Anket</h3>
                    <p className="font-heading text-4xl font-black tracking-tighter">{club.surveys?.length || 0}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity List */}
              <div>
                <h3 className="font-heading text-xl font-extrabold uppercase tracking-tight mb-6 flex items-center gap-3">
                  Son İçerikler <span className="bg-accent text-white text-[10px] px-2 py-1 tracking-widest">YENİ</span>
                </h3>
                <div className="flex flex-col gap-4">
                  {club.posts?.length > 0 ? (
                    club.posts.map((post: any) => (
                      <div key={post.id} className="group border-2 border-gray-100 hover:border-black p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-[9px] font-black text-accent uppercase tracking-widest border border-accent/20 bg-accent/5 px-2 py-0.5">
                              {post.type}
                            </span>
                            <span className="text-[10px] text-gray-400 font-bold tracking-widest">
                              {new Date(post.createdAt).toLocaleDateString("tr-TR")}
                            </span>
                          </div>
                          <h4 className="font-bold text-lg group-hover:text-accent transition-colors">{post.title}</h4>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            onClick={() => openEditPost(post)}
                            className="w-10 h-10 p-0 rounded-none border-2 border-gray-200 hover:border-black transition-all"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => handleDeletePost(post.id)}
                            className="w-10 h-10 p-0 rounded-none border-2 border-gray-200 hover:border-red-500 hover:text-red-500 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 border-2 border-dashed border-gray-200 text-center text-gray-500 font-medium">
                      Henüz içerik oluşturulmamış.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Posts & Surveys Tab Content */}
          {activeTab === "posts" && (
            <div className="animate-fade-in space-y-8">
              <div className="flex border-2 border-black h-12 w-fit">
                <button 
                  onClick={() => setContentSubTab("posts")}
                  className={`px-8 font-bold uppercase tracking-widest text-[10px] transition-all ${contentSubTab === "posts" ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"}`}
                >
                  Duyurular
                </button>
                <button 
                  onClick={() => setContentSubTab("surveys")}
                  className={`px-8 font-bold uppercase tracking-widest text-[10px] transition-all border-l-2 border-black ${contentSubTab === "surveys" ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"}`}
                >
                  Anketler
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {contentSubTab === "posts" ? (
                  club.posts?.length > 0 ? (
                    club.posts.map((post: any) => (
                      <div key={post.id} className="group border-2 border-gray-100 hover:border-black p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-[9px] font-black text-accent uppercase tracking-widest border border-accent/20 bg-accent/5 px-2 py-0.5">{post.type}</span>
                            <span className="text-[10px] text-gray-400 font-bold tracking-widest">{new Date(post.createdAt).toLocaleDateString()}</span>
                          </div>
                          <h4 className="font-bold text-lg">{post.title}</h4>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => openEditPost(post)} className="w-10 h-10 p-0 rounded-none border-2 border-gray-200 hover:border-black">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" onClick={() => handleDeletePost(post.id)} className="w-10 h-10 p-0 rounded-none border-2 border-gray-200 hover:border-red-500 hover:text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 border-2 border-dashed border-gray-100 text-center text-gray-400 font-bold italic uppercase tracking-widest text-xs">
                      Yayınlanmış duyuru bulunmuyor.
                    </div>
                  )
                ) : (
                  club.surveys?.length > 0 ? (
                    club.surveys.map((survey: any) => (
                      <div key={survey.id} className="group border-2 border-gray-100 hover:border-black p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest border border-blue-500/20 bg-blue-500/5 px-2 py-0.5">ANKET</span>
                            <span className="text-[10px] text-gray-400 font-bold tracking-widest">{new Date(survey.createdAt).toLocaleDateString()}</span>
                          </div>
                          <h4 className="font-bold text-lg">{survey.question}</h4>
                          <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                            {survey.options?.length} Seçenek • 0 Yanıt
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => handleDeleteSurvey(survey.id)} className="w-10 h-10 p-0 rounded-none border-2 border-gray-200 hover:border-red-500 hover:text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 border-2 border-dashed border-gray-100 text-center text-gray-400 font-bold italic uppercase tracking-widest text-xs">
                      Henüz anket oluşturulmamış.
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Members Tab Content */}
          {activeTab === "members" && (
            <div className="space-y-12 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Member List */}
                <div className="lg:col-span-2 space-y-6">
                  <h3 className="font-heading text-xl font-extrabold uppercase tracking-tight flex items-center gap-3">
                    Aktif Üyeler <span className="bg-black text-white text-[10px] px-2 py-1 tracking-widest">{club.members?.length || 0}</span>
                  </h3>
                  <div className="flex flex-col gap-4">
                    {club.members?.length > 0 ? (
                      club.members.map((member: any) => (
                        <div key={member.id} className="border-2 border-gray-100 p-4 flex items-center justify-between group/member">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-accent/10 text-accent flex items-center justify-center font-bold border-2 border-accent/20">
                              {member.user.name?.[0] || "U"}
                            </div>
                            <div>
                              <p className="font-bold text-sm">{member.user.name}</p>
                              <div className="flex items-center gap-2">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{member.role}</p>
                                {member.userId !== club.leaderId && (
                                  <button 
                                    onClick={() => handleRoleChange(member.userId, member.role)}
                                    className="text-[9px] text-accent font-black uppercase hover:underline"
                                  >
                                    [Değiştir]
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-[10px] text-gray-400 font-medium hidden sm:block">Katılım: {new Date(member.joinedAt).toLocaleDateString()}</span>
                            {member.userId !== club.leaderId && (
                              <Button 
                                variant="ghost" 
                                onClick={() => handleRemoveMember(member.userId)}
                                className="w-8 h-8 p-0 text-gray-300 hover:text-red-500 opacity-0 group-hover/member:opacity-100 transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-12 border-2 border-dashed border-gray-100 text-center text-gray-400 font-medium italic">
                        Henüz kayıtlı üye bulunmamaktadır.
                      </div>
                    )}
                  </div>
                </div>

                {/* Add Member Form */}
                <div className="bg-gray-50 border-2 border-black p-8 h-fit shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <h3 className="font-heading text-lg font-black uppercase tracking-tight mb-6 flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-accent" /> Üye Ekle
                  </h3>
                  <form action={handleAddMember} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Öğrenci E-posta</label>
                      <input 
                        name="email"
                        required
                        placeholder="ogrenci@universite.edu.tr"
                        className="w-full h-10 px-4 rounded-none border-2 border-black focus:ring-accent outline-none text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Rol</label>
                      <select 
                        name="role"
                        className="w-full h-10 px-4 rounded-none border-2 border-black bg-white focus:ring-accent outline-none text-sm font-semibold"
                      >
                        <option value="MEMBER">Üye</option>
                        <option value="BOARD_MEMBER">Yönetim Kurulu</option>
                      </select>
                    </div>
                    <Button 
                      type="submit" 
                      disabled={isPending}
                      className="w-full mt-4 rounded-none bg-black text-white hover:bg-accent border-2 border-black hover:border-accent transition-all font-bold uppercase tracking-widest text-[10px] h-10"
                    >
                      {isPending ? "Ekleniyor..." : "Kulübe Ekle"}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Events Tab Placeholder */}
          {activeTab === "events" && (
            <div className="animate-fade-in flex flex-col items-center justify-center py-20 text-center">
              <Calendar className="w-16 h-16 text-gray-200 mb-6" />
              <h3 className="font-heading text-2xl font-extrabold uppercase tracking-tight mb-2">Etkinlik Yönetimi</h3>
              <p className="text-gray-500 mb-8 max-w-md">Etkinlik takvimi ve QR kodlu katılım sistemi yakında eklenecek.</p>
            </div>
          )}
        </div>
      </div>
    </main>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-[500px] p-0 rounded-none border-l-2 border-black overflow-y-auto">
          <SheetHeader className="p-8 border-b-2 border-gray-100 bg-gray-50 text-left">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-accent text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest">
                {sheetMode === "create_survey" ? "ANKET MERKEZİ" : "İÇERİK STÜDYOSU"}
              </span>
            </div>
            <SheetTitle className="font-heading text-2xl font-extrabold tracking-tight">
              {sheetMode === "create_post" ? "Yeni Duyuru Yayınla" : 
               sheetMode === "edit_post" ? "Duyuruyu Düzenle" : 
               "Yeni Anket Oluştur"}
            </SheetTitle>
            <SheetDescription className="text-gray-500 font-medium text-xs">
              Bu işlem veritabanına kaydedilecek ve anında yayına alınacaktır.
            </SheetDescription>
          </SheetHeader>

          {sheetMode === "create_survey" ? (
            <form action={handleSurveySubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Soru</label>
                <input 
                  name="question" 
                  required 
                  placeholder="Örn: Gelecek zirve nerede olsun?"
                  className="w-full h-12 px-4 rounded-none border-2 border-black focus:ring-accent text-sm font-bold outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Seçenekler (Virgülle ayırın)</label>
                <textarea 
                  name="options" 
                  required 
                  rows={4}
                  placeholder="Kampüs A, Kampüs B, Online"
                  className="w-full p-4 rounded-none border-2 border-black focus:ring-accent text-sm outline-none resize-none"
                />
              </div>
              <Button type="submit" disabled={isPending} className="w-full rounded-none bg-black text-white font-bold uppercase tracking-widest text-[11px] h-12">
                {isPending ? "Oluşturuluyor..." : "Anketi Başlat"}
              </Button>
            </form>
          ) : (
            <form action={handlePostSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label htmlFor="type" className="text-[10px] font-bold uppercase tracking-widest text-gray-500">İçerik Tipi</label>
                <select 
                  id="type" 
                  name="type" 
                  defaultValue={editingPost?.type || "ANNOUNCEMENT"}
                  className="w-full h-12 px-4 rounded-none border-2 border-black bg-white focus:ring-accent text-sm font-semibold outline-none"
                >
                  <option value="ANNOUNCEMENT">Duyuru</option>
                  <option value="NEWS">Haber</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="title" className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Başlık</label>
                <input 
                  id="title" 
                  name="title" 
                  required 
                  defaultValue={editingPost?.title || ""}
                  placeholder="Başlık yazın..."
                  className="w-full h-12 px-4 rounded-none border-2 border-black focus:ring-accent text-sm font-bold outline-none"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="content" className="text-[10px] font-bold uppercase tracking-widest text-gray-500">İçerik Detayı</label>
                <textarea 
                  id="content" 
                  name="content" 
                  required 
                  rows={6}
                  defaultValue={editingPost?.content || ""}
                  placeholder="Detaylı bilgiyi buraya girin..."
                  className="w-full p-4 rounded-none border-2 border-black focus:ring-accent text-sm resize-none outline-none"
                />
              </div>

              <div className="pt-6 border-t-2 border-gray-100 flex gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsSheetOpen(false)}
                  className="flex-1 rounded-none border-2 border-black font-bold uppercase tracking-widest text-[11px] h-12"
                >
                  İptal
                </Button>
                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="flex-1 rounded-none bg-accent text-white border-2 border-accent hover:bg-black hover:border-black transition-all font-bold uppercase tracking-widest text-[11px] h-12"
                >
                  {isPending ? "İşleniyor..." : (sheetMode === "edit_post" ? "Güncelle" : "Yayınla")}
                </Button>
              </div>
            </form>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
