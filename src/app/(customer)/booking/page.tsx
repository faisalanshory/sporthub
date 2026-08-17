import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { BookingFormClient } from "./booking-form-client";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ slots?: string }>;
}

export default async function BookingPage({ searchParams }: Props) {
  const { slots } = await searchParams;

  if (!slots) {
    redirect("/sports");
  }

  let parsedSlots = [];
  try {
    parsedSlots = JSON.parse(decodeURIComponent(slots));
    if (!Array.isArray(parsedSlots) || parsedSlots.length === 0) throw new Error();
  } catch (e) {
    redirect("/sports");
  }
  
  const session = await getSession();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-5xl">
      <Link href="/sports" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Sports
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Complete Your Booking</h1>
        <p className="text-muted-foreground">
          Review your selected slots and confirm the reservation.
        </p>
      </div>

      <BookingFormClient 
        slots={parsedSlots} 
        user={session ? { name: session.name, email: session.email } : null}
      />
    </div>
  );
}
