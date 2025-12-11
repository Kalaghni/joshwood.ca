// Run with: npx tsx scripts/create-admin.ts
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

async function createAdmin() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error("Please set MONGODB_URI environment variable");
    process.exit(1);
  }

  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4] || "Admin";

  if (!email || !password) {
    console.error("Usage: npx tsx scripts/create-admin.ts <email> <password> [name]");
    process.exit(1);
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db("joshwood");

    const existingUser = await db.collection("admin_users").findOne({ email });
    if (existingUser) {
      console.error("User with this email already exists");
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await db.collection("admin_users").insertOne({
      email,
      password: hashedPassword,
      name,
      createdAt: new Date(),
    });

    console.log(`Admin user created: ${email}`);
  } finally {
    await client.close();
  }
}

createAdmin().catch(console.error);
