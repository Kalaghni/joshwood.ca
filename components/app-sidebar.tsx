"use client";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader, useSidebar,
} from "@/components/ui/sidebar"
import MainMenu from "@/components/main-menu";
import {NavigationMenu, NavigationMenuList} from "@/components/ui/navigation-menu";
import {Button} from "@/components/ui/button";
import {SidebarClose} from "lucide-react";
import {useEffect} from "react";
import AppFooter from "@/components/app-footer";

export function AppSidebar({className}: {className?: string}) {

    const sidebar = useSidebar();

    useEffect(() => {
        if (!sidebar.isMobile) {
            sidebar.setOpenMobile(false);
        }
    }, [sidebar, sidebar.isMobile]);

    return (
        <Sidebar
            style={
                {
                    "--sidebar-width": "100%"
                } as React.CSSProperties
            }
            collapsible="offcanvas"
            className={className}
        >
            <SidebarHeader />
            <SidebarContent className="w-full">
                <SidebarHeader className="items-end">
                    <Button asChild variant="ghost" className="w-full" onClick={() => sidebar.setOpenMobile(false)}>
                        <SidebarClose/>
                    </Button>
                </SidebarHeader>
                <SidebarGroup className="items-stretch w-full">
                    <NavigationMenu viewport={false} className="max-w-none items-stretch flex-col">
                        <NavigationMenuList className="flex-col items-stretch">
                            {/*<MainMenu triggerClassName="w-full"/>*/}
                        </NavigationMenuList>
                    </NavigationMenu>
                </SidebarGroup>
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter>
                <AppFooter/>
            </SidebarFooter>
        </Sidebar>
    )
}