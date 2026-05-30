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
import { Checkbox } from "@/components/ui/checkbox";

import { login } from "@/app/actions/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const router = useRouter();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await login(formData);

    if (result.success) {
      toast.success("Giriş başarılı!");
      // window.location.href helps with middleware refresh better than router.push in some cases
      if (result.role === "SUPER_ADMIN" || result.role === "PROJECT_ADMIN" || result.role === "ADMIN") {
        window.location.href = "/admin";
      } else if (result.role === "CLUB_ADMIN") {
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
    <div className="container relative flex min-h-screen w-screen flex-col items-center justify-center bg-[#f5f5f5]">
      {/* Back to Home Navbar */}
      <div className="absolute top-8 left-8">
        <Link href="/" className="font-heading font-extrabold text-[18px] text-black hover:text-accent transition-colors">
          Uni<span className="text-accent">.</span>Block
        </Link>
      </div>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
        <Card className="border-accent border-2 shadow-[8px_8px_0px_0px_rgba(5,150,105,0.2)] rounded-none bg-white">
          <CardHeader className="space-y-2 pb-8 border-b-2 border-accent/20">
            <CardTitle className="font-heading text-3xl font-extrabold tracking-tight">Giriş Yap</CardTitle>
            <CardDescription className="text-accent font-semibold text-xs tracking-widest uppercase">
              {show2FA ? "02 — Doğrulama Adımı" : "01 — Kimlik Doğrulama"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            {!show2FA ? (
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#525252]">E-posta</Label>
                  <Input
                    name="email"
                    id="email"
                    type="email"
                    placeholder="isim@ornek.com"
                    disabled={isLoading}
                    className="rounded-none border-black focus-visible:ring-accent focus-visible:border-accent"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#525252]">Şifre</Label>
                    <Link
                      href="/forgot-password"
                      className="text-[10px] font-semibold uppercase tracking-[0.1em] text-accent hover:text-black transition-colors"
                    >
                      Şifremi Unuttum
                    </Link>
                  </div>
                  <Input name="password" id="password" type="password" disabled={isLoading} className="rounded-none border-black focus-visible:ring-accent focus-visible:border-accent" required />
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox id="remember" disabled={isLoading} className="rounded-none border-black data-[state=checked]:bg-accent data-[state=checked]:border-accent" />
                  <label
                    htmlFor="remember"
                    className="text-xs font-medium leading-none text-[#525252] peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Beni Hatırla
                  </label>
                </div>
                <Button className="w-full rounded-none uppercase tracking-[0.15em] text-[12px] font-semibold py-[14px] h-auto transition-colors bg-accent text-white hover:bg-black border border-accent hover:border-black" type="submit" disabled={isLoading}>
                  {isLoading ? "İşleniyor..." : "Giriş Yap"}
                </Button>
              </form>
            ) : (
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#525252]">Doğrulama Kodu (OTP)</Label>
                  <Input
                    name="otp"
                    id="otp"
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    disabled={isLoading}
                    className="rounded-none border-black focus-visible:ring-accent focus-visible:border-accent text-center tracking-widest font-heading text-lg"
                    required
                  />
                </div>
                <Button className="w-full rounded-none uppercase tracking-[0.15em] text-[12px] font-semibold py-[14px] h-auto transition-colors bg-accent text-white hover:bg-black border border-accent hover:border-black" type="submit" disabled={isLoading}>
                  {isLoading ? "İşleniyor..." : "Doğrula ve Giriş Yap"}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full rounded-none uppercase tracking-[0.15em] text-[12px] font-semibold py-[14px] h-auto transition-colors border-accent text-accent hover:bg-accent hover:text-white" 
                  type="button" 
                  onClick={() => setShow2FA(false)}
                  disabled={isLoading}
                >
                  Geri Dön
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-6 border-t-2 border-accent/20">
            <div className="text-xs text-center text-[#525252] uppercase tracking-wider">
              Hesabınız yok mu?{" "}
              <Link
                href="/register"
                className="font-bold underline underline-offset-4 text-accent hover:text-black transition-colors"
              >
                Kayıt Ol
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
