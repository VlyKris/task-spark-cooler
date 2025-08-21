// TODO: THIS IS THE DEFAULT DASHBOARD PAGE THAT THE USER WILL SEE AFTER AUTHENTICATION. ADD MAIN FUNCTIONALITY HERE.
// This is the entry point for users who have just signed in

import { AddTodo } from "@/components/AddTodo";
import { TodoList } from "@/components/TodoList";
import { UserButton } from "@/components/auth/UserButton";
import { useAuth } from "@/hooks/use-auth";
import { Protected } from "@/lib/protected-page";
import { motion } from "framer-motion";
import { ListTodo } from "lucide-react";
import { Link } from "react-router";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <Protected>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10"
        >
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <ListTodo className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">TodoFlow</span>
            </Link>
            <UserButton />
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            {/* Welcome Section */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome back{user?.name ? `, ${user.name}` : ""}!
              </h1>
              <p className="text-gray-600">
                What would you like to accomplish today?
              </p>
            </div>

            {/* Add Todo Form */}
            <div className="mb-8">
              <AddTodo />
            </div>

            {/* Todo List */}
            <TodoList />
          </motion.div>
        </main>
      </div>
    </Protected>
  );
}