import { useCallback, useState } from "react";
import {
  ReactFlow,
  MiniMap,
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

// Custom node components
const InputNode = ({ data }: { data: { label: string; value: string } }) => (
  <div className="rounded-lg border border-primary/40 bg-card px-4 py-3 shadow-lg shadow-primary/10">
    <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-primary">Input</div>
    <div className="font-mono text-sm text-foreground">{data.label}</div>
    <div className="mt-1 text-xs text-muted-foreground">Value: {data.value}</div>
    <Handle type="source" position={Position.Right} className="!h-3 !w-3 !border-2 !border-primary !bg-background" />
  </div>
);

const ProcessNode = ({ data }: { data: { label: string; operation: string } }) => (
  <div className="rounded-lg border border-warning/40 bg-card px-4 py-3 shadow-lg shadow-warning/10">
    <Handle type="target" position={Position.Left} className="!h-3 !w-3 !border-2 !border-warning !bg-background" />
    <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-warning">Process</div>
    <div className="font-mono text-sm text-foreground">{data.label}</div>
    <div className="mt-1 text-xs text-muted-foreground">{data.operation}</div>
    <Handle type="source" position={Position.Right} className="!h-3 !w-3 !border-2 !border-warning !bg-background" />
  </div>
);

const OutputNode = ({ data }: { data: { label: string; result: string } }) => (
  <div className="rounded-lg border border-accent/40 bg-card px-4 py-3 shadow-lg shadow-accent/10">
    <Handle type="target" position={Position.Left} className="!h-3 !w-3 !border-2 !border-accent !bg-background" />
    <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-accent">Output</div>
    <div className="font-mono text-sm text-foreground">{data.label}</div>
    <div className="mt-1 text-xs text-accent">{data.result}</div>
  </div>
);

const nodeTypes = {
  inputNode: InputNode,
  processNode: ProcessNode,
  outputNode: OutputNode,
};

const initialNodes: Node[] = [
  { id: "1", type: "inputNode", position: { x: 50, y: 50 }, data: { label: "Number A", value: "10" } },
  { id: "2", type: "inputNode", position: { x: 50, y: 200 }, data: { label: "Number B", value: "5" } },
  { id: "3", type: "processNode", position: { x: 350, y: 100 }, data: { label: "Add", operation: "A + B" } },
  { id: "4", type: "outputNode", position: { x: 650, y: 100 }, data: { label: "Result", result: "—" } },
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
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [executionLog, setExecutionLog] = useState<string[]>([]);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: "hsl(175 80% 50%)" } }, eds)),
    [setEdges]
  );

  const runFlow = () => {
    const logs: string[] = [];
    // Simple simulation
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

      // Update connected output nodes
      const outEdges = edges.filter((e) => e.source === n.id);
      outEdges.forEach((e) => {
        setNodes((nds) =>
          nds.map((node) =>
            node.id === e.target ? { ...node, data: { ...node.data, result: String(result) } } : node
          )
        );
      });
    });

    outputNodes.forEach((n) => logs.push(`📤 Output "${n.data.label}"`));
    logs.push("✅ Flow executed successfully!");
    setExecutionLog(logs);
  };

  const resetFlow = () => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setExecutionLog([]);
  };

  const addNode = (template: (typeof nodeTemplates)[0]) => {
    const id = String(Date.now());
    const newNode: Node = {
      id,
      type: template.type,
      position: { x: 200 + Math.random() * 200, y: 100 + Math.random() * 200 },
      data: { ...template.data },
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
            <MiniMap
              className="!border-border !bg-card"
              nodeColor={() => "hsl(175 80% 50%)"}
              maskColor="hsl(220 20% 7% / 0.8)"
            />
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
