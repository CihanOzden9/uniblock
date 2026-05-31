import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import EventsClient from "./EventsClient";
import { redirect } from "next/navigation";

export default async function EventsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Kullanıcının katıldığı (RSVP) etkinlikler
  const userEvents = await prisma.interaction.findMany({
    where: {
      userId: user.id,
      type: "RSVP"
    },
    include: {
      event: {
        include: {
          organizer: true,
          team: true
        }
      }
    }
  });

  const myEvents = userEvents
    .filter(i => i.event)
    .map(i => ({
      id: i.event!.id,
      title: i.event!.title,
      date: i.event!.date,
      location: i.event!.location,
      club: i.event!.organizer || i.event!.team,
      points: 100
    }));

  // Takvim için tüm aktif (iptal edilmemiş) etkinlikler
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const allEventsRaw = await prisma.event.findMany({
    where: { cancelled: false },
    orderBy: { date: "asc" },
    include: { organizer: true, team: true }
  });

  const calendarEvents = allEventsRaw.map(e => ({
    id: e.id,
    title: e.title,
    date: e.date,
    location: e.location,
    source: e.organizer?.name || e.team?.name || "Kampüs"
  }));

  // Üyelikler
  const memberships = await prisma.clubMember.findMany({
    where: { userId: user.id },
    include: { club: true }
  });

  return (
    <EventsClient
      user={user}
      myEvents={myEvents}
      calendarEvents={calendarEvents}
      memberships={memberships}
    />
  );
}
