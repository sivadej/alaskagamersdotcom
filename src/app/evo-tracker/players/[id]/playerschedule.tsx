"use client";

import Image from "next/image";
import Link from "next/link";
import { PoolSchedule } from "../../common/types";
import { convertDateToDayOfWeek } from "../../common/functions";

export default function PlayerSchedule({
  schedule,
}: {
  schedule: PoolSchedule[];
}) {
  return (
    <div>
      {schedule.map((timeslot) => {
        return (
          <div key={timeslot.poolId}>
            <Timeslot {...timeslot} />
          </div>
        );
      })}
    </div>
  );
}

function Timeslot(timeslot: PoolSchedule) {
  const date = new Date((timeslot?.startTimeRaw ?? 0) * 1000);
  const dayOfWeek = convertDateToDayOfWeek(date);
  return (
    <div className="mb-1">
      <div
        className="divide-y divide-gray-600 border border-gray-600"
        style={{
          boxShadow: "0px 0px 4px 2px rgba(120,120,120,0.2)",
        }}
      >
        <div className="bg-gray-900 hover:bg-gray-800 flex p-2 items-center">
          <div className="flex-none w-24 md:w-40 mr-2">
            {dayOfWeek}
            <br />
            {date.toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </div>
          <div style={{ flex: "1", lineHeight: "1" }}>
            <span className="mr-4">{timeslot.game}</span>
          </div>
          <div style={{ flex: "0 0 60px" }}>
            <small style={{ color: "rgba(255,255,255,0.5)" }}>Station</small>
            <br />
            {timeslot.station}
          </div>
          <div
            style={{
              display: "flex",
              flex: "0 0 60px",
              textAlign: "right",
              justifyContent: "flex-end",
            }}
          >
            <a href={timeslot.bracketUrl ?? ""}>
              <small style={{ color: "rgba(255,255,255,0.5)" }}>Bracket</small>
              <div className="text-blue-400 flex items-center">
                {timeslot.poolId}
                <Image
                  src="/startgg-logo.svg"
                  className="ml-1"
                  width={16}
                  height={16}
                  alt="start.gg"
                />
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
