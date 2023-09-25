import { useCallback } from "react";
import { useReactFlow } from "reactflow";

import "./ControlNodeMenu.css";

export function ControlNodeMenu({ id, top, left, right, bottom, ...props }) {
  const { getNode, setNodes, addNodes, setEdges } = useReactFlow();

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
        <select>
          <option>name</option>
          <option>age</option>
        </select>
      </div>
      <div className="update-option">
        <button onClick={() => {}}>Operator</button>
        <select>
          <option>{">="}</option>
          <option>{"<"}</option>
        </select>
      </div>
      <div className="update-option">
        <button onClick={() => {}}>Value</button>
        <input type="text" />
      </div>
    </div>
  );
}
