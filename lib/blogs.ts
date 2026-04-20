import { ObjectId } from "mongodb";
import { getDatabase } from "./mongodb";

export interface BlogSeo {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  keywords?: string[];
}

export interface Blog {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  cover?: string;
  tags?: string[];
  publishedAt?: Date | null;
  seo?: BlogSeo;
  published: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export type BlogInput = Omit<Blog, "_id" | "createdAt" | "updatedAt">;

const COLLECTION = "blogs";

export class BlogSlugConflictError extends Error {
  constructor(slug: string) {
    super(`Slug "${slug}" is already in use`);
    this.name = "BlogSlugConflictError";
  }
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalize(doc: Record<string, unknown>): Blog {
  return {
    ...doc,
    _id: (doc._id as ObjectId).toString(),
  } as Blog;
}

export async function getBlogs(publishedOnly = false): Promise<Blog[]> {
  const db = await getDatabase();
  const query = publishedOnly ? { published: true } : {};
  const docs = await db
    .collection(COLLECTION)
    .find(query)
    .sort({ publishedAt: -1, createdAt: -1 })
    .toArray();
  return docs.map(normalize);
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const db = await getDatabase();
  const doc = await db.collection(COLLECTION).findOne({ slug });
  return doc ? normalize(doc) : null;
}

export async function getBlogById(id: string): Promise<Blog | null> {
  const db = await getDatabase();
  if (!ObjectId.isValid(id)) return null;
  const doc = await db
    .collection(COLLECTION)
    .findOne({ _id: new ObjectId(id) });
  return doc ? normalize(doc) : null;
}

async function assertSlugAvailable(slug: string, ignoreId?: string) {
  const db = await getDatabase();
  const existing = await db.collection(COLLECTION).findOne({ slug });
  if (existing && (!ignoreId || existing._id.toString() !== ignoreId)) {
    throw new BlogSlugConflictError(slug);
  }
}

export async function createBlog(data: BlogInput): Promise<Blog> {
  await assertSlugAvailable(data.slug);
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

export async function updateBlog(
  id: string,
  data: Partial<BlogInput>
): Promise<Blog | null> {
  if (!ObjectId.isValid(id)) return null;
  if (data.slug) {
    await assertSlugAvailable(data.slug, id);
  }
  const db = await getDatabase();
  const now = new Date();
  const result = await db.collection(COLLECTION).findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...data, updatedAt: now } },
    { returnDocument: "after" }
  );
  return result ? normalize(result) : null;
}

export async function deleteBlog(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDatabase();
  const result = await db
    .collection(COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}
