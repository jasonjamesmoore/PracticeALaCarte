import { NodeData } from "../utils/types";
import { useAppState } from "../State/AppStateContext";
import { Card } from "@mantine/core";
import { useEffect, useState } from "react";
import Countdown from "../Components/Countdown";
import TimePickButton from "../Components/TimePickButtons";
import Sound from "../assets/Alarming.mp3";
import { Button } from "@mantine/core";

import styles from "./TimerNode.module.css";

type TimerNodeProps = {
  node: NodeData;
  isFocused: boolean;
  index: number;
};

export const TimerNode = ({ node, isFocused, index }: TimerNodeProps) => {
  console.log("TimerNode rendering with props:", { node, isFocused, index });
  const { removeNodeByIndex } = useAppState();
  const [totalTime, setTotalTime] = useState(3);
  const [seconds, setSeconds] = useState(totalTime);
  const [isRunning, setIsRunning] = useState(false);
  const [newTimePicked, setNewTimePicked] = useState(true);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      if (event.key === "Backspace") {
        removeNodeByIndex(index);
      }
    };
    if (isFocused) {
      window.addEventListener("keydown", handleKeyDown);
    } else {
      window.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFocused, removeNodeByIndex, index, node]);

  function playSound() {
    const audio = new Audio(Sound);
    audio.volume = 0.7;
    audio.play();
  }

  useEffect(() => {
    if (!isRunning) return;

    setSeconds(totalTime);
    const i = setInterval(() => {
      setSeconds((s) => {
        if (s > 1) return s - 1;
        clearInterval(i);
        setIsRunning(false);
        setNewTimePicked(false);
        playSound();
        return 0;
      });
    }, 1000);

    return () => {
      clearInterval(i);
    };
  }, [isRunning, totalTime]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleTimeChange = (newTime: number) => {
    setIsRunning(false);
    setTotalTime(newTime);
    setSeconds(newTime);
    setNewTimePicked(true);
  };

  return (
    <>
    <Card shadow="xl" className={styles.timerNode}>
    <div className={styles.timerNodeContainer}>
      {/* <div className={styles.darkModeToggle}><DarkModeToggle /></div> */}
      <div className={styles.countdownContainer}>
        <Countdown
          size={150}
          timeRemaining={seconds}
          totalTime={totalTime}
          onClick={handleStart}
          isRunning={isRunning}
          newTimePicked={newTimePicked}
        />
      </div>
      <Button.Group className={styles.timePickButtons}>
        <TimePickButton
          time={1800}
          displayTime="30 min"
          onPick={handleTimeChange}
          isActive={totalTime === 1800}
        />
        <TimePickButton
          time={900}
          displayTime="15 min"
          onPick={handleTimeChange}
          isActive={totalTime === 900}
        />
        <TimePickButton
          time={300}
          displayTime="5 min"
          onPick={handleTimeChange}
          isActive={totalTime === 300}
        />
      </Button.Group>
    </div>
    </Card>
    </>
    
    
  );
};
