"use client";

import { useState, useMemo, useEffect } from "react";
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
  ChevronRight,
  Sparkle,
  Image as ImageIcon
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

const TAB_TRIGGER_CLASS = "flex items-center gap-2 rounded-xl text-[13px] font-medium px-4 py-2.5 data-active:bg-primary! data-active:text-white! data-active:shadow-ambient transition-all text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high cursor-pointer";

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
        const pathParts = url.pathname.split("/").filter(Boolean); // ["7.x", "avataaars", "svg"]
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

  // Final image to be sent
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

  // Handle faculty change (resets department selection)
  const handleFacultyChange = (value: string) => {
    setSelectedFaculty(value);
    setSelectedDepartment("");
  };

  // Interests filter suggestions
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

  // Add/remove interests
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

  // Profile save action
  async function handleUpdateProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    // Add computed avatar image url
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

  // Interests save action
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

  // Password save action
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
      // Clear forms
      setNewPasswordValue("");
      setConfirmPasswordValue("");
      event.currentTarget.reset();
    } else {
      toast.error(res.error || "Şifre güncellenemedi.");
    }
    setIsPasswordLoading(false);
  }

  // Password strength logic
  const passwordStrength = useMemo(() => {
    if (!newPasswordValue) return { score: 0, text: "Girilmedi", color: "bg-outline/20" };
    let score = 0;
    if (newPasswordValue.length >= 6) score += 1;
    if (/[A-Z]/.test(newPasswordValue)) score += 1;
    if (/[0-9]/.test(newPasswordValue)) score += 1;
    if (/[^A-Za-z0-9]/.test(newPasswordValue)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, text: "Zayıf", color: "bg-red-500" };
      case 2:
        return { score: 50, text: "Orta", color: "bg-amber-500" };
      case 3:
        return { score: 75, text: "Güçlü", color: "bg-primary-container" };
      case 4:
        return { score: 100, text: "Çok Güçlü", color: "bg-green-500" };
      default:
        return { score: 0, text: "Çok Zayıf", color: "bg-red-600" };
    }
  }, [newPasswordValue]);

  const [firstName, lastName] = user.name?.split(" ") || ["", ""];

  // Randomize Dicebear seed
  const randomizeSeed = () => {
    const randomSeed = Math.random().toString(36).substring(2, 10);
    setAvatarSeed(randomSeed);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar user={{ ...user, image: computedImageUrl, department: selectedDepartment }} />

      <main className="flex-1 pt-20">
        {/* Dynamic visual header band */}
        <header className="w-full bg-gradient-to-r from-surface-container-low via-surface-container to-surface-container-high py-12 px-margin-mobile md:px-margin-desktop border-b border-outline-variant relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Sparkle className="w-36 h-36 text-primary animate-pulse" />
          </div>
          <div className="max-w-[1140px] mx-auto relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-primary text-[11px] font-semibold uppercase tracking-wider mb-3">
                <GraduationCap className="w-3.5 h-3.5" /> Öğrenci Paneli
              </div>
              <h1 className="font-heading text-[clamp(28px,4vw,40px)] font-black tracking-tight leading-[1.1] text-on-surface">
                Hesap Ayarları
              </h1>
              <p className="text-[14px] md:text-[15px] leading-[1.6] text-on-surface-variant max-w-[580px] mt-1.5">
                Kişisel profilinizi, akademik bilgilerinizi, ilgi alanlarınızı ve hesap güvenliğinizi bu panelden düzenleyebilirsiniz.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-on-surface-variant bg-surface-container-high/60 backdrop-blur-sm p-3 px-4 rounded-xl border border-outline-variant/60 w-fit">
              <Info className="w-4 h-4 text-primary shrink-0" />
              <span>Verileriniz kampüs ağı içinde güvenle saklanır.</span>
            </div>
          </div>
        </header>

        {/* Settings grid */}
        <div className="max-w-[1140px] mx-auto w-full px-margin-mobile md:px-margin-desktop py-8 flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Info Card */}
          <aside className="w-full lg:w-[300px] shrink-0 space-y-6">
            <Card className="overflow-hidden p-0 border border-outline-variant shadow-ambient relative group bg-gradient-to-br from-white via-surface-container-low to-surface-container/40 text-on-surface">
              {/* ID Card Header Decoration */}
              <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary" />
              
              <div className="p-6 flex flex-col items-center relative overflow-hidden">
                {/* Decorative Grid Lines / Chip Graphic */}
                <div className="absolute top-4 right-4 opacity-75 hover:opacity-100 transition-opacity">
                  {/* Microchip simulation */}
                  <div className="w-8 h-8 rounded-md bg-gradient-to-br from-amber-400 to-amber-600 border border-amber-700/30 flex items-center justify-center p-1 shadow-sm">
                    <div className="grid grid-cols-3 gap-0.5 w-full h-full opacity-65">
                      <div className="border border-amber-900/20 rounded-xs"></div>
                      <div className="border border-amber-900/20 rounded-xs"></div>
                      <div className="border border-amber-900/20 rounded-xs"></div>
                      <div className="border border-amber-900/20 rounded-xs"></div>
                      <div className="border border-amber-900/20 rounded-xs"></div>
                      <div className="border border-amber-900/20 rounded-xs"></div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute top-4 left-4 text-[9px] font-black tracking-widest text-primary/60 uppercase">
                  CAMPUS PASS
                </div>

                {/* Avatar Frame with Gradient Ring */}
                <div className="mt-8 mb-4 relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary via-accent to-yellow-500 rounded-full blur-[2px] opacity-60 group-hover:scale-105 transition-transform duration-300" />
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-white p-1 relative z-10 shadow-lg border border-outline-variant/35">
                    <img
                      src={computedImageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name || 'User'}`}
                      alt="Avatar"
                      className="w-full h-full object-contain rounded-full bg-slate-50 transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <span className="absolute -bottom-1 right-2 z-20 flex h-4.5 w-4.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4.5 w-4.5 bg-green-500 border-2 border-white shadow-sm flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white stroke-[3px]" />
                    </span>
                  </span>
                </div>

                {/* Card Title Info */}
                <div className="text-center w-full z-10">
                  <h2 className="font-heading text-xl font-black tracking-tight text-on-surface leading-tight mt-2 drop-shadow-sm group-hover:text-primary transition-colors">
                    {firstName} {lastName}
                  </h2>
                  <p className="text-[11px] text-on-surface-variant mt-1 font-medium select-all hover:text-primary transition-colors">{user.email}</p>
                </div>

                {/* Metadata Fields styled like a security card */}
                <div className="w-full mt-6 pt-5 border-t border-outline-variant space-y-4 text-left z-10">
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[9px] font-bold text-on-surface-variant/60 uppercase tracking-widest block">ROL</span>
                      <span className="text-[11px] font-extrabold text-community-orange-deep bg-[#fd6c00]/10 border border-[#fd6c00]/20 px-2.5 py-0.5 rounded-full inline-block mt-1 tracking-wider uppercase">
                        {user.role}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-on-surface-variant/60 uppercase tracking-widest block">DURUM</span>
                      <span className="text-[11px] font-bold text-green-700 bg-green-500/10 border border-green-500/20 px-2.5 py-0.5 rounded-full inline-block mt-1 tracking-wider uppercase">
                        AKTİF
                      </span>
                    </div>
                  </div>

                  {selectedFaculty && (
                    <div>
                      <span className="text-[9px] font-bold text-on-surface-variant/60 uppercase tracking-widest block">FAKÜLTE</span>
                      <div className="flex items-center gap-1.5 mt-1 text-[12px] font-semibold text-on-surface">
                        <GraduationCap className="w-4 h-4 text-primary shrink-0" />
                        <span className="truncate">{selectedFaculty}</span>
                      </div>
                    </div>
                  )}

                  {selectedDepartment && (
                    <div>
                      <span className="text-[9px] font-bold text-on-surface-variant/60 uppercase tracking-widest block">BÖLÜM</span>
                      <div className="mt-1 text-[11px] font-bold bg-white/70 border border-outline-variant/60 p-1.5 px-3 rounded-xl text-on-surface/90 truncate">
                        {selectedDepartment}
                      </div>
                    </div>
                  )}

                </div>

                {/* Blockchain Theme Hash / Barcode Decoration */}
                <div className="w-full mt-6 pt-4 border-t border-outline-variant flex flex-col items-center gap-2.5 z-10 opacity-70 group-hover:opacity-100 transition-opacity">
                  <div className="w-full flex justify-between items-center text-[8px] font-bold text-on-surface-variant/40 tracking-widest uppercase">
                    <span>UniBlock Identity</span>
                    <span>BLOCK HASH</span>
                  </div>
                  {/* Decorative barcode-like dashes */}
                  <div className="w-full flex items-center justify-between h-5 bg-surface-container-high/40 p-1 rounded-md border border-outline-variant/50 overflow-hidden">
                    <div className="flex gap-[1.5px] h-full items-center opacity-75 w-full justify-center">
                      <div className="w-[1px] h-full bg-on-surface/85"></div>
                      <div className="w-[2px] h-full bg-on-surface/85"></div>
                      <div className="w-[1px] h-full bg-on-surface/85"></div>
                      <div className="w-[4px] h-full bg-on-surface/85"></div>
                      <div className="w-[1px] h-full bg-on-surface/85"></div>
                      <div className="w-[2px] h-full bg-on-surface/85"></div>
                      <div className="w-[1px] h-full bg-on-surface/85"></div>
                      <div className="w-[3px] h-full bg-on-surface/85"></div>
                      <div className="w-[1px] h-full bg-on-surface/85"></div>
                      <div className="w-[2px] h-full bg-on-surface/85"></div>
                      <div className="w-[1px] h-full bg-on-surface/85"></div>
                      <div className="w-[4px] h-full bg-on-surface/85"></div>
                      <div className="w-[1px] h-full bg-on-surface/85"></div>
                      <div className="w-[1px] h-full bg-on-surface/85"></div>
                      <div className="w-[3px] h-full bg-on-surface/85"></div>
                      <div className="w-[1px] h-full bg-on-surface/85"></div>
                      <div className="w-[2px] h-full bg-on-surface/85"></div>
                      <div className="w-[1px] h-full bg-on-surface/85"></div>
                      <div className="w-[4px] h-full bg-on-surface/85"></div>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-on-surface-variant/60 tracking-wider">
                    UB-{user.id ? user.id.toUpperCase().substring(0, 16) : "STUDENT-PASS"}
                  </span>
                </div>

              </div>
            </Card>

            {/* Quick Helper Tips */}
            <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/60 shadow-sm space-y-3">
              <h3 className="font-heading text-[13px] font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-accent" /> İpucu
              </h3>
              <p className="text-[12px] leading-relaxed text-on-surface-variant">
                İlgi alanlarınızı güncel tutarak kulüp ve proje takımı önerilerimizin kalitesini artırabilirsiniz. En az 3 ilgi alanı seçilmesi önerilir.
              </p>
            </div>
          </aside>

          {/* Settings Tabs Panel */}
          <div className="flex-1 w-full min-w-0">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="flex flex-wrap w-fit gap-1 rounded-2xl bg-surface-container-low p-1.5 mb-6 border border-outline-variant/50 h-auto">
                <TabsTrigger value="general" className={TAB_TRIGGER_CLASS}>
                  <User className="w-4 h-4" /> Genel & Görünüm
                </TabsTrigger>
                <TabsTrigger value="academic" className={TAB_TRIGGER_CLASS}>
                  <GraduationCap className="w-4 h-4" /> Akademik Bilgiler
                </TabsTrigger>
                <TabsTrigger value="interests" className={TAB_TRIGGER_CLASS}>
                  <Heart className="w-4 h-4" /> İlgi Alanları
                </TabsTrigger>
                <TabsTrigger value="security" className={TAB_TRIGGER_CLASS}>
                  <ShieldCheck className="w-4 h-4" /> Güvenlik
                </TabsTrigger>
              </TabsList>

              {/* Tab 1: Genel & Görünüm */}
              <TabsContent value="general" className="focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 duration-200">
                <Card className="border border-outline-variant shadow-ambient">
                  <CardHeader className="border-b border-outline-variant/50 pb-5">
                    <CardTitle className="font-heading text-xl font-black text-on-surface">Profil & Görünüm</CardTitle>
                    <CardDescription className="text-on-surface-variant text-[13px]">Kişisel bilgilerinizi düzenleyin ve kampüs avatarınızı tasarlayın.</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleUpdateProfile}>
                    <CardContent className="p-6 space-y-6">
                      
                      {/* Name inputs */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-[13px] font-semibold text-on-surface">Adınız</Label>
                          <Input 
                            name="firstName" 
                            id="firstName" 
                            defaultValue={firstName} 
                            disabled={isLoading} 
                            className="h-11 rounded-xl border-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary text-[14px]" 
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-[13px] font-semibold text-on-surface">Soyadınız</Label>
                          <Input 
                            name="lastName" 
                            id="lastName" 
                            defaultValue={lastName} 
                            disabled={isLoading} 
                            className="h-11 rounded-xl border-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary text-[14px]" 
                            required
                          />
                        </div>
                      </div>

                      {/* Bio input */}
                      <div className="space-y-2">
                        <Label htmlFor="bio" className="text-[13px] font-semibold text-on-surface">Biyografi</Label>
                        <Input 
                          name="bio" 
                          id="bio" 
                          defaultValue={user.bio || ""} 
                          placeholder="Kampüsteki ilgi alanlarınızdan, kendinizden bahsedin..." 
                          disabled={isLoading} 
                          className="h-11 rounded-xl border-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary text-[14px]" 
                        />
                      </div>

                      {/* Avatar Builder Section */}
                      <div className="pt-4 border-t border-outline-variant/60 space-y-4">
                        <div>
                          <Label className="text-[14px] font-bold text-on-surface flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-primary" /> Kampüs Profil Resmi
                          </Label>
                          <span className="text-[12px] text-on-surface-variant block mt-0.5">Eğlenceli bir avatar oluşturabilir veya özel bir görsel bağlantısı girebilirsiniz.</span>
                        </div>

                        {/* Mode selectors */}
                        <div className="flex gap-2 p-1 bg-surface-container-low rounded-xl border border-outline-variant/50 w-fit">
                          <button
                            type="button"
                            onClick={() => setAvatarMode("dicebear")}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-bold transition-all ${
                              avatarMode === "dicebear" 
                                ? "bg-primary text-white shadow-sm" 
                                : "text-on-surface-variant hover:text-on-surface"
                            }`}
                          >
                            <Sparkles className="w-3.5 h-3.5" /> Avatar Tasarlayıcı
                          </button>
                          <button
                            type="button"
                            onClick={() => setAvatarMode("custom")}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-bold transition-all ${
                              avatarMode === "custom" 
                                ? "bg-primary text-white shadow-sm" 
                                : "text-on-surface-variant hover:text-on-surface"
                            }`}
                          >
                            <ImageIcon className="w-3.5 h-3.5" /> Özel Resim URL
                          </button>
                        </div>

                        {/* Dicebear designer panel */}
                        {avatarMode === "dicebear" ? (
                          <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                            
                            {/* Live avatar preview */}
                            <div className="md:col-span-4 flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-outline-variant/50 aspect-square max-w-[120px] mx-auto w-full shadow-inner relative group">
                              <img 
                                src={computedImageUrl} 
                                alt="Live Avatar" 
                                className="w-full h-full object-contain rounded-lg"
                              />
                            </div>

                            {/* Controls */}
                            <div className="md:col-span-8 space-y-4">
                              {/* Style selector */}
                              <div className="space-y-1.5">
                                <Label className="text-[12px] font-bold text-on-surface">Avatar Stili</Label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                  {AVATAR_STYLES.map((style) => (
                                    <button
                                      key={style.id}
                                      type="button"
                                      onClick={() => setAvatarStyle(style.id)}
                                      className={`p-2 rounded-xl text-[11px] font-bold border transition-all text-center ${
                                        avatarStyle === style.id 
                                          ? "border-primary bg-primary/5 text-primary" 
                                          : "border-outline-variant/60 bg-surface hover:bg-surface-container-high text-on-surface-variant"
                                      }`}
                                    >
                                      {style.name}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Seed Input & Randomize */}
                              <div className="flex gap-2">
                                <div className="flex-1 space-y-1">
                                  <Input
                                    placeholder="Tohum girin..."
                                    value={avatarSeed}
                                    onChange={(e) => setAvatarSeed(e.target.value)}
                                    className="h-10 rounded-xl text-[13px] border-outline-variant"
                                  />
                                </div>
                                <Button
                                  type="button"
                                  onClick={randomizeSeed}
                                  variant="outline"
                                  className="h-10 rounded-xl border-outline-variant hover:bg-surface-container-high px-3"
                                  title="Rastgele Üret"
                                >
                                  <RefreshCw className="w-4 h-4 text-primary" />
                                  <span className="hidden sm:inline ml-1.5 text-[12px] font-semibold">Rastgele</span>
                                </Button>
                              </div>
                            </div>

                          </div>
                        ) : (
                          <div className="space-y-2 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60">
                            <Label htmlFor="customAvatarUrl" className="text-[12px] font-bold text-on-surface">Görsel URL'si</Label>
                            <div className="flex gap-2">
                              <Input
                                id="customAvatarUrl"
                                type="url"
                                placeholder="https://example.com/resim.png"
                                value={customAvatarUrl}
                                onChange={(e) => setCustomAvatarUrl(e.target.value)}
                                className="h-11 rounded-xl text-[13px] border-outline-variant bg-white"
                              />
                            </div>
                            <span className="text-[11px] text-on-surface-variant block">Profil resmi olarak kullanmak istediğiniz herhangi bir resmin doğrudan web bağlantısını (URL) girin.</span>
                          </div>
                        )}

                      </div>

                    </CardContent>
                    <CardFooter className="justify-end bg-surface-container-low/50 border-t border-outline-variant/60 p-4 px-6">
                      <Button type="submit" disabled={isLoading} className="rounded-full text-[13px] font-bold px-8 shadow-sm">
                        {isLoading ? "Güncelleniyor..." : "Profil Bilgilerini Kaydet"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>

              {/* Tab 2: Akademik Bilgiler */}
              <TabsContent value="academic" className="focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 duration-200">
                <Card className="border border-outline-variant shadow-ambient">
                  <CardHeader className="border-b border-outline-variant/50 pb-5">
                    <CardTitle className="font-heading text-xl font-black text-on-surface">Akademik Bilgiler</CardTitle>
                    <CardDescription className="text-on-surface-variant text-[13px]">Kampüsteki resmi fakülte ve bölüm bilgilerinizi güncelleyin.</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleUpdateProfile}>
                    <CardContent className="p-6 space-y-5">
                      
                      {/* Hidden name/bio so they don't overwrite with empty */}
                      <input type="hidden" name="firstName" value={firstName} />
                      <input type="hidden" name="lastName" value={lastName} />
                      <input type="hidden" name="bio" value={user.bio || ""} />

                      {/* Faculty Select Dropdown */}
                      <div className="space-y-2">
                        <Label htmlFor="faculty" className="text-[13px] font-semibold text-on-surface">Fakülte</Label>
                        <select
                          id="faculty"
                          value={selectedFaculty}
                          onChange={(e) => handleFacultyChange(e.target.value)}
                          className="w-full h-11 px-3 rounded-xl border border-outline-variant bg-white text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[14px] font-medium"
                          required
                        >
                          <option value="">Fakülte Seçin</option>
                          {faculties.map((f) => (
                            <option key={f.id} value={f.name}>
                              {f.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Department Select Dropdown */}
                      <div className="space-y-2">
                        <Label htmlFor="department" className="text-[13px] font-semibold text-on-surface">Bölüm</Label>
                        <select
                          id="department"
                          value={selectedDepartment}
                          onChange={(e) => setSelectedDepartment(e.target.value)}
                          disabled={!selectedFaculty}
                          className="w-full h-11 px-3 rounded-xl border border-outline-variant bg-white text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[14px] font-medium disabled:opacity-50 disabled:bg-surface-container-low"
                          required
                        >
                          <option value="">Bölüm Seçin</option>
                          {departmentsOfSelectedFaculty.map((d) => (
                            <option key={d.id} value={d.name}>
                              {d.name}
                            </option>
                          ))}
                        </select>
                        {!selectedFaculty && (
                          <span className="text-[11px] text-accent font-semibold flex items-center gap-1 mt-1">
                            <Info className="w-3.5 h-3.5" /> Bölüm seçebilmek için önce fakülte seçmelisiniz.
                          </span>
                        )}
                      </div>

                    </CardContent>
                    <CardFooter className="justify-end bg-surface-container-low/50 border-t border-outline-variant/60 p-4 px-6">
                      <Button type="submit" disabled={isLoading || !selectedFaculty || !selectedDepartment} className="rounded-full text-[13px] font-bold px-8 shadow-sm">
                        {isLoading ? "Kaydediliyor..." : "Akademik Bilgileri Kaydet"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>

              {/* Tab 3: İlgi Alanları */}
              <TabsContent value="interests" className="focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 duration-200">
                <Card className="border border-outline-variant shadow-ambient">
                  <CardHeader className="border-b border-outline-variant/50 pb-5">
                    <CardTitle className="font-heading text-xl font-black text-on-surface">İlgi Alanları</CardTitle>
                    <CardDescription className="text-on-surface-variant text-[13px]">
                      Kişiselleştirilmiş akış ve topluluk eşleşmeleri için en fazla 5 ilgi alanı belirleyin.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    
                    {/* Progress indicator */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[12px] font-bold">
                        <span className="text-on-surface-variant">Seçim İlerlemesi</span>
                        <span className={selectedInterests.length === 5 ? "text-accent" : "text-primary"}>
                          {selectedInterests.length} / 5 Seçildi
                        </span>
                      </div>
                      <div className="h-2 w-full bg-surface-container-low border border-outline-variant/40 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 rounded-full ${
                            selectedInterests.length === 5 ? "bg-accent" : "bg-primary"
                          }`}
                          style={{ width: `${(selectedInterests.length / 5) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Selected fields display grid */}
                    <div className="space-y-2.5">
                      <Label className="text-[11px] font-extrabold uppercase tracking-wider text-on-surface-variant block">Seçtiğiniz Alanlar</Label>
                      <div className="flex flex-wrap gap-2 min-h-[46px] p-3 rounded-xl bg-surface-container-low/50 border border-dashed border-outline-variant">
                        {selectedInterests.length > 0 ? (
                          selectedInterests.map((interest) => (
                            <button
                              key={interest}
                              onClick={() => removeInterest(interest)}
                              className="rounded-full bg-primary hover:bg-red-600 text-white px-3.5 py-1.5 flex items-center gap-1.5 transition-all text-[12px] font-bold shadow-sm group active:scale-95"
                              title="Silmek için tıklayın"
                            >
                              <span>{interest}</span>
                              <X className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:rotate-90" />
                            </button>
                          ))
                        ) : (
                          <div className="text-[13px] text-on-surface-variant/80 italic flex items-center gap-1.5 py-1.5">
                            <Info className="w-4 h-4 text-outline" /> Henüz ilgi alanı seçmediniz. Aşağıdan ekleyin.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Search & Add field */}
                    <div className="space-y-2 relative">
                      <Label htmlFor="interest-search" className="text-[11px] font-extrabold uppercase tracking-wider text-on-surface-variant block">İlgi Alanı Arama</Label>
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-on-surface-variant" />
                        <Input
                          id="interest-search"
                          placeholder="Aramak istediğiniz ilgi alanını yazın... (örn: Yapay Zeka)"
                          className="pl-11 h-12 rounded-xl border-outline-variant focus:ring-2 focus:ring-primary/20 text-[14px]"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          disabled={selectedInterests.length >= 5}
                        />
                      </div>

                      {/* Dropdown search results */}
                      {searchResults.length > 0 && (
                        <div className="absolute top-[100%] left-0 w-full bg-white border border-outline-variant rounded-xl z-50 shadow-ambient-lg max-h-[220px] overflow-y-auto mt-1 divide-y divide-outline-variant/40 overflow-hidden animate-in fade-in duration-100">
                          {searchResults.map((res) => (
                            <button
                              key={res}
                              onClick={() => addInterest(res)}
                              className="w-full p-3 px-5 text-left hover:bg-surface-container-low flex justify-between items-center group transition-colors"
                            >
                              <span className="font-semibold text-[13px] text-on-surface">{res}</span>
                              <span className="text-[11px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                                Ekle <Plus className="w-3.5 h-3.5" />
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Suggestions Section */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-accent" />
                        <Label className="text-[11px] font-extrabold uppercase tracking-wider text-community-orange-deep">
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
                              className="bg-surface-container-low hover:bg-primary-fixed hover:text-primary transition-all px-3.5 py-1.5 rounded-full border border-outline-variant/60 text-[12px] font-semibold text-on-surface-variant flex items-center gap-1 active:scale-95 disabled:opacity-50 disabled:hover:bg-surface-container-low disabled:hover:text-on-surface-variant"
                            >
                              <Plus className="w-3 h-3 text-primary/70" /> {sug}
                            </button>
                          ))
                        ) : (
                          <span className="text-[12px] text-on-surface-variant italic">Şu an yeni öneri bulunmuyor.</span>
                        )}
                      </div>
                    </div>

                  </CardContent>
                  <CardFooter className="justify-end bg-surface-container-low/50 border-t border-outline-variant/60 p-4 px-6">
                    <Button onClick={handleSaveInterests} disabled={isLoading} className="rounded-full text-[13px] font-bold px-8 shadow-sm">
                      {isLoading ? "Kaydediliyor..." : "İlgi Alanlarını Kaydet"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Tab 4: Güvenlik */}
              <TabsContent value="security" className="focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 duration-200">
                <Card className="border border-outline-variant shadow-ambient">
                  <CardHeader className="border-b border-outline-variant/50 pb-5">
                    <CardTitle className="font-heading text-xl font-black text-on-surface">Güvenlik Ayarları</CardTitle>
                    <CardDescription className="text-on-surface-variant text-[13px]">Şifrenizi periyodik olarak güncelleyerek hesabınızı koruyun.</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleUpdatePassword}>
                    <CardContent className="p-6 space-y-5">
                      
                      {/* Current password */}
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword" className="text-[13px] font-semibold text-on-surface">Mevcut Şifre</Label>
                        <div className="relative">
                          <Input 
                            id="currentPassword" 
                            name="currentPassword"
                            type={showCurrentPassword ? "text" : "password"} 
                            disabled={isPasswordLoading} 
                            className="h-11 rounded-xl border-outline-variant pr-10 text-[14px]" 
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                          >
                            {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* New password */}
                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-[13px] font-semibold text-on-surface">Yeni Şifre</Label>
                        <div className="relative">
                          <Input 
                            id="newPassword" 
                            name="newPassword"
                            type={showNewPassword ? "text" : "password"} 
                            disabled={isPasswordLoading} 
                            value={newPasswordValue}
                            onChange={(e) => setNewPasswordValue(e.target.value)}
                            className="h-11 rounded-xl border-outline-variant pr-10 text-[14px]" 
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        
                        {/* Password strength meter */}
                        {newPasswordValue && (
                          <div className="space-y-1.5 pt-1">
                            <div className="flex justify-between text-[11px] font-bold">
                              <span className="text-on-surface-variant">Şifre Gücü</span>
                              <span className="text-primary">{passwordStrength.text}</span>
                            </div>
                            <div className="h-1.5 w-full bg-outline/25 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-300 rounded-full ${passwordStrength.color}`} 
                                style={{ width: `${passwordStrength.score}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-on-surface-variant block leading-relaxed">
                              Güçlü bir şifre için en az 6 karakter kullanın, büyük/küçük harf, rakam ve özel karakterler ekleyin.
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Confirm new password */}
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-[13px] font-semibold text-on-surface">Yeni Şifre (Tekrar)</Label>
                        <div className="relative">
                          <Input 
                            id="confirmPassword" 
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"} 
                            disabled={isPasswordLoading} 
                            value={confirmPasswordValue}
                            onChange={(e) => setConfirmPasswordValue(e.target.value)}
                            className="h-11 rounded-xl border-outline-variant pr-10 text-[14px]" 
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {confirmPasswordValue && newPasswordValue !== confirmPasswordValue && (
                          <span className="text-[11px] text-red-500 font-semibold flex items-center gap-1.5 mt-1">
                            <Info className="w-4 h-4 shrink-0" /> Şifreler henüz eşleşmedi.
                          </span>
                        )}
                        {confirmPasswordValue && newPasswordValue === confirmPasswordValue && (
                          <span className="text-[11px] text-green-600 font-semibold flex items-center gap-1.5 mt-1 animate-pulse">
                            <Check className="w-4 h-4 shrink-0" /> Şifreler eşleşti!
                          </span>
                        )}
                      </div>

                    </CardContent>
                    <CardFooter className="justify-end bg-surface-container-low/50 border-t border-outline-variant/60 p-4 px-6">
                      <Button 
                        type="submit" 
                        disabled={isPasswordLoading || !newPasswordValue || newPasswordValue !== confirmPasswordValue || newPasswordValue.length < 6} 
                        className="rounded-full text-[13px] font-bold px-8 shadow-sm"
                      >
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

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-outline-variant px-margin-desktop py-8 shrink-0">
        <div className="max-w-[1140px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="font-heading font-extrabold text-[18px] text-primary">
            Uni<span className="text-accent">.</span>Block
          </div>
          <p className="text-[12px] text-on-surface-variant font-medium">© 2026 Kampüs Haber Ağı · Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}

