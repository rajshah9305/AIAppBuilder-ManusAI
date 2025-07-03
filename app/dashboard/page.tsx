'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '../../src/hooks/useAuth';
import { useProjects } from '../../src/hooks/useProjects';
import { Button } from '../../components/ui/Button';
import { ProjectCard } from '../../components/dashboard/ProjectCard';
import { CreateProjectModal } from '../../components/dashboard/CreateProjectModal';
import { Project } from '../../src/types';
import { Plus, LogOut, Sparkles, Search, Filter } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Input } from '../../components/ui/Input';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { projects, loading, error, fetchProjects, createProject, deleteProject: removeProject } = useProjects();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const loadProjects = useCallback(async () => {
    await fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    loadProjects();
  }, [user, router, loadProjects]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }
    await removeProject(projectId);
    toast.success('Project deleted successfully');
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (project.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!user) return null;

  return (
    <div className="min-h-screen gradient-bg">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-40 glass-effect border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                <Sparkles className="h-10 w-10 text-primary animate-pulse-glow" />
                <div className="absolute inset-0 h-10 w-10 bg-primary/20 rounded-full animate-ping"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">AI App Builder</h1>
                <div className="text-xs text-muted-foreground font-medium">Dashboard</div>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center space-x-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-primary">
                  Welcome, {user.name}
                </span>
              </div>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="hover:bg-destructive/10 hover:text-destructive transition-all duration-300"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Enhanced Header Section */}
        <motion.div
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 space-y-6 lg:space-y-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-2">
            <h2 className="text-4xl font-bold">
              Your <span className="text-gradient">Projects</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Build amazing apps with AI assistance - from idea to deployment
            </p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span>{projects.length} Active Projects</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>AI-Powered</span>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Button
              onClick={() => setShowCreateModal(true)}
              className="btn-gradient text-lg px-8 py-4 shadow-glow hover:shadow-glow-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Project
            </Button>
          </motion.div>
        </motion.div>

        {/* Enhanced Search and Filter */}
        <motion.div
          className="flex flex-col lg:flex-row gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search your projects..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-lg border-2 focus:border-primary/50 bg-background/50 backdrop-blur-sm"
            />
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-12 px-4 border-2 border-border rounded-lg bg-background/50 backdrop-blur-sm focus:border-primary/50 text-foreground"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="generated">Generated</option>
              <option value="deployed">Deployed</option>
            </select>
            <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Sort by:</span>
              <Button variant="ghost" size="sm" className="text-primary">
                Recent
              </Button>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-8">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary shadow-lg"></div>
              <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping"></div>
              <div className="absolute inset-2 rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 animate-pulse"></div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Loading Your Projects</h3>
              <p className="text-muted-foreground">Fetching your amazing creations...</p>
              <div className="loading-dots mt-4 justify-center">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center py-20"
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>
              </div>
              <div className="relative">
                <Sparkles className="h-16 w-16 text-primary mx-auto animate-float" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4">
              {projects.length === 0 ? 'Ready to build something amazing?' : 'No projects found'}
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto">
              {projects.length === 0
                ? 'Create your first AI-powered application and bring your ideas to life in minutes'
                : 'Try adjusting your search or filter criteria'
              }
            </p>
            {projects.length === 0 && (
              <Button
                onClick={() => setShowCreateModal(true)}
                className="btn-gradient text-lg px-8 py-4 shadow-glow"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Project
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    delay: index * 0.1,
                    duration: 0.5,
                    type: "spring",
                    stiffness: 100,
                    damping: 15
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ProjectCard
                    project={project}
                    onEdit={() => router.push(`/editor?project=${project.id}`)}
                    onDelete={() => handleDeleteProject(project.id)}
                    onView={() => router.push(`/editor?project=${project.id}`)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </main>

      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onProjectCreated={(project: Project) => {
          loadProjects();
          router.push(`/editor?project=${project.id}`);
        }}
      />
    </div>
  );
}