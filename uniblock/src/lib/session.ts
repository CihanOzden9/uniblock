import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

/**
 * Returns the currently logged in user based on the auth_token cookie.
 * For now, if no token is found, it returns a demo user to prevent breaking the flow.
 */
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  // In a real app, you would verify the JWT/Token here
  // For now, we simulate the logged-in user
  const email = token ? (token === "demo_admin" ? "mert@uniblock.com" : "ahmet@uniblock.com") : "mert@uniblock.com";

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      ledClubs: true,
      clubMemberships: {
        include: {
          club: true
        }
      }
    }
  });

  return user;
}
