"use client";

import { useState } from "react";
import { promoteUserToAdmin, removeAdminRole, toggleAdminsVisibility } from "@/app/actions/admin";
import { toast } from "sonner";
import { UserPlus, Trash2, Eye, EyeOff } from "lucide-react";

export function AddAdminForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    const res = await promoteUserToAdmin(email.trim());
    if (res.success) {
      toast.success(`${res.name} yönetici yapıldı.`);
      setEmail("");
    } else {
      toast.error(res.error);
    }
    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-3">
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="kullanici@universite.edu.tr"
        className="flex-1 bg-[#0f1117] border border-white/[0.08] px-4 py-2.5 text-[13px] text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/50"
        disabled={loading}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-[12px] font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
      >
        <UserPlus className="w-4 h-4" />
        {loading ? "Ekleniyor..." : "Yönetici Yap"}
      </button>
    </form>
  );
}

export function RemoveAdminButton({ userId, name }: { userId: string; name: string | null }) {
  const [loading, setLoading] = useState(false);

  async function onClick() {
    if (!confirm(`${name} kullanıcısının yöneticilik yetkisi kaldırılsın mı?`)) return;
    setLoading(true);
    const res = await removeAdminRole(userId);
    if (res.success) toast.success("Yetki kaldırıldı.");
    else toast.error(res.error);
    setLoading(false);
  }

  return (
    <button
      onClick={onClick}
      disabled={loading}
      title="Yetkiyi kaldır"
      className="p-1.5 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}

export function VisibilityToggle({ adminsVisible }: { adminsVisible: boolean }) {
  const [visible, setVisible] = useState(adminsVisible);
  const [loading, setLoading] = useState(false);

  async function onClick() {
    setLoading(true);
    const next = !visible;
    const res = await toggleAdminsVisibility(next);
    if (res.success) {
      setVisible(next);
      toast.success(next ? "Yöneticiler diğer adminlere görünür yapıldı." : "Yöneticiler gizlendi.");
    } else {
      toast.error(res.error);
    }
    setLoading(false);
  }

  return (
    <button
      onClick={onClick}
      disabled={loading}
      title={visible ? "Yöneticileri gizle" : "Yöneticileri göster"}
      className={`flex items-center gap-2 px-4 py-2 text-[12px] font-bold uppercase tracking-wider border transition-colors disabled:opacity-50 ${
        visible
          ? "border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
          : "border-white/[0.08] text-white/30 hover:bg-white/[0.04]"
      }`}
    >
      {visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      {visible ? "Diğerleri Görüyor" : "Diğerleri Görmüyor"}
    </button>
  );
}
