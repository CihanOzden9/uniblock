import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import CommunityDetail, { CommunityDetailData } from "@/components/shared/CommunityDetail";

export default async function ClubDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const club = await prisma.club.findUnique({
    where: { slug },
    include: {
      leader: { select: { id: true, name: true, department: true, image: true } },
      members: {
        where: { OR: [{ userId: user.id }, { status: "APPROVED" }] },
        include: { user: { select: { name: true, department: true, image: true } } },
      },
      events: { orderBy: { date: "asc" } },
      posts: { orderBy: { createdAt: "desc" }, take: 5, select: { id: true, title: true, content: true, createdAt: true } },
      _count: { select: { members: { where: { status: "APPROVED" } } } },
    },
  }) as any;

  if (!club) notFound();

  const now = new Date();
  const activeEvents = club.events.filter((e: any) => !e.cancelled);
  const upcomingEvents = activeEvents.filter((e: any) => new Date(e.date) >= now);
  const pastEvents = activeEvents.filter((e: any) => new Date(e.date) < now).reverse();

  const board = club.members
    .filter((m: any) => m.status === "APPROVED" && m.role !== "MEMBER" && m.userId !== club.leaderId)
    .map((m: any) => ({ name: m.user.name, department: m.user.department, image: m.user.image, role: m.role }));

  const myMembership = club.members.find((m: any) => m.userId === user.id);

  const data: CommunityDetailData = {
    entity: "club",
    id: club.id,
    name: club.name,
    description: club.description,
    color: club.color,
    website: club.website,
    contactEmail: club.contactEmail,
    instagram: club.instagram,
    twitter: club.twitter,
    linkedin: club.linkedin,
    createdAt: club.createdAt,
    memberCount: club._count.members,
    leader: { name: club.leader.name, department: club.leader.department, image: club.leader.image },
    board,
    upcomingEvents,
    pastEvents,
    posts: club.posts,
  };

  return (
    <CommunityDetail
      data={data}
      user={user}
      membershipStatus={myMembership?.status ?? null}
      isLeader={club.leaderId === user.id}
    />
  );
}
