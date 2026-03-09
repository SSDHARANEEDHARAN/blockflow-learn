import { useState, useCallback } from "react";
import { Play, RotateCcw, Terminal, Copy, Check } from "lucide-react";

const STARTER_CODE = `// Welcome to the Code Playground! 🚀
// Write JavaScript and click Run to see the output.

function greet(name) {
  return "Hello, " + name + "! Welcome to CodeFlow.";
}

console.log(greet("World"));

// Try some math
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((a, b) => a + b, 0);
console.log("Sum of", numbers, "=", sum);

// Loops
for (let i = 1; i <= 5; i++) {
  console.log(i + " x " + i + " = " + (i * i));
}
`;

// Simple syntax highlighting
const highlightCode = (code: string) => {
  const lines = code.split("\n");
  return lines.map((line, i) => {
    let highlighted = line
      // Strings
      .replace(/(["'`])(?:(?=(\\?))\2.)*?\1/g, '<span class="text-accent">$&</span>')
      // Comments
      .replace(/(\/\/.*)$/gm, '<span class="text-muted-foreground italic">$1</span>')
      // Keywords
      .replace(/\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|class|import|export|default|from|of|in|typeof|instanceof)\b/g, '<span class="text-primary font-semibold">$&</span>')
      // Numbers
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="text-warning">$&</span>')
      // Built-in methods
      .replace(/\b(console|Math|Array|Object|String|Number|JSON|Date|Promise|setTimeout|setInterval)\b/g, '<span class="text-destructive">$&</span>')
      // Function calls
      .replace(/\b([a-zA-Z_]\w*)\s*(?=\()/g, '<span class="text-[hsl(280_70%_70%)]">$&</span>');
    return (
      <div key={i} className="flex">
        <span className="mr-4 inline-block w-8 select-none text-right text-muted-foreground/40">
          {i + 1}
        </span>
        <span dangerouslySetInnerHTML={{ __html: highlighted || "&nbsp;" }} />
      </div>
    );
  });
};

const CodePlayground = () => {
  const [code, setCode] = useState(STARTER_CODE);
  const [output, setOutput] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const runCode = useCallback(() => {
    const logs: string[] = [];
    const origLog = console.log;
    const origWarn = console.warn;
    const origError = console.error;
    const origAlert = window.alert;

    console.log = (...args: unknown[]) => logs.push(args.map(a => typeof a === "object" ? JSON.stringify(a) : String(a)).join(" "));
    console.warn = (...args: unknown[]) => logs.push("⚠️ " + args.map(String).join(" "));
    console.error = (...args: unknown[]) => logs.push("❌ " + args.map(String).join(" "));
    window.alert = (msg: string) => logs.push("🔔 " + String(msg));

    try {
      // eslint-disable-next-line no-eval
      eval(code);
      if (!logs.length) logs.push("✓ Code ran successfully (no output)");
    } catch (err) {
      logs.push(`❌ Error: ${(err as Error).message}`);
    } finally {
      console.log = origLog;
      console.warn = origWarn;
      console.error = origError;
      window.alert = origAlert;
    }
    setOutput(logs);
  }, [code]);

  const resetCode = () => {
    setCode(STARTER_CODE);
    setOutput([]);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-screen flex-col pt-16">
      {/* Toolbar */}
      <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-2">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <Terminal className="h-4 w-4 text-primary" />
          Code Playground
        </h2>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={copyCode}
            className="flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={resetCode}
            className="flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
          <button
            onClick={runCode}
            className="flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground transition-colors hover:bg-accent/90 glow-accent"
          >
            <Play className="h-3.5 w-3.5" />
            Run Code
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Editor area */}
        <div className="relative flex-1 overflow-hidden">
          {/* Syntax-highlighted overlay */}
          <div className="pointer-events-none absolute inset-0 overflow-auto p-4 font-mono text-sm leading-6">
            {highlightCode(code)}
          </div>
          {/* Textarea (invisible text, visible caret) */}
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="absolute inset-0 h-full w-full resize-none bg-background p-4 pl-[3.5rem] font-mono text-sm leading-6 text-transparent caret-foreground outline-none"
          />
        </div>

        {/* Output panel */}
        <div className="flex w-80 flex-col border-l border-border bg-card">
          <div className="border-b border-border px-4 py-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Console Output
            </span>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {output.length ? (
              output.map((line, i) => (
                <div
                  key={i}
                  className={`mb-1.5 font-mono text-xs ${
                    line.startsWith("❌") ? "text-destructive" : line.startsWith("⚠️") ? "text-warning" : "text-foreground/80"
                  }`}
                >
                  {line}
                </div>
              ))
            ) : (
              <p className="font-mono text-xs text-muted-foreground">
                {"// Click \"Run Code\" to execute..."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodePlayground;
