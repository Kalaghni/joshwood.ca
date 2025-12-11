import {ReactNode} from "react";
import ReturnToTopButton from "@/components/ui/return-to-top";
import {Sidebar, SidebarProvider, SidebarRail, SidebarTrigger} from "@/components/ui/sidebar";
import NavDesktop from "@/components/navigation/nav-desktop";
import {cn} from "@/lib/utils";
import {Menu} from "lucide-react";
import {Button} from "@/components/ui/button";
import NavMobile from "@/components/navigation/nav-mobile";
import Footer from "@/app/(site)/footer";
import Logo from "@/components/logo";
import ThemeToggle from "@/components/theme-toggle";
import Prism from "@/components/backgrounds/Prism";

export default function SiteLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <>
            <ThemeToggle className="fixed bottom-8 right-4 z-100 bg-background"/>
            <div id="background" className="-z-10 fixed inset-0 overflow-hidden top-[var(--header-height)] h-[calc(100vh_-_var(--header-height))]">
                <Prism
                    animationType="rotate"
                    timeScale={0.5}
                    height={3.5}
                    baseWidth={5.5}
                    hueShift={0}
                    colorFrequency={1}
                    noise={0.5}
                    glow={1}
                />
            </div>

            <SidebarProvider>
                <Sidebar variant="floating">
                    <NavMobile className={"sm:hidden"}/>
                    <SidebarRail id="testing"/>
                </Sidebar>
                <div className="bg-transparent w-screen">
                    <div
                        style={{height: 'var(--header-height)'}}
                        className="sticky top-0 z-10 w-full flex-none shadow-muted shadow-sm bg-background"
                    >
                        <div
                            className={cn(
                                "items-center justify-center flex h-[var(--header-height)] max-w-none",
                                "max-w-screen overflow-x-clip max-sm:px-5"
                            )}
                        >
                            <Button variant="link" className="p-5" size="icon" asChild>
                                <SidebarTrigger className="sm:hidden" asChild>
                                    <Menu className="size-6"/>
                                </SidebarTrigger>
                            </Button>
                            <Logo className="max-sm:hidden ml-3 -mr-[43px]" height={40} width={40}/>
                            <NavDesktop className="max-sm:hidden items-center h-[var(--header-height)]"/>
                            <Logo className="sm:hidden" height={40} width={40}/>
                        </div>
                    </div>
                    <ReturnToTopButton/>
                    <main className="max-h[calc(100vh_-_var(--header-height))] overflow-y-auto">
                        {children}
                    </main>
                </div>
            </SidebarProvider>
            <Footer/>
        </>
    );
}
