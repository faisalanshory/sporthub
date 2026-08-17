import { db } from "@/lib/db";
import { format } from "date-fns";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
  const articles = await db.article.findMany({
    include: { author: true },
    orderBy: { publishedAt: "desc" }
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl min-h-[70vh]">
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary" /> Articles & News
          </h1>
          <p className="text-lg text-muted-foreground">
            Tips, tricks, and the latest news from the sports community.
          </p>
        </div>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed rounded-xl border-slate-200 dark:border-slate-800">
          <p className="text-muted-foreground">No articles published yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link href={`/articles/${article.slug}`} key={article.id} className="group block h-full">
              <Card className="h-full overflow-hidden hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 flex flex-col border-0 bg-slate-50 dark:bg-slate-900/50">
                <div className="relative aspect-video bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  {article.coverImage ? (
                    <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
                  )}
                </div>
                <CardContent className="p-6 flex-grow flex flex-col">
                  <p className="text-xs font-semibold text-primary mb-3">
                    {format(article.publishedAt, "dd MMM yyyy")} &bull; By {article.author.name}
                  </p>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mt-auto">
                    {article.content}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
