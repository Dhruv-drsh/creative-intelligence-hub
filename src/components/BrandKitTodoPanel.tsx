import { motion, AnimatePresence } from "framer-motion";
import { Check, Clock, AlertCircle, ListTodo } from "lucide-react";
import { useUnifiedAIState, type TodoItem } from "@/hooks/useUnifiedAIState";
import { cn } from "@/lib/utils";

interface BrandKitTodoPanelProps {
  className?: string;
}

export function BrandKitTodoPanel({ className }: BrandKitTodoPanelProps) {
  const { todos, updateTodo } = useUnifiedAIState();
  
  const getStatusIcon = (status: TodoItem['status']) => {
    switch (status) {
      case 'done':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'missing':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };
  
  const getStatusStyles = (status: TodoItem['status']) => {
    switch (status) {
      case 'done':
        return 'bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-700 dark:text-yellow-400';
      case 'missing':
        return 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400';
    }
  };
  
  const completedCount = todos.filter(t => t.status === 'done').length;
  const totalCount = todos.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);
  
  return (
    <div className={cn("p-4 rounded-xl bg-muted/30 border border-border/50", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ListTodo className="w-4 h-4 text-accent" />
          <h4 className="text-sm font-semibold">Brand Checklist</h4>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-20 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-accent to-green-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-xs text-muted-foreground">{progressPercent}%</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {todos.map((todo) => (
            <motion.div
              key={todo.id}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={cn(
                "flex items-center gap-3 p-2 rounded-lg border transition-all cursor-pointer hover:scale-[1.02]",
                getStatusStyles(todo.status)
              )}
              onClick={() => {
                // Cycle through statuses on click
                const nextStatus: TodoItem['status'] = 
                  todo.status === 'missing' ? 'pending' :
                  todo.status === 'pending' ? 'done' : 'missing';
                updateTodo(todo.id, nextStatus);
              }}
            >
              <div className="flex-shrink-0">
                {getStatusIcon(todo.status)}
              </div>
              <span className={cn(
                "text-xs font-medium flex-1",
                todo.status === 'done' && "line-through opacity-70"
              )}>
                {todo.label}
              </span>
              <span className="text-[10px] opacity-50 capitalize">{todo.category}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
