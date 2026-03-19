import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const role = "HOSPITAL";

    if (role !== "HOSPITAL") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { bloodType, units, bankId } = body;

    if (!bloodType || !units || !bankId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Mock response for order creation
    // E.g., const newOrder = await prisma.order.create({...});

    return NextResponse.json({
      status: "success",
      message: "Order placed successfully",
      order: {
        id: "ORD-" + Math.floor(Math.random() * 10000),
        bloodType,
        units,
        status: "PENDING",
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
