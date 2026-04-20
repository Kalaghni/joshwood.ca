import { ObjectId } from "mongodb";
import { getDatabase } from "./mongodb";
import bcrypt from "bcryptjs";

export type UserRole = "admin" | "client";

export interface User {
  _id?: string;
  email: string;
  name: string;
  password?: string;
  role: UserRole;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserInput = {
  email: string;
  name: string;
  password?: string;
  role: UserRole;
  active?: boolean;
};

export type UserPublic = Omit<User, "password">;

const COLLECTION = "admin_users";

export async function getUsers(): Promise<UserPublic[]> {
  const db = await getDatabase();
  const users = await db
    .collection(COLLECTION)
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return users.map((u) => ({
    _id: u._id.toString(),
    email: u.email,
    name: u.name,
    role: u.role || "admin",
    active: u.active ?? true,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  })) as UserPublic[];
}

export async function getUserById(id: string): Promise<UserPublic | null> {
  const db = await getDatabase();
  const user = await db
    .collection(COLLECTION)
    .findOne({ _id: new ObjectId(id) });

  if (!user) return null;

  return {
    _id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role || "admin",
    active: user.active ?? true,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  } as UserPublic;
}

export async function getUserByEmail(email: string): Promise<UserPublic | null> {
  const db = await getDatabase();
  const user = await db.collection(COLLECTION).findOne({ email });

  if (!user) return null;

  return {
    _id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role || "admin",
    active: user.active ?? true,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  } as UserPublic;
}

export async function createUser(data: UserInput): Promise<UserPublic> {
  const db = await getDatabase();
  const now = new Date();

  // Check if user with email already exists
  const existing = await db.collection(COLLECTION).findOne({ email: data.email });
  if (existing) {
    throw new Error("A user with this email already exists");
  }

  // Hash password
  const hashedPassword = data.password
    ? await bcrypt.hash(data.password, 10)
    : await bcrypt.hash(Math.random().toString(36), 10); // Generate random password if not provided

  const result = await db.collection(COLLECTION).insertOne({
    email: data.email,
    name: data.name,
    password: hashedPassword,
    role: data.role,
    active: data.active ?? true,
    createdAt: now,
    updatedAt: now,
  });

  return {
    _id: result.insertedId.toString(),
    email: data.email,
    name: data.name,
    role: data.role,
    active: data.active ?? true,
    createdAt: now,
    updatedAt: now,
  };
}

export async function updateUser(
  id: string,
  data: Partial<UserInput>
): Promise<UserPublic | null> {
  const db = await getDatabase();
  const now = new Date();

  // If email is being changed, check for duplicates
  if (data.email) {
    const existing = await db.collection(COLLECTION).findOne({
      email: data.email,
      _id: { $ne: new ObjectId(id) },
    });
    if (existing) {
      throw new Error("A user with this email already exists");
    }
  }

  // Prepare update data
  const updateData: Record<string, unknown> = {
    ...data,
    updatedAt: now,
  };

  // Hash password if provided
  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  } else {
    delete updateData.password; // Don't update password if not provided
  }

  const result = await db.collection(COLLECTION).findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateData },
    { returnDocument: "after" }
  );

  if (!result) return null;

  return {
    _id: result._id.toString(),
    email: result.email,
    name: result.name,
    role: result.role || "admin",
    active: result.active ?? true,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
  } as UserPublic;
}

export async function deleteUser(id: string): Promise<boolean> {
  const db = await getDatabase();

  // Don't allow deleting the last admin user
  const admins = await db.collection(COLLECTION).countDocuments({ role: "admin" });
  const userToDelete = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });

  if (userToDelete?.role === "admin" && admins <= 1) {
    throw new Error("Cannot delete the last admin user");
  }

  const result = await db
    .collection(COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });

  return result.deletedCount === 1;
}

// Add role field to existing users that don't have it
export async function migrateUsersAddRole(): Promise<void> {
  const db = await getDatabase();
  await db.collection(COLLECTION).updateMany(
    { role: { $exists: false } },
    { $set: { role: "admin", active: true } }
  );
}
