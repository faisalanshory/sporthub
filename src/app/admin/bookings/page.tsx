import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const bookings = await db.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: { court: true }
      }
    }
  });

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground mt-1">View and manage all court reservations.</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Card className="border-slate-200 dark:border-slate-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                <TableRow>
                  <TableHead className="font-semibold">Reference ID</TableHead>
                  <TableHead className="font-semibold">Customer</TableHead>
                  <TableHead className="font-semibold">Court & Date</TableHead>
                  <TableHead className="font-semibold">Amount</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-right font-semibold">Booked On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No bookings found.
                    </TableCell>
                  </TableRow>
                ) : (
                  bookings.map((booking) => (
                    <TableRow key={booking.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <TableCell className="font-mono font-medium text-xs">
                        {booking.reference}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{booking.guestName || "Guest"}</div>
                        <div className="text-xs text-muted-foreground">{booking.guestEmail || booking.guestPhone || "-"}</div>
                      </TableCell>
                      <TableCell>
                        {booking.items.length > 0 ? (
                          <>
                            <div className="font-medium">{booking.items[0].court.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {format(booking.items[0].date, "dd MMM yyyy")} • {booking.items[0].startTime}-{booking.items[0].endTime}
                              {booking.items.length > 1 && ` (+${booking.items.length - 1} more)`}
                            </div>
                          </>
                        ) : (
                          <span className="text-muted-foreground italic">No slots</span>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        Rp {booking.totalAmount.toLocaleString('id-ID')}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={booking.status === "CONFIRMED" ? "default" : booking.status === "COMPLETED" ? "secondary" : "outline"}
                          className={booking.status === "CONFIRMED" ? "bg-emerald-500 hover:bg-emerald-600" : ""}
                        >
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {format(booking.createdAt, "dd MMM, HH:mm")}
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
