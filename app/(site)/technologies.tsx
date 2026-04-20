"use client";

import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Pause, Play } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

import H2 from "@/components/typography/h2";
import {technologies, renderIconByKey, Tech, TechGroup} from "@/configs/technologies.config";

/** Two-row autoplay marquee with opposite directions. */
export default function Technologies({
                                         items = technologies,
                                         title = "Technologies",
                                         subtitle = "Tools I use across frontend, backend, and ops.",
                                         speedPxPerSec = 60, // base speed per row; bottom row runs the opposite direction
                                         gapY = 10,          // vertical gap between the two rows (px)
                                         pauseOnHover = true,
                                     }: {
    items?: Tech[];
    title?: string;
    subtitle?: string;
    speedPxPerSec?: number;
    gapY?: number;
    pauseOnHover?: boolean;
}) {
    const [paused, setPaused] = useState(false);

    // Split items into two roughly even rows (preserve grouping feel by alternating)
    const [rowA, rowB] = useMemo(() => {
        const a: Tech[] = [], b: Tech[] = [];
        items.forEach((t, i) => (i % 2 === 0 ? a : b).push(t));
        return [a, b];
    }, [items]);

    const groupOrder: TechGroup[] = useMemo(
        () => ["Frontend", "Backend", "Data", "DevOps", "Integrations", "AI", "Other"],
        []
    );
    const grouped = useMemo(
        () => groupOrder.map(g => ({ group: g, items: items.filter(t => t.group === g) })).filter(g => g.items.length),
        [groupOrder, items]
    );

    return (
        <section id="technologies" className="relative w-full" data-anchor>
            <div className="mx-auto mt-36 w-full max-w-6xl px-4 sm:px-6">
                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <H2>{title}</H2>
                                </CardTitle>
                                <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setPaused(p => !p)}
                                aria-label={paused ? "Play technologies marquee" : "Pause technologies marquee"}
                                aria-pressed={paused}
                            >
                                {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                            </Button>
                        </div>
                    </CardHeader>

                    <Separator style={{
                        width: "calc(100% - (4px * 2rem))",
                    }} className="tech-separator mx-4"/>

                    <CardContent className="pt-5 px-0">
                        <AnimatePresence mode="wait" initial={false}>
                            {paused ? (
                                <motion.div
                                    key="columns"
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    transition={{ duration: 0.25, ease: "easeOut" }}
                                >
                                    <TechColumns grouped={grouped} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="marquee"
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    transition={{ duration: 0.25, ease: "easeOut" }}
                                    className="relative"
                                    style={{ '--gapY': `${gapY}px` } as React.CSSProperties}
                                >
                                    {/* Edge fades */}
                                    <div className="pointer-events-none absolute inset-y-0 left-0 w-8 from-background to-transparent z-10" />
                                    <div className="pointer-events-none absolute inset-y-0 right-0 w-8 from-background to-transparent z-10" />

                                    <MarqueeRow
                                        items={rowA}
                                        direction={-1}                    // leftward
                                        speedPxPerSec={speedPxPerSec}
                                        pauseOnHover={pauseOnHover}
                                    />
                                    <MarqueeRow
                                        className="mt-[var(--gapY)]"
                                        items={rowB}
                                        direction={+1}                    // rightward (opposite)
                                        speedPxPerSec={speedPxPerSec * 0.9} // tiny variation feels natural
                                        pauseOnHover={pauseOnHover}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}

function TechColumns({ grouped }: { grouped: { group: TechGroup; items: Tech[] }[] }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 px-6 pb-2">
            <TooltipProvider delayDuration={120}>
                {grouped.map(({ group, items }) => (
                    <div key={group} className="flex flex-col gap-3">
                        <Badge variant="outline" className="rounded-full text-xs opacity-70 self-start">
                            {group}
                        </Badge>
                        <ul className="flex flex-col gap-1.5 items-start">
                            {items.map((t) => (
                                <li key={`${group}-${t.name}`} className="text-sm">
                                    {t.href ? (
                                        <Link
                                            href={t.href}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 hover:text-foreground text-muted-foreground transition-colors"
                                        >
                                            <Chip name={t.name} iconKey={t.icon} />
                                        </Link>
                                    ) : (
                                        <span className="inline-flex items-center gap-2 text-muted-foreground">
                                            <Chip name={t.name} iconKey={t.icon} />
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </TooltipProvider>
        </div>
    );
}

/** One infinitely-looping marquee row (duplicates content for a seamless loop). */
function MarqueeRow({
                        items,
                        direction,          // -1 = left, +1 = right
                        speedPxPerSec,
                        pauseOnHover,
                        className,
                    }: {
    items: Tech[];
    direction: -1 | 1;
    speedPxPerSec: number;
    pauseOnHover: boolean;
    className?: string;
}) {
    const trackRef = useRef<HTMLDivElement | null>(null);
    const railRef = useRef<HTMLDivElement | null>(null);

    // animation state in refs (won't reset on re-render)
    const contentWRef = useRef(0);
    const offsetRef = useRef(0);
    const pausedRef = useRef(false);
    const reducedRef = useRef(false);
    const rafRef = useRef(0);
    const lastRef = useRef(performance.now());

    // Measure width of ONE rail (we render two)
    useEffect(() => {
        const measure = () => {
            const w = railRef.current ? railRef.current.scrollWidth : 0;
            if (w !== contentWRef.current) {
                contentWRef.current = w;
                // initialize start offset based on direction without snapping visually
                offsetRef.current = direction < 0 ? 0 : -w;
                const el = trackRef.current;
                if (el) el.style.transform = `translateX(${offsetRef.current}px)`;
            }
        };
        measure();
        const ro = new ResizeObserver(measure);
        if (railRef.current) ro.observe(railRef.current);
        return () => ro.disconnect();
    }, [direction]);

    // Respect reduced motion
    useEffect(() => {
        const m = window.matchMedia("(prefers-reduced-motion: reduce)");
        const onChange = () => (reducedRef.current = m.matches);
        onChange();
        m.addEventListener?.("change", onChange);
        return () => m.removeEventListener?.("change", onChange);
    }, []);

    // Single RAF loop; never depends on hover
    useEffect(() => {
        const step = (now: number) => {
            const dt = (now - lastRef.current) / 1000;
            lastRef.current = now;

            const el = trackRef.current;
            const w = contentWRef.current;

            if (el && w > 0 && !pausedRef.current && !reducedRef.current) {
                let o = offsetRef.current + direction * speedPxPerSec * dt;

                // wrap
                if (direction < 0) {
                    if (o <= -w) o += w;
                } else {
                    if (o >= 0) o -= w;
                }

                offsetRef.current = o;
                el.style.transform = `translateX(${o}px)`;
            }

            rafRef.current = requestAnimationFrame(step);
        };

        rafRef.current = requestAnimationFrame(step);
        return () => cancelAnimationFrame(rafRef.current);
    }, [direction, speedPxPerSec]);

    // Hover only toggles pausedRef; it doesn't restart the loop
    const onEnter = () => { if (pauseOnHover) pausedRef.current = true; };
    const onLeave = () => { if (pauseOnHover) pausedRef.current = false; };

    // Group (deterministic keys)
    const groups: TechGroup[] = useMemo(
        () => ["Frontend", "Backend", "Data", "DevOps", "Integrations", "AI", "Other"],
        []
    );
    const grouped = useMemo(
        () => groups.map(g => ({ group: g, items: items.filter(t => t.group === g) })).filter(g => g.items.length),
        [groups, items]
    );

    return (
        <div
            className={["relative w-full overflow-hidden", className].filter(Boolean).join(" ")}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            aria-label="Technologies marquee row"
        >
            {/* Moving belt (two identical rails for seamless loop) */}
            <div ref={trackRef} className="will-change-transform">
                <div className="inline-flex">
                    <Rail ref={railRef} grouped={grouped} instanceId="a" />
                    <Rail grouped={grouped} instanceId="b" />
                </div>
            </div>
        </div>
    );
}

const Rail = React.forwardRef<HTMLDivElement, {
    grouped: { group: TechGroup; items: Tech[] }[];
    instanceId?: string;
}>(({ grouped, instanceId = "a" }, ref) => {
    return (
        <div ref={ref} className="inline-flex min-w-max select-none gap-4 pr-6 whitespace-nowrap">
            <TooltipProvider delayDuration={120}>
                {grouped.map(({ group, items }) => (
                    <div key={`${instanceId}-${group}`} className="flex items-center gap-3 pr-6">
                        <Badge variant="outline" className="rounded-full text-xs opacity-70">
                            {group}
                        </Badge>
                        <div className="flex items-center gap-3">
                            {items.map((t) => (
                                <Tooltip key={`${instanceId}-${group}-${t.name}`}>
                                    <TooltipTrigger asChild>
                                        {t.href ? (
                                            <Button
                                                asChild
                                                className="rounded-full h-8 px-3 border border-border/60"
                                            >
                                                <Link href={t.href} target="_blank" rel="noreferrer">
                                                    <Chip name={t.name} iconKey={t.icon} />
                                                </Link>
                                            </Button>
                                        ) : (
                                            <div className="rounded-full h-8 px-3 inline-flex items-center border border-border/60 bg-muted/40">
                                                <Chip name={t.name} iconKey={t.icon} />
                                            </div>
                                        )}
                                    </TooltipTrigger>
                                    {/* add TooltipContent if you have blurbs */}
                                </Tooltip>
                            ))}
                        </div>
                    </div>
                ))}
            </TooltipProvider>
        </div>
    );
});
Rail.displayName = "Rail";


function Chip({ name, iconKey }: { name: string; iconKey?: string }) {
    const icon = renderIconByKey(iconKey, name);
    return (
        <span className="flex items-center gap-2">
      {icon}
            <span className="text-sm">{name}</span>
    </span>
    );
}
