import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardDispatcher() {
  const { userId } = auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const user = await db.user.findUnique({ where: { clerkId: userId } });
  
  // If the user hasn't completed their DB profile, send them to onboarding
  if (!user) {
    redirect("/onboarding");
  }

  const role = user.internal_role.toLowerCase();
  
  // Dispatch to the correct role-based dashboard route securely
  redirect(`/dashboard/${role}`);
}
