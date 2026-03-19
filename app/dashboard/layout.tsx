import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  // Fetch the synced user from DB
  const user = await db.user.findUnique({ where: { clerkId: userId } });
  
  if (!user) {
    redirect("/onboarding");
  }

  const role = user.internal_role;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar role={role} />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
