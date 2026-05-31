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
        className="flex-1 bg-card border border-input rounded-full px-5 py-2.5 text-[14px] text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring transition-colors"
        disabled={loading}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-primary-container text-white text-[13px] font-semibold transition-colors disabled:opacity-50"
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
      className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-40"
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
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold border transition-colors disabled:opacity-50 ${
        visible
          ? "border-emerald-300 text-emerald-600 hover:bg-emerald-50"
          : "border-outline-variant text-on-surface-variant hover:bg-surface-container-high"
      }`}
    >
      {visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      {visible ? "Diğerleri Görüyor" : "Diğerleri Görmüyor"}
    </button>
  );
}
