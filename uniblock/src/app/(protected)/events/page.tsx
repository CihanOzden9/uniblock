import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import EventsClient from "./EventsClient";
import { redirect } from "next/navigation";

export default async function EventsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch real events for the user
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

  // Map interactions to simple event objects
  const events = userEvents.map(i => ({
    id: i.event?.id,
    title: i.event?.title,
    date: i.event?.date,
    club: i.event?.organizer || i.event?.team,
    points: 100 // Default points for participation
  }));

  // Fetch memberships
  const memberships = await prisma.clubMember.findMany({
    where: {
      userId: user.id
    },
    include: {
      club: true
    }
  });

  return <EventsClient user={user} events={events} memberships={memberships} />;
}
