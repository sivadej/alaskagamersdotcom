"use client";
import Image from "next/image";
import Link from "next/link";

function Timeslot(timeslot: PoolSchedule) {
  const date = new Date(timeslot.startTimeRaw * 1000);
  const dayOfWeek = convertDateToDayOfWeek(date);
  return (
    <div className="mb-4">
      <h3 className="text-yellow-100 mb-1">
        {dayOfWeek}{" "}
        {date.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })}
      </h3>
      <div
        className="divide-y divide-gray-600 border border-gray-600"
        style={{
          boxShadow: "0px 0px 4px 2px rgba(120,120,120,0.2)",
        }}
      >
        <div
          key={`todo`}
          className="bg-gray-900 hover:bg-gray-800 flex p-2 items-center"
        >
          <div
            style={{ fontSize: "1.2em" }}
            className="flex-none md:w-56 w-32 mr-2"
          >
            <Link href={`/evo-tracker/${"todo"}`}>{"todo"}</Link>
          </div>
          <div style={{ flex: "1" }}>
            <span className="text-xs md:text-base mr-2">{timeslot.game}</span>
          </div>
          <div style={{ flex: "0 0 50px" }}>
            <small style={{ color: "rgba(255,255,255,0.5)" }}>Station</small>
            <br />
            {timeslot.station}
          </div>
          <div
            style={{
              display: "flex",
              flex: "0 0 80px",
              textAlign: "right",
              justifyContent: "flex-end",
            }}
          >
            <a href={timeslot.bracketUrl}>
              <small style={{ color: "rgba(255,255,255,0.5)" }}>Bracket</small>
              <div className="text-blue-400 flex items-center">
                {timeslot.poolId}
                <Image
                  src="/startgg-logo.svg"
                  className="ml-1"
                  width={16}
                  height={16}
                  alt="Start.gg"
                />
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PlayerSchedule({
  schedule,
}: {
  schedule: PoolSchedule[];
}) {
  return (
    <div>
      <h2 className="text-lg text-yellow-100">Schedule</h2>
      {schedule.map((timeslot) => {
        return <Timeslot key={timeslot.poolId} {...timeslot} />;
      })}
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

interface PoolSchedule {
  poolId: string;
  game: string | null;
  startTimeRaw: number | null;
  startTimeLocal: string | null;
  startDayLocal: string | null;
  bracketUrl: string | null;
  station: string | null;
}
