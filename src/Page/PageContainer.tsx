import { useDragLayer } from "react-dnd";
import { useState, useEffect } from "react";

export function PageContainer({ children }: { children: React.ReactNode }) {
  const isDraggingFromMonitor = useDragLayer((monitor) => monitor.isDragging());
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (isDraggingFromMonitor) {
      setIsDragging(true);
    } else {
      const timeout = setTimeout(() => setIsDragging(false), 100);
      return () => clearTimeout(timeout);
    }
  }, [isDraggingFromMonitor]);

  useEffect(() => {
    console.log("isDragging updated:", isDragging);
  }, [isDragging]);

  return (
    <div
      style={{
        border: isDragging ? "2px dashed gray" : "none",
        padding: "20px",
        minHeight: "100vh", // Ensure full-page height
        transition: "border 0.2s ease-in-out",
      }}
    >
      {children}
    </div>
  );
}
