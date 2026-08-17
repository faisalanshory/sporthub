import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { format } from "date-fns";
import { CalendarDays, MapPin, Users, Clock, ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";
import { RegistrationClient } from "./registration-client";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const session = await getSession();

  const event = await db.event.findUnique({
    where: { slug },
    include: {
      venue: true,
      sport: true,
      creator: true,
      _count: { select: { registrations: true } },
      registrations: {
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!event) notFound();

  let isRegistered = false;
  if (session) {
    const reg = await db.eventRegistration.findUnique({
      where: {
        eventId_userId: {
          eventId: event.id,
          userId: session.id
        }
      }
    });
    if (reg) isRegistered = true;
  }

  const galleryImages = event.gallery ? JSON.parse(event.gallery) : [];
  const isFull = event.maxParticipants ? event._count.registrations >= event.maxParticipants : false;
  const isPast = event.status === "COMPLETED" || new Date(event.date) < new Date();

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link href="/events" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Events
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
            {event.coverImage ? (
              <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Cover Image</div>
            )}
            {event.isPrivate && (
              <div className="absolute top-4 left-4">
                <Badge variant="secondary" className="bg-slate-900/80 backdrop-blur-md text-white text-sm px-3 py-1 flex items-center gap-1.5">
                  <Shield className="w-4 h-4" /> Private Event
                </Badge>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-primary mb-3 uppercase tracking-wider">
              {event.sport?.name || "General"}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">{event.title}</h1>
            <p className="text-lg text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
              {event.description || "No description provided."}
            </p>
          </div>

          {galleryImages.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4">Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {galleryImages.map((img: string, i: number) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden bg-slate-100">
                    <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {event.registrations.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4">Participants</h3>
              <div className="flex flex-wrap gap-3">
                {event.registrations.map((reg: any) => (
                  <div key={reg.id} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 p-2 pr-4 rounded-full border border-slate-200 dark:border-slate-800">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                      {reg.user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">{reg.user.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl shadow-primary/5">
            <h3 className="font-bold text-lg mb-6 pb-4 border-b">Event Details</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Date</p>
                  <p className="text-sm text-muted-foreground">{format(event.date, "EEEE, dd MMMM yyyy")}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Time</p>
                  <p className="text-sm text-muted-foreground">{event.startTime} - {event.endTime}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{event.location || event.venue.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Quota</p>
                  <p className="text-sm text-muted-foreground">
                    {event._count.registrations} {event.maxParticipants ? `/ ${event.maxParticipants}` : ""} Joined
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center mb-6">
                <span className="text-muted-foreground">Registration Fee</span>
                <span className="text-2xl font-bold text-primary">
                  {event.fee === 0 ? "Free" : `Rp ${event.fee.toLocaleString('id-ID')}`}
                </span>
              </div>

              <RegistrationClient 
                eventId={event.id}
                isPrivate={event.isPrivate}
                isRegistered={isRegistered}
                isFull={isFull}
                isPast={isPast}
                isLoggedIn={!!session}
                fee={event.fee}
              />
            </div>
            
            {event.creator && (
              <div className="mt-6 text-center text-xs text-muted-foreground">
                Organized by {event.creator.name}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
