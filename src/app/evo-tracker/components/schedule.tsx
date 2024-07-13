import { getAllPlayers } from "../common/fetchData";
import { buildFullSchedule } from "../common/functions";
import Timeslot from "./timeslot";

export default async function Schedule() {
  const playerData = await getAllPlayers();
  const schedule = buildFullSchedule(playerData);

  if (!schedule) return <>Something went wrong.</>;

  return (
    <>
      {/* Scroll to now */}
      {/* Search by name */}
      {/* Filter by games */}
      {schedule.map((sch) => (
        <Timeslot key={sch.startTimeRaw} {...sch} />
      ))}
    </>
  );
}
