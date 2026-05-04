"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface ProfileClientProps {
  user: any;
}

export default function ProfileClient({ user }: ProfileClientProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    // Real implementation would call a server action here
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Profil başarıyla güncellendi!");
    }, 1000);
  }

  const [firstName, lastName] = user.name?.split(" ") || ["", ""];

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Navbar />

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
                <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <Button variant="secondary" className="rounded-none uppercase tracking-widest text-[10px] font-bold">Fotoğrafı Değiştir</Button>
                </div>
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
                  <form onSubmit={onSubmit}>
                    <CardContent className="space-y-5 pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#525252]">Ad</Label>
                          <Input id="firstName" defaultValue={firstName} disabled={isLoading} className="h-11 px-4 rounded-none border-black focus-visible:ring-accent focus-visible:border-accent text-[14px]" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#525252]">Soyad</Label>
                          <Input id="lastName" defaultValue={lastName} disabled={isLoading} className="h-11 px-4 rounded-none border-black focus-visible:ring-accent focus-visible:border-accent text-[14px]" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#525252]">Biyografi</Label>
                        <Input id="bio" defaultValue={user.bio || ""} placeholder="Kendinizden kısaca bahsedin..." disabled={isLoading} className="h-11 px-4 rounded-none border-black focus-visible:ring-accent focus-visible:border-accent text-[14px]" />
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
                  <form onSubmit={onSubmit}>
                    <CardContent className="space-y-5 pt-6">
                      <div className="space-y-2">
                        <Label htmlFor="faculty" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#525252]">Fakülte</Label>
                        <Input id="faculty" defaultValue={user.faculty || ""} disabled={isLoading} className="h-11 px-4 rounded-none border-black focus-visible:ring-accent focus-visible:border-accent text-[14px]" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#525252]">Bölüm</Label>
                        <Input id="department" defaultValue={user.department || ""} disabled={isLoading} className="h-11 px-4 rounded-none border-black focus-visible:ring-accent focus-visible:border-accent text-[14px]" />
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

              {/* Interests and Security tabs remain similarly adapted */}
              <TabsContent value="interests" className="focus-visible:outline-none focus-visible:ring-0">
                <Card className="border-accent border-2 shadow-[8px_8px_0px_0px_rgba(5,150,105,0.1)] rounded-none bg-white overflow-hidden">
                  <CardHeader className="border-b-2 border-accent/10 pb-5 bg-[#fafafa]">
                    <CardTitle className="font-heading text-xl font-extrabold tracking-tight">İlgi Alanları</CardTitle>
                    <CardDescription className="text-xs uppercase tracking-widest text-accent font-medium mt-1">
                      Haber akışı kişiselleştirme etiketleri
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 pb-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {["Yazılım", "Yapay Zeka", "Girişimcilik", "Kariyer", "Sanat", "Spor", "Müzik", "Oyun"].map((interest) => (
                        <div key={interest} className="flex items-center space-x-3 group cursor-pointer">
                          <Checkbox id={`interest-${interest}`} className="rounded-none border-black data-[state=checked]:bg-accent data-[state=checked]:border-accent h-5 w-5" />
                          <label
                            htmlFor={`interest-${interest}`}
                            className="text-[14px] font-medium leading-none text-[#525252] group-hover:text-accent cursor-pointer transition-colors"
                          >
                            {interest}
                          </label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4 pb-5 border-t-2 border-accent/10 bg-[#fafafa] flex justify-end">
                    <Button disabled={isLoading} className="w-full md:w-auto rounded-none uppercase tracking-[0.15em] text-[12px] font-semibold py-[12px] px-[32px] h-auto transition-colors bg-accent text-white hover:bg-black border border-accent hover:border-black">
                      Tercihleri Kaydet
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
                  <form onSubmit={onSubmit}>
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
