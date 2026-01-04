import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ContentSkeletonProps {
  variant?: "card" | "list" | "text" | "avatar" | "image";
  count?: number;
  className?: string;
}

const Shimmer = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "relative overflow-hidden bg-muted/40 rounded-lg",
      "before:absolute before:inset-0 before:-translate-x-full",
      "before:animate-[shimmer_2s_infinite]",
      "before:bg-gradient-to-r before:from-transparent before:via-muted/60 before:to-transparent",
      className
    )}
  />
);

export const ContentSkeleton = ({ variant = "card", count = 1, className }: ContentSkeletonProps) => {
  const items = [...Array(count)];

  if (variant === "card") {
    return (
      <div className={cn("grid gap-4", className)}>
        {items.map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-border/30 p-4 space-y-3 bg-card/50"
          >
            <Shimmer className="h-32 w-full rounded-lg" />
            <Shimmer className="h-4 w-3/4" />
            <Shimmer className="h-3 w-1/2" />
          </motion.div>
        ))}
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className={cn("space-y-3", className)}>
        {items.map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 p-3 rounded-lg border border-border/20 bg-card/30"
          >
            <Shimmer className="w-10 h-10 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <Shimmer className="h-4 w-2/3" />
              <Shimmer className="h-3 w-1/3" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (variant === "text") {
    return (
      <div className={cn("space-y-2", className)}>
        {items.map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.03 }}
          >
            <Shimmer className="h-4 w-full" />
          </motion.div>
        ))}
      </div>
    );
  }

  if (variant === "avatar") {
    return (
      <div className={cn("flex gap-3", className)}>
        {items.map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <Shimmer className="w-10 h-10 rounded-full" />
          </motion.div>
        ))}
      </div>
    );
  }

  if (variant === "image") {
    return (
      <div className={cn("grid grid-cols-2 gap-4", className)}>
        {items.map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Shimmer className="aspect-square rounded-xl" />
          </motion.div>
        ))}
      </div>
    );
  }

  return null;
};

export default ContentSkeleton;
