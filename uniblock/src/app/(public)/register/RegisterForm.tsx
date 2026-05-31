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

import { register } from "@/app/actions/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Department {
  id: string;
  name: string;
}

interface Faculty {
  id: string;
  name: string;
  departments: Department[];
}

export default function RegisterForm({ faculties }: { faculties: Faculty[] }) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const router = useRouter();

  const availableDepts = faculties.find(f => f.name === selectedFaculty)?.departments ?? [];
  const useFreeText = faculties.length === 0;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await register(formData);

    if (result.success) {
      toast.success("Kayıt başarılı! Giriş yapıldı.");
      if (result.role === "CLUB_ADMIN") {
        window.location.href = "/clubs/manage";
      } else if (result.role === "TEAM_ADMIN") {
        window.location.href = "/teams/manage";
      } else {
        window.location.href = "/feed";
      }
    } else {
      toast.error(result.error);
      setIsLoading(false);
    }
  }

  return (
    <div className="container relative flex min-h-screen w-screen flex-col items-center justify-center bg-surface-container-low py-12">
      <div className="absolute top-8 left-8">
        <Link href="/" className="font-heading font-extrabold text-[20px] text-primary hover:opacity-80 transition-opacity">
          Uni<span className="text-accent">.</span>Block
        </Link>
      </div>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[500px]">
        <Card className="shadow-ambient-lg">
          <CardHeader className="space-y-1.5 pb-6 text-center">
            <CardTitle className="font-heading text-3xl font-bold tracking-tight">Kayıt Ol</CardTitle>
            <CardDescription className="text-on-surface-variant text-[15px]">
              Kampüs ağına katılmak için hesap oluştur.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <Tabs defaultValue="student" className="w-full">
              <TabsList className="grid w-full grid-cols-4 rounded-full bg-surface-container-low p-1 mb-6">
                <TabsTrigger value="student" className="rounded-full text-[13px] font-medium data-active:bg-primary! data-active:text-primary-foreground! transition-colors">Öğrenci</TabsTrigger>
                <TabsTrigger value="club" className="rounded-full text-[13px] font-medium data-active:bg-primary! data-active:text-primary-foreground! transition-colors">Kulüp</TabsTrigger>
                <TabsTrigger value="team" className="rounded-full text-[13px] font-medium data-active:bg-primary! data-active:text-primary-foreground! transition-colors">Takım</TabsTrigger>
                <TabsTrigger value="business" className="rounded-full text-[13px] font-medium data-active:bg-primary! data-active:text-primary-foreground! transition-colors">İşletme</TabsTrigger>
              </TabsList>

              <TabsContent value="student" className="space-y-6">
                <form onSubmit={onSubmit} className="space-y-6">
                  <input type="hidden" name="role" value="STUDENT" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-[13px] font-medium text-on-surface">Ad</Label>
                      <Input name="firstName" id="firstName" placeholder="Adınız" disabled={isLoading} className="h-11 rounded-lg" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-[13px] font-medium text-on-surface">Soyad</Label>
                      <Input name="lastName" id="lastName" placeholder="Soyadınız" disabled={isLoading} className="h-11 rounded-lg" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[13px] font-medium text-on-surface">Üniversite E-posta (.edu.tr)</Label>
                    <Input
                      name="email"
                      id="email"
                      type="email"
                      placeholder="isim.soyisim@universite.edu.tr"
                      disabled={isLoading}
                      className="h-11 rounded-lg"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="faculty" className="text-[13px] font-medium text-on-surface">Fakülte</Label>
                      {useFreeText ? (
                        <Input name="faculty" id="faculty" placeholder="Mühendislik" disabled={isLoading} className="h-11 rounded-lg" required />
                      ) : (
                        <select
                          name="faculty"
                          id="faculty"
                          required
                          disabled={isLoading}
                          value={selectedFaculty}
                          onChange={e => setSelectedFaculty(e.target.value)}
                          className="w-full h-11 px-3 border border-input rounded-lg text-sm bg-card text-on-surface focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring"
                        >
                          <option value="">Fakülte seçin</option>
                          {faculties.map(f => (
                            <option key={f.id} value={f.name}>{f.name}</option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-[13px] font-medium text-on-surface">Bölüm</Label>
                      {useFreeText || availableDepts.length === 0 ? (
                        <Input name="department" id="department" placeholder="Bilgisayar Müh." disabled={isLoading || (!useFreeText && !selectedFaculty)} className="h-11 rounded-lg" required />
                      ) : (
                        <select
                          name="department"
                          id="department"
                          required
                          disabled={isLoading || !selectedFaculty}
                          className="w-full h-11 px-3 border border-input rounded-lg text-sm bg-card text-on-surface focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring disabled:opacity-50"
                        >
                          <option value="">Bölüm seçin</option>
                          {availableDepts.map(d => (
                            <option key={d.id} value={d.name}>{d.name}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-[13px] font-medium text-on-surface">Şifre</Label>
                    <Input name="password" id="password" type="password" disabled={isLoading} className="h-11 rounded-lg" required />
                  </div>
                  <Button type="submit" className="w-full rounded-full text-[15px] font-semibold py-3 h-auto" disabled={isLoading}>
                    {isLoading ? "İşleniyor..." : "Hesap Oluştur"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="club" className="space-y-6">
                <form onSubmit={onSubmit} className="space-y-6">
                  <input type="hidden" name="role" value="CLUB_ADMIN" />
                  <div className="space-y-2">
                    <Label htmlFor="clubName" className="text-[13px] font-medium text-on-surface">Kulüp Adı</Label>
                    <Input name="clubName" id="clubName" placeholder="Örn: Yazılım ve Bilişim Kulübü" disabled={isLoading} className="h-11 rounded-lg" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-[13px] font-medium text-on-surface">Başkan Ad</Label>
                      <Input name="firstName" id="firstName" placeholder="Ad" disabled={isLoading} className="h-11 rounded-lg" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-[13px] font-medium text-on-surface">Başkan Soyad</Label>
                      <Input name="lastName" id="lastName" placeholder="Soyad" disabled={isLoading} className="h-11 rounded-lg" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[13px] font-medium text-on-surface">
                      Kulüp Resmi E-posta Adresi
                    </Label>
                    <Input name="email" id="email" type="email" placeholder="kulup@universite.edu.tr" disabled={isLoading} className="h-11 rounded-lg" required />
                    <p className="text-[12px] text-on-surface-variant mt-1">Başkanın kişisel e-postası onay sonrası ayarlardan eklenebilir.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-[13px] font-medium text-on-surface">Şifre</Label>
                    <Input name="password" id="password" type="password" disabled={isLoading} className="h-11 rounded-lg" required />
                  </div>
                  <Button type="submit" className="w-full rounded-full text-[15px] font-semibold py-3 h-auto" disabled={isLoading}>
                    {isLoading ? "Başvuru Gönderiliyor..." : "Kulüp Başvurusu Yap"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="team" className="space-y-6">
                <form onSubmit={onSubmit} className="space-y-6">
                  <input type="hidden" name="role" value="TEAM_ADMIN" />
                  <div className="space-y-2">
                    <Label htmlFor="teamName" className="text-[13px] font-medium text-on-surface">Takım Adı</Label>
                    <Input name="teamName" id="teamName" placeholder="Örn: Robotik Yarışma Takımı" disabled={isLoading} className="h-11 rounded-lg" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-[13px] font-medium text-on-surface">Kaptan Ad</Label>
                      <Input name="firstName" id="firstName" placeholder="Ad" disabled={isLoading} className="h-11 rounded-lg" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-[13px] font-medium text-on-surface">Kaptan Soyad</Label>
                      <Input name="lastName" id="lastName" placeholder="Soyad" disabled={isLoading} className="h-11 rounded-lg" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[13px] font-medium text-on-surface">
                      Takım Resmi E-posta Adresi
                    </Label>
                    <Input name="email" id="email" type="email" placeholder="takim@universite.edu.tr" disabled={isLoading} className="h-11 rounded-lg" required />
                    <p className="text-[12px] text-on-surface-variant mt-1">Kaptanın kişisel e-postası onay sonrası ayarlardan eklenebilir.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-[13px] font-medium text-on-surface">Şifre</Label>
                    <Input name="password" id="password" type="password" disabled={isLoading} className="h-11 rounded-lg" required />
                  </div>
                  <Button type="submit" className="w-full rounded-full text-[15px] font-semibold py-3 h-auto" disabled={isLoading}>
                    {isLoading ? "Başvuru Gönderiliyor..." : "Takım Başvurusu Yap"}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="business" className="space-y-4 pt-4 text-center">
                <p className="text-sm text-gray-500 py-8">İşletme kayıtları şu an kapalıdır.</p>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-2">
            <div className="text-[14px] text-center text-on-surface-variant">
              Zaten bir hesabınız var mı?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary hover:underline transition-colors"
              >
                Giriş Yap
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
