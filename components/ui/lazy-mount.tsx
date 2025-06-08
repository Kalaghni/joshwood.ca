"use client";
import { useRef, useState, useEffect, type ReactNode } from "react";

export function LazyMount({
                              children,
                              rootMargin = "200px 0px",
                              threshold = 0,
                          }: {
    children: ReactNode;
    rootMargin?: string;
    threshold?: number | number[];
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [show, setShow] = useState(false);

    useEffect(() => {
        const observer = new window.IntersectionObserver(
            ([entry]) => {
                setShow(entry.isIntersecting);
            },
            { rootMargin, threshold }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [rootMargin, threshold]);

    return <div ref={ref}>{show ? children : null}</div>;
}
