// components/TechBackground.tsx
"use client";
import * as React from "react";

export default function TechBackground({
                                           className = "",
                                       }: { className?: string }) {
    return (
        <div
            aria-hidden
            className={[
                // full-bleed, behind everything
                "pointer-events-none fixed inset-0 -z-10",
                // base: soft radial vignette that adapts to theme
                "bg-[radial-gradient(1200px_800px_at_50%_0%,hsl(var(--bg-top))_0%,transparent_60%)]",
                className,
            ].join(" ")}
        >
            {/* Subtle grid (SVG) */}
            <div className="absolute inset-0 bg-tech-grid opacity-[0.14] dark:opacity-[0.12]" />

            {/* Faint vertical glow columns */}
            <div className="absolute inset-0 mix-blend-screen dark:mix-blend-soft-light">
                <div className="absolute inset-y-0 left-1/4 w-[16vw] bg-tech-col glow blur-3xl opacity-40" />
                <div className="absolute inset-y-0 right-[22%] w-[14vw] bg-tech-col glow blur-3xl opacity-30" />
            </div>

            {/* Optional micro-noise for banding */}
            <div className="absolute inset-0 bg-tech-noise opacity-[0.035] dark:opacity-[0.04]" />

            {/* Slow scanline sweep (respects reduced motion) */}
            <div className="absolute inset-0 [mask-image:linear-gradient(180deg,transparent,black_20%,black_80%,transparent)]">
                <div className="absolute -inset-y-1 inset-x-0 bg-tech-scan will-change-transform animate-scan-slow" />
            </div>
        </div>
    );
}
