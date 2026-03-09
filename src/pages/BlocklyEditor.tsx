import { useEffect, useRef, useState } from "react";
import * as Blockly from "blockly";
import "blockly/blocks";
import { javascriptGenerator } from "blockly/javascript";
import { Play, RotateCcw, Code2 } from "lucide-react";

const toolbox = {
  kind: "categoryToolbox",
  contents: [
    {
      kind: "category",
      name: "Logic",
      colour: "#5b80a5",
      contents: [
        { kind: "block", type: "controls_if" },
        { kind: "block", type: "logic_compare" },
        { kind: "block", type: "logic_operation" },
        { kind: "block", type: "logic_negate" },
        { kind: "block", type: "logic_boolean" },
      ],
    },
    {
      kind: "category",
      name: "Loops",
      colour: "#5ba55b",
      contents: [
        { kind: "block", type: "controls_repeat_ext" },
        { kind: "block", type: "controls_whileUntil" },
        { kind: "block", type: "controls_for" },
        { kind: "block", type: "controls_forEach" },
      ],
    },
    {
      kind: "category",
      name: "Math",
      colour: "#5b67a5",
      contents: [
        { kind: "block", type: "math_number" },
        { kind: "block", type: "math_arithmetic" },
        { kind: "block", type: "math_single" },
        { kind: "block", type: "math_round" },
        { kind: "block", type: "math_random_int" },
      ],
    },
    {
      kind: "category",
      name: "Text",
      colour: "#5ba58c",
      contents: [
        { kind: "block", type: "text" },
        { kind: "block", type: "text_print" },
        { kind: "block", type: "text_join" },
        { kind: "block", type: "text_length" },
      ],
    },
    {
      kind: "category",
      name: "Variables",
      colour: "#a55b80",
      custom: "VARIABLE",
    },
    {
      kind: "category",
      name: "Functions",
      colour: "#995ba5",
      custom: "PROCEDURE",
    },
  ],
};

const BlocklyEditor = () => {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const [generatedCode, setGeneratedCode] = useState("");
  const [output, setOutput] = useState("");

  useEffect(() => {
    if (blocklyDiv.current && !workspaceRef.current) {
      workspaceRef.current = Blockly.inject(blocklyDiv.current, {
        toolbox,
        theme: Blockly.Themes.Classic,
        grid: { spacing: 20, length: 3, colour: "#1a1f2e", snap: true },
        zoom: { controls: true, wheel: true, startScale: 1.0 },
        trashcan: true,
        renderer: "zelos",
      });

      workspaceRef.current.addChangeListener(() => {
        if (workspaceRef.current) {
          const code = javascriptGenerator.workspaceToCode(workspaceRef.current);
          setGeneratedCode(code);
        }
      });
    }

    return () => {
      if (workspaceRef.current) {
        workspaceRef.current.dispose();
        workspaceRef.current = null;
      }
    };
  }, []);

  const runCode = () => {
    const logs: string[] = [];
    const originalLog = console.log;
    // Override alert for text_print blocks
    const originalAlert = window.alert;
    window.alert = (msg: string) => logs.push(String(msg));
    console.log = (...args: unknown[]) => logs.push(args.map(String).join(" "));
    try {
      // eslint-disable-next-line no-eval
      eval(generatedCode);
      setOutput(logs.length ? logs.join("\n") : "✓ Code ran successfully (no output)");
    } catch (err) {
      setOutput(`Error: ${(err as Error).message}`);
    } finally {
      console.log = originalLog;
      window.alert = originalAlert;
    }
  };

  const resetWorkspace = () => {
    workspaceRef.current?.clear();
    setGeneratedCode("");
    setOutput("");
  };

  return (
    <div className="flex h-screen flex-col pt-16">
      {/* Toolbar */}
      <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-2">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <Code2 className="h-4 w-4 text-primary" />
          Block Editor
        </h2>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={resetWorkspace}
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
            Run
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Blockly workspace */}
        <div ref={blocklyDiv} className="flex-1" />

        {/* Code & Output panel */}
        <div className="flex w-80 flex-col border-l border-border bg-card">
          <div className="border-b border-border px-4 py-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Generated JavaScript
            </span>
          </div>
          <pre className="flex-1 overflow-auto p-4 font-mono text-xs text-foreground/80">
            {generatedCode || "// Drag blocks to generate code..."}
          </pre>
          <div className="border-t border-border">
            <div className="border-b border-border px-4 py-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Output
              </span>
            </div>
            <pre className="h-40 overflow-auto p-4 font-mono text-xs text-accent">
              {output || "// Click Run to see output..."}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlocklyEditor;
