import { AuthButton } from "@/components/auth/AuthButton";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle2, ListTodo, Plus, Zap } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-black">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-6 flex items-center justify-between border-b-2 border-black"
      >
        <div className="flex items-center gap-2">
          <ListTodo className="h-8 w-8 text-black" />
          <span className="text-2xl font-bold">TodoFlow</span>
        </div>
        <AuthButton
          trigger={
            <Button
              size="lg"
              className="bg-primary rounded-md border-2 border-black font-bold shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] active:shadow-[2px_2px_0px_#000] transition-all duration-200"
            >
              Get Started
            </Button>
          }
          dashboardTrigger={<Button size="lg">Go to Dashboard</Button>}
        />
      </motion.nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tighter">
            Organize Your Life with
            <span className="text-primary block mt-2">TodoFlow</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            The simple, beautiful way to manage your tasks. Create, organize,
            and complete your todos with an intuitive interface designed for
            productivity.
          </p>
          <AuthButton
            trigger={
              <Button
                size="lg"
                className="bg-primary text-lg px-8 py-6 rounded-md border-2 border-black font-bold shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] active:shadow-[2px_2px_0px_#000] transition-all duration-200"
              >
                Start Organizing Today
              </Button>
            }
          />
        </motion.div>

        {/* Feature Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-20 max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-md shadow-[8px_8px_0px_#000] p-8 border-2 border-black">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-secondary rounded-md border-2 border-black">
                <div className="w-6 h-6 rounded-full border-2 border-black"></div>
                <span className="font-medium">Plan weekend trip</span>
                <div className="ml-auto flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-primary/50 rounded-md border-2 border-black">
                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium line-through">Buy groceries</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-secondary rounded-md border-2 border-black">
                <div className="w-6 h-6 rounded-full border-2 border-black"></div>
                <span className="font-medium">Finish project proposal</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="bg-primary py-20 border-y-2 border-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Everything you need to stay organized
            </h2>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Simple features that make a big difference in your daily
              productivity.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-center p-6 bg-background rounded-md border-2 border-black shadow-[4px_4px_0px_#000]"
            >
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-black">
                <Plus className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick Add</h3>
              <p className="text-muted-foreground">
                Add new todos instantly with our streamlined interface. No
                complicated forms or unnecessary steps.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-center p-6 bg-background rounded-md border-2 border-black shadow-[4px_4px_0px_#000]"
            >
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-black">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Filtering</h3>
              <p className="text-muted-foreground">
                View all, active, or completed todos with intelligent filtering
                that helps you focus on what matters.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="text-center p-6 bg-background rounded-md border-2 border-black shadow-[4px_4px_0px_#000]"
            >
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-black">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Sync</h3>
              <p className="text-muted-foreground">
                Your todos sync instantly across all devices. Start on your
                phone, finish on your computer.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="container mx-auto px-4 text-center"
        >
          <h2 className="text-4xl font-bold mb-4">Ready to get organized?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed their productivity with
            TodoFlow.
          </p>
          <AuthButton
            trigger={
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-6 rounded-md border-2 border-black font-bold shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] active:shadow-[2px_2px_0px_#000] transition-all duration-200 bg-secondary"
              >
                Start Your Journey
              </Button>
            }
          />
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-black py-12 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ListTodo className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">TodoFlow</span>
          </div>
          <p className="text-gray-400">
            Built with 💛 for productivity enthusiasts
          </p>
        </div>
      </footer>
    </div>
  );
}