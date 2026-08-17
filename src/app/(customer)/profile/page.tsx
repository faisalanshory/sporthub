import { getSession, clearSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { CalendarDays, Clock, MapPin, Ticket, ShieldCheck, CalendarRange } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: session.id },
  });

  if (!user) {
    await clearSession();
    redirect("/login");
  }

  // Get Bookings
  const bookings = await db.booking.findMany({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          court: {
            include: { sport: { include: { venue: true } } }
          }
        },
        orderBy: [{ date: "asc" }, { startTime: "asc" }]
      }
    },
    orderBy: { createdAt: "desc" }
  });

  // Get Event Registrations
  const eventRegistrations = await db.eventRegistration.findMany({
    where: { userId: user.id },
    include: {
      event: {
        include: { venue: true, sport: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  const now = new Date();
  // Upcoming bookings: date is >= today OR status is PENDING_PAYMENT
  const upcomingBookings = bookings.filter(b => {
    const d = b.items[0]?.date ? new Date(b.items[0].date) : null;
    return (d && d >= new Date(now.setHours(0,0,0,0))) || b.status === "PENDING_PAYMENT";
  });

  // Past bookings: date is < today AND status is not PENDING_PAYMENT
  const pastBookings = bookings.filter(b => {
    const d = b.items[0]?.date ? new Date(b.items[0].date) : null;
    return d && d < new Date(now.setHours(0,0,0,0)) && b.status !== "PENDING_PAYMENT";
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-12 flex items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center text-4xl font-bold">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{user.name}</h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Verified Member
          </p>
          <div className="text-sm mt-2 text-slate-500">
            {user.email} • {user.phone}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Bookings Section */}
        <div className="space-y-10">
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <CalendarRange className="w-6 h-6 text-primary" /> Upcoming Bookings
            </h2>
            
            {upcomingBookings.length === 0 ? (
              <Card className="border-dashed bg-transparent">
                <CardContent className="p-8 text-center text-muted-foreground">
                  You have no upcoming court bookings.
                  <div className="mt-4">
                    <Link href="/sports" className="text-primary hover:underline font-medium">Book a court</Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => {
                  const venue = booking.items[0]?.court.sport.venue;
                  const date = booking.items[0]?.date;
                  return (
                    <Link href={`/booking/ticket/${booking.reference}`} key={booking.id} className="block group">
                      <Card className="overflow-hidden hover:shadow-md transition-all border-slate-200 dark:border-slate-800">
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border-b flex justify-between items-center">
                          <div>
                            <p className="text-xs text-muted-foreground font-mono">#{booking.reference}</p>
                            <p className="font-bold text-lg mt-1">{venue?.name}</p>
                          </div>
                          <Badge variant={booking.status === "CONFIRMED" ? "default" : "secondary"}>
                            {booking.status}
                          </Badge>
                        </div>
                        <CardContent className="p-4 space-y-2">
                          {date && (
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                              <CalendarDays className="w-4 h-4" /> {format(date, "EEEE, dd MMM yyyy")}
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <Ticket className="w-4 h-4" /> {booking.items.length} Slot(s) Booked
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {pastBookings.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-500">
                <CalendarDays className="w-5 h-5" /> Past Bookings
              </h2>
              <div className="space-y-4">
                {pastBookings.map((booking) => {
                  const venue = booking.items[0]?.court.sport.venue;
                  const date = booking.items[0]?.date;
                  return (
                    <Link href={`/booking/ticket/${booking.reference}`} key={booking.id} className="block group">
                      <Card className="overflow-hidden opacity-70 hover:opacity-100 transition-all border-slate-200 dark:border-slate-800">
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-3 border-b flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-sm">{venue?.name}</p>
                          </div>
                          <Badge variant="outline" className="text-xs scale-90 origin-right">
                            {booking.status}
                          </Badge>
                        </div>
                        <CardContent className="p-3 space-y-1">
                          {date && (
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <CalendarDays className="w-3 h-3" /> {format(date, "dd MMM yyyy")}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Events Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Ticket className="w-6 h-6 text-primary" /> My Events
          </h2>
          
          {eventRegistrations.length === 0 ? (
            <Card className="border-dashed bg-transparent">
              <CardContent className="p-8 text-center text-muted-foreground">
                You haven't joined any events yet.
                <div className="mt-4">
                  <Link href="/events" className="text-primary hover:underline font-medium">Explore events</Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {eventRegistrations.map((reg) => {
                const event = reg.event;
                const isPast = event.status === "COMPLETED" || new Date(event.date) < new Date();
                
                return (
                  <Link href={`/events/${event.slug}`} key={reg.id} className="block group">
                    <Card className={`overflow-hidden hover:shadow-md transition-all border-slate-200 dark:border-slate-800 ${isPast ? 'opacity-70' : ''}`}>
                      <div className="flex">
                        {event.coverImage && (
                          <div className="w-24 shrink-0 bg-slate-100">
                            <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="p-4 flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-bold line-clamp-1 group-hover:text-primary transition-colors">{event.title}</h3>
                            {isPast && <Badge variant="secondary" className="text-[10px]">Ended</Badge>}
                          </div>
                          <div className="space-y-1 mt-2">
                            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                              <CalendarDays className="w-3 h-3" /> {format(event.date, "dd MMM yyyy")}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                              <Clock className="w-3 h-3" /> {event.startTime} - {event.endTime}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
