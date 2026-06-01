import { prisma } from "@/lib/prisma";
import { GraduationCap, Clock } from "lucide-react";
import StudentStatusActions from "./StudentStatusActions";
import AdminFilters from "../AdminFilters";

export default async function AdminStudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; role?: string; faculty?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q || "").trim();
  const status = sp.status || "";
  const role = sp.role || "";
  const faculty = sp.faculty || "";

  const where: any = { role: { in: ["STUDENT", "CLUB_ADMIN"] } };
  if (q) where.OR = [
    { name: { contains: q, mode: "insensitive" } },
    { email: { contains: q, mode: "insensitive" } },
  ];
  if (status) where.status = status;
  if (role) where.role = role;
  if (faculty) where.faculty = faculty;

  const [users, facultyRows] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      select: {
        id: true, name: true, email: true, faculty: true, department: true, createdAt: true, image: true, status: true, role: true,
        _count: { select: { clubMemberships: true, interactions: true } },
      },
    }),
    prisma.user.findMany({
      where: { role: { in: ["STUDENT", "CLUB_ADMIN"] }, faculty: { not: null } },
      select: { faculty: true },
      distinct: ["faculty"],
      orderBy: { faculty: "asc" },
    }),
  ]);

  const facultyOptions = facultyRows
    .map((f) => f.faculty)
    .filter((f): f is string => !!f)
    .map((f) => ({ value: f, label: f }));

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <GraduationCap className="w-5 h-5 text-primary" />
          <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-[0.2em]">Yönetim / Kullanıcılar</span>
        </div>
        <h1 className="text-3xl font-heading font-bold text-on-surface tracking-tight">Kullanıcı Yönetimi</h1>
        <p className="text-sm text-on-surface-variant mt-1">Sistemde {users.length} kayıt listeleniyor.</p>
      </div>

      <AdminFilters
        searchPlaceholder="Ad veya e-posta ara..."
        selects={[
          { key: "status", label: "Tüm Durumlar", options: [
            { value: "ACTIVE", label: "Aktif" },
            { value: "PENDING", label: "Bekliyor" },
            { value: "REJECTED", label: "Reddedilmiş" },
            { value: "BANNED", label: "Engelli" },
          ] },
          { key: "role", label: "Tüm Roller", options: [
            { value: "STUDENT", label: "Öğrenci" },
            { value: "CLUB_ADMIN", label: "Kulüp Başkanı" },
          ] },
          { key: "faculty", label: "Tüm Fakülteler", options: facultyOptions },
        ]}
      />

      <div className="bg-card rounded-xl border border-outline-variant shadow-ambient overflow-hidden">
        <div className="px-5 py-4 border-b border-outline-variant flex items-center justify-between">
          <h2 className="text-[14px] font-bold text-on-surface tracking-tight">Tüm Kullanıcılar</h2>
          <span className="text-[11px] font-semibold text-on-surface-variant">{users.length} Kayıt</span>
        </div>
        <div className="grid grid-cols-[1.2fr_1fr_1fr_80px_100px_80px_100px] px-5 py-3 border-b border-outline-variant bg-surface-container-low">
          <span className="text-[11px] font-semibold text-on-surface-variant">Ad Soyad</span>
          <span className="text-[11px] font-semibold text-on-surface-variant">E-posta</span>
          <span className="text-[11px] font-semibold text-on-surface-variant text-center">Rol</span>
          <span className="text-[11px] font-semibold text-on-surface-variant">Fakülte</span>
          <span className="text-[11px] font-semibold text-on-surface-variant">Tarih</span>
          <span className="text-[11px] font-semibold text-on-surface-variant text-center">Durum</span>
          <span className="text-[11px] font-semibold text-on-surface-variant text-center">İşlem</span>
        </div>
        <div className="divide-y divide-outline-variant">
          {users.length > 0 ? users.map((user) => (
            <div key={user.id} className="grid grid-cols-[1.2fr_1fr_1fr_80px_100px_80px_100px] px-5 py-3 hover:bg-surface-container-low transition-colors items-center">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 rounded-full bg-primary-fixed flex items-center justify-center shrink-0">
                  <span className="text-[9px] font-bold text-primary">{user.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "??"}</span>
                </div>
                <span className="text-[13px] font-semibold text-on-surface truncate">{user.name}</span>
              </div>
              <span className="text-[12px] text-on-surface-variant truncate">{user.email}</span>
              <div className="flex justify-center">
                <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                  user.role === "CLUB_ADMIN" ? "bg-amber-100 text-amber-700" : "bg-primary-fixed text-primary"
                }`}>
                  {user.role === "CLUB_ADMIN" ? "Kulüp Başk." : "Öğrenci"}
                </span>
              </div>
              <span className="text-[12px] text-on-surface-variant truncate">{user.faculty || "—"}</span>
              <div className="flex items-center gap-1 text-on-surface-variant">
                <Clock className="w-3 h-3" />
                <span className="text-[11px] font-medium">{new Date(user.createdAt).toLocaleDateString("tr-TR")}</span>
              </div>
              <div className="flex justify-center">
                <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                  user.status === "PENDING" ? "bg-accent/15 text-[color:var(--community-orange-deep)]" :
                  user.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {user.status === "PENDING" ? "Bekliyor" : user.status === "ACTIVE" ? "Aktif" : "Red/Engel"}
                </span>
              </div>
              <StudentStatusActions userId={user.id} status={user.status} />
            </div>
          )) : (
            <div className="px-5 py-12 text-center text-[12px] text-on-surface-variant font-medium">{(q || status || role || faculty) ? "Filtreye uygun kullanıcı bulunamadı." : "Henüz kayıtlı kullanıcı bulunmuyor."}</div>
          )}
        </div>
      </div>
    </div>
  );
}

