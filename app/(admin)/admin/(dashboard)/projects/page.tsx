import { getProjects } from "@/lib/projects";
import { ProjectsTable } from "@/app/(admin)/admin/(dashboard)/projects/projects-table";

export default async function AdminProjectsPage() {
  const projects = await getProjects(false); // Get all projects including drafts

  return (
    <div>
      <ProjectsTable projects={projects} />
    </div>
  );
}
