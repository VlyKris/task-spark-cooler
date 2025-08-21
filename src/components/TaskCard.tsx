import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Star, Calendar, Clock } from "lucide-react";
import { useState } from "react";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  dueDate: string;
  category: string;
  starred: boolean;
}

interface TaskCardProps {
  task: Task;
  onToggleStatus: (taskId: string) => void;
  onToggleStar: (taskId: string) => void;
  index: number;
}

export function TaskCard({ task, onToggleStatus, onToggleStar, index }: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const priorityColors = {
    high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
    low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
  };

  const statusColors = {
    todo: 'text-slate-400 hover:text-blue-500',
    'in-progress': 'text-orange-400',
    completed: 'text-green-500',
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: 0.1 * index,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        scale: 1.02,
        y: -5,
        transition: { duration: 0.2 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group"
    >
      <Card className="relative overflow-hidden bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer">
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          animate={{
            background: isHovered 
              ? "linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))"
              : "linear-gradient(45deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05), rgba(236, 72, 153, 0.05))"
          }}
        />

        {/* Shimmer effect on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          animate={{
            x: isHovered ? [0, 300] : 0,
          }}
          transition={{
            duration: 1.5,
            repeat: isHovered ? Infinity : 0,
            ease: "linear"
          }}
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
            width: "100%",
            height: "100%",
          }}
        />

        <CardContent className="relative z-10 p-6">
          {/* Header with status and star */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => onToggleStatus(task.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="hover:scale-110 transition-transform duration-200"
              >
                {task.status === 'completed' ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </motion.div>
                ) : (
                  <Circle className={`h-5 w-5 ${statusColors[task.status]}`} />
                )}
              </motion.button>
              
              <motion.button
                onClick={() => onToggleStar(task.id)}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="hover:scale-110 transition-transform duration-200"
              >
                <Star className={`h-4 w-4 ${
                  task.starred ? 'text-yellow-500 fill-current' : 'text-slate-400'
                }`} />
              </motion.button>
            </div>

            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Badge
                variant="secondary"
                className={`${priorityColors[task.priority]} border transition-all duration-300 ${
                  isHovered ? 'scale-110' : 'scale-100'
                }`}
              >
                {task.priority}
              </Badge>
            </motion.div>
          </div>

          {/* Task title with animated underline */}
          <motion.h3
            className={`font-semibold text-lg mb-2 ${
              task.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'
            }`}
            whileHover={{ color: task.status === 'completed' ? undefined : '#3b82f6' }}
          >
            {task.title}
            {isHovered && task.status !== 'completed' && (
              <motion.div
                className="h-0.5 bg-blue-500 mt-1"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.h3>
          
          {/* Task description */}
          <motion.p
            className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2"
            animate={{
              color: isHovered ? 'rgb(59 130 246)' : undefined
            }}
            transition={{ duration: 0.3 }}
          >
            {task.description}
          </motion.p>

          {/* Footer with date and category */}
          <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
            <motion.div 
              className="flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
            >
              <Calendar className="h-4 w-4" />
              <span className={isOverdue ? 'text-red-500 font-medium' : ''}>
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
              {isOverdue && (
                <motion.span
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="ml-1 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full"
                >
                  Overdue
                </motion.span>
              )}
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
            >
              <Badge 
                variant="outline" 
                className="text-xs border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-400 transition-colors duration-300"
              >
                {task.category}
              </Badge>
            </motion.div>
          </div>

          {/* Progress indicator for in-progress tasks */}
          {task.status === 'in-progress' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4"
            >
              <div className="flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400">
                <Clock className="h-3 w-3" />
                <span>In Progress</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1 mt-1">
                <motion.div
                  className="bg-gradient-to-r from-orange-400 to-orange-600 h-1 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "60%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </motion.div>
          )}
        </CardContent>

        {/* Corner accent */}
        <motion.div
          className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-bl-full"
          animate={{
            opacity: isHovered ? 0.3 : 0.1,
          }}
          transition={{ duration: 0.3 }}
        />
      </Card>
    </motion.div>
  );
}
