'use client';

import { useState, useEffect } from 'react';

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Set end date to May 19, 2025 at 00:00:00
    const endDate = new Date('2025-05-17T00:00:00').getTime();
    
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = endDate - now;

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    // Update immediately
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full px-[26px] mx-auto my-8">
      <div className="bg-black text-white p-4">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-[12px] font-[300]">Days</div>
            <div className="text-[40px] font-bold">{timeLeft.days}</div>
          </div>
          <div>
            <div className="text-[12px] font-[300]">Hours</div>
            <div className="text-[40px] font-bold">{timeLeft.hours}</div>
          </div>
          <div>
            <div className="text-sm">Minutes</div>
            <div className="text-[40px] font-bold">{timeLeft.minutes}</div>
          </div>
          <div>
            <div className="text-sm">Seconds</div>
            <div className="text-[40px] font-bold">{timeLeft.seconds}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;