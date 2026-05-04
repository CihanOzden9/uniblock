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
import { Badge } from "../../../components/ui/badge";

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

export default function ProfileClient({ user }: ProfileClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>(user.interests || []);

  // Önerileri hesapla
  const suggestions = useMemo(() => {
    const dept = user.department || "";
    const deptInterests = DEPARTMENT_SUGGESTIONS[dept] || DEPARTMENT_SUGGESTIONS["Bilgisayar Mühendisliği"];
    
    // Seçilmemiş olan önerileri filtrele
    const unselectedDept = deptInterests.filter(i => !selectedInterests.includes(i));
    
    // Rastgele 2-3 tane daha ekle
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
    if (res.success) {
      toast.success("Profil güncellendi.");
    } else {
      toast.error(res.error);
    }
    setIsLoading(false);
  }

  async function handleSaveInterests() {
    setIsLoading(true);
    const res = await updateInterests(selectedInterests, user.id);
    if (res.success) {
      toast.success("İlgi alanları kaydedildi.");
    } else {
      toast.error(res.error);
    }
    setIsLoading(false);
  }

  const [firstName, lastName] = user.name?.split(" ") || ["", ""];

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Navbar user={user} />

      <main className="pt-32 pb-20 px-4 md:px-8 max-w-[1200px] mx-auto">
        <div className="mb-12">
          <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-accent mb-4 inline-block bg-accent/10 px-4 py-1 border border-accent/20">
            01 — PROFİL YÖNETİMİ
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tighter leading-none mb-4">
            Hesap Ayarları
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          <aside className="w-full lg:w-[320px] shrink-0">
            <Card className="border-accent border-2 shadow-[12px_12px_0px_0px_rgba(5,150,105,0.1)] rounded-none bg-white overflow-hidden sticky top-32">
              <div className="aspect-square relative overflow-hidden group">
                <img 
                  src={user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name || 'User'}`}
                  alt="Profile" 
                  className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-110"
                />
              </div>
              <CardContent className="p-7 text-center border-t-2 border-accent">
                <h2 className="font-heading text-2xl font-extrabold tracking-tight mb-1">{user.name}</h2>
                <p className="text-xs uppercase tracking-[0.2em] font-semibold text-accent">{user.role}</p>
              </CardContent>
            </Card>
          </aside>

          <main className="flex-1 w-full overflow-hidden">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="flex flex-wrap w-full justify-start rounded-none bg-transparent p-0 border-b-2 border-accent/20 mb-8 h-auto gap-6 md:gap-10">
                <TabsTrigger value="general" className="rounded-none px-0 pb-4 pt-2 text-[11px] md:text-[13px] uppercase tracking-wider font-semibold text-[#a3a3a3] hover:text-accent transition-colors border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:text-accent !bg-transparent !shadow-none outline-none ring-0">
                  Genel Bilgiler
                </TabsTrigger>
                <TabsTrigger value="academic" className="rounded-none px-0 pb-4 pt-2 text-[11px] md:text-[13px] uppercase tracking-wider font-semibold text-[#a3a3a3] hover:text-accent transition-colors border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:text-accent !bg-transparent !shadow-none outline-none ring-0">
                  Akademik
                </TabsTrigger>
                <TabsTrigger value="interests" className="rounded-none px-0 pb-4 pt-2 text-[11px] md:text-[13px] uppercase tracking-wider font-semibold text-[#a3a3a3] hover:text-accent transition-colors border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:text-accent !bg-transparent !shadow-none outline-none ring-0">
                  İlgi Alanları
                </TabsTrigger>
                <TabsTrigger value="security" className="rounded-none px-0 pb-4 pt-2 text-[11px] md:text-[13px] uppercase tracking-wider font-semibold text-[#a3a3a3] hover:text-accent transition-colors border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:text-accent !bg-transparent !shadow-none outline-none ring-0">
                  Güvenlik
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="focus-visible:outline-none focus-visible:ring-0">
                <Card className="border-accent border-2 shadow-[8px_8px_0px_0px_rgba(5,150,105,0.1)] rounded-none bg-white overflow-hidden">
                  <CardHeader className="border-b-2 border-accent/10 pb-5 bg-[#fafafa]">
                    <CardTitle className="font-heading text-xl font-extrabold tracking-tight">Genel Bilgiler</CardTitle>
                    <CardDescription className="text-xs uppercase tracking-widest text-accent font-medium mt-1">
                      Temel profil bilgileri
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleUpdateProfile}>
                    <CardContent className="space-y-5 pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#525252]">Ad</Label>
                          <Input name="firstName" id="firstName" defaultValue={firstName} disabled={isLoading} className="h-11 px-4 rounded-none border-black focus-visible:ring-accent focus-visible:border-accent text-[14px]" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#525252]">Soyad</Label>
                          <Input name="lastName" id="lastName" defaultValue={lastName} disabled={isLoading} className="h-11 px-4 rounded-none border-black focus-visible:ring-accent focus-visible:border-accent text-[14px]" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#525252]">Biyografi</Label>
                        <Input name="bio" id="bio" defaultValue={user.bio || ""} placeholder="Kendinizden kısaca bahsedin..." disabled={isLoading} className="h-11 px-4 rounded-none border-black focus-visible:ring-accent focus-visible:border-accent text-[14px]" />
                      </div>
                    </CardContent>
                    <CardFooter className="pt-4 pb-5 border-t-2 border-accent/10 bg-[#fafafa] flex justify-end">
                      <Button type="submit" disabled={isLoading} className="w-full md:w-auto rounded-none uppercase tracking-[0.15em] text-[12px] font-semibold py-[12px] px-[32px] h-auto transition-colors bg-accent text-white hover:bg-black border border-accent hover:border-black">
                        Değişiklikleri Kaydet
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>

              <TabsContent value="academic" className="focus-visible:outline-none focus-visible:ring-0">
                <Card className="border-accent border-2 shadow-[8px_8px_0px_0px_rgba(5,150,105,0.1)] rounded-none bg-white overflow-hidden">
                  <CardHeader className="border-b-2 border-accent/10 pb-5 bg-[#fafafa]">
                    <CardTitle className="font-heading text-xl font-extrabold tracking-tight">Akademik Bilgiler</CardTitle>
                    <CardDescription className="text-xs uppercase tracking-widest text-accent font-medium mt-1">
                      Üniversite ve bölüm bilgileri
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleUpdateProfile}>
                    <CardContent className="space-y-5 pt-6">
                      <div className="space-y-2">
                        <Label htmlFor="faculty" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#525252]">Fakülte</Label>
                        <Input name="faculty" id="faculty" defaultValue={user.faculty || ""} disabled={isLoading} className="h-11 px-4 rounded-none border-black focus-visible:ring-accent focus-visible:border-accent text-[14px]" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#525252]">Bölüm</Label>
                        <Input name="department" id="department" defaultValue={user.department || ""} disabled={isLoading} className="h-11 px-4 rounded-none border-black focus-visible:ring-accent focus-visible:border-accent text-[14px]" />
                      </div>
                    </CardContent>
                    <CardFooter className="pt-4 pb-5 border-t-2 border-accent/10 bg-[#fafafa] flex justify-end">
                      <Button type="submit" disabled={isLoading} className="w-full md:w-auto rounded-none uppercase tracking-[0.15em] text-[12px] font-semibold py-[12px] px-[32px] h-auto transition-colors bg-accent text-white hover:bg-black border border-accent hover:border-black">
                        Değişiklikleri Kaydet
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>

              <TabsContent value="interests" className="focus-visible:outline-none focus-visible:ring-0">
                <Card className="border-accent border-2 shadow-[8px_8px_0px_0px_rgba(5,150,105,0.1)] rounded-none bg-white overflow-hidden">
                  <CardHeader className="border-b-2 border-accent/10 pb-5 bg-[#fafafa]">
                    <CardTitle className="font-heading text-xl font-extrabold tracking-tight">İlgi Alanları</CardTitle>
                    <CardDescription className="text-xs uppercase tracking-widest text-accent font-medium mt-1">
                      {selectedInterests.length}/5 İlgi alanı seçildi
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-8 space-y-10">
                    
                    {/* Mevcut İlgi Alanları */}
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Seçili Alanlar</Label>
                      <div className="flex flex-wrap gap-3">
                        {selectedInterests.length > 0 ? selectedInterests.map((interest) => (
                          <Badge key={interest} className="rounded-none bg-black text-white px-4 py-2 flex items-center gap-2 hover:bg-red-500 transition-colors group cursor-pointer" onClick={() => removeInterest(interest)}>
                            <span className="text-[11px] font-bold uppercase tracking-widest">{interest}</span>
                            <X className="w-3 h-3 group-hover:scale-125 transition-transform" />
                          </Badge>
                        )) : (
                          <div className="text-sm text-gray-400 italic">Henüz bir ilgi alanı seçmediniz.</div>
                        )}
                      </div>
                    </div>

                    {/* Arama ve Ekleme */}
                    <div className="space-y-4 relative">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Alan Ara ve Ekle</Label>
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input 
                          placeholder="İlgi alanı ara..." 
                          className="pl-12 h-14 rounded-none border-2 border-black focus-visible:ring-accent text-[15px]" 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      
                        {/* Arama Sonuçları Dropdown */}
                      {searchResults.length > 0 && (
                        <div className="absolute top-full left-0 w-full bg-white border-2 border-black z-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-h-[250px] overflow-y-auto">
                          {searchResults.map((res) => (
                            <button 
                              key={res} 
                              onClick={() => addInterest(res)}
                              className="w-full p-3 px-5 text-left hover:bg-gray-50 flex justify-between items-center group transition-colors border-b border-gray-100 last:border-0"
                            >
                              <span className="font-bold text-[13px] uppercase tracking-wider">{res}</span>
                              <Plus className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-accent" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Öneriler */}
                    <div className="space-y-4 pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-accent" />
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Senin İçin Önerilenler</Label>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {suggestions.map((sug) => (
                          <button 
                            key={sug} 
                            onClick={() => addInterest(sug)}
                            className="bg-gray-100 hover:bg-accent hover:text-white transition-all px-4 py-2 border border-gray-200 hover:border-accent text-[11px] font-bold uppercase tracking-widest"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    </div>

                  </CardContent>
                  <CardFooter className="pt-4 pb-5 border-t-2 border-accent/10 bg-[#fafafa] flex justify-end">
                    <Button 
                      onClick={handleSaveInterests}
                      disabled={isLoading} 
                      className="w-full md:w-auto rounded-none uppercase tracking-[0.15em] text-[12px] font-semibold py-[12px] px-[32px] h-auto transition-colors bg-accent text-white hover:bg-black border border-accent hover:border-black"
                    >
                      {isLoading ? "Kaydediliyor..." : "İlgi Alanlarını Kaydet"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="focus-visible:outline-none focus-visible:ring-0">
                <Card className="border-accent border-2 shadow-[8px_8px_0px_0px_rgba(5,150,105,0.1)] rounded-none bg-white overflow-hidden">
                  <CardHeader className="border-b-2 border-accent/10 pb-5 bg-[#fafafa]">
                    <CardTitle className="font-heading text-xl font-extrabold tracking-tight">Güvenlik Ayarları</CardTitle>
                    <CardDescription className="text-xs uppercase tracking-widest text-accent font-medium mt-1">
                      Şifre ve 2FA yönetimi
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleUpdateProfile}>
                    <CardContent className="space-y-5 pt-6">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#525252]">Mevcut Şifre</Label>
                        <Input id="currentPassword" type="password" disabled={isLoading} className="h-11 px-4 rounded-none border-black focus-visible:ring-accent focus-visible:border-accent text-[14px]" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#525252]">Yeni Şifre</Label>
                        <Input id="newPassword" type="password" disabled={isLoading} className="h-11 px-4 rounded-none border-black focus-visible:ring-accent focus-visible:border-accent text-[14px]" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#525252]">Yeni Şifre (Tekrar)</Label>
                        <Input id="confirmPassword" type="password" disabled={isLoading} className="h-11 px-4 rounded-none border-black focus-visible:ring-accent focus-visible:border-accent text-[14px]" />
                      </div>
                    </CardContent>
                    <CardFooter className="pt-4 pb-5 border-t-2 border-accent/10 bg-[#fafafa] flex justify-end">
                      <Button type="submit" disabled={isLoading} className="w-full md:w-auto rounded-none uppercase tracking-[0.15em] text-[12px] font-semibold py-[12px] px-[32px] h-auto transition-colors bg-accent text-white hover:bg-black border border-accent hover:border-black">
                        Şifreyi Güncelle
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </main>
    </div>
  );
}
