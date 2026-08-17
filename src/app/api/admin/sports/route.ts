import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { name, icon, numCourts } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Get the main venue
    const venue = await db.venue.findFirst();
    if (!venue) {
      return NextResponse.json({ error: "No venue found" }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    // Create the sport
    const sport = await db.sport.create({
      data: {
        name,
        slug,
        icon: icon || "🏆",
        venueId: venue.id,
        sortOrder: 10,
      }
    });

    // Create N courts
    const count = parseInt(numCourts) || 0;
    if (count > 0) {
      const courts = Array.from({ length: count }).map((_, i) => ({
        sportId: sport.id,
        name: `${name} Court ${String(i + 1).padStart(2, '0')}`,
        slug: `${slug}-court-${String(i + 1).padStart(2, '0')}`,
        capacity: 4,
        pricePerHour: 150000,
        isIndoor: true,
        facilities: JSON.stringify(['Standard Layout']),
      }));

      await db.court.createMany({
        data: courts
      });
    }

    return NextResponse.json({ success: true, sport });
  } catch (error: any) {
    console.error("Failed to create sport:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
