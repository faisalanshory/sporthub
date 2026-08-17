import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, LayoutDashboard } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SportsPage() {
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-6xl">
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Choose Your Sport</h1>
        <p className="text-lg text-muted-foreground">
          Select a sport to view available courts and book your session instantly.
        </p>
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
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 border">
                    {sport.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{sport.name}</h3>
                  <div className="space-y-1 mb-6">
                    <p className="text-sm text-slate-500 flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" /> {activeCourts} Active Courts
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
                    View courts <ArrowRight className="ml-1 w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
