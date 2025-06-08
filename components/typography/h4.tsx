import {cn} from "@/lib/utils";
import {ComponentProps} from "react";

export default function H4({className, children, ...props}:
                           ComponentProps<"h4">
) {
    return (
        <h4 className={cn("scroll-m-20 text-xl sm:text-3xl font-heading tracking-tight text-balance", className)}
            {...props}
        >
            {children}
        </h4>
    )
}