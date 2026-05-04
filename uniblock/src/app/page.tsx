import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import LandingClient from "@/components/layout/LandingClient";

export default async function Page() {
  const user = await getCurrentUser();

  // If user is logged in, redirect them to the feed (student home)
  if (user) {
    if (user.role === "SUPER_ADMIN" || user.role === "CLUB_ADMIN") {
      redirect("/clubs/manage");
    } else {
      redirect("/feed");
    }
  }

  // If not logged in, show the landing page
  return <LandingClient />;
}
