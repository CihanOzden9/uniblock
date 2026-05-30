"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Shield,
  Calendar,
  AlertTriangle,
  LogOut,
  ChevronRight,
  GraduationCap,
  Building2,
  UserCog,
  Users2,
  ExternalLink,
} from "lucide-react";
import { logout } from "@/app/actions/auth";

interface AdminSidebarProps {
  user: {
    name: string;
    role: string;
    image?: string | null;
  };
  pendingCounts?: {
    users: number;
    clubs: number;
    teams: number;
    complaints: number;
  };
}

export default function AdminSidebar({ user, pendingCounts }: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      section: "GENEL",
      items: [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
      ],
    },
    {
      section: "YÖNETİM",
      items: [
        { 
          href: "/admin/students", 
          label: "Kullanıcılar", 
          icon: GraduationCap,
          count: pendingCounts?.users 
        },
        {
          href: "/admin/clubs",
          label: "Kulüpler",
          icon: Shield,
          count: pendingCounts?.clubs
        },
        {
          href: "/admin/teams",
          label: "Takımlar",
          icon: Users2,
          count: pendingCounts?.teams
        },
        { href: "/admin/events", label: "Etkinlikler", icon: Calendar },
        { 
          href: "/admin/complaints", 
          label: "Şikâyetler", 
          icon: AlertTriangle,
          count: pendingCounts?.complaints
        },
      ],
    },
    {
      section: "SİSTEM",
      items: [
        { href: "/admin/admins", label: "Yöneticiler", icon: UserCog },
        { href: "/admin/departments", label: "Fakülte & Bölüm", icon: Building2 },
      ],
    },
  ];

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[260px] bg-[#13151d] border-r border-white/[0.06] flex flex-col z-50">
      {/* Brand */}
      <div className="h-[72px] flex items-center px-6 border-b border-white/[0.06]">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
            <span className="text-white font-extrabold text-[13px] tracking-tight">UB</span>
          </div>
          <div>
            <span className="font-heading font-extrabold text-[15px] text-white tracking-tight">
              UniBlock
            </span>
            <span className="block text-[9px] font-bold text-red-400 uppercase tracking-[0.2em] -mt-0.5">
              Admin Panel
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {navItems.map((section) => (
          <div key={section.section} className="mb-6">
            <div className="px-3 mb-2">
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
                {section.section}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              {section.items.map((item: any) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium transition-all duration-200 group relative ${
                      isActive
                        ? "bg-white/[0.08] text-white"
                        : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] bg-red-500 rounded-r-full" />
                    )}
                    <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? "text-red-400" : "text-white/30 group-hover:text-white/60"}`} />
                    <span className="flex-1">{item.label}</span>
                    {item.count > 0 && (
                      <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-black border border-red-500/30 min-w-[18px] text-center">
                        {item.count}
                      </span>
                    )}
                    {isActive && (
                      <ChevronRight className="w-3.5 h-3.5 text-white/30 ml-1" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Info */}
      <div className="border-t border-white/[0.06] p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 bg-gradient-to-br from-red-500/20 to-red-700/20 border border-red-500/30 flex items-center justify-center shrink-0">
            <span className="text-red-400 font-bold text-[11px]">{initials}</span>
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-white truncate">{user.name}</p>
            <p className="text-[10px] text-red-400/80 font-medium uppercase tracking-wider">
              {user.role === "SUPER_ADMIN" ? "Süper Admin" : user.role === "PROJECT_ADMIN" ? "Proje Admin" : "Yönetici"}
            </p>
          </div>
        </div>
        <Link
          href="/feed"
          className="w-full flex items-center justify-center gap-2 px-3 py-2 mb-2 bg-white/[0.04] hover:bg-accent/10 border border-white/[0.06] hover:border-accent/30 text-white/50 hover:text-accent text-[11px] font-bold uppercase tracking-widest transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Platforma Git
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/[0.04] hover:bg-red-500/10 border border-white/[0.06] hover:border-red-500/20 text-white/50 hover:text-red-400 text-[11px] font-bold uppercase tracking-widest transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Çıkış Yap
          </button>
        </form>
      </div>
    </aside>
  );
}
