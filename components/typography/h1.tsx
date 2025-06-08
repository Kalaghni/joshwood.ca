import {cn} from "@/lib/utils";
import {ComponentProps} from "react";

export default function H1({className, children, ...props}:
                           ComponentProps<"h1">
) {
    return (
        <h1 className={cn("scroll-m-20 text-9xl font-heading tracking-tight text-balance", className)}
            {...props}
        >
            {children}
        </h1>
    )
}