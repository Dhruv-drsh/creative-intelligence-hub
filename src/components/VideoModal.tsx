import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoModal = ({ isOpen, onClose }: VideoModalProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  }, [isOpen]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-5xl bg-gradient-to-br from-gray-900 to-gray-950 rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <motion.button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* Video Container */}
            <div className="relative aspect-video bg-black">
              {/* Placeholder demo content - replace with actual video */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-900/50 to-purple-900/50 flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-24 h-24 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-teal-500/30"
                  >
                    <Play className="w-10 h-10 text-white ml-1" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-2">Product Demo</h3>
                  <p className="text-gray-300">See Creato-Sphere in action</p>
                </div>
              </div>

              {/* Demo Animation Showcase */}
              <div className="absolute inset-0 overflow-hidden">
                <motion.div 
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {/* Animated UI mockup */}
                  <div className="absolute top-8 left-8 right-8 bottom-8 bg-gray-900/80 rounded-2xl overflow-hidden border border-gray-700/50">
                    {/* Top bar */}
                    <div className="h-12 bg-gray-800/80 border-b border-gray-700/50 flex items-center px-4 gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      </div>
                      <div className="flex-1 mx-4">
                        <div className="h-7 bg-gray-700/50 rounded-lg max-w-md"></div>
                      </div>
                    </div>
                    
                    {/* Content area */}
                    <div className="flex h-[calc(100%-3rem)]">
                      {/* Left sidebar */}
                      <motion.div 
                        className="w-16 bg-gray-800/50 border-r border-gray-700/50 p-2 space-y-3"
                        initial={{ x: -100 }}
                        animate={{ x: 0 }}
                        transition={{ delay: 0.8, type: "spring" }}
                      >
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-full aspect-square bg-gray-700/50 rounded-lg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 + i * 0.1 }}
                          />
                        ))}
                      </motion.div>
                      
                      {/* Canvas area */}
                      <div className="flex-1 p-4 flex items-center justify-center">
                        <motion.div 
                          className="w-3/4 aspect-square bg-white rounded-xl shadow-2xl overflow-hidden"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 1.2, type: "spring" }}
                        >
                          <div className="h-full bg-gradient-to-br from-teal-100 to-cyan-100 p-8 flex flex-col items-center justify-center">
                            <motion.div
                              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 mb-4"
                              animate={{ rotate: [0, 10, -10, 0] }}
                              transition={{ duration: 4, repeat: Infinity }}
                            />
                            <motion.div 
                              className="h-4 bg-gray-300 rounded w-32 mb-2"
                              initial={{ width: 0 }}
                              animate={{ width: 128 }}
                              transition={{ delay: 1.8, duration: 0.5 }}
                            />
                            <motion.div 
                              className="h-3 bg-gray-200 rounded w-24"
                              initial={{ width: 0 }}
                              animate={{ width: 96 }}
                              transition={{ delay: 2, duration: 0.5 }}
                            />
                          </div>
                        </motion.div>
                      </div>
                      
                      {/* Right panel */}
                      <motion.div 
                        className="w-48 bg-gray-800/50 border-l border-gray-700/50 p-3 space-y-3"
                        initial={{ x: 100 }}
                        animate={{ x: 0 }}
                        transition={{ delay: 0.8, type: "spring" }}
                      >
                        <div className="text-xs text-gray-400 mb-2">AI Tools</div>
                        {["Brand DNA", "AutoLayout", "Compliance"].map((tool, i) => (
                          <motion.div
                            key={tool}
                            className="p-2 bg-gray-700/30 rounded-lg"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.5 + i * 0.2 }}
                          >
                            <div className="text-xs text-white">{tool}</div>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Custom Video Controls */}
            <div className="p-4 bg-gradient-to-t from-gray-900 to-gray-900/80">
              {/* Progress bar */}
              <div 
                className="h-1.5 bg-gray-700 rounded-full mb-4 cursor-pointer overflow-hidden"
                onClick={handleProgressClick}
              >
                <motion.div 
                  className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "75%" }}
                  transition={{ duration: 5, ease: "linear" }}
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={togglePlay}
                    className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-teal-500/25"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </motion.button>
                  <motion.button
                    onClick={toggleMute}
                    className="w-10 h-10 rounded-full bg-gray-700/50 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </motion.button>
                  <span className="text-sm text-gray-400">2:34 / 3:15</span>
                </div>
                
                <motion.button
                  className="w-10 h-10 rounded-full bg-gray-700/50 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Maximize className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
