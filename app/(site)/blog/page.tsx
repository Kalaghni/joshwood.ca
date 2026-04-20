import type { Metadata } from "next";
import { getBlogs } from "@/lib/blogs";
import BlogCard from "@/components/blog/blog-card";

export const metadata: Metadata = {
  title: "Blog | Josh Wood",
  description: "Writing on software, tools, and the occasional tangent.",
};

export const dynamic = "force-dynamic";

export default async function BlogIndexPage() {
  const blogs = await getBlogs(true);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-10 space-y-3">
        <h1 className="text-4xl font-heading">Blog</h1>
        <p className="text-muted-foreground">
          Writing on software, tools, and the occasional tangent.
        </p>
      </header>

      {blogs.length === 0 ? (
        <p className="text-muted-foreground">No posts yet. Check back soon.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </main>
  );
}
