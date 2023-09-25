import React, { memo, useState } from "react";
import { Handle, Position } from "reactflow";

type DecisionNodeProps = {
  data: {
    decision?: string;
  };
  isConnectable: boolean;
};

export const DecisionNode = memo(
  ({ data, isConnectable }: DecisionNodeProps) => {
    const { decision } = data;

    const label = decision ? `decision=${decision}` : "decision";

    return (
      <div className="decision-node">
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
          onConnect={(params) => console.log("handle onConnect", params)}
        />
        <div>
          <span>{label}</span>
        </div>
      </div>
    );
  }
);
