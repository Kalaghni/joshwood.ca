"use client";
import * as React from "react"

import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
    spoiler?: boolean
    clickToCopy?: boolean
}

function Input({ className, type, spoiler = false, clickToCopy = false, ...props }: InputProps) {
    const [isRevealed, setIsRevealed] = React.useState(false)
    const inputRef = React.useRef<HTMLInputElement>(null)

    const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
        if (spoiler && !isRevealed) {
            setIsRevealed(true)
        }

        if (clickToCopy && inputRef.current?.value) {
            e.currentTarget.select();
            navigator.clipboard.writeText(inputRef.current.value)
                .catch(err => console.error('Failed to copy:', err))
        }

        // Call original onClick if provided
        props.onClick?.(e)
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        if (spoiler && !isRevealed) {
            setIsRevealed(true)
        }

        // Call original onFocus if provided
        props.onFocus?.(e)
    }

    return (
        <input
            ref={inputRef}
            type={type}
            data-slot="input"
            className={cn(
                "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                spoiler && !isRevealed && "blur-sm select-none transition-all cursor-pointer",
                spoiler && !isRevealed && "hover:blur-none",
                clickToCopy && "cursor-pointer",
                className
            )}
            onClick={handleClick}
            onFocus={handleFocus}
            {...props}
        />
    )
}

export { Input }