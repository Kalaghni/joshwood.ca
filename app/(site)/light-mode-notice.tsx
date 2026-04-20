"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function LightModeNotice() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || resolvedTheme !== "light") return null;

    return (
        <div className="w-full py-8 text-center text-sm font-[family-name:var(--font-dm-mono)]">
            Please turn dark mode back on
        </div>
    );
}
