"use client";
import {ReactNode} from "react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {cn} from "@/lib/utils";
import Link from "next/link";


export interface ExperienceCardTagProps {
    label: string;
    color?: string;
}
export interface ExperienceCardProps {
    title: string;
    location: string;
    website: string;
    description?: ReactNode;
    children?: ReactNode;
    className?: string;
    footer?: ReactNode;
}

export default function ExperienceCard({
    className, title, location, website, description, children,
    footer,
                                       }: ExperienceCardProps) {

    if (typeof window === 'undefined') return;

    return (
        <Card className={cn("m-0 mt-8 sm:m-4 sm:mt-8 bg-transparent border-none shadow-none", className)}>
            <section
                className={cn(
                    // glassy container that pops on dark backgrounds
                    "relative mx-auto w-full max-w-5xl rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl",
                    "shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] ring-1 ring-white/5",
                    "p-5 sm:p-8",
                    "before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-b before:from-white/5 before:to-transparent",
                    className
                )}
            >
                <CardHeader>
                    <CardTitle>
                        {title} • {location}
                    </CardTitle>
                    <CardDescription>
                        <Link href={website + `?ref=${window.location.href}`}>{website}</Link>
                    </CardDescription>
                    <CardDescription>
                        {description}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {children}
                </CardContent>
                {footer && (
                    <CardFooter>
                        {footer}
                    </CardFooter>
                )}
            </section>
        </Card>

    )
}