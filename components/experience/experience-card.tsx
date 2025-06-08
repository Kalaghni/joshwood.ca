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

    return (
        <Card className={cn("m-0 mt-8 sm:m-4 sm:mt-8", className)}>
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
        </Card>
    )
}