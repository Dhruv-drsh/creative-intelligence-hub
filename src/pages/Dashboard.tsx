import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Plus, FolderOpen, Clock, TrendingUp, 
  Sparkles, LayoutGrid, Image, FileText,
  ArrowRight, MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ComplianceScore } from "@/components/ui/ComplianceScore";
import { FormatBadge } from "@/components/ui/FormatBadge";

// Mock data for recent projects
const recentProjects = [
  {
    id: "1",
    name: "Summer Sale Campaign",
    thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=300&fit=crop",
    format: "Instagram Feed",
    complianceScore: 98,
    updatedAt: "2 hours ago",
  },
  {
    id: "2",
    name: "New Product Launch",
    thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
    format: "Facebook Feed",
    complianceScore: 85,
    updatedAt: "Yesterday",
  },
  {
    id: "3",
    name: "Holiday Promo",
    thumbnail: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&h=300&fit=crop",
    format: "Instagram Story",
    complianceScore: 92,
    updatedAt: "3 days ago",
  },
  {
    id: "4",
    name: "In-Store Banner",
    thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
    format: "In-Store Banner",
    complianceScore: 100,
    updatedAt: "1 week ago",
  },
];

const quickActions = [
  { icon: Image, label: "Upload Product", description: "Start with a packshot" },
  { icon: Sparkles, label: "AI Generate", description: "Let AI create for you" },
  { icon: LayoutGrid, label: "Templates", description: "Browse templates" },
  { icon: FileText, label: "Brand Kit", description: "Manage brand assets" },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-highlight flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl text-foreground">Creato-Sphere</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/builder">
              <Button variant="ai" size="sm" className="group">
                <Plus className="w-4 h-4" />
                New Creative
              </Button>
            </Link>
            <Button variant="ghost" size="icon-sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="font-display text-3xl md:text-4xl mb-2">
            Welcome back
          </h1>
          <p className="text-muted-foreground">
            Pick up where you left off, or start something new.
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <h2 className="text-sm font-medium text-muted-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link to="/builder" key={index}>
                <GlassPanel 
                  padding="md" 
                  className="group cursor-pointer hover-lift hover:border-accent/30 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                      <action.icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground text-sm">{action.label}</h3>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                </GlassPanel>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          {[
            { icon: FolderOpen, label: "Total Projects", value: "24" },
            { icon: TrendingUp, label: "This Week", value: "8" },
            { icon: Clock, label: "Avg. Time Saved", value: "4.2h" },
            { icon: Sparkles, label: "AI Generations", value: "156" },
          ].map((stat, index) => (
            <GlassPanel key={index} padding="md" variant="subtle">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="font-display text-2xl text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            </GlassPanel>
          ))}
        </motion.div>

        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-muted-foreground">Recent Projects</h2>
            <Button variant="ghost" size="sm" className="text-xs">
              View All
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Link to="/builder">
                  <GlassPanel 
                    padding="none" 
                    className="overflow-hidden group cursor-pointer hover-lift"
                  >
                    {/* Thumbnail */}
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src={project.thumbnail}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      {/* Compliance Badge */}
                      <div className="absolute top-3 right-3">
                        <ComplianceScore score={project.complianceScore} size="sm" showLabel={false} />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-medium text-foreground text-sm mb-1 truncate">
                        {project.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <FormatBadge format={project.format} />
                        <span className="text-xs text-muted-foreground">{project.updatedAt}</span>
                      </div>
                    </div>
                  </GlassPanel>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Empty State / New Project CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <GlassPanel padding="lg" className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-highlight/20 flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-accent" />
            </div>
            <h3 className="font-semibold text-lg text-foreground mb-2">
              Create Your Next Campaign
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Upload a product image and let our 18 AI engines generate compliant, 
              campaign-ready creatives in minutes.
            </p>
            <Link to="/builder">
              <Button variant="ai" size="lg" className="group">
                Start New Creative
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </GlassPanel>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
