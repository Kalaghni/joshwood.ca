"use client"
import Prism from "@/components/backgrounds/Prism";
import {usePathname} from "next/navigation";
import {useBackgroundToggle} from "@/components/background-toggle";

export default function Background() {

    const pathname = usePathname();
    const {enabled} = useBackgroundToggle();

    const isHome = pathname === '/';

    return (
        <div id="background" className="-z-10 fixed inset-0 overflow-hidden top-[var(--header-height)] h-[calc(100vh_-_var(--header-height))] bg-background">
            {enabled && (
                <Prism
                    offset={{
                        y: isHome ? 120 : 0,
                        x: 0
                    }}
                    animationType="rotate"
                    timeScale={0.5}
                    height={1.75}
                    baseWidth={2.75}
                    hueShift={0}
                    colorFrequency={2}
                    noise={0.5}
                    glow={1}
                />
            )}
        </div>
    )

}