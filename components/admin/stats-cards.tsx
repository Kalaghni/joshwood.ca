"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconEye,
  IconMessage,
  IconFolder,
  IconTrendingUp,
} from "@tabler/icons-react";

interface StatsCardsProps {
  stats: {
    totalViews: number;
    totalMessages: number;
    totalProjects: number;
    viewsChange: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Views",
      value: stats.totalViews.toLocaleString(),
      description: `${stats.viewsChange > 0 ? "+" : ""}${stats.viewsChange}% from last month`,
      icon: IconEye,
    },
    {
      title: "Messages",
      value: stats.totalMessages.toString(),
      description: "Contact form submissions",
      icon: IconMessage,
    },
    {
      title: "Projects",
      value: stats.totalProjects.toString(),
      description: "Published projects",
      icon: IconFolder,
    },
    {
      title: "Engagement",
      value: "Coming soon",
      description: "Analytics integration",
      icon: IconTrendingUp,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
