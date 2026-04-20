"use client";
import {ReactNode, useEffect, useState} from "react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";


export interface ExperienceCardTagProps {
    label: string;
    color?: string;
}

export interface ExperienceCardProps {
    title: string;
    location: string;
    website?: string;
    description?: ReactNode;
    children?: ReactNode;
    className?: string;
    footer?: ReactNode;
}

export default function ExperienceCard({
                                           className, title, location, website, description, children,
                                           footer,
                                       }: ExperienceCardProps) {
    const [currentUrl, setCurrentUrl] = useState("");

    useEffect(() => {
        setCurrentUrl(window.location.href);
    }, []);

    const websiteHref = website ? (currentUrl ? `${website}?ref=${currentUrl}` : website) : "";

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>
                    {title} • {location}
                </CardTitle>
                {website && (
                    <CardDescription>
                        <Link href={websiteHref} className="block">
                            {website}
                        </Link>
                    </CardDescription>
                )}
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