"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity, Thermometer, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LiveColdChainChart } from "./cold-chain-chart";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { getAuthUser } from "@/lib/actions/auth";

import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function BankDashboardHome() {
  const user = await getAuthUser();
  const bankId = user.id;

  if (user.internal_role !== "BANK" && user.internal_role !== "BLOOD_BANK") {
    console.log(`[DEBUG] User ${user.id} has role ${user.internal_role}, attempting to access /dashboard/bank`);
    redirect(`/dashboard/${user.internal_role.toLowerCase()}`);
  }

  let chartData: any[] = [];
  let currentTemp = 4.0;

  try {
    // IoT Simulation: Generate a new temp ping upon refresh (between 2.0 and 6.0)
    const temp = Number((Math.random() * (6.0 - 2.0) + 2.0).toFixed(1));
    await db.storageMetric.create({
      data: { bankId, temp }
    });

    const metrics = await db.storageMetric.findMany({
      where: { bankId },
      orderBy: { timestamp: 'desc' },
      take: 15
    });

    chartData = metrics.map((m: any) => ({
      time: m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temp: m.temp
    })).reverse();
  } catch (err) {
    console.error("DB Fetch Error on Bank Dashboard:", err);
  }

  // If new account with no metrics, supply a dummy to prevent chart crash
  if (chartData.length === 0) {
    chartData.push({ time: new Date().toLocaleTimeString(), temp: 4.0 });
  }

  currentTemp = chartData[chartData.length - 1].temp;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
         <h2 className="text-3xl font-bold tracking-tight">Blood Bank Command Center</h2>
         <p className="text-muted-foreground mt-1">Manage network inventories and monitor cold-chain hardware compliance.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current Vault Temp</CardTitle>
            <Thermometer className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentTemp.toFixed(1)}°C</div>
            <p className="text-xs text-muted-foreground mt-1">Live Sensor Output</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Hardware Status</CardTitle>
            <ShieldCheck className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100% Online</div>
            <p className="text-xs text-muted-foreground mt-1">0 Critical Alerts</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            Live Cold Chain Simulator
          </CardTitle>
          <CardDescription>Continuous temperature monitoring of the main blood platelet storage matrices.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full mt-4">
            <LiveColdChainChart data={chartData} />
          </div>
          <div className="flex justify-center mt-4 gap-4 text-sm font-medium">
             <Badge variant="outline" className="border-blue-500/20 text-blue-600 dark:text-blue-400 bg-blue-500/10">Threshold Max: 6.0°C</Badge>
             <Badge variant="outline" className="border-blue-500/20 text-blue-600 dark:text-blue-400 bg-blue-500/10">Threshold Min: 2.0°C</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
