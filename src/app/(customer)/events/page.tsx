import { db } from "@/lib/db";
import { format } from "date-fns";
import Link from "next/link";
import { CalendarDays, MapPin, Users, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const now = new Date();

  // Get upcoming/ongoing public events
  const upcomingEvents = await db.event.findMany({
    where: {
      date: { gte: now },
      status: { in: ["UPCOMING", "ONGOING"] },
      isPrivate: false
    },
    include: {
      venue: true,
      sport: true,
      _count: { select: { registrations: true } }
    },
    orderBy: { date: "asc" }
  });

  // Get past events (both public and private)
  const pastEvents = await db.event.findMany({
    where: {
      OR: [
        { date: { lt: now } },
        { status: "COMPLETED" }
      ]
    },
    include: {
      venue: true,
      sport: true,
      _count: { select: { registrations: true } }
    },
    orderBy: { date: "desc" },
    take: 6
  });

  const renderEventCard = (event: any) => (
    <Link href={`/events/${event.slug}`} key={event.id} className="group block h-full">
      <Card className="h-full overflow-hidden hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 flex flex-col">
        <div className="relative aspect-[16/9] bg-slate-100 dark:bg-slate-800">
          {event.coverImage ? (
            <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
          )}
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className="bg-primary shadow-sm">{format(event.date, "dd MMM yyyy")}</Badge>
            {event.isPrivate && <Badge variant="secondary" className="bg-slate-900 text-white shadow-sm flex items-center gap-1"><Lock className="w-3 h-3" /> Private</Badge>}
          </div>
        </div>
        <CardContent className="p-5 flex-grow flex flex-col">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-2 uppercase tracking-wider">
            {event.sport?.name || "General"}
          </div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">{event.title}</h3>
          
          <div className="space-y-1.5 mt-auto text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" /> {event.location || event.venue.name}
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" /> {event.startTime} - {event.endTime}
            </div>
            {event.maxParticipants && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" /> {event._count.registrations} / {event.maxParticipants} Registered
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Community Events</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Join upcoming tournaments, coaching clinics, and friendly matches. Or book a court and host your own event!
        </p>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="w-2 h-8 bg-primary rounded-full"></span>
          Upcoming Events
        </h2>
        {upcomingEvents.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-xl border-slate-200 dark:border-slate-800">
            <p className="text-muted-foreground">No upcoming public events right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map(renderEventCard)}
          </div>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="w-2 h-8 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
          Past Events
        </h2>
        {pastEvents.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-xl border-slate-200 dark:border-slate-800">
            <p className="text-muted-foreground">No past events found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-70 hover:opacity-100 transition-opacity">
            {pastEvents.map(renderEventCard)}
          </div>
        )}
      </div>
    </div>
  );
}
