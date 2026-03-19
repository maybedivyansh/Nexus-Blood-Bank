import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Droplet, Activity, Building2, ShieldCheck, HeartPulse } from "lucide-react";
import { db } from "@/lib/db";

// Force dynamic so we get real-time stats
export const dynamic = "force-dynamic";

export default async function Home() {
  // Query total units delivered
  const totalDelivered = await db.order.aggregate({
    where: { status: "APPROVED" },
    _sum: { units: true }
  });

  const unitsCount = totalDelivered._sum.units || 0;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <Droplet className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight">NexusBlood</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/sign-in" className="text-sm font-medium hover:text-primary transition-colors">
            Sign In
          </Link>
          <Link href="/sign-up">
            <Button variant="outline">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-secondary/20">
        <div className="max-w-4xl mx-auto space-y-8">
          <Badge className="mx-auto" variant="secondary">
            <HeartPulse className="w-4 h-4 mr-2 text-primary" />
            Empowering Life-Saving Connections
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-balance">
            The Modern Blood <br /> <span className="text-primary">Management Cloud</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-muted-foreground text-balance">
            Connecting hospitals to critical blood inventories in real-time. Fast fulfillment, transparent tracking, and impact-driven donation campaigns.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/sign-up" className="w-full sm:w-auto">
              <Button size="lg" className="gap-2 w-full">
                <HeartPulse className="h-5 w-5" /> Donate Blood
              </Button>
            </Link>
            <Link href="/sign-up" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="gap-2 w-full">
                <Building2 className="h-5 w-5 text-muted-foreground" /> Hospital Portal
              </Button>
            </Link>
            <Link href="/sign-up" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="gap-2 w-full">
                <ShieldCheck className="h-5 w-5 text-muted-foreground" /> Blood Bank Login
              </Button>
            </Link>
          </div>

          <div className="pt-16 pb-8 border-t mt-12 w-full">
            <div className="inline-flex flex-col items-center justify-center p-6 bg-card rounded-2xl shadow-sm border border-primary/10">
              <Activity className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-4xl font-black text-foreground">{unitsCount.toLocaleString()}</h3>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mt-1">Total Units Delivered</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
