import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette, Loader2, Sparkles, Check, Copy, Heart, Shield, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ColorPsychologyProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPalette: (colors: { primary: string; secondary: string; accent: string }) => void;
}

interface ColorPalette {
  name: string;
  colors: Array<{
    hex: string;
    name: string;
    psychology: string;
    usage: string;
  }>;
  emotionalImpact: string;
  bestFor: string[];
  accessibilityScore: number;
}

interface ColorAnalysis {
  primaryPalettes: ColorPalette[];
  recommendations: {
    primary: { hex: string; reasoning: string };
    secondary: { hex: string; reasoning: string };
    accent: { hex: string; reasoning: string };
    callToAction: { hex: string; reasoning: string };
  };
  conversionOptimization: {
    highConvertingColors: string[];
    trustBuildingColors: string[];
    urgencyColors: string[];
    calmingColors: string[];
  };
}

const targetEmotions = [
  "Trust & Reliability",
  "Excitement & Energy",
  "Calm & Serenity",
  "Luxury & Premium",
  "Joy & Happiness",
  "Power & Strength",
  "Growth & Innovation",
  "Warmth & Comfort",
];

const industries = [
  "E-commerce & Retail",
  "Technology & SaaS",
  "Finance & Banking",
  "Healthcare & Wellness",
  "Food & Beverage",
  "Fashion & Beauty",
  "Travel & Hospitality",
];

export function ColorPsychology({ isOpen, onClose, onApplyPalette }: ColorPsychologyProps) {
  const [targetEmotion, setTargetEmotion] = useState("");
  const [industry, setIndustry] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ColorAnalysis | null>(null);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-color-psychology', {
        body: { targetEmotion, industry }
      });

      if (error) throw error;

      setAnalysis(data.colorAnalysis);
      toast.success("Color analysis complete!");
    } catch (error) {
      console.error('Error analyzing colors:', error);
      toast.error("Failed to analyze colors");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    toast.success(`Copied ${hex}`);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const handleApplyPalette = (palette: ColorPalette) => {
    const colors = palette.colors;
    onApplyPalette({
      primary: colors.find(c => c.usage === "Primary")?.hex || colors[0]?.hex || "#6366F1",
      secondary: colors.find(c => c.usage === "Secondary")?.hex || colors[1]?.hex || "#818CF8",
      accent: colors.find(c => c.usage === "Accent")?.hex || colors[2]?.hex || "#F59E0B",
    });
    toast.success("Palette applied to canvas!");
    onClose();
  };

  const handleApplyRecommended = () => {
    if (analysis) {
      onApplyPalette({
        primary: analysis.recommendations.primary.hex,
        secondary: analysis.recommendations.secondary.hex,
        accent: analysis.recommendations.accent.hex,
      });
      toast.success("Recommended colors applied!");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Palette className="w-5 h-5 text-violet-500" />
            Color Psychology
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Color theory with emotional associations for maximum impact
          </p>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(85vh-100px)]">
          <div className="p-6 space-y-6">
            {/* Filters */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Emotion</label>
                <Select value={targetEmotion} onValueChange={setTargetEmotion}>
                  <SelectTrigger>
                    <SelectValue placeholder="What feeling to evoke?" />
                  </SelectTrigger>
                  <SelectContent>
                    {targetEmotions.map((emotion) => (
                      <SelectItem key={emotion} value={emotion}>{emotion}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Industry</label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((ind) => (
                      <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full"
              variant="ai"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Colors...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analyze Color Psychology
                </>
              )}
            </Button>

            {/* Results */}
            {analysis && (
              <div className="space-y-6">
                {/* Recommended Colors */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/30 space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-violet-500" />
                    AI Recommended Palette
                  </h4>
                  <div className="grid grid-cols-4 gap-3">
                    {Object.entries(analysis.recommendations).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <button
                          onClick={() => copyColor(value.hex)}
                          className="w-full aspect-square rounded-xl border-2 border-white/20 shadow-lg hover:scale-105 transition-transform relative overflow-hidden"
                          style={{ backgroundColor: value.hex }}
                        >
                          {copiedColor === value.hex && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Check className="w-5 h-5 text-white" />
                            </div>
                          )}
                        </button>
                        <span className="text-xs font-medium capitalize mt-2 block">{key}</span>
                        <span className="text-[10px] text-muted-foreground">{value.hex}</span>
                      </div>
                    ))}
                  </div>
                  <Button onClick={handleApplyRecommended} className="w-full" size="sm">
                    Apply Recommended Palette
                  </Button>
                </div>

                {/* Palettes */}
                <div className="space-y-3">
                  <h4 className="font-medium">Psychology-Based Palettes</h4>
                  <div className="space-y-4">
                    {analysis.primaryPalettes.map((palette, i) => (
                      <div key={i} className="p-4 rounded-xl bg-muted/50 border space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{palette.name}</span>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-16 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                                style={{ width: `${palette.accessibilityScore}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">{palette.accessibilityScore}% A11y</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          {palette.colors.map((color, j) => (
                            <button
                              key={j}
                              onClick={() => copyColor(color.hex)}
                              className="group relative"
                            >
                              <div
                                className="w-12 h-12 rounded-lg border shadow-sm hover:scale-110 transition-transform"
                                style={{ backgroundColor: color.hex }}
                              />
                              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 border shadow-lg">
                                {color.name}
                              </div>
                            </button>
                          ))}
                        </div>

                        <p className="text-sm text-muted-foreground">{palette.emotionalImpact}</p>
                        
                        <div className="flex flex-wrap gap-1">
                          {palette.bestFor.map((use, j) => (
                            <span key={j} className="px-2 py-0.5 bg-green-500/10 text-green-600 text-xs rounded-full">
                              {use}
                            </span>
                          ))}
                        </div>

                        <Button 
                          onClick={() => handleApplyPalette(palette)} 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                        >
                          Apply This Palette
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conversion Colors */}
                <div className="p-4 rounded-xl bg-muted/50 border space-y-4">
                  <h4 className="font-medium">Conversion Optimization Colors</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span>High Converting</span>
                      </div>
                      <div className="flex gap-2">
                        {analysis.conversionOptimization.highConvertingColors.map((color, i) => (
                          <button
                            key={i}
                            onClick={() => copyColor(color)}
                            className="w-8 h-8 rounded-md border shadow-sm hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Shield className="w-4 h-4 text-blue-500" />
                        <span>Trust Building</span>
                      </div>
                      <div className="flex gap-2">
                        {analysis.conversionOptimization.trustBuildingColors.map((color, i) => (
                          <button
                            key={i}
                            onClick={() => copyColor(color)}
                            className="w-8 h-8 rounded-md border shadow-sm hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Zap className="w-4 h-4 text-red-500" />
                        <span>Urgency</span>
                      </div>
                      <div className="flex gap-2">
                        {analysis.conversionOptimization.urgencyColors.map((color, i) => (
                          <button
                            key={i}
                            onClick={() => copyColor(color)}
                            className="w-8 h-8 rounded-md border shadow-sm hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Heart className="w-4 h-4 text-teal-500" />
                        <span>Calming</span>
                      </div>
                      <div className="flex gap-2">
                        {analysis.conversionOptimization.calmingColors.map((color, i) => (
                          <button
                            key={i}
                            onClick={() => copyColor(color)}
                            className="w-8 h-8 rounded-md border shadow-sm hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
