import {ComponentProps} from "react";
import {cn} from "@/lib/utils";

export default function P({className, children}: ComponentProps<"p">) {
    return (
        <p
            className={cn("font-sans", className)}
        >
            {children}
        </p>
    )
}