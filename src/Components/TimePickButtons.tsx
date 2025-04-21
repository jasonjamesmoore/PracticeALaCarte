import "./TimePickButtons.css";
import { Button } from "@mantine/core";

interface TimePickButtonProps {
  time: number;
  displayTime: string;
  onPick: (newTime: number) => void;
  isActive: boolean;
}

export default function TimePickButton({
  time,
  displayTime,
  onPick,
  isActive,
}: TimePickButtonProps) {
  const handleClick = () => {
    onPick(time);
  };

  return (
    <Button
      size="compact-sm"
      variant="default"
      radius="md"
      onClick={handleClick}
      className="add-stem-button"
    >
      {isActive ? (
        <span className="active">{displayTime}</span>
      ) : (
        <span className="inactive">{displayTime}</span>
      )}
    </Button>
  );
}
