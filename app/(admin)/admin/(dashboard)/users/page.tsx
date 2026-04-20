import { getUsers, migrateUsersAddRole } from "@/lib/users";
import { getCurrentUser } from "@/lib/auth";
import { UsersTable } from "@/app/(admin)/admin/(dashboard)/users/users-table";
import { redirect } from "next/navigation";

export default async function AdminUsersPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "admin") {
    redirect("/admin");
  }

  // Migrate existing users to add role field if needed
  await migrateUsersAddRole();

  const users = await getUsers();

  return (
    <div>
      <UsersTable users={users} currentUserId={currentUser._id} />
    </div>
  );
}
