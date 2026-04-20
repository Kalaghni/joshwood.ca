import type {Metadata} from "next";
import {DM_Sans, DM_Mono, DM_Serif_Display} from "next/font/google";
import "./globals.css";
import {ReactNode} from "react";
import {ThemeProvider} from "@/components/theme-provider";
import LogRocket from "@/components/logrocket-provider";

const dmSans = DM_Sans({
    variable: "--font-dm-sans",
    subsets: ['latin'],
    weight: "400"
});

const dmMono = DM_Mono({
    variable: "--font-dm-mono",
    subsets: ['latin'],
    weight: "400"
});

const dmSerifDisplay = DM_Serif_Display({
    variable: "--font-dm-serif-display",
    subsets: ['latin'],
    weight: "400"
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://joshwood.ca";

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: "Josh Wood | Full-Stack Developer",
        template: "%s | Josh Wood",
    },
    description:
        "Full-stack developer specializing in TypeScript, React, and Next.js. Building modern web applications with clean code and great user experiences.",
    keywords: [
        "Josh Wood",
        "Full-Stack Developer",
        "Web Developer",
        "TypeScript",
        "React",
        "Next.js",
        "Node.js",
        "Portfolio",
    ],
    authors: [{ name: "Josh Wood" }],
    creator: "Josh Wood",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: siteUrl,
        siteName: "Josh Wood",
        title: "Josh Wood | Full-Stack Developer",
        description:
            "Full-stack developer specializing in TypeScript, React, and Next.js. Building modern web applications with clean code and great user experiences.",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Josh Wood - Full-Stack Developer",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Josh Wood | Full-Stack Developer",
        description:
            "Full-stack developer specializing in TypeScript, React, and Next.js.",
        images: ["/og-image.png"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    icons: {
        icon: "/favicon.ico",
        apple: "/apple-touch-icon.png",
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body
            className={`${dmSans.variable} ${dmMono.variable} ${dmSerifDisplay.variable} antialiased`}
        >
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
        >
            <LogRocket/>
            {children}
        </ThemeProvider>
        </body>
        </html>
    );
}

