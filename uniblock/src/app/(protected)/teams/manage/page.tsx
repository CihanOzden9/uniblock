import { getCurrentUser } from "@/lib/session";
import TeamDashboardClient from "@/app/(protected)/teams/manage/TeamDashboardClient";
import { prisma } from "@/lib/prisma";
import { Clock, X, AlertTriangle } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function TeamManagePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const userTeam = user.ledTeams[0];

  if (!userTeam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-heading font-bold text-xl uppercase tracking-widest text-red-500">
        Yetkiniz yok veya yönettiğiniz bir takım bulunamadı.
      </div>
    );
  }

  // @ts-ignore - status field exists in DB but might not be in generated types yet
  if (userTeam.status === "PENDING") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8 text-center">
        <div className="w-16 h-16 bg-orange-500/10 flex items-center justify-center mb-6">
          <Clock className="w-8 h-8 text-orange-500" />
        </div>
        <h1 className="text-2xl font-heading font-extrabold text-black uppercase tracking-tight mb-2">Takım Başvurusu İnceleniyor</h1>
        <p className="text-gray-500 max-w-md mx-auto">
          "{userTeam.name}" takımı için yaptığınız başvuru yönetici onayında bekliyor. Onaylandığında buradan takımınızı yönetmeye başlayabilirsiniz.
        </p>
      </div>
    );
  }

  // @ts-ignore
  if (userTeam.status === "REJECTED") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8 text-center">
        <div className="w-16 h-16 bg-red-500/10 flex items-center justify-center mb-6">
          <X className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-heading font-extrabold text-black uppercase tracking-tight mb-2">Başvuru Reddedildi</h1>
        <p className="text-gray-500 max-w-md mx-auto">
          Takım başvurunuz maalesef reddedildi. Daha fazla bilgi için sistem yöneticisiyle iletişime geçebilirsiniz.
        </p>
      </div>
    );
  }

  const teamId = user.ledTeams[0].id;
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: {
      members: {
        include: {
          user: true
        }
      },
      posts: {
        orderBy: { createdAt: 'desc' },
        take: 10
      },
      events: {
        orderBy: { date: "asc" },
        include: {
          _count: { select: { interactions: { where: { type: "RSVP" } } } }
        }
      },
      surveys: {
        include: {
          options: true
        },
        orderBy: { createdAt: 'desc' }
      },
      leader: true
    }
  });

  if (!team) return <div>Takım bulunamadı.</div>;

  // Takımın anket etkileşimlerini ayrıca çekiyoruz
  const surveyInteractions = await (prisma.interaction as any).findMany({
    where: {
      surveyId: { in: team.surveys.map(s => s.id) },
      type: "VOTE"
    },
    select: { surveyId: true, optionId: true }
  }) as any[];

  // Takımın postlarındaki şikayetleri çekiyoruz
  const reports = await (prisma as any).report.findMany({
    where: {
      interaction: {
        postId: { in: team.posts.map(p => p.id) }
      }
    },
    include: {
      reporter: { select: { name: true } },
      interaction: {
        include: {
          user: { select: { name: true } },
          post: { select: { title: true } }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  }) as any[];

  // Takım verisine etkileşimleri ekliyoruz
  const enhancedTeam = {
    ...team,
    surveys: team.surveys.map(s => ({
      ...s,
      interactions: surveyInteractions.filter(i => i.surveyId === s.id)
    })),
    reports: reports
  };

  const missingPresidentEmail = !team.presidentEmail;

  return (
    <>
      {missingPresidentEmail && (
        <div className="bg-orange-500 text-white px-6 py-3 flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span className="text-sm font-semibold flex-1">
            Kaptan kişisel e-posta adresi eksik — takım yönetimi için zorunludur.
          </span>
          <Link
            href="/teams/manage/settings"
            className="text-sm font-black uppercase tracking-wider underline underline-offset-2 hover:text-orange-100 transition-colors shrink-0"
          >
            Ayarlara Git →
          </Link>
        </div>
      )}
      <TeamDashboardClient team={enhancedTeam} />
    </>
  );
}
