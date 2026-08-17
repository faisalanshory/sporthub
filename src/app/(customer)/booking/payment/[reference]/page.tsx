import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PaymentClient } from "./payment-client";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ reference: string }>;
}

export default async function PaymentPage({ params }: Props) {
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
        }
      }
    }
  });

  if (!booking) notFound();

  // Deduplicate venues/courts for the UI summary
  const courts = Array.from(new Set(booking.items.map(item => item.court.name))).join(", ");

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Complete Payment</h1>
        <p className="text-muted-foreground mt-2">
          Secure your booking for {booking.items.length} slot(s) across {courts}.
        </p>
      </div>

      <PaymentClient booking={booking} />
    </div>
  );
}
