import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, Command, Sparkles } from "lucide-react";

interface VoiceCommandsProps {
  onCommand: (command: string) => void;
  isEnabled?: boolean;
}

interface VoiceCommand {
  phrase: string;
  action: string;
  description: string;
}

const voiceCommands: VoiceCommand[] = [
  { phrase: "add task", action: "add", description: "Add a new task" },
  { phrase: "complete task", action: "complete", description: "Mark task as complete" },
  { phrase: "show tasks", action: "show", description: "Display all tasks" },
  { phrase: "search tasks", action: "search", description: "Search through tasks" },
  { phrase: "toggle view", action: "toggle", description: "Switch between grid and 3D view" },
  { phrase: "celebrate", action: "celebrate", description: "Trigger celebration mode" },
];

export function VoiceCommands({ onCommand, isEnabled = true }: VoiceCommandsProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);

        // Process final transcript
        if (finalTranscript) {
          const command = finalTranscript.toLowerCase().trim();
          const matchedCommand = voiceCommands.find(cmd => 
            command.includes(cmd.phrase.toLowerCase())
          );

          if (matchedCommand) {
            onCommand(matchedCommand.action);
            // Trigger success animation
            setIsListening(false);
            setTimeout(() => setTranscript(""), 2000);
          }
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [onCommand]);

  const startListening = () => {
    if (recognitionRef.current && isSupported) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setTranscript("");
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isEnabled || !isSupported) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Voice Commands Help */}
      <AnimatePresence>
        {showCommands && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute bottom-full left-0 mb-4 w-80 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Command className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Voice Commands</h3>
            </div>
            
            <div className="space-y-3">
              {voiceCommands.map((cmd, index) => (
                <motion.div
                  key={cmd.phrase}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white text-sm">
                      "{cmd.phrase}"
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {cmd.description}
                    </p>
                  </div>
                  <Sparkles className="h-4 w-4 text-blue-400" />
                </motion.div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
                💡 Try saying "add task" or "complete task" to get started!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Voice Button */}
      <motion.button
        onClick={toggleListening}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative group"
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"
          animate={{
            scale: isListening ? [1, 1.3, 1] : 1,
          }}
          transition={{
            duration: 2,
            repeat: isListening ? Infinity : 0,
            ease: "easeInOut",
          }}
        />

        {/* Main button */}
        <motion.div
          className={`relative w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 backdrop-blur-sm border border-white/20 ${
            isListening 
              ? 'bg-gradient-to-r from-red-500 to-pink-500' 
              : 'bg-gradient-to-r from-blue-500 to-purple-600'
          }`}
          animate={{
            scale: isListening ? [1, 1.05, 1] : 1,
          }}
          transition={{
            duration: 1,
            repeat: isListening ? Infinity : 0,
            ease: "easeInOut",
          }}
        >
          <AnimatePresence mode="wait">
            {isListening ? (
              <motion.div
                key="listening"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <MicOff className="h-8 w-8" />
              </motion.div>
            ) : (
              <motion.div
                key="not-listening"
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: -180 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Mic className="h-8 w-8" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Ripple effect when listening */}
        <AnimatePresence>
          {isListening && (
            <>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0.6 }}
                  animate={{ scale: 2, opacity: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                  className="absolute inset-0 w-16 h-16 border-2 border-red-400 rounded-full"
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Floating particles when listening */}
        <AnimatePresence>
          {isListening && (
            <>
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-blue-400 rounded-full"
                  style={{
                    left: "50%",
                    top: "50%",
                  }}
                  animate={{
                    x: [0, Math.cos((i * 45 * Math.PI) / 180) * 50],
                    y: [0, Math.sin((i * 45 * Math.PI) / 180) * 50],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeOut",
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Help button */}
      <motion.button
        onClick={() => setShowCommands(!showCommands)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="absolute -top-2 -right-2 w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <Command className="h-4 w-4 text-slate-600 dark:text-slate-400" />
      </motion.button>

      {/* Transcript display */}
      <AnimatePresence>
        {transcript && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute bottom-full left-0 mb-4 w-80 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Volume2 className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Heard:
              </span>
            </div>
            <p className="text-slate-900 dark:text-white font-medium">
              "{transcript}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
