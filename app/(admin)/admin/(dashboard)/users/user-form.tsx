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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UserPublic, UserRole } from "@/lib/users";

interface UserFormProps {
  user?: UserPublic;
  isCurrentUser?: boolean;
  onSuccess?: () => void;
}

export function UserForm({ user, isCurrentUser, onSuccess }: UserFormProps) {
  const router = useRouter();
  const isEditing = !!user;

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    role: user?.role || "client" as UserRole,
    active: user?.active ?? true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = isEditing ? `/api/users/${user._id}` : "/api/users";
      const method = isEditing ? "PUT" : "POST";

      // Don't send empty password on edit
      const dataToSend = {
        ...formData,
        password: formData.password || (isEditing ? undefined : formData.password),
      };

      if (isEditing && !formData.password) {
        delete dataToSend.password;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save user");
      }

      if (onSuccess) {
        onSuccess();
      }
      router.push("/admin/users");
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
          <CardTitle>{isEditing ? "Edit User" : "New User"}</CardTitle>
          <CardDescription>
            {isEditing
              ? "Update the user details below"
              : "Fill in the details to create a new user"}
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
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="password">
                Password {isEditing && "(leave blank to keep current)"}
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required={!isEditing}
                placeholder={isEditing ? "Leave blank to keep current" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value: UserRole) =>
                  setFormData((prev) => ({ ...prev, role: value }))
                }
                disabled={isCurrentUser}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                </SelectContent>
              </Select>
              {isCurrentUser && (
                <p className="text-xs text-muted-foreground">
                  You cannot change your own role
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="active"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              disabled={isCurrentUser}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="active">Active</Label>
            {isCurrentUser && (
              <span className="text-xs text-muted-foreground ml-2">
                (You cannot deactivate your own account)
              </span>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : isEditing
                  ? "Update User"
                  : "Create User"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/users")}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
