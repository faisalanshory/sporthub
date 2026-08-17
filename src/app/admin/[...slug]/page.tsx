import { Card, CardContent } from "@/components/ui/card";
import { Wrench, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function AdminComingSoonPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] max-w-2xl mx-auto text-center space-y-8">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
        <Wrench className="w-12 h-12 text-primary" />
      </div>
      
      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight">Under Construction</h1>
        <p className="text-lg text-slate-500 dark:text-slate-400">
          This admin module is currently being built and will be available in the full release.
          Only the <strong>Calendar</strong> and <strong>Sports</strong> modules are accessible in this demo.
        </p>
      </div>

      <Card className="w-full bg-slate-50 dark:bg-slate-900/50 border-dashed border-2">
        <CardContent className="p-6">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            You tried to access a route that hasn't been implemented in the current Proof of Concept (POC) phase.
          </p>
        </CardContent>
      </Card>

      <Link href="/admin" className={cn(buttonVariants({ size: "lg" }), "shadow-lg shadow-primary/20")}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
      </Link>
    </div>
  );
}
