import {ComponentProps} from "react";
import {cn} from "@/lib/utils";

export default function P({className, children}: ComponentProps<"p">) {
    return (
        <p
            className={cn("text-foreground font-sans", className)}
        >
            {children}
        </p>
    )
}