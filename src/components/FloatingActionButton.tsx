import { motion, AnimatePresence } from "framer-motion";
import { Plus, Sparkles, Zap, Target } from "lucide-react";
import { useState } from "react";

interface FloatingActionButtonProps {
  onAddTask: () => void;
  onQuickActions: () => void;
}

export function FloatingActionButton({ onAddTask, onQuickActions }: FloatingActionButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const quickActions = [
    { icon: <Target className="h-5 w-5" />, label: "Quick Task", action: onAddTask },
    { icon: <Zap className="h-5 w-5" />, label: "Lightning", action: onQuickActions },
    { icon: <Sparkles className="h-5 w-5" />, label: "Magic", action: onQuickActions },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Background particles */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute inset-0 w-32 h-32 -translate-x-16 -translate-y-16"
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                style={{
                  left: "50%",
                  top: "50%",
                }}
                animate={{
                  x: [0, Math.cos((i * 45 * Math.PI) / 180) * 60],
                  y: [0, Math.sin((i * 45 * Math.PI) / 180) * 60],
                  opacity: [1, 0],
                  scale: [1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick action buttons */}
      <AnimatePresence>
        {isExpanded && (
          <div className="absolute bottom-full right-0 mb-4 space-y-3">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, scale: 0, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0, x: 20 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: index * 0.1,
                }}
                onClick={action.action}
                className="group relative"
              >
                {/* Tooltip */}
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-slate-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  {action.label}
                  <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-l-slate-900 border-t-4 border-t-transparent border-b-4 border-b-transparent" />
                </motion.div>

                {/* Action button */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
                >
                  {action.icon}
                </motion.div>
              </motion.button>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative group"
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"
          animate={{
            scale: isHovered ? [1, 1.2, 1] : 1,
          }}
          transition={{
            duration: 2,
            repeat: isHovered ? Infinity : 0,
            ease: "easeInOut",
          }}
        />

        {/* Main button */}
        <motion.div
          className="relative w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 backdrop-blur-sm border border-white/20"
          animate={{
            rotate: isExpanded ? 45 : 0,
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
        >
          <motion.div
            animate={{
              rotate: isExpanded ? -45 : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
          >
            <Plus className="h-8 w-8" />
          </motion.div>
        </motion.div>

        {/* Ripple effect */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 w-16 h-16 border-2 border-blue-400 rounded-full"
            />
          )}
        </AnimatePresence>

        {/* Floating particles around the button */}
        <AnimatePresence>
          {isHovered && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-blue-400 rounded-full"
                  style={{
                    left: "50%",
                    top: "50%",
                  }}
                  animate={{
                    x: [0, Math.cos((i * 60 * Math.PI) / 180) * 40],
                    y: [0, Math.sin((i * 60 * Math.PI) / 180) * 40],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
