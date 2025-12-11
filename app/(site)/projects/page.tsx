import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { projects, type ProjectProps } from "@/configs/nav.config";

function ProjectCard({ project }: { project: ProjectProps }) {
  return (
    <Link
      href={project.href}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl",
        "border border-white/10 bg-black/40 backdrop-blur-xl",
        "shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] ring-1 ring-white/5",
        "transition-all duration-300",
        "hover:border-white/20 hover:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.6)]",
        "hover:-translate-y-1"
      )}
    >
      {/* Cover Image */}
      {project.cover && (
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image
            src={project.cover}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h2 className="text-lg font-semibold text-white group-hover:text-white/90">
          {project.title}
        </h2>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-white/70">
          {project.description}
        </p>

        {/* Tech Pills */}
        {project.tech && project.tech.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-white/70"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {/* View Project Link */}
        <div className="mt-4 flex items-center gap-1 text-sm font-medium text-white/60 transition-colors group-hover:text-white">
          View project
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

export default function ProjectsPage() {
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
          <ProjectCard key={project.href} project={project} />
        ))}
      </div>
    </section>
  );
}