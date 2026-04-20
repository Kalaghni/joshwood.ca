import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Badge } from "@/components/ui/badge";
import type { Blog } from "@/lib/blogs";

function formatDate(date: Date | string | null | undefined) {
  if (!date) return null;
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogArticle({ blog }: { blog: Blog }) {
  const displayDate = formatDate(blog.publishedAt) || formatDate(blog.createdAt);

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <header className="mb-8 space-y-4">
        {!blog.published && (
          <Badge variant="destructive">Draft preview</Badge>
        )}
        <h1 className="text-4xl font-heading">{blog.title}</h1>
        {blog.excerpt && (
          <p className="text-lg text-muted-foreground">{blog.excerpt}</p>
        )}
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          {displayDate && <span>{displayDate}</span>}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </header>

      {blog.cover && (
        <div className="relative mb-10 aspect-[16/9] w-full overflow-hidden rounded-lg border border-border/50">
          <Image
            src={blog.cover}
            alt={blog.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="prose prose-invert max-w-none prose-headings:font-heading prose-a:text-primary">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{blog.body}</ReactMarkdown>
      </div>
    </article>
  );
}
