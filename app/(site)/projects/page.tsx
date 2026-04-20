import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getProjects, seedProjects, type Project } from "@/lib/projects";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore my portfolio of web development projects built with TypeScript, React, Next.js, and more.",
  openGraph: {
    title: "Projects | Josh Wood",
    description:
      "Explore my portfolio of web development projects built with TypeScript, React, Next.js, and more.",
  },
};

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
    >
      <Card className="pt-0 contain-content">
        <CardHeader className="contain-content aspect-[16/9]">

          {!!project.cover &&
              <>
                <Image
                    src={project.cover}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105 "
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </>
          }
        </CardHeader>
        <CardContent className="space-y-2">
          <CardTitle>{project.title}</CardTitle>
          <CardDescription>
            {project.description}
            {project.tech && project.tech.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                      <Badge variant="outline" key={t}>
                        {t}
                      </Badge>
                  ))}
                </div>
            )}
          </CardDescription>
        </CardContent>
        <CardFooter>
          {/*<Button variant="link" size="sm" className="px-0">*/}
            <div className="flex flex-row items-center gap-1 text-primary text-sm font-medium">
                View project
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          {/*</Button>*/}
        </CardFooter>
      </Card>
    </Link>
  );
}

export default async function ProjectsPage() {
  // Seed projects if none exist
  await seedProjects();
  const projects = await getProjects(true); // Only published projects

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Projects
        </h1>
        <p className="mt-2 text-white/70">
          A collection of things I&apos;ve built.
        </p>
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    </section>
  );
}