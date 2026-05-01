"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-24">
      {/* Navbar - Fixed & Minimal */}
      <header className="w-full h-16 bg-white z-50 flex items-center justify-between px-8 border-b-2 border-accent">
        <div className="font-heading font-extrabold text-[18px] tracking-tight">
          Uni<span className="text-accent">.</span>Block
        </div>
        <nav className="flex items-center gap-6">
          <Link href="/feed" className="text-[13px] font-medium tracking-[0.05em] uppercase hover:text-accent transition-colors">
            Akış
          </Link>
          <Link href="/profile" className="text-[13px] font-medium tracking-[0.05em] uppercase text-accent transition-colors">
            Profil
          </Link>
          <Button variant="outline" className="px-[20px] py-[10px] text-[12px] font-semibold tracking-[0.15em] uppercase border-accent text-accent hover:bg-accent hover:text-white transition-colors rounded-none bg-transparent">
            Çıkış Yap
          </Button>
        </nav>
      </header>

      <div className="container mx-auto pt-16 px-4 md:px-8 max-w-[1100px]">
        <div className="mb-12">
          <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-accent mb-4 inline-block bg-accent/10 px-4 py-1 border border-accent/20">
            01 — PROFİL YÖNETİMİ
          </span>
          <h1 className="font-heading text-4xl font-extrabold tracking-tight">Hesap Ayarları</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Sidebar */}
          <aside className="w-full md:w-[320px]">
            <Card className="border-accent border-2 shadow-[4px_4px_0px_0px_rgba(5,150,105,0.2)] rounded-none bg-white">
              <CardContent className="pt-8 flex flex-col items-center">
                <div className="relative group cursor-pointer mb-6 border-2 border-accent overflow-hidden" style={{ width: "140px", height: "180px" }}>
                  <img src="https://github.com/shadcn.png" alt="@shadcn" className="w-full h-full object-cover transition-all duration-500 grayscale group-hover:grayscale-0" />
                  <div className="absolute bottom-0 left-0 w-full bg-accent text-white text-[10px] uppercase tracking-widest text-center py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 font-semibold">
                    Değiştir
                  </div>
                </div>
                <h2 className="font-heading text-2xl font-extrabold tracking-tight">Ahmet Yılmaz</h2>
                <p className="text-xs uppercase tracking-widest text-accent font-semibold mt-2">Öğrenci</p>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
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
                          <Input id="firstName" defaultValue="Ahmet" disabled={isLoading} className="h-11 px-4 rounded-none border-black focus-visible:ring-accent focus-visible:border-accent text-[14px]" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#525252]">Soyad</Label>
                          <Input id="lastName" defaultValue="Yılmaz" disabled={isLoading} className="h-11 px-4 rounded-none border-black focus-visible:ring-accent focus-visible:border-accent text-[14px]" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#525252]">Biyografi</Label>
                        <Input id="bio" placeholder="Kendinizden kısaca bahsedin..." disabled={isLoading} className="h-11 px-4 rounded-none border-black focus-visible:ring-accent focus-visible:border-accent text-[14px]" />
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
                        <Select defaultValue="engineering">
                          <SelectTrigger className="h-11 px-4 rounded-none border-black focus:ring-accent focus:border-accent text-[14px]">
                            <SelectValue placeholder="Fakülte Seçin" />
                          </SelectTrigger>
                          <SelectContent className="rounded-none border-black">
                            <SelectItem value="engineering">Mühendislik Fakültesi</SelectItem>
                            <SelectItem value="arts">Fen Edebiyat Fakültesi</SelectItem>
                            <SelectItem value="economics">İktisadi ve İdari Bilimler Fakültesi</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#525252]">Bölüm</Label>
                        <Select defaultValue="computer">
                          <SelectTrigger className="h-11 px-4 rounded-none border-black focus:ring-accent focus:border-accent text-[14px]">
                            <SelectValue placeholder="Bölüm Seçin" />
                          </SelectTrigger>
                          <SelectContent className="rounded-none border-black">
                            <SelectItem value="computer">Bilgisayar Mühendisliği</SelectItem>
                            <SelectItem value="software">Yazılım Mühendisliği</SelectItem>
                            <SelectItem value="industrial">Endüstri Mühendisliği</SelectItem>
                          </SelectContent>
                        </Select>
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
                      <div className="pt-6 border-t-2 border-accent/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                        <div>
                          <p className="font-heading font-extrabold tracking-tight text-lg text-accent">İki Faktörlü Doğrulama (2FA)</p>
                          <p className="text-sm text-[#525252] mt-1">Hesabınızı ekstra güvenli hale getirin.</p>
                        </div>
                        <Button variant="outline" type="button" className="w-full md:w-auto rounded-none uppercase tracking-[0.15em] text-[12px] font-semibold py-[10px] px-[24px] h-auto transition-colors border-accent text-accent hover:bg-accent hover:text-white">
                          Aktifleştir
                        </Button>
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
      </div>
    </div>
  );
}
