import { NextResponse } from "next/server";
import { getUsers, createUser, migrateUsersAddRole } from "@/lib/users";
import { getCurrentUser } from "@/lib/auth";

// GET /api/users - Get all users (admin only)
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Migrate existing users to add role field if needed
    await migrateUsersAddRole();

    const users = await getUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user (admin only)
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.email || !data.name || !data.role) {
      return NextResponse.json(
        { error: "Email, name, and role are required" },
        { status: 400 }
      );
    }

    // Validate role
    if (!["admin", "client"].includes(data.role)) {
      return NextResponse.json(
        { error: "Role must be 'admin' or 'client'" },
        { status: 400 }
      );
    }

    const user = await createUser({
      email: data.email,
      name: data.name,
      password: data.password,
      role: data.role,
      active: data.active ?? true,
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    const message = error instanceof Error ? error.message : "Failed to create user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
