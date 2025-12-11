"use client"
import _Error from 'next/error';
import {ComponentProps} from "react";

export default function Error(props: ComponentProps<typeof _Error>) {
    return (
        <div className="w-screen h-[calc(100vh_-_var(--header-height))] flex justify-center items-center contain-content">
            <_Error {...props}
            />
        </div>
    )
};