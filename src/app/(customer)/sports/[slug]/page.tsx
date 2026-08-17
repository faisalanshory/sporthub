import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CourtListClient } from "./court-list-client";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function SportDetailPage({ params }: Props) {
  const { slug } = await params;
  
  const sport = await db.sport.findFirst({
    where: { slug, isActive: true },
    include: {
      courts: {
        where: { isActive: true },
        orderBy: { name: "asc" }
      },
      venue: true
    }
  });

  if (!sport) notFound();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
      <Link href="/sports" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Sports
      </Link>

      <div className="flex flex-col md:flex-row gap-6 md:items-end justify-between mb-10">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border flex items-center justify-center text-3xl">
              {sport.icon}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">{sport.name} Courts</h1>
              <p className="text-muted-foreground mt-1">
                {sport.venue.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      <CourtListClient courts={sport.courts} sportSlug={sport.slug} venueHours={{ open: sport.venue.openTime, close: sport.venue.closeTime }} />
    </div>
  );
}
