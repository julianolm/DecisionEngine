import { ControlNode } from "./ControlNode";
import { DecisionNode } from "./DecisionNode";

export const nodeTypes = {
  controlNode: ControlNode,
  decisionNode: DecisionNode,
};

export enum NodeType {
  ControlNode = "controlNode",
  DecisionNode = "decisionNode",
}