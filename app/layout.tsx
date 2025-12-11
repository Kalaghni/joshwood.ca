import type {Metadata} from "next";
import {DM_Sans, DM_Mono, DM_Serif_Display} from "next/font/google";
import "./globals.css";
import {ReactNode} from "react";
import {ThemeProvider} from "@/components/theme-provider";

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

export const metadata: Metadata = {
    title: "Josh Wood",
    description: "Developer/Programmer",
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
            {children}
        </ThemeProvider>
        </body>
        </html>
    );
}

