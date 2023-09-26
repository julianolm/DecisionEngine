import { MarkerType } from "reactflow";

import { NodeType } from "../components/customNodes";

const initialNodes = [
  {
    id: "1",
    type: "input",
    position: { x: 0, y: 0 },
    data: { label: "START" },
  },
  {
    id: "2",
    type: NodeType.ControlNode,
    position: { x: 0, y: 100 },
    data: {
      label: "right-click to edit",
      parameter: "age",
      operator: ">",
      value: "18",
    },
  },
  {
    id: "3",
    type: NodeType.DecisionNode,
    position: { x: -100, y: 250 },
    data: { label: "right-click to edit", decision: "yes" },
    style: { borderColor: "#89dd68" },
  },
  {
    id: "4",
    type: NodeType.DecisionNode,
    position: { x: 100, y: 250 },
    data: { label: "right-click to edit", decision: "no" },
    style: { borderColor: "#dd6868" },
  },
];
const initialEdges = [
  {
    id: "e1-2",
    source: "1",
    sourceHandle: null,
    target: "2",
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e2-3-yes",
    source: "2",
    sourceHandle: "yes",
    target: "3",
    label: "true",
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e2-3-no",
    source: "2",
    sourceHandle: "no",
    target: "4",
    label: "false",
    markerEnd: { type: MarkerType.ArrowClosed },
  },
];

export const useGraph = () => {
  return { initialNodes, initialEdges };
};
