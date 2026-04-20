import { notFound } from "next/navigation";
import { getExperienceById } from "@/lib/experiences";
import { ExperienceForm } from "@/app/(admin)/admin/(dashboard)/experiences/experience-form";

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const experience = await getExperienceById(id);

  if (!experience) {
    notFound();
  }

  return (
    <div className="max-w-3xl">
      <ExperienceForm experience={experience} />
    </div>
  );
}
