"use client";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Award, Zap } from "lucide-react";

interface StatsClientProps {
  teamName: string;
  data: {
    monthlyData: any[];
    shares: {
      events: { team: number; others: number };
      participants: { team: number; others: number };
    };
    activeMemberCount: number;
  };
}

// Academic Pulse paleti
const COLORS = ["#005bbf", "#dce9ff", "#9f4200", "#c1c6d6"];
const ACCENT = "#fd6c00";
const PRIMARY = "#005bbf";

export default function StatsClient({ teamName, data }: StatsClientProps) {
  const eventShareData = [
    { name: teamName, value: data.shares.events.team },
    { name: "Diğer Etkinlikler", value: data.shares.events.others },
  ];

  const participantShareData = [
    { name: teamName, value: data.shares.participants.team },
    { name: "Diğer Katılımcılar", value: data.shares.participants.others },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-primary text-white p-8 rounded-xl shadow-ambient">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[11px] font-semibold tracking-wide uppercase text-white/70 mb-1.5 block">Performans Analizi</span>
            <h1 className="font-heading text-3xl font-bold tracking-tight">İstatistikler</h1>
            <p className="text-white/80 text-[14px] mt-2 flex items-center gap-2"><Award className="w-4 h-4" /> {teamName} Yönetim Paneli</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-gutter">
        <Card className="xl:col-span-2 shadow-ambient overflow-hidden p-0">
          <CardHeader className="border-b border-outline-variant bg-surface-container-low p-6">
            <div className="flex items-center justify-between">
              <CardTitle className="font-heading text-lg font-bold tracking-tight flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-accent" /> Aylık Etkinlik Trendi
              </CardTitle>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-accent" />
                  <span className="text-[12px] font-medium text-on-surface-variant">{teamName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-primary" />
                  <span className="text-[12px] font-medium text-on-surface-variant">Genel Toplam</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.monthlyData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={PRIMARY} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={PRIMARY} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorTeam" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={ACCENT} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#c1c6d6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: '#414754' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: '#414754' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #c1c6d6', borderRadius: '12px', color: '#0b1c30', fontFamily: 'inherit', fontSize: '12px', fontWeight: 600, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.06)' }}
                  itemStyle={{ color: '#0b1c30' }}
                />
                <Area type="monotone" dataKey="total" stroke={PRIMARY} strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                <Area type="monotone" dataKey="team" stroke={ACCENT} strokeWidth={3} fillOpacity={1} fill="url(#colorTeam)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-gutter">
          <Card className="shadow-ambient p-0">
            <CardHeader className="p-6 pb-0">
              <CardTitle className="text-[14px] font-bold text-center">Toplam Etkinlik Payı</CardTitle>
            </CardHeader>
            <CardContent className="h-[200px] flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={eventShareData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                    {eventShareData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-4">
                <span className="text-2xl font-bold text-primary">%{(data.shares.events.team / (data.shares.events.team + data.shares.events.others || 1) * 100).toFixed(1)}</span>
                <span className="text-[11px] font-medium text-on-surface-variant">Payınız</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-ambient p-0">
            <CardHeader className="p-6 pb-0">
              <CardTitle className="text-[14px] font-bold text-center">Katılımcı Payı (RSVP)</CardTitle>
            </CardHeader>
            <CardContent className="h-[200px] flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={participantShareData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                    {participantShareData.map((entry, index) => (<Cell key={`cell-${index}`} fill={index === 0 ? ACCENT : COLORS[1]} />))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-4">
                <span className="text-2xl font-bold text-accent">%{(data.shares.participants.team / (data.shares.participants.team + data.shares.participants.others || 1) * 100).toFixed(1)}</span>
                <span className="text-[11px] font-medium text-on-surface-variant">Payınız</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Stats (sıralama/liderlik tablosu YOK) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
        <div className="bg-primary text-white p-6 rounded-xl shadow-ambient">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-[12px] font-semibold">Toplam Etkinlik</span>
          </div>
          <p className="text-3xl font-bold">{data.shares.events.team}</p>
          <p className="text-[12px] text-white/70 mt-2">Takımınızın düzenlediği</p>
        </div>

        <Card className="shadow-ambient">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2 text-on-surface-variant">
              <Users className="w-4 h-4" />
              <span className="text-[12px] font-semibold">Aktif Üyeler</span>
            </div>
            <p className="text-3xl font-bold text-on-surface">{data.activeMemberCount}</p>
            <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-4 overflow-hidden">
              <div className="bg-accent h-full w-[65%] rounded-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
