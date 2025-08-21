import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";

export function AddTodo() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const createTodo = useMutation(api.todos.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (text.trim() === "") {
      toast.error("Please enter a todo");
      return;
    }

    setIsLoading(true);
    try {
      await createTodo({ text: text.trim() });
      setText("");
      toast("Todo created successfully!");
    } catch (error) {
      toast.error("Failed to create todo");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="flex gap-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What needs to be done?"
        className="flex-1"
        disabled={isLoading}
      />
      <Button type="submit" disabled={isLoading || text.trim() === ""}>
        <Plus className="h-4 w-4" />
      </Button>
    </motion.form>
  );
}
