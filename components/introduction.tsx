"use client";
// import PixelCard from "@/components/ui/pixel-card";
import H2 from "@/components/typography/h2";
import P from "@/components/typography/p";
import {Card, CardContent, CardDescription, CardHeader} from "@/components/ui/card";
import H4 from "@/components/typography/h4";
import {useRef} from "react";
// import Balatro from "@/components/ui/balatro";

export default function Introduction() {

    const containerRef = useRef<HTMLDivElement | null>(null);

    return (
        <section id="introduction" className="contain-content rounded-t-2xl">
            <div>
                <div ref={containerRef} className="relative contain-content overflow-hidden">
                    {/*<Balatro*/}
                    {/*    className="absolute inset-0 z-0"*/}
                    {/*    isRotate={false}*/}
                    {/*    mouseInteraction={true}*/}
                    {/*    pixelFilter={1920}*/}
                    {/*    parentRef={containerRef}*/}
                    {/*    color1={"#2b4539"}*/}
                    {/*/>*/}
                    <div className="relative z-10 py-8 px-4 sm:p-16">
                        <H2>Introduction</H2>
                        <Card className="mt-8">
                            <CardHeader>
                                <CardDescription>
                                    <H4 className='text-secondary'>Here&#39;s a little about me!</H4>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <P>
                                    I am a versatile and experienced software developer with a strong background in building robust, scalable, and maintainable solutions across a variety of platforms.
                                    My expertise spans <b>TypeScript, React, PHP, WordPress, MySQL, Python, and C#</b>, with extensive hands-on experience in Docker-based deployments and <b>Linux</b> environments.
                                    I thrive in both independent and collaborative settings, delivering high-quality code for web applications, <b>APIs</b>, automation, and system integrations.
                                    Known for my ability to quickly adapt to new technologies and frameworks, I bring a pragmatic, results-oriented approach to problem solving—consistently delivering solutions that balance performance, security, and user experience.
                                    Whether it’s architecting full-stack systems, optimizing databases, or enhancing DevOps pipelines, I’m passionate about leveraging technology to drive tangible business outcomes.
                                </P>
                            </CardContent>
                        </Card>
                    </div>
                </div>

            </div>
        </section>
    )

}