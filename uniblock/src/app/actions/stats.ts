import { prisma } from "@/lib/prisma";

export async function getStatsData(clubId: string) {
  try {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    // 1. Monthly Events (Total vs Club)
    const allEvents = await prisma.event.findMany({
      where: {
        date: { gte: sixMonthsAgo }
      },
      select: {
        date: true,
        organizerId: true
      }
    });

    const months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
    const monthlyData = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = months[d.getMonth()];
      const monthYear = d.getFullYear();

      const totalInMonth = allEvents.filter(e =>
        e.date.getMonth() === d.getMonth() && e.date.getFullYear() === d.getFullYear()
      ).length;

      const clubInMonth = allEvents.filter(e =>
        e.organizerId === clubId &&
        e.date.getMonth() === d.getMonth() && e.date.getFullYear() === d.getFullYear()
      ).length;

      monthlyData.push({
        name: monthLabel,
        total: totalInMonth,
        club: clubInMonth
      });
    }

    // 2. Share of Events
    const totalEventsCount = await prisma.event.count();
    const clubEventsCount = await prisma.event.count({
      where: { organizerId: clubId }
    });

    // 3. Share of Participants (RSVP)
    const totalRSVPs = await prisma.interaction.count({
      where: { type: "RSVP" }
    });
    const clubRSVPs = await prisma.interaction.count({
      where: {
        type: "RSVP",
        event: { organizerId: clubId }
      }
    });

    // 4. Comparison with other clubs (Leaderboard data)
    const clubs = await prisma.club.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            events: true,
            members: true
          }
        }
      },
      orderBy: {
        performanceScore: 'desc'
      },
      take: 5
    });

    return {
      success: true,
      data: {
        monthlyData,
        shares: {
          events: {
            club: clubEventsCount,
            others: Math.max(0, totalEventsCount - clubEventsCount)
          },
          participants: {
            club: clubRSVPs,
            others: Math.max(0, totalRSVPs - clubRSVPs)
          }
        },
        leaderboard: clubs.map(c => ({
          name: c.name,
          events: c._count.events,
          members: c._count.members,
          isCurrent: c.id === clubId
        }))
      }
    };
  } catch (error) {
    console.error("Stats Error:", error);
    return { success: false, error: "İstatistikler yüklenirken bir hata oluştu." };
  }
}
