import { useEffect, useRef, useState, useCallback } from "react";
import { Canvas as FabricCanvas, Rect, Circle, IText, FabricImage, Polygon, Path } from "fabric";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import {
  Sparkles, ChevronLeft, Download, Share2, Undo2, Redo2,
  ZoomIn, ZoomOut, MousePointer2, Square, Circle as CircleIcon,
  Type, Image, Trash2, Copy, Layers, Upload, Send, Settings,
  Check, AlertTriangle, X, Menu, Eye as EyeIcon, Palette, Wand2, Save, Loader2,
  PenTool, Zap, FileText, Triangle, Star, ArrowRight
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
import { AttentionHeatmap } from "@/components/AttentionHeatmap";
import { CopywritingEngine } from "@/components/CopywritingEngine";
import { useCreativeStore } from "@/store/creativeStore";
import { useComplianceEngine, type ComplianceCheck } from "@/hooks/useComplianceEngine";
import { useAICanvasControl } from "@/hooks/useAICanvasControl";
import { useProject } from "@/hooks/useProject";
import { useFormatResize } from "@/hooks/useFormatResize";
import { useCanvasHistory } from "@/hooks/useCanvasHistory";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useAutoCorrection } from "@/hooks/useAutoCorrection";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Sample assets for the panel with better images
const sampleAssets = [
  { id: "1", type: "product", src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop", name: "Watch", color: "from-amber-500/20 to-orange-500/20" },
  { id: "2", type: "product", src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop", name: "Headphones", color: "from-yellow-500/20 to-amber-500/20" },
  { id: "3", type: "product", src: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop", name: "Sunglasses", color: "from-slate-500/20 to-zinc-500/20" },
  { id: "4", type: "logo", src: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400&h=400&fit=crop", name: "Brand Logo", color: "from-violet-500/20 to-purple-500/20" },
];

// Tool colors for shapes
const shapeColors = {
  rectangle: { fill: "rgba(99, 102, 241, 0.15)", stroke: "#6366F1" }, // Indigo
  circle: { fill: "rgba(236, 72, 153, 0.15)", stroke: "#EC4899" }, // Pink
  triangle: { fill: "rgba(245, 158, 11, 0.15)", stroke: "#F59E0B" }, // Amber
  star: { fill: "rgba(168, 85, 247, 0.15)", stroke: "#A855F7" }, // Purple
  arrow: { fill: "rgba(34, 197, 94, 0.15)", stroke: "#22C55E" }, // Green
  text: "#1E293B", // Slate
};

// Quick templates with actual canvas data
const quickTemplates = [
  { 
    name: "Premium Minimal", 
    color: "from-slate-600 to-zinc-800",
    canvas_data: {
      objects: [
        { type: "rect", left: 0, top: 0, width: 1080, height: 1080, fill: "#F8FAFC", selectable: false },
        { type: "i-text", left: 100, top: 200, text: "PREMIUM", fontSize: 72, fontWeight: "700", fill: "#0F172A", fontFamily: "Inter" },
        { type: "i-text", left: 100, top: 290, text: "COLLECTION", fontSize: 48, fontWeight: "300", fill: "#64748B", fontFamily: "Inter" },
        { type: "rect", left: 100, top: 380, width: 60, height: 4, fill: "#0F172A" },
      ]
    }
  },
  { 
    name: "Festive Sale", 
    color: "from-red-500 to-orange-400",
    canvas_data: {
      objects: [
        { type: "rect", left: 0, top: 0, width: 1080, height: 1080, fill: "#DC2626", selectable: false },
        { type: "i-text", left: 540, top: 300, text: "SALE", fontSize: 120, fontWeight: "900", fill: "#FFFFFF", fontFamily: "Inter", originX: "center" },
        { type: "i-text", left: 540, top: 450, text: "UP TO 50% OFF", fontSize: 48, fontWeight: "600", fill: "#FEF3C7", fontFamily: "Inter", originX: "center" },
        { type: "circle", left: 800, top: 100, radius: 80, fill: "#FEF3C7" },
      ]
    }
  },
  { 
    name: "Product Focus", 
    color: "from-blue-500 to-cyan-400",
    canvas_data: {
      objects: [
        { type: "rect", left: 0, top: 0, width: 1080, height: 1080, fill: "#0EA5E9", selectable: false },
        { type: "circle", left: 540, top: 540, radius: 300, fill: "rgba(255,255,255,0.1)", originX: "center", originY: "center" },
        { type: "i-text", left: 540, top: 850, text: "NEW ARRIVAL", fontSize: 56, fontWeight: "700", fill: "#FFFFFF", fontFamily: "Inter", originX: "center" },
      ]
    }
  },
  { 
    name: "Bold Typography", 
    color: "from-purple-600 to-pink-500",
    canvas_data: {
      objects: [
        { type: "rect", left: 0, top: 0, width: 1080, height: 1080, fill: "#7C3AED", selectable: false },
        { type: "i-text", left: 100, top: 300, text: "MAKE", fontSize: 140, fontWeight: "900", fill: "#FFFFFF", fontFamily: "Inter" },
        { type: "i-text", left: 100, top: 460, text: "IT", fontSize: 140, fontWeight: "900", fill: "#F472B6", fontFamily: "Inter" },
        { type: "i-text", left: 100, top: 620, text: "BOLD", fontSize: 140, fontWeight: "900", fill: "#FFFFFF", fontFamily: "Inter" },
      ]
    }
  },
];

const CreativeBuilder = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeTool, setActiveTool] = useState<"select" | "rectangle" | "circle" | "triangle" | "star" | "arrow" | "text">("select");
  const [chatMessage, setChatMessage] = useState("");
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [showSafeZones, setShowSafeZones] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [complianceChecks, setComplianceChecks] = useState<ComplianceCheck[]>([]);
  const [calculatedScore, setCalculatedScore] = useState(85);
  const [uploadedAssets, setUploadedAssets] = useState<Array<{ id: string; src: string; name: string; type: string }>>([]);
  const [zoom, setZoom] = useState(100);

  // Modal states
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [uploadType, setUploadType] = useState<"product" | "logo">("product");
  const [showBrandKitManager, setShowBrandKitManager] = useState(false);
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showAIBackground, setShowAIBackground] = useState(false);
  const [showCopywriting, setShowCopywriting] = useState(false);
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
  
  // History and keyboard shortcuts
  const { undo, redo, canUndo, canRedo } = useCanvasHistory(fabricCanvas);
  const { autoFixAll } = useAutoCorrection(fabricCanvas, safeZones);
  
  // Keyboard shortcuts
  useKeyboardShortcuts({
    canvas: fabricCanvas,
    onUndo: undo,
    onRedo: redo,
    onSave: saveProject,
    onExport: () => setShowExportDialog(true),
    canUndo,
    canRedo,
  });

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
        width: 120,
        height: 80,
        fill: shapeColors.rectangle.fill,
        stroke: shapeColors.rectangle.stroke,
        strokeWidth: 2,
        rx: 12,
        ry: 12,
      });
      fabricCanvas.add(rect);
      fabricCanvas.setActiveObject(rect);
    } else if (tool === "circle") {
      const circle = new Circle({
        left: 100,
        top: 100,
        radius: 50,
        fill: shapeColors.circle.fill,
        stroke: shapeColors.circle.stroke,
        strokeWidth: 2,
      });
      fabricCanvas.add(circle);
      fabricCanvas.setActiveObject(circle);
    } else if (tool === "triangle") {
      const triangle = new Polygon(
        [
          { x: 50, y: 0 },
          { x: 100, y: 86 },
          { x: 0, y: 86 },
        ],
        {
          left: 100,
          top: 100,
          fill: shapeColors.triangle.fill,
          stroke: shapeColors.triangle.stroke,
          strokeWidth: 2,
        }
      );
      fabricCanvas.add(triangle);
      fabricCanvas.setActiveObject(triangle);
    } else if (tool === "star") {
      // Create 5-pointed star
      const starPoints = [];
      const outerRadius = 50;
      const innerRadius = 25;
      for (let i = 0; i < 10; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (Math.PI / 5) * i - Math.PI / 2;
        starPoints.push({
          x: 50 + radius * Math.cos(angle),
          y: 50 + radius * Math.sin(angle),
        });
      }
      const star = new Polygon(starPoints, {
        left: 100,
        top: 100,
        fill: shapeColors.star.fill,
        stroke: shapeColors.star.stroke,
        strokeWidth: 2,
      });
      fabricCanvas.add(star);
      fabricCanvas.setActiveObject(star);
    } else if (tool === "arrow") {
      const arrow = new Path(
        "M 0 20 L 60 20 L 60 10 L 80 25 L 60 40 L 60 30 L 0 30 Z",
        {
          left: 100,
          top: 100,
          fill: shapeColors.arrow.fill,
          stroke: shapeColors.arrow.stroke,
          strokeWidth: 2,
          scaleX: 1.5,
          scaleY: 1.5,
        }
      );
      fabricCanvas.add(arrow);
      fabricCanvas.setActiveObject(arrow);
    } else if (tool === "text") {
      const text = new IText("Your Text Here", {
        left: 100,
        top: 100,
        fontSize: 28,
        fontFamily: "Inter",
        fontWeight: "600",
        fill: shapeColors.text,
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

  // Handle template selection - load canvas_data onto canvas
  const handleTemplateSelected = async (template: { 
    name: string; 
    format_width: number; 
    format_height: number;
    canvas_data: unknown;
  }) => {
    if (!fabricCanvas) return;
    
    setShowTemplateGallery(false);
    
    try {
      // Find matching format or use template dimensions
      const matchingFormat = availableFormats.find(
        f => f.width === template.format_width && f.height === template.format_height
      );
      
      if (matchingFormat) {
        setCurrentFormat(matchingFormat);
        setPreviousFormat(matchingFormat);
      }
      
      // Clear canvas and load template data
      fabricCanvas.clear();
      fabricCanvas.backgroundColor = "#ffffff";
      
      const canvasData = template.canvas_data as { objects?: unknown[]; background?: string };
      
      if (canvasData && typeof canvasData === 'object' && canvasData.objects) {
        await fabricCanvas.loadFromJSON(canvasData);
        fabricCanvas.renderAll();
      }
      
      toast.success(`Loaded template: ${template.name}`);
      updateCompliance();
    } catch (error) {
      console.error("Failed to load template:", error);
      toast.error("Failed to load template");
    }
  };

  // Handle quick template selection from sidebar
  const handleQuickTemplate = async (template: { 
    name: string; 
    color: string;
    canvas_data: { objects: unknown[] };
  }) => {
    if (!fabricCanvas) return;
    
    try {
      fabricCanvas.clear();
      fabricCanvas.backgroundColor = "#ffffff";
      
      await fabricCanvas.loadFromJSON(template.canvas_data);
      fabricCanvas.renderAll();
      
      toast.success(`Applied: ${template.name}`);
      updateCompliance();
    } catch (error) {
      console.error("Failed to apply template:", error);
      toast.error("Failed to apply template");
    }
  };

  // Handle brand kit selection - apply colors and fonts to canvas objects
  const handleBrandKitSelected = (brandKit: { 
    name: string; 
    primary_color: string; 
    secondary_color: string;
    accent_color: string;
    font_heading: string;
    font_body: string;
  }) => {
    if (!fabricCanvas) return;
    
    setShowBrandKitManager(false);
    
    const objects = fabricCanvas.getObjects();
    let updatedCount = 0;
    
    objects.forEach((obj) => {
      // Apply colors to shapes
      if (obj.type === 'rect' || obj.type === 'circle') {
        const currentFill = obj.fill?.toString() || '';
        
        // Update fill colors based on current color type
        if (currentFill.includes('22C55E') || currentFill.includes('green')) {
          obj.set('fill', brandKit.primary_color);
          updatedCount++;
        } else if (currentFill.includes('38BDF8') || currentFill.includes('blue')) {
          obj.set('fill', brandKit.secondary_color);
          updatedCount++;
        } else if (currentFill.includes('F59E0B') || currentFill.includes('orange')) {
          obj.set('fill', brandKit.accent_color);
          updatedCount++;
        }
        
        // Update stroke colors
        const currentStroke = obj.stroke?.toString() || '';
        if (currentStroke.includes('22C55E') || currentStroke.includes('green')) {
          obj.set('stroke', brandKit.primary_color);
        } else if (currentStroke.includes('38BDF8') || currentStroke.includes('blue')) {
          obj.set('stroke', brandKit.secondary_color);
        }
      }
      
      // Apply fonts to text objects
      if (obj.type === 'i-text' || obj.type === 'text' || obj.type === 'textbox') {
        const textObj = obj as { fontSize?: number; fontFamily?: string; set: (key: string, value: string) => void };
        const fontSize = textObj.fontSize || 16;
        
        // Larger text gets heading font, smaller gets body font
        if (fontSize >= 20) {
          textObj.set('fontFamily', brandKit.font_heading);
        } else {
          textObj.set('fontFamily', brandKit.font_body);
        }
        updatedCount++;
      }
    });
    
    fabricCanvas.renderAll();
    toast.success(`Applied "${brandKit.name}" to ${updatedCount} objects`);
    updateCompliance();
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
        fabricCanvas={fabricCanvas}
        format={currentFormat}
      />
      <AIBackgroundGenerator
        isOpen={showAIBackground}
        onClose={() => setShowAIBackground(false)}
        onSelectBackground={handleBackgroundSelected}
      />
      <CopywritingEngine
        isOpen={showCopywriting}
        onClose={() => setShowCopywriting(false)}
        onSelectCopy={(text, type) => {
          if (!fabricCanvas) return;
          const fontSize = type === "headline" ? 32 : type === "cta" ? 18 : 24;
          const newText = new IText(text, {
            left: fabricCanvas.getWidth() / 2,
            top: type === "cta" ? fabricCanvas.getHeight() - 100 : fabricCanvas.getHeight() / 3,
            fontSize,
            fontFamily: "Inter",
            fontWeight: type === "headline" ? "700" : "600",
            fill: "#020617",
            originX: "center",
          });
          fabricCanvas.add(newText);
          fabricCanvas.setActiveObject(newText);
          fabricCanvas.renderAll();
        }}
      />

      {/* Top Bar - Enhanced */}
      <header className="h-16 border-b border-border/30 glass flex items-center justify-between px-5 shrink-0 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon-sm" className="hover:bg-muted/50">
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent via-highlight to-accent flex items-center justify-center shadow-glow-accent">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            {isEditingName ? (
              <Input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                className="h-8 w-48 text-sm font-medium bg-muted/30 border-accent/30"
                autoFocus
              />
            ) : (
              <span 
                className="font-semibold text-foreground cursor-pointer hover:text-accent transition-colors"
                onClick={() => setIsEditingName(true)}
              >
                {projectName}
              </span>
            )}
          </div>
        </div>

        {/* Format Selector - Enhanced */}
        <div className="flex items-center gap-3">
          <div className="flex gap-1 bg-secondary/30 rounded-xl p-1.5 backdrop-blur-sm border border-border/30">
            {availableFormats.slice(0, 4).map((format) => (
              <button
                key={format.id}
                onClick={() => handleFormatChange(format)}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300",
                  currentFormat.id === format.id
                    ? "bg-gradient-to-r from-accent to-highlight text-accent-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                )}
              >
                {format.name}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/30 border border-border/30">
            <ComplianceScore score={calculatedScore} size="sm" showLabel={false} />
            <span className="text-xs font-medium text-muted-foreground">Score</span>
          </div>
          <AIIndicator status={aiStatus} />
        </div>

        {/* Actions - Enhanced */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-lg bg-secondary/30 border border-border/30">
            <Button 
              variant="ghost" 
              size="icon-sm"
              onClick={undo}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
              className="hover:bg-muted/50"
            >
              <Undo2 className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon-sm"
              onClick={redo}
              disabled={!canRedo}
              title="Redo (Ctrl+Shift+Z)"
              className="hover:bg-muted/50"
            >
              <Redo2 className="w-4 h-4" />
            </Button>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={saveProject}
            disabled={isSaving}
            className="border-border/50 hover:border-accent/50 hover:bg-accent/5"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save
          </Button>
          <Button variant="outline" size="sm" className="border-border/50 hover:border-highlight/50 hover:bg-highlight/5">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="ai" size="sm" onClick={() => setShowExportDialog(true)} className="shadow-lg">
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
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-r border-border/30 bg-gradient-to-b from-card/80 to-card/40 flex flex-col shrink-0 overflow-hidden backdrop-blur-sm"
            >
              {/* Tabs - Enhanced */}
              <div className="flex border-b border-border/30 shrink-0 bg-secondary/20">
                {(["assets", "layers", "templates"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setLeftPanelTab(tab)}
                    className={cn(
                      "flex-1 py-3.5 text-xs font-semibold transition-all duration-300 capitalize relative",
                      leftPanelTab === tab
                        ? "text-accent"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab}
                    {leftPanelTab === tab && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent to-highlight"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Panel Content - Enhanced */}
              <div className="flex-1 p-5 overflow-y-auto">
                {leftPanelTab === "assets" && (
                  <div className="space-y-5">
                    {/* Upload Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => {
                          setUploadType("product");
                          setShowImageUploader(true);
                        }}
                        className="panel-card flex flex-col items-center gap-2 p-4 hover:border-accent/40"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                          <Upload className="w-5 h-5 text-amber-400" />
                        </div>
                        <span className="text-xs font-medium text-foreground">Product</span>
                      </button>
                      <button
                        onClick={() => {
                          setUploadType("logo");
                          setShowImageUploader(true);
                        }}
                        className="panel-card flex flex-col items-center gap-2 p-4 hover:border-highlight/40"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                          <Upload className="w-5 h-5 text-cyan-400" />
                        </div>
                        <span className="text-xs font-medium text-foreground">Logo</span>
                      </button>
                    </div>

                    {/* AI Tools */}
                    <div className="space-y-2">
                      <h3 className="section-title">AI Tools</h3>
                      <Button
                        variant="ai"
                        size="sm"
                        className="w-full justify-start h-11"
                        onClick={() => setShowAIBackground(true)}
                      >
                        <Wand2 className="w-4 h-4 mr-3" />
                        Generate AI Background
                      </Button>

                      <Button
                        variant="ai-outline"
                        size="sm"
                        className="w-full justify-start h-11"
                        onClick={() => setShowCopywriting(true)}
                      >
                        <FileText className="w-4 h-4 mr-3" />
                        AI Copywriting
                      </Button>
                    </div>

                    <div className="divider" />

                    {/* Brand Kit */}
                    <button
                      onClick={() => setShowBrandKitManager(true)}
                      className="panel-card w-full flex items-center gap-3 p-3"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
                        <Palette className="w-5 h-5 text-violet-400" />
                      </div>
                      <div className="text-left">
                        <span className="text-sm font-medium text-foreground block">Brand Kit</span>
                        <span className="text-[10px] text-muted-foreground">Apply your brand colors & fonts</span>
                      </div>
                    </button>

                    {/* Uploaded Assets */}
                    {uploadedAssets.length > 0 && (
                      <div>
                        <div className="divider" />
                        <h3 className="section-title">Your Uploads</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {uploadedAssets.map((asset) => (
                            <button
                              key={asset.id}
                              onClick={() => handleAddAsset(asset)}
                              className="asset-card"
                            >
                              <img
                                src={asset.src}
                                alt={asset.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="divider" />

                    {/* Sample Products */}
                    <div>
                      <h3 className="section-title">Sample Products</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {sampleAssets.filter(a => a.type === "product").map((asset) => (
                          <button
                            key={asset.id}
                            onClick={() => handleAddAsset(asset)}
                            className="asset-card group relative"
                          >
                            <div className={`absolute inset-0 bg-gradient-to-br ${asset.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                            <img
                              src={asset.src}
                              alt={asset.name}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-[10px] font-medium text-foreground">{asset.name}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sample Logos */}
                    <div>
                      <h3 className="section-title">Sample Logos</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {sampleAssets.filter(a => a.type === "logo").map((asset) => (
                          <button
                            key={asset.id}
                            onClick={() => handleAddAsset(asset)}
                            className="asset-card p-3 flex items-center justify-center bg-muted/20"
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
                    <h3 className="section-title">Canvas Objects</h3>
                    {fabricCanvas?.getObjects().length ? (
                      fabricCanvas.getObjects().map((obj, i) => {
                        const isActive = fabricCanvas.getActiveObject() === obj;
                        const objType = obj.type || "Object";
                        const iconColors: Record<string, string> = {
                          rect: "text-indigo-400",
                          circle: "text-pink-400",
                          "i-text": "text-emerald-400",
                          text: "text-emerald-400",
                          image: "text-amber-400",
                        };
                        return (
                          <div
                            key={i}
                            className={cn("layer-item", isActive && "active")}
                            onClick={() => {
                              fabricCanvas.setActiveObject(obj);
                              fabricCanvas.renderAll();
                            }}
                          >
                            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center bg-muted/30", iconColors[objType] || "text-muted-foreground")}>
                              {objType === "rect" && <Square className="w-4 h-4" />}
                              {objType === "circle" && <CircleIcon className="w-4 h-4" />}
                              {(objType === "i-text" || objType === "text") && <Type className="w-4 h-4" />}
                              {objType === "image" && <Image className="w-4 h-4" />}
                              {!["rect", "circle", "i-text", "text", "image"].includes(objType) && <Layers className="w-4 h-4" />}
                            </div>
                            <span className="text-sm text-foreground flex-1 capitalize font-medium">
                              {objType} {i + 1}
                            </span>
                            <EyeIcon className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-12 h-12 rounded-xl bg-muted/30 flex items-center justify-center mx-auto mb-3">
                          <Layers className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">No objects on canvas</p>
                        <p className="text-xs text-muted-foreground mt-1">Add shapes or images to get started</p>
                      </div>
                    )}
                  </div>
                )}

                {leftPanelTab === "templates" && (
                  <div className="space-y-4">
                    <Button
                      variant="ai"
                      size="sm"
                      className="w-full h-11"
                      onClick={() => setShowTemplateGallery(true)}
                    >
                      <Image className="w-4 h-4 mr-2" />
                      Browse All Templates
                    </Button>
                    
                    <div className="divider" />
                    <h3 className="section-title">Quick Templates</h3>
                    
                    {quickTemplates.map((template, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuickTemplate(template)}
                        className="panel-card group w-full text-left"
                      >
                        <div className={`aspect-video bg-gradient-to-br ${template.color} rounded-lg mb-3 flex items-center justify-center relative overflow-hidden`}>
                          <Sparkles className="w-6 h-6 text-white/60 group-hover:text-white/90 transition-colors" />
                          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                        </div>
                        <span className="text-sm font-medium text-foreground">{template.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tools Bar - Enhanced */}
          <div className="h-14 border-b border-border/30 flex items-center justify-between px-5 bg-gradient-to-r from-card/50 to-card/30 shrink-0 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setLeftPanelOpen(!leftPanelOpen)}
                className="hover:bg-muted/50"
              >
                <Menu className="w-4 h-4" />
              </Button>
              <div className="w-px h-6 bg-border/50 mx-2" />
              
              {/* Tool Buttons - Enhanced */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-secondary/30 border border-border/30">
                {[
                  { tool: "select" as const, icon: MousePointer2, color: "text-foreground", label: "Select" },
                  { tool: "rectangle" as const, icon: Square, color: "text-indigo-400", label: "Rectangle" },
                  { tool: "circle" as const, icon: CircleIcon, color: "text-pink-400", label: "Circle" },
                  { tool: "triangle" as const, icon: Triangle, color: "text-amber-400", label: "Triangle" },
                  { tool: "star" as const, icon: Star, color: "text-purple-400", label: "Star" },
                  { tool: "arrow" as const, icon: ArrowRight, color: "text-green-400", label: "Arrow" },
                  { tool: "text" as const, icon: Type, color: "text-emerald-400", label: "Text" },
                ].map(({ tool, icon: Icon, color, label }) => (
                  <button
                    key={tool}
                    onClick={() => handleToolClick(tool)}
                    title={label}
                    className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200",
                      activeTool === tool
                        ? `bg-gradient-to-br from-accent/20 to-highlight/20 ${color} shadow-md border border-accent/30`
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
              
              <div className="w-px h-6 bg-border/50 mx-2" />
              
              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon-sm"
                  className="hover:bg-destructive/10 hover:text-destructive"
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
                <Button 
                  variant="ghost" 
                  size="icon-sm"
                  className="hover:bg-accent/10 hover:text-accent"
                  onClick={() => {
                    const activeObj = fabricCanvas?.getActiveObject();
                    if (activeObj) {
                      activeObj.clone().then((cloned: any) => {
                        cloned.set({ left: (cloned.left || 0) + 20, top: (cloned.top || 0) + 20 });
                        fabricCanvas?.add(cloned);
                        fabricCanvas?.setActiveObject(cloned);
                        fabricCanvas?.renderAll();
                        toast.success("Duplicated");
                      });
                    }
                  }}
                  title="Duplicate (Ctrl+D)"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant={showSafeZones ? "ai-outline" : "ghost"}
                size="sm"
                onClick={() => setShowSafeZones(!showSafeZones)}
                className="text-xs h-8"
              >
                <EyeIcon className="w-3.5 h-3.5 mr-1.5" />
                Safe Zones
              </Button>
              <Button
                variant={showHeatmap ? "ai-outline" : "ghost"}
                size="sm"
                onClick={() => setShowHeatmap(!showHeatmap)}
                className="text-xs h-8"
              >
                <Zap className="w-3.5 h-3.5 mr-1.5" />
                Heatmap
              </Button>
              
              <div className="w-px h-6 bg-border/50 mx-2" />
              
              {/* Zoom Controls */}
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-secondary/30 border border-border/30">
                <Button 
                  variant="ghost" 
                  size="icon-sm"
                  className="w-7 h-7 hover:bg-muted/50"
                  onClick={() => setZoom(Math.max(50, zoom - 10))}
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </Button>
                <span className="text-xs font-mono text-muted-foreground w-10 text-center">{zoom}%</span>
                <Button 
                  variant="ghost" 
                  size="icon-sm"
                  className="w-7 h-7 hover:bg-muted/50"
                  onClick={() => setZoom(Math.min(200, zoom + 10))}
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setRightPanelOpen(!rightPanelOpen)}
                className="hover:bg-muted/50"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Canvas */}
          <div 
            ref={containerRef}
            className="flex-1 flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/10 p-10 overflow-auto"
          >
            <div 
              className="canvas-container shadow-premium relative ring-1 ring-border/20"
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center' }}
            >
              <canvas ref={canvasRef} />
              <SafeZonesOverlay
                zones={safeZones}
                canvasWidth={fabricCanvas?.getWidth() || 0}
                canvasHeight={fabricCanvas?.getHeight() || 0}
                visible={showSafeZones}
              />
              <AttentionHeatmap
                canvas={fabricCanvas}
                canvasWidth={fabricCanvas?.getWidth() || 0}
                canvasHeight={fabricCanvas?.getHeight() || 0}
                formatName={currentFormat.name}
                visible={showHeatmap}
                onToggle={() => setShowHeatmap(false)}
              />
            </div>
          </div>
        </div>

        {/* Right Panel - AI Chat & Compliance - Enhanced */}
        <AnimatePresence>
          {rightPanelOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-l border-border/30 bg-gradient-to-b from-card/80 to-card/40 flex flex-col shrink-0 overflow-hidden backdrop-blur-sm"
            >
              {/* Compliance Section - Enhanced */}
              <div className="p-5 border-b border-border/30 shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground">Compliance</h3>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ai-outline"
                      size="sm"
                      onClick={() => {
                        autoFixAll();
                        updateCompliance();
                      }}
                      className="text-xs h-7 px-3"
                    >
                      <Zap className="w-3 h-3 mr-1.5" />
                      Auto-Fix
                    </Button>
                    <ComplianceScore score={calculatedScore} size="sm" showLabel={false} />
                  </div>
                </div>
                <div className="space-y-2">
                  {complianceChecks.map((check) => (
                    <div 
                      key={check.id} 
                      className={cn(
                        "compliance-item",
                        check.status === "pass" && "pass",
                        check.status === "warning" && "warning",
                        check.status === "fail" && "fail"
                      )}
                    >
                      {check.status === "pass" ? (
                        <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                      ) : check.status === "warning" ? (
                        <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-medium text-foreground block">{check.label}</span>
                        <span className="text-[10px] text-muted-foreground block truncate" title={check.message}>
                          {check.message}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Chat - Enhanced */}
              <div className="flex-1 flex flex-col min-h-0">
                <div className="p-5 border-b border-border/30 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-highlight flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">AI Assistant</h3>
                      <p className="text-[10px] text-muted-foreground">Tell me how to improve your creative</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {aiMessages.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-highlight/20 flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-7 h-7 text-accent" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">Try commands like:</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {["Make it more premium", "Add festive elements", "Increase product size", "Make it minimal"].map((cmd, i) => (
                          <button
                            key={i}
                            onClick={() => setChatMessage(cmd)}
                            className="command-chip"
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
                          msg.role === "user" ? "chat-bubble-user ml-8" : "chat-bubble-ai mr-8"
                        )}
                      >
                        {msg.content}
                      </div>
                    ))
                  )}
                  {aiStatus === "thinking" && (
                    <div className="chat-bubble-ai mr-8">
                      <div className="flex items-center gap-2">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                          <Sparkles className="w-4 h-4 text-accent" />
                        </motion.div>
                        <span className="text-sm text-muted-foreground">Analyzing your design...</span>
                      </div>
                    </div>
                  )}
                  {aiStatus === "generating" && (
                    <div className="chat-bubble-ai mr-8">
                      <div className="flex items-center gap-2">
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5, repeat: Infinity }}>
                          <Sparkles className="w-4 h-4 text-accent" />
                        </motion.div>
                        <span className="text-sm text-muted-foreground">Applying changes...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input - Enhanced */}
                <div className="p-5 border-t border-border/30 shrink-0">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="Describe changes..."
                      className="ai-input flex-1"
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
