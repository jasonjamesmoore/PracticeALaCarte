import { useMemo } from "react";

interface CountdownProps {
  size: number;
  timeRemaining: number;
  totalTime: number;
  isRunning: boolean;
  newTimePicked: boolean;
  onClick: () => void;
}

export default function Countdown({
  size,
  timeRemaining,
  totalTime,
  isRunning,
  onClick,
  newTimePicked,
}: CountdownProps) {
  const xy = useMemo(() => size / 2, [size]);
  const stroke = useMemo(() => size / 4, [size]);
  const radius = useMemo(() => (size - stroke) / 2, [size, stroke]);
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);
  const offset = useMemo(
    () => (timeRemaining / totalTime) * circumference,
    [timeRemaining, totalTime, circumference]
  );

  console.log(circumference);

  return (
    <div
      style={{ position: "relative", width: size, height: size }}
      onClick={onClick}
    >
      {timeRemaining > 0 && (
        <svg width={size} height={size}>
          <circle
            cx={xy}
            cy={xy}
            r={radius}
            transform={`rotate(-90 ${xy} ${xy})`}
            stroke="red"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeLinecap="round"
            strokeDashoffset={circumference - offset}
            fill="transparent"
          />
        </svg>
      )}
      <span
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: size / 6,
          fontWeight: 900,
          color: "gray",
        }}
      >
        {isRunning
          ? timeRemaining > 0
            ? ""
            : "Done!"
          : newTimePicked
          ? "Start!"
          : "Done!"}
      </span>
    </div>
  );
}
