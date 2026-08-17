import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { reference, paymentMethod } = await req.json();

    if (!reference || !paymentMethod) {
      return NextResponse.json({ error: "Missing required details" }, { status: 400 });
    }

    const booking = await db.booking.findUnique({
      where: { reference },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.status !== "PENDING_PAYMENT") {
      return NextResponse.json({ error: "Booking is not pending payment" }, { status: 400 });
    }

    // Simulate payment processing...
    // In a real app, this would integrate with Midtrans/Xendit etc.

    // 1. Create Payment Record
    await db.payment.create({
      data: {
        bookingId: booking.id,
        method: paymentMethod,
        amount: booking.totalAmount,
        status: "SUCCESS",
        paidAt: new Date(),
      }
    });

    // 2. Update Booking Status
    await db.booking.update({
      where: { id: booking.id },
      data: { status: "CONFIRMED" }
    });

    return NextResponse.json({ message: "Payment successful" });

  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
