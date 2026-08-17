import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { eventId, privateCode } = await req.json();

    if (!eventId) {
      return NextResponse.json({ error: "Missing event ID" }, { status: 400 });
    }

    const event = await db.event.findUnique({
      where: { id: eventId },
      include: {
        _count: { select: { registrations: true } }
      }
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event.status === "COMPLETED" || new Date(event.date) < new Date()) {
      return NextResponse.json({ error: "Event has already ended" }, { status: 400 });
    }

    if (event.maxParticipants && event._count.registrations >= event.maxParticipants) {
      return NextResponse.json({ error: "Event quota is full" }, { status: 400 });
    }

    if (event.isPrivate) {
      if (!privateCode) {
        return NextResponse.json({ error: "Private code required" }, { status: 400 });
      }
      if (privateCode.toUpperCase() !== event.privateCode?.toUpperCase()) {
        return NextResponse.json({ error: "Invalid private code" }, { status: 403 });
      }
    }

    // Check if already registered
    const existing = await db.eventRegistration.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId: session.id
        }
      }
    });

    if (existing) {
      return NextResponse.json({ error: "Already registered" }, { status: 400 });
    }

    await db.eventRegistration.create({
      data: {
        eventId,
        userId: session.id
      }
    });

    return NextResponse.json({ message: "Registered successfully" });

  } catch (error) {
    console.error("Event registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
