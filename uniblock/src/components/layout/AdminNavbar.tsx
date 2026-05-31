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
    <header className="fixed top-0 w-full h-20 bg-card z-50 flex items-center justify-between px-8 border-b border-outline-variant shadow-sm transition-all duration-300">
      <div className="flex items-center gap-10">
        <Link href={basePath} className="font-heading font-extrabold text-[18px] tracking-tight text-primary hover:opacity-80 transition-opacity flex items-center">
          Uni<span className="text-accent">.</span>Block <span className="ml-2 text-[10px] font-semibold bg-primary-fixed text-primary px-2 py-0.5 rounded-full uppercase tracking-wide">Yönetim</span>
        </Link>
        <nav className="hidden md:flex items-center gap-2">
          <Link
            href={basePath}
            className={`text-[14px] font-medium py-1.5 px-3 rounded-lg border-b-2 transition-colors flex items-center gap-2 ${pathname === basePath ? "text-primary border-primary font-semibold" : "text-on-surface-variant border-transparent hover:bg-surface-container-high hover:text-on-surface"}`}
          >
            <LayoutDashboard className="w-4 h-4" /> Panel
          </Link>
          <Link
            href={`${basePath}/stats`}
            className={`text-[14px] font-medium py-1.5 px-3 rounded-lg border-b-2 transition-colors ${pathname === `${basePath}/stats` ? "text-primary border-primary font-semibold" : "text-on-surface-variant border-transparent hover:bg-surface-container-high hover:text-on-surface"}`}
          >
            İstatistikler
          </Link>
          <Link
            href={`${basePath}/settings`}
            className={`text-[14px] font-medium py-1.5 px-3 rounded-lg border-b-2 transition-colors ${pathname === `${basePath}/settings` ? "text-primary border-primary font-semibold" : "text-on-surface-variant border-transparent hover:bg-surface-container-high hover:text-on-surface"}`}
          >
            Ayarlar
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex flex-col text-right">
          <span className="text-[13px] font-semibold text-on-surface leading-none">
            {user?.name || "Yönetici"}
          </span>
          <span className="text-[11px] text-primary font-medium mt-1">
            {user?.role || "Kulüp Başkanı"}
          </span>
        </div>

        <div className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-[13px] bg-primary-fixed text-primary">
          {initials}
        </div>

        <form action={logout}>
          <Button type="submit" variant="outline" className="h-10 rounded-full border-outline-variant text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface px-4 text-[13px] font-medium">
            <LogOut className="w-4 h-4 mr-2" /> Çıkış
          </Button>
        </form>
      </div>
    </header>
  );
}
