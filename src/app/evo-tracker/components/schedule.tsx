import { getAllPlayers } from '../common/fetchData';
import { buildFullSchedule, sortPlayerNames } from '../common/functions';
import Collapse from './collapse';
import Timeslot from './timeslot';

export default async function Schedule() {
  const playerData = await getAllPlayers();
  const schedule = buildFullSchedule(playerData);

  if (!schedule) return <>Something went wrong.</>;

  const fridaySchedule = schedule.filter(
    (timeslot) => (timeslot.startTimeUtc ?? '') < '2024-07-20T07:00:00Z',
  );

  const saturdaySchedule = schedule.filter(
    (timeslot) =>
      (timeslot.startTimeUtc ?? '') < '2024-07-21T07:00:00Z' &&
      (timeslot.startTimeUtc ?? '') >= '2024-07-20T07:00:00Z',
  );

  const sundaySchedule = schedule.filter(
    (timeslot) => (timeslot.startTimeUtc ?? '') >= '2024-07-21T07:00:00Z',
  );

  return (
    <>
      {/* Scroll to now */}
      {/* Filter by games */}
      <Collapse title="Friday Schedule">
        {sortPlayerNames(fridaySchedule).map((sch) => (
          <Timeslot key={sch.startTimeRaw} {...sch} />
        ))}
      </Collapse>

      {sortPlayerNames(saturdaySchedule).map((sch) => (
        <Timeslot key={sch.startTimeRaw} {...sch} />
      ))}

      {sortPlayerNames(sundaySchedule).map((sch) => (
        <Timeslot key={sch.startTimeRaw} {...sch} />
      ))}
    </>
  );
}
