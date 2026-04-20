import {notFound, redirect} from "next/navigation";
import { getUserById } from "@/lib/users";
import { getCurrentUser } from "@/lib/auth";
import { UserForm } from "@/app/(admin)/admin/(dashboard)/users/user-form";


export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "admin") {
    redirect("/admin");
  }

  const { id } = await params;
  const user = await getUserById(id);

  if (!user) {
    notFound();
  }

  const isCurrentUser = user._id === currentUser._id;

  return (
    <div className="max-w-3xl">
      <UserForm user={user} isCurrentUser={isCurrentUser} />
    </div>
  );
}
