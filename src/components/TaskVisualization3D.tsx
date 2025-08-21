import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, Box, Sphere, Cylinder } from "@react-three/drei";
import { Suspense, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Task3D {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  position: [number, number, number];
  rotation: [number, number, number];
}

interface TaskVisualization3DProps {
  tasks: Array<{
    id: string;
    title: string;
    priority: 'low' | 'medium' | 'high';
    status: 'todo' | 'in-progress' | 'completed';
  }>;
  onTaskSelect: (taskId: string) => void;
}

// 3D Task Card Component
function TaskCard3D({ task, onSelect }: { task: Task3D; onSelect: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const priorityColors = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#10b981',
  };

  const statusShapes = {
    todo: 'box',
    'in-progress': 'sphere',
    completed: 'cylinder',
  };

  const shape = statusShapes[task.status];
  const color = priorityColors[task.priority];

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = task.position[1] + Math.sin(state.clock.elapsedTime + task.id.charCodeAt(0)) * 0.1;
      
      // Slow rotation
      meshRef.current.rotation.x = task.rotation[0] + state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.y = task.rotation[1] + state.clock.elapsedTime * 0.15;
    }
  });

  const renderShape = () => {
    const commonProps = {
      ref: meshRef,
      onClick: onSelect,
      onPointerOver: () => setHovered(true),
      onPointerOut: () => setHovered(false),
      position: task.position,
      rotation: task.rotation,
    };

    switch (shape) {
      case 'box':
        return (
          <Box
            {...commonProps}
            args={[1, 0.1, 1.5]}
            scale={hovered ? 1.2 : 1}
          >
            <meshStandardMaterial
              color={color}
              transparent
              opacity={0.8}
              metalness={0.5}
              roughness={0.2}
            />
          </Box>
        );
      case 'sphere':
        return (
          <Sphere
            {...commonProps}
            args={[0.6, 16, 16]}
            scale={hovered ? 1.2 : 1}
          >
            <meshStandardMaterial
              color={color}
              transparent
              opacity={0.8}
              metalness={0.3}
              roughness={0.4}
            />
          </Sphere>
        );
      case 'cylinder':
        return (
          <Cylinder
            {...commonProps}
            args={[0.5, 0.5, 0.2, 8]}
            scale={hovered ? 1.2 : 1}
          >
            <meshStandardMaterial
              color={color}
              transparent
              opacity={0.8}
              metalness={0.7}
              roughness={0.1}
            />
          </Cylinder>
        );
      default:
        return null;
    }
  };

  return (
    <group>
      {renderShape()}
      
      {/* Task title text */}
      <Text
        position={[task.position[0], task.position[1] + 1, task.position[2]]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={2}
        textAlign="center"
      >
        {task.title}
      </Text>

      {/* Priority indicator */}
      <Sphere
        position={[task.position[0] - 0.8, task.position[1] + 0.5, task.position[2]]}
        args={[0.1, 8, 8]}
      >
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 0.5 : 0.2} />
      </Sphere>

      {/* Hover effect - glowing ring */}
      {hovered && (
        <motion.mesh
          position={[task.position[0], task.position[1] - 0.1, task.position[2]]}
          scale={0}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <ringGeometry args={[1.2, 1.4, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </motion.mesh>
      )}
    </group>
  );
}

// Floating particles in 3D space
function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  const particleCount = 100;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

    colors[i * 3] = Math.random() * 0.5 + 0.5; // Blue
    colors[i * 3 + 1] = Math.random() * 0.3 + 0.7; // Purple
    colors[i * 3 + 2] = Math.random() * 0.5 + 0.5; // Pink
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export function TaskVisualization3D({ tasks, onTaskSelect }: TaskVisualization3DProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Convert tasks to 3D positions in a spiral pattern
  const tasks3D: Task3D[] = tasks.map((task, index) => {
    const angle = (index / tasks.length) * Math.PI * 4; // 2 full rotations
    const radius = 3 + (index * 0.5);
    const height = (index % 3) * 2 - 2; // Stack in 3 layers

    return {
      ...task,
      position: [
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius,
      ],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      ],
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, type: "spring" }}
      className="w-full h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 shadow-2xl"
    >
      <Canvas
        camera={{ position: [0, 5, 10], fov: 60 }}
        onCreated={() => setIsVisible(true)}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} color="#8b5cf6" />
          <pointLight position={[10, -10, 5]} intensity={0.5} color="#ec4899" />

          {/* Floating particles */}
          <FloatingParticles />

          {/* Task cards */}
          {isVisible && tasks3D.map((task) => (
            <TaskCard3D
              key={task.id}
              task={task}
              onSelect={() => onTaskSelect(task.id)}
            />
          ))}

          {/* Camera controls */}
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={0.5}
            maxDistance={20}
            minDistance={5}
          />
        </Suspense>
      </Canvas>

      {/* Overlay controls */}
      <div className="absolute top-4 left-4 bg-black/20 backdrop-blur-sm rounded-lg p-3 text-white">
        <h3 className="font-semibold text-sm mb-2">3D Task View</h3>
        <div className="text-xs space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span>High Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <span>Medium Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span>Low Priority</span>
          </div>
        </div>
      </div>

      {/* Status legend */}
      <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm rounded-lg p-3 text-white">
        <h3 className="font-semibold text-sm mb-2">Status</h3>
        <div className="text-xs space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-500 rounded" />
            <span>To Do</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full" />
            <span>In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span>Completed</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
