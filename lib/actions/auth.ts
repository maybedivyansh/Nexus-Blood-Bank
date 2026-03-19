"use server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export async function getAuthUser() {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  
  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) redirect("/onboarding");
  
  return user;
}
