import { Calendar } from 'fullcalendar';
import { useRef, useEffect } from 'react';

export default function EventsCalendar() {
  const calendarRef = useRef(null);

  useEffect(() => {
    const calendarEl = calendarRef.current;
    const calendar = calendarEl ? new Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      themeSystem: 'bootstrap',
      events: [
        {
          title: 'Event 1',
          start: '2023-06-27'
        },
        {
          title: 'Event 2',
          start: '2022-01-05',
          end: '2022-01-07'
        }
      ]
    }) : null;
    calendar?.render();
  }, []);

  return (
    <div ref={calendarRef} style={{ width: '75%', margin: 'auto' }}></div>
  );
}