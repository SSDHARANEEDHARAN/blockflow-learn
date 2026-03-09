import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Workflow, Terminal, ChevronRight, Star, Lightbulb, CheckCircle2, Trophy } from "lucide-react";
import { challenges, type Challenge } from "@/data/challenges";
import { useChallengeProgress } from "@/hooks/use-challenge-progress";
import { Progress } from "@/components/ui/progress";

const difficultyColor: Record<Challenge["difficulty"], string> = {
  beginner: "text-accent bg-accent/10 border-accent/30",
  intermediate: "text-warning bg-warning/10 border-warning/30",
  advanced: "text-destructive bg-destructive/10 border-destructive/30",
};

const editorIcon: Record<Challenge["editor"], typeof Workflow> = {
  "node-flow": Workflow,
  playground: Terminal,
};

const editorLabel: Record<Challenge["editor"], string> = {
  "node-flow": "Node Flow",
  playground: "Code Playground",
};

const editorPath: Record<Challenge["editor"], string> = {
  "node-flow": "/node-flow",
  playground: "/playground",
};

type Filter = "all" | Challenge["editor"];

const Challenges = () => {
  const [filter, setFilter] = useState<Filter>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { completed, toggle } = useChallengeProgress();

  const filtered = filter === "all" ? challenges : challenges.filter((c) => c.editor === filter);

  const totalCount = challenges.length;
  const completedCount = completed.size;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredCompleted = filtered.filter((c) => completed.has(c.id)).length;

  const filters: { value: Filter; label: string; icon: typeof Blocks }[] = [
    { value: "all", label: "All", icon: BookOpen },
    { value: "blockly", label: "Blocks", icon: Blocks },
    { value: "node-flow", label: "Node Flow", icon: Workflow },
    { value: "playground", label: "Code", icon: Terminal },
  ];

  return (
    <div className="min-h-screen pt-16">
      <div className="container py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="mb-3 text-3xl font-bold">
            <BookOpen className="mr-2 inline h-8 w-8 text-primary" />
            Challenges & <span className="text-primary">Lessons</span>
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Step-by-step guided challenges to help you master visual and text-based programming.
            Each challenge includes detailed instructions, hints, and objectives.
          </p>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 rounded-xl border border-border bg-card p-5"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              <span className="font-semibold">Your Progress</span>
            </div>
            <span className="text-sm font-bold text-primary">
              {completedCount}/{totalCount} completed
            </span>
          </div>
          <Progress value={progressPercent} className="h-2.5" />
          <p className="mt-2 text-xs text-muted-foreground">
            {progressPercent === 100
              ? "🎉 All challenges completed! You're a master!"
              : `${progressPercent}% complete — keep going!`}
          </p>
        </motion.div>

        {/* Filters */}
        <div className="mb-2 flex gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                filter === f.value
                  ? "bg-primary/10 text-primary glow-primary"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              <f.icon className="h-4 w-4" />
              {f.label}
            </button>
          ))}
        </div>
        <p className="mb-6 text-xs text-muted-foreground">
          Showing {filtered.length} challenges · {filteredCompleted} completed
        </p>

        {/* Challenge grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((challenge, i) => {
            const Icon = editorIcon[challenge.editor];
            const isExpanded = expandedId === challenge.id;
            const isDone = completed.has(challenge.id);
            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`group rounded-xl border transition-all ${
                  isDone
                    ? "border-accent/40 bg-accent/5"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <div
                  className="cursor-pointer p-5"
                  onClick={() => setExpandedId(isExpanded ? null : challenge.id)}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{editorLabel[challenge.editor]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isDone && <CheckCircle2 className="h-4 w-4 text-accent" />}
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${difficultyColor[challenge.difficulty]}`}>
                        {challenge.difficulty}
                      </span>
                    </div>
                  </div>
                  <h3 className={`mb-1.5 text-lg font-bold ${isDone ? "line-through opacity-70" : ""}`}>
                    {challenge.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{challenge.description}</p>
                </div>

                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="border-t border-border px-5 pb-5 pt-4"
                  >
                    {/* Objective */}
                    <div className="mb-4">
                      <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                        <Star className="h-3 w-3" /> Objective
                      </div>
                      <p className="text-sm text-foreground/80">{challenge.objective}</p>
                    </div>

                    {/* Steps */}
                    <div className="mb-4">
                      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Steps
                      </div>
                      <ol className="space-y-1.5">
                        {challenge.steps.map((step, si) => (
                          <li key={si} className="flex gap-2 text-sm text-foreground/80">
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                              {si + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Hints */}
                    <div className="mb-4">
                      <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-warning">
                        <Lightbulb className="h-3 w-3" /> Hints
                      </div>
                      {challenge.hints.map((hint, hi) => (
                        <p key={hi} className="mb-1 text-sm text-muted-foreground">
                          💡 {hint}
                        </p>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <Link
                        to={editorPath[challenge.editor]}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:scale-105 glow-primary"
                      >
                        Open Editor <ChevronRight className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggle(challenge.id);
                        }}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-semibold transition-all ${
                          isDone
                            ? "border-accent/30 bg-accent/10 text-accent hover:bg-accent/20"
                            : "border-border bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        }`}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        {isDone ? "Completed" : "Mark Complete"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Challenges;
