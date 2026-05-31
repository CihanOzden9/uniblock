"use client";

import { useState } from "react";
import AdminNavbar from "@/components/layout/AdminNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, FileText, Calendar, Activity, Plus, Crown } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { createPost, updatePost, deletePost } from "@/app/actions/post";
import { createCommunityEvent, updateCommunityEvent, deleteCommunityEvent } from "@/app/actions/event";
import { createSurvey, deleteSurvey } from "@/app/actions/survey";
import { addTeamMember, removeTeamMember, updateTeamMemberRole, handleJoinRequest, checkUserExistence } from "@/app/actions/team";
import { toast } from "sonner";
import { Trash2, Edit, PlusCircle, AlertCircle, ShieldAlert, ListFilter, Search } from "lucide-react";
import { resolveReport } from "@/app/actions/interaction";

export default function TeamDashboardClient({ team }: { team: any }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [contentSubTab, setContentSubTab] = useState<"posts" | "surveys">("posts");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"create_post" | "edit_post" | "create_survey" | "create_event" | "edit_event">("create_post");
  const [editingPost, setEditingPost] = useState<any>(null);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [memberSubTab, setMemberSubTab] = useState<"list" | "requests">("list");
  const [isPending, setIsPending] = useState(false);
  const [memberSearchTerm, setMemberSearchTerm] = useState("");
  const [postContentLength, setPostContentLength] = useState(0);
  const POST_CONTENT_MAX = 250;
  const [boardRoleSelect, setBoardRoleSelect] = useState("KAPTAN YARDIMCISI");
  const [customRoleInput, setCustomRoleInput] = useState("");
  const [boardMemberEmail, setBoardMemberEmail] = useState("");
  const [selectedMemberForBoard, setSelectedMemberForBoard] = useState("");
  const [boardAddMode, setBoardAddMode] = useState<"existing" | "email">("existing");
  const [emailCheckResult, setEmailCheckResult] = useState<{ exists: boolean; user?: any; isMember?: boolean; memberRole?: string } | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  async function handlePostSubmit(formData: FormData) {
    setIsPending(true);
    formData.append("teamId", team.id);
    formData.append("authorId", team.leaderId);

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

  async function handleEventSubmit(formData: FormData) {
    setIsPending(true);
    formData.append("teamId", team.id);
    let result;
    if (sheetMode === "edit_event" && editingEvent) {
      formData.append("id", editingEvent.id);
      result = await updateCommunityEvent(formData);
    } else {
      result = await createCommunityEvent(formData);
    }
    if (result.success) {
      toast.success(sheetMode === "edit_event" ? "Etkinlik güncellendi!" : "Etkinlik paylaşıldı! Takvimde işaretlendi.");
      setIsSheetOpen(false);
      setEditingEvent(null);
    } else {
      toast.error(result.error);
    }
    setIsPending(false);
  }

  async function handleDeleteEvent(id: string) {
    if (!confirm("Bu etkinliği silmek istediğinize emin misiniz?")) return;
    const result = await deleteCommunityEvent(id, team.id);
    if (result.success) toast.success("Etkinlik silindi.");
    else toast.error(result.error);
  }

  const toLocalInput = (d: any) => {
    const dt = new Date(d);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
  };

  async function handleSurveySubmit(formData: FormData) {
    setIsPending(true);
    formData.append("teamId", team.id);
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
    formData.append("teamId", team.id);
    const result = await addTeamMember(formData);
    if (result.success) {
      toast.success("Üye başarıyla eklendi!");
    } else {
      toast.error(result.error);
    }
    setIsPending(false);
  }

  async function handleRemoveMember(userId: string) {
    if (confirm("Bu üyeyi takımdan çıkarmak istediğinize emin misiniz?")) {
      setIsPending(true);
      const result = await removeTeamMember(team.id, userId);
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
    const result = await updateTeamMemberRole(team.id, userId, newRole);
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
    setPostContentLength(0);
    setIsSheetOpen(true);
  };

  const openEditPost = (post: any) => {
    setSheetMode("edit_post");
    setEditingPost(post);
    setPostContentLength(post.content?.length || 0);
    setIsSheetOpen(true);
  };

  const openCreateSurvey = () => {
    setSheetMode("create_survey");
    setIsSheetOpen(true);
  };

  const openCreateEvent = () => {
    setSheetMode("create_event");
    setEditingEvent(null);
    setIsSheetOpen(true);
  };

  const openEditEvent = (ev: any) => {
    setSheetMode("edit_event");
    setEditingEvent(ev);
    setIsSheetOpen(true);
  };

  const approvedMembers = team.members?.filter((m: any) => m.status === "APPROVED" && m.userId !== team.leaderId) || [];
  const pendingMembersCount = team.members?.filter((m: any) => m.status === "PENDING").length || 0;
  const boardMembers = approvedMembers.filter((m: any) => m.role !== "MEMBER");
  const regularMembers = approvedMembers.filter((m: any) => m.role === "MEMBER");

  const filteredMembers = approvedMembers.filter((m: any) =>
    m.user.name?.toLowerCase().includes(memberSearchTerm.toLowerCase()) ||
    m.user.email?.toLowerCase().includes(memberSearchTerm.toLowerCase()) ||
    (m.user.faculty && m.user.faculty.toLowerCase().includes(memberSearchTerm.toLowerCase())) ||
    (m.user.department && m.user.department.toLowerCase().includes(memberSearchTerm.toLowerCase()))
  );

  const PREDEFINED_ROLES = [
    "KAPTAN YARDIMCISI",
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
      const result = await updateTeamMemberRole(team.id, selectedMemberForBoard, role);
      if (result.success) {
        toast.success("Yönetim rolü atandı!");
        setSelectedMemberForBoard("");
      } else {
        toast.error(result.error);
      }
    } else if (boardAddMode === "email" && boardMemberEmail) {
      const check = await checkUserExistence(boardMemberEmail, team.id);

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
      formData.append("teamId", team.id);
      formData.append("role", role);
      const result = await addTeamMember(formData);
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
    const result = await checkUserExistence(boardMemberEmail, team.id);
    if (result.success) {
      setEmailCheckResult({ exists: true, user: result.user, isMember: result.isMember, memberRole: result.memberRole });
    } else if (result.error === "USER_NOT_FOUND") {
      setEmailCheckResult({ exists: false });
    }
    setIsCheckingEmail(false);
  };

  async function handleRemoveFromBoard(userId: string) {
    setIsPending(true);
    const result = await updateTeamMemberRole(team.id, userId, "MEMBER");
    if (result.success) toast.success("Yönetim rolü kaldırıldı.");
    else toast.error(result.error);
    setIsPending(false);
  }

  const TABS = [
    { id: "overview", label: "Genel Bakış", icon: Activity },
    { id: "posts", label: "İçerikler", icon: FileText },
    { id: "events", label: "Etkinlikler", icon: Calendar },
    { id: "members", label: "Üyeler", icon: Users },
    { id: "management", label: "Takım Yönetimi", icon: Crown },
    { id: "reports", label: "Şikayetler", icon: ShieldAlert },
  ];

  const inputClass = "w-full h-11 px-4 rounded-lg border border-input bg-card text-[14px] text-on-surface outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring transition-colors";
  const labelClass = "text-[13px] font-medium text-on-surface";
  const subTabBtn = (active: boolean) =>
    `px-6 h-10 rounded-full text-[13px] font-medium transition-colors ${active ? "bg-primary text-white" : "text-on-surface-variant hover:text-on-surface"}`;

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <AdminNavbar user={{ name: team.leader.name || "Yönetici", role: team.leader.role }} basePath="/teams/manage" />

      <main className="flex-1 pt-24 pb-12 px-4 md:px-8 max-w-[1400px] mx-auto w-full flex flex-col lg:flex-row gap-gutter">

        {/* Sidebar Nav */}
        <aside className="w-full lg:w-[280px] shrink-0 flex flex-col gap-5">
          <div className="bg-primary text-white p-6 rounded-xl shadow-ambient">
            <span className="text-[11px] font-semibold tracking-wide uppercase text-white/70 mb-1.5 block">
              Yönetim Paneli
            </span>
            <h1 className="font-heading text-xl font-bold tracking-tight leading-tight">
              {team.name}
            </h1>
          </div>

          <nav className="flex flex-col gap-1 bg-card rounded-xl border border-outline-variant shadow-ambient p-2">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-[14px] ${
                    isActive
                      ? "bg-primary-fixed text-primary"
                      : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                  }`}
                >
                  <Icon className="w-[18px] h-[18px]" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 bg-card rounded-xl border border-outline-variant shadow-ambient p-6 md:p-10 min-h-[600px]">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4 border-b border-outline-variant pb-6">
            <div>
              <h2 className="font-heading text-2xl font-bold tracking-tight text-on-surface">
                {TABS.find(t => t.id === activeTab)?.label}
              </h2>
              <p className="text-on-surface-variant text-[14px] mt-1.5">
                Takım içeriklerinizi ve üyelerinizi buradan yönetin.
              </p>
            </div>
          </div>

          <div className="mt-6">

            {/* Overview */}
            {activeTab === "overview" && (
              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                  <Card className="shadow-ambient">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 bg-primary-fixed text-primary flex items-center justify-center rounded-lg">
                          <FileText className="w-5 h-5" />
                        </div>
                      </div>
                      <h3 className="text-[13px] font-medium text-on-surface-variant mb-1">Toplam İçerik</h3>
                      <p className="font-heading text-4xl font-bold tracking-tight text-on-surface">{team.posts?.length || 0}</p>
                    </CardContent>
                  </Card>

                  <Card className="shadow-ambient">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 bg-accent/15 text-[color:var(--community-orange-deep)] flex items-center justify-center rounded-lg">
                          <Users className="w-5 h-5" />
                        </div>
                      </div>
                      <h3 className="text-[13px] font-medium text-on-surface-variant mb-1">Toplam Üye</h3>
                      <p className="font-heading text-4xl font-bold tracking-tight text-on-surface">{approvedMembers.length}</p>
                    </CardContent>
                  </Card>

                  <Card className="shadow-ambient">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 bg-primary-fixed text-primary flex items-center justify-center rounded-lg">
                          <ListFilter className="w-5 h-5" />
                        </div>
                      </div>
                      <h3 className="text-[13px] font-medium text-on-surface-variant mb-1">Aktif Anket</h3>
                      <p className="font-heading text-4xl font-bold tracking-tight text-on-surface">{team.surveys?.length || 0}</p>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className="font-heading text-xl font-bold tracking-tight mb-5 flex items-center gap-3">
                    Son İçerikler <span className="bg-accent text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">YENİ</span>
                  </h3>
                  <div className="flex flex-col gap-3">
                    {team.posts?.length > 0 ? (
                      team.posts.map((post: any) => (
                        <div key={post.id} className="group border border-outline-variant hover:border-primary/40 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-ambient">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-[11px] font-semibold text-primary bg-primary-fixed px-2.5 py-0.5 rounded-full">{post.type}</span>
                              <span className="text-[12px] text-on-surface-variant">{new Date(post.createdAt).toLocaleDateString("tr-TR")}</span>
                            </div>
                            <h4 className="font-semibold text-[16px] text-on-surface group-hover:text-primary transition-colors">{post.title}</h4>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" onClick={() => openEditPost(post)} className="w-10 h-10 p-0 rounded-full border-outline-variant hover:border-primary hover:text-primary"><Edit className="w-4 h-4" /></Button>
                            <Button variant="outline" onClick={() => handleDeletePost(post.id)} className="w-10 h-10 p-0 rounded-full border-outline-variant hover:border-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 border border-dashed border-outline-variant rounded-xl text-center text-on-surface-variant font-medium">
                        Henüz içerik oluşturulmamış.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Posts & Surveys */}
            {activeTab === "posts" && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                  <button onClick={openCreatePost} className="group bg-primary p-6 text-left rounded-xl shadow-ambient hover:shadow-ambient-lg hover:-translate-y-0.5 transition-all">
                    <div className="w-10 h-10 bg-white/20 text-white flex items-center justify-center rounded-lg mb-4"><Plus className="w-5 h-5" /></div>
                    <h3 className="text-white font-heading text-lg font-bold tracking-tight mb-1">Yeni Duyuru</h3>
                    <p className="text-white/80 text-[13px]">Kampüs duyurusu paylaşın.</p>
                  </button>

                  <button onClick={openCreateEvent} className="group bg-accent p-6 text-left rounded-xl shadow-ambient hover:shadow-ambient-lg hover:-translate-y-0.5 transition-all">
                    <div className="w-10 h-10 bg-white/20 text-white flex items-center justify-center rounded-lg mb-4"><Calendar className="w-5 h-5" /></div>
                    <h3 className="text-white font-heading text-lg font-bold tracking-tight mb-1">Yeni Etkinlik</h3>
                    <p className="text-white/80 text-[13px]">Yer, tarih ve kontenjanlı etkinlik.</p>
                  </button>

                  <button onClick={openCreateSurvey} className="group bg-primary-container p-6 text-left rounded-xl shadow-ambient hover:shadow-ambient-lg hover:-translate-y-0.5 transition-all">
                    <div className="w-10 h-10 bg-white/20 text-white flex items-center justify-center rounded-lg mb-4"><ListFilter className="w-5 h-5" /></div>
                    <h3 className="text-white font-heading text-lg font-bold tracking-tight mb-1">Yeni Anket</h3>
                    <p className="text-white/80 text-[13px]">Görüşleri toplayın.</p>
                  </button>
                </div>

                <div className="flex gap-1 bg-surface-container-low rounded-full p-1 w-fit">
                  <button onClick={() => setContentSubTab("posts")} className={subTabBtn(contentSubTab === "posts")}>Duyurular</button>
                  <button onClick={() => setContentSubTab("surveys")} className={subTabBtn(contentSubTab === "surveys")}>Anketler</button>
                </div>

                <div className="flex flex-col gap-3">
                  {contentSubTab === "posts" ? (
                    team.posts?.length > 0 ? (
                      team.posts.map((post: any) => (
                        <div key={post.id} className="group border border-outline-variant hover:border-primary/40 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-ambient">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-[11px] font-semibold text-primary bg-primary-fixed px-2.5 py-0.5 rounded-full">{post.type}</span>
                              <span className="text-[12px] text-on-surface-variant">{new Date(post.createdAt).toLocaleDateString()}</span>
                            </div>
                            <h4 className="font-semibold text-[16px] text-on-surface">{post.title}</h4>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" onClick={() => openEditPost(post)} className="w-10 h-10 p-0 rounded-full border-outline-variant hover:border-primary hover:text-primary"><Edit className="w-4 h-4" /></Button>
                            <Button variant="outline" onClick={() => handleDeletePost(post.id)} className="w-10 h-10 p-0 rounded-full border-outline-variant hover:border-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-12 border border-dashed border-outline-variant rounded-xl text-center text-on-surface-variant font-medium">Yayınlanmış duyuru bulunmuyor.</div>
                    )
                  ) : (
                    team.surveys?.length > 0 ? (
                      team.surveys.map((survey: any) => (
                        <div key={survey.id} className="group border border-outline-variant hover:border-primary/40 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-ambient">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-[11px] font-semibold text-primary bg-primary-fixed px-2.5 py-0.5 rounded-full">ANKET</span>
                              <span className="text-[12px] text-on-surface-variant">{new Date(survey.createdAt).toLocaleDateString()}</span>
                            </div>
                            <h4 className="font-semibold text-[16px] text-on-surface">{survey.question}</h4>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {survey.options?.map((opt: any) => {
                                const count = survey.interactions?.filter((i: any) => i.optionId === opt.id).length || 0;
                                return (
                                  <span key={opt.id} className="text-[11px] font-medium bg-surface-container-low border border-outline-variant px-2.5 py-1 rounded-full text-on-surface">
                                    {opt.text}: <span className="text-accent font-semibold">{count}</span>
                                  </span>
                                );
                              })}
                            </div>
                            <p className="text-[12px] text-on-surface-variant mt-2">Toplam: {survey.interactions?.length || 0} Katılımcı</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" onClick={() => handleDeleteSurvey(survey.id)} className="w-10 h-10 p-0 rounded-full border-outline-variant hover:border-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-12 border border-dashed border-outline-variant rounded-xl text-center text-on-surface-variant font-medium">Henüz anket oluşturulmamış.</div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Members */}
            {activeTab === "members" && (
              <div className="space-y-8">
                <div className="flex gap-1 bg-surface-container-low rounded-full p-1 w-fit">
                  <button onClick={() => setMemberSubTab("list")} className={subTabBtn(memberSubTab === "list")}>Üye Listesi</button>
                  <button onClick={() => setMemberSubTab("requests")} className={subTabBtn(memberSubTab === "requests")}>Gelen İstekler ({pendingMembersCount})</button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
                  <div className="lg:col-span-2 space-y-5">
                    {memberSubTab === "list" ? (
                      <>
                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                          <h3 className="font-heading text-lg font-bold tracking-tight flex items-center gap-3">
                            Aktif Üyeler <span className="bg-primary-fixed text-primary text-[11px] px-2.5 py-0.5 rounded-full font-semibold">{filteredMembers.length}</span>
                          </h3>
                          <div className="relative w-full md:w-64">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                            <input
                              type="text"
                              placeholder="Üye ara (ad, bölüm...)"
                              value={memberSearchTerm}
                              onChange={(e) => setMemberSearchTerm(e.target.value)}
                              className="w-full h-10 pl-10 pr-4 rounded-full border border-input bg-card text-[13px] text-on-surface outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring transition-colors"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-3">
                          {filteredMembers.length > 0 ? (
                            filteredMembers.map((member: any) => (
                              <div key={member.id} className="border border-outline-variant rounded-xl p-4 flex items-center justify-between group/member hover:shadow-ambient transition-all">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold">{member.user.name?.[0] || "U"}</div>
                                  <div>
                                    <p className="font-semibold text-[14px] text-on-surface">{member.user.name}</p>
                                    <div className="flex items-center gap-2">
                                      <p className="text-[12px] text-on-surface-variant">{member.role}</p>
                                      <button onClick={() => handleRoleChange(member.userId, member.role)} className="text-[11px] text-primary font-semibold hover:underline">[Değiştir]</button>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <span className="text-[12px] text-on-surface-variant hidden sm:block">Katılım: {new Date(member.joinedAt).toLocaleDateString()}</span>
                                  <Button variant="ghost" onClick={() => handleRemoveMember(member.userId)} className="w-9 h-9 p-0 rounded-full text-on-surface-variant hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover/member:opacity-100 transition-all"><Trash2 className="w-4 h-4" /></Button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-12 border border-dashed border-outline-variant rounded-xl text-center text-on-surface-variant font-medium">Henüz kayıtlı üye bulunmamaktadır.</div>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <h3 className="font-heading text-lg font-bold tracking-tight flex items-center gap-3">
                          Bekleyen İstekler <span className="bg-accent/15 text-[color:var(--community-orange-deep)] text-[11px] px-2.5 py-0.5 rounded-full font-semibold">{pendingMembersCount}</span>
                        </h3>
                        <div className="flex flex-col gap-3">
                          {team.members?.filter((m: any) => m.status === "PENDING").length > 0 ? (
                            team.members.filter((m: any) => m.status === "PENDING").map((request: any) => (
                              <div key={request.id} className="border border-outline-variant rounded-xl p-5 flex items-center justify-between bg-surface-container-low">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">{request.user.name?.[0] || "U"}</div>
                                  <div>
                                    <p className="font-semibold text-[14px] text-on-surface">{request.user.name}</p>
                                    <p className="text-[12px] text-on-surface-variant">{request.user.email}</p>
                                    <p className="text-[11px] text-primary font-medium mt-0.5">{request.user.faculty} / {request.user.department}</p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button onClick={() => onHandleJoinRequest(request.id, "REJECTED")} variant="outline" className="h-10 rounded-full border-outline-variant text-[13px] font-semibold hover:border-destructive hover:text-destructive transition-all">Reddet</Button>
                                  <Button onClick={() => onHandleJoinRequest(request.id, "APPROVED")} className="h-10 rounded-full text-[13px] font-semibold">Onayla</Button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-12 border border-dashed border-outline-variant rounded-xl text-center text-on-surface-variant font-medium">Bekleyen katılım isteği bulunmuyor.</div>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Add Member Form */}
                  <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 h-fit">
                    <h3 className="font-heading text-lg font-bold tracking-tight mb-5 flex items-center gap-2"><PlusCircle className="w-5 h-5 text-accent" /> Manuel Ekle</h3>
                    <form action={handleAddMember} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className={labelClass}>Öğrenci E-posta</label>
                        <input name="email" required placeholder="ogrenci@universite.edu.tr" className={inputClass} />
                      </div>
                      <div className="space-y-1.5">
                        <label className={labelClass}>Rol</label>
                        <select name="role" className={inputClass + " font-medium"}>
                          <option value="MEMBER">Üye</option>
                          <option value="BOARD_MEMBER">Yönetim Kurulu</option>
                        </select>
                      </div>
                      <Button type="submit" disabled={isPending} className="w-full mt-2 rounded-full text-[13px] font-semibold h-10">{isPending ? "Ekleniyor..." : "Takıma Ekle"}</Button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Management */}
            {activeTab === "management" && (
              <div className="space-y-8">
                <div>
                  <h3 className="font-heading text-lg font-bold tracking-tight flex items-center gap-3 mb-5">
                    <Crown className="w-5 h-5 text-accent" /> Yönetim Kadrosu
                    <span className="bg-accent/15 text-[color:var(--community-orange-deep)] text-[11px] px-2.5 py-0.5 rounded-full font-semibold">{boardMembers.length + 1}</span>
                  </h3>

                  <div className="flex flex-col gap-3">
                    <div className="border border-accent/40 rounded-xl p-5 flex items-center justify-between bg-accent/5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-bold text-lg">{team.leader.name?.[0] || "K"}</div>
                        <div>
                          <p className="font-semibold text-[14px] text-on-surface">{team.leader.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] font-semibold text-[color:var(--community-orange-deep)] bg-accent/15 px-2.5 py-0.5 rounded-full">KAPTAN</span>
                            {team.leader.department && <span className="text-[12px] text-on-surface-variant">{team.leader.department}</span>}
                          </div>
                        </div>
                      </div>
                      <span className="text-[12px] text-on-surface-variant">Değiştirilemez</span>
                    </div>

                    {boardMembers.map((member: any) => (
                      <div key={member.id} className="border border-outline-variant hover:border-primary/40 rounded-xl p-5 flex items-center justify-between group/board transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">{member.user.name?.[0] || "Y"}</div>
                          <div>
                            <p className="font-semibold text-[14px] text-on-surface">{member.user.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[11px] font-semibold text-primary bg-primary-fixed px-2.5 py-0.5 rounded-full">{member.role}</span>
                              {member.user.department && <span className="text-[12px] text-on-surface-variant">{member.user.department}</span>}
                            </div>
                            <p className="text-[12px] text-on-surface-variant mt-1">{member.user.email}</p>
                          </div>
                        </div>
                        <Button variant="ghost" onClick={() => handleRemoveFromBoard(member.userId)} className="h-9 rounded-full text-[12px] font-semibold text-on-surface-variant hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover/board:opacity-100 transition-all">Görevden Al</Button>
                      </div>
                    ))}

                    {boardMembers.length === 0 && (
                      <div className="p-8 border border-dashed border-outline-variant rounded-xl text-center text-on-surface-variant font-medium text-[14px]">Henüz yönetim kadrosuna atanmış üye bulunmuyor.</div>
                    )}
                  </div>
                </div>

                {/* Add Board Member */}
                <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6">
                  <h3 className="font-heading text-lg font-bold tracking-tight mb-5 flex items-center gap-2"><PlusCircle className="w-5 h-5 text-accent" /> Yönetici Ata</h3>

                  <div className="space-y-5">
                    <div className="flex gap-1 bg-card rounded-full p-1 w-fit border border-outline-variant">
                      <button onClick={() => setBoardAddMode("existing")} className={subTabBtn(boardAddMode === "existing")}>Mevcut Üyeden</button>
                      <button onClick={() => setBoardAddMode("email")} className={subTabBtn(boardAddMode === "email")}>E-posta ile</button>
                    </div>

                    {boardAddMode === "existing" ? (
                      <div className="space-y-1.5">
                        <label className={labelClass}>Üye Seç</label>
                        <select value={selectedMemberForBoard} onChange={(e) => setSelectedMemberForBoard(e.target.value)} className={inputClass + " font-medium"}>
                          <option value="">-- Üye seçin --</option>
                          {regularMembers.map((m: any) => (
                            <option key={m.userId} value={m.userId}>{m.user.name} ({m.user.email})</option>
                          ))}
                        </select>
                        {regularMembers.length === 0 && <p className="text-[12px] text-on-surface-variant mt-1">Atanabilecek üye bulunmuyor. Önce takıma üye ekleyin.</p>}
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <label className={labelClass}>E-posta Adresi</label>
                        <input
                          type="email"
                          value={boardMemberEmail}
                          onChange={(e) => { setBoardMemberEmail(e.target.value); setEmailCheckResult(null); }}
                          onBlur={handleEmailBlur}
                          placeholder="yonetici@universite.edu.tr"
                          className={`w-full h-11 px-4 rounded-lg border bg-card text-[14px] outline-none focus:ring-2 focus:ring-ring/50 transition-colors ${
                            emailCheckResult?.exists === false ? "border-destructive bg-destructive/5" :
                            emailCheckResult?.exists === true ? "border-emerald-500 bg-emerald-50" : "border-input focus:border-ring"
                          }`}
                        />
                        {isCheckingEmail && <p className="text-[12px] font-medium text-on-surface-variant mt-1 animate-pulse">Kontrol ediliyor...</p>}
                        {emailCheckResult?.exists === false && (
                          <div className="flex items-center gap-2 mt-2 p-2.5 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <p className="text-[12px] font-semibold leading-tight">Bu e-posta adresi UniBlock sisteminde kayıtlı değil!</p>
                          </div>
                        )}
                        {emailCheckResult?.exists === true && (
                          <div className="flex items-center gap-2 mt-2 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <p className="text-[12px] font-semibold leading-tight">
                              Kullanıcı Bulundu: <span className="text-on-surface">{emailCheckResult.user.name}</span>
                              {emailCheckResult.isMember && <span className="ml-2 text-on-surface-variant">(Zaten Üye: {emailCheckResult.memberRole})</span>}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className={labelClass}>Yönetim Rolü</label>
                      <select value={boardRoleSelect} onChange={(e) => setBoardRoleSelect(e.target.value)} className={inputClass + " font-medium"}>
                        {PREDEFINED_ROLES.map((role) => (<option key={role} value={role}>{role}</option>))}
                        <option value="DİĞER">DİĞER (Manuel Giriş)</option>
                      </select>
                    </div>

                    {boardRoleSelect === "DİĞER" && (
                      <div className="space-y-1.5">
                        <label className={labelClass}>Manuel Rol Adı</label>
                        <input type="text" value={customRoleInput} onChange={(e) => setCustomRoleInput(e.target.value)} placeholder="Örn: Araştırma Koordinatörü" className={inputClass} />
                      </div>
                    )}

                    <Button onClick={handleBoardAssignment} disabled={isPending} className="w-full rounded-full text-[13px] font-semibold h-10 bg-accent text-white hover:bg-accent/90">{isPending ? "Atanıyor..." : "Yönetici Olarak Ata"}</Button>
                  </div>
                </div>
              </div>
            )}

            {/* Events */}
            {activeTab === "events" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <h3 className="font-heading text-lg font-bold tracking-tight flex items-center gap-3">
                    Etkinlikler <span className="bg-primary-fixed text-primary text-[11px] px-2.5 py-0.5 rounded-full font-semibold">{team.events?.length || 0}</span>
                  </h3>
                  <Button onClick={openCreateEvent} className="rounded-full text-[13px] font-semibold h-10 bg-accent text-white hover:bg-accent/90">
                    <Plus className="w-4 h-4 mr-1.5" /> Yeni Etkinlik
                  </Button>
                </div>

                {team.events?.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {team.events.map((ev: any) => {
                      const d = new Date(ev.date);
                      const isPast = d.getTime() < Date.now();
                      const rsvp = ev._count?.interactions ?? 0;
                      return (
                        <div key={ev.id} className={`border rounded-xl p-4 flex items-center gap-4 transition-all hover:shadow-ambient ${ev.cancelled ? "border-destructive/30 bg-destructive/5" : "border-outline-variant"}`}>
                          <div className={`w-14 h-14 rounded-lg flex flex-col items-center justify-center shrink-0 ${isPast ? "bg-surface-container-high text-on-surface-variant" : "bg-primary-fixed text-primary"}`}>
                            <span className="text-[11px] font-semibold uppercase leading-none">{d.toLocaleDateString("tr-TR", { month: "short" })}</span>
                            <span className="text-[20px] font-bold leading-none mt-0.5">{d.getDate()}</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-semibold text-[15px] text-on-surface truncate">{ev.title}</h4>
                              {ev.cancelled && <span className="text-[10px] font-semibold bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">İptal</span>}
                              {isPast && !ev.cancelled && <span className="text-[10px] font-semibold bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full">Geçmiş</span>}
                            </div>
                            <p className="text-[12px] text-on-surface-variant flex items-center gap-3 mt-1 flex-wrap">
                              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {d.toLocaleString("tr-TR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}</span>
                              {ev.location && <span className="truncate">📍 {ev.location}</span>}
                              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {rsvp}{ev.capacity != null ? `/${ev.capacity}` : ""} katılımcı</span>
                            </p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <Button variant="outline" onClick={() => openEditEvent(ev)} className="w-10 h-10 p-0 rounded-full border-outline-variant hover:border-primary hover:text-primary"><Edit className="w-4 h-4" /></Button>
                            <Button variant="outline" onClick={() => handleDeleteEvent(ev.id)} className="w-10 h-10 p-0 rounded-full border-outline-variant hover:border-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-12 border border-dashed border-outline-variant rounded-xl text-center">
                    <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center mb-5 mx-auto"><Calendar className="w-8 h-8 text-primary" /></div>
                    <h3 className="font-heading text-xl font-bold tracking-tight mb-1.5">Henüz Etkinlik Yok</h3>
                    <p className="text-on-surface-variant max-w-md text-[14px] mx-auto">"Yeni Etkinlik" ile ilk etkinliğini paylaş; akışta ve takvimde görünsün.</p>
                  </div>
                )}
              </div>
            )}

            {/* Reports */}
            {activeTab === "reports" && (
              <div className="space-y-6">
                <h3 className="font-heading text-lg font-bold tracking-tight flex items-center gap-3">
                  Gelen Şikayetler <span className="bg-destructive/10 text-destructive text-[11px] px-2.5 py-0.5 rounded-full font-semibold">{team.reports?.filter((r: any) => r.status === "PENDING").length || 0} BEKLEYEN</span>
                </h3>

                <div className="flex flex-col gap-4">
                  {team.reports?.length > 0 ? (
                    team.reports.map((report: any) => (
                      <div key={report.id} className={`border rounded-xl p-6 flex flex-col gap-4 transition-all ${report.status === "PENDING" ? "border-destructive/20 bg-destructive/5" : "border-outline-variant bg-card opacity-70"}`}>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <AlertCircle className={`w-5 h-5 ${report.status === "PENDING" ? "text-destructive" : "text-on-surface-variant"}`} />
                            <div>
                              <span className="text-[11px] font-medium text-on-surface-variant">Şikayet Nedeni</span>
                              <p className="font-semibold text-[14px] text-on-surface">{report.reason || "Belirtilmemiş"}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[11px] text-on-surface-variant block">Tarih</span>
                            <span className="text-[12px] font-semibold text-on-surface">{new Date(report.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="bg-card border border-outline-variant p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-semibold bg-primary text-white px-2 py-0.5 rounded-full">Şikayet Edilen Yorum</span>
                            <span className="text-[11px] text-on-surface-variant italic">"{report.interaction.post.title}" duyurusunda</span>
                          </div>
                          <p className="text-[14px] text-on-surface mb-2">"{report.interaction.content}"</p>
                          <p className="text-[12px] text-on-surface-variant">Yorum Sahibi: {report.interaction.user.name}</p>
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-outline-variant">
                          <div className="flex items-center gap-2">
                            <span className="text-[12px] text-on-surface-variant">Bildiren:</span>
                            <span className="text-[12px] font-semibold text-on-surface">{report.reporter.name}</span>
                          </div>

                          {report.status === "PENDING" ? (
                            <div className="flex gap-2">
                              <button onClick={() => handleResolveReport(report.id, "DISMISSED")} className="px-4 py-2 text-[12px] font-semibold rounded-full border border-outline-variant hover:border-on-surface transition-all">Reddet</button>
                              <button onClick={() => handleResolveReport(report.id, "RESOLVED")} className="px-4 py-2 text-[12px] font-semibold rounded-full bg-primary text-white hover:bg-primary-container transition-all">Çözüldü Olarak İşaretle</button>
                            </div>
                          ) : (
                            <span className={`text-[11px] font-semibold rounded-full px-2.5 py-1 ${report.status === "RESOLVED" ? "bg-emerald-100 text-emerald-700" : "bg-surface-container-high text-on-surface-variant"}`}>
                              {report.status === "RESOLVED" ? "ÇÖZÜLDÜ" : "REDDEDİLDİ"}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 border border-dashed border-outline-variant rounded-xl text-center text-on-surface-variant font-medium">Henüz şikayet bulunmuyor.</div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-[500px] p-0 border-l border-outline-variant overflow-y-auto">
          <SheetHeader className="p-8 border-b border-outline-variant bg-surface-container-low text-left">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-primary-fixed text-primary text-[11px] font-semibold px-2.5 py-1 rounded-full">
                {sheetMode === "create_survey" ? "ANKET MERKEZİ" : (sheetMode === "create_event" || sheetMode === "edit_event") ? "ETKİNLİK MERKEZİ" : "İÇERİK STÜDYOSU"}
              </span>
            </div>
            <SheetTitle className="font-heading text-2xl font-bold tracking-tight">
              {sheetMode === "create_post" ? "Yeni Duyuru Yayınla" :
                sheetMode === "edit_post" ? "Duyuruyu Düzenle" :
                  sheetMode === "create_event" ? "Yeni Etkinlik Paylaş" :
                    sheetMode === "edit_event" ? "Etkinliği Düzenle" :
                      "Yeni Anket Oluştur"}
            </SheetTitle>
            <SheetDescription className="text-on-surface-variant text-[13px]">
              Bu işlem veritabanına kaydedilecek ve anında yayına alınacaktır.
            </SheetDescription>
          </SheetHeader>

          {sheetMode === "create_survey" ? (
            <form action={handleSurveySubmit} className="p-8 space-y-6">
              <div className="space-y-1.5">
                <label className={labelClass}>Soru</label>
                <input name="question" required placeholder="Örn: Gelecek antrenman nerede olsun?" className={inputClass + " h-12 font-medium"} />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Seçenekler (Virgülle ayırın)</label>
                <textarea name="options" required rows={4} placeholder="Saha A, Saha B, Online" className="w-full p-4 rounded-lg border border-input bg-card text-[14px] outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring resize-none" />
              </div>
              <Button type="submit" disabled={isPending} className="w-full rounded-full text-[14px] font-semibold h-12">{isPending ? "Oluşturuluyor..." : "Anketi Başlat"}</Button>
            </form>
          ) : (sheetMode === "create_event" || sheetMode === "edit_event") ? (
            <form key={editingEvent?.id || "new-event"} action={handleEventSubmit} className="p-8 space-y-6">
              <div className="space-y-1.5">
                <label htmlFor="ev-title" className={labelClass}>Etkinlik Başlığı</label>
                <input id="ev-title" name="title" required defaultValue={editingEvent?.title || ""} placeholder="Örn: Robotik Yarışması" className={inputClass + " h-12 font-medium"} />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="ev-desc" className={labelClass}>Açıklama</label>
                <textarea id="ev-desc" name="description" required rows={4} defaultValue={editingEvent?.description || ""} placeholder="Etkinlik detaylarını yazın..." className="w-full p-4 rounded-lg border border-input bg-card text-[14px] outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring resize-none" />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="ev-location" className={labelClass}>Yer / Konum</label>
                <input id="ev-location" name="location" defaultValue={editingEvent?.location || ""} placeholder="Örn: Mühendislik Fakültesi" className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="ev-date" className={labelClass}>Tarih & Saat</label>
                  <input id="ev-date" name="date" type="datetime-local" required defaultValue={editingEvent ? toLocalInput(editingEvent.date) : ""} className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="ev-capacity" className={labelClass}>Kontenjan</label>
                  <input id="ev-capacity" name="capacity" type="number" min="1" defaultValue={editingEvent?.capacity ?? ""} placeholder="Sınırsız" className={inputClass} />
                </div>
              </div>
              <div className="pt-5 border-t border-outline-variant flex gap-3">
                <Button type="button" variant="outline" onClick={() => setIsSheetOpen(false)} className="flex-1 rounded-full border-outline-variant text-[14px] font-semibold h-12">İptal</Button>
                <Button type="submit" disabled={isPending} className="flex-1 rounded-full text-[14px] font-semibold h-12 bg-accent text-white hover:bg-accent/90">{isPending ? "Kaydediliyor..." : (sheetMode === "edit_event" ? "Güncelle" : "Etkinliği Paylaş")}</Button>
              </div>
            </form>
          ) : (
            <form action={handlePostSubmit} className="p-8 space-y-6">
              <div className="space-y-1.5">
                <label htmlFor="title" className={labelClass}>Başlık</label>
                <input id="title" name="title" required defaultValue={editingPost?.title || ""} placeholder="Başlık yazın..." className={inputClass + " h-12 font-medium"} />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="content" className={labelClass}>İçerik Detayı</label>
                  <span className={`text-[12px] font-semibold transition-colors ${
                    postContentLength > POST_CONTENT_MAX * 0.9 ? "text-destructive" :
                    postContentLength > POST_CONTENT_MAX * 0.7 ? "text-accent" : "text-on-surface-variant"
                  }`}>{postContentLength}/{POST_CONTENT_MAX}</span>
                </div>
                <textarea
                  id="content" name="content" required rows={6} maxLength={POST_CONTENT_MAX}
                  defaultValue={editingPost?.content || ""}
                  onChange={(e) => setPostContentLength(e.target.value.length)}
                  placeholder="Detaylı bilgiyi buraya girin..."
                  className={`w-full p-4 rounded-lg border bg-card text-[14px] resize-none outline-none focus:ring-2 focus:ring-ring/50 transition-colors ${
                    postContentLength >= POST_CONTENT_MAX ? "border-destructive bg-destructive/5" : "border-input focus:border-ring"
                  }`}
                />
                {postContentLength >= POST_CONTENT_MAX && <p className="text-[12px] font-semibold text-destructive">Karakter sınırına ulaştınız!</p>}
              </div>

              <div className="pt-5 border-t border-outline-variant flex gap-3">
                <Button type="button" variant="outline" onClick={() => setIsSheetOpen(false)} className="flex-1 rounded-full border-outline-variant text-[14px] font-semibold h-12">İptal</Button>
                <Button type="submit" disabled={isPending} className="flex-1 rounded-full text-[14px] font-semibold h-12 bg-accent text-white hover:bg-accent/90">{isPending ? "İşleniyor..." : (sheetMode === "edit_post" ? "Güncelle" : "Yayınla")}</Button>
              </div>
            </form>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
