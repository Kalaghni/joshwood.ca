import {cn} from "@/lib/utils";
import {ComponentProps} from "react";

export default function H2({className, children, ...props}:
                           ComponentProps<"h2">
) {
    return (
        <h2 className={cn("scroll-m-20 text-5xl sm:text-7xl max-sm:text-4xl font-heading tracking-tight font-light text-balance", className)}
            {...props}
        >
            {children}
        </h2>
    )
}