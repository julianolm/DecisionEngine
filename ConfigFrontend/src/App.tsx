import { useState, useCallback, useRef } from "react";
import Dagre from "@dagrejs/dagre";

import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  useReactFlow,
  ReactFlowProvider,
  MarkerType,
  Node,
  Edge,
  OnConnect,
  IsValidConnection,
} from "reactflow";
import "reactflow/dist/style.css";

import "./App.css";
import {
  nodeTypes,
  ControlNodeMenu,
  NodeType,
  ControlNodeMenuProps,
} from "./components/customNodes";
import { useGraph } from "./hooks/graph";
import { Connection } from "./types";

const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  options: { direction: string }
) => {
  g.setGraph({ rankdir: options.direction });

  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node) => g.setNode(node.id, node));

  Dagre.layout(g);

  return {
    nodes: nodes.map((node) => {
      const { x, y } = g.node(node.id);

      return { ...node, position: { x, y } };
    }),
    edges,
  };
};

const getNodeId = () => `node_${+new Date()}`;

const LayoutFlow = () => {
  const { fitView, getNode, addNodes } = useReactFlow();
  const { initialNodes, initialEdges } = useGraph();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  

  const [menu, setMenu] = useState<ControlNodeMenuProps | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reactFlowRef = useRef<any>(null);

  const onLayout = useCallback(
    (direction: string) => {
      const layouted = getLayoutedElements(nodes, edges, { direction });

      setNodes([...layouted.nodes]);
      setEdges([...layouted.edges]);

      window.requestAnimationFrame(() => {
        fitView();
      });
    },
    [nodes, edges, fitView, setEdges, setNodes]
  );

  const getConnectionType = (sourceNode: Node, targetNode: Node) => {
    if (sourceNode.type === "input" && targetNode.type === "controlNode")
      return "start-control";
    if (sourceNode.type === "controlNode" && targetNode.type === "decisionNode")
      return "control-decision";
    if (sourceNode.type === "controlNode" && targetNode.type === "controlNode")
      return "control-control";

    return "invalid";
  };

  const isValidConnection: IsValidConnection = (connection: Connection) => {
    const { source, target, sourceHandle } = connection;
    if (!source || !target || source === target) return false;
    if (
      edges.find(
        (edge) =>
          (edge.source === source && edge.sourceHandle === sourceHandle) ||
          edge.target === target
      )
    ) {
      return false;
    }

    const sourceNode = getNode(source);
    const targetNode = getNode(target);

    if (!sourceNode || !targetNode) return false;
    const connectionType = getConnectionType(sourceNode, targetNode);

    if (connectionType === "invalid") return false;

    return true;
  };

  const onConnect: OnConnect = useCallback(
    (connection) => {
      if (!connection.source || !connection.target) return;

      const sourceNode = getNode(connection.source);
      const id = `${connection.source}-${connection.target}-${connection.sourceHandle}}`;

      const newEdge: Edge = {
        id,
        source: connection.source,
        sourceHandle: connection.sourceHandle,
        target: connection.target,
        targetHandle: connection.targetHandle,
        markerEnd: { type: MarkerType.ArrowClosed },
        label: "",
      };

      if (sourceNode && sourceNode.type === NodeType.ControlNode) {
        newEdge.label = newEdge.sourceHandle === "yes" ? "true" : "false";
      }
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges, getNode]
  );

  const onAddControl = useCallback(() => {
    const newNode = {
      id: getNodeId(),
      type: "controlNode",
      data: { label: "right-click to edit" },
      position: {
        x: 20 + Math.random() * 100,
        y: 20 + Math.random() * 100,
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  const onAddDecision = useCallback(
    (decision: string) => {
      const newNode = {
        id: getNodeId(),
        type: "decisionNode",
        data: {
          decision,
        },
        position: {
          x: 20 + Math.random() * 100,
          y: 20 + Math.random() * 100,
        },
        style: {
          borderColor: decision === "yes" ? "#89dd68" : "#dd6868",
        },
      };
      addNodes(newNode);
    },
    [addNodes]
  );

  const onSave = useCallback(() => {
    console.log(nodes, edges);
  }, [nodes, edges]);

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();

      const pane = reactFlowRef?.current?.getBoundingClientRect();
      setMenu({
        id: node.id,
        data: node.data,
        top: event.clientY < pane.height - 200 ? event.clientY : undefined,
        left: event.clientX < pane.width - 200 ? event.clientX : undefined,
        right:
          event.clientX >= pane.width - 200
            ? pane.width - event.clientX
            : undefined,
        bottom:
          event.clientY >= pane.height - 200
            ? pane.height - event.clientY
            : undefined,
      });
    },
    [setMenu]
  );
  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

  return (
    <div className="App">
      <ReactFlow
        ref={reactFlowRef}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        isValidConnection={isValidConnection}
        onPaneClick={onPaneClick}
        onNodeContextMenu={onNodeContextMenu}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background gap={12} size={2} color="#ddd" />
        {menu && <ControlNodeMenu {...menu} />}
        <Panel position="top-left">
          <div className="panel-content">
            <button disabled onClick={onSave}>
              save
            </button>
            <button onClick={onAddControl}>add control node</button>
            <button onClick={() => onAddDecision("yes")}>
              add decision yes
            </button>
            <button onClick={() => onAddDecision("no")}>add decision no</button>
          </div>
        </Panel>
        <Panel position="top-right">
          <button onClick={() => onLayout("TB")}>organize layout</button>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default function App() {
  return (
    <ReactFlowProvider>
      <LayoutFlow />
    </ReactFlowProvider>
  );
}
