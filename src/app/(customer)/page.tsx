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
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 md:py-32 bg-slate-50 dark:bg-slate-950 overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
          <div className="w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        </div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3">
          <div className="w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto max-w-5xl text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            PLAY MORE. <br />
            <span className="text-primary">BOOK EASIER.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Find your court. Pick your time. Start playing. 
            Experience the most seamless sports venue booking platform designed for athletes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/sports" className={cn(buttonVariants({ size: "lg" }), "h-14 px-8 text-base shadow-xl shadow-primary/20")}>
              Book a Court <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link href="/events" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "h-14 px-8 text-base bg-white dark:bg-slate-900")}>
              Explore Events
            </Link>
          </div>
        </div>
      </section>

      {/* Sports Section */}
      <section className="py-24 bg-white dark:bg-background border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Available Sports</h2>
              <p className="text-muted-foreground">Select a sport to view courts and availability.</p>
            </div>
            <Link href="/sports" className={cn(buttonVariants({ variant: "ghost" }), "hidden sm:flex")}>
              View all <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sports.map((sport) => {
              const activeCourts = sport.courts.length;
              const minPrice = sport.courts.length > 0 
                ? Math.min(...sport.courts.map(c => c.pricePerHour)) 
                : 0;

              return (
                <Link key={sport.id} href={`/sports/${sport.slug}`} className="group block">
                  <Card className="h-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                        {sport.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{sport.name}</h3>
                      <div className="space-y-1 mb-6">
                        <p className="text-sm text-slate-500 flex items-center gap-2">
                          <LayoutDashboard className="w-4 h-4" /> {activeCourts} Courts
                        </p>
                        {minPrice > 0 && (
                          <p className="text-sm text-slate-500 flex items-center gap-2">
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                              From Rp {minPrice.toLocaleString('id-ID')}
                            </span>
                            / hour
                          </p>
                        )}
                      </div>
                      <div className="text-sm font-medium text-primary flex items-center group-hover:underline underline-offset-4">
                        Check availability <ArrowRight className="ml-1 w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link href="/sports" className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
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

// Just to avoid unresolved variable error in the map
const LayoutDashboard = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
);
