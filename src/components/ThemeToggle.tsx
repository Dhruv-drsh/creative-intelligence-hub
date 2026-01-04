import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export const ThemeToggle = ({ className = "" }: { className?: string }) => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') || 
        localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <motion.button
      onClick={() => setIsDark(!isDark)}
      className={`relative w-12 h-6 sm:w-14 sm:h-7 rounded-full bg-secondary dark:bg-muted p-0.5 sm:p-1 border border-border/50 transition-colors duration-300 ${className}`}
      whileTap={{ scale: 0.95 }}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <motion.div
        className="absolute top-0.5 sm:top-1 w-5 h-5 rounded-full bg-background shadow-md flex items-center justify-center border border-border/30"
        animate={{ 
          x: isDark ? 22 : 2,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <motion.div
          animate={{ rotate: isDark ? 360 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {isDark ? (
            <Moon className="w-3 h-3 text-accent" />
          ) : (
            <Sun className="w-3 h-3 text-amber-500" />
          )}
        </motion.div>
      </motion.div>
      
      {/* Background Icons */}
      <div className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none">
        <Sun className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-opacity duration-300 ${isDark ? 'opacity-40 text-muted-foreground' : 'opacity-0'}`} />
        <Moon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-opacity duration-300 ${isDark ? 'opacity-0' : 'opacity-40 text-muted-foreground'}`} />
      </div>
    </motion.button>
  );
};

export default ThemeToggle;
