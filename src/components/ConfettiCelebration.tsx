import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Sparkles, Star, Heart, Zap, Target } from "lucide-react";

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  icon: React.ReactNode;
  delay: number;
}

interface ConfettiCelebrationProps {
  isActive: boolean;
  onComplete?: () => void;
  type?: 'task-completed' | 'milestone' | 'achievement' | 'celebration';
}

const confettiTypes = {
  'task-completed': {
    colors: ['#10b981', '#3b82f6', '#8b5cf6'],
    icons: [<Target className="h-4 w-4" />, <CheckCircle className="h-4 w-4" />, <Star className="h-4 w-4" />],
    message: "Task Completed! 🎉"
  },
  'milestone': {
    colors: ['#f59e0b', '#ef4444', '#ec4899'],
    icons: [<Star className="h-4 w-4" />, <Trophy className="h-4 w-4" />, <Crown className="h-4 w-4" />],
    message: "Milestone Reached! 🏆"
  },
  'achievement': {
    colors: ['#8b5cf6', '#06b6d4', '#84cc16'],
    icons: [<Zap className="h-4 w-4" />, <Sparkles className="h-4 w-4" />, <Heart className="h-4 w-4" />],
    message: "Achievement Unlocked! ✨"
  },
  'celebration': {
    colors: ['#ec4899', '#f97316', '#eab308'],
    icons: [<Sparkles className="h-4 w-4" />, <Heart className="h-4 w-4" />, <Zap className="h-4 w-4" />],
    message: "Celebration Time! 🎊"
  }
};

// Missing icon components
const CheckCircle = ({ className }: { className: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const Trophy = ({ className }: { className: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const Crown = ({ className }: { className: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

export function ConfettiCelebration({ isActive, onComplete, type = 'celebration' }: ConfettiCelebrationProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [showMessage, setShowMessage] = useState(false);
  
  const config = confettiTypes[type];

  useEffect(() => {
    if (isActive) {
      // Generate confetti pieces
      const pieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -50 - Math.random() * 100,
        rotation: Math.random() * 360,
        scale: Math.random() * 0.5 + 0.5,
        color: config.colors[Math.floor(Math.random() * config.colors.length)],
        icon: config.icons[Math.floor(Math.random() * config.icons.length)],
        delay: Math.random() * 0.5,
      }));

      setConfetti(pieces);
      setShowMessage(true);

      // Clean up after animation
      const timer = setTimeout(() => {
        setShowMessage(false);
        setConfetti([]);
        onComplete?.();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete, config]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Celebration message */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl shadow-2xl backdrop-blur-sm border border-white/20">
              <h2 className="text-2xl font-bold text-center animate-pulse">
                {config.message}
              </h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confetti pieces */}
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute pointer-events-none"
          initial={{
            x: piece.x,
            y: piece.y,
            rotate: piece.rotation,
            scale: piece.scale,
            opacity: 0,
          }}
          animate={{
            x: piece.x + (Math.random() - 0.5) * 200,
            y: window.innerHeight + 100,
            rotate: piece.rotation + 360 * 3,
            scale: [piece.scale, piece.scale * 1.2, piece.scale * 0.8, 0],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 3,
            delay: piece.delay,
            ease: "easeOut",
          }}
          style={{
            color: piece.color,
          }}
        >
          {piece.icon}
        </motion.div>
      ))}

      {/* Background glow effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.3, 0] }}
        transition={{ duration: 4 }}
        className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20"
      />

      {/* Floating sparkles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0,
            scale: 0,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            y: [0, -50],
          }}
          transition={{
            duration: 2,
            delay: i * 0.1,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        />
      ))}

      {/* Sound wave effect */}
      <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`wave-${i}`}
            className="absolute w-4 h-4 border-2 border-blue-400 rounded-full"
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              scale: [0, 3],
              opacity: [1, 0],
            }}
            transition={{
              duration: 2,
              delay: i * 0.2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Hook for easy confetti triggering
export function useConfetti() {
  const [isActive, setIsActive] = useState(false);

  const trigger = (type: 'task-completed' | 'milestone' | 'achievement' | 'celebration' = 'celebration') => {
    setIsActive(true);
  };

  const stop = () => {
    setIsActive(false);
  };

  return { isActive, trigger, stop };
}
