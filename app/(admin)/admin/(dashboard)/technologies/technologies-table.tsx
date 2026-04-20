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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Plus, GripVertical, ExternalLink } from "lucide-react";
import type { Technology } from "@/lib/technologies";

interface TechnologiesTableProps {
  technologies: Technology[];
}

function SortableRow({
  technology,
  onDelete,
  deleting,
}: {
  technology: Technology;
  onDelete: (id: string) => void;
  deleting: string | null;
}) {
  const router = useRouter();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: technology._id! });

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
      <TableCell className="font-medium">{technology.name}</TableCell>
      <TableCell>
        <Badge variant="outline" className="rounded-full">
          {technology.group}
        </Badge>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {technology.href ? (
          <a
            href={technology.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 hover:text-foreground"
          >
            {new URL(technology.href).hostname}
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <span className="opacity-50">—</span>
        )}
      </TableCell>
      <TableCell>
        <Badge variant={technology.published ? "secondary" : "default"}>
          {technology.published ? "Published" : "Draft"}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/admin/technologies/${technology._id}`)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Technology</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &quot;{technology.name}&quot;?
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(technology._id!)}
                  disabled={deleting === technology._id}
                >
                  {deleting === technology._id ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function TechnologiesTable({
  technologies: initialTechnologies,
}: TechnologiesTableProps) {
  const router = useRouter();
  const [technologies, setTechnologies] = useState(initialTechnologies);
  const [deleting, setDeleting] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      const res = await fetch(`/api/technologies/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete technology");
      setTechnologies(technologies.filter((t) => t._id !== id));
      router.refresh();
    } catch (error) {
      console.error("Error deleting technology:", error);
    } finally {
      setDeleting(null);
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = technologies.findIndex((t) => t._id === active.id);
      const newIndex = technologies.findIndex((t) => t._id === over.id);

      const reordered = arrayMove(technologies, oldIndex, newIndex);
      setTechnologies(reordered);

      const updates = reordered.map((t, index) => ({
        id: t._id!,
        order: index,
      }));

      try {
        await Promise.all(
          updates.map(({ id, order }) =>
            fetch(`/api/technologies/${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ order }),
            })
          )
        );
      } catch (error) {
        console.error("Failed to update order:", error);
        setTechnologies(initialTechnologies);
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Technologies</h1>
        <Button size="sm" asChild>
          <Link href="/admin/technologies/new">
            <Plus className="mr-2 h-4 w-4" />
            New Technology
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
            items={technologies.map((t) => t._id!)}
            strategy={verticalListSortingStrategy}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Group</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {technologies.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground"
                    >
                      No technologies found. Create your first technology!
                    </TableCell>
                  </TableRow>
                ) : (
                  technologies.map((technology) => (
                    <SortableRow
                      key={technology._id}
                      technology={technology}
                      onDelete={handleDelete}
                      deleting={deleting}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
