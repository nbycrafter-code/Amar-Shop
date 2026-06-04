'use client'
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface CountdownTimerProps {
  days: number;
  hours: number;
  mins: number;
  secs: number;
}

interface TimeState {
  days: number;
  hours: number;
  mins: number;
  secs: number;
}

interface Labels {
  days: string;
  hours: string;
  mins: string;
  secs: string;
}

export const CountdownTimer = ({
  days,
  hours,
  mins,
  secs,
}: CountdownTimerProps) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  
  const [time, setTime] = useState<TimeState>({ days, hours, mins, secs });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        let newSecs = prev.secs - 1;
        let newMins = prev.mins;
        let newHours = prev.hours;
        let newDays = prev.days;

        if (newSecs < 0) {
          newSecs = 59;
          newMins--;
        }
        if (newMins < 0) {
          newMins = 59;
          newHours--;
        }
        if (newHours < 0) {
          newHours = 23;
          newDays--;
        }
        if (newDays < 0) {
          return { days: 0, hours: 0, mins: 0, secs: 0 };
        }

        return { days: newDays, hours: newHours, mins: newMins, secs: newSecs };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const labels: Labels = {
    days: isBn ? "দিন" : "DAYS",
    hours: isBn ? "ঘন্টা" : "HRS",
    mins: isBn ? "মিনিট" : "MIN",
    secs: isBn ? "সেকেন্ড" : "SEC"
  };

  return (
    <div className="flex gap-1 text-xs font-semibold">
      <div className="bg-[#ef553f] text-white px-2 py-1 rounded text-center min-w-[45px]">
        <div className="text-sm font-bold">{String(time.days).padStart(2, "0")}</div>
        <span className="block text-[8px] font-normal uppercase tracking-wide">{labels.days}</span>
      </div>
      <div className="bg-[#ef553f] text-white px-2 py-1 rounded text-center min-w-[45px]">
        <div className="text-sm font-bold">{String(time.hours).padStart(2, "0")}</div>
        <span className="block text-[8px] font-normal uppercase tracking-wide">{labels.hours}</span>
      </div>
      <div className="bg-[#ef553f] text-white px-2 py-1 rounded text-center min-w-[45px]">
        <div className="text-sm font-bold">{String(time.mins).padStart(2, "0")}</div>
        <span className="block text-[8px] font-normal uppercase tracking-wide">{labels.mins}</span>
      </div>
      <div className="bg-[#ef553f] text-white px-2 py-1 rounded text-center min-w-[45px]">
        <div className="text-sm font-bold">{String(time.secs).padStart(2, "0")}</div>
        <span className="block text-[8px] font-normal uppercase tracking-wide">{labels.secs}</span>
      </div>
    </div>
  );
};