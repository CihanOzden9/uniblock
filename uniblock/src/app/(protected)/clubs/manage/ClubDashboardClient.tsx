"use client";

import { useState } from "react";
import Link from "next/link";
import AdminNavbar from "@/components/layout/AdminNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Calendar, Activity, Plus, TrendingUp, Settings, Crown } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { createPost, updatePost, deletePost } from "@/app/actions/post";
import { createSurvey, deleteSurvey } from "@/app/actions/survey";
import { addClubMember, removeClubMember, updateClubMemberRole, updateClubSettings, updateClubPassword, handleJoinRequest, checkUserExistence } from "@/app/actions/club";
import { toast } from "sonner";
import { Trash2, Edit, PlusCircle, AlertCircle, ShieldAlert, ListFilter, Search } from "lucide-react";
import { resolveReport } from "@/app/actions/interaction";

export default function ClubDashboardClient({ club }: { club: any }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [contentSubTab, setContentSubTab] = useState<"posts" | "surveys">("posts");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"create_post" | "edit_post" | "create_survey">("create_post");
  const [editingPost, setEditingPost] = useState<any>(null);
  const [memberSubTab, setMemberSubTab] = useState<"list" | "requests">("list");
  const [isPending, setIsPending] = useState(false);
  const [memberSearchTerm, setMemberSearchTerm] = useState("");
  const [boardRoleSelect, setBoardRoleSelect] = useState("BAŞKAN YARDIMCISI");
  const [customRoleInput, setCustomRoleInput] = useState("");
  const [boardMemberEmail, setBoardMemberEmail] = useState("");
  const [selectedMemberForBoard, setSelectedMemberForBoard] = useState("");
  const [boardAddMode, setBoardAddMode] = useState<"existing" | "email">("existing");
  const [emailCheckResult, setEmailCheckResult] = useState<{ exists: boolean; user?: any; isMember?: boolean; memberRole?: string } | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

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

  async function handleResolveReport(id: string, status: "RESOLVED" | "DISMISSED") {
    setIsPending(true);
    const result = await resolveReport(id, status);
    if (result.success) toast.success(status === "RESOLVED" ? "Şikayet çözüldü." : "Şikayet reddedildi.");
    else toast.error(result.error);
    setIsPending(false);
  }

  async function onHandleJoinRequest(memberId: string, action: "APPROVED" | "REJECTED") {
    setIsPending(true);
    const result = await handleJoinRequest(memberId, action);
    if (result.success) {
      toast.success(action === "APPROVED" ? "Üye kabul edildi!" : "İstek reddedildi.");
    } else {
      toast.error(result.error);
    }
    setIsPending(false);
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

  const approvedMembers = club.members?.filter((m: any) => m.status === "APPROVED" && m.userId !== club.leaderId) || [];
  const pendingMembersCount = club.members?.filter((m: any) => m.status === "PENDING").length || 0;
  const boardMembers = approvedMembers.filter((m: any) => m.role !== "MEMBER");
  const regularMembers = approvedMembers.filter((m: any) => m.role === "MEMBER");
  
  const filteredMembers = approvedMembers.filter((m: any) => 
    m.user.name?.toLowerCase().includes(memberSearchTerm.toLowerCase()) ||
    m.user.email?.toLowerCase().includes(memberSearchTerm.toLowerCase()) ||
    (m.user.faculty && m.user.faculty.toLowerCase().includes(memberSearchTerm.toLowerCase())) ||
    (m.user.department && m.user.department.toLowerCase().includes(memberSearchTerm.toLowerCase()))
  );

  const PREDEFINED_ROLES = [
    "BAŞKAN YARDIMCISI",
    "GENEL SEKRETER",
    "SAYMAN",
    "ETKİNLİK KOORDİNATÖRÜ",
    "SOSYAL MEDYA SORUMLUSU",
    "DIŞ İLİŞKİLER SORUMLUSU",
    "TEKNİK SORUMLU",
    "PROJE KOORDİNATÖRÜ"
  ];
  async function handleBoardAssignment() {
    const role = boardRoleSelect === "DİĞER" ? customRoleInput.trim().toUpperCase() : boardRoleSelect;
    if (!role) { toast.error("Lütfen bir rol belirleyin."); return; }

    setIsPending(true);

    if (boardAddMode === "existing" && selectedMemberForBoard) {
      const result = await updateClubMemberRole(club.id, selectedMemberForBoard, role);
      if (result.success) {
        toast.success("Yönetim rolü atandı!");
        setSelectedMemberForBoard("");
      } else {
        toast.error(result.error);
      }
    } else if (boardAddMode === "email" && boardMemberEmail) {
      // Önce kullanıcıyı kontrol et
      const check = await checkUserExistence(boardMemberEmail, club.id);
      
      if (!check.success) {
        if (check.error === "USER_NOT_FOUND") {
          toast.error("Bu e-posta adresine sahip bir kullanıcı bulunamadı. Lütfen kullanıcının sisteme kayıtlı olduğundan emin olun.");
        } else {
          toast.error("Kullanıcı kontrolü sırasında bir hata oluştu.");
        }
        setIsPending(false);
        return;
      }

      const formData = new FormData();
      formData.append("email", boardMemberEmail);
      formData.append("clubId", club.id);
      formData.append("role", role);
      const result = await addClubMember(formData);
      if (result.success) {
        toast.success("Yönetici eklendi!");
        setBoardMemberEmail("");
        setEmailCheckResult(null);
      } else {
        toast.error(result.error);
      }
    } else {
      toast.error("Lütfen bir üye seçin veya e-posta girin.");
    }
    setIsPending(false);
  }

  const handleEmailBlur = async () => {
    if (!boardMemberEmail || !boardMemberEmail.includes("@")) return;
    
    setIsCheckingEmail(true);
    const result = await checkUserExistence(boardMemberEmail, club.id);
    if (result.success) {
      setEmailCheckResult({ exists: true, user: result.user, isMember: result.isMember, memberRole: result.memberRole });
    } else if (result.error === "USER_NOT_FOUND") {
      setEmailCheckResult({ exists: false });
    }
    setIsCheckingEmail(false);
  };

  async function handleRemoveFromBoard(userId: string) {
    setIsPending(true);
    const result = await updateClubMemberRole(club.id, userId, "MEMBER");
    if (result.success) toast.success("Yönetim rolü kaldırıldı.");
    else toast.error(result.error);
    setIsPending(false);
  }

  const TABS = [
    { id: "overview", label: "Genel Bakış", icon: Activity },
    { id: "posts", label: "İçerikler", icon: FileText },
    { id: "events", label: "Etkinlikler", icon: Calendar },
    { id: "members", label: "Üyeler", icon: Users },
    { id: "management", label: "Kulüp Yönetimi", icon: Crown },
    { id: "reports", label: "Şikayetler", icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <AdminNavbar user={club.leader} />

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
              
              const className = `flex items-center gap-4 px-6 py-4 rounded-none transition-all font-bold uppercase tracking-widest text-[11px] border-2 ${
                isActive 
                  ? "bg-accent border-accent text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]" 
                  : "bg-white border-transparent text-gray-500 hover:border-black hover:text-black"
              }`;



              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={className}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
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
                    <p className="font-heading text-4xl font-black tracking-tighter">{approvedMembers.length}</p>
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
            <div className="animate-fade-in space-y-10">
              
              {/* Content Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={openCreatePost}
                  className="group bg-accent p-6 text-left border-2 border-accent shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                >
                  <div className="w-10 h-10 bg-white text-accent flex items-center justify-center mb-4">
                    <Plus className="w-5 h-5" />
                  </div>
                  <h3 className="text-white font-heading text-lg font-black uppercase tracking-tighter mb-1">Yeni Duyuru</h3>
                  <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                    Kampüs haberlerini paylaşın.
                  </p>
                </button>

                <button 
                  onClick={openCreateSurvey}
                  className="group bg-black p-6 text-left border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                >
                  <div className="w-10 h-10 bg-accent text-white flex items-center justify-center mb-4">
                    <ListFilter className="w-5 h-5" />
                  </div>
                  <h3 className="text-white font-heading text-lg font-black uppercase tracking-tighter mb-1">Yeni Anket</h3>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                    Görüşleri toplayın.
                  </p>
                </button>
              </div>

              <div className="h-[2px] bg-gray-100 w-full"></div>

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
                          <div className="mt-3 flex flex-wrap gap-2">
                            {survey.options?.map((opt: any) => {
                              const count = survey.interactions?.filter((i: any) => i.optionId === opt.id).length || 0;
                              return (
                                <span key={opt.id} className="text-[10px] font-bold bg-gray-50 border border-gray-200 px-2 py-1 uppercase">
                                  {opt.text}: <span className="text-accent">{count}</span>
                                </span>
                              );
                            })}
                          </div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase mt-2">
                            Toplam: {survey.interactions?.length || 0} Katılımcı
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
            <div className="space-y-8 animate-fade-in">
              <div className="flex border-2 border-black h-12 w-fit">
                <button 
                  onClick={() => setMemberSubTab("list")}
                  className={`px-8 font-bold uppercase tracking-widest text-[10px] transition-all ${memberSubTab === "list" ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"}`}
                >
                  Üye Listesi
                </button>
                <button 
                  onClick={() => setMemberSubTab("requests")}
                  className={`px-8 font-bold uppercase tracking-widest text-[10px] transition-all border-l-2 border-black ${memberSubTab === "requests" ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"}`}
                >
                  Gelen İstekler ({pendingMembersCount})
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Member List / Requests */}
                <div className="lg:col-span-2 space-y-6">
                  {memberSubTab === "list" ? (
                    <>
                      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8">
                        <h3 className="font-heading text-xl font-extrabold uppercase tracking-tight flex items-center gap-3">
                          Aktif Üyeler <span className="bg-black text-white text-[10px] px-2 py-1 tracking-widest">{filteredMembers.length}</span>
                        </h3>
                        
                        <div className="relative w-full md:w-64">
                          <input 
                            type="text"
                            placeholder="Üye Ara (Ad, Bölüm...)"
                            value={memberSearchTerm}
                            onChange={(e) => setMemberSearchTerm(e.target.value)}
                            className="w-full h-10 px-4 pr-10 rounded-none border-2 border-black text-[11px] font-bold uppercase tracking-widest outline-none focus:border-accent transition-colors"
                          />
                          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                      </div>

                      <div className="flex flex-col gap-4">
                        {filteredMembers.length > 0 ? (
                          filteredMembers.map((member: any) => (
                            <div key={member.id} className="border-2 border-gray-100 p-4 flex items-center justify-between group/member">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-accent/10 text-accent flex items-center justify-center font-bold border-2 border-accent/20">
                                  {member.user.name?.[0] || "U"}
                                </div>
                                <div>
                                  <p className="font-bold text-sm">{member.user.name}</p>
                                  <div className="flex items-center gap-2">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{member.role}</p>
                                    <button 
                                      onClick={() => handleRoleChange(member.userId, member.role)}
                                      className="text-[9px] text-accent font-black uppercase hover:underline"
                                    >
                                      [Değiştir]
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-[10px] text-gray-400 font-medium hidden sm:block">Katılım: {new Date(member.joinedAt).toLocaleDateString()}</span>
                                <Button 
                                  variant="ghost" 
                                  onClick={() => handleRemoveMember(member.userId)}
                                  className="w-8 h-8 p-0 text-gray-300 hover:text-red-500 opacity-0 group-hover/member:opacity-100 transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-12 border-2 border-dashed border-gray-100 text-center text-gray-400 font-medium italic">
                            Henüz kayıtlı üye bulunmamaktadır.
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="font-heading text-xl font-extrabold uppercase tracking-tight flex items-center gap-3">
                        Bekleyen İstekler <span className="bg-accent text-white text-[10px] px-2 py-1 tracking-widest">{club.members?.filter((m: any) => m.status === "PENDING").length || 0}</span>
                      </h3>
                      <div className="flex flex-col gap-4">
                        {club.members?.filter((m: any) => m.status === "PENDING").length > 0 ? (
                          club.members.filter((m: any) => m.status === "PENDING").map((request: any) => (
                            <div key={request.id} className="border-2 border-black p-6 flex items-center justify-between bg-gray-50">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-bold">
                                  {request.user.name?.[0] || "U"}
                                </div>
                                <div>
                                  <p className="font-bold text-sm">{request.user.name}</p>
                                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{request.user.email}</p>
                                  <p className="text-[9px] text-accent font-black uppercase mt-1">{request.user.faculty} / {request.user.department}</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  onClick={() => onHandleJoinRequest(request.id, "REJECTED")}
                                  variant="outline"
                                  className="h-10 rounded-none border-2 border-black font-bold uppercase tracking-widest text-[9px] hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                                >
                                  Reddet
                                </Button>
                                <Button 
                                  onClick={() => onHandleJoinRequest(request.id, "APPROVED")}
                                  className="h-10 rounded-none bg-black text-white border-2 border-black font-bold uppercase tracking-widest text-[9px] hover:bg-accent hover:border-accent transition-all shadow-[4px_4px_0px_0px_rgba(255,59,48,1)] hover:shadow-none"
                                >
                                  Onayla
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-12 border-2 border-dashed border-gray-100 text-center text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                            Bekleyen katılım isteği bulunmuyor.
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Add Member Form */}
                <div className="bg-gray-50 border-2 border-black p-8 h-fit shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <h3 className="font-heading text-lg font-black uppercase tracking-tight mb-6 flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-accent" /> Manuel Ekle
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

          {/* Management Tab Content */}
          {activeTab === "management" && (
            <div className="space-y-10 animate-fade-in">
              {/* Current Board */}
              <div>
                <h3 className="font-heading text-xl font-extrabold uppercase tracking-tight flex items-center gap-3 mb-6">
                  <Crown className="w-5 h-5 text-accent" />
                  Yönetim Kadrosu
                  <span className="bg-accent text-white text-[10px] px-2 py-1 tracking-widest">{boardMembers.length + 1}</span>
                </h3>

                <div className="flex flex-col gap-4">
                  {/* Leader - always shown */}
                  <div className="border-2 border-accent p-5 flex items-center justify-between bg-accent/5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-accent text-white flex items-center justify-center font-bold text-lg">
                        {club.leader.name?.[0] || "B"}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{club.leader.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-black text-accent uppercase tracking-widest bg-accent/10 border border-accent/20 px-2 py-0.5">
                            BAŞKAN
                          </span>
                          {club.leader.department && (
                            <span className="text-[9px] text-gray-400 font-bold">{club.leader.department}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Değiştirilemez</span>
                  </div>

                  {/* Board Members */}
                  {boardMembers.map((member: any) => (
                    <div key={member.id} className="border-2 border-gray-200 hover:border-black p-5 flex items-center justify-between group/board transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-bold text-lg">
                          {member.user.name?.[0] || "Y"}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{member.user.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest bg-gray-100 px-2 py-0.5">
                              {member.role}
                            </span>
                            {member.user.department && (
                              <span className="text-[9px] text-gray-400 font-bold">{member.user.department}</span>
                            )}
                          </div>
                          <p className="text-[10px] text-gray-400 font-medium mt-1">{member.user.email}</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        onClick={() => handleRemoveFromBoard(member.userId)}
                        className="h-8 rounded-none text-[9px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover/board:opacity-100 transition-all"
                      >
                        Görevden Al
                      </Button>
                    </div>
                  ))}

                  {boardMembers.length === 0 && (
                    <div className="p-8 border-2 border-dashed border-gray-200 text-center text-gray-400 font-medium text-sm">
                      Henüz yönetim kadrosuna atanmış üye bulunmuyor.
                    </div>
                  )}
                </div>
              </div>

              {/* Add Board Member Form */}
              <div className="bg-gray-50 border-2 border-black p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="font-heading text-lg font-black uppercase tracking-tight mb-6 flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-accent" /> Yönetici Ata
                </h3>

                <div className="space-y-6">
                  {/* Mode Switch */}
                  <div className="flex border-2 border-black h-10 w-fit">
                    <button 
                      onClick={() => setBoardAddMode("existing")}
                      className={`px-6 font-bold uppercase tracking-widest text-[9px] transition-all ${boardAddMode === "existing" ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"}`}
                    >
                      Mevcut Üyeden
                    </button>
                    <button 
                      onClick={() => setBoardAddMode("email")}
                      className={`px-6 font-bold uppercase tracking-widest text-[9px] transition-all border-l-2 border-black ${boardAddMode === "email" ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"}`}
                    >
                      E-posta ile
                    </button>
                  </div>

                  {/* Member Selection */}
                  {boardAddMode === "existing" ? (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Üye Seç</label>
                      <select 
                        value={selectedMemberForBoard}
                        onChange={(e) => setSelectedMemberForBoard(e.target.value)}
                        className="w-full h-10 px-4 rounded-none border-2 border-black bg-white focus:ring-accent outline-none text-sm font-semibold"
                      >
                        <option value="">-- Üye seçin --</option>
                        {regularMembers.map((m: any) => (
                          <option key={m.userId} value={m.userId}>{m.user.name} ({m.user.email})</option>
                        ))}
                      </select>
                      {regularMembers.length === 0 && (
                        <p className="text-[10px] text-gray-400 font-medium mt-1">Atanabilecek üye bulunmuyor. Önce kulübe üye ekleyin.</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">E-posta Adresi</label>
                      <input 
                        type="email"
                        value={boardMemberEmail}
                        onChange={(e) => {
                          setBoardMemberEmail(e.target.value);
                          setEmailCheckResult(null);
                        }}
                        onBlur={handleEmailBlur}
                        placeholder="yonetici@universite.edu.tr"
                        className={`w-full h-10 px-4 rounded-none border-2 focus:ring-accent outline-none text-sm transition-colors ${
                          emailCheckResult?.exists === false ? "border-red-500 bg-red-50" : 
                          emailCheckResult?.exists === true ? "border-green-500 bg-green-50" : "border-black"
                        }`}
                      />
                      {isCheckingEmail && <p className="text-[9px] font-bold text-gray-400 mt-1 animate-pulse">Kontrol ediliyor...</p>}
                      {emailCheckResult?.exists === false && (
                        <div className="flex items-center gap-2 mt-2 p-2 bg-red-100 border border-red-200 text-red-600 rounded-none">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <p className="text-[10px] font-black uppercase leading-tight">
                            Bu e-posta adresi UniBlock sisteminde kayıtlı değil!
                          </p>
                        </div>
                      )}
                      {emailCheckResult?.exists === true && (
                        <div className="flex items-center gap-2 mt-2 p-2 bg-green-100 border border-green-200 text-green-600 rounded-none">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <p className="text-[10px] font-black uppercase leading-tight">
                            Kullanıcı Bulundu: <span className="text-black">{emailCheckResult.user.name}</span>
                            {emailCheckResult.isMember && <span className="ml-2 text-gray-500">(Zaten Üye: {emailCheckResult.memberRole})</span>}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Role Selection */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Yönetim Rolü</label>
                    <select 
                      value={boardRoleSelect}
                      onChange={(e) => setBoardRoleSelect(e.target.value)}
                      className="w-full h-10 px-4 rounded-none border-2 border-black bg-white focus:ring-accent outline-none text-sm font-semibold"
                    >
                      {PREDEFINED_ROLES.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                      <option value="DİĞER">DİĞER (Manuel Giriş)</option>
                    </select>
                  </div>

                  {/* Custom Role Input */}
                  {boardRoleSelect === "DİĞER" && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Manuel Rol Adı</label>
                      <input 
                        type="text"
                        value={customRoleInput}
                        onChange={(e) => setCustomRoleInput(e.target.value)}
                        placeholder="Örn: Araştırma Koordinatörü"
                        className="w-full h-10 px-4 rounded-none border-2 border-black focus:ring-accent outline-none text-sm"
                      />
                    </div>
                  )}

                  <Button 
                    onClick={handleBoardAssignment}
                    disabled={isPending}
                    className="w-full mt-2 rounded-none bg-accent text-white hover:bg-black border-2 border-accent hover:border-black transition-all font-bold uppercase tracking-widest text-[10px] h-10"
                  >
                    {isPending ? "Atanıyor..." : "Yönetici Olarak Ata"}
                  </Button>
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

          {/* Reports Tab Content */}
          {activeTab === "reports" && (
            <div className="animate-fade-in space-y-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-heading text-xl font-extrabold uppercase tracking-tight flex items-center gap-3">
                  Gelen Şikayetler <span className="bg-red-500 text-white text-[10px] px-2 py-1 tracking-widest">{club.reports?.filter((r: any) => r.status === "PENDING").length || 0} BEKLEYEN</span>
                </h3>
              </div>

              <div className="flex flex-col gap-6">
                {club.reports?.length > 0 ? (
                  club.reports.map((report: any) => (
                    <div key={report.id} className={`border-2 p-6 flex flex-col gap-4 transition-all ${report.status === "PENDING" ? "border-red-100 bg-red-50/30" : "border-gray-100 bg-white opacity-60"}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <AlertCircle className={`w-5 h-5 ${report.status === "PENDING" ? "text-red-500" : "text-gray-400"}`} />
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Şikayet Nedeni</span>
                            <p className="font-bold text-sm text-gray-800">{report.reason || "Belirtilmemiş"}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] font-bold text-gray-400 block uppercase">Tarih</span>
                          <span className="text-[10px] font-black">{new Date(report.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 p-4 rounded-none">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[9px] font-black bg-black text-white px-2 py-0.5 uppercase tracking-tighter">Şikayet Edilen Yorum</span>
                          <span className="text-[9px] font-bold text-gray-400 italic">"{report.interaction.post.title}" duyurusunda</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">"{report.interaction.content}"</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Yorum Sahibi: {report.interaction.user.name}</p>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Bildiren:</span>
                          <span className="text-[10px] font-black text-black">{report.reporter.name}</span>
                        </div>
                        
                        {report.status === "PENDING" && (
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleResolveReport(report.id, "DISMISSED")}
                              className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-gray-200 hover:border-black transition-all"
                            >
                              Reddet
                            </button>
                            <button 
                              onClick={() => handleResolveReport(report.id, "RESOLVED")}
                              className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest bg-black text-white hover:bg-accent transition-all"
                            >
                              Çözüldü Olarak İşaretle
                            </button>
                          </div>
                        )}

                        {report.status !== "PENDING" && (
                          <span className={`text-[10px] font-black uppercase px-2 py-1 ${report.status === "RESOLVED" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                            {report.status === "RESOLVED" ? "ÇÖZÜLDÜ" : "REDDEDİLDİ"}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 border-2 border-dashed border-gray-100 text-center text-gray-400 font-bold italic uppercase tracking-widest text-xs">
                    Henüz şikayet bulunmuyor.
                  </div>
                )}
              </div>
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
