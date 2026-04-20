"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  createdAt: string;
  read: boolean;
}

interface RecentMessagesProps {
  messages: Message[];
}

export function RecentMessages({ messages }: RecentMessagesProps) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Messages</CardTitle>
        <CardDescription>
          Latest contact form submissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">No messages yet.</p>
        ) : (
          <div className="space-y-8">
            {messages.map((message) => (
              <div key={message._id} className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>
                    {message.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1 flex-1">
                  <p className="text-sm font-medium leading-none">
                    {message.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {message.subject}
                  </p>
                </div>
                {!message.read && (
                  <Badge variant="secondary" className="ml-auto">
                    New
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
