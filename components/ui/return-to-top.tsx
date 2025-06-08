"use client";

import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function ReturnToTopButton() {
    const [show, setShow] = useState(false);

    // Show button after scrolling down 200px
    useEffect(() => {
        function handleScroll() {
            setShow(window.scrollY > 200);
        }
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    function handleClick() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return (
        <Button
            onClick={handleClick}
            variant="outline"
            size="icon"
            className={`
        fixed bottom-6 right-6 z-50
        transition-opacity duration-300
        ${show ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        rounded-full shadow-lg
      `}
            aria-label="Return to top"
        >
            <ArrowUp className="w-5 h-5" />
        </Button>
    );
}
