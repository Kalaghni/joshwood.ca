import { NextResponse } from "next/server";
import {
  getBlogById,
  updateBlog,
  deleteBlog,
  BlogSlugConflictError,
} from "@/lib/blogs";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const blog = await getBlogById(id);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    return NextResponse.json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
    if (data.body !== undefined) updateData.body = data.body;
    if (data.cover !== undefined) updateData.cover = data.cover;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.publishedAt !== undefined)
      updateData.publishedAt = data.publishedAt ? new Date(data.publishedAt) : null;
    if (data.seo !== undefined) updateData.seo = data.seo;
    if (data.published !== undefined) updateData.published = data.published;
    if (data.order !== undefined) updateData.order = data.order;

    const blog = await updateBlog(id, updateData);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    return NextResponse.json(blog);
  } catch (error) {
    if (error instanceof BlogSlugConflictError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const deleted = await deleteBlog(id);
    if (!deleted) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 }
    );
  }
}
