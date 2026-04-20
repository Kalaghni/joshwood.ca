import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/projects";
import { ProjectForm } from "@/app/(admin)/admin/(dashboard)/projects/project-form";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="max-w-3xl">
      <ProjectForm project={project} />
    </div>
  );
}
