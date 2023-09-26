import { memo, useEffect, useState } from "react";
import { Handle, Position } from "reactflow";

import "./CustomNodes.css";

type ControlNodeProps = {
  data: {
    label: string;
    parameter: string;
    operator: string;
    value: string;
  };
  isConnectable: boolean;
};

export const ControlNode = memo(({ data, isConnectable }: ControlNodeProps) => {
  const [content, setContent] = useState<string>(data.label);

  useEffect(() => {
    if (!(data.parameter && data.operator && data.value)) return;
    const nodeContent = `${data.parameter} ${data.operator} ${data.value}`;
    setContent(nodeContent);
  }, [data.parameter, data.operator, data.value]);

  return (
    <div className="control-node">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div style={{ padding: "8px" }}>
        <span>{content}</span>
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
