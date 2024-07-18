'use client';

import Image from 'next/image';
import Link from 'next/link';
import { convertDateToDayOfWeek } from '../common/functions';
import { SchedulesByBlock } from '../common/types';

export default function Timeslot(timeslot: SchedulesByBlock) {
  const date = new Date(timeslot.startTimeRaw * 1000);
  const dayOfWeek = convertDateToDayOfWeek(date);
  return (
    <div className="mb-4">
      <div className="flex items-baseline">
        <h3 className="text-yellow-100 mb-1 flex-grow">
          {dayOfWeek}{' '}
          {date.toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZoneName: 'short',
          })}
        </h3>
        <TimeStatus startDate={date} />
      </div>
      <div
        className="divide-y divide-gray-600 border border-gray-600"
        style={{
          boxShadow: '0px 0px 4px 2px rgba(120,120,120,0.2)',
        }}
      >
        {timeslot.scheduledPlayers.map((sch) => {
          const bgClass = sch.advanced
            ? 'bg-indigo-950 hover:bg-indigo-900'
            : 'bg-gray-900 hover:bg-gray-800';
          return (
            <div
              key={`${sch.poolId}|${sch.name}`}
              className={`${bgClass} flex p-2 items-center`}
            >
              <Link
                href={`/evo-tracker/players/${sch.participantId}`}
                style={{ fontSize: '1.2em' }}
                className="flex-none md:w-56 w-32 mr-2"
              >
                {sch.name}
              </Link>
              <Link
                href={`/evo-tracker/players/${sch.participantId}`}
                style={{ flex: '1', lineHeight: '1' }}
              >
                <span className="text-xs md:text-base mr-2">{sch.game}</span>
              </Link>
              <Link
                href={`/evo-tracker/players/${sch.participantId}`}
                style={{ flex: '0 0 50px' }}
              >
                <small style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Station
                </small>
                <br />
                {sch.station}
              </Link>
              <Link
                href={sch.url}
                style={{
                  display: 'flex',
                  flex: '0 0 80px',
                  textAlign: 'right',
                  justifyContent: 'flex-end',
                }}
              >
                <div>
                  <small style={{ color: 'rgba(255,255,255,0.5)' }}>
                    Bracket
                  </small>
                  <div className="text-blue-400 flex items-center">
                    {sch.poolId}
                    <Image
                      src="/startgg-logo.svg"
                      className="ml-1"
                      width={16}
                      height={16}
                      alt="Start.gg"
                    />
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const TWO_HOURS_IN_MS = 2 * 60 * 60 * 1000;

function TimeStatus({ startDate }: { startDate: Date }) {
  const bracketStartTimeMs = startDate.getTime();
  const nowMs = Date.now();
  const timeDiffMs = bracketStartTimeMs - nowMs;

  if (timeDiffMs > 0) {
    return (
      <div className="rounded px-2 text-white text-xs bg-orange-800">
        UPCOMING
      </div>
    );
  }

  if (timeDiffMs <= 0) {
    if (Math.abs(timeDiffMs) < TWO_HOURS_IN_MS) {
      return (
        <div className="rounded px-2 animate-pulse text-green-200 font-medium text-xs bg-green-800">
          LIVE
        </div>
      );
    } else {
      return (
        <div className="rounded px-2 text-gray-200 text-xs bg-gray-900">
          ENDED
        </div>
      );
    }
  }
}
