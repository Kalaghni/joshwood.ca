import {ReactNode} from "react";
import ReturnToTopButton from "@/components/ui/return-to-top";
import {Sidebar, SidebarProvider, SidebarRail, SidebarTrigger} from "@/components/ui/sidebar";
import NavDesktop from "@/components/navigation/nav-desktop";
import {cn} from "@/lib/utils";
import {LayoutDashboard, LogIn, Menu} from "lucide-react";
import {Button} from "@/components/ui/button";
import NavMobile from "@/components/navigation/nav-mobile";
import Footer from "@/app/(site)/footer";
import Logo from "@/components/icons/logo";
import ThemeToggle from "@/components/theme-toggle";
import {getProjects, seedProjects} from "@/lib/projects";
import {buildMainNav} from "@/configs/nav.config";
import Link from "next/link";
import {getCurrentUser} from "@/lib/auth";
import Background from "@/components/background";
import {BackgroundToggleProvider} from "@/components/background-toggle";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://joshwood.ca";

const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Person",
            "@id": `${siteUrl}/#person`,
            name: "Josh Wood",
            url: siteUrl,
            jobTitle: "Full-Stack Developer",
            knowsAbout: [
                "TypeScript",
                "React",
                "Next.js",
                "Node.js",
                "Web Development",
            ],
            sameAs: [
                "https://github.com/Kalaghni",
            ],
        },
        {
            "@type": "WebSite",
            "@id": `${siteUrl}/#website`,
            url: siteUrl,
            name: "Josh Wood",
            description:
                "Full-stack developer specializing in TypeScript, React, and Next.js.",
            author: {
                "@id": `${siteUrl}/#person`,
            },
        },
    ],
};

export default async function SiteLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    // Check auth status and fetch projects for nav
    const user = await getCurrentUser();
    await seedProjects();
    const projects = await getProjects(true);
    const navItems = buildMainNav(
        projects.map((p) => ({
            title: p.title,
            description: p.description,
            href: `/projects/${p.slug}`,
        }))
    );

    return (
        <BackgroundToggleProvider>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ThemeToggle className="fixed bottom-8 right-4 z-100 bg-background"/>
            <Background/>

            <SidebarProvider>
                <Sidebar variant="floating" collapsible="offcanvas" className="md:hidden">
                    <NavMobile className={"sm:hidden"} navItems={navItems} isLoggedIn={!!user}/>
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
                            <NavDesktop className="max-sm:hidden items-center h-[var(--header-height)]" navItems={navItems}/>
                            <Logo className="sm:hidden" height={40} width={40}/>
                            <Button variant="ghost" className="max-sm:hidden mr-7 -ml-7" size="icon" asChild>
                                <Link href={user ? "/admin" : "/admin/login"}>
                                    {user ? <LayoutDashboard className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
                                </Link>
                            </Button>
                        </div>
                    </div>
                    <ReturnToTopButton/>
                    <main className="max-h[calc(100vh_-_var(--header-height))] overflow-y-auto">
                        {children}
                    </main>
                </div>
            </SidebarProvider>
            <Footer/>
        </BackgroundToggleProvider>
    );
}
