import { getExperiences } from "@/lib/experiences";
import { ExperiencesTable } from "@/app/(admin)/admin/(dashboard)/experiences/experiences-table";

export default async function AdminExperiencesPage() {
  const experiences = await getExperiences(false); // Get all experiences including drafts

  return (
    <div>
      <ExperiencesTable experiences={experiences} />
    </div>
  );
}
