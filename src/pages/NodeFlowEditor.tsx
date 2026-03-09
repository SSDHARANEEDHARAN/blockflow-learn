import { useCallback, useState, useEffect } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Node,
  type Edge,
  BackgroundVariant,
  Handle,
  Position,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Play, RotateCcw, Workflow, Plus, Trash2, Grid3X3 } from "lucide-react";

type Operation = "add" | "subtract" | "multiply";
const operationLabels: Record<Operation, string> = { add: "Add (+)", subtract: "Subtract (−)", multiply: "Multiply (×)" };

const InputNode = ({ id, data }: { id: string; data: Record<string, unknown> }) => {
  const d = data as { label: string; value: string; onUpdate?: (id: string, field: string, val: string) => void };
  return (
    <div className="rounded-lg border border-primary/40 bg-card px-4 py-3 shadow-lg shadow-primary/10 min-w-[140px]">
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-primary">Input</div>
      <input
        type="text"
        value={d.label}
        onChange={(e) => d.onUpdate?.(id, "label", e.target.value)}
        className="mb-1 block w-full bg-transparent font-mono text-sm text-foreground outline-none border-b border-transparent focus:border-primary/40"
      />
      <input
        type="number"
        value={d.value}
        onChange={(e) => d.onUpdate?.(id, "value", e.target.value)}
        className="block w-full bg-secondary/50 rounded px-1.5 py-0.5 font-mono text-xs text-foreground outline-none focus:ring-1 focus:ring-primary/40"
      />
      <Handle type="source" position={Position.Right} className="!h-3 !w-3 !border-2 !border-primary !bg-background" />
    </div>
  );
};

const ProcessNode = ({ id, data }: { id: string; data: Record<string, unknown> }) => {
  const d = data as { label: string; operation: Operation; onUpdate?: (id: string, field: string, val: string) => void };
  return (
    <div className="rounded-lg border border-warning/40 bg-card px-4 py-3 shadow-lg shadow-warning/10 min-w-[160px]">
      <Handle type="target" position={Position.Left} className="!h-3 !w-3 !border-2 !border-warning !bg-background" />
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-warning">Process</div>
      <input
        type="text"
        value={d.label}
        onChange={(e) => d.onUpdate?.(id, "label", e.target.value)}
        className="mb-1.5 block w-full bg-transparent font-mono text-sm text-foreground outline-none border-b border-transparent focus:border-warning/40"
      />
      <select
        value={d.operation}
        onChange={(e) => d.onUpdate?.(id, "operation", e.target.value)}
        className="block w-full bg-secondary/50 rounded px-1.5 py-1 font-mono text-xs text-foreground outline-none focus:ring-1 focus:ring-warning/40 cursor-pointer"
      >
        {(Object.keys(operationLabels) as Operation[]).map((op) => (
          <option key={op} value={op}>{operationLabels[op]}</option>
        ))}
      </select>
      <Handle type="source" position={Position.Right} className="!h-3 !w-3 !border-2 !border-warning !bg-background" />
    </div>
  );
};

const OutputNode = ({ id, data }: { id: string; data: Record<string, unknown> }) => {
  const d = data as { label: string; result: string; onUpdate?: (id: string, field: string, val: string) => void };
  return (
    <div className="rounded-lg border border-accent/40 bg-card px-4 py-3 shadow-lg shadow-accent/10 min-w-[140px]">
      <Handle type="target" position={Position.Left} className="!h-3 !w-3 !border-2 !border-accent !bg-background" />
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-accent">Output</div>
      <input
        type="text"
        value={d.label}
        onChange={(e) => d.onUpdate?.(id, "label", e.target.value)}
        className="mb-1 block w-full bg-transparent font-mono text-sm text-foreground outline-none border-b border-transparent focus:border-accent/40"
      />
      <div className="mt-1 rounded bg-accent/10 px-1.5 py-0.5 text-center font-mono text-xs font-bold text-accent">{d.result}</div>
    </div>
  );
};

const nodeTypes = {
  inputNode: InputNode,
  processNode: ProcessNode,
  outputNode: OutputNode,
};

const makeInitialNodes = (onUpdate: (id: string, field: string, val: string) => void): Node[] => [
  { id: "1", type: "inputNode", position: { x: 50, y: 50 }, data: { label: "Number A", value: "10", onUpdate } },
  { id: "2", type: "inputNode", position: { x: 50, y: 200 }, data: { label: "Number B", value: "5", onUpdate } },
  { id: "3", type: "processNode", position: { x: 350, y: 100 }, data: { label: "Add", operation: "add" as Operation, onUpdate } },
  { id: "4", type: "outputNode", position: { x: 650, y: 100 }, data: { label: "Result", result: "—", onUpdate } },
];

const initialEdges: Edge[] = [
  { id: "e1-3", source: "1", target: "3", animated: true, style: { stroke: "hsl(175 80% 50%)" } },
  { id: "e2-3", source: "2", target: "3", animated: true, style: { stroke: "hsl(175 80% 50%)" } },
  { id: "e3-4", source: "3", target: "4", animated: true, style: { stroke: "hsl(145 70% 50%)" } },
];

const nodeTemplates = [
  { type: "inputNode", label: "Input", data: { label: "Value", value: "0" } },
  { type: "processNode", label: "Process", data: { label: "Process", operation: "add" as Operation } },
  { type: "outputNode", label: "Output", data: { label: "Result", result: "—" } },
];

const computeOp = (values: number[], op: Operation): number => {
  if (values.length === 0) return 0;
  switch (op) {
    case "add": return values.reduce((a, b) => a + b, 0);
    case "subtract": return values.reduce((a, b) => a - b);
    case "multiply": return values.reduce((a, b) => a * b, 1);
  }
};

