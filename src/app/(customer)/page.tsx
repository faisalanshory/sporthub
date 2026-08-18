import Link from "next/link";
import { db } from "@/lib/db";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Trophy, CalendarDays, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StorefrontPage() {
  const sports = await db.sport.findMany({
    where: { isActive: true },
    include: {
      courts: {
        where: { isActive: true }
      }
    },
    orderBy: { sortOrder: "asc" }
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section — height reduced ~60% of original */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-12 md:py-20 bg-slate-50 dark:bg-slate-950 overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
          <div className="w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        </div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3">
          <div className="w-[350px] h-[350px] bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto max-w-4xl text-center space-y-5">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            PLAY MORE. <br />
            <span className="text-primary">BOOK EASIER.</span>
          </h1>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Find your court. Pick your time. Start playing.
            Experience the most seamless sports venue booking platform designed for athletes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/sports" className={cn(buttonVariants({ size: "lg" }), "h-12 px-7 text-sm shadow-xl shadow-primary/20")}>
              Book a Court <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link href="/events" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "h-12 px-7 text-sm bg-white dark:bg-slate-900")}>
              Explore Events
            </Link>
          </div>
        </div>
      </section>

      {/* Sports Section */}
      <section className="py-12 bg-white dark:bg-background border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight mb-0.5">Available Sports</h2>
              <p className="text-sm text-muted-foreground">Select a sport to view courts and availability.</p>
            </div>
            <Link href="/sports" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "hidden sm:flex")}>
              View all <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sports.map((sport) => {
              const activeCourts = sport.courts.length;
              const minPrice = sport.courts.length > 0
                ? Math.min(...sport.courts.map(c => c.pricePerHour))
                : 0;

              return (
                <Link key={sport.id} href={`/sports/${sport.slug}`} className="group block">
                  <Card className="border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 hover:border-primary/20 hover:shadow-md transition-all duration-200">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-10 h-10 shrink-0 rounded-lg bg-primary/8 border border-primary/10 flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-200">
                        {sport.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold mb-0.5 text-slate-900 dark:text-white">{sport.name}</h3>
                        <p className="text-xs text-slate-500">
                          {activeCourts} Courts
                          {minPrice > 0 && ` · From Rp ${minPrice.toLocaleString('id-ID')}/hr`}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          <div className="mt-4 text-center sm:hidden">
            <Link href="/sports" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full")}>
              View all sports
            </Link>
          </div>
        </div>
      </section>

      {/* Features/Stats Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Premium Courts</h3>
              <p className="text-slate-500 text-sm">International standard facilities for your best performance.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                <CalendarDays className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Instant Booking</h3>
              <p className="text-slate-500 text-sm">Real-time availability and instant confirmation with QR codes.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Community</h3>
              <p className="text-slate-500 text-sm">Join clubs, participate in events, and meet other athletes.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

