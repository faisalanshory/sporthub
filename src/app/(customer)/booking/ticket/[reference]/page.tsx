import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { format } from "date-fns";
import { QrCode, Calendar, Clock, MapPin, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import QRCode from "qrcode";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ reference: string }>;
}

export default async function TicketPage({ params }: Props) {
  const { reference } = await params;

  const booking = await db.booking.findUnique({
    where: { reference },
    include: {
      items: {
        include: {
          court: {
            include: {
              sport: {
                include: { venue: true }
              }
            }
          }
        },
        orderBy: [{ date: "asc" }, { startTime: "asc" }]
      },
      payment: true
    }
  });

  if (!booking || booking.status !== "CONFIRMED") notFound();

  // Generate QR Code data URL
  const qrDataUrl = await QRCode.toDataURL(reference, {
    errorCorrectionLevel: "H",
    margin: 1,
    color: {
      dark: "#0f172a", // slate-900
      light: "#ffffff",
    }
  });
  
  // Use the first item's venue for the header
  const venue = booking.items[0].court.sport.venue;

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Your Ticket</h1>
        <p className="text-muted-foreground mt-2">
          Show this QR code at the venue.
        </p>
      </div>

      <Card className="overflow-hidden border-0 shadow-2xl shadow-primary/10">
        <div className="bg-primary p-6 text-primary-foreground text-center">
          <h2 className="text-xl font-bold">{venue.name}</h2>
          <p className="opacity-90">{booking.items.length} Slot(s) Booked</p>
        </div>
        
        <CardContent className="p-8">
          <div className="flex justify-center mb-8">
            <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
              <img src={qrDataUrl} alt="Booking QR Code" className="w-48 h-48" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="text-sm bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
              <span className="text-muted-foreground block text-xs mb-2">Booked Slots</span>
              <div className="space-y-3">
                {booking.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-white dark:bg-slate-800 p-2 rounded border border-slate-100 dark:border-slate-700">
                    <div>
                      <div className="font-semibold">{item.court.name}</div>
                      <div className="text-xs text-muted-foreground flex gap-3 mt-1">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {format(item.date, "dd MMM yyyy")}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.startTime} - {item.endTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-sm bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
              <span className="text-muted-foreground block text-xs">Location</span>
              <span className="font-semibold flex items-start gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>{venue.address}</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm border-t pt-4">
              <div>
                <span className="text-muted-foreground block text-xs">Name</span>
                <span className="font-medium truncate block" title={booking.guestName || "Guest"}>
                  {booking.guestName}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs">Reference ID</span>
                <span className="font-mono font-bold tracking-wider">{booking.reference}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="outline" className="w-full sm:w-auto">
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
        <Link href="/" className={cn(buttonVariants(), "w-full sm:w-auto")}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
