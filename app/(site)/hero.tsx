"use client";
import H1 from "@/components/typography/h1";
import H3 from "@/components/typography/h3";
import {useBackgroundToggle} from "@/components/background-toggle";
import {cn} from "@/lib/utils";

export default function Hero() {

    const {enabled, toggle} = useBackgroundToggle();

    return (
        <section id="hero">
            <div
                className="flex justify-center flex-wrap items-center gap-8 my-8 mx-4 sm:m-16 sm:mt-32"
            >
                <div
                    className="w-full sm:w-[100% - 128px]"
                    style={{
                        maxWidth: "575px"
                    }}
                >
                    <H1 className="text-left text-6xl sm:text-9xl">
                        J
                        <button
                            type="button"
                            onClick={toggle}
                            aria-label="Toggle background"
                            className="inline cursor-default bg-transparent p-0 font-inherit transition-colors hover:text-primary focus:outline-none"
                        >
                            o
                        </button>
                        sh Wood
                    </H1>

                    <H3 className={cn("text-5xl sm:font-bold text-primary", enabled && "sm:dark:mix-blend-saturation")}>IT · Developer</H3>
                </div>
            </div>
        </section>
    )
}
