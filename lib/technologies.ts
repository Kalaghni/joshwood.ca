import { ObjectId } from "mongodb";
import { getDatabase } from "./mongodb";
import type { TechGroup } from "@/configs/technologies.config";

export interface Technology {
  _id?: string;
  name: string;
  group: TechGroup;
  href?: string;
  blurb?: string;
  icon?: string;
  published: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export type TechnologyInput = Omit<Technology, "_id" | "createdAt" | "updatedAt">;

const COLLECTION = "technologies";

export async function getTechnologies(publishedOnly = false): Promise<Technology[]> {
  const db = await getDatabase();
  const query = publishedOnly ? { published: true } : {};
  const technologies = await db
    .collection(COLLECTION)
    .find(query)
    .sort({ order: 1, createdAt: -1 })
    .toArray();

  return technologies.map((t) => ({
    ...t,
    _id: t._id.toString(),
  })) as Technology[];
}

export async function getTechnologyById(id: string): Promise<Technology | null> {
  const db = await getDatabase();
  const technology = await db
    .collection(COLLECTION)
    .findOne({ _id: new ObjectId(id) });

  if (!technology) return null;

  return {
    ...technology,
    _id: technology._id.toString(),
  } as Technology;
}

export async function createTechnology(data: TechnologyInput): Promise<Technology> {
  const db = await getDatabase();
  const now = new Date();

  const result = await db.collection(COLLECTION).insertOne({
    ...data,
    createdAt: now,
    updatedAt: now,
  });

  return {
    ...data,
    _id: result.insertedId.toString(),
    createdAt: now,
    updatedAt: now,
  };
}

export async function updateTechnology(
  id: string,
  data: Partial<TechnologyInput>
): Promise<Technology | null> {
  const db = await getDatabase();
  const now = new Date();

  const result = await db.collection(COLLECTION).findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...data,
        updatedAt: now,
      },
    },
    { returnDocument: "after" }
  );

  if (!result) return null;

  return {
    ...result,
    _id: result._id.toString(),
  } as Technology;
}

export async function deleteTechnology(id: string): Promise<boolean> {
  const db = await getDatabase();
  const result = await db
    .collection(COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });

  return result.deletedCount === 1;
}

export async function migrateTechnologyIcons(): Promise<void> {
  const db = await getDatabase();
  const docs = await db
    .collection(COLLECTION)
    .find({ $or: [{ icon: { $exists: false } }, { icon: null }, { icon: "" }] })
    .project({ _id: 1, name: 1 })
    .toArray();

  if (docs.length === 0) return;

  const { iconKeyForTechnology } = await import("@/configs/technologies.config");
  const ops = docs.map((d) => ({
    updateOne: {
      filter: { _id: d._id },
      update: { $set: { icon: iconKeyForTechnology(d.name as string) } },
    },
  }));

  if (ops.length) await db.collection(COLLECTION).bulkWrite(ops);
}

// Seed initial technologies from the config file
export async function seedTechnologies(): Promise<void> {
  const db = await getDatabase();
  const count = await db.collection(COLLECTION).countDocuments();

  if (count > 0) return; // Already seeded

  const { technologies: initial, iconKeyForTechnology } = await import("@/configs/technologies.config");
  const now = new Date();

  const docs: Omit<Technology, "_id">[] = initial.map((t, i) => ({
    name: t.name,
    group: t.group,
    href: t.href,
    blurb: t.blurb,
    icon: t.icon || iconKeyForTechnology(t.name),
    published: true,
    order: i,
    createdAt: now,
    updatedAt: now,
  }));

  await db.collection(COLLECTION).insertMany(docs);
}
