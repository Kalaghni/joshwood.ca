import {
    Code2, Atom, Braces, Binary, Cpu, Terminal, Layers, Wind,
    Server, Database, Boxes, Shield, Feather, Package, Network, Cable,
    ShoppingCart, CreditCard, CalendarClock, Route, PhoneCall, Smartphone, Nfc,
    Leaf, Sparkles, Zap, Box, KeyRound, Hammer, Gamepad2, PenTool, Blocks,
} from "lucide-react";
import * as React from "react";
import {VisualStudio, Wordpress} from "@/components/icons";
import * as LucideIcons from "lucide-react";

export type TechGroup = "Frontend" | "Backend" | "Data" | "DevOps" | "Integrations" | "AI" | "Other";

export type Tech = {
    name: string;
    group: TechGroup;
    href?: string;
    blurb?: string;
    icon?: string; // Lucide icon name (or "VisualStudio" / "Wordpress" for custom icons)
};

const ICON_COMPONENTS: Record<string, React.ComponentType<{ className?: string }>> = {
    Code2, Atom, Braces, Binary, Cpu, Terminal, Layers, Wind,
    Server, Database, Boxes, Shield, Feather, Package, Network, Cable,
    ShoppingCart, CreditCard, CalendarClock, Route, PhoneCall, Smartphone, Nfc,
    Leaf, Sparkles, Zap, Box, KeyRound, Hammer, Gamepad2, PenTool, Blocks,
    VisualStudio, Wordpress,
};

export function iconKeyForTechnology(name: string): string {
    const key = name.toLowerCase();
    if (/^react$/.test(key)) return "Atom";
    if (/^typescript$|^ts$/.test(key)) return "Braces";
    if (/^next(\.js)?$/.test(key)) return "Layers";
    if (/^tailwind/.test(key)) return "Wind";
    if (/^shadcn/.test(key)) return "Layers";
    if (/^electron$/.test(key)) return "Cpu";
    if (/^php$/.test(key)) return "Braces";
    if (/^python$/.test(key)) return "Binary";
    if (/^c#|^csharp$/.test(key)) return "VisualStudio";
    if (/^node(\.js)?$/.test(key)) return "Server";
    if (/^wordpress$/.test(key)) return "Wordpress";
    if (/^woocommerce$/.test(key)) return "ShoppingCart";
    if (/mysql/.test(key)) return "Database";
    if (/^kafka$/.test(key)) return "Network";
    if (/docker/.test(key)) return "Boxes";
    if (/^linux$/.test(key)) return "Terminal";
    if (/^nginx$/.test(key)) return "Shield";
    if (/^apache$/.test(key)) return "Feather";
    if (/^proxmox$/.test(key)) return "Package";
    if (/^stripe$/.test(key)) return "CreditCard";
    if (/^onfleet$/.test(key)) return "Route";
    if (/^asterisk$|^freepbx$/.test(key)) return "PhoneCall";
    if (/^acuity/.test(key)) return "CalendarClock";
    if (/android|kotlin/.test(key)) return "Smartphone";
    if (/nfc|acr122|ntag/.test(key)) return "Nfc";
    if (/nvidia|cuda/.test(key)) return "Cpu";
    if (/api|webhook/.test(key)) return "Cable";
    if (/mongo/.test(key)) return "Leaf";
    if (/^laravel$/.test(key)) return "Feather";
    if (/inertia/.test(key)) return "Layers";
    if (/tiptap|puck/.test(key)) return "PenTool";
    if (/framer/.test(key)) return "Sparkles";
    if (/^gsap$/.test(key)) return "Zap";
    if (/three|ogl|webgl/.test(key)) return "Box";
    if (/^zod$/.test(key)) return "Shield";
    if (/jwt|jose/.test(key)) return "KeyRound";
    if (/^c\+\+$|opengl/.test(key)) return "Gamepad2";
    if (/cmake/.test(key)) return "Hammer";
    if (/tanstack|dnd-kit|radix/.test(key)) return "Blocks";
    if (/claude|anthropic|openai|codex|openclaw/.test(key)) return "Sparkles";
    return "Code2";
}

export function renderIconByKey(iconKey: string | undefined, fallbackName: string, className = "h-3.5 w-3.5"): React.ReactNode {
    const key = iconKey || iconKeyForTechnology(fallbackName);
    const Curated = ICON_COMPONENTS[key];
    if (Curated) return <Curated className={className} />;
    const Dynamic = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }> | undefined>)[key];
    if (Dynamic) return <Dynamic className={className} />;
    return <Code2 className={className} />;
}

