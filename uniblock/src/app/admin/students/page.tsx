import { prisma } from "@/lib/prisma";
import { GraduationCap, Clock } from "lucide-react";
import StudentStatusActions from "./StudentStatusActions";

export default async function AdminStudentsPage() {
  const users = await prisma.user.findMany({
    where: { role: { in: ["STUDENT", "CLUB_ADMIN"] } },
    orderBy: [
      { status: "asc" },
      { createdAt: "desc" }
    ],
    select: {
      id: true, name: true, email: true, faculty: true, department: true, createdAt: true, image: true, status: true, role: true,
      _count: { select: { clubMemberships: true, interactions: true } },
    },
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <GraduationCap className="w-5 h-5 text-blue-400" />
          <span className="text-[11px] font-semibold text-white/40 uppercase tracking-[0.2em]">Yönetim / Kullanıcılar</span>
        </div>
        <h1 className="text-3xl font-heading font-extrabold text-white tracking-tight">Kullanıcı Yönetimi</h1>
        <p className="text-sm text-white/40 mt-1">Sistemde {users.length} kayıtlı öğrenci ve başkan bulunuyor.</p>
      </div>

      <div className="bg-[#181a24] border border-white/[0.06] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <h2 className="text-[13px] font-bold text-white uppercase tracking-wider">Tüm Kullanıcılar</h2>
          <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{users.length} Kayıt</span>
        </div>
        <div className="grid grid-cols-[1.2fr_1fr_1fr_80px_100px_80px_100px] px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Ad Soyad</span>
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">E-posta</span>
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest text-center">Rol</span>
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Fakülte</span>
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Tarih</span>
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest text-center">Durum</span>
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest text-center">İşlem</span>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {users.length > 0 ? users.map((user) => (
            <div key={user.id} className="grid grid-cols-[1.2fr_1fr_1fr_80px_100px_80px_100px] px-5 py-3 hover:bg-white/[0.02] transition-colors items-center">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <span className="text-[9px] font-bold text-blue-400">{user.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "??"}</span>
                </div>
                <span className="text-[12px] font-semibold text-white truncate">{user.name}</span>
              </div>
              <span className="text-[11px] text-white/40 truncate">{user.email}</span>
              <div className="flex justify-center">
                <span className={`text-[9px] font-black px-2 py-0.5 uppercase tracking-widest ${
                  user.role === "CLUB_ADMIN" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                }`}>
                  {user.role === "CLUB_ADMIN" ? "Kulüp Başk." : "Öğrenci"}
                </span>
              </div>
              <span className="text-[11px] text-white/50 truncate">{user.faculty || "—"}</span>
              <div className="flex items-center gap-1 text-white/30">
                <Clock className="w-3 h-3" />
                <span className="text-[10px] font-medium">{new Date(user.createdAt).toLocaleDateString("tr-TR")}</span>
              </div>
              <div className="flex justify-center">
                <span className={`text-[9px] font-black px-2 py-0.5 uppercase tracking-widest ${
                  user.status === "PENDING" ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" :
                  user.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                  "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}>
                  {user.status === "PENDING" ? "Bekliyor" : user.status === "ACTIVE" ? "Aktif" : "Red/Engel"}
                </span>
              </div>
              <StudentStatusActions userId={user.id} status={user.status} />
            </div>
          )) : (
            <div className="px-5 py-12 text-center text-[12px] text-white/20 font-medium">Henüz kayıtlı kullanıcı bulunmuyor.</div>
          )}
        </div>
      </div>
    </div>
  );
}

