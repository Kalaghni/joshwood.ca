import { notFound } from "next/navigation";
import { getBlogById } from "@/lib/blogs";
import { getCurrentUser } from "@/lib/auth";
import BlogArticle from "@/components/blog/blog-article";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Draft Preview | Josh Wood",
  robots: { index: false, follow: false },
};

export default async function BlogPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    notFound();
  }

  const { id } = await params;
  const blog = await getBlogById(id);
  if (!blog) {
    notFound();
  }

  return <BlogArticle blog={blog} />;
}
