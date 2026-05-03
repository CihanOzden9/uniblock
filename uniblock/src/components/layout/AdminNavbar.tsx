"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Settings, LogOut } from "lucide-react";

export default function AdminNavbar() {
  const pathname = usePathname();

  // Simulated Admin Data
  const admin = {
    name: "Mert Demir",
    role: "Yazılım Kulübü Başkanı",
    initials: "MD"
  };

  return (
    <header className="fixed top-0 w-full h-20 bg-black z-50 flex items-center justify-between px-8 border-b-2 border-accent transition-all duration-300">
      <div className="flex items-center gap-12">
        <Link href="/clubs/manage" className="font-heading font-extrabold text-[18px] tracking-tight text-white hover:text-accent transition-colors">
          Uni<span className="text-accent">.</span>Block <span className="ml-2 text-[10px] bg-accent text-white px-2 py-0.5 tracking-[0.2em] uppercase">Admin</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            href="/clubs/manage" 
            className={`text-[12px] font-bold tracking-[0.1em] uppercase transition-all flex items-center gap-2 ${pathname === "/clubs/manage" ? "text-accent" : "text-gray-400 hover:text-white"}`}
          >
            <LayoutDashboard className="w-4 h-4" /> Panel
          </Link>
          <Link 
            href="#" 
            className="text-[12px] font-bold tracking-[0.1em] uppercase text-gray-400 hover:text-white transition-all"
          >
            İstatistikler
          </Link>
          <Link 
            href="#" 
            className="text-[12px] font-bold tracking-[0.1em] uppercase text-gray-400 hover:text-white transition-all"
          >
            Ayarlar
          </Link>
        </nav>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="hidden sm:flex flex-col text-right">
          <span className="text-[11px] font-bold text-white uppercase tracking-wider leading-none">
            {admin.name}
          </span>
          <span className="text-[9px] text-accent font-black uppercase tracking-widest mt-1">
            {admin.role}
          </span>
        </div>

        <div className="h-10 w-10 flex items-center justify-center font-bold bg-accent text-white border-2 border-accent">
          {admin.initials}
        </div>

        <Button variant="ghost" className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-none transition-colors">
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}
