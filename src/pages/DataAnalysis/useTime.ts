/* eslint-disable import/newline-after-import */
import { useEffect, useState } from 'react';
interface Time {
  startTime: number;
  endTime: number;
}
export default function useTime(): Time {
  const [time, setTime] = useState<Time>({
    startTime: new Date(new Date().setHours(0, 0, 0, 0)).valueOf(),
    endTime: Math.round(new Date().getTime().valueOf()),
  });
  useEffect(() => {
    setTime({
      startTime: new Date(new Date().setHours(0, 0, 0, 0)).valueOf(),
      endTime: Math.round(new Date().getTime().valueOf()),
    });
  }, []);
  return time;
}
