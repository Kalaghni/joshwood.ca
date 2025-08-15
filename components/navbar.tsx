"use client";
import {
    NavigationMenu,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuItem,
    NavigationMenuContent,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {ComponentPropsWithoutRef, useEffect, useRef, useState} from "react";
import Link from "next/link";
import {Github, Linkedin, Menu} from "lucide-react";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";

export interface ProjectProps {
    title: string;
    description: string;
    href: string;
}
const projects: ProjectProps[] = [
    {
        title: "Shell-GPT",
        description: "An electron-based 'shell' that wraps GPT, and executes its commands in a Docker container.",
        href: "/projects/shell-gpt"
    }
];
import {SidebarTrigger} from "@/components/ui/sidebar";
// import MainMenu from "@/components/main-menu";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function clickOutsideHandle(event: MouseEvent) {
            if (open && menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        window.addEventListener("click", clickOutsideHandle);
        return () => window.removeEventListener("click", clickOutsideHandle);
    }, [open]);

    return (
        <div
            ref={menuRef}
            className={"bg-background sticky top-0 z-50 w-full rounded-b-sm px-2"}
        >
            <NavigationMenu
                viewport={true}
                orientation="horizontal"
                className={cn(
                    "sm:flex-row flex-col-reverse sm:justify-between max-w-none sm:items-center items-start",
                    "bg-black/40 backdrop-blur-lg shadow-lg rounded-xl p-3 transition-all duration-300"
                )}
            >
                <NavigationMenuList
                    className={cn(
                        "items-start sm:items-center sm:flex-row",
                        !open ? "hidden sm:flex" : ""
                    )}
                >
                    <NavigationMenuItem>
                        <NavigationMenuTrigger
                            id="home"
                            className="transition-transform hover:scale-105 hover:text-white"
                        >
                            Home
                        </NavigationMenuTrigger>
                        <NavigationMenuContent popoverTarget="#home">
                            <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                <li className="row-span-3">
                                    <NavigationMenuLink asChild>
                                        <Link
                                            className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                                            href="/"
                                        >
                                            <div className="mt-4 mb-2 text-lg font-medium">
                                                Home
                                            </div>
                                            <p className="text-muted-foreground text-sm leading-tight">
                                                Visit the home page
                                            </p>
                                        </Link>
                                    </NavigationMenuLink>
                                </li>
                                <ListItem href="/#introduction" title="Introduction">
                                    About me, and a short history
                                </ListItem>
                                <ListItem href="/#experience" title="Experience">
                                    My personal and professional experience
                                </ListItem>
                                <ListItem href="/#technologies" title="Technologies">
                                    Programming languages and stuff
                                </ListItem>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="transition-transform hover:scale-105 hover:text-white">
                            Projects
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-[200px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                {projects.map((project) => (
                                    <ListItem
                                        className="w-full"
                                        key={project.title}
                                        title={project.title}
                                        href={project.href}
                                    >
                                        {project.description}
                                    </ListItem>
                                ))}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink
                            asChild
                            className={cn(navigationMenuTriggerStyle(), "hover:scale-105 hover:text-white transition-transform")}
                        >
                            <Link href="/the-watering-can">The Watering Can</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                <NavigationMenu viewport={true} orientation="horizontal" className={cn(
                    "sm:flex-row flex-col-reverse sm:justify-between max-w-none sm:items-center items-start"
                )}>
                    <NavigationMenuList className="hidden sm:flex justify-self-start">
                        {/*<MainMenu className="hidden sm:block"/>*/}
                    </NavigationMenuList>

                    <div className="flex flex-row justify-between w-full">
                        <Button
                            className="sm:hidden hover:scale-105 transition-transform"
                            variant="ghost"
                            onClick={() => setOpen(!open)}
                        >
                            <Menu />
                        </Button>
                        <NavigationMenuList className="sm:flex-row justify-self-end gap-2">
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    asChild
                                    className="hover:scale-110 transition-transform hover:text-white"
                                >
                                    <Link target="_blank" href="https://github.com/joshtwc">
                                        <Github />
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    asChild
                                    className="hover:scale-110 transition-transform hover:text-white"
                                >
                                    <Link target="_blank" href="https://www.linkedin.com/in/joshua-wood-a072a2228/">
                                        <Linkedin />
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                            <Button
                                className=""
                                variant="ghost"
                                asChild
                            >
                                {/*<SidebarTrigger>*/}
                                    <Menu/>
                                {/*</SidebarTrigger>*/}
                            </Button>
                        <NavigationMenuList className="sm:flex-row justify-self-end">
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                    <Button variant="ghost" asChild>
                                        <Link target="_blank" href="https://github.com/joshtwc">
                                            <Github/>
                                        </Link>
                                    </Button>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                    <Button variant="ghost" asChild>
                                        <Link target="_blank" href="https://www.linkedin.com/in/joshua-wood-a072a2228/">
                                            <Linkedin/>
                                        </Link>
                                    </Button>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </div>
                </NavigationMenu>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    );
}

function ListItem({
                      title,
                      children,
                      href,
                      ...props
                  }: ComponentPropsWithoutRef<"li"> & { href: string }) {
    return (
        <li {...props}>
            <NavigationMenuLink asChild>
                <Link
                    href={href}
                    className="block rounded-lg p-3 transition-all duration-200 hover:bg-white/10 hover:shadow-md hover:scale-[1.02]"
                >
                    <div className="text-sm leading-none font-medium text-white">{title}</div>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    );
}
