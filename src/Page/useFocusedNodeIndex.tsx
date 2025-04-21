import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { NodeData } from "../utils/types";

type UseFocusedNodeIndexProps = {
  nodes: NodeData[] | undefined;
};

export const useFocusedNodeIndex = ({
  nodes = [],
}: UseFocusedNodeIndexProps): [number, Dispatch<SetStateAction<number>>] => {
  const [focusedNodeIndex, setFocusedNodeIndex] = useState(0);

  const safeNodes = nodes || [];

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp") {
        setFocusedNodeIndex((index) => Math.max(index - 1, 0));
      }
      if (event.key === "ArrowDown") {
        setFocusedNodeIndex((index) => Math.min(index + 1, nodes.length - 1));
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [safeNodes]);

  return [focusedNodeIndex, setFocusedNodeIndex];
};
