import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const data = await req.json();

    const {
      slots, // Array of { courtId, date, time, price }
      guestName,
      guestEmail,
      guestPhone,
      notes,
      event, // New: Event creation payload
    } = data;

    if (!slots || !Array.isArray(slots) || slots.length === 0) {
      return NextResponse.json({ error: "No slots selected" }, { status: 400 });
    }

    // Double check availability for ALL slots
    for (const slot of slots) {
      const selectedDate = new Date(slot.date);
      const existingItem = await db.bookingItem.findFirst({
        where: {
          courtId: slot.courtId,
          date: selectedDate,
          startTime: slot.time,
          booking: {
            status: { notIn: ["CANCELLED", "EXPIRED"] }
          }
        }
      });

      if (existingItem) {
        return NextResponse.json({ 
          error: `Time slot ${slot.time} on ${slot.date} for ${slot.courtName} is no longer available.` 
        }, { status: 409 });
      }
    }

    const courtFee = slots.reduce((sum, s) => sum + s.price, 0);
    const serviceFee = 5000;
    const totalAmount = courtFee + serviceFee;
    const reference = `BKG-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

    // Create the booking and its items in a transaction
    // Also create the Event if requested
    const booking = await db.booking.create({
      data: {
        reference,
        userId: session?.id || null,
        guestName: session ? session.name : guestName,
        guestEmail: session ? session.email : guestEmail,
        guestPhone: guestPhone || null,
        serviceFee,
        totalAmount,
        status: "PENDING_PAYMENT",
        notes,
        items: {
          create: slots.map((slot: any) => {
            const startHour = parseInt(slot.time.split(":")[0]);
            const endTime = `${(startHour + 1).toString().padStart(2, "0")}:00`;
            return {
              courtId: slot.courtId,
              date: new Date(slot.date),
              startTime: slot.time,
              endTime,
              price: slot.price
            };
          })
        },
        ...(event && session?.id ? {
          event: {
            create: {
              title: event.title,
              slug: `${event.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${crypto.randomBytes(3).toString("hex")}`,
              description: event.description,
              date: new Date(slots[0].date), // Use the date of the first slot
              startTime: slots[0].time,
              endTime: `${(parseInt(slots[slots.length - 1].time.split(":")[0]) + 1).toString().padStart(2, "0")}:00`,
              maxParticipants: event.maxParticipants,
              fee: event.fee,
              isPrivate: event.isPrivate,
              privateCode: event.isPrivate ? event.privateCode : null,
              venueId: (await db.court.findUnique({ where: { id: slots[0].courtId }, include: { sport: true } }))?.sport.venueId || "",
              sportId: (await db.court.findUnique({ where: { id: slots[0].courtId } }))?.sportId || "",
              location: slots[0].courtName,
              creatorId: session.id,
              status: "UPCOMING"
            }
          }
        } : {})
      }
    });

    return NextResponse.json({ 
      message: "Booking created", 
      bookingId: booking.id,
      reference: booking.reference
    });

  } catch (error) {
    console.error("Booking creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
