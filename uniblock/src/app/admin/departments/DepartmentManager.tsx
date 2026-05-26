"use client";

import { useState } from "react";
import { addFaculty, deleteFaculty, addDepartment, deleteDepartment } from "@/app/actions/admin";
import { toast } from "sonner";
import { Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";

interface Department {
  id: string;
  name: string;
}

interface Faculty {
  id: string;
  name: string;
  departments: Department[];
}

export default function DepartmentManager({ faculties }: { faculties: Faculty[] }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [newFaculty, setNewFaculty] = useState("");
  const [newDept, setNewDept] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function handleAddFaculty(e: React.FormEvent) {
    e.preventDefault();
    if (!newFaculty.trim()) return;
    setLoading(true);
    const res = await addFaculty(newFaculty.trim());
    if (res.success) { toast.success("Fakülte eklendi."); setNewFaculty(""); }
    else toast.error(res.error);
    setLoading(false);
  }

  async function handleDeleteFaculty(id: string, name: string) {
    if (!confirm(`"${name}" fakültesi ve tüm bölümleri silinecek. Devam?`)) return;
    setLoading(true);
    const res = await deleteFaculty(id);
    if (res.success) toast.success("Fakülte silindi.");
    else toast.error(res.error);
    setLoading(false);
  }

  async function handleAddDepartment(e: React.FormEvent, facultyId: string) {
    e.preventDefault();
    const name = newDept[facultyId];
    if (!name?.trim()) return;
    setLoading(true);
    const res = await addDepartment(facultyId, name.trim());
    if (res.success) { toast.success("Bölüm eklendi."); setNewDept(d => ({ ...d, [facultyId]: "" })); }
    else toast.error(res.error);
    setLoading(false);
  }

  async function handleDeleteDepartment(id: string, name: string) {
    if (!confirm(`"${name}" bölümü silinecek. Devam?`)) return;
    setLoading(true);
    const res = await deleteDepartment(id);
    if (res.success) toast.success("Bölüm silindi.");
    else toast.error(res.error);
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      {/* Yeni Fakülte */}
      <div className="bg-[#181a24] border border-white/[0.06] p-5">
        <h3 className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-3">Yeni Fakülte Ekle</h3>
        <form onSubmit={handleAddFaculty} className="flex gap-3">
          <input
            value={newFaculty}
            onChange={e => setNewFaculty(e.target.value)}
            placeholder="Fakülte adı (ör. Mühendislik Fakültesi)"
            className="flex-1 bg-[#0f1117] border border-white/[0.08] px-4 py-2.5 text-[13px] text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-[12px] font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            Ekle
          </button>
        </form>
      </div>

      {/* Fakülte Listesi */}
      {faculties.length === 0 ? (
        <div className="bg-[#181a24] border border-white/[0.06] p-12 text-center text-[12px] text-white/20">
          Henüz fakülte eklenmemiş.
        </div>
      ) : (
        <div className="space-y-2">
          {faculties.map(faculty => (
            <div key={faculty.id} className="bg-[#181a24] border border-white/[0.06]">
              <div className="flex items-center justify-between px-5 py-3">
                <button
                  onClick={() => setExpanded(e => ({ ...e, [faculty.id]: !e[faculty.id] }))}
                  className="flex items-center gap-3 text-left flex-1"
                >
                  {expanded[faculty.id]
                    ? <ChevronDown className="w-4 h-4 text-white/30 shrink-0" />
                    : <ChevronRight className="w-4 h-4 text-white/30 shrink-0" />
                  }
                  <span className="text-[13px] font-semibold text-white">{faculty.name}</span>
                  <span className="text-[10px] text-white/25">{faculty.departments.length} bölüm</span>
                </button>
                <button
                  onClick={() => handleDeleteFaculty(faculty.id, faculty.name)}
                  disabled={loading}
                  className="p-1.5 text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {expanded[faculty.id] && (
                <div className="border-t border-white/[0.04] px-5 py-4">
                  <div className="space-y-1.5 mb-4">
                    {faculty.departments.map(dept => (
                      <div key={dept.id} className="flex items-center justify-between py-1.5 px-3 bg-white/[0.02]">
                        <span className="text-[12px] text-white/60">{dept.name}</span>
                        <button
                          onClick={() => handleDeleteDepartment(dept.id, dept.name)}
                          disabled={loading}
                          className="p-1 text-red-400/40 hover:text-red-400 transition-colors disabled:opacity-40"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {faculty.departments.length === 0 && (
                      <p className="text-[11px] text-white/20 italic px-3">Henüz bölüm yok.</p>
                    )}
                  </div>
                  <form onSubmit={e => handleAddDepartment(e, faculty.id)} className="flex gap-2">
                    <input
                      value={newDept[faculty.id] || ""}
                      onChange={e => setNewDept(d => ({ ...d, [faculty.id]: e.target.value }))}
                      placeholder="Yeni bölüm adı"
                      className="flex-1 bg-[#0f1117] border border-white/[0.06] px-3 py-2 text-[12px] text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50"
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-cyan-600/70 hover:bg-cyan-600 text-white text-[11px] font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
