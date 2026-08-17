import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, LayoutDashboard } from "lucide-react";
import { AddSportClient } from "./add-sport-client";

export const dynamic = "force-dynamic";

export default async function AdminSportsPage() {
  const sports = await db.sport.findMany({
    include: {
      venue: true,
      _count: {
        select: { courts: true, events: true }
      }
    },
    orderBy: { sortOrder: "asc" }
  });

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sports and Court</h1>
          <p className="text-muted-foreground mt-1">Manage the types of sports offered at your venues.</p>
        </div>
        <AddSportClient />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sports.map((sport) => (
          <Card key={sport.id} className="overflow-hidden border-slate-200 dark:border-slate-800">
            <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b pb-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-lg">
                    {sport.icon || <Trophy className="w-5 h-5 text-primary" />}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{sport.name}</CardTitle>
                    <CardDescription className="text-xs mt-0.5">{sport.slug}</CardDescription>
                  </div>
                </div>
                <Badge variant={sport.isActive ? "default" : "secondary"}>
                  {sport.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
                <span className="flex items-center gap-1.5"><LayoutDashboard className="w-4 h-4" /> Courts</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{sport._count.courts}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5"><Trophy className="w-4 h-4" /> Events</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{sport._count.events}</span>
              </div>
              
              <div className="mt-6 flex gap-2">
                <Button variant="outline" size="sm" className="w-full">Edit</Button>
                <Button variant="outline" size="sm" className="w-full">Manage Courts</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {sports.length === 0 && (
          <div className="col-span-full p-8 text-center bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed">
            <p className="text-muted-foreground">No sports added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
