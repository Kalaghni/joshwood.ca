"use client";

import * as React from "react";
import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
    Code2, Atom, Braces, Hash, Binary, Cpu, Terminal, Globe2, Layers, Wind,
    Server, Database, Boxes, Shield, Feather, Package, Network, Cable,
    ShoppingCart, CreditCard, CalendarClock, Route, PhoneCall, Smartphone, Nfc,
} from "lucide-react";
import H2 from "@/components/typography/h2";
import {cn} from "@/lib/utils";

type Group = "Frontend" | "Backend" | "Data" | "DevOps" | "Integrations" | "Other";

type Tech = {
    name: string;
    group: Group;
    href?: string;
    blurb?: string;
    icon?: React.ReactNode; // optional override
};

function iconFor(name: string): React.ReactNode {
    const key = name.toLowerCase();
    if (/^react$/.test(key)) return <Atom className="h-3.5 w-3.5" />;
    if (/^typescript$|^ts$/.test(key)) return <Braces className="h-3.5 w-3.5" />;
    if (/^next(\.js)?$/.test(key)) return <Layers className="h-3.5 w-3.5" />;
    if (/^tailwind/.test(key)) return <Wind className="h-3.5 w-3.5" />;
    if (/^shadcn/.test(key)) return <Layers className="h-3.5 w-3.5" />;
    if (/^electron$/.test(key)) return <Cpu className="h-3.5 w-3.5" />;
    if (/^php$/.test(key)) return <Braces className="h-3.5 w-3.5" />;
    if (/^python$/.test(key)) return <Binary className="h-3.5 w-3.5" />;
    if (/^c#|^csharp$/.test(key)) return <Hash className="h-3.5 w-3.5" />;
    if (/^node(\.js)?$/.test(key)) return <Server className="h-3.5 w-3.5" />;
    if (/^wordpress$/.test(key)) return <Globe2 className="h-3.5 w-3.5" />;
    if (/^woocommerce$/.test(key)) return <ShoppingCart className="h-3.5 w-3.5" />;
    if (/mysql/.test(key)) return <Database className="h-3.5 w-3.5" />;
    if (/^kafka$/.test(key)) return <Network className="h-3.5 w-3.5" />;
    if (/docker/.test(key)) return <Boxes className="h-3.5 w-3.5" />;
    if (/^linux$/.test(key)) return <Terminal className="h-3.5 w-3.5" />;
    if (/^nginx$/.test(key)) return <Shield className="h-3.5 w-3.5" />;
    if (/^apache$/.test(key)) return <Feather className="h-3.5 w-3.5" />;
    if (/^proxmox$/.test(key)) return <Package className="h-3.5 w-3.5" />;
    if (/^stripe$/.test(key)) return <CreditCard className="h-3.5 w-3.5" />;
    if (/^onfleet$/.test(key)) return <Route className="h-3.5 w-3.5" />;
    if (/^asterisk$|^freepbx$/.test(key)) return <PhoneCall className="h-3.5 w-3.5" />;
    if (/^acuity/.test(key)) return <CalendarClock className="h-3.5 w-3.5" />;
    if (/android|kotlin/.test(key)) return <Smartphone className="h-3.5 w-3.5" />;
    if (/nfc|acr122|ntag/.test(key)) return <Nfc className="h-3.5 w-3.5" />;
    if (/nvidia|cuda/.test(key)) return <Cpu className="h-3.5 w-3.5" />;
    if (/api|webhook/.test(key)) return <Cable className="h-3.5 w-3.5" />;
    return <Code2 className="h-3.5 w-3.5" />;
}

// Your items (expand/replace with your site’s exact list)
const SITE_TECH: Tech[] = [
    { name: "TypeScript", group: "Frontend" },
    { name: "React", group: "Frontend" },
    { name: "Next.js", group: "Frontend", href: "https://nextjs.org" },
    { name: "Tailwind CSS", group: "Frontend" },
    { name: "shadcn/ui", group: "Frontend", href: "https://ui.shadcn.com/" },
    { name: "Electron", group: "Frontend" },
    { name: "PHP", group: "Backend", href: "https://php.net" },
    { name: "WordPress", group: "Backend", href: "https://wordpress.org" },
    { name: "WooCommerce", group: "Backend", href: "https://woocommerce.com" },
    { name: "Node.js", group: "Backend" },
    { name: "Python", group: "Backend" },
    { name: "C#", group: "Backend" },
    { name: "MySQL", group: "Data" },
    { name: "Docker", group: "DevOps" },
    { name: "Linux", group: "DevOps" },
    { name: "NGINX", group: "DevOps" },
    { name: "Apache", group: "DevOps" },
    { name: "Proxmox", group: "DevOps" },
    { name: "Stripe", group: "Integrations", href: "https://stripe.com" },
    { name: "Onfleet", group: "Integrations", href: "https://onfleet.com" },
    { name: "Asterisk/FreePBX", group: "Integrations" },
    { name: "Acuity Scheduling", group: "Integrations", href: "https://acuityscheduling.com" },
    { name: "Android/Kotlin", group: "Other" },
    { name: "NFC (ACR122U / NTAG)", group: "Other" },
    { name: "NVIDIA/CUDA", group: "Other" },
];

/** Two-row autoplay marquee with opposite directions. */
export default function Technologies({
                                         items = SITE_TECH,
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
    // Split items into two roughly even rows (preserve grouping feel by alternating)
    const [rowA, rowB] = useMemo(() => {
        const a: Tech[] = [], b: Tech[] = [];
        items.forEach((t, i) => (i % 2 === 0 ? a : b).push(t));
        return [a, b];
    }, [items]);

    return (
        <section id="technologies" className="relative w-full" data-anchor>
            <div className="mx-auto mt-36 w-full max-w-6xl px-4 sm:px-6">

                <Card className="relative mx-auto w-full max-w-5xl rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2">
                            <Code2 className="h-5 w-5" />
                            <H2>{title}</H2>
                            <Badge className="ml-1 rounded-full max-sm:hidden" variant="secondary">Stack</Badge>
                        </CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
                    </CardHeader>

                    <Separator style={{
                        width: "calc(100% - (4px * 2rem))",
                    }} className="tech-separator mx-4"/>

                    <CardContent className="pt-5 px-0">
                        <div
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
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
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
    const groups: Group[] = useMemo(
        () => ["Frontend", "Backend", "Data", "DevOps", "Integrations", "Other"],
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
    grouped: { group: Group; items: Tech[] }[];
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
                                                variant="secondary"
                                                className="rounded-full h-8 px-3 border border-border/60"
                                            >
                                                <Link href={t.href} target="_blank" rel="noreferrer">
                                                    <Chip name={t.name} />
                                                </Link>
                                            </Button>
                                        ) : (
                                            <div className="rounded-full h-8 px-3 inline-flex items-center border border-border/60 bg-muted/40">
                                                <Chip name={t.name} />
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


function Chip({ name }: { name: string }) {
    const icon = iconFor(name);
    return (
        <span className="flex items-center gap-2">
      {icon}
            <span className="text-sm">{name}</span>
    </span>
    );
}
