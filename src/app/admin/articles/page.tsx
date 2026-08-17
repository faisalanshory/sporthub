import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AddArticleClient } from "./add-article-client";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  const articles = await db.article.findMany({
    orderBy: { publishedAt: "desc" },
    include: {
      author: true
    }
  });

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Articles</h1>
          <p className="text-muted-foreground mt-1">Manage blog posts, tips, and news for your customers.</p>
        </div>
        <AddArticleClient />
      </div>

      <Card className="border-slate-200 dark:border-slate-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                <TableRow>
                  <TableHead className="font-semibold w-[50%]">Article</TableHead>
                  <TableHead className="font-semibold">Author</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-right font-semibold">Published</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      No articles published yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  articles.map((article) => (
                    <TableRow key={article.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {article.coverImage && (
                            <div className="w-16 h-12 rounded bg-slate-100 shrink-0 overflow-hidden">
                              <img src={article.coverImage} alt="" className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-sm line-clamp-1">{article.title}</div>
                            <div className="text-xs text-muted-foreground mt-1 font-mono">
                              /{article.slug}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                            <User className="w-3 h-3" />
                          </div>
                          {article.author.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">Published</Badge>
                      </TableCell>
                      <TableCell className="text-right text-xs text-slate-500">
                        {format(article.publishedAt, "dd MMM yyyy")}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
