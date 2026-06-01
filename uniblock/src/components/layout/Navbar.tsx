"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Bell, LogOut, User as UserIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { logout } from "@/app/actions/auth";

interface NavbarProps {
  user?: {
    name: string;
    email: string;
    department?: string;
    image?: string;
    role?: string;
  } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "??";

  const navLink = (active: boolean) =>
    `text-[15px] font-medium py-1.5 px-3 rounded-lg border-b-2 transition-colors ${
      active
        ? "text-primary border-primary font-semibold"
        : "text-on-surface-variant border-transparent hover:bg-surface-container-high hover:text-on-surface"
    }`;

  return (
    <header className="fixed top-0 w-full h-20 bg-surface z-50 flex items-center justify-between px-margin-desktop md:px-8 border-b border-outline-variant shadow-sm transition-all duration-300">
      <div className="flex items-center gap-10">
        <Link href="/" className="font-heading font-extrabold text-[20px] tracking-tight text-primary hover:opacity-80 transition-opacity">
          Uni<span className="text-accent">.</span>Block
        </Link>

        {user && (
          <nav className="hidden md:flex items-center gap-2">
            <Link href="/feed" className={navLink(pathname === "/feed")}>Akış</Link>
            <Link href="/events" className={navLink(pathname === "/events")}>Etkinlikler</Link>
            <Link href="/clubs" className={navLink(pathname === "/clubs")}>Kulüpler</Link>
            <Link href="/teams" className={navLink(pathname === "/teams")}>Takımlar</Link>
            <Link href="/news" className={navLink(pathname === "/news")}>Haberler</Link>
            {(user?.role === "SUPER_ADMIN" || user?.role === "PROJECT_ADMIN" || user?.role === "ADMIN") && (
              <Link
                href="/admin"
                className="ml-1 text-[11px] font-bold tracking-wide uppercase rounded-full bg-primary-fixed text-primary px-3 py-1.5 hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Admin
              </Link>
            )}
          </nav>
        )}
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            {/* Notifications */}
            <Popover>
              <PopoverTrigger className="relative p-2.5 rounded-full hover:bg-surface-container-high transition-colors group text-on-surface-variant">
                <Bell className="w-5 h-5 group-hover:text-primary transition-colors" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full"></span>
              </PopoverTrigger>
              <PopoverContent className="w-80 rounded-xl border border-outline-variant p-0 shadow-ambient-lg mr-4 overflow-hidden">
                <div className="bg-primary text-primary-foreground px-4 py-3">
                  <h3 className="font-heading text-[13px] font-semibold flex items-center gap-2">
                    Bildirimler
                  </h3>
                </div>
                <div className="bg-card text-card-foreground">
                  <div className="p-4 border-b border-outline-variant hover:bg-surface-container-low transition-colors cursor-pointer">
                    <p className="text-[13px] leading-snug">
                      <span className="font-semibold">Sistem</span> Hoş geldiniz! Hesabınız aktif edildi.
                    </p>
                    <span className="text-[11px] text-on-surface-variant font-medium mt-1 block">ŞİMDİ</span>
                  </div>
                </div>
                <div className="p-3 bg-surface-container-low text-center">
                  <Link href="#" className="text-[12px] font-semibold text-primary hover:underline">
                    Tümünü Gör →
                  </Link>
                </div>
              </PopoverContent>
            </Popover>

            <div className="hidden sm:block text-right ml-1">
              <Link href="/profile" className="group">
                <div className={`text-[13px] font-semibold leading-none transition-colors ${pathname === "/profile" ? "text-primary" : "text-on-surface group-hover:text-primary"}`}>
                  {user.name}
                </div>
                <div className="text-[11px] text-on-surface-variant font-medium mt-1">
                  {user.department || "Öğrenci"}
                </div>
              </Link>
            </div>

            <Link href="/profile">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className={`h-10 w-10 rounded-full object-cover border-2 transition-all ${
                    pathname === "/profile"
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-transparent hover:ring-2 hover:ring-primary/30"
                  }`}
                />
              ) : (
                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-[13px] font-bold transition-all ${pathname === "/profile" ? "bg-primary text-primary-foreground" : "bg-primary-fixed text-primary hover:ring-2 hover:ring-primary/30"}`}>
                  {initials}
                </div>
              )}
            </Link>

            <form action={logout}>
              <Button type="submit" variant="outline" className="hidden lg:flex h-10 rounded-full border-outline-variant text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface px-4 text-[13px] font-medium">
                <LogOut className="w-4 h-4 mr-2" /> Çıkış Yap
              </Button>
            </form>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-[14px] font-semibold text-on-surface-variant hover:text-primary transition-colors px-2">
              Giriş Yap
            </Link>
            <Link href="/register">
              <Button className="rounded-full h-10 px-6 text-[14px] font-semibold">
                Kayıt Ol
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
