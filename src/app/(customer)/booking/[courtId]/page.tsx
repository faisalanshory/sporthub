import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { BookingFormClient } from "./booking-form-client";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ courtId: string }>;
  searchParams: Promise<{ date?: string; time?: string }>;
}

export default async function BookingPage({ params, searchParams }: Props) {
  const { courtId } = await params;
  const { date, time } = await searchParams;

  if (!date || !time) {
    redirect("/sports");
  }

  const court = await db.court.findUnique({
    where: { id: courtId },
    include: {
      sport: {
        include: { venue: true }
      }
    }
  });

  if (!court) notFound();
  
  const session = await getSession();

  // Validate date/time format quickly
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) redirect("/sports");

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
      <Link href={`/sports/${court.sport.slug}`} className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to {court.sport.name} Courts
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Complete Your Booking</h1>
        <p className="text-muted-foreground">
          Review your details and confirm the reservation.
        </p>
      </div>

      <BookingFormClient 
        court={court} 
        venue={court.sport.venue}
        date={date}
        time={time}
        user={session ? { name: session.name, email: session.email } : null}
      />
    </div>
  );
}
