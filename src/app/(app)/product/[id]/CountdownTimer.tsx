"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  endTime: string;
}

export default function CountdownTimer({ endTime }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const end = new Date(endTime);
      const diff = end.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft("Offer Ended");
        clearInterval(timer);
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  return <span className="text-lg font-bold text-red-600">{timeLeft}</span>;
}
