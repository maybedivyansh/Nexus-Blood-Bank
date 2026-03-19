"use server";

import { db } from "@/lib/db";
import { getAuthUser } from "@/lib/actions/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function bookDonationAction(formData: FormData) {
  const user = await getAuthUser();
  const bankId = formData.get("bankId") as string;
  const bloodType = formData.get("bloodType") as string;
  const rawDate = formData.get("date") as string;

  if (!bankId || !bloodType || !rawDate) throw new Error("Missing exact scheduling telemetry");

  await db.donationAppointment.create({
    data: {
      donorId: user.id,
      bankId,
      bloodType,
      date: new Date(rawDate),
    }
  });

  redirect("/dashboard/donor");
}

export async function markAppointmentComplete(appointmentId: string) {
  const app = await db.donationAppointment.update({
    where: { id: appointmentId },
    data: { status: "COMPLETED" }
  });

  // Auto-fill prediction: Automatically inject 1 valid stock increment into bank vault array!
  const bankInventory = await db.inventory.findFirst({
    where: { bankId: app.bankId, bloodType: app.bloodType }
  });

  if (bankInventory) {
    await db.inventory.update({
      where: { id: bankInventory.id },
      data: { units: bankInventory.units + 1 }
    });
  }

  revalidatePath("/dashboard/bank/schedule");
  revalidatePath("/dashboard/bank/inventory");
}
