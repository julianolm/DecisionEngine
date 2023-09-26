import { useEffect, useState } from "react";
import { useReactFlow } from "reactflow";

import "./ControlNodeMenu.css";

const OperatorSelector = ({
  selected,
  onChange,
}: {
  selected?: string;
  onChange: () => void;
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

const ParamSelector = ({
  selected,
  onChange,
}: {
  selected?: string;
  onChange: () => void;
}) => (
  <select defaultValue={selected ? selected : ""} onChange={onChange}>
    <option value="" disabled hidden>
      --
    </option>
    <option value="age">age</option>
    <option value="name">name</option>
  </select>
);

const ValueInput = ({
  value,
  onChange,
}: {
  value?: string;
  onChange: () => void;
}) => (
  <input
    type="text"
    placeholder="---"
    value={value ? value : ""}
    onChange={onChange}
    style={{ width: "50px", textAlign: "center" }}
  />
);

export function ControlNodeMenu({
  id,
  data,
  top,
  left,
  right,
  bottom,
  ...props
}) {
  const [parameter, setParameter] = useState(data.parameter);
  const [operator, setOperator] = useState(data.operator);
  const [value, setValue] = useState(data.value);

  const { getNode, setNodes, addNodes, setEdges } = useReactFlow();

  const onChangeParameter = (event) => {
    setParameter(event.target.value);
  };
  const onChangeOperator = (event) => {
    setOperator(event.target.value);
  };
  const onChangeValue = (event) => {
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
        <ParamSelector selected={parameter} onChange={onChangeParameter} />
      </div>
      <div className="update-option">
        <button onClick={() => {}}>Operator</button>
        <OperatorSelector selected={operator} onChange={onChangeOperator} />
      </div>
      <div className="update-option">
        <button onClick={() => {}}>Value</button>
        <ValueInput value={value} onChange={onChangeValue} />
      </div>
    </div>
  );
}
