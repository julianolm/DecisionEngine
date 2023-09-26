import { useEffect, useState } from "react";
import { useReactFlow, Node } from "reactflow";

import { NodeType } from "./types";

import "./ControlNodeMenu.css";

const ParamSelector = ({
  selected,
  onChange,
}: {
  selected?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => (
  <select defaultValue={selected ? selected : ""} onChange={onChange}>
    <option value="" disabled hidden>
      --
    </option>
    <option value="age">age</option>
    <option value="income">income</option>
    <option value="net worth">net worth</option>
    <option value="dependants">dependants</option>
  </select>
);

const OperatorSelector = ({
  selected,
  onChange,
}: {
  selected?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => {
  const operators = ["==", "!=", ">", "<", ">=", "<="];

  return (
    <select defaultValue={selected ? selected : ""} onChange={onChange}>
      <option value="" disabled hidden>
        --
      </option>
      {operators.map((operator) => (
        <option value={operator} key={operator}>
          {operator}
        </option>
      ))}
    </select>
  );
};

const ValueInput = ({
  value,
  onChange,
}: {
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <input
    type="text"
    placeholder="---"
    value={value ? value : ""}
    onChange={onChange}
    style={{ width: "50px", textAlign: "center" }}
  />
);

export type ControlNodeMenuProps = {
  id: string;
  data: Node["data"];
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
};

export function ControlNodeMenu({
  id,
  data,
  top,
  left,
  right,
  bottom,
  ...props
}: ControlNodeMenuProps) {
  const [parameter, setParameter] = useState(data.parameter);
  const [operator, setOperator] = useState(data.operator);
  const [value, setValue] = useState(data.value);

  const { getNode, setNodes } = useReactFlow();

  const node = getNode(id);

  const onChangeParameter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setParameter(event.target.value);
  };
  const onChangeOperator = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setOperator(event.target.value);
  };
  const onChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  useEffect(() => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, parameter: parameter } }
          : node
      )
    );
  }, [parameter, id, setNodes]);

  useEffect(() => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, operator: operator } }
          : node
      )
    );
  }, [operator, id, setNodes]);

  useEffect(() => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, value: value } }
          : node
      )
    );
  }, [value, id, setNodes]);

  if (!node || node.type !== NodeType.ControlNode) return;

  return (
    <div
      style={{ top, left, right, bottom }}
      className="context-menu"
      {...props}
    >
      <p style={{ margin: "0.5em", display: "flex", justifyContent: "center" }}>
        <small>Update</small>
      </p>
      <div className="update-option">
        <button onClick={() => {}}>Parameter</button>
        <ParamSelector selected={data.parameter} onChange={onChangeParameter} />
      </div>
      <div className="update-option">
        <button onClick={() => {}}>Operator</button>
        <OperatorSelector
          selected={data.operator}
          onChange={onChangeOperator}
        />
      </div>
      <div className="update-option">
        <button onClick={() => {}}>Value</button>
        <ValueInput value={data.value} onChange={onChangeValue} />
      </div>
    </div>
  );
}
