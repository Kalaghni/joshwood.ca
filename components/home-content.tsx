"use client";
// Lazy-load Experience and Technologies components


import {ReactNode} from "react";

export default function HomeContent({children}: {children?: ReactNode}) {

    return (
        <div>
            {children}
        </div>
    );
}