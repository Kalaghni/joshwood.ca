"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, ExternalLink, Plus, GripVertical } from "lucide-react";
import type { Project } from "@/lib/projects";

interface ProjectsTableProps {
  projects: Project[];
}

function SortableRow({
  project,
  onDelete,
  deleting,
}: {
  project: Project;
  onDelete: (id: string) => void;
  deleting: string | null;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project._id! });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell className="w-10">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>
      </TableCell>
      <TableCell className="font-medium">{project.title}</TableCell>
      <TableCell className="text-muted-foreground">{project.slug}</TableCell>
      <TableCell>
        <Badge variant={project.published ? "secondary" : "default"}>
          {project.published ? "Published" : "Draft"}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/projects/${project.slug}`} target="_blank">
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/admin/projects/${project._id}`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(project._id!)}
            disabled={deleting === project._id}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function ProjectsTable({ projects: initialProjects }: ProjectsTableProps) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [deleting, setDeleting] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects(projects.filter((p) => p._id !== id));
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
    } finally {
      setDeleting(null);
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = projects.findIndex((p) => p._id === active.id);
      const newIndex = projects.findIndex((p) => p._id === over.id);

      const newProjects = arrayMove(projects, oldIndex, newIndex);
      setProjects(newProjects);

      // Update order in database
      const updates = newProjects.map((project, index) => ({
        id: project._id!,
        order: index,
      }));

      try {
        await Promise.all(
          updates.map(({ id, order }) =>
            fetch(`/api/projects/${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ order }),
            })
          )
        );
      } catch (error) {
        console.error("Failed to update order:", error);
        // Revert on error
        setProjects(initialProjects);
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button size="sm" asChild>
          <Link href="/admin/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
          <SortableContext
              items={projects.map((p) => p._id!)}
              strategy={verticalListSortingStrategy}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No projects found. Create your first project!
                    </TableCell>
                  </TableRow>
                ) : projects.map((project) => (
                  <SortableRow
                    key={project._id}
                    project={project}
                    onDelete={handleDelete}
                    deleting={deleting}
                  />
                ))}
              </TableBody>
            </Table>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
