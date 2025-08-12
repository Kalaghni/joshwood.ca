"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Github, ExternalLink, Video, LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";
import { cn } from "@/lib/utils";

type MetaItem = {
    label: string;
    value: ReactNode;
};

type Action =
    | { type: "github"; href: string; label?: string }
    | { type: "demo"; href: string; label?: string }
    | { type: "video"; href: string; label?: string }
    | { type: "link"; href: string; label: string };

export type ProjectOverviewProps = {
    title: string;
    subtitle?: string;
    summary?: ReactNode;
    cover?: {
        src: string;
        alt: string;
        aspect?: "16/9" | "4/3" | "3/2" | "21/9";
    };
    meta?: MetaItem[]; // e.g., [{ label: "Role", value: "Lead Dev" }]
    tech?: string[];   // e.g., ["Next.js", "TypeScript", "Tailwind", "Framer Motion"]
    actions?: Action[]; // github/demo/video/link
    className?: string;

    /** Optional slots for page-specific content */
    children?: ReactNode; // You can inject sections below the header
};

/** Small helper for consistent pill styling */
function Pill({ children }: { children: ReactNode }) {
    return (
        <span
            className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 transition
                 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
        >
      {children}
    </span>
    );
}

function ActionButton({ action }: { action: Action }) {
    const common =
        "transition-transform hover:scale-[1.02] active:scale-[0.99]";
    switch (action.type) {
        case "github":
            return (
                <Button asChild variant="secondary" className={common}>
                    <Link href={action.href} target="_blank" aria-label="GitHub">
                        <Github className="mr-2 h-4 w-4" />
                        {action.label ?? "GitHub"}
                    </Link>
                </Button>
            );
        case "demo":
            return (
                <Button asChild className={common}>
                    <Link href={action.href} target="_blank" aria-label="Live Demo">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        {action.label ?? "Live Demo"}
                    </Link>
                </Button>
            );
        case "video":
            return (
                <Button asChild variant="outline" className={common}>
                    <Link href={action.href} target="_blank" aria-label="Video">
                        <Video className="mr-2 h-4 w-4" />
                        {action.label ?? "Video"}
                    </Link>
                </Button>
            );
        case "link":
            return (
                <Button asChild variant="ghost" className={common}>
                    <Link href={action.href} target="_blank">
                        <LinkIcon className="mr-2 h-4 w-4" />
                        {action.label}
                    </Link>
                </Button>
            );
    }
}

export default function ProjectOverview({
                                            title,
                                            subtitle,
                                            summary,
                                            cover,
                                            meta = [],
                                            tech = [],
                                            actions = [],
                                            className,
                                            children,
                                        }: ProjectOverviewProps) {
    const aspect = cover?.aspect ?? "16/9";

    return (
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
            {/* Glow ring on hover */}
            <div className="pointer-events-none absolute inset-0 -z-10 rounded-2xl opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />

            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="grid gap-6 md:grid-cols-[1.2fr_.8fr] md:items-start"
            >
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="mt-1 text-sm text-white/70">{subtitle}</p>
                    )}

                    {summary && (
                        <p className="mt-4 text-sm leading-relaxed text-white/80">
                            {summary}
                        </p>
                    )}

                    {/* Actions */}
                    {actions.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                            {actions.map((a, i) => (
                                <ActionButton key={i} action={a} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Cover */}
                {cover && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
                        className={cn(
                            "relative overflow-hidden rounded-xl border border-white/10",
                            "shadow-lg shadow-black/40",
                            "transition hover:-translate-y-[2px] hover:shadow-xl hover:shadow-black/50",
                            aspect === "16/9" && "aspect-[16/9]",
                            aspect === "4/3" && "aspect-[4/3]",
                            aspect === "3/2" && "aspect-[3/2]",
                            aspect === "21/9" && "aspect-[21/9]"
                        )}
                    >
                        <Image
                            src={cover.src}
                            alt={cover.alt}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 480px"
                            priority
                        />
                        {/* subtle top gradient */}
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent" />
                    </motion.div>
                )}
            </motion.header>

            {/* Meta + Tech */}
            {(meta.length > 0 || tech.length > 0) && (
                <>
                    <div className="my-6 h-px w-full bg-white/10" />
                    <div className="grid gap-6 md:grid-cols-2">
                        {meta.length > 0 && (
                            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                {meta.map((m, i) => (
                                    <div
                                        key={i}
                                        className="rounded-lg border border-white/10 bg-white/5 p-3 transition
                               hover:border-white/20 hover:bg-white/[0.07]"
                                    >
                                        <dt className="text-[11px] uppercase tracking-wide text-white/50">
                                            {m.label}
                                        </dt>
                                        <dd className="mt-1 text-sm text-white/90">{m.value}</dd>
                                    </div>
                                ))}
                            </dl>
                        )}

                        {tech.length > 0 && (
                            <div>
                                <div className="mb-2 text-[11px] uppercase tracking-wide text-white/50">
                                    Tech
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {tech.map((t) => (
                                        <Pill key={t}>{t}</Pill>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Custom sections (highlights, problems/solutions, etc.) */}
            {children && (
                <>
                    <div className="my-6 h-px w-full bg-white/10" />
                    <div className="prose prose-invert prose-sm max-w-none">
                        {children}
                    </div>
                </>
            )}
        </section>
    );
}
