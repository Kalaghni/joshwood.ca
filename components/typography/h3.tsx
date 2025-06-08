import {cn} from "@/lib/utils";
import {ComponentProps} from "react";

export default function H3({className, children, ...props}:
                           ComponentProps<"h3">
) {
    return (
        <h3 className={cn("scroll-m-20 text-3xl sm:text-5xl font-heading tracking-tight text-balance", className)}
            {...props}
        >
            {children}
        </h3>
    )
}