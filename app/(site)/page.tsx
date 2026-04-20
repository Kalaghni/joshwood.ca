import type { Metadata } from "next";
import Hero from "@/app/(site)/hero";
// import Introduction from "@/components/introduction";
import Experience from "@/app/(site)/experience";
import Technologies from "@/app/(site)/technologies";
import LightModeNotice from "@/app/(site)/light-mode-notice";
import { getTechnologies, seedTechnologies, migrateTechnologyIcons } from "@/lib/technologies";
import type { Tech } from "@/configs/technologies.config";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Josh Wood - Full-stack developer specializing in TypeScript, React, and Next.js. View my experience, projects, and skills.",
  openGraph: {
    title: "Josh Wood | Full-Stack Developer",
    description:
      "Full-stack developer specializing in TypeScript, React, and Next.js. View my experience, projects, and skills.",
  },
};

export default async function Home() {
    await seedTechnologies();
    await migrateTechnologyIcons();
    const dbTechs = await getTechnologies(true);
    const techs: Tech[] = dbTechs.map((t) => ({
        name: t.name,
        group: t.group,
        href: t.href,
        blurb: t.blurb,
        icon: t.icon,
    }));

    return (
        <section id="home" className="max-w-lvw  w-screen xl:w-[calc(100vw_-_480px)] xl:mx-60 pb-12">
            <Hero />
            <Technologies items={techs} />
            {/*<Introduction />*/}
            <Experience />
            <LightModeNotice />
        </section>
    );
}
