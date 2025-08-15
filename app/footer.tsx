"use client";
import {Separator} from "@/components/ui/separator";
import P from "@/components/typography/p";

const currentYear = new Date().getFullYear();

export default function Footer() {
    return (
        <footer>
            <Separator/>
            <div>
                <Separator orientation="vertical"/>
                <P className="text-center">Josh Wood &copy; {currentYear}</P>
            </div>

        </footer>
    )
}