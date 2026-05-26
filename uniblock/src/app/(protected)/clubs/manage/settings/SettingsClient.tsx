"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, User as UserIcon, Mail, Globe, Camera, Lock } from "lucide-react";
import { updateClubSettings, updateClubPassword } from "@/app/actions/club";
import { toast } from "sonner";

interface SettingsClientProps {
  club: any;
}

export default function SettingsClient({ club }: SettingsClientProps) {
  const [isPending, setIsPending] = useState(false);

  async function handleSettingsSubmit(formData: FormData) {
    setIsPending(true);
    formData.append("clubId", club.id);
    const result = await updateClubSettings(formData);
    if (result.success) {
      toast.success("Ayarlar başarıyla güncellendi!");
    } else {
      toast.error(result.error);
    }
    setIsPending(false);
  }

  async function handlePasswordSubmit(formData: FormData) {
    setIsPending(true);
    formData.append("leaderId", club.leaderId);
    const result = await updateClubPassword(formData);
    if (result.success) {
      toast.success("Şifre başarıyla güncellendi!");
      (document.getElementById("password-form") as HTMLFormElement)?.reset();
    } else {
      toast.error(result.error);
    }
    setIsPending(false);
  }

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="bg-black text-white p-12 border-b-8 border-accent shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <span className="text-[10px] font-black tracking-[0.3em] uppercase text-accent mb-3 block">
          Yönetim Paneli
        </span>
        <h1 className="font-heading text-5xl font-black tracking-tighter uppercase leading-none">
          Ayarlar<span className="text-accent">.</span>
        </h1>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-[11px] mt-4">
          {club.name} — Genel ve Güvenlik Ayarları
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
        {/* General Settings */}
        <div className="space-y-8">
          <div className="border-b-4 border-black pb-4">
            <h3 className="font-heading text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
              <Activity className="w-6 h-6 text-accent" /> Genel Bilgiler
            </h3>
          </div>

          <form action={handleSettingsSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <Activity className="w-3 h-3" /> Kulüp Adı
                </label>
                <input 
                  name="name"
                  defaultValue={club.name}
                  required
                  className="w-full h-12 px-4 rounded-none border-2 border-black focus:ring-accent outline-none font-bold text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <UserIcon className="w-3 h-3" /> Kulüp Başkanı
                </label>
                <input 
                  name="leaderName"
                  defaultValue={club.leader?.name}
                  required
                  className="w-full h-12 px-4 rounded-none border-2 border-black focus:ring-accent outline-none font-bold text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Mail className="w-3 h-3" /> Kulüp Resmi E-postası
              </label>
              <input
                name="contactEmail"
                type="email"
                defaultValue={club.contactEmail || ""}
                placeholder="kulup@universite.edu.tr"
                className="w-full h-12 px-4 rounded-none border-2 border-black focus:ring-accent outline-none font-bold text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Mail className="w-3 h-3" /> Başkan Kişisel E-postası
                <span className="text-red-500">*</span>
              </label>
              <input
                name="presidentEmail"
                type="email"
                defaultValue={club.presidentEmail || ""}
                placeholder="baskan@universite.edu.tr"
                required
                className={`w-full h-12 px-4 rounded-none border-2 focus:ring-accent outline-none font-bold text-sm ${
                  !club.presidentEmail ? "border-orange-400 bg-orange-50" : "border-black"
                }`}
              />
              {!club.presidentEmail && (
                <p className="text-[10px] text-orange-600 font-bold uppercase tracking-wider">
                  Zorunlu — Başkan kişisel e-postası henüz eklenmemiş.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Globe className="w-3 h-3" /> Web Sayfası
              </label>
              <input 
                name="website"
                type="url"
                defaultValue={club.website || ""}
                placeholder="https://kulup.com"
                className="w-full h-12 px-4 rounded-none border-2 border-black focus:ring-accent outline-none font-bold text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Açıklama</label>
              <textarea 
                name="description"
                defaultValue={club.description || ""}
                rows={4}
                className="w-full p-4 rounded-none border-2 border-black focus:ring-accent outline-none font-medium text-sm resize-none"
              />
            </div>

            {/* Logo Section */}
            <div className="space-y-4 pt-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Camera className="w-3 h-3" /> Kulüp Logosu (URL)
              </label>
              <div className="flex gap-4 items-start">
                <div className="w-24 h-24 border-2 border-black bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                  {club.logo ? (
                    <img src={club.logo} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-8 h-8 text-gray-300" />
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <input 
                    name="logo"
                    defaultValue={club.logo || ""}
                    placeholder="https://resim-linki.com/logo.png"
                    className="w-full h-10 px-4 rounded-none border-2 border-black focus:ring-accent outline-none text-xs"
                  />
                  <p className="text-[9px] text-gray-400 font-bold uppercase">Logo URL'sini buraya yapıştırın veya boş bırakın.</p>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isPending}
              className="w-full h-14 rounded-none bg-accent text-white border-2 border-accent hover:bg-black hover:border-black transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 font-black uppercase tracking-[0.2em] text-xs mt-8"
            >
              {isPending ? "GÜNCELLENİYOR..." : "AYARLARI KAYDET"}
            </Button>
          </form>
        </div>

        {/* Security Settings */}
        <div className="space-y-8">
          <div className="border-b-4 border-black pb-4">
            <h3 className="font-heading text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
              <Lock className="w-6 h-6 text-red-500" /> Güvenlik
            </h3>
          </div>

          <div className="bg-red-50/50 border-2 border-red-100 p-8 space-y-6">
            <h4 className="font-bold text-sm uppercase tracking-tight text-red-600">Şifre Değişikliği</h4>
            <form id="password-form" action={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Yeni Şifre</label>
                <input 
                  name="password"
                  type="password"
                  required
                  className="w-full h-12 px-4 rounded-none border-2 border-black focus:ring-black outline-none font-bold text-sm"
                />
              </div>
              <p className="text-[10px] text-gray-500 font-medium italic">
                * Şifreniz en az 6 karakterden oluşmalıdır.
              </p>
              <Button 
                type="submit" 
                disabled={isPending}
                className="w-full h-12 rounded-none bg-black text-white border-2 border-black hover:bg-red-600 hover:border-red-600 transition-all font-bold uppercase tracking-widest text-[10px]"
              >
                {isPending ? "İŞLENİYOR..." : "ŞİFREYİ GÜNCELLE"}
              </Button>
            </form>
          </div>

          <div className="bg-gray-50 border-2 border-gray-200 p-8">
            <h4 className="font-bold text-sm uppercase tracking-tight text-gray-500 mb-2">Hesap Durumu</h4>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-green-600">Aktif Yönetici</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Kulüp yönetici yetkileriniz aktiftir. Kulüp silme veya devretme işlemleri için sistem yöneticisi ile iletişime geçiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
