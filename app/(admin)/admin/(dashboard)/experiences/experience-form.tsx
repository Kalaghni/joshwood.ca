"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import type { Experience } from "@/lib/experiences";

interface ExperienceFormProps {
  experience?: Experience;
  onSuccess?: () => void;
}

export function ExperienceForm({ experience, onSuccess }: ExperienceFormProps) {
  const router = useRouter();
  const isEditing = !!experience;

  const [formData, setFormData] = useState({
    title: experience?.title || "",
    slug: experience?.slug || "",
    location: experience?.location || "",
    website: experience?.website || "",
    role: experience?.role || "",
    description: experience?.description || "",
    skills: experience?.skills || [],
    footerLink: experience?.footerLink || null as { href: string; label: string } | null,
    published: experience?.published ?? false,
    order: experience?.order ?? 0,
  });

  const [skillInput, setSkillInput] = useState("");
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

  function addSkill() {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  }

  function removeSkill(skill: string) {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = isEditing ? `/api/experiences/${experience._id}` : "/api/experiences";
      const method = isEditing ? "PUT" : "POST";

      // Only include footerLink if it has both href and label
      const dataToSend = {
        ...formData,
        footerLink:
          formData.footerLink?.href && formData.footerLink?.label
            ? formData.footerLink
            : undefined,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save experience");
      }

      if (onSuccess) {
        onSuccess();
      }
      router.push("/admin/experiences");
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
          <CardTitle>{isEditing ? "Edit Experience" : "New Experience"}</CardTitle>
          <CardDescription>
            {isEditing
              ? "Update the experience details below"
              : "Fill in the details to create a new experience"}
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
              <Label htmlFor="title">Company/Client Name</Label>
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

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="role">Role/Position</Label>
              <Input
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g., Lead Developer"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Toronto, ON"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website URL</Label>
            <Input
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              required
              placeholder="Describe your role and responsibilities..."
            />
          </div>

          <div className="space-y-2">
            <Label>Skills/Highlights</Label>
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Add skill..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              <Button type="button" variant="secondary" onClick={addSkill}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => removeSkill(skill)}
                >
                  {skill}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))}
            </div>
          </div>

          {/* Footer Link */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Footer Link (optional)</Label>
              {!formData.footerLink ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      footerLink: { href: "", label: "" },
                    }))
                  }
                >
                  Add Link
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      footerLink: null,
                    }))
                  }
                >
                  Remove
                </Button>
              )}
            </div>

            {formData.footerLink && (
              <Card className="p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Link URL</Label>
                    <Input
                      value={formData.footerLink.href}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          footerLink: {
                            ...prev.footerLink!,
                            href: e.target.value,
                          },
                        }))
                      }
                      placeholder="/the-watering-can"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Link Label</Label>
                    <Input
                      value={formData.footerLink.label}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          footerLink: {
                            ...prev.footerLink!,
                            label: e.target.value,
                          },
                        }))
                      }
                      placeholder="Read more about my work..."
                    />
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

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : isEditing
                  ? "Update Experience"
                  : "Create Experience"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/experiences")}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
