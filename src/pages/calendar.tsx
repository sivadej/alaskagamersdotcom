import { Calendar } from 'fullcalendar';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import * as z from 'zod';

const googleSheetId = process.env.NEXT_PUBLIC_EVENTS_CALENDAR_GOOGLE_SHEET_ID ?? '';
const apiKey = process.env.NEXT_PUBLIC_EVENTS_CALENDAR_GOOGLE_API_KEY ?? '';

interface BasicEvent {
  title: string;
  start: string;
  url?: string;
  borderColor?: string;
}

const eventSchema = z.object({
  title: z.string().min(1),
  start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  url: z.string().optional(),
  borderColor: z.string().optional(),
});

function validateEvent(event: unknown): BasicEvent | null {
  const result = eventSchema.safeParse(event);

  if (result.success) {
    return result.data;
  } else {
    return null;
  }
}

export async function getServerSideProps() {
  const doc = new GoogleSpreadsheet(googleSheetId, { apiKey });
  await doc.loadInfo();

  const sheet = doc.sheetsByIndex[0];
  const rows = (await sheet.getRows()).map((row) => row.toObject());
  const mappedRows: BasicEvent[] = rows.map(({ date, title, url }) => ({
    title: title,
    start: date,
    url: url ?? '',
    borderColor: url ? '#F7B316' : '#072944',
  }));
  const validatedEvents = mappedRows.map(validateEvent).filter((event) => event !== null);

  return {
    props: {
      events: validatedEvents,
    },
  };
}

export default function EventsCalendar(props: { events: BasicEvent[] }) {
  const calendarRef = useRef(null);

  useEffect(() => {
    function loadCalendar() {
      const calendarEl = calendarRef.current;
      if (calendarEl) {
        (calendarEl as HTMLDivElement).innerHTML = '';
        const calendar = new Calendar(calendarEl, {
          timeZone: 'America/Anchorage',
          initialView: 'dayGridMonth',
          height: 'auto',
          events: props?.events ?? [] as any[],
        });
        calendar.render();
      }

    }
    loadCalendar();
  }, []);

  return (
    <div className="p-2 sm:p-8">
      <Link href="/">
      <Image
        className="relative dark:drop-shadow"
        src="/akgamers-logo-pngcmyk.png"
        alt="AKGamers"
        width={200}
        height={50}
        priority
      />
      </Link>
      <div ref={calendarRef}>Loading Calendar...</div>
    </div>
  );
}