import { useFocusedNodeIndex } from "./useFocusedNodeIndex";
import { Cover } from "./Cover";
import { Spacer } from "./Spacer";
import { NodeContainer } from "../Node/NodeContainer";
import { Title } from "./Title";
import { nanoid } from "nanoid";
import { useAppState } from "../State/AppStateContext";
import { DndContext, DragOverlay, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DragItem } from "../utils/types";
// import { DropZone } from "../Layout Components/Menu Drawer/DropZone";
import { useDrop } from "react-dnd";
import { useState } from "react";

export const Page = () => {
  const {
    title,
    nodes,
    addNode,
    setTitle,
    reorderNodes,
    cover,
    setCoverImage,
    removeNodeByIndex,
  } = useAppState();

  const [focusedNodeIndex, setFocusedNodeIndex] = useFocusedNodeIndex({
    nodes,
  });

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const handleNodeHover = (index: number) => {
    if (hoverIndex !== index) {
      setHoverIndex(index);

      const placeholderIndex = nodes?.findIndex(
        (node) => node.type === "placeholder"
      );
      if (
        placeholderIndex !== undefined &&
        placeholderIndex >= 0 &&
        placeholderIndex !== index
      ) {
        const newNodes = [...nodes];
        const [placeholder] = newNodes.splice(placeholderIndex, 1);
        newNodes.splice(index, 0, placeholder);
        setHoverIndex(index);
      }
    }
  };
  const handleDragEvent = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over?.id && active.id !== over?.id) {
      reorderNodes(active.id as string, over.id as string);
    }
  };

  const handleMenuItemDrop = (item: DragItem) => {
    console.log("🔵 Drop item received:", item);

    // Find placeholder regardless of ID (as backup)
    let placeholderIndex = nodes?.findIndex(
      (node) => node.id === item.placeholderId
    );

    // If not found by ID, try finding by type as backup
    if (placeholderIndex === -1) {
      placeholderIndex = nodes?.findIndex(
        (node) => node.type === "placeholder"
      );
    }

    console.log("🔵 Placeholder index found:", placeholderIndex);

    if (placeholderIndex !== undefined && placeholderIndex >= 0) {
      console.log("🔵 Replacing placeholder at index:", placeholderIndex);

      // Replace the placeholder instead of removing then adding
      const updatedNodes = [...nodes];
      updatedNodes[placeholderIndex] = {
        type: item.type,
        value: item.content,
        id: nanoid(),
      };

      // Update the state with the modified array
      // Use your state update method here to replace the whole array
    } else {
      console.log("🔵 Placeholder not found, adding at end");
      addNode(
        {
          type: item.type,
          value: item.content,
          id: nanoid(),
        },
        nodes?.length || 0
      );
    }
  };

  const [{ isOver }, dropRef] = useDrop<DragItem, unknown, { isOver: boolean }>(
    {
      accept: "menu-item",
      drop: (item) => {
        handleMenuItemDrop(item);
        return { handled: true };
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }
  );

  return (
    <>
      <Cover filePath={cover} changePageCover={setCoverImage} />
      <div
        ref={dropRef}
        style={{
          minHeight: "100vh",
          border: isOver ? "2px dashed blue" : "2px dashed transparent",
        }}
      >
        {/* <DropZone onDrop={handleDrop} /> */}
        <Title addNode={addNode} title={title} changePageTitle={setTitle} />
        <DndContext onDragEnd={handleDragEvent}>
          <SortableContext
            items={nodes || []}
            strategy={verticalListSortingStrategy}
          >
            {(nodes || []).map((node, index) => (
              <div key={node.id} className="node-drop-zone">
                {!node.isPlaceholder && (
                  <div
                    className="drop-indicator"
                    style={{
                      height: "10px",
                      background: isOver ? "rgba(0,0,255,0.1)" : "transparent",
                      transition: "background 0.2s",
                    }}
                  />
                )}
                <NodeContainer
                  key={node.id}
                  node={node}
                  isFocused={focusedNodeIndex === index}
                  updateFocusedIndex={setFocusedNodeIndex}
                  index={index}
                />
              </div>
            ))}
          </SortableContext>
          <DragOverlay />
        </DndContext>
        <Spacer
          handleClick={() => {
            addNode(
              { type: "text", value: "", id: nanoid() },
              nodes?.length || 0
            );
          }}
          showHint={!nodes?.length}
        />
      </div>
    </>
  );
};
