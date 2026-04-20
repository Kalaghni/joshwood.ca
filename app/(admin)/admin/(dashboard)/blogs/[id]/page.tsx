import { notFound } from "next/navigation";
import { getBlogById } from "@/lib/blogs";
import { BlogForm } from "../blog-form";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const blog = await getBlogById(id);
  if (!blog) {
    notFound();
  }

  return (
    <div className="max-w-6xl">
      <BlogForm blog={blog} />
    </div>
  );
}
