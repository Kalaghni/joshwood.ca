import { NextResponse } from "next/server";
import { getUserById, updateUser, deleteUser } from "@/lib/users";
import { getCurrentUser } from "@/lib/auth";

// GET /api/users/[id] - Get a single user (admin only)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const user = await getUserById(id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Update a user (admin only)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    // Validate role if provided
    if (data.role && !["admin", "client"].includes(data.role)) {
      return NextResponse.json(
        { error: "Role must be 'admin' or 'client'" },
        { status: 400 }
      );
    }

    // Only include fields that are actually provided in the request
    const updateData: Record<string, unknown> = {};
    if (data.email !== undefined) updateData.email = data.email;
    if (data.name !== undefined) updateData.name = data.name;
    if (data.password !== undefined && data.password !== "") updateData.password = data.password;
    if (data.role !== undefined) updateData.role = data.role;
    if (data.active !== undefined) updateData.active = data.active;

    const user = await updateUser(id, updateData);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    const message = error instanceof Error ? error.message : "Failed to update user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/users/[id] - Delete a user (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Prevent self-deletion
    if (id === currentUser._id) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    const deleted = await deleteUser(id);

    if (!deleted) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    const message = error instanceof Error ? error.message : "Failed to delete user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
