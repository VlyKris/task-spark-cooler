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
        className="flex-1 h-12 rounded-md border-2 border-black focus:ring-2 focus:ring-ring focus:ring-offset-2"
        disabled={isLoading}
      />
      <Button
        type="submit"
        disabled={isLoading || text.trim() === ""}
        className="h-12 rounded-md border-2 border-black bg-primary text-primary-foreground font-bold shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] active:shadow-[2px_2px_0px_#000] transition-all duration-200"
      >
        <Plus className="h-5 w-5" />
      </Button>
    </motion.form>
  );
}