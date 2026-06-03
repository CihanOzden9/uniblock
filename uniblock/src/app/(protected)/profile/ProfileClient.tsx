"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { updateProfile, updateInterests, updatePassword } from "../../actions/profile";
import {
  Search,
  Plus,
  X,
  Sparkles,
  User,
  GraduationCap,
  ShieldCheck,
  Heart,
  RefreshCw,
  Eye,
  EyeOff,
  Check,
  Info,
  Mail,
  BadgeCheck,
  Image as ImageIcon,
} from "lucide-react";

interface Faculty {
  id: string;
  name: string;
  departments: Department[];
}

interface Department {
  id: string;
  name: string;
  facultyId: string;
}

interface ProfileClientProps {
  user: any;
  faculties: Faculty[];
}

const ALL_INTERESTS = [
  "Yazılım Geliştirme", "Yapay Zeka", "Veri Bilimi", "Siber Güvenlik", "Mobil Uygulama", "Web Tasarım",
  "Girişimcilik", "Pazarlama", "Finans", "Ekonomi", "İşletme", "Yönetim",
  "Tıp", "Biyoteknoloji", "Genetik", "Psikoloji", "Sosyoloji", "Felsefe",
  "Dijital Sanat", "Fotoğrafçılık", "Grafik Tasarım", "Müzik Üretimi", "Sinema", "Edebiyat",
  "E-Spor", "Basketbol", "Futbol", "Tenis", "Yoga", "Fitness",
  "Astronimi", "Fizik", "Kimya", "Matematik", "Robotik", "Blockchain",
  "Sürdürülebilirlik", "Çevre Bilimi", "Mimarlık", "İç Mimarlık", "Endüstriyel Tasarım",
  "Gastronomi", "Seyahat", "Dil Öğrenimi", "Gönüllülük", "Sosyal Sorumluluk"
];

const DEPARTMENT_SUGGESTIONS: Record<string, string[]> = {
  "Bilgisayar Mühendisliği": ["Yazılım Geliştirme", "Yapay Zeka", "Robotik", "Siber Güvenlik", "Blockchain", "Mobil Uygulama"],
  "Yazılım Mühendisliği": ["Yazılım Geliştirme", "Yapay Zeka", "Mobil Uygulama", "Web Tasarım", "Blockchain", "Siber Güvenlik"],
  "Elektrik-Elektronik Mühendisliği": ["Robotik", "Yazılım Geliştirme", "Yapay Zeka", "Fizik", "Matematik"],
  "Tıp": ["Tıp", "Biyoteknoloji", "Genetik", "Psikoloji", "Fitness", "Sürdürülebilirlik"],
  "İşletme": ["Girişimcilik", "Pazarlama", "Finans", "Yönetim", "Ekonomi", "Sosyal Sorumluluk"],
  "İktisat": ["Finans", "Ekonomi", "Girişimcilik", "Matematik", "Yönetim"],
  "Mimarlık": ["Mimarlık", "İç Mimarlık", "Endüstriyel Tasarım", "Grafik Tasarım", "Sürdürülebilirlik", "Fotoğrafçılık"],
  "İç Mimarlık ve Çevre Tasarımı": ["İç Mimarlık", "Mimarlık", "Endüstriyel Tasarım", "Grafik Tasarım", "Fotoğrafçılık"],
  "Psikoloji": ["Psikoloji", "Sosyoloji", "Felsefe", "Edebiyat", "Gönüllülük", "Yoga"],
  "Sosyoloji": ["Sosyoloji", "Psikoloji", "Felsefe", "Edebiyat", "Gönüllülük", "Sosyal Sorumluluk"],
  "Hukuk": ["Felsefe", "Edebiyat", "Gönüllülük", "Sosyal Sorumluluk", "Yönetim"]
};

const AVATAR_STYLES = [
  { id: "avataaars", name: "Avataaars" },
  { id: "bottts", name: "Robotlar" },
  { id: "pixel-art", name: "Piksel Sanatı" },
  { id: "lorelei", name: "Lorelei" },
  { id: "adventurer", name: "Maceracı" },
  { id: "fun-emoji", name: "Eğlenceli Emoji" }
];

