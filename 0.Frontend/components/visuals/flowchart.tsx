import React from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  Handle,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Position,
} from "react-flow-renderer";
import "./styles.css";

// Define the custom node data type
interface CustomNodeData {
  label: string;
  editable?: string;
}

// Define initial nodes with types
const initialNodes: Node<CustomNodeData>[] = [
  {
    id: "main",
    type: "custom",
    position: { x: 400, y: 300 }, // Center node
    data: { label: "Docker Course", editable: "true" },
    style: {
      padding: "12px 18px",
      borderRadius: "12px",
      border: "1px solid #007BFF",
      fontSize: "20px",
      textAlign: "center" as "center",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    },
  },
  // Subnodes positioned in a circle around the main node
  ...Array.from({ length: 8 }).map((_, index) => {
    const angle = (index / 8) * 2 * Math.PI;
    const radius = 200;
    const x = 400 + radius * Math.cos(angle);
    const y = 300 + radius * Math.sin(angle);
    const labels = [
      "Fundamental Concepts",
      "Docker Images",
      "Docker Containers",
      "Practical Applications",
      "Building Applications",
      "Deploying Applications",
      "Advanced Techniques",
      "Docker Compose",
    ];
    return {
      id: `node-${index}`,
      type: "custom",
      position: { x, y },
      data: { label: labels[index] },
      style: {
        background: "#FFD700",
        padding: "3px",
        borderRadius: "10px",
        border: "1px solid #007BFF",
        fontSize: "16px",
        textAlign: "center" as "center", // Explicitly cast "center" as a valid TextAlign value
        boxShadow: "0 3px 8px rgba(0, 0, 0, 0.2)",
      },
    };
  }),
];

const initialEdges: Edge[] = [
  ...Array.from({ length: 8 }).map((_, index) => ({
    id: `e-main-node-${index}`,
    source: "main",
    target: `node-${index}`,
    type: "smoothstep",
    animated: true,
  })),
];

// Custom Node Component
const CustomNode: React.FC<{ data: CustomNodeData }> = ({ data }) => {
  return (
    <div
      style={{
        padding: "10px",
        borderRadius: "5px",
        textAlign: "center",
        fontSize: "14px",
        background: "#fff",
        border: "1px solid #ccc",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.2s ease-in-out",
        cursor: "pointer",
      }}
    >
      <strong>{data.label}</strong>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: "#007BFF",
          width: "10px",
          height: "10px",
        }}
      />
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: "#007BFF",
          width: "10px",
          height: "10px",
        }}
      />
    </div>
  );
};

const nodeTypes = { custom: CustomNode };

const Flowchart: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNodeData>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds));

  return (
    <div style={{ height: "100vh", background: "#f9f9f9" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        style={{ fontFamily: "Arial, sans-serif", color: "#333" }}
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default Flowchart;
