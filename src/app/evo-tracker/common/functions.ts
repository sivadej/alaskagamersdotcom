import {
  EventResult,
  PlayerResult,
  PoolSchedule,
  SchedulesByBlock,
  SetResult,
} from "./types";

export function convertDateToDayOfWeek(dateIn: Date) {
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

export function convertPlayer(participantData: any) {
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

export function convertPlayers(rawData: any[]) {
  if (!rawData || !Array.isArray(rawData)) return [];
  return rawData.map(({ data: dataRaw }) => {
    const { data } = dataRaw ?? {};
    const { participant } = data ?? {};
    return convertPlayer(participant);
  });
}

export function buildFullSchedule(rawData: any[]) {
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
