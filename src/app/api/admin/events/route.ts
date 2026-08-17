import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { title, date, startTime, endTime, maxParticipants, sportId } = await req.json();

    if (!title || !date) {
      return NextResponse.json({ error: "Title and Date are required" }, { status: 400 });
    }

    const venue = await db.venue.findFirst();
    const admin = await db.user.findFirst({ where: { role: "ADMIN" } });
    
    if (!venue || !admin) {
      return NextResponse.json({ error: "Venue or Admin not found" }, { status: 400 });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    const event = await db.event.create({
      data: {
        title,
        slug: `${slug}-${Date.now()}`,
        date: new Date(date),
        startTime: startTime || "09:00",
        endTime: endTime || "12:00",
        location: venue.name,
        maxParticipants: parseInt(maxParticipants) || 20,
        fee: 150000,
        status: "UPCOMING",
        isPrivate: false,
        venueId: venue.id,
        sportId: sportId || undefined,
        creatorId: admin.id,
        coverImage: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=800",
        description: "This is a system generated event description.",
        gallery: "[]"
      }
    });

    return NextResponse.json({ success: true, event });
  } catch (error: any) {
    console.error("Failed to create event:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
