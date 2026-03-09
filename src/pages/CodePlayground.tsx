import { useState, useCallback, useRef } from "react";
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

// Tokenize a line into styled spans
const tokenizeLine = (line: string) => {
  const tokens: { text: string; className: string }[] = [];
  let remaining = line;

  while (remaining.length > 0) {
    let match: RegExpMatchArray | null = null;
    let bestMatch: { text: string; className: string; length: number } | null = null;

    // Comments
    match = remaining.match(/^(\/\/.*)/);
    if (match) {
      bestMatch = { text: match[0], className: "text-muted-foreground italic", length: match[0].length };
    }

    // Strings
    if (!bestMatch) {
      match = remaining.match(/^(["'`])(?:(?=(\\?))\2.)*?\1/);
      if (match) {
        bestMatch = { text: match[0], className: "text-accent", length: match[0].length };
      }
    }

    // Keywords
    if (!bestMatch) {
      match = remaining.match(/^(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|class|import|export|default|from|of|in|typeof|instanceof|async|await|try|catch|finally|throw|yield)\b/);
      if (match) {
        bestMatch = { text: match[0], className: "text-primary font-semibold", length: match[0].length };
      }
    }

    // Built-ins
    if (!bestMatch) {
      match = remaining.match(/^(console|Math|Array|Object|String|Number|JSON|Date|Promise|setTimeout|setInterval|window|document|true|false|null|undefined)\b/);
      if (match) {
        bestMatch = { text: match[0], className: "text-destructive", length: match[0].length };
      }
    }

    // Numbers
    if (!bestMatch) {
      match = remaining.match(/^\b(\d+\.?\d*)\b/);
      if (match) {
        bestMatch = { text: match[0], className: "text-warning", length: match[0].length };
      }
    }

    // Function calls
    if (!bestMatch) {
      match = remaining.match(/^([a-zA-Z_]\w*)\s*(?=\()/);
      if (match) {
        bestMatch = { text: match[0], className: "text-[hsl(280,70%,70%)]", length: match[0].length };
      }
    }

    if (bestMatch) {
      tokens.push({ text: bestMatch.text, className: bestMatch.className });
      remaining = remaining.slice(bestMatch.length);
    } else {
      // Take one character as plain text
      const plainMatch = remaining.match(/^[^/"'`a-zA-Z_0-9]+/) || remaining.match(/^./);
      const plain = plainMatch ? plainMatch[0] : remaining[0];
      tokens.push({ text: plain, className: "text-foreground" });
      remaining = remaining.slice(plain.length);
    }
  }

  return tokens;
};

const CodePlayground = () => {
  const [code, setCode] = useState(STARTER_CODE);
  const [output, setOutput] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

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

  const lines = code.split("\n");

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
        <div className="relative flex-1 overflow-hidden bg-background">
          {/* Line numbers + highlighted code (visual layer) */}
          <div
            ref={highlightRef}
            className="pointer-events-none absolute inset-0 overflow-hidden p-4 font-mono text-sm leading-6"
            aria-hidden="true"
          >
            {lines.map((line, i) => (
              <div key={i} className="flex">
                <span className="mr-4 inline-block w-8 shrink-0 select-none text-right text-muted-foreground/40">
                  {i + 1}
                </span>
                <span className="whitespace-pre">
                  {tokenizeLine(line).map((token, ti) => (
                    <span key={ti} className={token.className}>{token.text}</span>
                  ))}
                  {line.length === 0 && "\u00A0"}
                </span>
              </div>
            ))}
          </div>
          {/* Textarea (invisible text, visible caret) */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onScroll={handleScroll}
            spellCheck={false}
            className="absolute inset-0 h-full w-full resize-none bg-transparent p-4 pl-[3.5rem] font-mono text-sm leading-6 text-transparent caret-foreground outline-none selection:bg-primary/20 selection:text-transparent"
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
