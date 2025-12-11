import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { getDatabase } from "./mongodb";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
);

export interface AdminUser {
  _id: string;
  email: string;
  name: string;
}

export async function createToken(user: AdminUser): Promise<string> {
  return new SignJWT({ userId: user._id, email: user.email, name: user.name })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<AdminUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      _id: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string,
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function validateCredentials(
  email: string,
  password: string
): Promise<AdminUser | null> {
  const db = await getDatabase();
  const user = await db.collection("admin_users").findOne({ email });

  if (!user) return null;

  // Simple password comparison - in production use bcrypt
  // For now, storing hashed passwords in MongoDB
  const bcrypt = await import("bcryptjs");
  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) return null;

  return {
    _id: user._id.toString(),
    email: user.email,
    name: user.name,
  };
}
