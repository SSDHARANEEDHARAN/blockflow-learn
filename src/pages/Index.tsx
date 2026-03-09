import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Blocks, Workflow, Sparkles, Zap, BookOpen, Trophy } from "lucide-react";

const learningPaths = [
  {
    title: "Block Programming",
    description: "Learn coding fundamentals by snapping blocks together. No syntax errors, just pure logic.",
    icon: Blocks,
    path: "/blockly",
    color: "text-primary",
    glowClass: "glow-primary",
    bgClass: "bg-primary/10",
  },
  {
    title: "Node Flow",
    description: "Connect nodes to build data pipelines and understand how programs flow from input to output.",
    icon: Workflow,
    path: "/node-flow",
    color: "text-accent",
    glowClass: "glow-accent",
    bgClass: "bg-accent/10",
  },
  {
    title: "Code Playground",
    description: "Write and run JavaScript directly with syntax highlighting. Bridge the gap to real coding.",
    icon: Sparkles,
    path: "/playground",
    color: "text-warning",
    glowClass: "",
    bgClass: "bg-warning/10",
  },
  {
    title: "Challenges & Lessons",
    description: "Step-by-step guided lessons and coding challenges for all editors. Learn at your pace.",
    icon: Trophy,
    path: "/challenges",
    color: "text-destructive",
    glowClass: "",
    bgClass: "bg-destructive/10",
  },
];

const features = [
  { icon: Zap, title: "Interactive", desc: "Real-time feedback as you code" },
  { icon: BookOpen, title: "Step by Step", desc: "Guided lessons for beginners" },
  { icon: Trophy, title: "Challenges", desc: "Test your skills with puzzles" },
  { icon: Sparkles, title: "Visual", desc: "See your code come to life" },
];

const Index = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="gradient-hero grid-bg relative overflow-hidden px-4 py-24 lg:py-32">
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm text-primary">
              <Sparkles className="h-4 w-4" />
              Learn Programming Visually
            </div>
            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Code Without{" "}
              <span className="text-primary glow-text-primary">Typing</span>
              <br />
              Learn by{" "}
              <span className="text-accent glow-text-accent">Building</span>
            </h1>
            <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground">
              Master programming concepts through visual block-based coding and
              node flow editors. Perfect for beginners and visual learners.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/blockly"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:scale-105 glow-primary"
              >
                <Blocks className="h-5 w-5" />
                Start with Blocks
              </Link>
              <Link
                to="/node-flow"
                className="inline-flex items-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-6 py-3 font-semibold text-accent transition-all hover:scale-105 hover:bg-accent/20"
              >
                <Workflow className="h-5 w-5" />
                Try Node Flow
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating decorative elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 top-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -left-20 bottom-20 h-72 w-72 rounded-full bg-accent/5 blur-3xl" />
        </div>
      </section>

      {/* Learning Paths */}
      <section className="px-4 py-20">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Choose Your <span className="text-primary">Path</span>
          </h2>
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            {learningPaths.map((path, i) => (
              <motion.div
                key={path.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.15 }}
              >
                <Link
                  to={path.path}
                  className="group block rounded-xl border border-border bg-card p-8 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className={`mb-4 inline-flex rounded-lg p-3 ${path.bgClass} ${path.glowClass}`}>
                    <path.icon className={`h-7 w-7 ${path.color}`} />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">{path.title}</h3>
                  <p className="text-muted-foreground">{path.description}</p>
                  <div className={`mt-4 text-sm font-medium ${path.color} opacity-0 transition-opacity group-hover:opacity-100`}>
                    Start Learning →
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border px-4 py-20">
        <div className="container">
          <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="text-center"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h4 className="mb-1 font-semibold">{f.title}</h4>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
