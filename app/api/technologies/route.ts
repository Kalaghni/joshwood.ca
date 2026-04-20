import { NextResponse } from "next/server";
import { getTechnologies, createTechnology, seedTechnologies } from "@/lib/technologies";
import { getCurrentUser } from "@/lib/auth";
import type { TechGroup } from "@/configs/technologies.config";

const VALID_GROUPS: TechGroup[] = [
  "Frontend",
  "Backend",
  "Data",
  "DevOps",
  "Integrations",
  "AI",
  "Other",
];

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

    await seedTechnologies();

    const technologies = await getTechnologies(!all);
    return NextResponse.json(technologies);
  } catch (error) {
    console.error("Error fetching technologies:", error);
    return NextResponse.json(
      { error: "Failed to fetch technologies" },
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

    if (!data.name || !data.group) {
      return NextResponse.json(
        { error: "Name and group are required" },
        { status: 400 }
      );
    }

    if (!VALID_GROUPS.includes(data.group)) {
      return NextResponse.json(
        { error: `Group must be one of: ${VALID_GROUPS.join(", ")}` },
        { status: 400 }
      );
    }

    const technology = await createTechnology({
      name: data.name,
      group: data.group,
      href: data.href || undefined,
      blurb: data.blurb || undefined,
      icon: data.icon || undefined,
      published: data.published ?? false,
      order: data.order ?? 0,
    });

    return NextResponse.json(technology, { status: 201 });
  } catch (error) {
    console.error("Error creating technology:", error);
    return NextResponse.json(
      { error: "Failed to create technology" },
      { status: 500 }
    );
  }
}
