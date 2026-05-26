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
      toast.success("Başvurunuz alındı! Yönetici onayından sonra giriş yapabileceksiniz.");
      router.push("/login");
    } else {
      toast.error(result.error);
      setIsLoading(false);
    }
  }

  return (
    <div className="container relative flex min-h-screen w-screen flex-col items-center justify-center bg-[#f5f5f5]">
      <div className="absolute top-8 left-8">
        <Link href="/" className="font-heading font-extrabold text-[18px] text-black hover:text-accent transition-colors">
          Uni<span className="text-accent">.</span>Block
        </Link>
      </div>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[500px]">
        <Card className="border-accent border-2 shadow-[8px_8px_0px_0px_rgba(5,150,105,0.2)] rounded-none bg-white">
          <CardHeader className="space-y-2 pb-8 border-b-2 border-accent/20">
            <CardTitle className="font-heading text-3xl font-extrabold tracking-tight">Kayıt Ol</CardTitle>
            <CardDescription className="text-accent font-semibold text-xs tracking-widest uppercase">
              01 — Hesap Oluştur
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <Tabs defaultValue="student" className="w-full">
              <TabsList className="grid w-full grid-cols-4 rounded-none bg-[#f5f5f5] p-1 border border-accent/30 mb-6">
                <TabsTrigger value="student" className="rounded-none text-xs uppercase tracking-wider data-[state=active]:bg-accent data-[state=active]:text-white hover:text-accent transition-colors">Öğrenci</TabsTrigger>
                <TabsTrigger value="club" className="rounded-none text-xs uppercase tracking-wider data-[state=active]:bg-accent data-[state=active]:text-white hover:text-accent transition-colors">Kulüp</TabsTrigger>
                <TabsTrigger value="team" className="rounded-none text-xs uppercase tracking-wider data-[state=active]:bg-accent data-[state=active]:text-white hover:text-accent transition-colors">Takım</TabsTrigger>
                <TabsTrigger value="business" className="rounded-none text-xs uppercase tracking-wider data-[state=active]:bg-accent data-[state=active]:text-white hover:text-accent transition-colors">İşletme</TabsTrigger>
              </TabsList>

              <TabsContent value="student" className="space-y-6">
                <form onSubmit={onSubmit} className="space-y-6">
                  <input type="hidden" name="role" value="STUDENT" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#525252]">Ad</Label>
                      <Input name="firstName" id="firstName" placeholder="Adınız" disabled={isLoading} className="rounded-none border-black focus-visible:ring-accent focus-visible:border-accent" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#525252]">Soyad</Label>
                      <Input name="lastName" id="lastName" placeholder="Soyadınız" disabled={isLoading} className="rounded-none border-black focus-visible:ring-accent focus-visible:border-accent" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#525252]">Üniversite E-posta (.edu.tr)</Label>
                    <Input
                      name="email"
                      id="email"
                      type="email"
                      placeholder="isim.soyisim@universite.edu.tr"
                      disabled={isLoading}
                      className="rounded-none border-black focus-visible:ring-accent focus-visible:border-accent"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="faculty" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#525252]">Fakülte</Label>
                      {useFreeText ? (
                        <Input name="faculty" id="faculty" placeholder="Mühendislik" disabled={isLoading} className="rounded-none border-black focus-visible:ring-accent focus-visible:border-accent" required />
                      ) : (
                        <select
                          name="faculty"
                          id="faculty"
                          required
                          disabled={isLoading}
                          value={selectedFaculty}
                          onChange={e => setSelectedFaculty(e.target.value)}
                          className="w-full h-10 px-3 border border-black rounded-none text-sm bg-white focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                        >
                          <option value="">Fakülte seçin</option>
                          {faculties.map(f => (
                            <option key={f.id} value={f.name}>{f.name}</option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#525252]">Bölüm</Label>
                      {useFreeText || availableDepts.length === 0 ? (
                        <Input name="department" id="department" placeholder="Bilgisayar Müh." disabled={isLoading || (!useFreeText && !selectedFaculty)} className="rounded-none border-black focus-visible:ring-accent focus-visible:border-accent" required />
                      ) : (
                        <select
                          name="department"
                          id="department"
                          required
                          disabled={isLoading || !selectedFaculty}
                          className="w-full h-10 px-3 border border-black rounded-none text-sm bg-white focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent disabled:opacity-50"
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
                    <Label htmlFor="password" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#525252]">Şifre</Label>
                    <Input name="password" id="password" type="password" disabled={isLoading} className="rounded-none border-black focus-visible:ring-accent focus-visible:border-accent" required />
                  </div>
                  <Button type="submit" className="w-full rounded-none uppercase tracking-[0.15em] text-[12px] font-semibold py-[14px] h-auto transition-colors bg-accent text-white hover:bg-black border border-accent hover:border-black" disabled={isLoading}>
                    {isLoading ? "İşleniyor..." : "Hesap Oluştur"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="club" className="space-y-6">
                <form onSubmit={onSubmit} className="space-y-6">
                  <input type="hidden" name="role" value="CLUB_ADMIN" />
                  <div className="space-y-2">
                    <Label htmlFor="clubName" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#525252]">Kulüp Adı</Label>
                    <Input name="clubName" id="clubName" placeholder="Örn: Yazılım ve Bilişim Kulübü" disabled={isLoading} className="rounded-none border-black focus-visible:ring-accent focus-visible:border-accent" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#525252]">Başkan Ad</Label>
                      <Input name="firstName" id="firstName" placeholder="Ad" disabled={isLoading} className="rounded-none border-black focus-visible:ring-accent focus-visible:border-accent" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#525252]">Başkan Soyad</Label>
                      <Input name="lastName" id="lastName" placeholder="Soyad" disabled={isLoading} className="rounded-none border-black focus-visible:ring-accent focus-visible:border-accent" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#525252]">Kulüp / Başkan E-posta</Label>
                    <Input name="email" id="email" type="email" placeholder="kulup@universite.edu.tr" disabled={isLoading} className="rounded-none border-black focus-visible:ring-accent focus-visible:border-accent" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#525252]">Şifre</Label>
                    <Input name="password" id="password" type="password" disabled={isLoading} className="rounded-none border-black focus-visible:ring-accent focus-visible:border-accent" required />
                  </div>
                  <Button type="submit" className="w-full rounded-none uppercase tracking-[0.15em] text-[12px] font-semibold py-[14px] h-auto transition-colors bg-accent text-white hover:bg-black border border-accent hover:border-black" disabled={isLoading}>
                    {isLoading ? "Başvuru Gönderiliyor..." : "Kulüp Başvurusu Yap"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="team" className="space-y-4 pt-4 text-center">
                <p className="text-sm text-gray-500 py-8">Takım kayıtları şu an kapalıdır.</p>
              </TabsContent>
              <TabsContent value="business" className="space-y-4 pt-4 text-center">
                <p className="text-sm text-gray-500 py-8">İşletme kayıtları şu an kapalıdır.</p>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-6 border-t-2 border-accent/20">
            <div className="text-xs text-center text-[#525252] uppercase tracking-wider">
              Zaten bir hesabınız var mı?{" "}
              <Link
                href="/login"
                className="font-bold underline underline-offset-4 text-accent hover:text-black transition-colors"
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
