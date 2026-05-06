"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend,
  AreaChart,
  Area
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Calendar, Award, Target, Zap } from "lucide-react";

interface StatsClientProps {
  clubName: string;
  data: {
    monthlyData: any[];
    shares: {
      events: { club: number; others: number };
      participants: { club: number; others: number };
    };
    leaderboard: any[];
    activeMemberCount: number;
  };
}

const COLORS = ["#FF3B30", "#000000", "#8E8E93", "#E5E5EA"];

export default function StatsClient({ clubName, data }: StatsClientProps) {
  const eventShareData = [
    { name: clubName, value: data.shares.events.club },
    { name: "Diğer Kulüpler", value: data.shares.events.others },
  ];

  const participantShareData = [
    { name: clubName, value: data.shares.participants.club },
    { name: "Diğer Kulüpler", value: data.shares.participants.others },
  ];

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Header */}
      <div className="bg-black text-white p-12 border-b-8 border-accent shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-accent mb-3 block">
              Performans Analizi
            </span>
            <h1 className="font-heading text-5xl font-black tracking-tighter uppercase leading-none">
              İstatistikler<span className="text-accent">.</span>
            </h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[11px] mt-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-accent" /> {clubName} Yönetim Paneli
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/10 p-4 border border-white/20 min-w-[120px]">
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-1">Genel Skor</span>
              <span className="text-3xl font-black text-accent">84.2</span>
            </div>
            <div className="bg-accent p-4 min-w-[120px] shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
              <span className="text-[9px] font-black uppercase tracking-widest text-white/80 block mb-1">Sıralama</span>
              <span className="text-3xl font-black text-white">#03</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid for Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Main Monthly Activity Chart */}
        <Card className="xl:col-span-2 rounded-none border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden">
          <CardHeader className="border-b-2 border-black bg-gray-50 p-6">
            <div className="flex items-center justify-between">
              <CardTitle className="font-heading text-xl font-black uppercase tracking-tight flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-accent" /> Aylık Etkinlik Trendi
              </CardTitle>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-accent"></div>
                  <span className="text-[10px] font-bold uppercase">{clubName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-black"></div>
                  <span className="text-[10px] font-bold uppercase">Genel Toplam</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.monthlyData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000000" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorClub" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF3B30" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FF3B30" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5EA" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#8E8E93' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#8E8E93' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#000', 
                    border: 'none', 
                    borderRadius: '0',
                    color: '#fff',
                    fontFamily: 'inherit',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#000" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorTotal)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="club" 
                  stroke="#FF3B30" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorClub)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Share Distribution */}
        <div className="flex flex-col gap-8">
          {/* Event Share Pie */}
          <Card className="rounded-none border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white h-1/2">
            <CardHeader className="p-6 pb-0">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-center">Toplam Etkinlik Payı</CardTitle>
            </CardHeader>
            <CardContent className="h-[200px] flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={eventShareData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {eventShareData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-4">
                <span className="text-2xl font-black">%{(data.shares.events.club / (data.shares.events.club + data.shares.events.others || 1) * 100).toFixed(1)}</span>
                <span className="text-[8px] font-bold text-gray-400 uppercase">PAYINIZ</span>
              </div>
            </CardContent>
          </Card>

          {/* Participant Share Pie */}
          <Card className="rounded-none border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white h-1/2">
            <CardHeader className="p-6 pb-0">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-center">Katılımcı Payı (RSVP)</CardTitle>
            </CardHeader>
            <CardContent className="h-[200px] flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={participantShareData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {participantShareData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-4">
                <span className="text-2xl font-black text-accent">%{(data.shares.participants.club / (data.shares.participants.club + data.shares.participants.others || 1) * 100).toFixed(1)}</span>
                <span className="text-[8px] font-bold text-gray-400 uppercase">PAYINIZ</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Leaderboard and Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Quick Stats Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-black text-white p-6 border-l-8 border-accent">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-[10px] font-black uppercase tracking-widest">Etkileşim Hızı</span>
            </div>
            <p className="text-3xl font-black">+12.4%</p>
            <p className="text-[9px] text-gray-400 mt-2 font-bold uppercase">GEÇEN AYDAN BU YANA</p>
          </div>
          
          <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-3 mb-2 text-gray-400">
              <Users className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Aktif Üyeler</span>
            </div>
            <p className="text-3xl font-black">{data.activeMemberCount}</p>
            <div className="w-full bg-gray-100 h-1 mt-4 overflow-hidden">
              <div className="bg-accent h-full w-[65%]"></div>
            </div>
          </div>
        </div>

        {/* Leaderboard Column */}
        <Card className="lg:col-span-3 rounded-none border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
          <CardHeader className="border-b-2 border-black p-6">
            <CardTitle className="font-heading text-xl font-black uppercase tracking-tight flex items-center gap-3">
              <Target className="w-6 h-6 text-accent" /> Kulüp Karşılaştırması
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-black">
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Sıra</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Kulüp</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">Etkinlik</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">Üye Sayısı</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Durum</th>
                </tr>
              </thead>
              <tbody>
                {data.leaderboard.map((club, index) => (
                  <tr 
                    key={club.name} 
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${club.isCurrent ? "bg-accent/5" : ""}`}
                  >
                    <td className="p-4 font-black text-sm">#{String(index + 1).padStart(2, '0')}</td>
                    <td className="p-4">
                      <span className={`font-bold text-sm ${club.isCurrent ? "text-accent" : "text-black"}`}>
                        {club.name}
                        {club.isCurrent && <span className="ml-2 text-[8px] bg-accent text-white px-1.5 py-0.5">SİZ</span>}
                      </span>
                    </td>
                    <td className="p-4 text-center font-bold text-sm">{club.events}</td>
                    <td className="p-4 text-center font-bold text-sm">{club.members}</td>
                    <td className="p-4 text-right">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-none border text-[9px] font-black uppercase ${index < 3 ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-500 border-gray-200"}`}>
                        {index < 3 ? "Yükselişte" : "Sabit"}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
