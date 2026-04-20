export interface ProjectProps {
    title: string;
    description: string;
    href: string;
    cover?: string;
    tech?: string[];
}

export type MainNavItem =
    | {
    id: string;
    label: string;
    kind: "link";
    href: string;
}
    | {
    id: string;
    label: string;
    kind: "dropdown" | "popover";
    href?: string;
    // Optional “featured” card (your big Home card)
    featured?: {
        title: string;
        href: string;
        description: string;
    };
    items: ProjectProps[];
};

export function buildMainNav(projects: ProjectProps[]): MainNavItem[] {
    return [
        {
            id: "home",
            label: "Home",
            kind: "popover",
            href: "/",
            featured: {
                title: "Home",
                href: "/",
                description: "Visit the home page",
            },
            items: [
                {
                    title: "Technologies",
                    href: "/#technologies",
                    description: "Programming languages and stuff",
                },
                {
                    title: "Experience",
                    href: "/#experience",
                    description: "My personal and professional experience",
                },
            ],
        },
        // {
        //     id: "contact",
        //     label: "Contact",
        //     kind: "link",
        //     href: "/contact",
        // },
        {
            id: "projects",
            href: "/projects",
            label: "Projects",
            kind: "popover",
            items: projects,
        },
        {
            id: "twc",
            label: "The Watering Can",
            kind: "link",
            href: "/the-watering-can",
        },
    ];
}
