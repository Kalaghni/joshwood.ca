import { getCurrentUser } from "@/lib/auth";
import { UserForm } from "@/app/(admin)/admin/(dashboard)/users/user-form";
import { redirect } from "next/navigation";

export default async function NewUserPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "admin") {
    redirect("/admin");
  }

  return (
    <div className="max-w-3xl">
      <UserForm />
    </div>
  );
}
