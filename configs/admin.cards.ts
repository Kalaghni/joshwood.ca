import {Eye, Folder, MessageSquare, TrendingUp} from "lucide-react";

export type AdminCardStats = {
    totalViews: number;
    totalMessages: number;
    totalProjects: number;
    viewsChange: number;
}

export const adminCards = (stats: AdminCardStats) => [
    {
        title: "Total Views",
        value: stats.totalViews.toLocaleString(),
        description: `${stats.viewsChange > 0 ? "+" : ""}${stats.viewsChange}% from last month`,
        icon: Eye,
    },
    {
        title: "Messages",
        value: stats.totalMessages.toString(),
        description: "Contact form submissions",
        icon: MessageSquare,
    },
    {
        title: "Projects",
        value: stats.totalProjects.toString(),
        description: "Published projects",
        icon: Folder,
    },
    {
        title: "Engagement",
        value: "Coming soon",
        description: "Analytics integration",
        icon: TrendingUp,
    },
];

export default adminCards;