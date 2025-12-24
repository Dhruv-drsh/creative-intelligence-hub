import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Sparkles, Grid, LayoutGrid, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { supabase } from "@/integrations/supabase/client";

interface Template {
  id: string;
  name: string;
  description: string | null;
  category: string;
  thumbnail_url: string | null;
  canvas_data: unknown;
  format_width: number;
  format_height: number;
}

interface TemplateGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate?: (template: Template) => void;
}

const categoryOptions = [
  { value: "all", label: "All Templates" },
  { value: "promotional", label: "Promotional" },
  { value: "seasonal", label: "Seasonal" },
  { value: "product-launch", label: "Product Launch" },
];

// Template colors based on their style
const getTemplateGradient = (template: Template): string => {
  const data = template.canvas_data as { backgroundColor?: string; style?: string } | null;
  const style = data?.style || template.name.toLowerCase();
  
  if (style.includes('minimal') || style.includes('premium')) return "from-slate-600 to-slate-800";
  if (style.includes('festive') || style.includes('sale')) return "from-red-500 to-orange-400";
  if (style.includes('product') || style.includes('focus')) return "from-emerald-500 to-teal-600";
  if (style.includes('bold') || style.includes('typography')) return "from-violet-600 to-purple-700";
  if (style.includes('summer') || style.includes('vibes')) return "from-yellow-400 to-orange-500";
  if (style.includes('black') || style.includes('friday')) return "from-gray-900 to-black";
  if (style.includes('arrival') || style.includes('new')) return "from-blue-500 to-cyan-400";
  if (style.includes('holiday') || style.includes('special')) return "from-red-600 to-green-600";
  
  return "from-accent to-highlight";
};

// Get preview text from template
const getTemplatePreviewText = (template: Template): string | null => {
  const data = template.canvas_data as { objects?: Array<{ type: string; text?: string; fontSize?: number }> } | null;
  if (!data?.objects) return null;
  
  const textObj = data.objects.find(obj => 
    (obj.type === 'text' || obj.type === 'i-text') && obj.text && (obj.fontSize || 0) >= 40
  );
  
  return textObj?.text || null;
};

export const TemplateGallery = ({ isOpen, onClose, onSelectTemplate }: TemplateGalleryProps) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchTemplates();
    }
  }, [isOpen]);

  useEffect(() => {
    filterTemplates();
  }, [templates, searchQuery, activeCategory]);

  const fetchTemplates = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("templates")
      .select("*")
      .eq("is_public", true)
      .order("name");

    if (error) {
      console.error("Error fetching templates:", error);
    } else {
      setTemplates(data || []);
    }
    setIsLoading(false);
  };

  const filterTemplates = () => {
    let filtered = [...templates];

    if (activeCategory !== "all") {
      filtered = filtered.filter((t) => t.category === activeCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query)
      );
    }

    setFilteredTemplates(filtered);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <GlassPanel padding="none" className="overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <div>
                <h2 className="font-display text-xl text-foreground flex items-center gap-2">
                  <Palette className="w-5 h-5 text-accent" />
                  Template Gallery
                </h2>
                <p className="text-sm text-muted-foreground">Choose a template to start your creative</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Filters */}
            <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-muted/50 border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>

              {/* Categories */}
              <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                {categoryOptions.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setActiveCategory(cat.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      activeCategory === cat.value
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted/50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Template Grid */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="aspect-square bg-muted/50 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : filteredTemplates.length === 0 ? (
                <div className="text-center py-12">
                  <Grid className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No templates found</p>
                  <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or category filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredTemplates.map((template, index) => {
                    const previewText = getTemplatePreviewText(template);
                    const gradient = getTemplateGradient(template);
                    
                    return (
                      <motion.div
                        key={template.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group cursor-pointer"
                        onClick={() => onSelectTemplate?.(template)}
                      >
                        <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-border/50 group-hover:border-accent/70 transition-all shadow-lg group-hover:shadow-xl group-hover:scale-[1.02]">
                          {/* Template Preview */}
                          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex flex-col items-center justify-center p-4`}>
                            <Sparkles className="w-8 h-8 text-white/40 mb-2" />
                            {previewText && (
                              <p className="text-white/80 text-xs font-medium text-center line-clamp-2">
                                {previewText}
                              </p>
                            )}
                          </div>
                          
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-3">
                            <Button variant="ai" size="sm" className="w-full">
                              <Sparkles className="w-3 h-3 mr-1" />
                              Use Template
                            </Button>
                          </div>
                          
                          {/* Format Badge */}
                          <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-mono text-muted-foreground">
                            {template.format_width}×{template.format_height}
                          </div>
                        </div>

                        <div className="mt-2">
                          <h3 className="text-sm font-medium text-foreground truncate">{template.name}</h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-muted-foreground capitalize">{template.category.replace("-", " ")}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </GlassPanel>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TemplateGallery;