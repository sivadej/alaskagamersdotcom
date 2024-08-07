import { ParticipantQueryRaw, STARTGG_Participant } from './startggSchemaTypes';
import {
  EventResult,
  PlayerResult,
  PoolSchedule,
  SchedulesByBlock,
  SetResult,
} from './types';

export function convertDateToDayOfWeek(dateIn: Date) {
  const dayOfWeek = dateIn.getDay();
  switch (dayOfWeek) {
    case 0:
      return 'Sunday';
    case 1:
      return 'Monday';
    case 2:
      return 'Tuesday';
    case 3:
      return 'Wednesday';
    case 4:
      return 'Thursday';
    case 5:
      return 'Friday';
    case 6:
      return 'Saturday';
    default:
      return 'Unknown';
  }
}

export function convertPlayer(participantData: STARTGG_Participant | null) {
  const playerInfo: PlayerResult = {
    id: null,
    name: null,
    fullName: null,
    city: null,
    state: null,
    events: [],
    schedule: [],
  };

  if (!participantData) return playerInfo;

  const { id, gamerTag, user } = participantData ?? {};
  const { name, location } = user ?? {};
  const { city, state } = location ?? {};

  playerInfo.id = id ?? -42069;
  playerInfo.name = gamerTag ?? 'ERR';
  playerInfo.fullName = name ?? '';
  playerInfo.city = city ?? '';
  playerInfo.state = state ?? '';

  const entrants = participantData?.entrants ?? [];

  entrants.forEach((entrant) => {
    if (!entrant) return;

    const eventName = entrant.event?.name;
    const standing = entrant.standing?.placement;
    const sets = entrant.paginatedSets?.nodes ?? [];
    const seeds = entrant.seeds ?? [];

    const event: EventResult = {
      game: eventName ?? 'ERR',
      standing: standing ?? null,
      entrantId: entrant.entrantId ?? -42069,
      sets: [],
    };

    // build results
    sets.forEach((set) => {
      if (!set) return;

      const displayScore = set.displayScore;
      const fullRoundText = `${set.phaseGroup?.phase?.name}: ${set.fullRoundText}`;
      const win =
        set.winnerId === null ? null : set.winnerId === event.entrantId;
      const bracketUrl = set.phaseGroup?.bracketUrl ?? null;

      const setResult: SetResult = {
        displayScore: displayScore ?? null,
        fullRoundText: fullRoundText ?? null,
        win: win,
        bracketUrl: bracketUrl,
      };

      event.sets.push(setResult);
    });

    // build schedule. map out each schedule by 'pool'
    const pools = new Map<string, PoolSchedule>();

    seeds.forEach((seed) => {
      const { phase, phaseGroup, progressionSeedId } = seed ?? {};
      const { name: bracketPhaseName } = phase ?? {};
      const {
        displayIdentifier: poolId,
        bracketUrl,
        startAt,
      } = phaseGroup ?? {};

      if (!!poolId && !pools.has(poolId)) {
        const station = poolId.replace(/[^0-9]/g, '');
        pools.set(poolId, {
          bracketUrl: bracketUrl ?? 'err',
          game: `${eventName} (${bracketPhaseName})`,
          poolId: poolId,
          startTimeRaw: startAt ?? null,
          station: station,
          advanced: !!progressionSeedId,
        });
      }
    });

    pools.forEach((pool) => {
      playerInfo.schedule.push(pool);
    });

    playerInfo.events.push(event);
  });

  playerInfo.schedule.sort(
    (a, b) => (a.startTimeRaw ?? 0) - (b.startTimeRaw ?? 0),
  );

  return playerInfo;
}

export function convertPlayers(rawData: ParticipantQueryRaw[]) {
  if (!rawData || !Array.isArray(rawData)) return [];
  return rawData.map(({ data: dataRaw }) => {
    const { data } = dataRaw ?? {};
    const { participant } = data ?? {};
    return convertPlayer(participant);
  });
}

export function buildFullSchedule(rawData: ParticipantQueryRaw[]) {
  const players = convertPlayers(rawData);

  const schedulesByBlock: SchedulesByBlock[] = [];
  players.forEach(({ schedule, name, id }) => {
    schedule.forEach((pool) => {
      const startTimeRaw = pool.startTimeRaw;

      const block = schedulesByBlock.find(
        (block) => block.startTimeRaw === startTimeRaw,
      );
      if (block) {
        block.scheduledPlayers.push({
          game: pool.game ?? 'err',
          name: name ?? 'err',
          poolId: pool.poolId,
          station: pool.station ?? 'err',
          url: pool.bracketUrl ?? 'err',
          participantId: id ?? -42069,
          advanced: pool.advanced,
        });
      } else {
        schedulesByBlock.push({
          startTimeRaw: startTimeRaw ?? 0,
          startTimeUtc: startTimeRaw
            ? new Date(startTimeRaw * 1000).toISOString()
            : null,
          scheduledPlayers: [
            {
              game: pool.game ?? 'err',
              name: name ?? 'err',
              poolId: pool.poolId,
              station: pool.station ?? 'err',
              url: pool.bracketUrl ?? 'err',
              participantId: id ?? -42069,
              advanced: pool.advanced,
            },
          ],
        });
      }
    });
  });

  schedulesByBlock.sort((a, b) => a.startTimeRaw - b.startTimeRaw);

  return schedulesByBlock;
}

export function sortPlayerNames(sched: SchedulesByBlock[]) {
  const newSchedule = structuredClone(sched);

  newSchedule.forEach((timeslot) => {
    timeslot.scheduledPlayers.sort(({ name: aName }, { name: bName }) => {
      if (aName.toLowerCase() < bName.toLowerCase()) return -1;
      if (aName.toLowerCase() > bName.toLowerCase()) return 1;
      return 0;
    });
  });

  return newSchedule;
}
