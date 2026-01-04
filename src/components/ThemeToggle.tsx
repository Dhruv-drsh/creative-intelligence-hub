import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export const ThemeToggle = () => {
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
      className="relative w-14 h-7 rounded-full bg-gray-200 dark:bg-gray-700 p-1 transition-colors duration-300"
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center"
        animate={{ 
          x: isDark ? 28 : 0,
          rotate: isDark ? 360 : 0 
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {isDark ? (
          <Moon className="w-3 h-3 text-purple-600" />
        ) : (
          <Sun className="w-3 h-3 text-amber-500" />
        )}
      </motion.div>
      
      {/* Background Icons */}
      <div className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none">
        <Sun className={`w-3.5 h-3.5 transition-opacity duration-300 ${isDark ? 'opacity-30 text-gray-400' : 'opacity-0'}`} />
        <Moon className={`w-3.5 h-3.5 transition-opacity duration-300 ${isDark ? 'opacity-0' : 'opacity-30 text-gray-500'}`} />
      </div>
    </motion.button>
  );
};

export default ThemeToggle;
