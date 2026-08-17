import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, User, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCalendarPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Fetch booking items for today onwards
  const schedule = await db.bookingItem.findMany({
    where: {
      date: { gte: today },
      booking: { status: "CONFIRMED" }
    },
    include: {
      booking: {
        include: { user: true }
      },
      court: true
    },
    orderBy: [
      { date: "asc" },
      { startTime: "asc" }
    ]
  });

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground mt-1">View upcoming court reservations and schedules.</p>
      </div>

      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" /> Upcoming Schedule
            </CardTitle>
            <Badge variant="outline" className="bg-white dark:bg-slate-950">
              {schedule.length} Bookings
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {schedule.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No upcoming bookings found.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {schedule.map((item) => (
                <div key={item.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="hidden sm:flex w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-500 items-center justify-center">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold">{item.court.name}</span>
                        <Badge variant="secondary" className="text-[10px]">{item.booking.reference}</Badge>
                      </div>
                      <div className="text-sm text-slate-500 flex items-center gap-4">
                        <span className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> {format(item.date, "dd MMM yyyy")}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {item.startTime} - {item.endTime}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-white dark:bg-slate-950 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">{item.booking.guestName}</p>
                      <p className="text-xs text-muted-foreground">{item.booking.guestPhone}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
