import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import {
  Eye,
  Edit3,
  Trash2,
  Calendar,
  Code,
  Sparkles,
  ExternalLink,
  MoreVertical
} from "lucide-react";

interface ProjectCardProps {
  project: any;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
}

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'deployed':
      return 'default';
    case 'generated':
      return 'default';
    case 'draft':
      return 'secondary';
    default:
      return 'outline';
  }
};

const getStatusIcon = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'deployed':
      return <ExternalLink className="h-3 w-3" />;
    case 'generated':
      return <Code className="h-3 w-3" />;
    case 'draft':
      return <Edit3 className="h-3 w-3" />;
    default:
      return <Sparkles className="h-3 w-3" />;
  }
};

export function ProjectCard({ project, onEdit, onDelete, onView }: ProjectCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 20 }}
      className="group"
    >
      <Card className="relative overflow-hidden card-hover-intense card-glow h-full glass-effect-strong border-2 hover:border-primary/30">
        {/* Enhanced Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Status Color Accent */}
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${
          project?.status === 'deployed' ? 'from-green-500 to-emerald-600' :
          project?.status === 'generated' ? 'from-blue-500 to-cyan-600' :
          'from-gray-400 to-gray-500'
        } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

        {/* Header */}
        <CardHeader className="relative pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors duration-300 truncate">
                {project?.name ?? "Untitled Project"}
              </CardTitle>
              <CardDescription className="mt-2 text-muted-foreground line-clamp-2">
                {project?.description ?? "No description provided"}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-8 w-8 p-0"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="relative pt-0">
          {/* Status and Date */}
          <div className="flex items-center justify-between mb-6">
            <Badge
              variant={getStatusColor(project?.status)}
              className="flex items-center gap-1.5 px-3 py-1"
            >
              {getStatusIcon(project?.status)}
              <span className="capitalize">{project?.status ?? "Draft"}</span>
            </Badge>

            {project?.updatedAt && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(project.updatedAt)}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {onView && (
              <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="sm"
                  onClick={onView}
                  className="w-full btn-gradient text-sm shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <Eye className="h-4 w-4 mr-1.5" />
                  Open
                </Button>
              </motion.div>
            )}
            {onEdit && (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onEdit}
                  className="border-2 hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all duration-300 h-8 w-8 p-0"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
            {onDelete && (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onDelete}
                  className="border-2 hover:bg-destructive/10 hover:border-destructive/50 hover:text-destructive transition-all duration-300 h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </div>
        </CardContent>

        {/* Hover Effect Border */}
        <div className="absolute inset-0 rounded-lg border-2 border-primary/0 group-hover:border-primary/20 transition-colors duration-300 pointer-events-none"></div>
      </Card>
    </motion.div>
  );
}