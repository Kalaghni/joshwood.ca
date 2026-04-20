import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug, getProjects, seedProjects } from "@/lib/projects";
import ProjectOverview from "@/components/templates/project-overview";
import CodeBlock from "@/components/ui/code-block";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  await seedProjects();
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://joshwood.ca";

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: `${project.title} | Josh Wood`,
      description: project.description,
      type: "article",
      url: `${siteUrl}/projects/${project.slug}`,
      images: project.cover
        ? [
            {
              url: project.cover,
              width: 1200,
              height: 630,
              alt: `${project.title} screenshot`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: project.cover ? [project.cover] : undefined,
    },
  };
}

export async function generateStaticParams() {
  await seedProjects();
  const projects = await getProjects(true);
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  await seedProjects();
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const actions: Parameters<typeof ProjectOverview>[0]["actions"] = [];

  if (project.githubUrl) {
    actions.push({
      type: "github",
      href: project.githubUrl,
      label: "Repository",
    });
  }

  if (project.demoUrl) {
    actions.push({
      type: "demo",
      href: project.demoUrl,
      label: "Live Demo",
    });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://joshwood.ca";

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.title,
    description: project.description,
    url: `${siteUrl}/projects/${project.slug}`,
    author: {
      "@type": "Person",
      name: "Josh Wood",
      url: siteUrl,
    },
    programmingLanguage: project.tech,
    codeRepository: project.githubUrl,
    image: project.cover,
  };

  return (
    <main className="px-4 py-10 sm:px-6 w-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />
      <ProjectOverview
        title={project.title}
        subtitle={project.description}
        summary={project.body ? <p>{project.body}</p> : undefined}
        cover={
          project.cover
            ? {
                src: project.cover,
                alt: `${project.title} screenshot`,
                aspect: "16/9",
                width: 1280,
              }
            : undefined
        }
        meta={[
          { label: "Status", value: project.published ? "Active" : "Draft" },
        ]}
        tech={project.tech}
        actions={actions}
        githubBadge={project.githubBadge}
      >
        {project.content && (
          <div dangerouslySetInnerHTML={{ __html: project.content }} />
        )}

        {project.gettingStarted && project.gettingStarted.length > 0 && (
          <>
            <div className="my-6 h-px w-full bg-white/10" />
            {project.gettingStarted.map((section, index) => (
              <div key={index}>
                <h3>{section.title}</h3>
                {section.content && <p>{section.content}</p>}
                {section.code && (
                  <CodeBlock
                    language={section.language || "bash"}
                    code={section.code}
                  />
                )}
              </div>
            ))}
          </>
        )}
      </ProjectOverview>
    </main>
  );
}
