"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";

interface AdminNavbarProps {
  user?: {
    name: string;
    role: string;
  } | null;
  // Yönetim panelinin kök yolu — kulüp için "/clubs/manage", takım için "/teams/manage"
  basePath?: string;
}

export default function AdminNavbar({ user, basePath = "/clubs/manage" }: AdminNavbarProps) {
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
        <Link href={basePath} className="font-heading font-extrabold text-[18px] tracking-tight text-white hover:text-accent transition-colors">
          Uni<span className="text-accent">.</span>Block <span className="ml-2 text-[10px] bg-accent text-white px-2 py-0.5 tracking-[0.2em] uppercase">Admin</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href={basePath}
            className={`text-[12px] font-bold tracking-[0.1em] uppercase transition-all flex items-center gap-2 ${pathname === basePath ? "text-accent" : "text-gray-400 hover:text-white"}`}
          >
            <LayoutDashboard className="w-4 h-4" /> Panel
          </Link>
          <Link
            href={`${basePath}/stats`}
            className={`text-[12px] font-bold tracking-[0.1em] uppercase transition-all ${pathname === `${basePath}/stats` ? "text-accent" : "text-gray-400 hover:text-white"}`}
          >
            İstatistikler
          </Link>
          <Link
            href={`${basePath}/settings`}
            className={`text-[12px] font-bold tracking-[0.1em] uppercase transition-all ${pathname === `${basePath}/settings` ? "text-accent" : "text-gray-400 hover:text-white"}`}
          >
            Ayarlar
          </Link>
        </nav>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="hidden sm:flex flex-col text-right">
          <span className="text-[11px] font-bold text-white uppercase tracking-wider leading-none">
            {user?.name || "Yönetici"}
          </span>
          <span className="text-[9px] text-accent font-black uppercase tracking-widest mt-1">
            {user?.role || "KULÜP BAŞKANI"}
          </span>
        </div>

        <div className="h-10 w-10 flex items-center justify-center font-bold bg-accent text-white border-2 border-accent">
          {initials}
        </div>

        <form action={logout}>
          <Button type="submit" variant="ghost" className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-none transition-colors">
            <LogOut className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </header>
  );
}
