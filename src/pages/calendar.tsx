import { Calendar } from 'fullcalendar';
import { useRef, useEffect } from 'react';

export default function EventsCalendar() {
  const calendarRef = useRef(null);

  useEffect(() => {
    const calendarEl = calendarRef.current;
    const calendar = calendarEl ? new Calendar(calendarEl, {
      timeZone: 'America/Anchorage',
      initialView: 'dayGridMonth',
      height: 'auto',
      events: [
        {
          title: 'SF6 Online Ranbat Week 3 (Check in 8PM)',
          start: '2023-07-01 20:00:00',
          url: 'https://akg.challonge.com',
          display: 'block',
        },
        {
          title: 'Monday Night Combat',
          start: '2023-07-03',
          // textColor: 'red',
          borderColor: 'red',
        },
        // {
        //   title: 'test',
        //   daysOfWeek: [0, 1],
        // }
      ]
    }) : null;
    calendar?.render();
  }, []);

  return (
    <div ref={calendarRef}></div>
  );
}