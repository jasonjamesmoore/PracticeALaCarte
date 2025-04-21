import { NodeData } from "../utils/types";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { NodeTypeSwitcher } from "./NodeTypeSwitcher";
import styles from "./NodeContainer.module.css";

type NodeContainerProps = {
  node: NodeData;
  updateFocusedIndex(index: number): void;
  isFocused: boolean;
  index: number;
};

export const NodeContainer = ({
  node,
  index,
  isFocused,
  updateFocusedIndex,
}: NodeContainerProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: node.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const containerStyle = {
    ...(node.isPlaceholder
      ? {
          opacity: 0.6,
          border: "2px dashed #3498db",
          backgroundColor: "#edf7ff",
          padding: "10px",
          borderRadius: "4px",
          marginBottom: "8px",
        }
      : {}),
  };

  if (node.isPlaceholder) {
    return (
      <div style={containerStyle} className="node-placeholder">
        <div className="placeholder-content">
          <span>Will add: {node.value}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={styles.container}
    >
      <div {...listeners} className={styles.dragHandle}>
        ⠿
      </div>
      <NodeTypeSwitcher
        node={node}
        updateFocusedIndex={updateFocusedIndex}
        isFocused={isFocused}
        index={index}
      />
    </div>
  );
};
