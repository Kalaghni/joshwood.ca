import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogBySlug, getBlogs } from "@/lib/blogs";
import BlogArticle from "@/components/blog/blog-article";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://joshwood.ca";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog || !blog.published) {
    return { title: "Post Not Found" };
  }

  const seo = blog.seo || {};
  const title = seo.metaTitle || blog.title;
  const description = seo.metaDescription || blog.excerpt;
  const image = seo.ogImage || blog.cover;
  const url = seo.canonicalUrl || `${siteUrl}/blog/${blog.slug}`;

  return {
    title,
    description,
    keywords: seo.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | Josh Wood`,
      description,
      type: "article",
      url,
      publishedTime: blog.publishedAt
        ? new Date(blog.publishedAt).toISOString()
        : undefined,
      images: image
        ? [{ url: image, width: 1200, height: 630, alt: blog.title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const blogs = await getBlogs(true);
  return blogs.map((blog) => ({ slug: blog.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog || !blog.published) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt,
    image: blog.cover,
    datePublished: blog.publishedAt
      ? new Date(blog.publishedAt).toISOString()
      : new Date(blog.createdAt).toISOString(),
    dateModified: new Date(blog.updatedAt).toISOString(),
    author: { "@type": "Person", name: "Josh Wood", url: siteUrl },
    mainEntityOfPage: `${siteUrl}/blog/${blog.slug}`,
    keywords: blog.tags?.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogArticle blog={blog} />
    </>
  );
}
