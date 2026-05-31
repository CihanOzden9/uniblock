"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Activity, User as UserIcon, Mail, Globe, Camera, Lock } from "lucide-react";
import { updateTeamSettings, updateTeamPassword } from "@/app/actions/team";
import { toast } from "sonner";

interface SettingsClientProps {
  team: any;
}

export default function SettingsClient({ team }: SettingsClientProps) {
  const [isPending, setIsPending] = useState(false);

  async function handleSettingsSubmit(formData: FormData) {
    setIsPending(true);
    formData.append("teamId", team.id);
    const result = await updateTeamSettings(formData);
    if (result.success) toast.success("Ayarlar başarıyla güncellendi!");
    else toast.error(result.error);
    setIsPending(false);
  }

  async function handlePasswordSubmit(formData: FormData) {
    setIsPending(true);
    formData.append("leaderId", team.leaderId);
    const result = await updateTeamPassword(formData);
    if (result.success) {
      toast.success("Şifre başarıyla güncellendi!");
      (document.getElementById("password-form") as HTMLFormElement)?.reset();
    } else {
      toast.error(result.error);
    }
    setIsPending(false);
  }

  const labelClass = "text-[13px] font-medium text-on-surface flex items-center gap-2";
  const inputClass = "w-full h-11 px-4 rounded-lg border border-input bg-card text-[14px] text-on-surface outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring transition-colors";

  return (
    <div className="space-y-8">
      <div className="bg-primary text-white p-8 rounded-xl shadow-ambient">
        <span className="text-[11px] font-semibold tracking-wide uppercase text-white/70 mb-1.5 block">Yönetim Paneli</span>
        <h1 className="font-heading text-3xl font-bold tracking-tight">Ayarlar</h1>
        <p className="text-white/80 text-[14px] mt-2">{team.name} — Genel ve Güvenlik Ayarları</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-gutter">
        {/* General Settings */}
        <div className="bg-card rounded-xl border border-outline-variant shadow-ambient p-6 md:p-8 space-y-6">
          <h3 className="font-heading text-xl font-bold tracking-tight flex items-center gap-3 border-b border-outline-variant pb-4">
            <Activity className="w-5 h-5 text-accent" /> Genel Bilgiler
          </h3>

          <form action={handleSettingsSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className={labelClass}><Activity className="w-3.5 h-3.5 text-on-surface-variant" /> Takım Adı</label>
                <input name="name" defaultValue={team.name} required className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}><UserIcon className="w-3.5 h-3.5 text-on-surface-variant" /> Takım Kaptanı</label>
                <input name="leaderName" defaultValue={team.leader?.name} required className={inputClass} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}><Mail className="w-3.5 h-3.5 text-on-surface-variant" /> Takım Resmi E-postası</label>
              <input name="contactEmail" type="email" defaultValue={team.contactEmail || ""} placeholder="takim@universite.edu.tr" className={inputClass} />
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}><Mail className="w-3.5 h-3.5 text-on-surface-variant" /> Kaptan Kişisel E-postası <span className="text-destructive">*</span></label>
              <input
                name="presidentEmail" type="email" defaultValue={team.presidentEmail || ""}
                placeholder="kaptan@universite.edu.tr" required
                className={`w-full h-11 px-4 rounded-lg border bg-card text-[14px] outline-none focus:ring-2 focus:ring-ring/50 transition-colors ${
                  !team.presidentEmail ? "border-accent bg-accent/5" : "border-input focus:border-ring"
                }`}
              />
              {!team.presidentEmail && <p className="text-[12px] text-[color:var(--community-orange-deep)] font-medium">Zorunlu — Kaptan kişisel e-postası henüz eklenmemiş.</p>}
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}><Globe className="w-3.5 h-3.5 text-on-surface-variant" /> Web Sayfası</label>
              <input name="website" type="url" defaultValue={team.website || ""} placeholder="https://takim.com" className={inputClass} />
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>Açıklama</label>
              <textarea name="description" defaultValue={team.description || ""} rows={4} className="w-full p-4 rounded-lg border border-input bg-card text-[14px] outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring resize-none" />
            </div>

            {/* Logo */}
            <div className="space-y-3 pt-2">
              <label className={labelClass}><Camera className="w-3.5 h-3.5 text-on-surface-variant" /> Takım Logosu (URL)</label>
              <div className="flex gap-4 items-start">
                <div className="w-24 h-24 rounded-xl border border-outline-variant bg-surface-container-low flex items-center justify-center overflow-hidden shrink-0">
                  {team.logo ? <img src={team.logo} alt="Logo" className="w-full h-full object-cover" /> : <Camera className="w-8 h-8 text-outline-variant" />}
                </div>
                <div className="flex-1 space-y-2">
                  <input name="logo" defaultValue={team.logo || ""} placeholder="https://resim-linki.com/logo.png" className={inputClass + " h-10 text-[13px]"} />
                  <p className="text-[12px] text-on-surface-variant">Logo URL'sini buraya yapıştırın veya boş bırakın.</p>
                </div>
              </div>
            </div>

            <Button type="submit" disabled={isPending} className="w-full h-12 rounded-full bg-accent text-white hover:bg-accent/90 text-[14px] font-semibold mt-4">
              {isPending ? "Güncelleniyor..." : "Ayarları Kaydet"}
            </Button>
          </form>
        </div>

        {/* Security */}
        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-outline-variant shadow-ambient p-6 md:p-8 space-y-5">
            <h3 className="font-heading text-xl font-bold tracking-tight flex items-center gap-3 border-b border-outline-variant pb-4">
              <Lock className="w-5 h-5 text-destructive" /> Güvenlik
            </h3>
            <div className="bg-destructive/5 border border-destructive/15 rounded-xl p-6 space-y-4">
              <h4 className="font-semibold text-[14px] text-destructive">Şifre Değişikliği</h4>
              <form id="password-form" action={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className={labelClass}>Yeni Şifre</label>
                  <input name="password" type="password" required className={inputClass} />
                </div>
                <p className="text-[12px] text-on-surface-variant italic">* Şifreniz en az 6 karakterden oluşmalıdır.</p>
                <Button type="submit" disabled={isPending} className="w-full h-11 rounded-full bg-primary text-white hover:bg-destructive transition-colors text-[13px] font-semibold">
                  {isPending ? "İşleniyor..." : "Şifreyi Güncelle"}
                </Button>
              </form>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-outline-variant shadow-ambient p-6 md:p-8">
            <h4 className="font-semibold text-[14px] text-on-surface mb-3">Hesap Durumu</h4>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[12px] font-semibold text-emerald-600">Aktif Yönetici</span>
            </div>
            <p className="text-[13px] text-on-surface-variant leading-relaxed">
              Takım yönetici yetkileriniz aktiftir. Takım silme veya devretme işlemleri için sistem yöneticisi ile iletişime geçiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
