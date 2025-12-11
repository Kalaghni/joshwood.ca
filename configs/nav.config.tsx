export interface ProjectProps {
    title: string;
    description: string;
    href: string;
    cover?: string;
    tech?: string[];
}
export const projects: ProjectProps[] = [
    {
        title: "Shell-GPT",
        description: "An Electron-based 'shell' that wraps GPT and executes its commands in a Docker container.",
        href: "/projects/shell-gpt",
        cover: "/shell-gpt-screenshot.png",
        tech: ["TypeScript", "Electron", "OpenAI", "Docker"],
    },
    {
        title: "echoSH",
        description: "The Synesthetic Terminal — transforms your CLI workflow into an immersive generative audio experience.",
        href: "/projects/echo-sh",
        cover: "/echosh-demo.webp",
        tech: ["TypeScript", "Electron", "Node.js", "Web Audio"],
    },
    {
        title: "Redux-Calculator",
        description: "A calculator built with React and Redux demonstrating state management patterns.",
        href: "/projects/redux-calculator",
        cover: "/redux-calculator.png",
        tech: ["React", "Redux", "TypeScript"],
    },
];

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

export const mainNav: MainNavItem[] = [
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
            // {
            //     title: "Introduction",
            //     href: "/#introduction",
            //     description: "About me, and a short history",
            // },
            {
                title: "Experience",
                href: "/#experience",
                description: "My personal and professional experience",
            },
        ],
    },
    {
        id: "contact",
        label: "Contact",
        kind: "link",
        href: "/contact",
    },
    {
        id: "projects",
        href: "/projects",
        label: "Projects",
        kind: "popover",
        items: projects.map((p) => ({
            title: p.title,
            href: p.href,
            description: p.description,
        })),
    },
    {
        id: "twc",
        label: "The Watering Can",
        kind: "link",
        href: "/the-watering-can",
    },
];
