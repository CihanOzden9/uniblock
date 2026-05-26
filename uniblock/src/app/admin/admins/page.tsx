import { prisma } from "@/lib/prisma";
import { UserCog, Crown } from "lucide-react";
import { AddAdminForm, RemoveAdminButton } from "./AdminManager";

export default async function AdminAdminsPage() {
  const admins = await prisma.user.findMany({
    where: { role: "SUPER_ADMIN" },
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, email: true, createdAt: true }
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <UserCog className="w-5 h-5 text-violet-400" />
          <span className="text-[11px] font-semibold text-white/40 uppercase tracking-[0.2em]">Sistem / Yöneticiler</span>
        </div>
        <h1 className="text-3xl font-heading font-extrabold text-white tracking-tight">Yönetici Yönetimi</h1>
        <p className="text-sm text-white/40 mt-1">Sisteme yeni yönetici ekle veya mevcut yöneticileri yönet.</p>
      </div>

      <div className="bg-[#181a24] border border-white/[0.06] p-6 mb-6">
        <h2 className="text-[12px] font-bold text-white/60 uppercase tracking-widest mb-4">Yeni Yönetici Ekle</h2>
        <p className="text-[12px] text-white/30 mb-4">Sisteme kayıtlı bir kullanıcının e-posta adresini girerek yönetici yetkisi verin.</p>
        <AddAdminForm />
      </div>

      <div className="bg-[#181a24] border border-white/[0.06] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <h2 className="text-[13px] font-bold text-white uppercase tracking-wider">Mevcut Yöneticiler</h2>
          <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{admins.length} Yönetici</span>
        </div>
        <div className="grid grid-cols-[auto_1fr_200px_120px_60px] px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          <span className="w-8" />
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Ad Soyad</span>
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">E-posta</span>
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Eklenme</span>
          <span />
        </div>
        <div className="divide-y divide-white/[0.04]">
          {admins.length > 0 ? admins.map((admin, i) => (
            <div key={admin.id} className="grid grid-cols-[auto_1fr_200px_120px_60px] px-5 py-3 hover:bg-white/[0.02] transition-colors items-center">
              <div className="w-8 flex items-center justify-center">
                <Crown className={`w-3.5 h-3.5 ${i === 0 ? "text-amber-400" : "text-violet-400/50"}`} />
              </div>
              <span className="text-[13px] font-semibold text-white">{admin.name || "—"}</span>
              <span className="text-[11px] text-white/40">{admin.email}</span>
              <span className="text-[11px] text-white/30">{new Date(admin.createdAt).toLocaleDateString("tr-TR")}</span>
              <div className="flex justify-end">
                <RemoveAdminButton userId={admin.id} name={admin.name} />
              </div>
            </div>
          )) : (
            <div className="px-5 py-12 text-center">
              <UserCog className="w-8 h-8 text-white/10 mx-auto mb-2" />
              <p className="text-[12px] text-white/20 font-medium">Henüz yönetici eklenmemiş.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
