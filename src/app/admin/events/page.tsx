import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Users, CalendarDays, Clock, MapPin, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AddEventClient } from "./add-event-client";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const events = await db.event.findMany({
    orderBy: { date: "desc" },
    include: {
      sport: true,
      venue: true,
      _count: {
        select: { registrations: true }
      }
    }
  });
  
  const sports = await db.sport.findMany({ select: { id: true, name: true } });

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground mt-1">Manage public and private community events.</p>
        </div>
        <AddEventClient sports={sports} />
      </div>

      <Card className="border-slate-200 dark:border-slate-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                <TableRow>
                  <TableHead className="font-semibold">Event</TableHead>
                  <TableHead className="font-semibold">Schedule</TableHead>
                  <TableHead className="font-semibold">Visibility</TableHead>
                  <TableHead className="font-semibold text-center">Registrations</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No events found.
                    </TableCell>
                  </TableRow>
                ) : (
                  events.map((event) => (
                    <TableRow key={event.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {event.coverImage && (
                            <div className="w-12 h-12 rounded-lg bg-slate-100 shrink-0 overflow-hidden">
                              <img src={event.coverImage} alt="" className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-sm line-clamp-1">{event.title}</div>
                            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                              {event.sport?.name || "General"}
                              <span className="text-slate-300 mx-1">•</span>
                              <MapPin className="w-3 h-3" /> {event.location || event.venue.name}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                            <CalendarDays className="w-3.5 h-3.5" /> {format(event.date, "dd MMM yyyy")}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                            <Clock className="w-3.5 h-3.5" /> {event.startTime} - {event.endTime}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {event.isPrivate ? (
                          <Badge variant="secondary" className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-0">
                            <Shield className="w-3 h-3 mr-1" /> Private
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-emerald-600 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30">
                            Public
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-xs font-medium">
                          <Users className="w-3.5 h-3.5" />
                          {event._count.registrations} {event.maxParticipants ? `/ ${event.maxParticipants}` : ""}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={event.status === "UPCOMING" ? "default" : "secondary"}>
                          {event.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Manage</Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
