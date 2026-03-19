import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle, Clock, CheckCircle2, TrendingUp } from "lucide-react";

import { getAuthUser } from "@/lib/actions/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function HospitalDashboard() {
  const user = await getAuthUser();

  if (user.internal_role !== "HOSPITAL") {
    console.log(`[DEBUG] User ${user.id} has role ${user.internal_role}, attempting to access /dashboard/hospital`);
    redirect(`/dashboard/${user.internal_role.toLowerCase()}`);
  }

  let activeOrders: any[] = [];
  let criticalStocks: any[] = [];
  let totalApproved = 0;

  try {
    activeOrders = await db.order.findMany({
      where: { hospitalId: user.id, status: "PENDING" },
      include: { bank: { select: { name: true } } },
      orderBy: { id: "desc" },
      take: 5
    });

    criticalStocks = await db.inventory.findMany({
      where: { units: { lt: 10 } },
      include: { bank: { select: { name: true } } },
      take: 4
    });

    totalApproved = await db.order.count({ where: { hospitalId: user.id, status: "APPROVED" } });
  } catch (err) {
    console.error("DB Fetch Error on Hospital Dashboard:", err);
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Hospital Portal</h2>
        <p className="text-muted-foreground mt-1">Monitor critical stocks, active orders, and monthly usage metrics.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOrders.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting Bank Approval</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-destructive">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Critical Bank Stocks</CardTitle>
            <AlertCircle className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criticalStocks.length}</div>
            <p className="text-xs text-muted-foreground mt-1">&lt; 10 units nearby</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Supplied</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApproved}</div>
            <p className="text-xs text-muted-foreground mt-1">Orders successfully fulfilled</p>
          </CardContent>
        </Card>
      </div>

      {/* Tables Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Active Pending Orders</CardTitle>
            <CardDescription>Real-time lifecycle of your recent blood requests.</CardDescription>
          </CardHeader>
          <CardContent>
            {activeOrders.length === 0 ? (
              <p className="text-muted-foreground text-sm">No pending requests at the moment.</p>
            ) : (
              <div className="space-y-4">
                {activeOrders.map(order => (
                  <div key={order.id} className="flex justify-between items-center p-3 border rounded-lg bg-muted/20">
                    <div>
                      <p className="font-semibold text-primary">{order.units}x {order.bloodType}</p>
                      <p className="text-xs text-muted-foreground">To: {order.bank.name}</p>
                    </div>
                    <div className="text-amber-500 bg-amber-500/10 px-3 py-1 text-xs font-bold rounded-full animate-pulse">
                      PENDING
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Critical Stocks Nearby</CardTitle>
            <CardDescription>Live deficit alerts from connected Blood Banks.</CardDescription>
          </CardHeader>
          <CardContent>
             {criticalStocks.length === 0 ? (
              <p className="text-muted-foreground text-sm">All banks have healthy inventories.</p>
            ) : (
              <div className="space-y-4">
                {criticalStocks.map(stock => (
                  <div key={stock.id} className="flex justify-between items-center p-3 border rounded-lg border-destructive/20 bg-destructive/5 cursor-pointer hover:bg-destructive/10 transition-colors">
                    <div>
                      <p className="font-semibold">{stock.bank.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Expires soon or low tier levels</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-destructive">{stock.units} <span className="text-xs items-center font-normal">units</span></p>
                      <p className="text-xs font-bold bg-destructive/10 text-destructive px-2 py-0.5 rounded-sm inline-block">{stock.bloodType}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
