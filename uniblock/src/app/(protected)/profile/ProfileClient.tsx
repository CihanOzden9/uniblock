"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { updateProfile, updateInterests } from "../../actions/profile";
import { Search, Plus, X, Sparkles } from "lucide-react";

interface ProfileClientProps {
  user: any;
}

// Geniş ilgi alanı listesi
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

// Bölüme göre öneri haritası
const DEPARTMENT_SUGGESTIONS: Record<string, string[]> = {
  "Bilgisayar Mühendisliği": ["Yazılım Geliştirme", "Yapay Zeka", "Robotik", "Siber Güvenlik", "Blockchain", "Mobil Uygulama"],
  "Tıp": ["Tıp", "Biyoteknoloji", "Genetik", "Psikoloji", "Fitness", "Sürdürülebilirlik"],
  "İşletme": ["Girişimcilik", "Pazarlama", "Finans", "Yönetim", "Ekonomi", "Dijital Sanat"],
  "Mimarlık": ["Mimarlık", "İç Mimarlık", "Endüstriyel Tasarım", "Grafik Tasarım", "Sürdürülebilirlik", "Fotoğrafçılık"],
  "Psikoloji": ["Psikoloji", "Sosyoloji", "Felsefe", "Edebiyat", "Gönüllülük", "Yoga"]
};

const TAB_TRIGGER = "rounded-full text-[13px] font-medium px-4 py-2 data-active:bg-primary! data-active:text-primary-foreground! transition-colors text-on-surface-variant";

