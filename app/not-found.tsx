// app/not-found.tsx
'use client'

import Error from "@/components/error";
import Background from "@/components/background";
import {usePathname} from "next/navigation";
import {useMemo} from "react";

export default function NotFound() {

    const pathname = usePathname();

    const backUrl = useMemo(() => {
        if (pathname.startsWith('/admin')) return '/admin';
        return '/';
    }, [pathname]);

    return (
        <>
            <Background/>
            <Error
                title="Page Not Found"
                statusCode={404}
                backHref={backUrl}
            />
        </>
    )
}