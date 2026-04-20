import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Blog } from "@/lib/blogs";

function formatDate(date: Date | string | null | undefined) {
  if (!date) return null;
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BlogCard({ blog }: { blog: Blog }) {
  const displayDate = formatDate(blog.publishedAt) || formatDate(blog.createdAt);
  return (
    <Link href={`/blog/${blog.slug}`} className="group block">
      <Card className="h-full overflow-hidden transition-colors group-hover:border-primary/50">
        {blog.cover && (
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <Image
              src={blog.cover}
              alt={blog.title}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
        )}
        <CardContent className="space-y-3 p-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {displayDate && <span>{displayDate}</span>}
          </div>
          <h2 className="text-xl font-heading line-clamp-2">{blog.title}</h2>
          {blog.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {blog.excerpt}
            </p>
          )}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {blog.tags.slice(0, 4).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
