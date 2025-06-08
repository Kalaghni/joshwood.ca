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

]

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function clickOutsideHandle(event: MouseEvent) {
            if (
                open && // Only close if open
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        }

        window.addEventListener("click", clickOutsideHandle);

        return () => {
            window.removeEventListener("click", clickOutsideHandle);
        };
    }, [open]);

    return (
        <div
            ref={menuRef}
        >
            <NavigationMenu viewport={true} orientation="horizontal" className={cn(
                "sm:flex-row flex-col-reverse sm:justify-between max-w-none sm:items-center items-start"
            )}>
                <NavigationMenuList className={cn("items-start sm:items-center sm:flex-row",
                    (!open ? "hidden sm:flex" : "")
                )}>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger id="home">Home</NavigationMenuTrigger>
                        <NavigationMenuContent popoverTarget={"#home"}>
                            <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                <li className="row-span-3">
                                    <NavigationMenuLink asChild>
                                        <Link
                                            className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
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
                        <NavigationMenuTrigger>Projects</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-[200px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                {projects.map((project) => (
                                    <ListItem
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
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link href="/the-watering-can">The Watering Can</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
                <div className="flex flex-row justify-between w-full">
                    <Button
                        className="sm:hidden"
                        variant="ghost"
                        onClick={() => setOpen(!open)}
                    >
                        <Menu/>
                    </Button>
                    <NavigationMenuList className="sm:flex-row justify-self-end">
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link target="_blank" href="https://github.com/joshtwc">
                                <Github/>
                            </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link target="_blank" href="https://www.linkedin.com/in/joshua-wood-a072a2228/">
                                <Linkedin/>
                            </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
                </div>
            </NavigationMenu>
        </div>
    )
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
                <Link href={href}>
                    <div className="text-sm leading-none font-medium">{title}</div>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    )
}