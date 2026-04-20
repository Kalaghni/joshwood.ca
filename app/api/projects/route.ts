import { NextResponse } from "next/server";
import { getProjects, createProject, seedProjects } from "@/lib/projects";
import { getCurrentUser } from "@/lib/auth";

// GET /api/projects - Get all projects (public: published only, admin: all)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";

    // If requesting all projects, verify admin auth
    if (all) {
      const user = await getCurrentUser();
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    // Seed projects if none exist
    await seedProjects();

    const projects = await getProjects(!all);
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project (admin only)
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.title || !data.slug || !data.description) {
      return NextResponse.json(
        { error: "Title, slug, and description are required" },
        { status: 400 }
      );
    }

    const project = await createProject({
      title: data.title,
      slug: data.slug,
      description: data.description,
      body: data.body || "",
      cover: data.cover || "",
      tech: data.tech || [],
      githubUrl: data.githubUrl || "",
      demoUrl: data.demoUrl || "",
      githubBadge: data.githubBadge || undefined,
      content: data.content || "",
      gettingStarted: data.gettingStarted || [],
      published: data.published ?? false,
      order: data.order ?? 0,
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
