import { memo, useEffect, useState } from "react";
import { Handle, Position, useReactFlow } from "reactflow";

type ControlNodeProps = {
  id: string;
  data: {
    parameter: string;
    operator: string;
    onChange: (value: string) => void;
    value: string;
  };
  isConnectable: boolean;
};

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

export const ControlNode = memo(
  ({ id, data, isConnectable }: ControlNodeProps) => {
    const [controlParameter, setControlParameter] = useState(data.parameter);
    const [controlOperator, setControlOperator] = useState(data.operator);
    const [controlValue, setControlValue] = useState(data.value);

    const { setNodes } = useReactFlow();

    const onChangeParameter = (event) => {
      setControlParameter(event.target.value);
    };
    const onChangeOperator = (event) => {
      setControlOperator(event.target.value);
    };
    const onChangeValue = (event) => {
      setControlValue(event.target.value);
    };

    useEffect(() => {
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, parameter: controlParameter } }
            : node
        )
      );
    }, [controlParameter, id, setNodes]);

    useEffect(() => {
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, operator: controlOperator } }
            : node
        )
      );
    }, [controlOperator, id, setNodes]);

    useEffect(() => {
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, value: controlValue } }
            : node
        )
      );
    }, [controlValue, id, setNodes]);

    return (
      <div className="control-node">
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
        />
        <div style={{ padding: "8px" }}>
          <span>
            <ParamSelector
              selected={data.parameter}
              onChange={onChangeParameter}
            />
            <OperatorSelector
              selected={data.operator}
              onChange={onChangeOperator}
            />
            <ValueInput value={data.value} onChange={onChangeValue} />
          </span>
        </div>
        <Handle
          type="source"
          id="yes"
          position={Position.Bottom}
          style={{ left: "25%", background: "#89dd68" }}
          isConnectable={isConnectable}
        />
        <Handle
          type="source"
          id="no"
          position={Position.Bottom}
          style={{ left: "75%", background: "#dd6868" }}
          isConnectable={isConnectable}
        />
      </div>
    );
  }
);
