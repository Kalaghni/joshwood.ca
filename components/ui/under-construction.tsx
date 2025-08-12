// components/UnderConstruction.tsx
import * as React from "react";
import Link from "next/link";
import { Cone, Mail, Wrench } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function cn(...classes: Array<string | undefined | false>) {
    return classes.filter(Boolean).join(" ");
}

type UnderConstructionProps = {
    fullPage?: boolean;
    title?: string;
    description?: string;
    /** Where to send the user to be notified (mailto: or a route). */
    notifyHref?: string; // e.g. "mailto:product@company.com?subject=Notify%20me"
    /** Where to send the user back (defaults to "/"). */
    backHref?: string;   // e.g. "/"
    className?: string;
    cardClassName?: string;
};

export default function UnderConstruction({
                                              fullPage = true,
                                              title = "Under Construction",
                                              description = "We’re busy building this feature. Check back soon!",
                                              notifyHref,
                                              backHref = "/",
                                              className,
                                              cardClassName,
                                          }: UnderConstructionProps) {
    return (
        <section
            className={cn(
                "w-full",
                fullPage ? "min-h-screen" : "h-full min-h-full",
                "flex items-center justify-center",
                "p-4 sm:p-6",
                className
            )}
            aria-label="Under construction"
        >
            <Card
                className={cn(
                    "w-full max-w-xl border-muted/50 shadow-sm",
                    "bg-background/70 backdrop-blur supports-[backdrop-filter]:backdrop-blur",
                    cardClassName
                )}
            >
                <CardHeader className="flex flex-col items-center text-center gap-3">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl ring-1 ring-border">
            <Wrench className="h-7 w-7" aria-hidden />
          </span>

                    <div className="flex items-center gap-2">
                        <CardTitle className="text-2xl sm:text-3xl">{title}</CardTitle>
                        <Badge variant="default" className="rounded-full">WIP</Badge>
                    </div>

                    <CardDescription className="text-base leading-relaxed">
                        {description}
                    </CardDescription>
                </CardHeader>

                <Separator className="mx-auto w-11/12" />

                <CardContent className="pt-6">
                    <ul className="mx-auto grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                        <li className="flex items-center gap-2">
                            <Mail className="h-4 w-4" aria-hidden />
                            Get notified when it’s live
                        </li>
                        <li className="flex items-center gap-2">
                            <Cone className="h-4 w-4" aria-hidden />
                            UI/UX polishing in progress
                        </li>
                    </ul>
                </CardContent>

                <CardFooter className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                    {notifyHref ? (
                        <Button asChild className="min-w-[180px]">
                            <Link href={notifyHref}>
                                <Mail className="mr-2 h-4 w-4" />
                                Notify me
                            </Link>
                        </Button>
                    ) : null}

                    <Button asChild variant="default" className="min-w-[180px]">
                        <Link href={backHref}>Go back</Link>
                    </Button>
                </CardFooter>
            </Card>
        </section>
    );
}
