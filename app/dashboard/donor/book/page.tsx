import { db } from "@/lib/db";
import { getAuthUser } from "@/lib/actions/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { bookDonationAction } from "@/lib/actions/appointments";

export const dynamic = "force-dynamic";

export default async function BookDonationPage() {
  await getAuthUser(); // Security verification lock
  const banks = await db.user.findMany({
    where: { internal_role: { in: ["BANK", "BLOOD_BANK"] } },
    select: { id: true, name: true }
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Schedule Donation</h2>
        <p className="text-muted-foreground mt-1">Book an appointment at a nearby Blood Bank to donate.</p>
      </div>

      <Card className="shadow-lg border-primary/10">
        <CardHeader>
          <CardTitle>Appointment Details</CardTitle>
          <CardDescription>Select your facility and preferred time slot to actively participate.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={bookDonationAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="bankId">Blood Bank Facility</Label>
              <select id="bankId" name="bankId" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <option value="">-- Select a Facility --</option>
                {banks.map(bank => (
                  <option key={bank.id} value={bank.id}>{bank.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bloodType">Your Blood Group</Label>
              <select id="bloodType" name="bloodType" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
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

            <div className="space-y-2">
              <Label htmlFor="date">Appointment Date & Time</Label>
              <Input type="datetime-local" id="date" name="date" required className="h-10 w-full cursor-pointer" />
            </div>

            <Button type="submit" size="lg" className="w-full font-bold">Confirm Booking</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
