"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateInventoryUnits(inventoryId: string, unitsChange: number) {
  const inv = await db.inventory.findUnique({ where: { id: inventoryId } });
  if (!inv) throw new Error("Inventory record not found");

  const newUnits = Math.max(0, inv.units + unitsChange);
  
  await db.inventory.update({
    where: { id: inventoryId },
    data: { units: newUnits }
  });

  revalidatePath("/dashboard/bank/inventory");
  revalidatePath("/dashboard/hospital/request");
}

export async function bulkUpdateInventory(updates: { id: string, units: number }[]) {
  // Use Prisma transaction to perform bulk update safely with minimal latency
  await db.$transaction(
    updates.map(update => 
      db.inventory.update({
        where: { id: update.id },
        data: { units: update.units }
      })
    )
  );

  revalidatePath("/dashboard/bank/inventory");
  revalidatePath("/dashboard/hospital/request");
}
