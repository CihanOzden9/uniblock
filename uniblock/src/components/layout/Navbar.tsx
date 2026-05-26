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

  return (
    <header className="fixed top-0 w-full h-20 bg-black z-50 flex items-center justify-between px-8 border-b-2 border-accent transition-all duration-300">
      <div className="flex items-center gap-12">
        <Link href="/" className="font-heading font-extrabold text-[18px] tracking-tight text-white hover:text-accent transition-colors">
          Uni<span className="text-accent">.</span>Block
        </Link>
        
        {user && (
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/feed" 
              className={`text-[13px] font-bold tracking-[0.05em] uppercase transition-all pb-1 border-b-2 ${pathname === "/feed" ? "text-accent border-accent" : "text-gray-300 border-transparent hover:text-white"}`}
            >
              Akış
            </Link>
            <Link 
              href="/news" 
              className={`text-[13px] font-bold tracking-[0.05em] uppercase transition-all pb-1 border-b-2 ${pathname === "/news" ? "text-accent border-accent" : "text-gray-300 border-transparent hover:text-white"}`}
            >
              Haberler
            </Link>
            <Link 
              href="/events" 
              className={`text-[13px] font-bold tracking-[0.05em] uppercase transition-all pb-1 border-b-2 ${pathname === "/events" ? "text-accent border-accent" : "text-gray-300 border-transparent hover:text-white"}`}
            >
              Etkinliklerim
            </Link>
            <Link 
              href="/clubs" 
              className={`text-[13px] font-bold tracking-[0.05em] uppercase transition-all pb-1 border-b-2 ${pathname === "/clubs" ? "text-accent border-accent" : "text-gray-300 border-transparent hover:text-white"}`}
            >
              Kulüpler
            </Link>
            {(user?.role === "SUPER_ADMIN" || user?.role === "PROJECT_ADMIN" || user?.role === "ADMIN") && (
              <Link 
                href="/admin" 
                className={`text-[13px] font-bold tracking-[0.05em] uppercase transition-all pb-1 border-b-2 text-red-500 border-transparent hover:border-red-500`}
              >
                Admin Paneli
              </Link>
            )}
          </nav>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        {user ? (
          <>
            {/* Notifications */}
            <Popover>
              <PopoverTrigger className="relative p-2 hover:bg-white/10 transition-colors group border-2 border-transparent hover:border-accent">
                <Bell className="w-5 h-5 text-white group-hover:text-accent transition-colors" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
              </PopoverTrigger>
              <PopoverContent className="w-80 rounded-none border-2 border-black p-0 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mr-8">
                <div className="bg-black text-white p-3 border-b-2 border-black">
                  <h3 className="font-heading text-[11px] font-bold uppercase tracking-widest flex items-center gap-2">
                    Bildirimler
                  </h3>
                </div>
                <div className="p-0 bg-white text-black">
                  <div className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                    <p className="text-[12px] font-medium leading-snug">
                      <span className="font-bold">Sistem</span> Hoş geldiniz! Hesabınız aktif edildi.
                    </p>
                    <span className="text-[10px] text-gray-400 font-bold mt-1 block">ŞİMDİ</span>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 text-center">
                  <Link href="#" className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent hover:underline">
                    TÜMÜNÜ GÖR →
                  </Link>
                </div>
              </PopoverContent>
            </Popover>

            <div className="hidden sm:block text-right ml-2">
              <Link href="/profile" className="group">
                <div className={`text-[12px] font-bold tracking-[0.05em] uppercase leading-none transition-colors ${pathname === "/profile" ? "text-accent" : "text-white group-hover:text-accent"}`}>
                  {user.name}
                </div>
                <div className="text-[10px] text-accent/70 font-medium tracking-[0.05em] uppercase mt-1">
                  {user.department?.toUpperCase() || "ÖĞRENCİ"}
                </div>
              </Link>
            </div>
            
            <Link href="/profile">
              <div className={`h-10 w-10 flex items-center justify-center font-bold transition-all border-2 ${pathname === "/profile" ? "bg-accent text-white border-accent" : "bg-accent/10 text-accent border-accent/20 hover:border-accent"}`}>
                {initials}
              </div>
            </Link>

            <form action={logout}>
              <Button type="submit" variant="outline" className="hidden lg:flex px-[20px] py-[10px] h-auto text-[10px] font-bold tracking-[0.15em] uppercase border-white/20 text-white hover:bg-white hover:text-black transition-colors rounded-none bg-transparent">
                <LogOut className="w-3 h-3 mr-2" /> ÇIKIŞ YAP
              </Button>
            </form>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-[12px] font-bold text-white hover:text-accent uppercase tracking-widest transition-colors">
              Giriş Yap
            </Link>
            <Link href="/register">
              <Button className="rounded-none bg-accent text-white font-bold uppercase tracking-widest text-[11px] px-6 h-10 hover:bg-white hover:text-black transition-all">
                Kayıt Ol
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
