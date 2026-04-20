import { getDatabase } from "@/lib/mongodb";
import { StatsCards } from "@/components/admin/stats-cards";
import { RecentMessages } from "@/components/admin/recent-messages";
import { getCurrentUser } from "@/lib/auth";

async function getStats() {
  const db = await getDatabase();

  const [totalMessages, totalProjects] = await Promise.all([
    db.collection("messages").countDocuments(),
    db.collection("projects").countDocuments(),
  ]);

  return {
    totalViews: 0, // Integrate with analytics later
    totalMessages,
    totalProjects,
    viewsChange: 0,
  };
}

async function getRecentMessages() {
  const db = await getDatabase();
  const messages = await db
    .collection("messages")
    .find()
    .sort({ createdAt: -1 })
    .limit(5)
    .toArray();

  return messages.map((msg) => ({
    _id: msg._id.toString(),
    name: msg.name,
    email: msg.email,
    subject: msg.subject || "No subject",
    createdAt: msg.createdAt?.toISOString() || new Date().toISOString(),
    read: msg.read || false,
  }));
}

export default async function AdminDashboard() {
  const user = await getCurrentUser();
  const [stats, recentMessages] = await Promise.all([
    getStats(),
    getRecentMessages(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back{user?.name ? `, ${user.name}` : ""}!
        </p>
      </div>

      <StatsCards stats={stats} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <RecentMessages messages={recentMessages} />
        <div className="col-span-4">
          {/* Chart placeholder - can add analytics chart here */}
        </div>
      </div>
    </div>
  );
}
