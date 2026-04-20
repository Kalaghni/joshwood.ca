"use client";

import {MainNavItem} from "@/configs/nav.config";
import Link from "next/link";
import {ComponentProps, ComponentPropsWithoutRef} from "react";
import {cn} from "@/lib/utils";
import {
    SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub, SidebarMenuSubItem, SidebarTrigger, useSidebar
} from "@/components/ui/sidebar";
import {Button} from "@/components/ui/button";
import Logo from "@/components/icons/logo";
import {usePathname} from "next/navigation";
import P from "@/components/typography/p";
import { ChevronRight, LogIn, LayoutDashboard } from "lucide-react";

const currentYear = new Date().getFullYear();

export interface NavMobileProps extends ComponentProps<'div'> {
    navItems: MainNavItem[];
    isLoggedIn?: boolean;
}

export default function NavMobile({className, navItems, isLoggedIn = false, ...props}: NavMobileProps) {

    const pathname = usePathname();
    const sidebar = useSidebar();

    function handleClick() {
        sidebar.setOpenMobile(false);
        sidebar.setOpen(false);
    }

    if (!sidebar.isMobile) return null;

    return (
        <>
            <SidebarHeader>
                <div className="flex justify-between items-center mr-2">
                    <SidebarTrigger/>
                    <Logo/>
                </div>
            </SidebarHeader>
            <SidebarContent
                {...props}
                className={cn(className)}
            >
                {navItems.filter(mn => mn.kind !== "link").map((item, idx) => (
                    <SidebarGroup key={idx}>
                            {(item.featured !== undefined) ? (
                                <SidebarGroupContent>
                                    <SidebarMenuItem className="w-full">
                                        <SidebarMenuButton asChild>
                                            <Button asChild>
                                                <Link href={item.featured.href} onClick={handleClick}>
                                                    {item.featured.title}
                                                </Link>
                                            </Button>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    {item.items.map((subItem, subIdx) => {
                                        const selected = pathname !== "/" && subItem.href.startsWith(pathname);
                                        return (
                                            <SidebarMenuSub key={subIdx}>
                                                <SidebarMenuSubItem>
                                                    <SidebarMenuButton className="justify-start" asChild>
                                                        <Button variant="link" className={selected ? "text-secondary" : ""} asChild>
                                                            <Link href={subItem.href} onClick={handleClick}>
                                                                {selected && <ChevronRight/>}
                                                                {subItem.title}
                                                                {/*<br/>*/}
                                                                {/*<small className="text-muted-foreground">{subItem.description.slice(0,40)}{subItem.description.length > 40 ? "..." : ""}</small>*/}
                                                            </Link>
                                                        </Button>
                                                    </SidebarMenuButton>
                                                </SidebarMenuSubItem>
                                            </SidebarMenuSub>
                                        )
                                    })}
                                </SidebarGroupContent>
                            ) : (
                                <SidebarGroupContent>
                                    <SidebarMenuItem className="w-full">
                                            {item.href ?
                                                <SidebarMenuButton asChild>
                                                    <Link href={item.href}>
                                                        {item.label}
                                                    </Link>
                                                </SidebarMenuButton>
                                            :
                                                <SidebarMenuButton asChild>
                                                    {item.label}
                                                </SidebarMenuButton>
                                            }
                                    </SidebarMenuItem>
                                    {item.items.map((subItem, subIdx) => {
                                        const selected = pathname !== "/" && subItem.href.startsWith(pathname);
                                        return (
                                            <SidebarMenuSub key={subIdx}>
                                                <SidebarMenuSubItem>
                                                    <SidebarMenuButton className="justify-start" asChild>
                                                        <Button variant="link" className={selected ? "text-secondary" : ""} asChild>
                                                            <Link href={subItem.href} onClick={handleClick}>
                                                                {selected && <ChevronRight/>}
                                                                {subItem.title}
                                                            </Link>
                                                        </Button>
                                                    </SidebarMenuButton>
                                                </SidebarMenuSubItem>
                                            </SidebarMenuSub>
                                        )
                                    })}
                                </SidebarGroupContent>
                            )}
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem className="w-full">
                        <Button variant="outline" className="w-full" asChild>
                            <Link href={isLoggedIn ? "/admin" : "/admin/login"} onClick={handleClick}>
                                {isLoggedIn ? (
                                    <>
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        Dashboard
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="mr-2 h-4 w-4" />
                                        Login
                                    </>
                                )}
                            </Link>
                        </Button>
                    </SidebarMenuItem>
                </SidebarMenu>
                <SidebarMenu>
                {navItems.filter(mn => mn.kind === "link").map((item, idx) => (
                    <SidebarMenuItem className="w-full" key={idx}>
                        <Button variant="link" className="w-full" asChild>
                            <SidebarMenuButton asChild>
                                <Link href={item.href} onClick={handleClick}>
                                    {item.label}
                                </Link>
                            </SidebarMenuButton>
                        </Button>
                    </SidebarMenuItem>
                    )
                )}
                </SidebarMenu>
                <div>
                    <P className="text-center">Josh Wood &copy; {currentYear}</P>
                </div>
            </SidebarFooter>
        </>
    )
}

function ListItem({
                      title,
                      children,
                      href,
                      ...props
                  }: ComponentPropsWithoutRef<"li"> & { href: string }) {

    const sidebar = useSidebar();

    function handleClick() {
        sidebar.setOpenMobile(false);
        sidebar.setOpen(false);
    }

    return (
        <li {...props}>
            <SidebarMenuButton asChild>
                <Link
                    onClick={handleClick}
                    href={href}
                    className="block rounded-lg p-3 transition-all duration-200 hover:bg-white/10 hover:shadow-md hover:scale-[1.02]"
                >
                    <div className="text-sm leading-none font-medium text-white">{title}</div>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                        {children}
                    </p>
                </Link>
            </SidebarMenuButton>
        </li>
    );
}
