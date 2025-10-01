import { useState, useEffect, useRef } from "react";
import "../styles.css";

export default function PomodoroClock() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [timerLabel, setTimerLabel] = useState("Session");
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  // Format time MM:SS
  const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // Switch between Session & Break
  useEffect(() => {
    if (timeLeft === 0) {
      audioRef.current.play();
      if (timerLabel === "Session") {
        setTimerLabel("Break");
        setTimeLeft(breakLength * 60);
      } else {
        setTimerLabel("Session");
        setTimeLeft(sessionLength * 60);
      }
    }
  }, [timeLeft, breakLength, sessionLength, timerLabel]);

  const handleStartStop = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
    } else {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      setIsRunning(true);
    }
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setTimerLabel("Session");
    setIsRunning(false);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const changeLength = (type, op) => {
    if (isRunning) return;
    if (type === "break") {
      setBreakLength((prev) =>
        op === "+" && prev < 60 ? prev + 1 : op === "-" && prev > 1 ? prev - 1 : prev
      );
    } else {
      setSessionLength((prev) => {
        const newLen = op === "+" && prev < 60 ? prev + 1 : op === "-" && prev > 1 ? prev - 1 : prev;
        setTimeLeft(newLen * 60);
        return newLen;
      });
    }
  };

  return (
    <div id="clock">
      <h1>Pomodoro (25 + 5) Clock</h1>

      <div className="controls">
        <div className="length-control">
          <h2 id="break-label">Break Length</h2>
          <button id="break-decrement" onClick={() => changeLength("break", "-")}>-</button>
          <span id="break-length">{breakLength}</span>
          <button id="break-increment" onClick={() => changeLength("break", "+")}>+</button>
        </div>

        <div className="length-control">
          <h2 id="session-label">Session Length</h2>
          <button id="session-decrement" onClick={() => changeLength("session", "-")}>-</button>
          <span id="session-length">{sessionLength}</span>
          <button id="session-increment" onClick={() => changeLength("session", "+")}>+</button>
        </div>
      </div>

      <div id="timer-label">{timerLabel}</div>
      <div id="time-left">{formatTime(timeLeft)}</div>

      <div id="button-container">
        <button id="start_stop" onClick={handleStartStop}>
          {isRunning ? "Pause" : "Start"}
        </button>
        <button id="reset" onClick={handleReset}>Reset</button>
      </div>

      <audio
        id="beep"
        ref={audioRef}
        src="https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
        preload="auto"
      />
    </div>
  );
}