const TAB_TRIGGER_CLASS =
  "flex items-center gap-2 rounded-full text-[13px] font-medium px-4 py-2 data-active:bg-primary! data-active:text-white! data-active:shadow-ambient transition-all text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high cursor-pointer";

export default function ProfileClient({ user, faculties }: ProfileClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>(user.interests || []);

  // Avatar states
  const [avatarMode, setAvatarMode] = useState<"dicebear" | "custom">(() => {
    if (user.image && !user.image.startsWith("https://api.dicebear.com/")) {
      return "custom";
    }
    return "dicebear";
  });

  const parsedAvatar = useMemo(() => {
    if (user.image && user.image.startsWith("https://api.dicebear.com/")) {
      try {
        const url = new URL(user.image);
        const pathParts = url.pathname.split("/").filter(Boolean);
        const style = pathParts[1] || "avataaars";
        const seed = url.searchParams.get("seed") || "uniblock";
        return { style, seed };
      } catch (e) {
        console.error("Failed to parse avatar URL:", e);
      }
    }
    return { style: "avataaars", seed: user.name || "uniblock" };
  }, [user.image, user.name]);

  const [avatarStyle, setAvatarStyle] = useState(parsedAvatar.style);
  const [avatarSeed, setAvatarSeed] = useState(parsedAvatar.seed);
  const [customAvatarUrl, setCustomAvatarUrl] = useState(
    avatarMode === "custom" ? user.image || "" : ""
  );

  const computedImageUrl = useMemo(() => {
    if (avatarMode === "dicebear") {
      return `https://api.dicebear.com/7.x/${avatarStyle}/svg?seed=${encodeURIComponent(avatarSeed)}`;
    }
    return customAvatarUrl;
  }, [avatarMode, avatarStyle, avatarSeed, customAvatarUrl]);

  // Academic states
  const [selectedFaculty, setSelectedFaculty] = useState(user.faculty || "");
  const [selectedDepartment, setSelectedDepartment] = useState(user.department || "");

  // Password fields
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPasswordValue, setNewPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");

  const departmentsOfSelectedFaculty = useMemo(() => {
    if (!selectedFaculty) return [];
    return faculties.find(f => f.name === selectedFaculty)?.departments ?? [];
  }, [selectedFaculty, faculties]);

  const handleFacultyChange = (value: string) => {
    setSelectedFaculty(value);
    setSelectedDepartment("");
  };

  const suggestions = useMemo(() => {
    const dept = selectedDepartment || user.department || "";
    const deptInterests = DEPARTMENT_SUGGESTIONS[dept] || DEPARTMENT_SUGGESTIONS["Bilgisayar Mühendisliği"];
    const unselectedDept = deptInterests.filter(i => !selectedInterests.includes(i));
    const others = ALL_INTERESTS.filter(i => !deptInterests.includes(i) && !selectedInterests.includes(i));
    const randomOthers = others.sort(() => 0.5 - Math.random()).slice(0, Math.max(0, 8 - unselectedDept.length));
    return [...unselectedDept, ...randomOthers].slice(0, 8);
  }, [selectedDepartment, user.department, selectedInterests]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return ALL_INTERESTS.filter(i =>
      i.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !selectedInterests.includes(i)
    ).slice(0, 5);
  }, [searchQuery, selectedInterests]);

  const addInterest = (interest: string) => {
    if (selectedInterests.length >= 5) {
      toast.warning("En fazla 5 ilgi alanı seçebilirsiniz.", {
        description: "Lütfen yeni bir alan eklemeden önce mevcutlardan birini kaldırın."
      });
      return;
    }
    setSelectedInterests([...selectedInterests, interest]);
    setSearchQuery("");
  };

  const removeInterest = (interest: string) => {
    setSelectedInterests(selectedInterests.filter(i => i !== interest));
  };

  async function handleUpdateProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    formData.set("image", computedImageUrl);
    formData.set("faculty", selectedFaculty);
    formData.set("department", selectedDepartment);

    const res = await updateProfile(formData, user.id);
    if (res.success) {
      toast.success("Profiliniz başarıyla güncellendi!", {
        description: "Yaptığınız değişiklikler tüm kampüste görünür durumda."
      });
    } else {
      toast.error(res.error || "Profil güncellenirken bir hata oluştu.");
    }
    setIsLoading(false);
  }

  async function handleSaveInterests() {
    setIsLoading(true);
    const res = await updateInterests(selectedInterests, user.id);
    if (res.success) {
      toast.success("İlgi alanları başarıyla kaydedildi!", {
        description: "Bölümünüze ve ilgi alanlarınıza özel kampüs önerileri güncellendi."
      });
    } else {
      toast.error(res.error || "İlgi alanları güncellenirken hata oluştu.");
    }
    setIsLoading(false);
  }

  async function handleUpdatePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPasswordLoading(true);

    if (newPasswordValue !== confirmPasswordValue) {
      toast.error("Yeni şifreler eşleşmiyor.");
      setIsPasswordLoading(false);
      return;
    }

    if (newPasswordValue.length < 6) {
      toast.error("Şifre en az 6 karakter olmalıdır.");
      setIsPasswordLoading(false);
      return;
    }

    const formData = new FormData(event.currentTarget);
    const res = await updatePassword(formData, user.id);

    if (res.success) {
      toast.success("Şifreniz başarıyla güncellendi!", {
        description: "Bir sonraki girişinizde yeni şifrenizi kullanabilirsiniz."
      });
      setNewPasswordValue("");
      setConfirmPasswordValue("");
      event.currentTarget.reset();
    } else {
      toast.error(res.error || "Şifre güncellenemedi.");
    }
    setIsPasswordLoading(false);
  }

  const passwordStrength = useMemo(() => {
    if (!newPasswordValue) return { score: 0, text: "Girilmedi", color: "bg-outline/20" };
    let score = 0;
    if (newPasswordValue.length >= 6) score += 1;
    if (/[A-Z]/.test(newPasswordValue)) score += 1;
    if (/[0-9]/.test(newPasswordValue)) score += 1;
    if (/[^A-Za-z0-9]/.test(newPasswordValue)) score += 1;

    switch (score) {
      case 1: return { score: 25, text: "Zayıf", color: "bg-red-500" };
      case 2: return { score: 50, text: "Orta", color: "bg-amber-500" };
      case 3: return { score: 75, text: "Güçlü", color: "bg-primary" };
      case 4: return { score: 100, text: "Çok Güçlü", color: "bg-green-500" };
      default: return { score: 0, text: "Çok Zayıf", color: "bg-red-600" };
    }
  }, [newPasswordValue]);

  const [firstName, lastName] = user.name?.split(" ") || ["", ""];

  const randomizeSeed = () => {
    const randomSeed = Math.random().toString(36).substring(2, 10);
    setAvatarSeed(randomSeed);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar user={{ ...user, image: computedImageUrl, department: selectedDepartment }} />

      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="bg-surface-container-low px-8 py-12 border-b border-outline-variant">
          <div className="mx-auto max-w-[1140px]">
            <span className="text-[12px] font-semibold uppercase tracking-wide text-primary">
              Öğrenci Paneli
            </span>
            <h1 className="mt-2 font-heading text-[clamp(28px,4vw,42px)] font-bold leading-[1.1] tracking-tight text-on-surface">
              Hesap Ayarları
            </h1>
            <p className="mt-3 max-w-[640px] text-[15px] leading-[1.6] text-on-surface-variant">
              Profilini, akademik bilgilerini, ilgi alanlarını ve hesap güvenliğini bu panelden yönetebilirsin.
            </p>
          </div>
        </section>

        {/* Gövde */}
        <div className="mx-auto w-full max-w-[1140px] px-8 py-10 flex flex-col gap-8 lg:flex-row">
          {/* Sol özet */}
          <aside className="w-full shrink-0 space-y-5 lg:w-[300px]">
            <Card className="overflow-hidden p-0 shadow-ambient">
              {/* Kapak şeridi */}
              <div className="h-20 bg-gradient-to-r from-primary to-[#0b3b73]" />
              <div className="flex flex-col items-center px-6 pb-6 -mt-12">
                <div className="relative">
                  <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-card bg-white shadow-ambient">
                    <img
                      src={computedImageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name || "User"}`}
                      alt="Profil avatarı"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <span className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-card bg-green-500">
                    <Check className="h-2.5 w-2.5 text-white stroke-[3px]" />
                  </span>
                </div>

                <h2 className="mt-3 font-heading text-lg font-bold tracking-tight text-on-surface">
                  {firstName} {lastName}
                </h2>
                <span className="mt-1 flex items-center gap-1.5 text-[12px] text-on-surface-variant">
                  <Mail className="h-3.5 w-3.5" />
                  <span className="max-w-[200px] truncate select-all">{user.email}</span>
                </span>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <span className="rounded-full bg-accent/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[color:var(--community-orange-deep)]">
                    {user.role}
                  </span>
                  <span className="flex items-center gap-1 rounded-full bg-green-500/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-green-700">
                    <BadgeCheck className="h-3.5 w-3.5" /> Aktif
                  </span>
                </div>

                {(selectedFaculty || selectedDepartment) && (
                  <div className="mt-5 w-full space-y-3 border-t border-outline-variant pt-5">
                    {selectedFaculty && (
                      <div>
                        <span className="block text-[10px] font-semibold uppercase tracking-wide text-on-surface-variant">Fakülte</span>
                        <div className="mt-0.5 flex items-center gap-1.5 text-[13px] font-semibold text-on-surface">
                          <GraduationCap className="h-4 w-4 shrink-0 text-primary" />
                          <span className="truncate">{selectedFaculty}</span>
                        </div>
                      </div>
                    )}
                    {selectedDepartment && (
                      <div>
                        <span className="block text-[10px] font-semibold uppercase tracking-wide text-on-surface-variant">Bölüm</span>
                        <p className="mt-0.5 truncate text-[13px] font-semibold text-on-surface">{selectedDepartment}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>

            {/* İpucu */}
            <div className="rounded-xl border border-outline-variant bg-surface-container-low p-5 shadow-ambient">
              <h3 className="flex items-center gap-1.5 text-[13px] font-bold text-on-surface">
                <Sparkles className="h-4 w-4 text-accent" /> İpucu
              </h3>
              <p className="mt-2 text-[12px] leading-relaxed text-on-surface-variant">
                İlgi alanlarını güncel tutarak kulüp ve proje takımı önerilerinin kalitesini artırabilirsin. En az 3 ilgi alanı seçmen önerilir.
              </p>
            </div>
          </aside>

          {/* Sağ paneli */}
          <div className="w-full min-w-0 flex-1">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="mb-6 flex h-auto w-fit max-w-full flex-wrap gap-1 rounded-full border border-outline-variant bg-surface-container-low p-1.5">
                <TabsTrigger value="general" className={TAB_TRIGGER_CLASS}>
                  <User className="h-4 w-4" /> Genel
                </TabsTrigger>
                <TabsTrigger value="academic" className={TAB_TRIGGER_CLASS}>
                  <GraduationCap className="h-4 w-4" /> Akademik
                </TabsTrigger>
                <TabsTrigger value="interests" className={TAB_TRIGGER_CLASS}>
                  <Heart className="h-4 w-4" /> İlgi Alanları
                </TabsTrigger>
                <TabsTrigger value="security" className={TAB_TRIGGER_CLASS}>
                  <ShieldCheck className="h-4 w-4" /> Güvenlik
                </TabsTrigger>
              </TabsList>

              {/* Tab 1: Genel & Görünüm */}
              <TabsContent value="general" className="focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 duration-200">
                <Card className="shadow-ambient">
                  <CardHeader className="border-b border-outline-variant pb-5">
                    <CardTitle className="font-heading text-xl font-bold tracking-tight text-on-surface">Profil & Görünüm</CardTitle>
                    <CardDescription className="text-[13px] text-on-surface-variant">Kişisel bilgilerini düzenle ve kampüs avatarını tasarla.</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleUpdateProfile}>
                    <CardContent className="space-y-6 p-6">
                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-[13px] font-semibold text-on-surface">Adın</Label>
                          <Input name="firstName" id="firstName" defaultValue={firstName} disabled={isLoading} className="h-11 rounded-xl border-outline-variant text-[14px]" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-[13px] font-semibold text-on-surface">Soyadın</Label>
                          <Input name="lastName" id="lastName" defaultValue={lastName} disabled={isLoading} className="h-11 rounded-xl border-outline-variant text-[14px]" required />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio" className="text-[13px] font-semibold text-on-surface">Biyografi</Label>
                        <Input name="bio" id="bio" defaultValue={user.bio || ""} placeholder="Kendinden ve ilgi alanlarından bahset..." disabled={isLoading} className="h-11 rounded-xl border-outline-variant text-[14px]" />
                      </div>

                      {/* Avatar tasarlayıcı */}
                      <div className="space-y-4 border-t border-outline-variant pt-5">
                        <div>
                          <Label className="flex items-center gap-1.5 text-[14px] font-bold text-on-surface">
                            <Sparkles className="h-4 w-4 text-primary" /> Kampüs Profil Resmi
                          </Label>
                          <span className="mt-0.5 block text-[12px] text-on-surface-variant">Eğlenceli bir avatar oluştur ya da özel bir görsel bağlantısı gir.</span>
                        </div>

                        <div className="flex w-fit gap-1 rounded-full border border-outline-variant bg-surface-container-low p-1">
                          <button
                            type="button"
                            onClick={() => setAvatarMode("dicebear")}
                            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-semibold transition-all ${avatarMode === "dicebear" ? "bg-primary text-white shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
                          >
                            <Sparkles className="h-3.5 w-3.5" /> Avatar Tasarlayıcı
                          </button>
                          <button
                            type="button"
                            onClick={() => setAvatarMode("custom")}
                            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-semibold transition-all ${avatarMode === "custom" ? "bg-primary text-white shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
                          >
                            <ImageIcon className="h-3.5 w-3.5" /> Özel Resim URL
                          </button>
                        </div>

                        {avatarMode === "dicebear" ? (
                          <div className="grid grid-cols-1 items-center gap-5 rounded-xl border border-outline-variant bg-surface-container-low p-4 md:grid-cols-12">
                            <div className="mx-auto flex aspect-square w-full max-w-[120px] items-center justify-center rounded-xl border border-outline-variant bg-white p-3 md:col-span-4">
                              <img src={computedImageUrl} alt="Avatar önizleme" className="h-full w-full object-contain" />
                            </div>
                            <div className="space-y-4 md:col-span-8">
                              <div className="space-y-1.5">
                                <Label className="text-[12px] font-bold text-on-surface">Avatar Stili</Label>
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                  {AVATAR_STYLES.map((style) => (
                                    <button
                                      key={style.id}
                                      type="button"
                                      onClick={() => setAvatarStyle(style.id)}
                                      className={`rounded-xl border p-2 text-center text-[11px] font-semibold transition-all ${avatarStyle === style.id ? "border-primary bg-primary/5 text-primary" : "border-outline-variant bg-surface text-on-surface-variant hover:bg-surface-container-high"}`}
                                    >
                                      {style.name}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Tohum girin..."
                                  value={avatarSeed}
                                  onChange={(e) => setAvatarSeed(e.target.value)}
                                  className="h-10 flex-1 rounded-xl border-outline-variant text-[13px]"
                                />
                                <Button type="button" onClick={randomizeSeed} variant="outline" className="h-10 rounded-xl border-outline-variant px-3" title="Rastgele Üret">
                                  <RefreshCw className="h-4 w-4 text-primary" />
                                  <span className="ml-1.5 hidden text-[12px] font-semibold sm:inline">Rastgele</span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2 rounded-xl border border-outline-variant bg-surface-container-low p-4">
                            <Label htmlFor="customAvatarUrl" className="text-[12px] font-bold text-on-surface">Görsel URL'si</Label>
                            <Input
                              id="customAvatarUrl"
                              type="url"
                              placeholder="https://example.com/resim.png"
                              value={customAvatarUrl}
                              onChange={(e) => setCustomAvatarUrl(e.target.value)}
                              className="h-11 rounded-xl border-outline-variant bg-white text-[13px]"
                            />
                            <span className="block text-[11px] text-on-surface-variant">Profil resmi olarak kullanmak istediğin resmin doğrudan web bağlantısını (URL) gir.</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="justify-end border-t border-outline-variant bg-surface-container-low p-4 px-6">
                      <Button type="submit" disabled={isLoading} className="rounded-full px-8 text-[13px] font-semibold">
                        {isLoading ? "Güncelleniyor..." : "Profili Kaydet"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>

              {/* Tab 2: Akademik */}
              <TabsContent value="academic" className="focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 duration-200">
                <Card className="shadow-ambient">
                  <CardHeader className="border-b border-outline-variant pb-5">
                    <CardTitle className="font-heading text-xl font-bold tracking-tight text-on-surface">Akademik Bilgiler</CardTitle>
                    <CardDescription className="text-[13px] text-on-surface-variant">Kampüsteki resmi fakülte ve bölüm bilgilerini güncelle.</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleUpdateProfile}>
                    <CardContent className="space-y-5 p-6">
                      <input type="hidden" name="firstName" value={firstName} />
                      <input type="hidden" name="lastName" value={lastName} />
                      <input type="hidden" name="bio" value={user.bio || ""} />

                      <div className="space-y-2">
                        <Label htmlFor="faculty" className="text-[13px] font-semibold text-on-surface">Fakülte</Label>
                        <select
                          id="faculty"
                          value={selectedFaculty}
                          onChange={(e) => handleFacultyChange(e.target.value)}
                          className="h-11 w-full rounded-xl border border-outline-variant bg-white px-3 text-[14px] font-medium text-on-surface transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          required
                        >
                          <option value="">Fakülte Seçin</option>
                          {faculties.map((f) => (
                            <option key={f.id} value={f.name}>{f.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="department" className="text-[13px] font-semibold text-on-surface">Bölüm</Label>
                        <select
                          id="department"
                          value={selectedDepartment}
                          onChange={(e) => setSelectedDepartment(e.target.value)}
                          disabled={!selectedFaculty}
                          className="h-11 w-full rounded-xl border border-outline-variant bg-white px-3 text-[14px] font-medium text-on-surface transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-surface-container-low disabled:opacity-50"
                          required
                        >
                          <option value="">Bölüm Seçin</option>
                          {departmentsOfSelectedFaculty.map((d) => (
                            <option key={d.id} value={d.name}>{d.name}</option>
                          ))}
                        </select>
                        {!selectedFaculty && (
                          <span className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-accent">
                            <Info className="h-3.5 w-3.5" /> Bölüm seçebilmek için önce fakülte seçmelisin.
                          </span>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="justify-end border-t border-outline-variant bg-surface-container-low p-4 px-6">
                      <Button type="submit" disabled={isLoading || !selectedFaculty || !selectedDepartment} className="rounded-full px-8 text-[13px] font-semibold">
                        {isLoading ? "Kaydediliyor..." : "Akademik Bilgileri Kaydet"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>

              {/* Tab 3: İlgi Alanları */}
              <TabsContent value="interests" className="focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 duration-200">
                <Card className="shadow-ambient">
                  <CardHeader className="border-b border-outline-variant pb-5">
                    <CardTitle className="font-heading text-xl font-bold tracking-tight text-on-surface">İlgi Alanları</CardTitle>
                    <CardDescription className="text-[13px] text-on-surface-variant">
                      Kişiselleştirilmiş akış ve topluluk eşleşmeleri için en fazla 5 ilgi alanı belirle.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    {/* İlerleme */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[12px] font-semibold">
                        <span className="text-on-surface-variant">Seçim İlerlemesi</span>
                        <span className={selectedInterests.length === 5 ? "text-accent" : "text-primary"}>
                          {selectedInterests.length} / 5 Seçildi
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-low border border-outline-variant">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${selectedInterests.length === 5 ? "bg-accent" : "bg-primary"}`}
                          style={{ width: `${(selectedInterests.length / 5) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Seçilenler */}
                    <div className="space-y-2.5">
                      <Label className="block text-[11px] font-bold uppercase tracking-wide text-on-surface-variant">Seçtiğin Alanlar</Label>
                      <div className="flex min-h-[46px] flex-wrap gap-2 rounded-xl border border-dashed border-outline-variant bg-surface-container-low p-3">
                        {selectedInterests.length > 0 ? (
                          selectedInterests.map((interest) => (
                            <button
                              key={interest}
                              onClick={() => removeInterest(interest)}
                              className="group flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-[12px] font-semibold text-white shadow-sm transition-all hover:bg-destructive active:scale-95"
                              title="Silmek için tıkla"
                            >
                              <span>{interest}</span>
                              <X className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:rotate-90" />
                            </button>
                          ))
                        ) : (
                          <div className="flex items-center gap-1.5 py-1.5 text-[13px] italic text-on-surface-variant">
                            <Info className="h-4 w-4 text-outline" /> Henüz ilgi alanı seçmedin. Aşağıdan ekle.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Arama */}
                    <div className="relative space-y-2">
                      <Label htmlFor="interest-search" className="block text-[11px] font-bold uppercase tracking-wide text-on-surface-variant">İlgi Alanı Arama</Label>
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
                        <Input
                          id="interest-search"
                          placeholder="Aramak istediğin ilgi alanını yaz... (örn: Yapay Zeka)"
                          className="h-12 rounded-xl border-outline-variant pl-11 text-[14px]"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          disabled={selectedInterests.length >= 5}
                        />
                      </div>

                      {searchResults.length > 0 && (
                        <div className="absolute left-0 top-[100%] z-50 mt-1 max-h-[220px] w-full divide-y divide-outline-variant overflow-hidden overflow-y-auto rounded-xl border border-outline-variant bg-card shadow-ambient-lg animate-in fade-in duration-100">
                          {searchResults.map((res) => (
                            <button
                              key={res}
                              onClick={() => addInterest(res)}
                              className="group flex w-full items-center justify-between px-5 py-3 text-left transition-colors hover:bg-surface-container-low"
                            >
                              <span className="text-[13px] font-semibold text-on-surface">{res}</span>
                              <span className="flex items-center gap-0.5 text-[11px] font-bold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                                Ekle <Plus className="h-3.5 w-3.5" />
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Öneriler */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4 text-accent" />
                        <Label className="text-[11px] font-bold uppercase tracking-wide text-[color:var(--community-orange-deep)]">
                          Senin İçin Önerilenler
                        </Label>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {suggestions.length > 0 ? (
                          suggestions.map((sug) => (
                            <button
                              key={sug}
                              onClick={() => addInterest(sug)}
                              disabled={selectedInterests.length >= 5}
                              className="flex items-center gap-1 rounded-full border border-outline-variant bg-surface-container-low px-3.5 py-1.5 text-[12px] font-semibold text-on-surface-variant transition-all hover:bg-primary-fixed hover:text-primary active:scale-95 disabled:opacity-50 disabled:hover:bg-surface-container-low disabled:hover:text-on-surface-variant"
                            >
                              <Plus className="h-3 w-3 text-primary/70" /> {sug}
                            </button>
                          ))
                        ) : (
                          <span className="text-[12px] italic text-on-surface-variant">Şu an yeni öneri bulunmuyor.</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-end border-t border-outline-variant bg-surface-container-low p-4 px-6">
                    <Button onClick={handleSaveInterests} disabled={isLoading} className="rounded-full px-8 text-[13px] font-semibold">
                      {isLoading ? "Kaydediliyor..." : "İlgi Alanlarını Kaydet"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Tab 4: Güvenlik */}
              <TabsContent value="security" className="focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 duration-200">
                <Card className="shadow-ambient">
                  <CardHeader className="border-b border-outline-variant pb-5">
                    <CardTitle className="font-heading text-xl font-bold tracking-tight text-on-surface">Güvenlik Ayarları</CardTitle>
                    <CardDescription className="text-[13px] text-on-surface-variant">Şifreni periyodik olarak güncelleyerek hesabını koru.</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleUpdatePassword}>
                    <CardContent className="space-y-5 p-6">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword" className="text-[13px] font-semibold text-on-surface">Mevcut Şifre</Label>
                        <div className="relative">
                          <Input id="currentPassword" name="currentPassword" type={showCurrentPassword ? "text" : "password"} disabled={isPasswordLoading} className="h-11 rounded-xl border-outline-variant pr-10 text-[14px]" required />
                          <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors hover:text-on-surface">
                            {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-[13px] font-semibold text-on-surface">Yeni Şifre</Label>
                        <div className="relative">
                          <Input id="newPassword" name="newPassword" type={showNewPassword ? "text" : "password"} disabled={isPasswordLoading} value={newPasswordValue} onChange={(e) => setNewPasswordValue(e.target.value)} className="h-11 rounded-xl border-outline-variant pr-10 text-[14px]" required />
                          <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors hover:text-on-surface">
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>

                        {newPasswordValue && (
                          <div className="space-y-1.5 pt-1">
                            <div className="flex justify-between text-[11px] font-semibold">
                              <span className="text-on-surface-variant">Şifre Gücü</span>
                              <span className="text-primary">{passwordStrength.text}</span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-outline/25">
                              <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color}`} style={{ width: `${passwordStrength.score}%` }} />
                            </div>
                            <span className="block text-[10px] leading-relaxed text-on-surface-variant">
                              Güçlü bir şifre için en az 6 karakter kullan; büyük/küçük harf, rakam ve özel karakter ekle.
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-[13px] font-semibold text-on-surface">Yeni Şifre (Tekrar)</Label>
                        <div className="relative">
                          <Input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} disabled={isPasswordLoading} value={confirmPasswordValue} onChange={(e) => setConfirmPasswordValue(e.target.value)} className="h-11 rounded-xl border-outline-variant pr-10 text-[14px]" required />
                          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors hover:text-on-surface">
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {confirmPasswordValue && newPasswordValue !== confirmPasswordValue && (
                          <span className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-destructive">
                            <Info className="h-4 w-4 shrink-0" /> Şifreler henüz eşleşmedi.
                          </span>
                        )}
                        {confirmPasswordValue && newPasswordValue === confirmPasswordValue && (
                          <span className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-green-600">
                            <Check className="h-4 w-4 shrink-0" /> Şifreler eşleşti!
                          </span>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="justify-end border-t border-outline-variant bg-surface-container-low p-4 px-6">
                      <Button type="submit" disabled={isPasswordLoading || !newPasswordValue || newPasswordValue !== confirmPasswordValue || newPasswordValue.length < 6} className="rounded-full px-8 text-[13px] font-semibold">
                        {isPasswordLoading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <footer className="mt-auto shrink-0 border-t border-outline-variant bg-card px-8 py-8">
        <div className="mx-auto flex max-w-[1140px] flex-col items-center justify-between gap-6 md:flex-row">
          <div className="font-heading text-[18px] font-extrabold text-primary">
            Uni<span className="text-accent">.</span>Block
          </div>
          <p className="text-[12px] font-medium text-on-surface-variant">© 2026 Kampüs Haber Ağı · Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}
