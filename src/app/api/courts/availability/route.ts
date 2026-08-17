import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sportSlug = searchParams.get("sport");
  const dateStr = searchParams.get("date"); // yyyy-MM-dd

  if (!sportSlug || !dateStr) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const sport = await db.sport.findFirst({
      where: { slug: sportSlug, isActive: true },
      include: {
        courts: {
          where: { isActive: true },
        },
        venue: true,
      }
    });

    if (!sport) {
      return NextResponse.json({ error: "Sport not found" }, { status: 404 });
    }

    const startHour = parseInt(sport.venue.openTime.split(":")[0]);
    const endHour = parseInt(sport.venue.closeTime.split(":")[0]);

    // Parse the requested date to check existing bookings
    const selectedDate = new Date(dateStr);
    
    // Get all bookings for these courts on this date
    const bookedItems = await db.bookingItem.findMany({
      where: {
        courtId: { in: sport.courts.map(c => c.id) },
        date: selectedDate,
        booking: {
          status: { notIn: ["CANCELLED", "EXPIRED"] }
        }
      }
    });

    const availability: Record<string, any> = {};

    for (const court of sport.courts) {
      const slots = [];
      const courtBookings = bookedItems.filter(b => b.courtId === court.id);

      for (let hour = startHour; hour < endHour; hour++) {
        const timeString = `${hour.toString().padStart(2, "0")}:00`;
        const isBooked = courtBookings.some(
          (b) => b.startTime === timeString || 
                 (parseInt(b.startTime.split(":")[0]) <= hour && parseInt(b.endTime.split(":")[0]) > hour)
        );

        slots.push({
          time: timeString,
          available: !isBooked,
        });
      }

      availability[court.id] = {
        slots
      };
    }

    return NextResponse.json(availability);
  } catch (error) {
    console.error("Availability error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
