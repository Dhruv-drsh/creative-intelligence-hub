import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Eye, Sparkles, Loader2, AlertTriangle, CheckCircle, Lightbulb, Zap, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface AuditCategory {
  name: string;
  score: number;
  strengths: string[];
  improvements: string[];
  actionable: string;
}

interface DesignAudit {
  overallScore: number;
  summary: string;
  categories: AuditCategory[];
  priorityFixes: string[];
  quickWins: string[];
  advancedTips: string[];
}

interface VisualAuditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canvasState: any;
}

export const VisualAuditor = ({
  open,
  onOpenChange,
  canvasState,
}: VisualAuditorProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [designGoal, setDesignGoal] = useState("");
  const [audit, setAudit] = useState<DesignAudit | null>(null);

  const runAudit = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-visual-auditor', {
        body: {
          canvasState,
          designGoal,
        }
      });

      if (error) throw error;
      
      if (data?.audit) {
        setAudit(data.audit);
        toast.success("Design audit complete!");
      }
    } catch (error) {
      console.error('Error running visual audit:', error);
      toast.error('Failed to audit design');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-orange-500";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-green-500 to-emerald-500";
    if (score >= 60) return "from-yellow-500 to-amber-500";
    return "from-orange-500 to-red-500";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden bg-background/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            Visual Improvement Auditor
            <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded-full">
              Engine 7
            </span>
          </DialogTitle>
        </DialogHeader>

        {!audit ? (
          <div className="py-8 space-y-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                <Eye className="w-10 h-10 text-amber-500" />
              </div>
              <h3 className="text-lg font-semibold">AI Design Critique</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Get expert-level feedback on your design with actionable suggestions for improvement
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Design Goal (optional)</label>
                <Input
                  value={designGoal}
                  onChange={(e) => setDesignGoal(e.target.value)}
                  placeholder="e.g., Increase conversions, promote sale..."
                  className="bg-muted/30"
                />
              </div>

              <Button 
                onClick={runAudit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing Design...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Run Design Audit
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Overall Score */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Overall Design Score</h3>
                      <p className="text-sm text-muted-foreground">{audit.summary}</p>
                    </div>
                    <div className={`text-5xl font-bold ${getScoreColor(audit.overallScore)}`}>
                      {audit.overallScore}
                    </div>
                  </div>
                  <Progress 
                    value={audit.overallScore} 
                    className="h-3"
                  />
                </div>

                {/* Priority Fixes */}
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <h4 className="font-semibold text-red-500">Priority Fixes</h4>
                  </div>
                  <ul className="space-y-2">
                    {audit.priorityFixes.map((fix, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{fix}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quick Wins */}
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-5 h-5 text-green-500" />
                    <h4 className="font-semibold text-green-500">Quick Wins</h4>
                  </div>
                  <ul className="space-y-2">
                    {audit.quickWins.map((win, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        <span>{win}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Category Breakdown */}
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Detailed Analysis
                  </h4>
                  
                  {audit.categories.map((category, i) => (
                    <motion.div
                      key={category.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-4 rounded-xl bg-muted/30 border border-border/30"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium">{category.name}</h5>
                        <div className="flex items-center gap-2">
                          <div className={`px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getScoreGradient(category.score * 10)} text-white`}>
                            {category.score}/10
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-xs font-medium text-green-500 mb-1">✓ Strengths</p>
                          <ul className="space-y-1">
                            {category.strengths.map((s, j) => (
                              <li key={j} className="text-xs text-muted-foreground">{s}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-amber-500 mb-1">△ Improvements</p>
                          <ul className="space-y-1">
                            {category.improvements.map((s, j) => (
                              <li key={j} className="text-xs text-muted-foreground">{s}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
                        <p className="text-xs">
                          <span className="font-medium text-accent">💡 Action:</span>{" "}
                          {category.actionable}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Advanced Tips */}
                <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-violet-500" />
                    <h4 className="font-semibold text-violet-500">Advanced Recommendations</h4>
                  </div>
                  <ul className="space-y-2">
                    {audit.advancedTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Sparkles className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>
          </ScrollArea>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border/30">
          {audit && (
            <Button 
              variant="outline" 
              onClick={() => setAudit(null)}
            >
              Run New Audit
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
