"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getAuthUser } from "@/lib/actions/auth";

export async function createOrder(formData: FormData) {
  const bankId = formData.get("bankId") as string;
  const bloodType = formData.get("bloodType") as string;
  const units = parseInt(formData.get("units") as string, 10);

  const user = await getAuthUser();
  const hospitalId = user.id;

  await db.order.create({
    data: {
      hospitalId,
      bankId,
      bloodType,
      units,
      status: "PENDING"
    }
  });

  revalidatePath("/dashboard/hospital");
  revalidatePath("/dashboard/bank/orders-management");
  redirect("/dashboard/hospital/orders");
}

export async function approveAndShipOrder(orderId: string) {
  // Prisma Transaction!
  await db.$transaction(async (prisma) => {
    // 1. Get the order
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error("Order not found");
    if (order.status !== "PENDING") throw new Error("Order already processed");

    // 2. Decrement inventory
    const inventory = await prisma.inventory.findFirst({
      where: { bankId: order.bankId, bloodType: order.bloodType }
    });

    if (!inventory || inventory.units < order.units) {
      throw new Error("Insufficient stock to fulfill this order.");
    }

    await prisma.inventory.update({
      where: { id: inventory.id },
      data: { units: inventory.units - order.units }
    });

    // 3. Mark order as APPROVED
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "APPROVED" }
    });
  });

  revalidatePath("/dashboard/bank/orders-management");
  revalidatePath("/dashboard/bank");
  revalidatePath("/dashboard/hospital/orders");
}
