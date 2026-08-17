import { db } from "@/lib/db";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Users, CreditCard, Activity, CalendarDays } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const [totalBookings, totalRevenue, recentBookings, upcomingEvents, activeCourts, totalUsers] = await Promise.all([
    db.booking.count({ where: { status: { in: ["PAID", "CONFIRMED", "COMPLETED"] } } }),
    db.booking.aggregate({
      where: { status: { in: ["PAID", "CONFIRMED", "COMPLETED"] } },
      _sum: { totalAmount: true }
    }),
    db.booking.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { items: { include: { court: true } } }
    }),
    db.event.findMany({
      take: 5,
      where: { date: { gte: new Date(new Date().setHours(0,0,0,0)) } },
      orderBy: { date: "asc" },
      include: { sport: true, _count: { select: { registrations: true } } }
    }),
    db.court.count({ where: { isActive: true } }),
    db.user.count()
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground mt-1">
          Welcome back. Here's what's happening at your venue today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rp {(totalRevenue._sum.totalAmount || 0).toLocaleString('id-ID')}
            </div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              Since platform launch
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bookings</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              Total confirmed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courts</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCourts}</div>
            <p className="text-xs text-muted-foreground mt-1">Operational courts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Community</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered members</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentBookings.length === 0 ? (
                <div className="text-sm text-muted-foreground py-8 text-center">No recent bookings</div>
              ) : (
                recentBookings.map(booking => (
                  <div key={booking.id} className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">{booking.guestName || "Guest"}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.items.length > 0 ? booking.items[0].court.name : "Multiple Courts"} &bull; {booking.items.length > 0 ? format(booking.items[0].date, "dd MMM") : ""}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      Rp {booking.totalAmount.toLocaleString('id-ID')}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.length === 0 ? (
                <div className="text-sm text-muted-foreground py-4 text-center">No upcoming events</div>
              ) : (
                upcomingEvents.map(event => (
                  <div key={event.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <div>
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {event.sport?.name || "General"} &bull; {format(event.date, "EEE, dd MMM")}
                      </p>
                    </div>
                    <div className="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded-md">
                      {event._count.registrations} Registered
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
