"use client";

import { useMemo, useState } from "react";
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
import type { Technology } from "@/lib/technologies";
import type { TechGroup } from "@/configs/technologies.config";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { X } from "lucide-react";

const ICON_CHOICES: string[] = Object.keys(LucideIcons).filter((k) => {
  if (!/^[A-Z]/.test(k)) return false;
  if (k.endsWith("Icon")) return false;
  if (k === "createLucideIcon" || k === "LucideIcon" || k === "Icon") return false;
  const val = (LucideIcons as unknown as Record<string, unknown>)[k];
  return typeof val === "object" || typeof val === "function";
});

function getLucideIcon(name?: string): LucideIcon | null {
  if (!name) return null;
  const icons = LucideIcons as unknown as Record<string, LucideIcon>;
  const icon = icons[name];
  return typeof icon === "function" || typeof icon === "object" ? icon : null;
}

const GROUPS: TechGroup[] = [
  "Frontend",
  "Backend",
  "Data",
  "DevOps",
  "Integrations",
  "AI",
  "Other",
];

interface TechnologyFormProps {
  technology?: Technology;
  onSuccess?: () => void;
}

export function TechnologyForm({ technology, onSuccess }: TechnologyFormProps) {
  const router = useRouter();
  const isEditing = !!technology;

  const [formData, setFormData] = useState({
    name: technology?.name || "",
    group: (technology?.group as TechGroup) || ("Frontend" as TechGroup),
    href: technology?.href || "",
    blurb: technology?.blurb || "",
    icon: technology?.icon || "",
    published: technology?.published ?? true,
    order: technology?.order ?? 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [iconSearch, setIconSearch] = useState("");

  const filteredIcons = useMemo(() => {
    const q = iconSearch.trim().toLowerCase();
    const list = q
      ? ICON_CHOICES.filter((n) => n.toLowerCase().includes(q))
      : ICON_CHOICES;
    return Array.from(new Set(list));
  }, [iconSearch]);

  const SelectedIcon = getLucideIcon(formData.icon);

  function handleChange({
                          value,
                          name,
                          type
                        }: {
    value: string | number | boolean;
    name: keyof Technology;
    type: "input" | "select" | "checkbox" | "number";
  }) {
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? value
          : type === "number"
            ? Number(value)
            : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = isEditing
        ? `/api/technologies/${technology._id}`
        : "/api/technologies";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save technology");
      }

      if (onSuccess) onSuccess();
      router.push("/admin/technologies");
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
          <CardTitle>{isEditing ? "Edit Technology" : "New Technology"}</CardTitle>
          <CardDescription>
            {isEditing
              ? "Update the technology details below"
              : "Add a new technology to the public list"}
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
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) => handleChange({ value: e.target.value, name: "name", type: "input" })}
                placeholder="e.g., TypeScript"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="group">Group</Label>
              <Select
                name="group"
                value={formData.group}
                onValueChange={(value) => handleChange({ value, name: "group", type: "select" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent>
                  {GROUPS.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="href">Website URL (optional)</Label>
            <Input
              id="href"
              name="href"
              value={formData.href}
              onChange={(e) => handleChange({ value: e.target.value, name: "href", type: "input" })}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label>Icon (optional)</Label>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-muted/40">
                {SelectedIcon ? (
                  <SelectedIcon className="h-5 w-5" />
                ) : (
                  <span className="text-xs text-muted-foreground">none</span>
                )}
              </div>
              <Input
                placeholder="Search icons..."
                value={iconSearch}
                onChange={(e) => setIconSearch(e.target.value)}
              />
              {formData.icon && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleChange({ value: "", name: "icon" as keyof Technology, type: "input" })}
                  aria-label="Clear icon"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="grid max-h-48 grid-cols-8 gap-1 overflow-y-auto rounded-md border p-2 sm:grid-cols-10 md:grid-cols-12">
              {filteredIcons.map((iconName) => {
                const Icon = getLucideIcon(iconName);
                if (!Icon) return null;
                const selected = formData.icon === iconName;
                return (
                  <button
                    key={iconName}
                    type="button"
                    title={iconName}
                    onClick={() => handleChange({ value: iconName, name: "icon" as keyof Technology, type: "input" })}
                    className={`flex h-9 w-9 items-center justify-center rounded-md border transition-colors hover:bg-muted ${
                      selected ? "border-primary bg-primary/10" : "border-transparent"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                );
              })}
              {filteredIcons.length === 0 && (
                <p className="col-span-full py-2 text-center text-xs text-muted-foreground">
                  No icons match "{iconSearch}"
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="blurb">Blurb (optional)</Label>
            <Textarea
              id="blurb"
              name="blurb"
              value={formData.blurb}
              onChange={(e) => handleChange({ value: e.target.value, name: "blurb", type: "input" })}
              rows={3}
              placeholder="Short description shown in tooltips..."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                name="order"
                type="number"
                value={formData.order}
                onChange={(e) => handleChange({ value: e.target.value, name: "order", type: "input" })}
              />
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <input
                type="checkbox"
                id="published"
                name="published"
                checked={formData.published}
                onChange={(e) => handleChange({ value: e.target.checked, name: "published", type: "checkbox" })}
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
                  ? "Update Technology"
                  : "Create Technology"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/technologies")}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
