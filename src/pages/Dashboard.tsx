import { Protected } from "@/lib/protected-page";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Star,
  TrendingUp,
  Users,
  Target,
  Zap,
  Eye,
  Grid3X3
} from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Box, MeshDistortMaterial } from "@react-three/drei";
import { Suspense } from "react";
import { TaskCard } from "@/components/TaskCard";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { TaskVisualization3D } from "@/components/TaskVisualization3D";
import { ConfettiCelebration, useConfetti } from "@/components/ConfettiCelebration";
import { VoiceCommands } from "@/components/VoiceCommands";

// 3D Floating Cube Component
function FloatingCube() {
  return (
    <Box args={[1, 1, 1]} scale={0.5}>
      <MeshDistortMaterial
        color="#8b5cf6"
        attach="material"
        distort={0.2}
        speed={1}
        roughness={0.1}
      />
    </Box>
  );
}

// Task Interface
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

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Design new landing page',
      description: 'Create a modern and responsive landing page design with advanced animations and 3D elements',
      priority: 'high',
      status: 'in-progress',
      dueDate: '2024-01-15',
      category: 'Design',
      starred: true,
    },
    {
      id: '2',
      title: 'Implement authentication system',
      description: 'Set up user authentication with JWT tokens and secure password handling',
      priority: 'high',
      status: 'todo',
      dueDate: '2024-01-20',
      category: 'Development',
      starred: false,
    },
    {
      id: '3',
      title: 'Write API documentation',
      description: 'Document all API endpoints and usage examples with interactive examples',
      priority: 'medium',
      status: 'completed',
      dueDate: '2024-01-10',
      category: 'Documentation',
      starred: true,
    },
    {
      id: '4',
      title: 'Setup CI/CD pipeline',
      description: 'Configure automated testing and deployment with GitHub Actions',
      priority: 'medium',
      status: 'todo',
      dueDate: '2024-01-25',
      category: 'DevOps',
      starred: false,
    },
    {
      id: '5',
      title: 'Optimize database queries',
      description: 'Analyze and optimize slow database queries for better performance',
      priority: 'low',
      status: 'todo',
      dueDate: '2024-01-30',
      category: 'Development',
      starred: true,
    },
    {
      id: '6',
      title: 'Create user onboarding flow',
      description: 'Design and implement a smooth user onboarding experience',
      priority: 'high',
      status: 'in-progress',
      dueDate: '2024-01-18',
      category: 'UX',
      starred: false,
    },
  ]);

  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | '3d'>('grid');
  const [showQuickActions, setShowQuickActions] = useState(false);

  // Confetti hook
  const { isActive: confettiActive, trigger: triggerConfetti } = useConfetti();

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask,
        description: 'New task description - click to edit',
        priority: 'medium',
        status: 'todo',
        dueDate: new Date().toISOString().split('T')[0],
        category: 'General',
        starred: false,
      };
      setTasks([...tasks, task]);
      setNewTask('');
      
      // Trigger confetti for new task
      triggerConfetti('celebration');
    }
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === 'completed' ? 'todo' : 'completed';
        
        // Trigger confetti for completed tasks
        if (newStatus === 'completed') {
          triggerConfetti('task-completed');
        }
        
        return { ...task, status: newStatus };
      }
      return task;
    }));
  };

  const toggleStar = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, starred: !task.starred }
        : task
    ));
  };

  const handleQuickActions = () => {
    setShowQuickActions(!showQuickActions);
    triggerConfetti('achievement');
  };

  const handleTaskSelect = (taskId: string) => {
    // Find and highlight the selected task
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      console.log('Selected task:', task.title);
      // You could open a modal or navigate to task details here
    }
  };

  const handleVoiceCommand = (command: string) => {
    switch (command) {
      case 'add':
        // Focus on the add task input
        document.querySelector('input[placeholder="Add a new task..."]')?.focus();
        break;
      case 'complete':
        // Complete the first incomplete task
        const incompleteTask = tasks.find(t => t.status !== 'completed');
        if (incompleteTask) {
          toggleTaskStatus(incompleteTask.id);
        }
        break;
      case 'show':
        setFilter('all');
        break;
      case 'search':
        document.querySelector('input[placeholder="Search tasks..."]')?.focus();
        break;
      case 'toggle':
        setViewMode(viewMode === 'grid' ? '3d' : 'grid');
        break;
      case 'celebrate':
        triggerConfetti('celebration');
        break;
      default:
        break;
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || task.status === filter;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    todo: tasks.filter(t => t.status === 'todo').length,
    starred: tasks.filter(t => t.starred).length,
  };

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  // Check for milestones
  if (stats.completed > 0 && stats.completed % 5 === 0) {
    // Trigger milestone confetti every 5 completed tasks
    setTimeout(() => triggerConfetti('milestone'), 1000);
  }

  return (
    <Protected>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 relative">
        <AnimatedBackground />
        
        {/* Confetti Celebration */}
        <ConfettiCelebration 
          isActive={confettiActive} 
          type="celebration"
        />
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div 
                  className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Zap className="h-6 w-6 text-white" />
                </motion.div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Task Spark
                </h1>
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex items-center gap-4">
                <div className="flex bg-white/60 dark:bg-slate-700/60 rounded-lg p-1 backdrop-blur-sm">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={`${viewMode === 'grid' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'text-slate-600 dark:text-slate-400'}`}
                  >
                    <Grid3X3 className="h-4 w-4 mr-2" />
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === '3d' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('3d')}
                    className={`${viewMode === '3d' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'text-slate-600 dark:text-slate-400'}`}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    3D View
                  </Button>
                </div>
                
                {/* 3D Floating Cube */}
                <div className="w-16 h-16 opacity-60">
                  <Canvas camera={{ position: [0, 0, 3] }}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[5, 5, 5]} intensity={1} />
                    <Suspense fallback={null}>
                      <FloatingCube />
                      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
                    </Suspense>
                  </Canvas>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8"
          >
            <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Tasks</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Completed</p>
                    <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">In Progress</p>
                    <p className="text-3xl font-bold text-orange-600">{stats.inProgress}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                    <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">To Do</p>
                    <p className="text-3xl font-bold text-slate-600 dark:text-slate-400">{stats.todo}</p>
                  </div>
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                    <Circle className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Starred</p>
                    <p className="text-3xl font-bold text-yellow-600">{stats.starred}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                    <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Progress Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Progress Overview</h3>
                  <span className="text-2xl font-bold text-blue-600">{completionRate}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${completionRate}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  {stats.completed} of {stats.total} tasks completed
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Add Task Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Input
                    placeholder="Add a new task..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                    className="flex-1 bg-white/50 dark:bg-slate-700/50 border-0 focus:ring-2 focus:ring-blue-500"
                  />
                  <Button
                    onClick={addTask}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 hover:scale-105 transition-transform duration-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 mb-6"
          >
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/50 dark:bg-slate-700/50 border-0 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              {['all', 'todo', 'in-progress', 'completed'].map((filterOption) => (
                <Button
                  key={filterOption}
                  variant={filter === filterOption ? "default" : "outline"}
                  onClick={() => setFilter(filterOption)}
                  className={`capitalize ${
                    filter === filterOption
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'bg-white/60 dark:bg-slate-800/60 hover:bg-white/80 dark:hover:bg-slate-700/80'
                  }`}
                >
                  {filterOption.replace('-', ' ')}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Task View */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {viewMode === '3d' ? (
              <TaskVisualization3D 
                tasks={filteredTasks}
                onTaskSelect={handleTaskSelect}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTasks.map((task, index) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleStatus={toggleTaskStatus}
                    onToggleStar={toggleStar}
                    index={index}
                  />
                ))}
              </div>
            )}
          </motion.div>

          {/* Empty State */}
          {filteredTasks.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
                No tasks found
              </h3>
              <p className="text-slate-500 dark:text-slate-500">
                {filter === 'all' ? 'Create your first task to get started!' : `No ${filter} tasks available.`}
              </p>
            </motion.div>
          )}
        </div>

        {/* Floating Action Button */}
        <FloatingActionButton
          onAddTask={addTask}
          onQuickActions={handleQuickActions}
        />

        {/* Voice Commands */}
        <VoiceCommands onCommand={handleVoiceCommand} />
      </div>
    </Protected>
  );
}
