import { db } from "@/lib/db";
import { createOrder } from "@/lib/actions/orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Search, ArrowRight, MapPin } from "lucide-react";
import { cookies } from "next/headers";
import { getAuthUser } from "@/lib/actions/auth";
import { calculateDistance } from "@/lib/distance";

export const dynamic = "force-dynamic";

export default async function RequestBloodPage({
  searchParams,
}: {
  searchParams: { bg?: string; units?: string };
}) {
  const bgParam = searchParams.bg || "";
  const unitsParam = parseInt(searchParams.units || "0", 10);

  let matchedBanks: any[] = [];
  let searched = false;

  if (bgParam && unitsParam > 0) {
    searched = true;
    
    // Auth context (strict role enforcement via DB)
    const hospital = await getAuthUser();
    const hospitalId = hospital.id;
    
    // Default to NYC coordinates if missing
    const hLat = hospital?.latitude || 40.7128;
    const hLon = hospital?.longitude || -74.0060;

    const rawMatchedBanks = await db.inventory.findMany({
      where: {
        bloodType: bgParam,
        units: { gte: unitsParam }
      },
      include: {
        bank: { select: { id: true, name: true, latitude: true, longitude: true } }
      }
    });

    matchedBanks = rawMatchedBanks.map((inv: any) => {
      const bLat = inv.bank.latitude || (40.7128 + (Math.random() * 0.1 - 0.05));
      const bLon = inv.bank.longitude || (-74.0060 + (Math.random() * 0.1 - 0.05));
      const distance = calculateDistance(hLat, hLon, bLat, bLon);
      return { ...inv, distance };
    }).sort((a: any, b: any) => a.distance - b.distance);
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Request Blood Stocks</h2>
        <p className="text-muted-foreground mt-1">Search the centralized network for instantly available units.</p>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle>Network Search</CardTitle>
        </CardHeader>
        <CardContent>
          <form method="GET" action="/dashboard/hospital/request" className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="space-y-2 w-full sm:w-1/3">
              <Label htmlFor="bg">Blood Group</Label>
              <select id="bg" name="bg" defaultValue={bgParam} required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option value="" disabled>Select Type...</option>
                <option value="O+">O Positive (O+)</option>
                <option value="O-">O Negative (O-)</option>
                <option value="A+">A Positive (A+)</option>
                <option value="A-">A Negative (A-)</option>
                <option value="B+">B Positive (B+)</option>
                <option value="B-">B Negative (B-)</option>
                <option value="AB+">AB Positive (AB+)</option>
                <option value="AB-">AB Negative (AB-)</option>
              </select>
            </div>
            <div className="space-y-2 w-full sm:w-1/3">
              <Label htmlFor="units">Required Units</Label>
              <Input id="units" name="units" type="number" min="1" defaultValue={unitsParam || ""} required placeholder="e.g. 5" />
            </div>
            <Button type="submit" className="w-full sm:w-1/3 gap-2">
              <Search className="h-4 w-4" /> Search Availability
            </Button>
          </form>
        </CardContent>
      </Card>

      {searched && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Matched Blood Banks</h3>
          {matchedBanks.length === 0 ? (
            <div className="p-8 text-center border rounded-lg bg-card text-muted-foreground">
              No local banks currently have {unitsParam} units of {bgParam} available.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {matchedBanks.map((inv) => (
                <Card key={inv.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex flex-col gap-1">
                      <div className="flex items-center gap-2"><Building2 className="h-5 w-5 text-primary" /> {inv.bank.name}</div>
                      <div className="flex items-center gap-1 text-sm font-normal text-muted-foreground mt-1">
                        <MapPin className="w-3.5 h-3.5" /> {(inv as any).distance.toFixed(1)} km away
                      </div>
                    </CardTitle>
                    <CardDescription>Verified Nexus Member</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center bg-muted/30 p-3 rounded-lg border border-border/50">
                      <div>
                        <p className="text-sm font-medium">Available {bgParam}</p>
                        <p className="text-2xl font-bold text-foreground">{inv.units} <span className="text-sm font-normal text-muted-foreground">units</span></p>
                      </div>
                      <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400 pointer-events-none">
                        Sufficient Stock
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <form action={createOrder} className="w-full">
                      <input type="hidden" name="bankId" value={inv.bank.id} />
                      <input type="hidden" name="bloodType" value={bgParam} />
                      <input type="hidden" name="units" value={unitsParam.toString()} />
                      <Button type="submit" className="w-full gap-2 font-bold">
                        Place Order <ArrowRight className="w-4 h-4" />
                      </Button>
                    </form>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
