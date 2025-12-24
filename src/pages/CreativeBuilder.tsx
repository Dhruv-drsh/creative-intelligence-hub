import { useEffect, useRef, useState, useCallback } from "react";
import { Canvas as FabricCanvas, Rect, Circle, IText, FabricImage } from "fabric";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import {
  Sparkles, ChevronLeft, Download, Share2, Undo2, Redo2,
  ZoomIn, ZoomOut, MousePointer2, Square, Circle as CircleIcon,
  Type, Image, Trash2, Copy, Layers, Upload, Send, Settings,
  Check, AlertTriangle, X, Menu, Eye as EyeIcon, Palette, Wand2, Save, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ComplianceScore } from "@/components/ui/ComplianceScore";
import { AIIndicator } from "@/components/ui/AIIndicator";
import { SafeZonesOverlay } from "@/components/SafeZonesOverlay";
import { ImageUploader } from "@/components/ImageUploader";
import { BrandKitManager } from "@/components/BrandKitManager";
import { TemplateGallery } from "@/components/TemplateGallery";
import { ExportDialog } from "@/components/ExportDialog";
import { AIBackgroundGenerator } from "@/components/AIBackgroundGenerator";
import { useCreativeStore } from "@/store/creativeStore";
import { useComplianceEngine, type ComplianceCheck } from "@/hooks/useComplianceEngine";
import { useAICanvasControl } from "@/hooks/useAICanvasControl";
import { useProject } from "@/hooks/useProject";
import { useFormatResize } from "@/hooks/useFormatResize";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Sample assets for the panel
const sampleAssets = [
  { id: "1", type: "product", src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop", name: "Watch" },
  { id: "2", type: "product", src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop", name: "Headphones" },
  { id: "3", type: "product", src: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop", name: "Sunglasses" },
  { id: "4", type: "logo", src: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop", name: "Brand Logo" },
];

const CreativeBuilder = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeTool, setActiveTool] = useState<"select" | "rectangle" | "circle" | "text">("select");
  const [chatMessage, setChatMessage] = useState("");
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [showSafeZones, setShowSafeZones] = useState(false);
  const [complianceChecks, setComplianceChecks] = useState<ComplianceCheck[]>([]);
  const [calculatedScore, setCalculatedScore] = useState(85);
  const [uploadedAssets, setUploadedAssets] = useState<Array<{ id: string; src: string; name: string; type: string }>>([]);

  // Modal states
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [uploadType, setUploadType] = useState<"product" | "logo">("product");
  const [showBrandKitManager, setShowBrandKitManager] = useState(false);
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showAIBackground, setShowAIBackground] = useState(false);
  const [searchParams] = useSearchParams();
  const [isEditingName, setIsEditingName] = useState(false);

  const {
    currentFormat,
    availableFormats,
    setCurrentFormat,
    setComplianceScore,
    aiStatus,
    setAIStatus,
    aiMessages,
    addAIMessage,
    leftPanelTab,
    setLeftPanelTab,
  } = useCreativeStore();

  const [previousFormat, setPreviousFormat] = useState(currentFormat);

  // Initialize compliance engine, AI canvas control, project management, and format resize
  const { safeZones, runComplianceChecks, calculateScore } = useComplianceEngine(currentFormat.id);
  const { processAICommand } = useAICanvasControl(fabricCanvas);
  const { 
    projectName, setProjectName, 
    isSaving, saveProject, loadProject 
  } = useProject(fabricCanvas, currentFormat, calculatedScore);
  const { resizeToFormat } = useFormatResize(fabricCanvas);

  // Run compliance checks when canvas changes
  const updateCompliance = useCallback(() => {
    if (!fabricCanvas) return;
    
    const checks = runComplianceChecks(fabricCanvas);
    setComplianceChecks(checks);
    
    const score = calculateScore(checks);
    setCalculatedScore(score);
    setComplianceScore(score);
  }, [fabricCanvas, runComplianceChecks, calculateScore, setComplianceScore]);

  // Handle format change with intelligent resizing
  const handleFormatChange = useCallback((newFormat: typeof currentFormat) => {
    if (fabricCanvas && previousFormat.id !== newFormat.id) {
      resizeToFormat(previousFormat, newFormat);
      setPreviousFormat(newFormat);
    }
    setCurrentFormat(newFormat);
  }, [fabricCanvas, previousFormat, resizeToFormat, setCurrentFormat]);

  // Load project from URL param on mount
  useEffect(() => {
    const projectIdFromUrl = searchParams.get('project');
    if (projectIdFromUrl && fabricCanvas) {
      loadProject(projectIdFromUrl, setCurrentFormat, availableFormats);
    }
  }, [fabricCanvas, searchParams, loadProject, setCurrentFormat, availableFormats]);

  // Initialize Fabric.js canvas - only on initial mount
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || fabricCanvas) return;

    const containerWidth = containerRef.current.clientWidth - 80;
    const containerHeight = containerRef.current.clientHeight - 80;
    const formatRatio = currentFormat.width / currentFormat.height;
    const containerRatio = containerWidth / containerHeight;

    let canvasWidth, canvasHeight;
    if (formatRatio > containerRatio) {
      canvasWidth = Math.min(containerWidth, 800);
      canvasHeight = canvasWidth / formatRatio;
    } else {
      canvasHeight = Math.min(containerHeight, 600);
      canvasWidth = canvasHeight * formatRatio;
    }

    const canvas = new FabricCanvas(canvasRef.current, {
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: "#ffffff",
      selection: true,
    });

    // Add initial elements only if not loading a project
    const projectIdFromUrl = searchParams.get('project');
    if (!projectIdFromUrl) {
      const productRect = new Rect({
        left: canvasWidth / 4,
        top: canvasHeight / 4,
        width: canvasWidth / 2,
        height: canvasHeight / 2,
        fill: "rgba(34, 197, 94, 0.1)",
        stroke: "rgba(34, 197, 94, 0.5)",
        strokeWidth: 2,
        rx: 8,
        ry: 8,
      });

      const ctaRect = new Rect({
        left: canvasWidth / 4,
        top: canvasHeight - 80,
        width: canvasWidth / 2,
        height: 50,
        fill: "#22C55E",
        rx: 8,
        ry: 8,
      });

      const ctaText = new IText("Shop Now", {
        left: canvasWidth / 2,
        top: canvasHeight - 70,
        fontSize: 18,
        fontFamily: "Inter",
        fontWeight: "600",
        fill: "#020617",
        originX: "center",
      });

      const logoPlaceholder = new Rect({
        left: canvasWidth - 80,
        top: 20,
        width: 60,
        height: 30,
        fill: "#e2e8f0",
        rx: 4,
        ry: 4,
      });

      canvas.add(productRect, ctaRect, ctaText, logoPlaceholder);
    }
    
    canvas.renderAll();

    // Listen for canvas changes to update compliance
    canvas.on("object:modified", () => updateCompliance());
    canvas.on("object:added", () => updateCompliance());
    canvas.on("object:removed", () => updateCompliance());

    setFabricCanvas(canvas);
    setPreviousFormat(currentFormat);

    // Initial compliance check
    setTimeout(() => {
      const checks = runComplianceChecks(canvas);
      setComplianceChecks(checks);
      const score = calculateScore(checks);
      setCalculatedScore(score);
      setComplianceScore(score);
    }, 100);

    return () => {
      canvas.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle tool clicks
  const handleToolClick = useCallback((tool: typeof activeTool) => {
    setActiveTool(tool);
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = false;

    if (tool === "rectangle") {
      const rect = new Rect({
        left: 100,
        top: 100,
        width: 100,
        height: 100,
        fill: "rgba(56, 189, 248, 0.2)",
        stroke: "#38BDF8",
        strokeWidth: 2,
      });
      fabricCanvas.add(rect);
      fabricCanvas.setActiveObject(rect);
    } else if (tool === "circle") {
      const circle = new Circle({
        left: 100,
        top: 100,
        radius: 50,
        fill: "rgba(56, 189, 248, 0.2)",
        stroke: "#38BDF8",
        strokeWidth: 2,
      });
      fabricCanvas.add(circle);
      fabricCanvas.setActiveObject(circle);
    } else if (tool === "text") {
      const text = new IText("Click to edit", {
        left: 100,
        top: 100,
        fontSize: 24,
        fontFamily: "Inter",
        fill: "#020617",
      });
      fabricCanvas.add(text);
      fabricCanvas.setActiveObject(text);
    }

    fabricCanvas.renderAll();
    setActiveTool("select");
  }, [fabricCanvas]);

  // Handle AI chat - now with real canvas control
  const handleSendMessage = async () => {
    if (!chatMessage.trim() || aiStatus !== "idle") return;

    const userMessage = chatMessage.trim();
    addAIMessage({ role: "user", content: userMessage });
    setChatMessage("");
    setAIStatus("thinking");

    try {
      const response = await processAICommand(userMessage);
      
      setAIStatus("generating");
      
      // Small delay for visual feedback
      await new Promise(resolve => setTimeout(resolve, 500));
      
      addAIMessage({
        role: "assistant",
        content: response.message || "I've updated your design based on your request."
      });
      
      // Update compliance after AI changes
      updateCompliance();
      
    } catch (error) {
      console.error("AI processing error:", error);
      addAIMessage({
        role: "assistant",
        content: "Sorry, I couldn't process that request. Please try again."
      });
    } finally {
      setAIStatus("complete");
      setTimeout(() => setAIStatus("idle"), 1500);
    }
  };

  // Add image to canvas
  const handleAddAsset = async (asset: { src: string; name: string }) => {
    if (!fabricCanvas) return;

    try {
      const img = await FabricImage.fromURL(asset.src, { crossOrigin: "anonymous" });
      img.scaleToWidth(150);
      img.set({ left: 100, top: 100 });
      fabricCanvas.add(img);
      fabricCanvas.setActiveObject(img);
      fabricCanvas.renderAll();
      toast.success(`Added ${asset.name} to canvas`);
    } catch (error) {
      console.error("Failed to load image:", error);
      toast.error("Failed to add image to canvas");
    }
  };

  // Handle uploaded image
  const handleImageUploaded = async (imageUrl: string, fileName: string) => {
    const newAsset = {
      id: Date.now().toString(),
      src: imageUrl,
      name: fileName,
      type: uploadType,
    };
    setUploadedAssets(prev => [newAsset, ...prev]);
    await handleAddAsset({ src: imageUrl, name: fileName });
  };

  // Handle AI background selection
  const handleBackgroundSelected = async (imageUrl: string) => {
    if (!fabricCanvas) return;

    try {
      const img = await FabricImage.fromURL(imageUrl, { crossOrigin: "anonymous" });
      const canvasWidth = fabricCanvas.getWidth();
      const canvasHeight = fabricCanvas.getHeight();
      
      // Scale to cover canvas
      const scaleX = canvasWidth / (img.width || 1);
      const scaleY = canvasHeight / (img.height || 1);
      const scale = Math.max(scaleX, scaleY);
      
      img.scale(scale);
      img.set({
        left: 0,
        top: 0,
        originX: "left",
        originY: "top",
        selectable: true,
      });
      
      // Send to back
      fabricCanvas.add(img);
      fabricCanvas.sendObjectToBack(img);
      fabricCanvas.renderAll();
      
      toast.success("Background applied!");
    } catch (error) {
      console.error("Failed to apply background:", error);
      toast.error("Failed to apply background");
    }
  };

  // Handle template selection
  const handleTemplateSelected = (template: { name: string; format_width: number; format_height: number }) => {
    toast.success(`Loaded template: ${template.name}`);
    setShowTemplateGallery(false);
    // Template loading would apply canvas_data here
  };

  // Handle brand kit selection
  const handleBrandKitSelected = (brandKit: { name: string; primary_color: string; font_heading: string }) => {
    toast.success(`Applied brand kit: ${brandKit.name}`);
    setShowBrandKitManager(false);
    // Would apply colors/fonts to canvas
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Modals */}
      <ImageUploader
        isOpen={showImageUploader}
        onClose={() => setShowImageUploader(false)}
        onImageUploaded={handleImageUploaded}
        type={uploadType}
      />
      <BrandKitManager
        isOpen={showBrandKitManager}
        onClose={() => setShowBrandKitManager(false)}
        onSelectBrandKit={handleBrandKitSelected}
      />
      <TemplateGallery
        isOpen={showTemplateGallery}
        onClose={() => setShowTemplateGallery(false)}
        onSelectTemplate={handleTemplateSelected}
      />
      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        canvasRef={canvasRef}
        complianceScore={calculatedScore}
        formatName={currentFormat.name}
      />
      <AIBackgroundGenerator
        isOpen={showAIBackground}
        onClose={() => setShowAIBackground(false)}
        onSelectBackground={handleBackgroundSelected}
      />

      {/* Top Bar */}
      <header className="h-14 border-b border-border/50 glass flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon-sm">
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-accent to-highlight flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            {isEditingName ? (
              <Input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                className="h-7 w-40 text-sm"
                autoFocus
              />
            ) : (
              <span 
                className="font-medium text-sm text-foreground cursor-pointer hover:text-accent"
                onClick={() => setIsEditingName(true)}
              >
                {projectName}
              </span>
            )}
          </div>
        </div>

        {/* Format Selector */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-secondary/50 rounded-lg p-1">
            {availableFormats.slice(0, 4).map((format) => (
              <button
                key={format.id}
                onClick={() => handleFormatChange(format)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                  currentFormat.id === format.id
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {format.name}
              </button>
            ))}
          </div>
          <ComplianceScore score={calculatedScore} size="sm" showLabel={false} />
          <AIIndicator status={aiStatus} />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm">
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon-sm">
            <Redo2 className="w-4 h-4" />
          </Button>
          <div className="w-px h-6 bg-border mx-2" />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={saveProject}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="ai" size="sm" onClick={() => setShowExportDialog(true)}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Assets & Layers */}
        <AnimatePresence>
          {leftPanelOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-r border-border/50 bg-card/50 flex flex-col shrink-0 overflow-hidden"
            >
              {/* Tabs */}
              <div className="flex border-b border-border/50 shrink-0">
                {(["assets", "layers", "templates"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setLeftPanelTab(tab)}
                    className={cn(
                      "flex-1 py-3 text-xs font-medium transition-colors capitalize",
                      leftPanelTab === tab
                        ? "text-accent border-b-2 border-accent"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Panel Content */}
              <div className="flex-1 p-4 overflow-y-auto">
                {leftPanelTab === "assets" && (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setUploadType("product");
                          setShowImageUploader(true);
                        }}
                      >
                        <Upload className="w-4 h-4 mr-1" />
                        Product
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setUploadType("logo");
                          setShowImageUploader(true);
                        }}
                      >
                        <Upload className="w-4 h-4 mr-1" />
                        Logo
                      </Button>
                    </div>

                    <Button
                      variant="ai"
                      size="sm"
                      className="w-full"
                      onClick={() => setShowAIBackground(true)}
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      AI Background
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setShowBrandKitManager(true)}
                    >
                      <Palette className="w-4 h-4 mr-2" />
                      Brand Kit
                    </Button>

                    {/* Uploaded Assets */}
                    {uploadedAssets.length > 0 && (
                      <div>
                        <h3 className="text-xs font-medium text-muted-foreground mb-3">Your Uploads</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {uploadedAssets.map((asset) => (
                            <button
                              key={asset.id}
                              onClick={() => handleAddAsset(asset)}
                              className="aspect-square rounded-lg overflow-hidden border border-border/50 hover:border-accent/50 transition-colors group"
                            >
                              <img
                                src={asset.src}
                                alt={asset.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="text-xs font-medium text-muted-foreground mb-3">Sample Products</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {sampleAssets.filter(a => a.type === "product").map((asset) => (
                          <button
                            key={asset.id}
                            onClick={() => handleAddAsset(asset)}
                            className="aspect-square rounded-lg overflow-hidden border border-border/50 hover:border-accent/50 transition-colors group"
                          >
                            <img
                              src={asset.src}
                              alt={asset.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-medium text-muted-foreground mb-3">Sample Logos</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {sampleAssets.filter(a => a.type === "logo").map((asset) => (
                          <button
                            key={asset.id}
                            onClick={() => handleAddAsset(asset)}
                            className="aspect-square rounded-lg overflow-hidden border border-border/50 hover:border-accent/50 transition-colors bg-muted/30 p-2"
                          >
                            <img
                              src={asset.src}
                              alt={asset.name}
                              className="w-full h-full object-contain"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {leftPanelTab === "layers" && (
                  <div className="space-y-2">
                    {fabricCanvas?.getObjects().map((obj, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer group"
                        onClick={() => {
                          fabricCanvas.setActiveObject(obj);
                          fabricCanvas.renderAll();
                        }}
                      >
                        <Layers className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground flex-1 capitalize">
                          {obj.type || "Object"} {i + 1}
                        </span>
                        <EyeIcon className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    )) || (
                      <p className="text-sm text-muted-foreground text-center py-4">No objects on canvas</p>
                    )}
                  </div>
                )}

                {leftPanelTab === "templates" && (
                  <div className="space-y-3">
                    <Button
                      variant="ai"
                      size="sm"
                      className="w-full"
                      onClick={() => setShowTemplateGallery(true)}
                    >
                      <Image className="w-4 h-4 mr-2" />
                      Browse All Templates
                    </Button>
                    {["Premium Minimal", "Festive Sale", "Product Focus", "Bold Typography"].map((template, i) => (
                      <GlassPanel key={i} padding="sm" className="cursor-pointer hover:border-accent/50 transition-colors">
                        <div className="aspect-video bg-muted/30 rounded mb-2" />
                        <span className="text-xs font-medium text-foreground">{template}</span>
                      </GlassPanel>
                    ))}
                  </div>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tools Bar */}
          <div className="h-12 border-b border-border/50 flex items-center justify-between px-4 bg-card/30 shrink-0">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setLeftPanelOpen(!leftPanelOpen)}
              >
                <Menu className="w-4 h-4" />
              </Button>
              <div className="w-px h-6 bg-border mx-2" />
              {[
                { tool: "select" as const, icon: MousePointer2 },
                { tool: "rectangle" as const, icon: Square },
                { tool: "circle" as const, icon: CircleIcon },
                { tool: "text" as const, icon: Type },
              ].map(({ tool, icon: Icon }) => (
                <Button
                  key={tool}
                  variant={activeTool === tool ? "secondary" : "ghost"}
                  size="icon-sm"
                  onClick={() => handleToolClick(tool)}
                >
                  <Icon className="w-4 h-4" />
                </Button>
              ))}
              <div className="w-px h-6 bg-border mx-2" />
              <Button 
                variant="ghost" 
                size="icon-sm"
                onClick={() => {
                  const activeObj = fabricCanvas?.getActiveObject();
                  if (activeObj) {
                    fabricCanvas?.remove(activeObj);
                    fabricCanvas?.renderAll();
                    toast.success("Deleted");
                  }
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon-sm">
                <Copy className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={showSafeZones ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setShowSafeZones(!showSafeZones)}
                className="text-xs"
              >
                <EyeIcon className="w-3 h-3 mr-1" />
                Safe Zones
              </Button>
              <div className="w-px h-6 bg-border mx-2" />
              <Button variant="ghost" size="icon-sm">
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-xs font-mono text-muted-foreground w-12 text-center">100%</span>
              <Button variant="ghost" size="icon-sm">
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setRightPanelOpen(!rightPanelOpen)}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Canvas */}
          <div 
            ref={containerRef}
            className="flex-1 flex items-center justify-center bg-background p-10 overflow-auto"
          >
            <div className="canvas-container shadow-premium relative">
              <canvas ref={canvasRef} />
              <SafeZonesOverlay
                zones={safeZones}
                canvasWidth={fabricCanvas?.getWidth() || 0}
                canvasHeight={fabricCanvas?.getHeight() || 0}
                visible={showSafeZones}
              />
            </div>
          </div>
        </div>

        {/* Right Panel - AI Chat & Compliance */}
        <AnimatePresence>
          {rightPanelOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-l border-border/50 bg-card/50 flex flex-col shrink-0 overflow-hidden"
            >
              {/* Compliance Section */}
              <div className="p-4 border-b border-border/50 shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-foreground">Compliance</h3>
                  <ComplianceScore score={calculatedScore} size="sm" showLabel={false} />
                </div>
                <div className="space-y-2">
                  {complianceChecks.map((check) => (
                    <div key={check.id} className="flex items-start gap-2">
                      {check.status === "pass" ? (
                        <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      ) : check.status === "warning" ? (
                        <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-foreground block">{check.label}</span>
                        <span className="text-[10px] text-muted-foreground block truncate" title={check.message}>
                          {check.message}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Chat */}
              <div className="flex-1 flex flex-col min-h-0">
                <div className="p-4 border-b border-border/50 shrink-0">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent" />
                    <h3 className="text-sm font-medium text-foreground">AI Assistant</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Tell me how to improve your creative
                  </p>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {aiMessages.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
                        <Sparkles className="w-6 h-6 text-accent" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Try commands like:
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {["Make it more premium", "Add festive elements", "Increase product size", "Make it minimal"].map((cmd, i) => (
                          <button
                            key={i}
                            onClick={() => setChatMessage(cmd)}
                            className="text-xs px-2 py-1 rounded-full bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          >
                            {cmd}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    aiMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={cn(
                          "text-sm",
                          msg.role === "user"
                            ? "chat-bubble-user ml-8"
                            : "chat-bubble-ai mr-8"
                        )}
                      >
                        {msg.content}
                      </div>
                    ))
                  )}
                  {aiStatus === "thinking" && (
                    <div className="chat-bubble-ai mr-8">
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="w-4 h-4 text-accent" />
                        </motion.div>
                        <span className="text-sm text-muted-foreground">Analyzing your design...</span>
                      </div>
                    </div>
                  )}
                  {aiStatus === "generating" && (
                    <div className="chat-bubble-ai mr-8">
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                        >
                          <Sparkles className="w-4 h-4 text-accent" />
                        </motion.div>
                        <span className="text-sm text-muted-foreground">Applying changes...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-border/50 shrink-0">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="Describe changes..."
                      className="flex-1 bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />
                    <Button
                      variant="ai"
                      size="icon"
                      onClick={handleSendMessage}
                      disabled={!chatMessage.trim() || aiStatus !== "idle"}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CreativeBuilder;
