import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Activity } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminHighlightsPage() {
  const highlights = await db.highlight.findMany({
    orderBy: { createdAt: "desc" },
    take: 20
  });

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Activity Feed</h1>
        <p className="text-muted-foreground mt-1">Automatic log of recent user activities and system events.</p>
      </div>

      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="w-5 h-5 text-primary" /> System Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {highlights.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                No activity recorded yet.
              </div>
            ) : (
              highlights.map((log) => (
                <div key={log.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Activity className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-slate-900 dark:text-slate-100">
                        {log.title}
                      </p>
                      {log.description && (
                        <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">
                          {log.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2 font-mono">
                        {format(log.createdAt, "dd MMM yyyy, HH:mm")}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
