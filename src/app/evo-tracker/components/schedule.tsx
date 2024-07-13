import Timeslot from "./timeslot";
import { getAllPlayers } from "../common/fetchData";
import {
  SchedulesByBlock,
  PlayerResult,
  EventResult,
  SetResult,
  PoolSchedule,
} from "../common/types";
import { convertDateToDayOfWeek } from "../common/functions";

export default async function Schedule() {
  const playerData = await getAllPlayers();
  const schedule = buildFullSchedule(playerData);

  if (!schedule) return <>Something went wrong. Let Bomby know!</>;

  return (
    <div style={{ minWidth: "350px", maxWidth: "720px", margin: "auto" }}>
      {/* View All Players */}
      {/* View Schedule */}
      {/* Scroll to now */}
      {/* Search by name */}
      {/* Filter by games */}
      {/* <h1 className="text-yellow-400 mb-4 text-xl">Schedule</h1> */}
      {schedule.map((sch) => (
        <Timeslot key={sch.startTimeRaw} {...sch} />
      ))}
    </div>
  );
}

function buildFullSchedule(rawData: any[]) {
  const players = convertPlayers(rawData);

  const schedulesByBlock: SchedulesByBlock[] = [];
  players.forEach(({ schedule, name, id }) => {
    schedule.forEach((pool) => {
      const startTimeRaw = pool.startTimeRaw;

      const block = schedulesByBlock.find(
        (block) => block.startTimeRaw === startTimeRaw
      );
      if (block) {
        block.scheduledPlayers.push({
          game: pool.game ?? "err",
          name: name ?? "err",
          poolId: pool.poolId,
          station: pool.station ?? "err",
          url: pool.bracketUrl ?? "err",
          participantId: id ?? -42069,
        });
      } else {
        schedulesByBlock.push({
          startTimeRaw: startTimeRaw ?? 0,
          startTimeUtc: startTimeRaw
            ? new Date(startTimeRaw * 1000).toISOString()
            : null,
          scheduledPlayers: [
            {
              game: pool.game ?? "err",
              name: name ?? "err",
              poolId: pool.poolId,
              station: pool.station ?? "err",
              url: pool.bracketUrl ?? "err",
              participantId: id ?? -42069,
            },
          ],
        });
      }
    });
  });

  schedulesByBlock.sort((a, b) => a.startTimeRaw - b.startTimeRaw);

  return schedulesByBlock;
}

function convertPlayers(rawData: any[]) {
  if (!rawData || !Array.isArray(rawData)) return [];
  return rawData.map(({ data: dataRaw }) => {
    const { data } = dataRaw ?? {};
    const { participant } = data ?? {};
    return convertPlayer(participant);
  });
}

function convertPlayer(participantData: any) {
  const playerInfo: PlayerResult = {
    id: null,
    name: null,
    events: [],
    schedule: [],
  };

  const { id, gamerTag } = participantData ?? {};

  playerInfo.id = id;
  playerInfo.name = gamerTag;

  const entrants = participantData?.entrants ?? [];

  entrants.forEach((entrant: any) => {
    if (!entrant) return;

    const eventName = entrant.event?.name;
    const standing = entrant.standing?.placement;
    const sets = entrant.paginatedSets?.nodes ?? [];

    const event: EventResult = {
      game: eventName,
      standing: standing,
      entrantId: entrant.entrantId,
      sets: [],
    };

    // build results
    sets.forEach((set: any) => {
      if (!set) return;

      const displayScore = set.displayScore;
      const fullRoundText = set.fullRoundText;
      const win =
        set.winnerId === null ? null : set.winnerId === event.entrantId;
      const bracketUrl = set.phaseGroup?.bracketUrl ?? null;

      const setResult: SetResult = {
        displayScore: displayScore,
        fullRoundText: fullRoundText,
        win: win,
        bracketUrl: bracketUrl,
      };

      event.sets.push(setResult);
    });

    // build schedule. map out each schedule by 'pool'
    const pools = new Map<string, PoolSchedule>();

    sets.forEach((set: any) => {
      if (!set) return;

      if (!pools.has(set.phaseGroup.displayIdentifier)) {
        const startDateTime = new Date(set.startAt * 1000);
        pools.set(set.phaseGroup.displayIdentifier, {
          poolId: set.phaseGroup.displayIdentifier,
          game: eventName,
          startTimeRaw: set.startAt,
          startTimeLocal: startDateTime.toLocaleTimeString(), // maybe move this to client for correct timezoning
          startDayLocal: convertDateToDayOfWeek(startDateTime), // maybe move this to client for correct timezoning
          bracketUrl: set.phaseGroup.bracketUrl,
          station: set.phaseGroup.displayIdentifier.slice(1),
        });
      }
    });

    pools.forEach((pool) => {
      playerInfo.schedule.push(pool);
    });

    playerInfo.events.push(event);
  });

  playerInfo.schedule.sort(
    (a, b) => (a.startTimeRaw ?? 0) - (b.startTimeRaw ?? 0)
  );

  return playerInfo;
}
