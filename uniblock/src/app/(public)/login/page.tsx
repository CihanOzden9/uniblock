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
    <div className="container relative flex min-h-screen w-screen flex-col items-center justify-center bg-surface-container-low">
      {/* Back to Home Navbar */}
      <div className="absolute top-8 left-8">
        <Link href="/" className="font-heading font-extrabold text-[20px] text-primary hover:opacity-80 transition-opacity">
          Uni<span className="text-accent">.</span>Block
        </Link>
      </div>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[440px]">
        <Card className="shadow-ambient-lg">
          <CardHeader className="space-y-1.5 pb-6 text-center">
            <CardTitle className="font-heading text-3xl font-bold tracking-tight">Giriş Yap</CardTitle>
            <CardDescription className="text-on-surface-variant text-[15px]">
              {show2FA ? "Hesabını doğrula" : "UniBlock'a hoş geldin, lütfen hesabına giriş yap."}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            {!show2FA ? (
              <form onSubmit={onSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[13px] font-medium text-on-surface">E-posta Adresi</Label>
                  <Input
                    name="email"
                    id="email"
                    type="email"
                    placeholder="isim@ornek.com"
                    disabled={isLoading}
                    className="h-11 rounded-lg"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-[13px] font-medium text-on-surface">Şifre</Label>
                    <Link
                      href="/forgot-password"
                      className="text-[13px] font-medium text-primary hover:underline transition-colors"
                    >
                      Şifremi Unuttum
                    </Link>
                  </div>
                  <Input name="password" id="password" type="password" disabled={isLoading} className="h-11 rounded-lg" required />
                </div>
                <div className="flex items-center space-x-2 pt-1">
                  <Checkbox id="remember" disabled={isLoading} />
                  <label
                    htmlFor="remember"
                    className="text-[13px] font-medium leading-none text-on-surface-variant peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Beni Hatırla
                  </label>
                </div>
                <Button className="w-full h-11 rounded-full text-[15px] font-semibold" type="submit" disabled={isLoading}>
                  {isLoading ? "İşleniyor..." : "Giriş Yap"}
                </Button>
              </form>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-[13px] font-medium text-on-surface">Doğrulama Kodu (OTP)</Label>
                  <Input
                    name="otp"
                    id="otp"
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    disabled={isLoading}
                    className="h-12 rounded-lg text-center tracking-[0.5em] font-heading text-lg"
                    required
                  />
                </div>
                <Button className="w-full h-11 rounded-full text-[15px] font-semibold" type="submit" disabled={isLoading}>
                  {isLoading ? "İşleniyor..." : "Doğrula ve Giriş Yap"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-11 rounded-full text-[15px] font-medium border-outline-variant"
                  type="button"
                  onClick={() => setShow2FA(false)}
                  disabled={isLoading}
                >
                  Geri Dön
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-2">
            <div className="text-[14px] text-center text-on-surface-variant">
              Hesabınız yok mu?{" "}
              <Link
                href="/register"
                className="font-semibold text-primary hover:underline transition-colors"
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
