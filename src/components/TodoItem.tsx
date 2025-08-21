import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { motion } from "framer-motion";
import { Check, Edit2, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";

interface TodoItemProps {
  id: Id<"todos">;
  text: string;
  completed: boolean;
}

export function TodoItem({ id, text, completed }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  
  const toggleTodo = useMutation(api.todos.toggle);
  const updateTodo = useMutation(api.todos.update);
  const removeTodo = useMutation(api.todos.remove);

  const handleToggle = async () => {
    try {
      await toggleTodo({ id });
      toast(completed ? "Todo marked as incomplete" : "Todo completed!");
    } catch (error) {
      toast.error("Failed to update todo");
    }
  };

  const handleUpdate = async () => {
    if (editText.trim() === "") {
      toast.error("Todo text cannot be empty");
      return;
    }
    
    try {
      await updateTodo({ id, text: editText.trim() });
      setIsEditing(false);
      toast("Todo updated successfully");
    } catch (error) {
      toast.error("Failed to update todo");
    }
  };

  const handleDelete = async () => {
    try {
      await removeTodo({ id });
      toast("Todo deleted");
    } catch (error) {
      toast.error("Failed to delete todo");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleUpdate();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditText(text);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-center gap-3 p-4 bg-card rounded-md border-2 border-black group transition-all duration-200 shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000]"
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        className={`p-1 h-6 w-6 rounded-full border-2 transition-colors ${
          completed
            ? "bg-primary border-primary text-primary-foreground"
            : "border-muted-foreground hover:border-primary"
        }`}
      >
        {completed && <Check className="h-3 w-3" />}
      </Button>

      <div className="flex-1">
        {isEditing ? (
          <Input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyPress}
            onBlur={handleUpdate}
            className="h-8 text-sm"
            autoFocus
          />
        ) : (
          <span
            className={`text-sm cursor-pointer ${
              completed
                ? "line-through text-muted-foreground"
                : "text-foreground"
            }`}
            onClick={() => setIsEditing(true)}
          >
            {text}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {isEditing ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUpdate}
              className="h-8 w-8 p-0"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsEditing(false);
                setEditText(text);
              }}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8 p-0"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </motion.div>
  );
}