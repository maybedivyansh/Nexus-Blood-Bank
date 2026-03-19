import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { getAuthUser } from "@/lib/actions/auth";
import { approveAndShipOrder } from "@/lib/actions/orders";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, PackageSearch, Hospital } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BankOrdersManagement() {
  const user = await getAuthUser();
  const bankId = user.id;

  const pendingOrders = await db.order.findMany({
    where: { bankId, status: "PENDING" },
    include: {
      hospital: { select: { name: true } }
    },
    orderBy: { createdAt: "asc" }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Demand Queue</h2>
        <p className="text-muted-foreground mt-1">Review active hospital requests and execute secure supply transactions.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Left pane: Incoming Requests */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2"><PackageSearch className="text-amber-500" /> Incoming Demands</h3>
          {pendingOrders.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center text-muted-foreground">
                No active hospital demands targeting your vault.
              </CardContent>
            </Card>
          ) : (
             pendingOrders.map(order => {
               // Next JS Server actions closure binding trick
               const shipAction = approveAndShipOrder.bind(null, order.id);

               return (
                 <Card key={order.id} className="border-amber-500/50 shadow-sm">
                   <CardContent className="p-6">
                     <div className="flex justify-between flex-wrap gap-4">
                       <div className="space-y-1">
                         <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-600 mb-2">Awaiting Fulfillment</Badge>
                         <p className="text-2xl font-black text-foreground">{order.units}x {order.bloodType}</p>
                         <p className="text-sm text-muted-foreground font-medium flex items-center gap-1.5"><Hospital className="w-4 h-4" /> {order.hospital.name}</p>
                       </div>
                       
                       {/* Right side form */}
                       <div className="flex flex-col justify-end">
                         <form action={shipAction}>
                           <Button type="submit" size="lg" className="gap-2 bg-primary dark:text-white font-bold w-full shadow-lg hover:-translate-y-0.5 transition-transform">
                             <CheckCircle2 className="w-5 h-5" /> Verify & Ship
                           </Button>
                         </form>
                       </div>
                     </div>
                   </CardContent>
                 </Card>
               )
             })
          )}
        </div>

        {/* Right pane: Educational / Policy split pane visual */}
        <div className="sticky top-24">
          <Card className="bg-muted/50 border-none">
            <CardHeader>
              <CardTitle>Nexus Verification Policy</CardTitle>
              <CardDescription>Automated inventory deductions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                Clicking <strong>Verify & Ship</strong> initiates an atomic Prisma Transaction within the database. 
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Your local vault inventory for that specific blood group is immediately decremented by the requested units.</li>
                <li>The order status transitions mathematically to <Badge className="mx-1 h-5 text-[10px]" variant="default">APPROVED</Badge>.</li>
                <li>The hospital's real-time tracker reflects the transition instantly.</li>
              </ul>
              <div className="bg-amber-500/10 text-amber-700 dark:text-amber-400 p-3 mt-4 rounded-md">
                <strong>Attention:</strong> If an order exceeds your current vault metrics, the transaction will automatically revert to protect data integrity.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
