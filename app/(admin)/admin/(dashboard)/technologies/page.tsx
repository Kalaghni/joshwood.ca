import { getTechnologies, seedTechnologies } from "@/lib/technologies";
import { TechnologiesTable } from "@/app/(admin)/admin/(dashboard)/technologies/technologies-table";

export default async function AdminTechnologiesPage() {
  await seedTechnologies();
  const technologies = await getTechnologies(false);

  return (
    <div>
      <TechnologiesTable technologies={technologies} />
    </div>
  );
}
