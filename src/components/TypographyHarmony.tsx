import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Type, Sparkles, Check, Loader2, Palette } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface FontPairing {
  id: string;
  headingFont: string;
  bodyFont: string;
  style: string;
  explanation: string;
  useCase: string;
  harmonyScore: number;
  source: string;
}

interface TypographyHarmonyProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFonts: (headingFont: string, bodyFont: string) => void;
  currentHeadingFont?: string;
  currentBodyFont?: string;
}

const brandStyles = [
  { id: "modern", name: "Modern & Clean" },
  { id: "elegant", name: "Elegant & Luxury" },
  { id: "creative", name: "Creative & Bold" },
  { id: "minimal", name: "Minimal & Tech" },
  { id: "playful", name: "Playful & Fun" },
  { id: "corporate", name: "Corporate & Professional" },
];

export const TypographyHarmony = ({
  open,
  onOpenChange,
  onApplyFonts,
  currentHeadingFont = "Inter",
  currentBodyFont = "Inter",
}: TypographyHarmonyProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [brandStyle, setBrandStyle] = useState("modern");
  const [context, setContext] = useState("");
  const [suggestions, setSuggestions] = useState<FontPairing[]>([]);
  const [selectedPairing, setSelectedPairing] = useState<FontPairing | null>(null);

  const generateSuggestions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-typography-harmony', {
        body: {
          brandStyle,
          currentHeadingFont,
          currentBodyFont,
          context,
        }
      });

      if (error) throw error;
      
      if (data?.suggestions) {
        setSuggestions(data.suggestions);
        toast.success(`Generated ${data.suggestions.length} font pairings`);
      }
    } catch (error) {
      console.error('Error generating typography suggestions:', error);
      toast.error('Failed to generate suggestions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (selectedPairing) {
      onApplyFonts(selectedPairing.headingFont, selectedPairing.bodyFont);
      toast.success(`Applied ${selectedPairing.headingFont} + ${selectedPairing.bodyFont}`);
      onOpenChange(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 75) return "text-yellow-500";
    return "text-orange-500";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden bg-background/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Type className="w-5 h-5 text-white" />
            </div>
            Typography Harmony
            <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded-full">
              Engine 8
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {/* Controls */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Brand Style</label>
              <Select value={brandStyle} onValueChange={setBrandStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {brandStyles.map(style => (
                    <SelectItem key={style.id} value={style.id}>
                      {style.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Design Context (optional)</label>
              <Input
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="e.g., Fashion brand, tech startup..."
                className="bg-muted/30"
              />
            </div>

            <div className="p-4 rounded-xl bg-muted/30 space-y-2">
              <p className="text-xs text-muted-foreground">Current Fonts</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Heading:</span>
                <span className="text-sm text-muted-foreground">{currentHeadingFont}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Body:</span>
                <span className="text-sm text-muted-foreground">{currentBodyFont}</span>
              </div>
            </div>

            <Button 
              onClick={generateSuggestions}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Pairings
                </>
              )}
            </Button>
          </div>

          {/* Results */}
          <div className="md:col-span-2">
            <ScrollArea className="h-[400px] pr-4">
              {suggestions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <Palette className="w-12 h-12 mb-4 opacity-50" />
                  <p className="text-center">
                    Select a brand style and click generate to get AI-powered font pairing suggestions
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  <div className="space-y-3">
                    {suggestions.map((pairing, index) => (
                      <motion.div
                        key={pairing.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setSelectedPairing(pairing)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedPairing?.id === pairing.id
                            ? "border-violet-500 bg-violet-500/10"
                            : "border-border/50 hover:border-border bg-muted/20 hover:bg-muted/40"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span 
                                className="text-lg font-bold"
                                style={{ fontFamily: pairing.headingFont }}
                              >
                                {pairing.headingFont}
                              </span>
                              <span className="text-muted-foreground">+</span>
                              <span 
                                className="text-sm"
                                style={{ fontFamily: pairing.bodyFont }}
                              >
                                {pairing.bodyFont}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">
                              {pairing.style} • {pairing.useCase}
                            </p>
                            <p className="text-sm text-foreground/80">
                              {pairing.explanation}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className={`text-lg font-bold ${getScoreColor(pairing.harmonyScore)}`}>
                              {pairing.harmonyScore}
                            </span>
                            <span className="text-xs text-muted-foreground">Harmony</span>
                            {selectedPairing?.id === pairing.id && (
                              <div className="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Preview */}
                        <div className="mt-4 p-4 rounded-lg bg-background border border-border/30">
                          <h3 
                            className="text-xl font-bold mb-2"
                            style={{ fontFamily: pairing.headingFont }}
                          >
                            The Quick Brown Fox
                          </h3>
                          <p 
                            className="text-sm text-muted-foreground"
                            style={{ fontFamily: pairing.bodyFont }}
                          >
                            The quick brown fox jumps over the lazy dog. This sample text demonstrates how the heading and body fonts work together in harmony.
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              )}
            </ScrollArea>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border/30">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleApply}
            disabled={!selectedPairing}
            className="bg-gradient-to-r from-violet-500 to-purple-600"
          >
            Apply Fonts
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
