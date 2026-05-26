import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { UserCog, Crown, Shield } from "lucide-react";
import { AddAdminForm, RemoveAdminButton, VisibilityToggle } from "./AdminManager";

export default async function AdminAdminsPage() {
  const currentUser = await getCurrentUser();
  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";

  const settings = await prisma.systemSettings.findUnique({ where: { id: "singleton" } });
  const adminsVisible = settings?.adminsVisible ?? false;

  // ADMIN rolündeki kullanıcılar görünürlük kapalıysa bu sayfayı göremez
  if (!isSuperAdmin && !adminsVisible) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <Shield className="w-12 h-12 text-white/10 mb-4" />
        <p className="text-white/30 text-sm font-medium">Bu bölüme erişim kısıtlıdır.</p>
      </div>
    );
  }

  const superAdmins = await prisma.user.findMany({
    where: { role: "SUPER_ADMIN" },
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, email: true, createdAt: true, role: true }
  });

  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, email: true, createdAt: true, role: true }
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <UserCog className="w-5 h-5 text-violet-400" />
          <span className="text-[11px] font-semibold text-white/40 uppercase tracking-[0.2em]">Sistem / Yöneticiler</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-extrabold text-white tracking-tight">Yönetici Yönetimi</h1>
            <p className="text-sm text-white/40 mt-1">Sisteme yeni yönetici ekle veya mevcut yöneticileri yönet.</p>
          </div>
          {isSuperAdmin && (
            <VisibilityToggle adminsVisible={adminsVisible} />
          )}
        </div>
      </div>

      {isSuperAdmin && (
        <div className="bg-[#181a24] border border-white/[0.06] p-6 mb-6">
          <h2 className="text-[12px] font-bold text-white/60 uppercase tracking-widest mb-4">Yeni Yönetici Ekle</h2>
          <p className="text-[12px] text-white/30 mb-4">Sisteme kayıtlı bir kullanıcının e-posta adresini girerek yönetici yetkisi verin. Yöneticiler süperadmin yetkisine sahip olamaz.</p>
          <AddAdminForm />
        </div>
      )}

      {/* Süperadminler — yalnızca süperadmin görebilir */}
      {isSuperAdmin && (
        <div className="bg-[#181a24] border border-amber-500/20 overflow-hidden mb-4">
          <div className="px-5 py-4 border-b border-amber-500/10 flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-400" />
            <h2 className="text-[13px] font-bold text-amber-300/80 uppercase tracking-wider">Süperadminler</h2>
            <span className="ml-auto text-[10px] font-bold text-white/20 uppercase tracking-widest">{superAdmins.length}</span>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {superAdmins.map((admin) => (
              <div key={admin.id} className="grid grid-cols-[auto_1fr_200px_120px] px-5 py-3 items-center">
                <div className="w-8 flex items-center justify-center">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <span className="text-[13px] font-semibold text-white">{admin.name || "—"}</span>
                <span className="text-[11px] text-white/40">{admin.email}</span>
                <span className="text-[11px] text-white/30">{new Date(admin.createdAt).toLocaleDateString("tr-TR")}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Normal Yöneticiler */}
      <div className="bg-[#181a24] border border-white/[0.06] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <h2 className="text-[13px] font-bold text-white uppercase tracking-wider">Yöneticiler</h2>
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
          {admins.length > 0 ? admins.map((admin) => (
            <div key={admin.id} className="grid grid-cols-[auto_1fr_200px_120px_60px] px-5 py-3 hover:bg-white/[0.02] transition-colors items-center">
              <div className="w-8 flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-violet-400/50" />
              </div>
              <span className="text-[13px] font-semibold text-white">{admin.name || "—"}</span>
              <span className="text-[11px] text-white/40">{admin.email}</span>
              <span className="text-[11px] text-white/30">{new Date(admin.createdAt).toLocaleDateString("tr-TR")}</span>
              <div className="flex justify-end">
                {isSuperAdmin && <RemoveAdminButton userId={admin.id} name={admin.name} />}
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
