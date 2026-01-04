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
      className={`relative w-12 h-6 sm:w-14 sm:h-7 rounded-full p-0.5 sm:p-1 border transition-all duration-500 ${
        isDark 
          ? 'bg-gradient-to-r from-accent/20 to-highlight/20 border-accent/40 shadow-[0_0_12px_rgba(45,212,191,0.3)]' 
          : 'bg-secondary border-border/50 shadow-sm'
      } ${className}`}
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.02 }}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <motion.div
        className={`absolute top-0.5 sm:top-1 w-5 h-5 rounded-full shadow-lg flex items-center justify-center border transition-all duration-500 ${
          isDark 
            ? 'bg-gradient-to-br from-accent to-highlight border-accent/50 shadow-accent/40' 
            : 'bg-white border-amber-200 shadow-amber-200/50'
        }`}
        animate={{ 
          x: isDark ? 22 : 2,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <motion.div
          animate={{ rotate: isDark ? 360 : 0, scale: [1, 1.1, 1] }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          {isDark ? (
            <Moon className="w-3 h-3 text-white" />
          ) : (
            <Sun className="w-3 h-3 text-amber-500" />
          )}
        </motion.div>
      </motion.div>
      
      {/* Background Icons */}
      <div className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none">
        <motion.div animate={{ opacity: isDark ? 0.5 : 0, scale: isDark ? 1 : 0.8 }}>
          <Sun className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
        </motion.div>
        <motion.div animate={{ opacity: isDark ? 0 : 0.5, scale: isDark ? 0.8 : 1 }}>
          <Moon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-accent" />
        </motion.div>
      </div>
    </motion.button>
  );
};

export default ThemeToggle;
