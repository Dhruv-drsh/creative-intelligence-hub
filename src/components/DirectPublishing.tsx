import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { 
  Upload, Check, AlertCircle, Loader2, ExternalLink, 
  Facebook, Instagram, Youtube, Linkedin, Monitor, X 
} from "lucide-react";
import { toast } from "sonner";

interface DirectPublishingProps {
  isOpen: boolean;
  onClose: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

interface Platform {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  connected: boolean;
  formats: string[];
  status?: "idle" | "uploading" | "success" | "error";
}

const platforms: Platform[] = [
  { 
    id: "meta", 
    name: "Meta Ads Manager", 
    icon: Facebook, 
    color: "bg-blue-600",
    connected: true,
    formats: ["1080x1080", "1080x1920", "1200x628"]
  },
  { 
    id: "instagram", 
    name: "Instagram", 
    icon: Instagram, 
    color: "bg-gradient-to-br from-purple-600 to-pink-500",
    connected: true,
    formats: ["1080x1080", "1080x1920"]
  },
  { 
    id: "google", 
    name: "Google Ads", 
    icon: Monitor, 
    color: "bg-green-600",
    connected: false,
    formats: ["300x250", "728x90", "160x600"]
  },
  { 
    id: "linkedin", 
    name: "LinkedIn", 
    icon: Linkedin, 
    color: "bg-blue-700",
    connected: false,
    formats: ["1200x627", "1080x1080"]
  },
  { 
    id: "youtube", 
    name: "YouTube", 
    icon: Youtube, 
    color: "bg-red-600",
    connected: false,
    formats: ["1920x1080"]
  },
];

export function DirectPublishing({ isOpen, onClose, canvasRef }: DirectPublishingProps) {
  const [platformStatuses, setPlatformStatuses] = useState<Record<string, Platform["status"]>>({});
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const togglePlatform = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    if (!platform?.connected) {
      toast.error(`Please connect ${platform?.name} first`);
      return;
    }
    
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleConnect = (platformId: string) => {
    toast.info(`Redirecting to ${platforms.find(p => p.id === platformId)?.name} authorization...`);
    // In production, this would open OAuth flow
  };

  const handlePublish = async () => {
    if (selectedPlatforms.length === 0) {
      toast.error("Please select at least one platform");
      return;
    }

    // Simulate publishing to each platform
    for (const platformId of selectedPlatforms) {
      setPlatformStatuses(prev => ({ ...prev, [platformId]: "uploading" }));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Random success/failure for demo
      const success = Math.random() > 0.2;
      setPlatformStatuses(prev => ({ 
        ...prev, 
        [platformId]: success ? "success" : "error" 
      }));
    }

    const successCount = Object.values(platformStatuses).filter(s => s === "success").length;
    toast.success(`Published to ${successCount} platform(s)!`);
  };

  const getStatusIcon = (status?: Platform["status"]) => {
    switch (status) {
      case "uploading":
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case "success":
        return <Check className="w-4 h-4 text-green-500" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
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
          className="w-full max-w-xl max-h-[85vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <GlassPanel padding="none" className="flex flex-col h-[85vh]">
            {/* Header - Fixed */}
            <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-border/50">
              <div>
                <h2 className="font-display text-xl text-foreground flex items-center gap-2">
                  <Upload className="w-5 h-5 text-green-500" />
                  Direct Platform Publishing
                </h2>
                <p className="text-sm text-muted-foreground">
                  One-click API upload to ad platforms
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Scrollable Content */}
            <ScrollArea className="flex-1 min-h-0">
              <div className="p-6 space-y-6">
                {/* Platform Selection */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Select Platforms</h4>
                  <div className="space-y-2">
                    {platforms.map((platform) => {
                      const Icon = platform.icon;
                      const isSelected = selectedPlatforms.includes(platform.id);
                      const status = platformStatuses[platform.id];

                      return (
                        <div
                          key={platform.id}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            isSelected 
                              ? "border-primary bg-primary/5" 
                              : "border-border hover:border-border/80"
                          } ${!platform.connected ? "opacity-60" : ""}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => togglePlatform(platform.id)}
                                disabled={!platform.connected}
                                className={`w-12 h-12 rounded-xl ${platform.color} flex items-center justify-center`}
                              >
                                <Icon className="w-6 h-6 text-white" />
                              </button>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{platform.name}</span>
                                  {platform.connected ? (
                                    <span className="px-2 py-0.5 bg-green-500/10 text-green-600 text-xs rounded-full">
                                      Connected
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-600 text-xs rounded-full">
                                      Not Connected
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Formats: {platform.formats.join(", ")}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {status && getStatusIcon(status)}
                              {platform.connected ? (
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => togglePlatform(platform.id)}
                                  className="w-5 h-5 rounded border-2 accent-primary"
                                />
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleConnect(platform.id)}
                                >
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  Connect
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Publishing Options */}
                <div className="p-4 rounded-xl bg-muted/50 border space-y-3">
                  <h4 className="text-sm font-medium">Publishing Options</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" defaultChecked className="rounded" />
                      Auto-resize for each platform's requirements
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" defaultChecked className="rounded" />
                      Include compliance metadata
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      Schedule for later
                    </label>
                  </div>
                </div>

                {/* Publish Button */}
                <Button
                  onClick={handlePublish}
                  disabled={selectedPlatforms.length === 0}
                  className="w-full h-12"
                  size="lg"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Publish to {selectedPlatforms.length} Platform{selectedPlatforms.length !== 1 ? "s" : ""}
                </Button>

                {/* Status Summary */}
                {Object.keys(platformStatuses).length > 0 && (
                  <div className="p-4 rounded-xl bg-muted/50 border">
                    <h4 className="text-sm font-medium mb-3">Publishing Status</h4>
                    <div className="space-y-2">
                      {Object.entries(platformStatuses).map(([id, status]) => {
                        const platform = platforms.find(p => p.id === id);
                        return (
                          <div key={id} className="flex items-center justify-between text-sm">
                            <span>{platform?.name}</span>
                            <span className={`flex items-center gap-1 ${
                              status === "success" ? "text-green-600" :
                              status === "error" ? "text-red-600" :
                              "text-blue-600"
                            }`}>
                              {getStatusIcon(status)}
                              {status === "uploading" ? "Uploading..." :
                               status === "success" ? "Published" :
                               status === "error" ? "Failed" : ""}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </GlassPanel>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}