export function iconForTechnology(name: string): React.ReactNode {
    return renderIconByKey(undefined, name);
}

// Your items (expand/replace with your site’s exact list)
export const technologies: Tech[] = [
    { name: "TypeScript", group: "Frontend", href: "https://www.typescriptlang.org" },
    { name: "React", group: "Frontend", href: "https://reactjs.org" },
    { name: "Next.js", group: "Frontend", href: "https://nextjs.org" },
    { name: "Tailwind CSS", group: "Frontend", href: "https://tailwindcss.com" },
    { name: "shadcn/ui", group: "Frontend", href: "https://ui.shadcn.com/" },
    { name: "Radix UI", group: "Frontend", href: "https://www.radix-ui.com" },
    { name: "Framer Motion", group: "Frontend", href: "https://www.framer.com/motion/" },
    { name: "GSAP", group: "Frontend", href: "https://gsap.com" },
    { name: "Three.js", group: "Frontend", href: "https://threejs.org" },
    { name: "TipTap", group: "Frontend", href: "https://tiptap.dev" },
    { name: "Electron", group: "Frontend", href: "https://www.electronjs.org" },
    { name: "Inertia.js", group: "Backend", href: "https://inertiajs.com" },
    { name: "Laravel", group: "Backend", href: "https://laravel.com" },
    { name: "PHP", group: "Backend", href: "https://php.net" },
    { name: "WordPress", group: "Backend", href: "https://wordpress.org" },
    { name: "WooCommerce", group: "Backend", href: "https://woocommerce.com" },
    { name: "Node.js", group: "Backend", href: "https://nodejs.org" },
    { name: "Python", group: "Backend", href: "https://python.org" },
    { name: "C#", group: "Backend" },
    { name: "C++", group: "Backend" },
    { name: "Zod", group: "Backend", href: "https://zod.dev" },
    { name: "JWT (jose)", group: "Backend", href: "https://github.com/panva/jose" },
    { name: "MongoDB", group: "Data", href: "https://www.mongodb.com" },
    { name: "MySQL", group: "Data", href: "https://www.mysql.com" },
    { name: "Docker", group: "DevOps", href: "https://www.docker.com" },
    { name: "Linux", group: "DevOps" },
    { name: "NGINX", group: "DevOps" },
    { name: "Apache", group: "DevOps" },
    { name: "Proxmox", group: "DevOps", href: "https://www.proxmox.com" },
    { name: "CMake", group: "DevOps", href: "https://cmake.org" },
    { name: "Stripe", group: "Integrations", href: "https://stripe.com" },
    { name: "Onfleet", group: "Integrations", href: "https://onfleet.com" },
    { name: "Asterisk/FreePBX", group: "Integrations" },
    { name: "Acuity Scheduling", group: "Integrations", href: "https://acuityscheduling.com" },
    { name: "LogRocket", group: "Integrations", href: "https://logrocket.com" },
    { name: "Claude", group: "AI", href: "https://www.anthropic.com/claude" },
    { name: "OpenAI", group: "AI", href: "https://openai.com" },
    { name: "Codex", group: "AI", href: "https://openai.com/codex" },
    { name: "OpenCLAW", group: "AI" },
    { name: "OpenGL", group: "Other" },
    { name: "Android/Kotlin", group: "Other" },
    { name: "NFC (ACR122U / NTAG)", group: "Other" },
    { name: "NVIDIA/CUDA", group: "Other" },
];
