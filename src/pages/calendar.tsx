import HomeLogo from '@/components/HomeLogo';
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

export default function EventsCalendar() {
  const calendarRef = useRef(null);

  useEffect(() => {
    async function loadCalendar() {
      const doc = new GoogleSpreadsheet(
        googleSheetId,
        {
          apiKey,
        });
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
      console.log({ mappedRows });
      console.log({ validatedEvents });

      const calendarEl = calendarRef.current;
      if (calendarEl) {
        (calendarEl as HTMLDivElement).innerHTML = '';
        const calendar = new Calendar(calendarEl, {
          timeZone: 'America/Anchorage',
          initialView: 'dayGridMonth',
          height: 'auto',
          events: validatedEvents as any[],
        });
        calendar.render();
      }

    }
    loadCalendar();
  }, []);

  return (
    <main className="flex min-h-screen flex-col p-2 sm:p-8">
      <Link href="/">
        <HomeLogo />
      </Link>
      <div ref={calendarRef}>Loading Calendar...</div>
    </main>
  );
}