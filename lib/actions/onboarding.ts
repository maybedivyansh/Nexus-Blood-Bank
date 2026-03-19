"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export async function completeOnboarding(formData: FormData) {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const userRole = formData.get("role") as string;
  const name = formData.get("name") as string;

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress || `${userId}@placeholder.com`;

  try {
    // Create SQLite User mapped strictly to Clerk Auth
    await db.user.create({
      data: {
        clerkId: userId,
        email,
        name,
        internal_role: userRole,
      }
    });
  } catch (err: any) {
    console.error("[ONBOARDING ERROR]", err);
    // If it's a unique constraint collision (e.g., they deleted their Clerk account to restart, but their email is still orphaned in the Postgres DB)
    if (err.code === "P2002") {
      console.log("Collision detected, attempting to link legacy database record to new Clerk ID...");
      await db.user.update({
        where: { email },
        data: {
          clerkId: userId, // Reassign to their newly minted Clerk session ID
          name,
          internal_role: userRole,
        }
      });
    } else {
      throw err;
    }
  }

  redirect(`/dashboard/${userRole.toLowerCase()}`);
}
