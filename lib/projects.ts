import { ObjectId } from "mongodb";
import { getDatabase } from "./mongodb";

export interface GettingStartedSection {
  title: string;
  content?: string;
  code?: string;
  language?: string;
}

export interface GitHubBadge {
  workflowUrl: string;
  branch?: string;
  label?: string;
}

export interface Project {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  body?: string;
  cover?: string;
  tech?: string[];
  githubUrl?: string;
  demoUrl?: string;
  githubBadge?: GitHubBadge;
  content?: string;
  gettingStarted?: GettingStartedSection[];
  published: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectInput = Omit<Project, "_id" | "createdAt" | "updatedAt">;

const COLLECTION = "projects";

export async function getProjects(publishedOnly = false): Promise<Project[]> {
  const db = await getDatabase();
  const query = publishedOnly ? { published: true } : {};
  const projects = await db
    .collection(COLLECTION)
    .find(query)
    .sort({ order: 1, createdAt: -1 })
    .toArray();

  return projects.map((p) => ({
    ...p,
    _id: p._id.toString(),
  })) as Project[];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const db = await getDatabase();
  const project = await db.collection(COLLECTION).findOne({ slug });

  if (!project) return null;

  return {
    ...project,
    _id: project._id.toString(),
  } as Project;
}

export async function getProjectById(id: string): Promise<Project | null> {
  const db = await getDatabase();
  const project = await db
    .collection(COLLECTION)
    .findOne({ _id: new ObjectId(id) });

  if (!project) return null;

  return {
    ...project,
    _id: project._id.toString(),
  } as Project;
}

export async function createProject(data: ProjectInput): Promise<Project> {
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

export async function updateProject(
  id: string,
  data: Partial<ProjectInput>
): Promise<Project | null> {
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
  } as Project;
}

export async function deleteProject(id: string): Promise<boolean> {
  const db = await getDatabase();
  const result = await db
    .collection(COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });

  return result.deletedCount === 1;
}

// Seed initial projects from config
export async function seedProjects(): Promise<void> {
  const db = await getDatabase();
  const count = await db.collection(COLLECTION).countDocuments();

  if (count > 0) return; // Already seeded

  const initialProjects: Omit<Project, "_id">[] = [
    {
      title: "Shell-GPT",
      slug: "shell-gpt",
      description:
        "An Electron-based 'shell' that wraps GPT and executes its commands in a Docker container.",
      cover: "/shell-gpt-screenshot.png",
      tech: ["TypeScript", "Electron", "OpenAI", "Docker"],
      githubUrl: "https://github.com/Kalaghni/shell-gpt",
      published: true,
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "echoSH",
      slug: "echo-sh",
      description:
        "The Synesthetic Terminal — transforms your CLI workflow into an immersive generative audio experience.",
      cover: "/echosh-demo.webp",
      tech: ["TypeScript", "Electron", "Node.js", "Web Audio"],
      githubUrl: "https://github.com/stiamprie/sirocco",
      published: true,
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "Redux-Calculator",
      slug: "redux-calculator",
      description:
        "A calculator built with React and Redux demonstrating state management patterns.",
      cover: "/redux-calculator.png",
      tech: ["React", "Redux", "TypeScript"],
      githubUrl: "https://github.com/Kalaghni/Redux-Calculator",
      demoUrl: "https://reduxcalc.joshwood.ca",
      published: true,
      order: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  await db.collection(COLLECTION).insertMany(initialProjects);
}
