import { getBlogs } from "@/lib/blogs";
import { BlogsTable } from "./blogs-table";

export default async function AdminBlogsPage() {
  const blogs = await getBlogs(false);

  return (
    <div>
      <BlogsTable blogs={blogs} />
    </div>
  );
}
