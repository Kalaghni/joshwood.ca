"use client";
import { useRef, useState, useEffect, type ReactNode } from "react";

export function LazyMount({
                              children,
                              rootMargin = "200px 0px",
                              threshold = 0,
                              defaultHeight,
                          }: {
    children: ReactNode;
    rootMargin?: string;
    threshold?: number | number[];
    defaultHeight?: number;
}) {
    const placeholderRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const [show, setShow] = useState(false);
    const [lastHeight, setLastHeight] = useState<number | undefined>(defaultHeight);

    // Intersection observer
    useEffect(() => {
        const ref = show ? contentRef : placeholderRef;
        if (!ref.current) return;

        const observer = new window.IntersectionObserver(
            ([entry]) => {
                setShow(entry.isIntersecting);
            },
            { rootMargin, threshold }
        );

        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [show, rootMargin, threshold]);

    // Measure height when shown
    useEffect(() => {
        if (!show || !contentRef.current) return;
        const updateHeight = () => {
            if (contentRef.current) {
                const height = contentRef.current.getBoundingClientRect().height;
                setLastHeight(height);
            }
        };
        updateHeight();
        const ro = new ResizeObserver(updateHeight);
        ro.observe(contentRef.current);
        return () => ro.disconnect();
    }, [show, children]);

    if (!show) {
        // Use lastHeight or defaultHeight
        const height = lastHeight ?? defaultHeight;
        return (
            <div
                ref={placeholderRef}
                style={
                    height !== undefined
                        ? { minHeight: height, height, visibility: "hidden" }
                        : undefined
                }
            />
        );
    }

    return <div ref={contentRef}>{children}</div>;
}
