import { useDrop, useDragLayer } from "react-dnd";
import { NodeType } from "../../utils/types";

type DropZoneProps = {
  onDrop: (nodeType: NodeType) => void;
};

export function DropZone({ onDrop }: DropZoneProps) {
  const [{ isOver }, dropRef] = useDrop({
    accept: ["text"],
    drop: (item: { type: NodeType }) => {
      onDrop(item.type);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  // const isDragging = useDragLayer((monitor) => !!monitor.getItem());

  return (
    <div
      ref={dropRef}
      style={{
        // height: "100%",
        // border: "2px dashed gray",
        backgroundColor: isOver ? "lightblue" : "white",
        // display: isDragging ? "flex" : "none", // Hides but keeps it in the DOM
        // alignItems: "center",
        // justifyContent: "center",
        // margin: "10px 0",
      }}
    >
      {isOver ? "Release to Drop" : "Drag an item here"}
    </div>
  );
}
