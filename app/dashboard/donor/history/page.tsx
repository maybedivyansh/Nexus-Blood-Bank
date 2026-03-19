import { db } from "@/lib/db";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthUser } from "@/lib/actions/auth";

export const dynamic = "force-dynamic";

export default async function DonorHistory() {
  const user = await getAuthUser();

  const donations = await db.donationAppointment.findMany({
    where: { donorId: user.id },
    include: {
      bank: { select: { name: true } }
    },
    orderBy: { date: "desc" }
  });

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Donation History</CardTitle>
          <CardDescription>A complete log of your selfless contributions over time.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Units Donated</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    No donation history mapped to your active profile yet.
                  </TableCell>
                </TableRow>
              ) : (
                donations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell className="font-medium">{new Date(donation.date).toLocaleDateString()}</TableCell>
                    <TableCell>{donation.bank.name}</TableCell>
                    <TableCell>1 Unit(s)</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={donation.status === "COMPLETED" ? "default" : "secondary"}>
                        {donation.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
