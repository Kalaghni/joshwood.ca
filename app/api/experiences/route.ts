import { NextResponse } from "next/server";
import { getExperiences, createExperience, seedExperiences } from "@/lib/experiences";
import { getCurrentUser } from "@/lib/auth";

// GET /api/experiences - Get all experiences (public: published only, admin: all)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";

    // If requesting all experiences, verify admin auth
    if (all) {
      const user = await getCurrentUser();
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    // Seed experiences if none exist
    await seedExperiences();

    const experiences = await getExperiences(!all);
    return NextResponse.json(experiences);
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return NextResponse.json(
      { error: "Failed to fetch experiences" },
      { status: 500 }
    );
  }
}

// POST /api/experiences - Create a new experience (admin only)
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.title || !data.slug || !data.role || !data.description) {
      return NextResponse.json(
        { error: "Title, slug, role, and description are required" },
        { status: 400 }
      );
    }

    const experience = await createExperience({
      title: data.title,
      slug: data.slug,
      location: data.location || "",
      website: data.website || "",
      role: data.role,
      description: data.description,
      skills: data.skills || [],
      footerLink: data.footerLink || undefined,
      published: data.published ?? false,
      order: data.order ?? 0,
    });

    return NextResponse.json(experience, { status: 201 });
  } catch (error) {
    console.error("Error creating experience:", error);
    return NextResponse.json(
      { error: "Failed to create experience" },
      { status: 500 }
    );
  }
}
