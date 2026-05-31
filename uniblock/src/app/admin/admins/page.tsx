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
        <Shield className="w-12 h-12 text-outline-variant mb-4" />
        <p className="text-on-surface-variant text-sm font-medium">Bu bölüme erişim kısıtlıdır.</p>
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
          <UserCog className="w-5 h-5 text-primary" />
          <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-[0.2em]">Sistem / Yöneticiler</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-on-surface tracking-tight">Yönetici Yönetimi</h1>
            <p className="text-sm text-on-surface-variant mt-1">Sisteme yeni yönetici ekle veya mevcut yöneticileri yönet.</p>
          </div>
          {isSuperAdmin && (
            <VisibilityToggle adminsVisible={adminsVisible} />
          )}
        </div>
      </div>

      {isSuperAdmin && (
        <div className="bg-card rounded-xl border border-outline-variant shadow-ambient p-6 mb-6">
          <h2 className="text-[13px] font-bold text-on-surface tracking-tight mb-2">Yeni Yönetici Ekle</h2>
          <p className="text-[12px] text-on-surface-variant mb-4">Sisteme kayıtlı bir kullanıcının e-posta adresini girerek yönetici yetkisi verin. Yöneticiler süperadmin yetkisine sahip olamaz.</p>
          <AddAdminForm />
        </div>
      )}

      {/* Süperadminler — yalnızca süperadmin görebilir */}
      {isSuperAdmin && (
        <div className="bg-card rounded-xl border border-outline-variant shadow-ambient overflow-hidden mb-4">
          <div className="px-5 py-4 border-b border-outline-variant flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-600" />
            <h2 className="text-[14px] font-bold text-on-surface tracking-tight">Süperadminler</h2>
            <span className="ml-auto text-[11px] font-semibold text-on-surface-variant">{superAdmins.length}</span>
          </div>
          <div className="divide-y divide-outline-variant">
            {superAdmins.map((admin) => (
              <div key={admin.id} className="grid grid-cols-[auto_1fr_200px_120px] px-5 py-3 items-center">
                <div className="w-8 flex items-center justify-center">
                  <Crown className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <span className="text-[13px] font-semibold text-on-surface">{admin.name || "—"}</span>
                <span className="text-[12px] text-on-surface-variant">{admin.email}</span>
                <span className="text-[11px] text-on-surface-variant">{new Date(admin.createdAt).toLocaleDateString("tr-TR")}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Normal Yöneticiler */}
      <div className="bg-card rounded-xl border border-outline-variant shadow-ambient overflow-hidden">
        <div className="px-5 py-4 border-b border-outline-variant flex items-center justify-between">
          <h2 className="text-[14px] font-bold text-on-surface tracking-tight">Yöneticiler</h2>
          <span className="text-[11px] font-semibold text-on-surface-variant">{admins.length} Yönetici</span>
        </div>
        <div className="grid grid-cols-[auto_1fr_200px_120px_60px] px-5 py-3 border-b border-outline-variant bg-surface-container-low">
          <span className="w-8" />
          <span className="text-[11px] font-semibold text-on-surface-variant">Ad Soyad</span>
          <span className="text-[11px] font-semibold text-on-surface-variant">E-posta</span>
          <span className="text-[11px] font-semibold text-on-surface-variant">Eklenme</span>
          <span />
        </div>
        <div className="divide-y divide-outline-variant">
          {admins.length > 0 ? admins.map((admin) => (
            <div key={admin.id} className="grid grid-cols-[auto_1fr_200px_120px_60px] px-5 py-3 hover:bg-surface-container-low transition-colors items-center">
              <div className="w-8 flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="text-[13px] font-semibold text-on-surface">{admin.name || "—"}</span>
              <span className="text-[12px] text-on-surface-variant">{admin.email}</span>
              <span className="text-[11px] text-on-surface-variant">{new Date(admin.createdAt).toLocaleDateString("tr-TR")}</span>
              <div className="flex justify-end">
                {isSuperAdmin && <RemoveAdminButton userId={admin.id} name={admin.name} />}
              </div>
            </div>
          )) : (
            <div className="px-5 py-12 text-center">
              <UserCog className="w-8 h-8 text-outline-variant mx-auto mb-2" />
              <p className="text-[12px] text-on-surface-variant font-medium">Henüz yönetici eklenmemiş.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
