import { db } from "@/lib/db";
import { getAuthUser } from "@/lib/actions/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Droplet, User as UserIcon, CheckCircle2 } from "lucide-react";
import { markAppointmentComplete } from "@/lib/actions/appointments";
import { SubmitButton } from "./submit-button";

export const dynamic = "force-dynamic";

export default async function BankSchedulePage() {
  const user = await getAuthUser();
  const appointments = await db.donationAppointment.findMany({
    where: { bankId: user.id },
    include: { donor: { select: { name: true } } },
    orderBy: { date: "asc" }
  });

  const scheduled = appointments.filter(a => a.status === "SCHEDULED");
  const completed = appointments.filter(a => a.status === "COMPLETED");

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Donor Schedule</h2>
        <p className="text-muted-foreground mt-1">Review upcoming donor appointments to forecast stock acquisition.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-l-4 border-l-blue-500 shadow-md">
          <CardHeader>
             <CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5 text-blue-500" /> Upcoming Arrivals</CardTitle>
          </CardHeader>
          <CardContent>
             {scheduled.length === 0 ? <p className="text-muted-foreground text-sm">No incoming appointments.</p> : (
               <div className="space-y-4">
                 {scheduled.map(app => (
                   <div key={app.id} className="p-4 border border-blue-500/10 bg-blue-500/5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                     <div>
                       <div className="flex items-center gap-2 mb-1">
                         <Badge variant="outline" className="text-blue-500 border-blue-500/20 bg-blue-500/10 font-bold text-sm tracking-widest">{app.bloodType}</Badge>
                         <p className="font-semibold flex items-center gap-1.5"><UserIcon className="w-3.5 h-3.5 text-muted-foreground"/> {app.donor.name}</p>
                       </div>
                       <p className="text-xs font-semibold text-muted-foreground">{app.date.toLocaleString()}</p>
                     </div>
                     <form action={markAppointmentComplete.bind(null, app.id)}>
                        <SubmitButton />
                     </form>
                   </div>
                 ))}
               </div>
             )}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
             <CardTitle className="flex items-center gap-2"><Droplet className="w-5 h-5 text-green-500" /> Completed (In Vault)</CardTitle>
          </CardHeader>
          <CardContent>
             {completed.length === 0 ? <p className="text-muted-foreground text-sm">No completed appointments yet.</p> : (
               <div className="space-y-4 opacity-70">
                 {completed.map(app => (
                   <div key={app.id} className="p-3 border border-green-500/20 bg-green-500/5 rounded-xl flex justify-between items-center">
                     <div>
                       <Badge variant="outline" className="text-green-600 border-green-500/20 bg-green-500/10 mr-2">{app.bloodType}</Badge>
                       <span className="text-sm font-medium">{app.donor.name}</span>
                     </div>
                     <CheckCircle2 className="w-4 h-4 text-green-500" />
                   </div>
                 ))}
               </div>
             )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
