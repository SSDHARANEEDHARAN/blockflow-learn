import { useCallback, useState } from "react";
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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Play, RotateCcw, Workflow, Plus } from "lucide-react";

// Custom editable node components
const InputNode = ({ id, data }: { id: string; data: { label: string; value: string; onUpdate?: (id: string, field: string, val: string) => void } }) => (
  <div className="rounded-lg border border-primary/40 bg-card px-4 py-3 shadow-lg shadow-primary/10 min-w-[140px]">
    <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-primary">Input</div>
    <input
      type="text"
      value={data.label}
      onChange={(e) => data.onUpdate?.(id, "label", e.target.value)}
      className="mb-1 block w-full bg-transparent font-mono text-sm text-foreground outline-none border-b border-transparent focus:border-primary/40"
      placeholder="Label"
    />
    <input
      type="number"
      value={data.value}
      onChange={(e) => data.onUpdate?.(id, "value", e.target.value)}
      className="block w-full bg-secondary/50 rounded px-1.5 py-0.5 font-mono text-xs text-foreground outline-none focus:ring-1 focus:ring-primary/40"
      placeholder="Value"
    />
    <Handle type="source" position={Position.Right} className="!h-3 !w-3 !border-2 !border-primary !bg-background" />
  </div>
);

const ProcessNode = ({ id, data }: { id: string; data: { label: string; operation: string; onUpdate?: (id: string, field: string, val: string) => void } }) => (
  <div className="rounded-lg border border-warning/40 bg-card px-4 py-3 shadow-lg shadow-warning/10 min-w-[140px]">
    <Handle type="target" position={Position.Left} className="!h-3 !w-3 !border-2 !border-warning !bg-background" />
    <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-warning">Process</div>
    <input
      type="text"
      value={data.label}
      onChange={(e) => data.onUpdate?.(id, "label", e.target.value)}
      className="mb-1 block w-full bg-transparent font-mono text-sm text-foreground outline-none border-b border-transparent focus:border-warning/40"
      placeholder="Label"
    />
    <input
      type="text"
      value={data.operation}
      onChange={(e) => data.onUpdate?.(id, "operation", e.target.value)}
      className="block w-full bg-secondary/50 rounded px-1.5 py-0.5 font-mono text-xs text-muted-foreground outline-none focus:ring-1 focus:ring-warning/40"
      placeholder="Operation"
    />
    <Handle type="source" position={Position.Right} className="!h-3 !w-3 !border-2 !border-warning !bg-background" />
  </div>
);

const OutputNode = ({ id, data }: { id: string; data: { label: string; result: string; onUpdate?: (id: string, field: string, val: string) => void } }) => (
  <div className="rounded-lg border border-accent/40 bg-card px-4 py-3 shadow-lg shadow-accent/10 min-w-[140px]">
    <Handle type="target" position={Position.Left} className="!h-3 !w-3 !border-2 !border-accent !bg-background" />
    <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-accent">Output</div>
    <input
      type="text"
      value={data.label}
      onChange={(e) => data.onUpdate?.(id, "label", e.target.value)}
      className="mb-1 block w-full bg-transparent font-mono text-sm text-foreground outline-none border-b border-transparent focus:border-accent/40"
      placeholder="Label"
    />
    <div className="mt-1 rounded bg-accent/10 px-1.5 py-0.5 text-center font-mono text-xs font-bold text-accent">{data.result}</div>
  </div>
);

const nodeTypes = {
  inputNode: InputNode,
  processNode: ProcessNode,
  outputNode: OutputNode,
};

const makeInitialNodes = (onUpdate: (id: string, field: string, val: string) => void): Node[] => [
  { id: "1", type: "inputNode", position: { x: 50, y: 50 }, data: { label: "Number A", value: "10", onUpdate } },
  { id: "2", type: "inputNode", position: { x: 50, y: 200 }, data: { label: "Number B", value: "5", onUpdate } },
  { id: "3", type: "processNode", position: { x: 350, y: 100 }, data: { label: "Add", operation: "A + B", onUpdate } },
  { id: "4", type: "outputNode", position: { x: 650, y: 100 }, data: { label: "Result", result: "—", onUpdate } },
];

const initialEdges: Edge[] = [
  { id: "e1-3", source: "1", target: "3", animated: true, style: { stroke: "hsl(175 80% 50%)" } },
  { id: "e2-3", source: "2", target: "3", animated: true, style: { stroke: "hsl(175 80% 50%)" } },
  { id: "e3-4", source: "3", target: "4", animated: true, style: { stroke: "hsl(145 70% 50%)" } },
];

const nodeTemplates = [
  { type: "inputNode", label: "Input", data: { label: "Value", value: "0" } },
  { type: "processNode", label: "Process", data: { label: "Transform", operation: "x → y" } },
  { type: "outputNode", label: "Output", data: { label: "Result", result: "—" } },
];

const NodeFlowEditor = () => {
  const updateNodeData = useCallback((id: string, field: string, val: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, [field]: val } } : node
      )
    );
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState(makeInitialNodes(updateNodeData));
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [executionLog, setExecutionLog] = useState<string[]>([]);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: "hsl(175 80% 50%)" } }, eds)),
    [setEdges]
  );

  const runFlow = () => {
    const logs: string[] = [];
    const inputNodes = nodes.filter((n) => n.type === "inputNode");
    const processNodes = nodes.filter((n) => n.type === "processNode");
    const outputNodes = nodes.filter((n) => n.type === "outputNode");

    inputNodes.forEach((n) => logs.push(`📥 Input "${n.data.label}": ${n.data.value}`));

    processNodes.forEach((n) => {
      const incomingEdges = edges.filter((e) => e.target === n.id);
      const inputValues = incomingEdges
        .map((e) => nodes.find((node) => node.id === e.source))
        .filter(Boolean)
        .map((node) => Number(node!.data.value) || 0);

      const result = inputValues.reduce((a, b) => a + b, 0);
      logs.push(`⚙️ Process "${n.data.label}": ${inputValues.join(" + ")} = ${result}`);

      const outEdges = edges.filter((e) => e.source === n.id);
      outEdges.forEach((e) => {
        setNodes((nds) =>
          nds.map((node) =>
            node.id === e.target ? { ...node, data: { ...node.data, result: String(result) } } : node
          )
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
            fitView
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

export default NodeFlowEditor;
