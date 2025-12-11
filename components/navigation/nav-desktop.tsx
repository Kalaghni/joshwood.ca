"use client"

import {
    NavigationMenu,
    NavigationMenuContent, NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList, NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import {mainNav, ProjectProps} from "@/configs/nav.config";
import Link from "next/link";
import {ComponentProps, ComponentPropsWithoutRef} from "react";
import {cn} from "@/lib/utils";
import {usePathname} from "next/navigation";
import {Button} from "@/components/ui/button";

export default function NavDesktop({className, ...props}: ComponentProps<'ul'>) {

    const pathname = usePathname();

    return (
        <NavigationMenu className="mx-auto">
            <NavigationMenuList
                {...props}
                className={cn(className)}>
                {mainNav.map((navItem, nix) => {
                    const selected = navItem.href === pathname

                    return (
                        <NavigationMenuItem key={nix}>
                            <NavigationMenuTrigger asChild>
                                <Button variant={selected ? "link" : "secondary"} data-hover={selected} className={cn("shadow-none", (selected ? "focus:text-primary active:bg-transparent focus:bg-transparent": ""))} asChild>
                                    {navItem.href ?
                                        <Link href={navItem.href}>
                                            {navItem.label}
                                        </Link>
                                    :
                                        navItem.label
                                    }

                                </Button>
                            </NavigationMenuTrigger>
                            {(navItem.kind === "dropdown" || navItem.kind === "popover") && (
                                <NavigationMenuContent>
                                    {navItem.kind === "dropdown" &&
                                        <ul className="grid w-[200px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                            {(navItem.items.map((submenuItem, idx) => (
                                                <ListItem
                                                    key={idx}
                                                    className="w-full"
                                                    title={submenuItem.title}
                                                    href={submenuItem.href}
                                                >
                                                    {submenuItem.description}
                                                </ListItem>
                                            )))}
                                        </ul>
                                    }
                                    {navItem.kind === "popover" &&
                                        <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                            {navItem.featured && (
                                                <li className="row-span-3">
                                                    <NavigationMenuLink asChild>
                                                        <Link
                                                            className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                                                            href={navItem.featured.href}
                                                        >
                                                            <div className="mt-4 mb-2 text-lg font-medium">
                                                                {navItem.featured.title}
                                                            </div>
                                                            <p className="text-muted-foreground text-sm leading-tight">
                                                                {navItem.featured.description}
                                                            </p>
                                                        </Link>
                                                    </NavigationMenuLink>
                                                </li>
                                            )}
                                            {(navItem.items.map((submenuItem, idx) => (
                                                <PopoverItem key={idx} submenuItem={submenuItem}/>
                                            )))}
                                        </ul>
                                    }
                                </NavigationMenuContent>
                            )}
                        </NavigationMenuItem>
                    )
                })}
            </NavigationMenuList>
        </NavigationMenu>
    )
}

const SubmenuItem = ({
    submenuItem,
                     }: {
    submenuItem: ProjectProps
}) => {
    return (
        <NavigationMenuLink>
            {submenuItem.title}
        </NavigationMenuLink>
    )
}

const PopoverItem = ({
                         submenuItem
}: {
    submenuItem: ProjectProps
}) => {
    return (
        // <NavigationMenuSub>
                <ListItem href={submenuItem.href} title={submenuItem.title}>
                    {submenuItem.description}
                </ListItem>
        // </NavigationMenuSub>
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
                <Link
                    href={href}
                    className="block rounded-lg p-3 transition-all duration-200 hover:bg-white/10 hover:shadow-md hover:scale-[1.02]"
                >
                    <div className="text-sm leading-none font-medium">{title}</div>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    );
}
