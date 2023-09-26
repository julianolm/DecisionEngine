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
} from "reactflow";
import "reactflow/dist/style.css";

import "./App.css";
import { nodeTypes, ControlNodeMenu } from "./components/customNodes";
import { useGraph } from "./hooks/graph";

const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
const getLayoutedElements = (nodes, edges, options) => {
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
  const { fitView, getNode, getNodes, addNodes } = useReactFlow();
  const { initialNodes, initialEdges } = useGraph();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [menu, setMenu] = useState(null);
  const reactFlowRef = useRef(null);

  const onLayout = useCallback(
    (direction) => {
      const layouted = getLayoutedElements(nodes, edges, { direction });

      setNodes([...layouted.nodes]);
      setEdges([...layouted.edges]);

      window.requestAnimationFrame(() => {
        fitView();
      });
    },
    [nodes, edges]
  );

  const getConnectionType = (sourceNode, targetNode) => {
    if (sourceNode.type === "input" && targetNode.type === "controlNode")
      return "start-control";
    if (sourceNode.type === "controlNode" && targetNode.type === "decisionNode")
      return "control-decision";
    if (sourceNode.type === "controlNode" && targetNode.type === "controlNode")
      return "control-control";

    return "invalid";
  };

  const isValidConnection = (connection) => {
    const { source, target, sourceHandle } = connection;
    if (source === target) return false;
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
    // o reactflow so vai chamar essa funcao se os nos com esses ids existirem,
    // mas o typescript vai reclamar
    const connectionType = getConnectionType(sourceNode, targetNode);
    if (connectionType === "invalid") return false;

    return true;
  };

  const onConnect = useCallback(
    (params) => {
      const sourceNode = getNode(params.source);
      const targetNode = getNode(params.target);

      const newEdge = {
        ...params,
        markerEnd: { type: MarkerType.ArrowClosed },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const onAddControl = useCallback(() => {
    const newNode = {
      id: getNodeId(),
      type: "controlNode",
      data: {},
      position: {
        x: 20 + Math.random() * 100,
        y: 20 + Math.random() * 100,
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  const onAddDecision = useCallback((decision) => {
    const newNode = {
      id: getNodeId(),
      type: "decisionNode",
      data: {},
      position: {
        x: 20 + Math.random() * 100,
        y: 20 + Math.random() * 100,
      },
    };
    addNodes(newNode);
  }, [addNodes]);

  const onSave = useCallback(() => {
    console.log(nodes, edges);
  }, [nodes, edges]);

  const onNodeContextMenu = useCallback(
    (event, node) => {
      event.preventDefault();

      const pane = reactFlowRef.current.getBoundingClientRect();
      setMenu({
        id: node.id,
        data: node.data,
        top: event.clientY < pane.height - 200 && event.clientY,
        left: event.clientX < pane.width - 200 && event.clientX,
        right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
        bottom:
          event.clientY >= pane.height - 200 && pane.height - event.clientY,
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
            <button onClick={onAddDecision}>add decision node</button>
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
