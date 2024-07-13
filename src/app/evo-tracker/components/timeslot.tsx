"use client";

import Image from "next/image";
import Link from "next/link";

function TimeStatus({ startDate }: { startDate: Date }) {
  const twoHoursInMs = 2 * 60 * 60 * 1000;

  // if timeMs is within two hours of now, return "LIVE"
  // if timeMs is in the past, return "ENDED"
  if (
    startDate.getTime() > Date.now() &&
    startDate.getTime() < Date.now() + twoHoursInMs
  ) {
    return (
      <div className="rounded px-2 animate-pulse text-green-200 font-medium text-xs bg-green-800">
        LIVE
      </div>
    );
  } else if (startDate.getTime() < Date.now()) {
    return (
      <div className="rounded px-2 text-gray-200 text-xs bg-gray-900">
        ENDED
      </div>
    );
  }

  // otherwise return "UPCOMING"
  return (
    <div className="rounded px-2 text-white text-xs bg-orange-800">
      UPCOMING
    </div>
  );
}

export default function Timeslot(timeslot: {
  startTimeRaw: number;
  scheduledPlayers: {
    name: string;
    game: string;
    poolId: string;
    station: string;
    url: string;
    participantId: number;
  }[];
}) {
  const date = new Date(timeslot.startTimeRaw * 1000);
  const dayOfWeek = convertDateToDayOfWeek(date);
  return (
    <div className="mb-4">
      <div className="flex items-baseline">
        <h3 className="text-yellow-100 mb-1 flex-grow">
          {dayOfWeek}{" "}
          {date.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}
        </h3>
        <TimeStatus startDate={date} />
      </div>
      <div
        className="divide-y divide-gray-600 border border-gray-600"
        style={{
          boxShadow: "0px 0px 4px 2px rgba(120,120,120,0.2)",
        }}
      >
        {timeslot.scheduledPlayers.map((sch) => {
          return (
            <div
              key={`${sch.poolId}|${sch.name}`}
              className="bg-gray-900 hover:bg-gray-800 flex p-2 items-center"
            >
              <Link
                href={`/evo-tracker/players/${sch.participantId}`}
                style={{ fontSize: "1.2em" }}
                className="flex-none md:w-56 w-32 mr-2"
              >
                {sch.name}
              </Link>
              <Link
                href={`/evo-tracker/players/${sch.participantId}`}
                style={{ flex: "1", lineHeight: "1" }}
              >
                <span className="text-xs md:text-base mr-2">{sch.game}</span>
              </Link>
              <Link
                href={`/evo-tracker/players/${sch.participantId}`}
                style={{ flex: "0 0 50px" }}
              >
                <small style={{ color: "rgba(255,255,255,0.5)" }}>
                  Station
                </small>
                <br />
                {sch.station}
              </Link>
              <Link
                href={sch.url}
                style={{
                  display: "flex",
                  flex: "0 0 80px",
                  textAlign: "right",
                  justifyContent: "flex-end",
                }}
              >
                <div>
                  <small style={{ color: "rgba(255,255,255,0.5)" }}>
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

function convertDateToDayOfWeek(dateIn: Date) {
  const dayOfWeek = dateIn.getDay();
  switch (dayOfWeek) {
    case 0:
      return "Sunday";
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    default:
      return "Unknown";
  }
}
