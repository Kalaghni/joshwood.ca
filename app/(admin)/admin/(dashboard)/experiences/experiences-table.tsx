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
import { Pencil, Trash2, Plus, GripVertical } from "lucide-react";
import type { Experience } from "@/lib/experiences";

interface ExperiencesTableProps {
  experiences: Experience[];
}

function SortableRow({
  experience,
  onDelete,
  deleting,
}: {
  experience: Experience;
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
  } = useSortable({ id: experience._id! });

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
      <TableCell className="font-medium">{experience.title}</TableCell>
      <TableCell>{experience.role}</TableCell>
      <TableCell>{experience.location}</TableCell>
      <TableCell>
        <Badge variant={experience.published ? "secondary" : "default"}>
          {experience.published ? "Published" : "Draft"}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/admin/experiences/${experience._id}`)}
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
                <AlertDialogTitle>Delete Experience</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &quot;{experience.title}&quot;?
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(experience._id!)}
                  disabled={deleting === experience._id}
                >
                  {deleting === experience._id ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function ExperiencesTable({ experiences: initialExperiences }: ExperiencesTableProps) {
  const router = useRouter();
  const [experiences, setExperiences] = useState(initialExperiences);
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
      const res = await fetch(`/api/experiences/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete experience");
      }

      setExperiences(experiences.filter((e) => e._id !== id));
      router.refresh();
    } catch (error) {
      console.error("Error deleting experience:", error);
    } finally {
      setDeleting(null);
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = experiences.findIndex((e) => e._id === active.id);
      const newIndex = experiences.findIndex((e) => e._id === over.id);

      const newExperiences = arrayMove(experiences, oldIndex, newIndex);
      setExperiences(newExperiences);

      // Update order in database
      const updates = newExperiences.map((experience, index) => ({
        id: experience._id!,
        order: index,
      }));

      try {
        await Promise.all(
          updates.map(({ id, order }) =>
            fetch(`/api/experiences/${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ order }),
            })
          )
        );
      } catch (error) {
        console.error("Failed to update order:", error);
        // Revert on error
        setExperiences(initialExperiences);
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Experience</h1>
        <Button size="sm" asChild>
          <Link href="/admin/experiences/new">
            <Plus className="mr-2 h-4 w-4" />
            New Experience
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
              items={experiences.map((e) => e._id!)}
              strategy={verticalListSortingStrategy}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {experiences.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No experiences found. Create your first experience!
                    </TableCell>
                  </TableRow>
                ) : experiences.map((experience) => (
                  <SortableRow
                    key={experience._id}
                    experience={experience}
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
