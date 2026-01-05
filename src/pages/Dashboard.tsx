import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { 
  Plus, FolderOpen, Clock, TrendingUp, 
  Sparkles, LayoutGrid, Image, FileText,
  ArrowRight, LogOut, Zap, Users, BarChart3,
  Palette, Wand2, Shield, Brain, User, Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComplianceScore } from "@/components/ui/ComplianceScore";
import { FormatBadge } from "@/components/ui/FormatBadge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PageTransition } from "@/components/PageTransition";
import { ContentSkeleton } from "@/components/ContentSkeleton";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  thumbnail_url: string | null;
  format_id: string;
  compliance_score: number;
  updated_at: string;
}

const quickActions = [
  { icon: Image, label: "Upload Product", description: "Start with a packshot", color: "from-teal-500 to-emerald-500" },
  { icon: Sparkles, label: "AI Generate", description: "Let AI create for you", color: "from-purple-500 to-pink-500" },
  { icon: LayoutGrid, label: "Templates", description: "Browse templates", color: "from-blue-500 to-cyan-500" },
  { icon: FileText, label: "Brand Kit", description: "Manage brand assets", color: "from-orange-500 to-amber-500" },
];

const aiTools = [
  { icon: Brain, name: "Brand DNA", desc: "Extract identity" },
  { icon: Palette, name: "Color Harmony", desc: "AI colors" },
  { icon: Shield, name: "Compliance", desc: "Auto-validate" },
  { icon: Wand2, name: "Multiverse", desc: "Variations" },
];

const formatLabels: Record<string, string> = {
  "instagram-feed": "Instagram Feed",
  "instagram-story": "Instagram Story",
  "facebook-feed": "Facebook Feed",
  "in-store": "In-Store Banner",
};

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(8);

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <PageTransition>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-background dark:via-background dark:to-secondary/10 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-card/80 backdrop-blur-xl border-b border-gray-100 dark:border-border/30 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="flex items-center gap-2">
              <motion.div 
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/25"
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
              <span className="font-bold text-xl text-gray-900 dark:text-foreground tracking-tight">Creato-Sphere</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle className="hidden sm:flex" />
            <span className="text-sm text-gray-500 dark:text-muted-foreground hidden md:block">
              {user?.email}
            </span>
            <Link to="/profile">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  title="Profile Settings"
                  className="text-gray-500 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-foreground"
                >
                  <User className="w-4 h-4" />
                </Button>
              </motion.div>
            </Link>
            <Link to="/builder">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-full px-5 shadow-lg shadow-teal-500/25"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  New Creative
                </Button>
              </motion.div>
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleSignOut} 
                title="Sign out"
                className="text-gray-500 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-foreground"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-12"
        >
          <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-2">
            Welcome back{(user && 'user_metadata' in user && user.user_metadata?.full_name) ? `, ${user.user_metadata.full_name}` : ""}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            Pick up where you left off, or start something new.
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-8 sm:mb-12"
        >
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {quickActions.map((action, index) => (
              <Link to="/builder" key={index}>
                <motion.div 
                  className="group p-4 sm:p-5 bg-white dark:bg-card rounded-2xl border border-gray-100 dark:border-border/30 hover:border-teal-200 dark:hover:border-accent/40 shadow-sm hover:shadow-xl transition-all cursor-pointer"
                  whileHover={{ y: -5 }}
                >
                  <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1 text-sm sm:text-base">{action.label}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{action.description}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12"
        >
          {[
            { icon: FolderOpen, label: "Total Projects", value: String(projects.length), color: "from-teal-500 to-emerald-500" },
            { icon: TrendingUp, label: "This Week", value: String(projects.filter(p => {
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return new Date(p.updated_at) > weekAgo;
            }).length), color: "from-blue-500 to-cyan-500" },
            { icon: Clock, label: "Avg. Compliance", value: projects.length > 0 
              ? `${Math.round(projects.reduce((sum, p) => sum + p.compliance_score, 0) / projects.length)}%`
              : "N/A", color: "from-purple-500 to-pink-500" },
            { icon: Zap, label: "AI Ready", value: "Yes", color: "from-orange-500 to-amber-500" },
          ].map((stat, index) => (
            <motion.div 
              key={index} 
              className="p-4 sm:p-5 bg-white dark:bg-card rounded-2xl border border-gray-100 dark:border-border/30 shadow-sm"
              whileHover={{ y: -3 }}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10 flex items-center justify-center`}>
                  <stat.icon className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* AI Tools Quick Access */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="mb-8 sm:mb-12"
        >
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">AI Tools</h2>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {aiTools.map((tool, index) => (
              <Link to="/builder" key={index}>
                <motion.div
                  className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-secondary/30 dark:to-secondary/10 rounded-xl border border-gray-100 dark:border-border/30 hover:border-teal-200 dark:hover:border-accent/40 hover:shadow-md transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-lg bg-gradient-to-br from-teal-500/10 to-cyan-500/10 dark:from-accent/20 dark:to-highlight/20 flex items-center justify-center">
                    <tool.icon className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-teal-600 dark:text-accent" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-medium text-foreground">{tool.name}</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground">{tool.desc}</div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Recent Projects</h2>
            <Button variant="ghost" size="sm" className="text-teal-600 dark:text-accent hover:text-teal-700 dark:hover:text-accent/80">
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {isLoading ? (
            <ContentSkeleton variant="card" count={4} className="grid-cols-2 lg:grid-cols-4" />
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                >
                  <Link to={`/builder?project=${project.id}`}>
                    <motion.div 
                      className="group bg-white dark:bg-card rounded-2xl border border-gray-100 dark:border-border/30 overflow-hidden shadow-sm hover:shadow-xl transition-all"
                      whileHover={{ y: -5 }}
                    >
                      {/* Thumbnail */}
                      <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 dark:from-secondary/30 dark:to-secondary/10">
                        {project.thumbnail_url ? (
                          <img
                            src={project.thumbnail_url}
                            alt={project.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Image className="w-10 sm:w-12 h-10 sm:h-12 text-gray-300 dark:text-muted-foreground/30" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        {/* Compliance Badge */}
                        <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                          <ComplianceScore score={project.compliance_score} size="sm" showLabel={false} />
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-3 sm:p-4">
                        <h3 className="font-semibold text-foreground mb-2 truncate text-sm sm:text-base">
                          {project.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <FormatBadge format={formatLabels[project.format_id] || project.format_id} />
                          <span className="text-[10px] sm:text-xs text-muted-foreground">
                            {formatTimeAgo(project.updated_at)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : null}
        </motion.div>

        {/* Create CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-16"
        >
          <div className="relative p-10 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 rounded-3xl overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div 
                className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-full blur-3xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 8, repeat: Infinity }}
              />
            </div>
            
            <div className="relative z-10 text-center max-w-xl mx-auto">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-teal-500/30"
              >
                <Plus className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Create Your Next Campaign
              </h3>
              <p className="text-gray-400 mb-8">
                Upload a product image and let our AI engines generate compliant, 
                campaign-ready creatives in minutes.
              </p>
              <Link to="/builder">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-full px-8 shadow-xl shadow-teal-500/30"
                  >
                    Start New Creative
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
    </PageTransition>
  );
};

export default Dashboard;
