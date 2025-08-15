"use client";
import {cn} from "@/lib/utils";
import {
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuTrigger, navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import {ComponentPropsWithoutRef, useState} from "react";
import {Button} from "@/components/ui/button";
import {useSidebar} from "@/components/ui/sidebar";
import {usePathname} from "next/navigation";

export interface ProjectProps {
    title: string;
    description: string;
    href: string;
}
const projects: ProjectProps[] = [

]
export default function MainMenu({className, triggerClassName}: {className?: string, triggerClassName?: string}) {

    const pathname = usePathname();

    const [selected, setSelected] = useState<string>(pathname);

    const sidebar = useSidebar();

    const triggerStyle = (link: string)  => cn(
        navigationMenuTriggerStyle(),
        triggerClassName,
        "w-full focus:text-secondary",
        (selected === link ? "text-chart-2" : "")
    )

    function handleNavigate(link: string) {
        if (sidebar.isMobile) {
            sidebar.setOpenMobile(false);
        }
        setSelected(link)
    }

    return  [
        <NavigationMenuItem key="home" className={className}>
                <NavigationMenuTrigger className={triggerStyle('/')}  id="home" asChild>
                    <Link
                        onNavigate={() => handleNavigate("/")}
                        href="/"
                    >
                        Home
                    </Link>
                </NavigationMenuTrigger>
                <NavigationMenuContent className="absolute z-60 w-6/7 translate-y-[-4px]">
                    <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                        <li className="row-span-3">
                            <NavigationMenuLink asChild>
                                <Link
                                    onNavigate={() => {
                                        handleNavigate("/")
                                    }}
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
                        <ListItem
                            setSelected={handleNavigate} href="/#introduction" title="Introduction">
                            About me, and a short history
                        </ListItem>
                        <ListItem
                            setSelected={handleNavigate} href="/#experience" title="Experience">
                            My personal and professional experience
                        </ListItem>
                        <ListItem
                            setSelected={handleNavigate} href="/#technologies" title="Technologies">
                            Programming languages and stuff
                        </ListItem>
                    </ul>
                </NavigationMenuContent>
            </NavigationMenuItem>,
            <NavigationMenuItem key="projects" className={className}>
                <NavigationMenuTrigger className={triggerStyle('/projects')}>Projects</NavigationMenuTrigger>
                <NavigationMenuContent className="absolute z-60 w-6/7 translate-y-[-4px]">
                    <ul className="grid w-[200px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        {projects.map((project) => (
                            <ListItem
                                setSelected={handleNavigate}
                                key={project.title}
                                title={project.title}
                                href={project.href}
                            >
                                {project.description}
                            </ListItem>
                        ))}
                    </ul>
                </NavigationMenuContent>
            </NavigationMenuItem>,
            <NavigationMenuItem className={className} key="the-watering-can">
                <NavigationMenuLink asChild className={triggerStyle('/the-watering-can')}>
                    <Button variant="secondary" asChild>
                        <Link href="/the-watering-can" onClick={() => handleNavigate("/the-watering-can")}>The Watering Can</Link>
                    </Button>
                </NavigationMenuLink>
            </NavigationMenuItem>
        ]
}

export interface ListItemProps extends ComponentPropsWithoutRef<"li"> {
    setSelected: (link: string) => void;
    href: string;
}

function ListItem({
                      title,
                      children,
                      href,
                      setSelected,
                      ...props
                  }: ListItemProps) {
    return (
        <li {...props}>
            <NavigationMenuLink asChild>
                <Link
                    onNavigate={() => {
                        setSelected(href)
                    }} href={href}>
                    <div className="text-sm leading-none font-medium">{title}</div>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    )
}