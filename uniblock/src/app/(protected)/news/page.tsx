import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import NewsClient from "./NewsClient";
import { redirect } from "next/navigation";

export default async function NewsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch real news from database
  const posts = await prisma.post.findMany({
    where: {
      type: "NEWS"
    },
    include: {
      club: true,
      team: true,
      interactions: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return <NewsClient user={user} posts={posts} />;
}
