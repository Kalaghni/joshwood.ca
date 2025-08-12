"use client";
import H1 from "@/components/typography/h1";
import H3 from "@/components/typography/h3";
import Threads from "@/components/ui/threads";
import {Separator} from "@/components/ui/separator";
import Aurora from "@/components/ui/aurora";

export default function Hero() {


    return (
        <section id="hero">
            {/*<Aurora*/}
            {/*    colorStops={*/}
            {/*        ["#DA4167", "#70EE9C"]*/}
            {/*    }*/}
            {/*    blend={0.5}*/}
            {/*    amplitude={1}*/}
            {/*    speed={0.5}*/}
            {/*/>*/}
            <div
                className="flex justify-center flex-wrap items-center gap-8 my-8 mx-4 sm:m-16 sm:mt-32"
            >
                {/*<div className="flex justify-center">*/}
                {/*    <div className="w-2/3 sm:w-auto contain-content p-6 sm:p-12">*/}
                {/*        <Image*/}
                {/*            width={600}*/}
                {/*            height={600}*/}
                {/*            src={'/main-img.jpg'}*/}
                {/*            alt="Portrait"*/}
                {/*            className="rounded-[100%] object-cover aspect-square w-full max-w-[350px]"*/}
                {/*        />*/}
                {/*    </div>*/}
                {/*</div>*/}
                <div
                    className="w-full sm:w-[100% - 128px]"
                    style={{
                        maxWidth: "575px"
                    }}
                >
                    <H1 className="text-left text-6xl sm:text-9xl">Josh Wood</H1>
                    <H3 className="text-left text-primary">Developer</H3>
                    {/*<div className="w-full contain-content flex justify-center items-center">*/}
                    {/*    <Threads*/}
                    {/*        amplitude={4}*/}
                    {/*        distance={0}*/}
                    {/*        enableMouseInteraction={true}*/}
                    {/*        className="w-lvw sm:w-full"*/}
                    {/*        color={[1,1,1]}*/}
                    {/*    />*/}
                    {/*</div>*/}
                </div>
            </div>
            {/*<Separator className="mx-16" style={{width:'calc(100% - 128px)'}}/>*/}
        </section>
    )
}