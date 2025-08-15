"use client";
import {ReactNode, useState} from "react";
import {AppSidebar} from "@/components/app-sidebar";
import {SidebarProvider} from "@/components/ui/sidebar";
import {useIsMobile} from "@/hooks/use-mobile";
import Navbar from "@/components/navbar";
import Footer from "@/app/footer";

export default function Main({ children }: {children?: ReactNode}) {

    const isMobile = useIsMobile();

    const [open, setOpen] = useState(false);

    return (window !== undefined &&
        <div>
            <SidebarProvider open={open && isMobile} onOpenChange={(open) => {
                setOpen(open);
            }}>
                <AppSidebar/>
                <main id="main" className="max-w-lvw w-full">
                    <Navbar/>
                    {children}
                </main>
            </SidebarProvider>
            <Footer/>
        </div>
    )
}