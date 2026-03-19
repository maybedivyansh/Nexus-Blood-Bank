import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { getAuthUser } from "@/lib/actions/auth";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Package, Clock, Truck, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TrackOrdersPage() {
  const user = await getAuthUser();
  const hospitalId = user.id;

  const orders = await db.order.findMany({
    where: { hospitalId },
    include: {
      bank: { select: { name: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-left-4 duration-700">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Order Tracking</h2>
        <p className="text-muted-foreground mt-1">Real-time status updates for your hospital's critical requests.</p>
      </div>

      <div className="grid gap-6">
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-xl border border-dashed">
            <Package className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-bold">No active orders</h3>
            <p className="text-muted-foreground">Submit a blood request to see tracking data here.</p>
          </div>
        ) : (
          orders.map((order) => {
            const isApproved = order.status === "APPROVED";
            const isPending = order.status === "PENDING";

            return (
              <Card key={order.id} className={`overflow-hidden transition-all ${isPending ? 'border-amber-500/50 shadow-md shadow-amber-500/5' : 'border-border'}`}>
                {isPending && <div className="h-1 w-full bg-amber-500 animate-pulse" />}
                {isApproved && <div className="h-1 w-full bg-green-500" />}
                
                <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                       Order <span className="font-mono text-muted-foreground text-sm">#{order.id.slice(0, 8)}</span>
                    </CardTitle>
                    <CardDescription className="mt-1">From: {order.bank.name}</CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-base py-1 px-3 bg-background shadow-sm text-foreground">
                      {order.units}x {order.bloodType}
                    </Badge>
                    {isPending && <Badge variant="secondary" className="bg-amber-500/20 text-amber-600 dark:text-amber-400 py-1.5 px-3"><Clock className="w-3 h-3 mr-1.5 animate-spin-slow" /> Awaiting Approval</Badge>}
                    {isApproved && <Badge variant="default" className="bg-green-600 hover:bg-green-700 py-1.5 px-3"><CheckCircle2 className="w-3 h-3 mr-1.5" /> Approved & In Transit</Badge>}
                  </div>
                </CardHeader>
                <CardContent>
                   <div className="relative pt-8 pb-4">
                      {/* Timeline Graph */}
                      <div className="absolute top-10 left-8 right-8 h-0.5 bg-muted-foreground/20 rounded-full z-0" />
                      {isApproved && <div className="absolute top-10 left-8 right-1/2 h-0.5 bg-green-500 rounded-full z-10 animate-in slide-in-from-left duration-1000 fill-mode-both" />}
                      
                      <div className="relative z-20 flex justify-between px-4 sm:px-8">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white ring-4 ring-background"><CheckCircle2 className="w-3 h-3" /></div>
                          <span className="text-xs font-medium text-foreground text-center">Placed<br/><span className="text-[10px] text-muted-foreground">{order.createdAt.toLocaleDateString()}</span></span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-background transition-colors ${isApproved ? 'bg-green-500 text-white' : 'bg-muted border-2 border-muted-foreground text-transparent'}`}>{isApproved && <Truck className="w-3 h-3" />}</div>
                          <span className={`text-xs font-medium text-center ${isApproved ? 'text-foreground' : 'text-muted-foreground'}`}>Verified &<br/>In Transit</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 relative">
                          <div className={`w-5 h-5 rounded-full bg-muted border-2 border-muted-foreground ring-4 ring-background`} />
                          <span className="text-xs font-medium text-muted-foreground text-center">Delivered<br/><span className="text-[10px] text-muted-foreground">Pending fulfillment</span></span>
                        </div>
                      </div>
                   </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  );
}
