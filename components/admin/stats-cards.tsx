"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, MessageSquare, Folder, TrendingUp } from "lucide-react";
import adminCards, {AdminCardStats} from "@/configs/admin.cards";
import {useMemo} from "react";

interface StatsCardsProps {
  stats: AdminCardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {

  const cards = useMemo(() => {
    return adminCards(stats)
  }, [stats])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader>
            <CardTitle className="flex flex-row items-center space-x-2 gap-3" aria-label={card.title}>
              <card.icon/>
              {card.title}
            </CardTitle>
            <CardDescription>{card.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
