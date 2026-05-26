import { prisma } from "@/lib/prisma";
import { Building2 } from "lucide-react";
import DepartmentManager from "./DepartmentManager";

export default async function AdminDepartmentsPage() {
  const faculties = await prisma.faculty.findMany({
    orderBy: { name: "asc" },
    include: {
      departments: { orderBy: { name: "asc" } }
    }
  });

  const totalDepts = faculties.reduce((sum, f) => sum + f.departments.length, 0);

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Building2 className="w-5 h-5 text-cyan-400" />
          <span className="text-[11px] font-semibold text-white/40 uppercase tracking-[0.2em]">Sistem / Fakülte & Bölüm</span>
        </div>
        <h1 className="text-3xl font-heading font-extrabold text-white tracking-tight">Fakülte & Bölüm Yönetimi</h1>
        <p className="text-sm text-white/40 mt-1">
          Kayıt sırasında kullanılan fakülte ve bölüm listesini yönet.
          {faculties.length > 0 && ` · ${faculties.length} fakülte, ${totalDepts} bölüm`}
        </p>
      </div>

      <DepartmentManager faculties={faculties} />
    </div>
  );
}
