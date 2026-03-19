import { db } from "@/lib/db";
import { getAuthUser } from "@/lib/actions/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { InventoryClientTable } from "./inventory-client";

export const dynamic = "force-dynamic";

export default async function InventoryManagement() {
  const user = await getAuthUser();
  const bankId = user.id;

  let inventory = await db.inventory.findMany({
    where: { bankId },
    orderBy: { bloodType: "asc" }
  });

  // Automatically initialize all 8 blood groups at 0 units for newly registered Blood Banks
  if (inventory.length === 0) {
    const allBloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const defaultExpiry = new Date();
    defaultExpiry.setDate(defaultExpiry.getDate() + 42); // Standard 42-day platelet baseline

    await Promise.all(
      allBloodTypes.map(bg => 
        db.inventory.create({
          data: {
            bankId,
            bloodType: bg,
            units: 0,
            expiryDate: defaultExpiry
          }
        })
      )
    );

    // Re-fetch now that the database has been properly initialized
    inventory = await db.inventory.findMany({
      where: { bankId },
      orderBy: { bloodType: "asc" }
    });
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Stock Management</h2>
        <p className="text-muted-foreground mt-1">Real-time dynamic CRUD control over your vault stock.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Vault</CardTitle>
          <CardDescription>Rapidly increment or decrement active supply.</CardDescription>
        </CardHeader>
        <CardContent>
          <InventoryClientTable initialData={inventory} />
        </CardContent>
      </Card>
    </div>
  );
}