const opSymbol: Record<Operation, string> = { add: "+", subtract: "−", multiply: "×" };

const FlowEditor = () => {
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [executionLog, setExecutionLog] = useState<string[]>([]);

  const updateNodeData = useCallback((id: string, field: string, val: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, [field]: val } } : node
      )
    );
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState(makeInitialNodes(updateNodeData));
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: "hsl(175 80% 50%)" } }, eds)),
    [setEdges]
  );

  // Delete selected nodes/edges on Delete/Backspace key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        // Don't delete if user is typing in an input
        const tag = (e.target as HTMLElement).tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

        setNodes((nds) => {
          const selected = nds.filter((n) => n.selected).map((n) => n.id);
          if (selected.length === 0) return nds;
          // Also remove edges connected to deleted nodes
          setEdges((eds) => eds.filter((e) => !selected.includes(e.source) && !selected.includes(e.target)));
          return nds.filter((n) => !n.selected);
        });

        setEdges((eds) => eds.filter((e) => !e.selected));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setNodes, setEdges]);

  const runFlow = () => {
    const logs: string[] = [];
    const inputNodes = nodes.filter((n) => n.type === "inputNode");
    const processNodes = nodes.filter((n) => n.type === "processNode");
    const outputNodes = nodes.filter((n) => n.type === "outputNode");

    inputNodes.forEach((n) => logs.push(`📥 Input "${n.data.label}": ${n.data.value}`));

    processNodes.forEach((n) => {
      const op = (n.data.operation as Operation) || "add";
      const incomingEdges = edges.filter((e) => e.target === n.id);
      const inputValues = incomingEdges
        .map((e) => nodes.find((node) => node.id === e.source))
        .filter(Boolean)
        .map((node) => Number(node!.data.value) || 0);

      const result = computeOp(inputValues, op);
      const sym = opSymbol[op];
      logs.push(`⚙️ Process "${n.data.label}": ${inputValues.join(` ${sym} `)} = ${result}`);

      // Update connected output nodes & propagate value for chaining
      const outEdges = edges.filter((e) => e.source === n.id);
      outEdges.forEach((e) => {
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === e.target && node.type === "outputNode") {
              return { ...node, data: { ...node.data, result: String(result) } };
            }
            if (node.id === e.target) {
              return { ...node, data: { ...node.data, value: String(result) } };
            }
            return node;
          })
        );
      });
    });

    outputNodes.forEach((n) => logs.push(`📤 Output "${n.data.label}": ${n.data.result}`));
    logs.push("✅ Flow executed successfully!");
    setExecutionLog(logs);
  };

  const resetFlow = () => {
    setNodes(makeInitialNodes(updateNodeData));
    setEdges(initialEdges);
    setExecutionLog([]);
  };

  const deleteSelected = () => {
    setNodes((nds) => {
      const selected = nds.filter((n) => n.selected).map((n) => n.id);
      setEdges((eds) => eds.filter((e) => !selected.includes(e.source) && !selected.includes(e.target)));
      return nds.filter((n) => !n.selected);
    });
    setEdges((eds) => eds.filter((e) => !e.selected));
  };

  const addNode = (template: (typeof nodeTemplates)[0]) => {
    const id = String(Date.now());
    const newNode: Node = {
      id,
      type: template.type,
      position: { x: 200 + Math.random() * 200, y: 100 + Math.random() * 200 },
      data: { ...template.data, onUpdate: updateNodeData },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const hasSelection = nodes.some((n) => n.selected) || edges.some((e) => e.selected);

  return (
    <div className="flex h-screen flex-col pt-16">
      {/* Toolbar */}
      <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-2">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <Workflow className="h-4 w-4 text-accent" />
          Node Flow Editor
        </h2>

        <div className="ml-4 flex items-center gap-1.5">
          {nodeTemplates.map((t) => (
            <button
              key={t.type}
              onClick={() => addNode(t)}
              className="flex items-center gap-1 rounded-md bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
            >
              <Plus className="h-3 w-3" />
              {t.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setSnapToGrid((s) => !s)}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              snapToGrid
                ? "bg-primary/10 text-primary"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
            title="Toggle grid snap"
          >
            <Grid3X3 className="h-3.5 w-3.5" />
            Snap
          </button>
          {hasSelection && (
            <button
              onClick={deleteSelected}
              className="flex items-center gap-1.5 rounded-md bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/20"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          )}
          <button
            onClick={resetFlow}
            className="flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
          <button
            onClick={runFlow}
            className="flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground transition-colors hover:bg-accent/90 glow-accent"
          >
            <Play className="h-3.5 w-3.5" />
            Run Flow
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Flow canvas */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            snapToGrid={snapToGrid}
            snapGrid={[20, 20]}
            fitView
            deleteKeyCode={null}
            className="bg-background"
          >
            <Controls className="!border-border !bg-card [&_button]:!border-border [&_button]:!bg-card [&_button]:!fill-foreground" />
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="hsl(220 14% 20%)" />
          </ReactFlow>
        </div>

        {/* Execution log */}
        <div className="flex w-72 flex-col border-l border-border bg-card">
          <div className="border-b border-border px-4 py-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Execution Log
            </span>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {executionLog.length ? (
              executionLog.map((log, i) => (
                <div key={i} className="mb-2 font-mono text-xs text-foreground/80">
                  {log}
                </div>
              ))
            ) : (
              <p className="font-mono text-xs text-muted-foreground">
                // Click "Run Flow" to execute...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const NodeFlowEditor = () => (
  <ReactFlowProvider>
    <FlowEditor />
  </ReactFlowProvider>
);

export default NodeFlowEditor;
