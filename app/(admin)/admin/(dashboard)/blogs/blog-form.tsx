"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { X, RefreshCw, ExternalLink } from "lucide-react";
import type { Blog, BlogSeo } from "@/lib/blogs";

function toDateInput(value: Date | string | null | undefined): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface BlogFormProps {
  blog?: Blog;
}

export function BlogForm({ blog }: BlogFormProps) {
  const router = useRouter();
  const isEditing = !!blog;

  const [formData, setFormData] = useState({
    title: blog?.title || "",
    slug: blog?.slug || "",
    excerpt: blog?.excerpt || "",
    body: blog?.body || "",
    cover: blog?.cover || "",
    tags: blog?.tags || ([] as string[]),
    publishedAt: toDateInput(blog?.publishedAt),
    seo: (blog?.seo || {}) as BlogSeo,
    published: blog?.published ?? false,
    order: blog?.order ?? 0,
  });
  const [tagInput, setTagInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function setField<K extends keyof typeof formData>(
    key: K,
    value: (typeof formData)[K]
  ) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  function setSeo<K extends keyof BlogSeo>(key: K, value: BlogSeo[K]) {
    setFormData((prev) => ({ ...prev, seo: { ...prev.seo, [key]: value } }));
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || slugify(title),
    }));
  }

  function addTag() {
    const v = tagInput.trim();
    if (v && !formData.tags.includes(v)) {
      setField("tags", [...formData.tags, v]);
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    setField("tags", formData.tags.filter((t) => t !== tag));
  }

  function addKeyword() {
    const v = keywordInput.trim();
    const current = formData.seo.keywords || [];
    if (v && !current.includes(v)) {
      setSeo("keywords", [...current, v]);
    }
    setKeywordInput("");
  }

  function removeKeyword(kw: string) {
    setSeo(
      "keywords",
      (formData.seo.keywords || []).filter((k) => k !== kw)
    );
  }

  async function save(publishOverride?: boolean) {
    setError("");
    setLoading(true);
    try {
      const url = isEditing ? `/api/blogs/${blog._id}` : "/api/blogs";
      const method = isEditing ? "PUT" : "POST";
      const payload = {
        ...formData,
        published: publishOverride ?? formData.published,
        slug: formData.slug.trim(),
        publishedAt: formData.publishedAt || null,
      };
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save blog");
      }
      router.push("/admin/blogs");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    void save();
  }

  const previewMarkdown = useMemo(
    () => formData.body || "_Nothing to preview yet._",
    [formData.body]
  );

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>{isEditing ? "Edit Blog" : "New Blog"}</CardTitle>
            <CardDescription>
              {isEditing
                ? "Update the post, toggle publish, or preview the draft."
                : "Compose a new post. Save as draft or publish immediately."}
            </CardDescription>
          </div>
          {isEditing && (
            <Button variant="outline" size="sm" asChild>
              <Link
                href={
                  blog!.published
                    ? `/blog/${blog!.slug}`
                    : `/blog/preview/${blog!._id}`
                }
                target="_blank"
              >
                <ExternalLink className="mr-1 h-4 w-4" />
                {blog!.published ? "View live" : "Preview draft"}
              </Link>
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-500">
              {error}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={handleTitleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <div className="flex gap-2">
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setField("slug", e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  title="Regenerate slug from title"
                  onClick={() => setField("slug", slugify(formData.title))}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setField("excerpt", e.target.value)}
              rows={2}
              placeholder="Short summary shown on the blog index and in link previews."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover">Cover Image URL</Label>
            <Input
              id="cover"
              value={formData.cover}
              onChange={(e) => setField("cover", e.target.value)}
              placeholder="/blog-cover.png or https://..."
            />
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tag..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button type="button" variant="secondary" onClick={addTag}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => removeTag(tag)}
                >
                  {tag}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Body (Markdown)</Label>
            <div className="grid gap-4 lg:grid-cols-2">
              <Textarea
                value={formData.body}
                onChange={(e) => setField("body", e.target.value)}
                rows={24}
                className="font-mono text-sm"
                placeholder="# Hello world\n\nWrite markdown here. Preview appears to the right."
              />
              <div className="rounded-md border border-border/50 bg-background/50 p-4 overflow-auto max-h-[36rem]">
                <div className="prose prose-invert max-w-none prose-headings:font-heading prose-a:text-primary text-sm">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {previewMarkdown}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="publishedAt">Publish Date</Label>
              <Input
                id="publishedAt"
                type="date"
                value={formData.publishedAt}
                onChange={(e) => setField("publishedAt", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setField("order", Number(e.target.value) || 0)
                }
              />
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setField("published", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="published">Published</Label>
            </div>
          </div>

          <Card className="p-4">
            <div className="space-y-4">
              <div>
                <Label className="text-base">SEO & Metadata</Label>
                <p className="text-xs text-muted-foreground">
                  Overrides for search engines and social sharing. Leave blank
                  to fall back to the title / excerpt / cover.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Meta Title</Label>
                  <Input
                    value={formData.seo.metaTitle || ""}
                    onChange={(e) => setSeo("metaTitle", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Canonical URL</Label>
                  <Input
                    value={formData.seo.canonicalUrl || ""}
                    onChange={(e) => setSeo("canonicalUrl", e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Textarea
                  rows={2}
                  value={formData.seo.metaDescription || ""}
                  onChange={(e) => setSeo("metaDescription", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>OG Image URL</Label>
                <Input
                  value={formData.seo.ogImage || ""}
                  onChange={(e) => setSeo("ogImage", e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label>Keywords</Label>
                <div className="flex gap-2">
                  <Input
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    placeholder="Add keyword..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addKeyword();
                      }
                    }}
                  />
                  <Button type="button" variant="secondary" onClick={addKeyword}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(formData.seo.keywords || []).map((kw) => (
                    <Badge
                      key={kw}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeKeyword(kw)}
                    >
                      {kw}
                      <X className="ml-1 h-3 w-3" />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <div className="flex flex-wrap gap-3 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : isEditing ? "Update" : "Create"}
            </Button>
            {!formData.published && (
              <Button
                type="button"
                variant="default"
                disabled={loading}
                onClick={() => {
                  setField("published", true);
                  void save(true);
                }}
              >
                Save & Publish
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/blogs")}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
