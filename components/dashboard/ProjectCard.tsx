import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";

interface ProjectCardProps {
  project: any;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
}

export function ProjectCard({ project, onEdit, onDelete, onView }: ProjectCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{project?.name ?? "Project Name"}</CardTitle>
        <CardDescription>{project?.description ?? "Description"}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Badge>Status: {project?.status ?? "Active"}</Badge>
          <div className="flex gap-2">
            {onView && <Button size="sm" onClick={onView}>View</Button>}
            {onEdit && <Button size="sm" variant="outline" onClick={onEdit}>Edit</Button>}
            {onDelete && <Button size="sm" variant="outline" onClick={onDelete}>Delete</Button>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}