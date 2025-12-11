"use client";
import {Separator} from "@/components/ui/separator";
import P from "@/components/typography/p";
import {Button} from "@/components/ui/button";
import LetterGlitch from "@/components/backgrounds/letter-glitch";
import {useState} from "react";
import {cn} from "@/lib/utils";

const currentYear = new Date().getFullYear();

export default function Footer() {
    const [open, setOpen] = useState(false);
    const [openFull, setOpenFull] = useState(false);


    return (
        <footer
            data-open={open}
            style={{
                transform: openFull ? '' : 'translateY(calc(100vh - 78px))'
            }}
            className={cn("main-footer fixed bottom-0 left-0 right-0 h-screen w-screen bg-background translate-y-14 transition ease-in duration-200 data-[open=true]:translate-y-0",
                openFull ? '' : 'hover:translate-y-0'
            )}
        >
            <div className="animate-bounce-once">
                <Separator/>
                <div>
                    <Separator orientation="vertical"/>
                    <P className="text-center">Josh Wood &copy; {currentYear}</P>
                </div>
                <div className="h-screen contain-content flex justify-center items-start">
                    <div className="flex items-center justify-center text-xl h-14">
                        <Button variant="secondary" className="font-bold tracking-widest" onClick={() => {
                            setOpenFull(!openFull)
                            if (!openFull) {
                                setOpen(false)
                            }
                        }}>
                            {openFull ? "RETURN" : "THE BACKEND?"}
                        </Button>
                    </div>
                    <LetterGlitch className="h-screen absolute inset-0 -z-1"/>
                </div>
            </div>
        </footer>
    )
}