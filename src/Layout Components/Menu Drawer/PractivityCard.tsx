import { useDrag } from "react-dnd";
import { Card } from "@mantine/core";
import { DragItem, NodeType } from "../../utils/types";
import { useAppState } from "../../State/AppStateContext";
import { nanoid } from "nanoid";
import { useRef } from "react";

type PractivityCardProps = {
  type: NodeType;
  content: string;
  onDragStart?: () => void;
};

const PractivityCard = ({
  type,
  content,
  onDragStart,
}: PractivityCardProps) => {
  const { addNode, nodes, removeNodeByIndex } = useAppState();
  const placeholderIdRef = useRef(`placeholder-${nanoid()}`);
  const hasAddedPlaceholder = useRef(false);

  const [{ isDragging }, drag] = useDrag<
    DragItem,
    unknown,
    { isDragging: boolean }
  >(
    () => ({
      type: "menu-item",
      item: () => {
        if (onDragStart) onDragStart();

        if (!hasAddedPlaceholder.current) {
          const placeholderId = placeholderIdRef.current;

          const existingPlaceholder = nodes?.findIndex(
            (node) => node.type === "placeholder"
          );
          if (existingPlaceholder >= 0) {
            removeNodeByIndex(existingPlaceholder);
          }

          console.log("🟢 Creating placeholder with ID:", placeholderId);

          addNode(
            {
              id: placeholderId,
              type: "placeholder",
              value: content,
              isPlaceholder: true,
            },
            nodes?.length || 0
          );

          hasAddedPlaceholder.current = true;

          return {
            type,
            content,
            placeholderId,
          };
        }

        console.log(
          "🟢 Returning drag item with placeholderId:",
          placeholderIdRef.current
        );
        return {
          type,
          content,
          placeholderId: placeholderIdRef.current,
        };
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (_, monitor) => {
        console.log("🟠 Drag ended");
        if (!monitor.didDrop()) {
          console.log("🟠 Drag canceled, removing placeholder");
          // Find and remove the placeholder if drag didn't result in a drop
          const placeholderId = placeholderIdRef.current;
          const placeholderIndex = nodes?.findIndex(
            (node) => node.id === placeholderId
          );

          if (placeholderIndex !== undefined && placeholderIndex >= 0) {
            console.log(
              "🟠 Found placeholder to remove at index:",
              placeholderIndex
            );
            removeNodeByIndex(placeholderIndex);
          }
        }

        hasAddedPlaceholder.current = false;
      },
    }),
    [type, content, addNode, nodes, onDragStart]
  );

  return (
    <Card
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
        padding: "10px",
        margin: "5px",
        backgroundColor: "lightgray",
        textAlign: "center",
      }}
    >
      {content}
    </Card>
  );
};

export default PractivityCard;
