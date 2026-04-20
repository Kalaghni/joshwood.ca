"use client"

import _Error from "next/error";
import {ErrorProps} from "next/dist/pages/_error";
import H1 from "@/components/typography/h1";
import {useMemo} from "react";
import H2 from "@/components/typography/h2";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function Error({className, backHref = "/", ...props}: ErrorProps & {className?: string; backHref?: string}) {


    // return (
    //     <_Error {...props}/>
    // )

    const title = useMemo(() => props?.title ?? "Error", [props.title]);

    return (
        <div className={cn("h-[calc(100dvh_-_var(--header-height))] overflow-hidden flex flex-col items-center justify-center text-center", className)}>
            <div className="font-bold text-white leading-12">
                {props.statusCode && (
                    <h1 className="text-2xl inline-block mr-4 border-white border-r pr-4 leading-12">{props.statusCode}</h1>
                )}
                <div className="inline-block">
                    {title && (
                        <h2 className="uppercase text-2xl">{title}</h2>
                    )}
                </div>
            </div>
            <Button variant="link">
                <Link href={backHref}>Return Home</Link>
            </Button>
        </div>
    )
};