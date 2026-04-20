import { NextResponse } from "next/server";
import { getTechnologyById, updateTechnology, deleteTechnology } from "@/lib/technologies";
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const technology = await getTechnologyById(id);

    if (!technology) {
      return NextResponse.json({ error: "Technology not found" }, { status: 404 });
    }

    return NextResponse.json(technology);
  } catch (error) {
    console.error("Error fetching technology:", error);
    return NextResponse.json(
      { error: "Failed to fetch technology" },
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

    if (data.group !== undefined && !VALID_GROUPS.includes(data.group)) {
      return NextResponse.json(
        { error: `Group must be one of: ${VALID_GROUPS.join(", ")}` },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.group !== undefined) updateData.group = data.group;
    if (data.href !== undefined) updateData.href = data.href || undefined;
    if (data.blurb !== undefined) updateData.blurb = data.blurb || undefined;
    if (data.icon !== undefined) updateData.icon = data.icon || undefined;
    if (data.published !== undefined) updateData.published = data.published;
    if (data.order !== undefined) updateData.order = data.order;

    const technology = await updateTechnology(id, updateData);

    if (!technology) {
      return NextResponse.json({ error: "Technology not found" }, { status: 404 });
    }

    return NextResponse.json(technology);
  } catch (error) {
    console.error("Error updating technology:", error);
    return NextResponse.json(
      { error: "Failed to update technology" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const deleted = await deleteTechnology(id);

    if (!deleted) {
      return NextResponse.json({ error: "Technology not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting technology:", error);
    return NextResponse.json(
      { error: "Failed to delete technology" },
      { status: 500 }
    );
  }
}
