import { CalendarDays, Droplet, SearchAlert } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DonorDashboard() {
  const lastDonation = new Date();
  lastDonation.setMonth(lastDonation.getMonth() - 4); // Example: 4 months ago

  const nextEligible = new Date(lastDonation);
  nextEligible.setMonth(nextEligible.getMonth() + 6); // Set to 6 month window
  const isEligible = new Date() >= nextEligible;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome back, Hero</h2>
          <p className="text-muted-foreground mt-1">Your donations save lives. Track your impact here.</p>
        </div>
        <div className="flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-1.5 rounded-full font-bold border border-destructive/20 shadow-sm">
          <Droplet className="w-4 h-4 fill-destructive/20" /> 
          O+ Type
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Eligibility Status</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isEligible ? "text-green-600 dark:text-green-500" : "text-amber-500"}`}>
              {isEligible ? "Eligible to Donate" : "Pending Rest"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Next Eligible: {nextEligible.toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <Droplet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">3 Units</div>
            <p className="text-xs text-muted-foreground mt-1">~9 Lives Saved</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <SearchAlert className="text-destructive h-5 w-5" /> 
          Urgent Needs Nearby
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i} className="border-destructive/20 shadow-sm">
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <div className="font-bold flex items-center gap-2">
                     City General Hospital <Badge variant="destructive">Critical</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Requires O+ and O- immediately.</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
