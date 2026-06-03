import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import CommunityDetail, { CommunityDetailData } from "@/components/shared/CommunityDetail";

export default async function TeamDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const team = await prisma.team.findUnique({
    where: { slug },
    include: {
      leader: { select: { id: true, name: true, department: true, image: true } },
      members: {
        where: { OR: [{ userId: user.id }, { status: "APPROVED" }] },
        include: { user: { select: { name: true, department: true, image: true } } },
      },
      events: { orderBy: { date: "asc" } },
      posts: { orderBy: { createdAt: "desc" }, take: 5, select: { id: true, title: true, content: true, createdAt: true } },
      _count: { select: { followers: true } },
    },
  }) as any;

  if (!team) notFound();

  const now = new Date();
  const activeEvents = team.events.filter((e: any) => !e.cancelled);
  const upcomingEvents = activeEvents.filter((e: any) => new Date(e.date) >= now);
  const pastEvents = activeEvents.filter((e: any) => new Date(e.date) < now).reverse();

  const board = team.members
    .filter((m: any) => m.status === "APPROVED" && m.role !== "MEMBER" && m.userId !== team.leaderId)
    .map((m: any) => ({ name: m.user.name, department: m.user.department, image: m.user.image, role: m.role }));

  const myMembership = team.members.find((m: any) => m.userId === user.id);
  const myFollow = await prisma.follow.findUnique({
    where: { userId_teamId: { userId: user.id, teamId: team.id } },
    select: { id: true },
  });

  const data: CommunityDetailData = {
    entity: "team",
    id: team.id,
    name: team.name,
    description: team.description,
    color: team.color,
    website: team.website,
    contactEmail: team.contactEmail,
    instagram: team.instagram,
    twitter: team.twitter,
    linkedin: team.linkedin,
    createdAt: team.createdAt,
    memberCount: team._count.followers,
    leader: { name: team.leader.name, department: team.leader.department, image: team.leader.image },
    board,
    upcomingEvents,
    pastEvents,
    posts: team.posts,
  };

  return (
    <CommunityDetail
      data={data}
      user={user}
      membershipStatus={myMembership?.status ?? null}
      isLeader={team.leaderId === user.id}
      isFollowing={!!myFollow}
    />
  );
}
