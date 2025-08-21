import { api } from "@/convex/_generated/api";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Circle, ListTodo } from "lucide-react";
import { useState } from "react";
import { useQuery } from "convex/react";
import { Button } from "@/components/ui/button";
import { TodoItem } from "./TodoItem";

type FilterType = "all" | "active" | "completed";

export function TodoList() {
  const todos = useQuery(api.todos.list) ?? [];
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const completedCount = todos.filter((todo) => todo.completed).length;
  const activeCount = todos.length - completedCount;

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
          className="gap-2"
        >
          <ListTodo className="h-4 w-4" />
          All ({todos.length})
        </Button>
        <Button
          variant={filter === "active" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("active")}
          className="gap-2"
        >
          <Circle className="h-4 w-4" />
          Active ({activeCount})
        </Button>
        <Button
          variant={filter === "completed" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("completed")}
          className="gap-2"
        >
          <CheckCircle2 className="h-4 w-4" />
          Completed ({completedCount})
        </Button>
      </div>

      {/* Todo Items */}
      <div className="space-y-2">
        <AnimatePresence>
          {filteredTodos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-muted-foreground"
            >
              <ListTodo className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">
                {filter === "all" && "No todos yet"}
                {filter === "active" && "No active todos"}
                {filter === "completed" && "No completed todos"}
              </p>
              <p className="text-sm">
                {filter === "all" && "Create your first todo to get started!"}
                {filter === "active" && "All your todos are completed!"}
                {filter === "completed" && "Complete some todos to see them here."}
              </p>
            </motion.div>
          ) : (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo._id}
                id={todo._id}
                text={todo.text}
                completed={todo.completed}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
