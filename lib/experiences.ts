import { ObjectId } from "mongodb";
import { getDatabase } from "./mongodb";

export interface Experience {
  _id?: string;
  title: string;
  slug: string;
  location: string;
  website?: string;
  role: string;
  description: string;
  skills: string[];
  footerLink?: {
    href: string;
    label: string;
  };
  published: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ExperienceInput = Omit<Experience, "_id" | "createdAt" | "updatedAt">;

const COLLECTION = "experiences";

export async function getExperiences(publishedOnly = false): Promise<Experience[]> {
  const db = await getDatabase();
  const query = publishedOnly ? { published: true } : {};
  const experiences = await db
    .collection(COLLECTION)
    .find(query)
    .sort({ order: 1, createdAt: -1 })
    .toArray();

  return experiences.map((e) => ({
    ...e,
    _id: e._id.toString(),
  })) as Experience[];
}

export async function getExperienceBySlug(slug: string): Promise<Experience | null> {
  const db = await getDatabase();
  const experience = await db.collection(COLLECTION).findOne({ slug });

  if (!experience) return null;

  return {
    ...experience,
    _id: experience._id.toString(),
  } as Experience;
}

export async function getExperienceById(id: string): Promise<Experience | null> {
  const db = await getDatabase();
  const experience = await db
    .collection(COLLECTION)
    .findOne({ _id: new ObjectId(id) });

  if (!experience) return null;

  return {
    ...experience,
    _id: experience._id.toString(),
  } as Experience;
}

export async function createExperience(data: ExperienceInput): Promise<Experience> {
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

export async function updateExperience(
  id: string,
  data: Partial<ExperienceInput>
): Promise<Experience | null> {
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
  } as Experience;
}

export async function deleteExperience(id: string): Promise<boolean> {
  const db = await getDatabase();
  const result = await db
    .collection(COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });

  return result.deletedCount === 1;
}

// Seed initial experiences from existing data
export async function seedExperiences(): Promise<void> {
  const db = await getDatabase();
  const count = await db.collection(COLLECTION).countDocuments();

  if (count > 0) return; // Already seeded

  const initialExperiences: Omit<Experience, "_id">[] = [
    {
      title: "The Watering Can Flower Market",
      slug: "the-watering-can",
      location: "Vineland, ON",
      website: "https://thewateringcan.ca",
      role: "Lead Developer",
      description:
        "At The Watering Can Flower Market, I serve as the lead developer responsible for architecting, developing, and maintaining a diverse portfolio of web applications, system services, and internal tools to support a busy retail and eCommerce operation. Our primary technology stack includes WordPress with WooCommerce, which powers the bulk of our online storefront and order management system, but I also work across a broad range of languages and platforms—including TypeScript, React, PHP, Python, C#, MySQL, and Dockerized deployments on Linux servers.",
      skills: [
        "Full-Stack Development",
        "Modern Web Applications",
        "Automation & System Services",
        "API Integration",
        "DevOps & Deployment",
        "Problem Solving & Support",
        "Cross-Disciplinary Collaboration",
      ],
      footerLink: {
        href: "/the-watering-can",
        label: "Read more about my work at The Watering Can",
      },
      published: true,
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "Expanded Living",
      slug: "expanded-living",
      location: "Niagara, ON",
      website: "https://expandedliving.ca",
      role: "Freelance Web Developer/Consultant",
      description:
        "I partnered with Expanded Living—a local business offering life coaching and dance classes—to design, develop, and launch their WordPress-based website. The project focused on creating a professional, approachable digital presence that supports the client's unique business model.",
      skills: [
        "Custom WordPress Site",
        "Online Scheduling Integration",
        "Automated Communications",
        "Content Management Training",
      ],
      published: true,
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "The Timeless Colours",
      slug: "timeless-colours",
      location: "St. Catharines, ON",
      website: "https://thetimelesscolours.ca",
      role: "Freelance Web Developer/Consultant",
      description:
        "For The Timeless Colours, I developed a simple yet elegant WordPress website to serve as an online showcase for the business. Though a straightforward project, it demonstrates my ability to deliver polished, reliable web solutions for clients with a wide range of needs and budgets.",
      skills: [
        "Website Setup & Customization",
        "Performance & Security",
        "Client Handoff",
        "Content Management Training",
      ],
      published: true,
      order: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  await db.collection(COLLECTION).insertMany(initialExperiences);
}
