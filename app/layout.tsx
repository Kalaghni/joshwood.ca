import type {Metadata} from "next";
import {DM_Sans, DM_Mono, DM_Serif_Display} from "next/font/google";
import "./globals.css";
import {ReactNode} from "react";
import {ThemeProvider} from "@/components/theme-provider";
import ReturnToTopButton from "@/components/ui/return-to-top";
import {Sidebar, SidebarProvider, SidebarRail, SidebarTrigger} from "@/components/ui/sidebar";
import NavDesktop from "@/components/navigation/nav-desktop";
import {cn} from "@/lib/utils";
import {Menu} from "lucide-react";
import {Button} from "@/components/ui/button";
import NavMobile from "@/components/navigation/nav-mobile";
// import LiquidEther from "@/components/ui/liquid-ether";
import Footer from "@/app/footer";
import Logo from "@/components/logo";
import ThemeToggle from "@/components/theme-toggle";
// import PixelBlast from "@/components/PixelBlast";
// import FaultyTerminal from "@/components/FaultyTerminal";
// import DotGrid from "@/components/DotGrid";
import Prism from "@/components/backgrounds/Prism";
import LiquidEther from "@/components/backgrounds/liquid-ether";

const dmSans = DM_Sans({
    variable: "--font-dm-sans",
    subsets: ['latin'],
    weight: "400"
});

const dmMono = DM_Mono({
    variable: "--font-dm-mono",
    subsets: ['latin'],
    weight: "400"
});

const dmSerifDisplay = DM_Serif_Display({
    variable: "--font-dm-serif-display",
    subsets: ['latin'],
    weight: "400"
});

export const metadata: Metadata = {
    title: "Josh Wood",
    description: "Developer/Programmer",
};

// const currentYear = new Date().getFullYear();

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: ReactNode;
}>) {

    return (
        <html lang="en" suppressHydrationWarning>
        <body
            className={`${dmSans.variable} ${dmMono.variable} ${dmSerifDisplay.variable} antialiased`}
        >
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
        >
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
                {/*<LiquidEther*/}
                {/*    colors={[ '#5227FF', '#FF9FFC', '#B19EEF' ]}*/}
                {/*    mouseForce={20}*/}
                {/*    cursorSize={100}*/}
                {/*    isViscous={false}*/}
                {/*    viscous={30}*/}
                {/*    iterationsViscous={32}*/}
                {/*    iterationsPoisson={32}*/}
                {/*    resolution={0.5}*/}
                {/*    isBounce={false}*/}
                {/*    autoDemo={true}*/}
                {/*    autoSpeed={0.5}*/}
                {/*    autoIntensity={3}*/}
                {/*    takeoverDuration={0.25}*/}
                {/*    autoResumeDelay={3000}*/}
                {/*    autoRampDuration={0.6}*/}
                {/*/>*/}

            <SidebarProvider>
                <Sidebar variant="floating">
                    <NavMobile className={"sm:hidden"}/>
                    <SidebarRail id="testing"/>
                </Sidebar>
                <div className="bg-transparent w-screen">
                    {/*<Navbar/>*/}
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
                    {/*<NavigationMenuViewport>*/}
                    <main className="max-h[calc(100vh_-_var(--header-height))] overflow-y-auto">
                        {children}
                    </main>
                    {/*</NavigationMenuViewport>*/}
                </div>
            </SidebarProvider>
            <Footer/>
        </ThemeProvider>
        </body>
        </html>
    );
}

