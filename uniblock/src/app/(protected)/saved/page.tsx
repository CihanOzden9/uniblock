import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import SavedClient from "./SavedClient";

export default async function SavedPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const saves = await prisma.interaction.findMany({
    where: { userId: user.id, type: "SAVE" },
    orderBy: { createdAt: "desc" },
    include: {
      post: { include: { club: true, team: true } },
      event: { include: { organizer: true, team: true } },
    },
  }) as any[];

  const savedPosts = saves.filter(s => s.post).map(s => ({
    id: s.post.id,
    title: s.post.title,
    excerpt: (s.post.content || "").substring(0, 160) + ((s.post.content || "").length > 160 ? "…" : ""),
    source: s.post.club?.name || s.post.team?.name || "Topluluk",
    color: s.post.club?.color || s.post.team?.color || null,
    savedAt: s.createdAt,
  }));

  const savedEvents = saves.filter(s => s.event).map(s => ({
    id: s.event.id,
    title: s.event.title,
    excerpt: (s.event.description || "").substring(0, 160) + ((s.event.description || "").length > 160 ? "…" : ""),
    location: s.event.location,
    date: s.event.date,
    source: s.event.organizer?.name || s.event.team?.name || "Topluluk",
    color: s.event.organizer?.color || s.event.team?.color || null,
    savedAt: s.createdAt,
  }));

  return <SavedClient user={user} savedPosts={savedPosts} savedEvents={savedEvents} />;
}
