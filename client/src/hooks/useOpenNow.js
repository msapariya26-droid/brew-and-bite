import { useState, useEffect } from 'react';
import { siteConfig } from '../config/site';

// Helper to parse time like "7:00 AM" into minutes since midnight
function parseTime(timeStr) {
  const [time, period] = timeStr.trim().split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  
  if (period.toUpperCase() === 'PM' && hours !== 12) {
    hours += 12;
  }
  if (period.toUpperCase() === 'AM' && hours === 12) {
    hours = 0;
  }
  
  return hours * 60 + minutes;
}

// Map day index (0=Sun, 1=Mon, ...) to its corresponding hours
function getDaySchedule(dayIndex) {
  const isWeekend = dayIndex === 0 || dayIndex === 6;
  const scheduleStr = isWeekend 
    ? siteConfig.hours.find(h => h.label.includes('Sat - Sun'))?.time 
    : siteConfig.hours.find(h => h.label.includes('Mon - Fri'))?.time;
    
  if (!scheduleStr) return null;
  
  const [openStr, closeStr] = scheduleStr.split(' - ');
  return {
    open: parseTime(openStr),
    close: parseTime(closeStr)
  };
}

export function useOpenNow() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkOpenStatus = () => {
      const now = new Date();
      const currentDay = now.getDay();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      
      const schedule = getDaySchedule(currentDay);
      if (schedule) {
        if (schedule.close < schedule.open) {
          // Handles cases where closing time is after midnight (e.g., 2:00 AM)
          setIsOpen(currentMinutes >= schedule.open || currentMinutes < schedule.close);
        } else {
          setIsOpen(currentMinutes >= schedule.open && currentMinutes < schedule.close);
        }
      } else {
        setIsOpen(false);
      }
    };

    checkOpenStatus();
    const intervalId = setInterval(checkOpenStatus, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, []);

  return { isOpen };
}