export default function ProfileClient({ user }: ProfileClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>(user.interests || []);

  // Önerileri hesapla
  const suggestions = useMemo(() => {
    const dept = user.department || "";
    const deptInterests = DEPARTMENT_SUGGESTIONS[dept] || DEPARTMENT_SUGGESTIONS["Bilgisayar Mühendisliği"];
    const unselectedDept = deptInterests.filter(i => !selectedInterests.includes(i));
    const others = ALL_INTERESTS.filter(i => !deptInterests.includes(i) && !selectedInterests.includes(i));
    const randomOthers = others.sort(() => 0.5 - Math.random()).slice(0, 3);
    return [...unselectedDept, ...randomOthers];
  }, [user.department, selectedInterests]);

  // Arama sonuçları
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return ALL_INTERESTS.filter(i =>
      i.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !selectedInterests.includes(i)
    ).slice(0, 5);
  }, [searchQuery, selectedInterests]);

  const addInterest = (interest: string) => {
    if (selectedInterests.length >= 5) {
      toast.error("En fazla 5 ilgi alanı seçebilirsiniz.");
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
    const res = await updateProfile(formData, user.id);
    if (res.success) toast.success("Profil güncellendi.");
    else toast.error(res.error);
    setIsLoading(false);
  }

  async function handleSaveInterests() {
    setIsLoading(true);
    const res = await updateInterests(selectedInterests, user.id);
    if (res.success) toast.success("İlgi alanları kaydedildi.");
    else toast.error(res.error);
    setIsLoading(false);
  }

  const [firstName, lastName] = user.name?.split(" ") || ["", ""];

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar user={user} />

      <main className="flex-1 pt-20">
        {/* Hero bandı */}
        <header className="w-full bg-surface-container-low py-12 px-margin-mobile md:px-margin-desktop border-b border-outline-variant">
          <div className="max-w-[1200px] mx-auto">
            <span className="text-[12px] font-semibold tracking-wide uppercase text-primary">Profil Yönetimi</span>
            <h1 className="font-heading text-[clamp(32px,4.5vw,48px)] font-bold tracking-tight leading-[1.1] mt-2 text-on-surface">
              Hesap Ayarları
            </h1>
            <p className="text-[16px] leading-[1.6] text-on-surface-variant max-w-[640px] mt-2">
              Profilini, akademik bilgilerini ve ilgi alanlarını buradan yönet.
            </p>
          </div>
        </header>

        <div className="max-w-[1200px] mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-lg flex flex-col lg:flex-row gap-gutter">
          {/* Sol: profil kartı */}
          <aside className="w-full lg:w-[320px] shrink-0">
            <Card className="overflow-hidden sticky top-24 p-0">
              <div className="aspect-square relative overflow-hidden bg-surface-container-high">
                <img
                  src={user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name || 'User'}`}
                  alt="Profil"
                  className="object-cover w-full h-full"
                />
              </div>
              <CardContent className="p-6 text-center">
                <h2 className="font-heading text-xl font-bold tracking-tight text-on-surface mb-1.5">{user.name}</h2>
                <span className="text-[11px] font-semibold text-primary bg-primary-fixed px-3 py-1 rounded-full">{user.role}</span>
                {user.department && (
                  <p className="text-[13px] text-on-surface-variant mt-3">{user.faculty} · {user.department}</p>
                )}
              </CardContent>
            </Card>
          </aside>

          {/* Sağ: sekmeler */}
          <div className="flex-1 w-full min-w-0">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="flex flex-wrap w-fit gap-1 rounded-full bg-surface-container-low p-1 mb-7 h-auto">
                <TabsTrigger value="general" className={TAB_TRIGGER}>Genel Bilgiler</TabsTrigger>
                <TabsTrigger value="academic" className={TAB_TRIGGER}>Akademik</TabsTrigger>
                <TabsTrigger value="interests" className={TAB_TRIGGER}>İlgi Alanları</TabsTrigger>
                <TabsTrigger value="security" className={TAB_TRIGGER}>Güvenlik</TabsTrigger>
              </TabsList>

              {/* Genel */}
              <TabsContent value="general" className="focus-visible:outline-none">
                <Card className="shadow-ambient">
                  <CardHeader>
                    <CardTitle className="font-heading text-xl font-bold tracking-tight">Genel Bilgiler</CardTitle>
                    <CardDescription className="text-on-surface-variant text-[13px]">Temel profil bilgileri</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleUpdateProfile}>
                    <CardContent className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-[13px] font-medium text-on-surface">Ad</Label>
                          <Input name="firstName" id="firstName" defaultValue={firstName} disabled={isLoading} className="h-11 rounded-lg" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-[13px] font-medium text-on-surface">Soyad</Label>
                          <Input name="lastName" id="lastName" defaultValue={lastName} disabled={isLoading} className="h-11 rounded-lg" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio" className="text-[13px] font-medium text-on-surface">Biyografi</Label>
                        <Input name="bio" id="bio" defaultValue={user.bio || ""} placeholder="Kendinizden kısaca bahsedin..." disabled={isLoading} className="h-11 rounded-lg" />
                      </div>
                    </CardContent>
                    <CardFooter className="justify-end">
                      <Button type="submit" disabled={isLoading} className="rounded-full text-[14px] font-semibold px-8">
                        Değişiklikleri Kaydet
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>

              {/* Akademik */}
              <TabsContent value="academic" className="focus-visible:outline-none">
                <Card className="shadow-ambient">
                  <CardHeader>
                    <CardTitle className="font-heading text-xl font-bold tracking-tight">Akademik Bilgiler</CardTitle>
                    <CardDescription className="text-on-surface-variant text-[13px]">Üniversite ve bölüm bilgileri</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleUpdateProfile}>
                    <CardContent className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="faculty" className="text-[13px] font-medium text-on-surface">Fakülte</Label>
                        <Input name="faculty" id="faculty" defaultValue={user.faculty || ""} disabled={isLoading} className="h-11 rounded-lg" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department" className="text-[13px] font-medium text-on-surface">Bölüm</Label>
                        <Input name="department" id="department" defaultValue={user.department || ""} disabled={isLoading} className="h-11 rounded-lg" />
                      </div>
                    </CardContent>
                    <CardFooter className="justify-end">
                      <Button type="submit" disabled={isLoading} className="rounded-full text-[14px] font-semibold px-8">
                        Değişiklikleri Kaydet
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>

              {/* İlgi Alanları */}
              <TabsContent value="interests" className="focus-visible:outline-none">
                <Card className="shadow-ambient">
                  <CardHeader>
                    <CardTitle className="font-heading text-xl font-bold tracking-tight">İlgi Alanları</CardTitle>
                    <CardDescription className="text-on-surface-variant text-[13px]">{selectedInterests.length}/5 ilgi alanı seçildi</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {/* Seçili */}
                    <div className="space-y-3">
                      <Label className="text-[12px] font-semibold uppercase tracking-wider text-on-surface-variant">Seçili Alanlar</Label>
                      <div className="flex flex-wrap gap-2.5">
                        {selectedInterests.length > 0 ? selectedInterests.map((interest) => (
                          <button
                            key={interest}
                            onClick={() => removeInterest(interest)}
                            className="rounded-full bg-primary text-white px-4 py-1.5 flex items-center gap-2 hover:bg-destructive transition-colors group"
                          >
                            <span className="text-[12px] font-semibold">{interest}</span>
                            <X className="w-3.5 h-3.5 group-hover:scale-125 transition-transform" />
                          </button>
                        )) : (
                          <div className="text-[14px] text-on-surface-variant italic">Henüz bir ilgi alanı seçmediniz.</div>
                        )}
                      </div>
                    </div>

                    {/* Ara ve Ekle */}
                    <div className="space-y-3 relative">
                      <Label className="text-[12px] font-semibold uppercase tracking-wider text-on-surface-variant">Alan Ara ve Ekle</Label>
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                        <Input
                          placeholder="İlgi alanı ara..."
                          className="pl-11 h-12 rounded-full"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      {searchResults.length > 0 && (
                        <div className="absolute top-full left-0 w-full bg-card border border-outline-variant rounded-xl z-50 shadow-ambient-lg max-h-[250px] overflow-y-auto mt-1 overflow-hidden">
                          {searchResults.map((res) => (
                            <button
                              key={res}
                              onClick={() => addInterest(res)}
                              className="w-full p-3 px-5 text-left hover:bg-surface-container-low flex justify-between items-center group transition-colors border-b border-outline-variant last:border-0"
                            >
                              <span className="font-medium text-[14px] text-on-surface">{res}</span>
                              <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Öneriler */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-accent" />
                        <Label className="text-[12px] font-semibold uppercase tracking-wider text-[color:var(--community-orange-deep)]">Senin İçin Önerilenler</Label>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {suggestions.map((sug) => (
                          <button
                            key={sug}
                            onClick={() => addInterest(sug)}
                            className="bg-surface-container-low hover:bg-primary hover:text-white transition-all px-4 py-1.5 rounded-full border border-outline-variant hover:border-primary text-[12px] font-medium text-on-surface"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-end">
                    <Button onClick={handleSaveInterests} disabled={isLoading} className="rounded-full text-[14px] font-semibold px-8">
                      {isLoading ? "Kaydediliyor..." : "İlgi Alanlarını Kaydet"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Güvenlik */}
              <TabsContent value="security" className="focus-visible:outline-none">
                <Card className="shadow-ambient">
                  <CardHeader>
                    <CardTitle className="font-heading text-xl font-bold tracking-tight">Güvenlik Ayarları</CardTitle>
                    <CardDescription className="text-on-surface-variant text-[13px]">Şifre ve 2FA yönetimi</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleUpdateProfile}>
                    <CardContent className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword" className="text-[13px] font-medium text-on-surface">Mevcut Şifre</Label>
                        <Input id="currentPassword" type="password" disabled={isLoading} className="h-11 rounded-lg" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-[13px] font-medium text-on-surface">Yeni Şifre</Label>
                        <Input id="newPassword" type="password" disabled={isLoading} className="h-11 rounded-lg" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-[13px] font-medium text-on-surface">Yeni Şifre (Tekrar)</Label>
                        <Input id="confirmPassword" type="password" disabled={isLoading} className="h-11 rounded-lg" />
                      </div>
                    </CardContent>
                    <CardFooter className="justify-end">
                      <Button type="submit" disabled={isLoading} className="rounded-full text-[14px] font-semibold px-8">
                        Şifreyi Güncelle
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <footer className="mt-auto bg-card border-t border-outline-variant px-margin-desktop py-stack-lg shrink-0">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="font-heading font-extrabold text-[20px] text-primary">
            Uni<span className="text-accent">.</span>Block
          </div>
          <p className="text-[13px] text-on-surface-variant">© 2026 Kampüs Haber Ağı</p>
        </div>
      </footer>
    </div>
  );
}
