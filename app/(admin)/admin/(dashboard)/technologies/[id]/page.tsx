import { notFound } from "next/navigation";
import { getTechnologyById } from "@/lib/technologies";
import { TechnologyForm } from "@/app/(admin)/admin/(dashboard)/technologies/technology-form";

export default async function EditTechnologyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const technology = await getTechnologyById(id);

  if (!technology) {
    notFound();
  }

  return (
    <div className="max-w-3xl">
      <TechnologyForm technology={technology} />
    </div>
  );
}
