import { NodeData, NodeType } from "../utils/types";
import { BasicNode } from "./BasicNode";
import { ImageNode } from "./ImageNode";
import { PageNode } from "./PageNode";
import { TimerNode }  from "./TimerNode";
// import { useAppState } from "../State/AppStateContext";

type NodeTypeSwitcherProps = {
  node: NodeData;
  updateFocusedIndex(index: number): void;
  isFocused: boolean;
  index: number;
};

const TEXT_NODE_TYPES: NodeType[] = [
  "text",
  "list",
  "heading1",
  "heading2",
  "heading3",
];

export const NodeTypeSwitcher = ({
  node,
  updateFocusedIndex,
  isFocused,
  index,
}: NodeTypeSwitcherProps) => {
  // console.log("Node type:", node.type);
  // console.log("Rendering NodeTypeSwitcher with node:", node);
  // const { nodes } = useAppState();
  // console.log("Nodes state in NodeTypeSwitcher:", nodes);
  if (TEXT_NODE_TYPES.includes(node.type)) {
    // console.log("Rendering BasicNode from NodeTypeSwitcher");
    return (
      <BasicNode
        node={node}
        updateFocusedIndex={updateFocusedIndex}
        isFocused={isFocused}
        index={index}
      />
    );
  }

  if (node.type == "page") {
    return <PageNode node={node} isFocused={isFocused} index={index} />;
  }

  if (node.type === "image") {
    return <ImageNode node={node} isFocused={isFocused} index={index} />;
  }

  if (node.type === "timer") {
    console.log("Node data passed to TimerNode:", node);
    return <TimerNode node={node} isFocused={isFocused} index={index} />;
  }
  return null;
};
