import { memo } from "react";
import { Handle, Position } from "reactflow";

import "./CustomNodes.css"

type ControlNodeProps = {
  data: {
    parameter: string;
    operator: string;
    onChange: (value: string) => void;
    value: string;
  };
  isConnectable: boolean;
};

export const ControlNode = memo(({ data, isConnectable }: ControlNodeProps) => {
  return (
    <div className="control-node">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div style={{ padding: "8px" }}>
        <span>
          {data.parameter} {data.operator} {data.value}
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
});
