"use client";
import H1 from "@/components/typography/h1";
import H3 from "@/components/typography/h3";

export default function Hero() {


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
                    <H1 className="text-left text-6xl sm:text-9xl">Josh Wood</H1>

                    <H3 className="text-5xl text-primary sm:mix-blend-saturation">IT · Developer</H3>
                </div>
            </div>
        </section>
    )
}