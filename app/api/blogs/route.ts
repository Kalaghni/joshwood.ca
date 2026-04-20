import { NextResponse } from "next/server";
import {
  getBlogs,
  createBlog,
  slugify,
  BlogSlugConflictError,
} from "@/lib/blogs";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";

    if (all) {
      const user = await getCurrentUser();
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const blogs = await getBlogs(!all);
    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    if (!data.title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const slug = (data.slug && data.slug.trim()) || slugify(data.title);
    if (!slug) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }

    const publishedAt = data.publishedAt ? new Date(data.publishedAt) : null;

    const blog = await createBlog({
      title: data.title,
      slug,
      excerpt: data.excerpt || "",
      body: data.body || "",
      cover: data.cover || "",
      tags: data.tags || [],
      publishedAt,
      seo: data.seo || {},
      published: data.published ?? false,
      order: data.order ?? 0,
    });

    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    if (error instanceof BlogSlugConflictError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}
