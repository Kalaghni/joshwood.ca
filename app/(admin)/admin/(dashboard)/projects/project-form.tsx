"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Trash2 } from "lucide-react";
import type { Project, GettingStartedSection, GitHubBadge } from "@/lib/projects";
import {Textarea} from "@/components/ui/textarea";

interface ProjectFormProps {
  project?: Project;
  onSuccess?: () => void;
}

export function ProjectForm({ project, onSuccess }: ProjectFormProps) {
  const router = useRouter();
  const isEditing = !!project;

  const [formData, setFormData] = useState({
    title: project?.title || "",
    slug: project?.slug || "",
    description: project?.description || "",
    body: project?.body || "",
    cover: project?.cover || "",
    tech: project?.tech || [],
    githubUrl: project?.githubUrl || "",
    demoUrl: project?.demoUrl || "",
    githubBadge: project?.githubBadge || null as GitHubBadge | null,
    content: project?.content || "",
    gettingStarted: project?.gettingStarted || [] as GettingStartedSection[],
    published: project?.published ?? false,
    order: project?.order ?? 0,
  });

  const [techInput, setTechInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  }

  function addTech() {
    if (techInput.trim() && !formData.tech.includes(techInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tech: [...prev.tech, techInput.trim()],
      }));
      setTechInput("");
    }
  }

  function removeTech(tech: string) {
    setFormData((prev) => ({
      ...prev,
      tech: prev.tech.filter((t) => t !== tech),
    }));
  }

  function addGettingStartedSection() {
    setFormData((prev) => ({
      ...prev,
      gettingStarted: [
        ...prev.gettingStarted,
        { title: "", content: "", code: "", language: "bash" },
      ],
    }));
  }

  function updateGettingStartedSection(
    index: number,
    field: keyof GettingStartedSection,
    value: string
  ) {
    setFormData((prev) => ({
      ...prev,
      gettingStarted: prev.gettingStarted.map((section, i) =>
        i === index ? { ...section, [field]: value } : section
      ),
    }));
  }

  function removeGettingStartedSection(index: number) {
    setFormData((prev) => ({
      ...prev,
      gettingStarted: prev.gettingStarted.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = isEditing ? `/api/projects/${project._id}` : "/api/projects";
      const method = isEditing ? "PUT" : "POST";

      // Only include githubBadge if it has a workflowUrl
      const dataToSend = {
        ...formData,
        githubBadge:
          formData.githubBadge?.workflowUrl
            ? formData.githubBadge
            : undefined,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save project");
      }

      if (onSuccess) {
        onSuccess();
      }
      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Project" : "New Project"}</CardTitle>
          <CardDescription>
            {isEditing
              ? "Update the project details below"
              : "Fill in the details to create a new project"}
          </CardDescription>
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
                name="title"
                value={formData.title}
                onChange={handleTitleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
              placeholder="Short description shown in cards and project header"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Body</Label>
            <textarea
              id="body"
              name="body"
              value={formData.body}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Extended description shown below the main description on the project page"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover">Cover Image URL</Label>
            <Input
              id="cover"
              name="cover"
              value={formData.cover}
              onChange={handleChange}
              placeholder="/project-cover.png"
            />
          </div>

          <div className="space-y-2">
            <Label>Technologies</Label>
            <div className="flex gap-2">
              <Input
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="Add technology..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTech();
                  }
                }}
              />
              <Button type="button" variant="secondary" onClick={addTech}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tech.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => removeTech(tech)}
                >
                  {tech}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="githubUrl">GitHub URL</Label>
              <Input
                id="githubUrl"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="demoUrl">Demo URL</Label>
              <Input
                id="demoUrl"
                name="demoUrl"
                value={formData.demoUrl}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
          </div>

          {/* GitHub Badge */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>GitHub Workflow Badge (optional)</Label>
              {!formData.githubBadge ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      githubBadge: { workflowUrl: "", branch: "main", label: "" },
                    }))
                  }
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add Badge
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      githubBadge: null,
                    }))
                  }
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Remove
                </Button>
              )}
            </div>

            {formData.githubBadge && (
              <Card className="p-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Workflow URL</Label>
                    <Input
                      value={formData.githubBadge.workflowUrl}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          githubBadge: {
                            ...prev.githubBadge!,
                            workflowUrl: e.target.value,
                          },
                        }))
                      }
                      placeholder="https://github.com/user/repo/actions/workflows/ci.yml"
                    />
                    <p className="text-xs text-muted-foreground">
                      Full URL to your GitHub Actions workflow file
                    </p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Branch</Label>
                      <Input
                        value={formData.githubBadge.branch || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            githubBadge: {
                              ...prev.githubBadge!,
                              branch: e.target.value,
                            },
                          }))
                        }
                        placeholder="main"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Label (optional)</Label>
                      <Input
                        value={formData.githubBadge.label || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            githubBadge: {
                              ...prev.githubBadge!,
                              label: e.target.value,
                            },
                          }))
                        }
                        placeholder="build"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                name="order"
                type="number"
                value={formData.order}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <input
                type="checkbox"
                id="published"
                name="published"
                checked={formData.published}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="published">Published</Label>
            </div>
          </div>

          {/* Getting Started Sections */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Getting Started</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addGettingStartedSection}
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Section
              </Button>
            </div>

            {formData.gettingStarted.map((section, index) => (
              <Card key={index} className="p-4">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <Label>Section Title</Label>
                      <Input
                        value={section.title}
                        onChange={(e) =>
                          updateGettingStartedSection(index, "title", e.target.value)
                        }
                        placeholder="e.g., Installation"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeGettingStartedSection(index)}
                      className="mt-6"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>Content (optional)</Label>
                    <Textarea
                      value={section.content || ""}
                      onChange={(e) =>
                        updateGettingStartedSection(index, "content", e.target.value)
                      }
                      rows={2}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="Explanatory text before the code block"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="md:col-span-3 space-y-2">
                      <Label>Code</Label>
                      <Textarea
                        value={section.code || ""}
                        onChange={(e) =>
                          updateGettingStartedSection(index, "code", e.target.value)
                        }
                        rows={4}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        placeholder="npm install my-package"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Input
                        value={section.language || ""}
                        onChange={(e) =>
                          updateGettingStartedSection(index, "language", e.target.value)
                        }
                        placeholder="bash"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : isEditing
                  ? "Update Project"
                  : "Create Project"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/projects")}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
