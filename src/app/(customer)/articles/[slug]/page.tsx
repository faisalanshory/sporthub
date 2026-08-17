import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { format } from "date-fns";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;

  const article = await db.article.findUnique({
    where: { slug },
    include: { author: true }
  });

  if (!article) notFound();

  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      <Link href="/articles" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Articles
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
          {article.title}
        </h1>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
            {article.author.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-slate-100">{article.author.name}</p>
            <p>{format(article.publishedAt, "MMMM dd, yyyy")}</p>
          </div>
        </div>
      </div>

      {article.coverImage && (
        <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-12 shadow-xl shadow-primary/5">
          <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
        {article.content}
      </div>
    </article>
  );
}
