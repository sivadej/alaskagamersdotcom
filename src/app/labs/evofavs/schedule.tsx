import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function Schedule() {
  const playerData = await fetchRawData();
  const schedule = buildFullSchedule(playerData);

  if (!schedule) return <>Something went wrong. Let Bomby know!</>;

  return (
    <div style={{ minWidth: '350px', maxWidth: '720px', margin: 'auto' }}>
      {/* View All Players */}
      {/* View Schedule */}
      {/* Scroll to now */}
      <h1>Schedule</h1>
      {schedule.map(sch => <Timeslot key={sch.startTimeRaw} {...sch} />)}
    </div>
  );
}

function Timeslot(timeslot: { startTimeRaw: number; scheduledPlayers: { name: string; game: string; poolId: string; station: string; url: string; }[]; }) {
  const date = new Date(timeslot.startTimeRaw * 1000);
  const dayOfWeek = convertDateToDayOfWeek(date);
  return <div style={{ marginBottom: '2em' }}>
    <h3 className="text-orange-300">{dayOfWeek} {date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}</h3>
    <div>
      {timeslot.scheduledPlayers.map((sch) => {
        return (
          <div key={`${sch.poolId}|${sch.name}`} className="bg-gray-900" style={{ padding: '8px', display: 'flex', border: '1px solid rgba(255,255,255,0.2) ', alignItems: 'center' }}>
            <div style={{ fontSize: '1.2em' }} className="text-blue-400 flex-none md:w-56 w-32 mr-2">{sch.name}</div>
            <div style={{ flex: '1' }}>
              <span className="text-xs md:text-base mr-2">{sch.game}</span>
            </div>
            <div style={{ flex: '0 0 50px' }}><small style={{ color: 'rgba(255,255,255,0.5)' }}>Station</small><br />{sch.station}</div>
            <div style={{ flex: '0 0 60px', textAlign: 'right' }}><a href={sch.url}><small style={{ color: 'rgba(255,255,255,0.5)' }}>Bracket</small><br /><span className="text-blue-400">{sch.poolId}</span></a></div>
          </div>
        );
      })}
    </div>
  </div>
}

async function fetchRawData() {
  const { data } = await supabase.from('players').select('id,data').neq('id', (new Date()).getTime() * -1); // cache bustin'
  return data ?? [];
}

function buildFullSchedule(rawData: any[]) {
  const players = convertPlayers(rawData);

  const schedulesByBlock: SchedulesByBlock[] = [];
  players.forEach(({ schedule, name }) => {
    schedule.forEach((pool) => {
      const startTimeRaw = pool.startTimeRaw;

      const block = schedulesByBlock.find((block) => block.startTimeRaw === startTimeRaw);
      if (block) {
        block.scheduledPlayers.push({
          game: pool.game ?? 'err',
          name: name ?? 'err',
          poolId: pool.poolId,
          station: pool.station ?? 'err',
          url: pool.bracketUrl ?? 'err',
        });
      } else {
        schedulesByBlock.push({
          startTimeRaw: startTimeRaw ?? 0,
          startTimeUtc: startTimeRaw ? new Date(startTimeRaw * 1000).toISOString() : null,
          scheduledPlayers: [{
            game: pool.game ?? 'err',
            name: name ?? 'err',
            poolId: pool.poolId,
            station: pool.station ?? 'err',
            url: pool.bracketUrl ?? 'err',
          }],
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
      const win = set.winnerId === null ? null : set.winnerId === event.entrantId;
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

  playerInfo.schedule.sort((a, b) => (a.startTimeRaw ?? 0) - (b.startTimeRaw ?? 0));

  return playerInfo;
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

interface PlayerResult {
  id: number | null;
  name: string | null;
  events: EventResult[];
  schedule: PoolSchedule[];
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

interface EventResult {
  entrantId: number | null;
  game: string | null;
  standing: number | null;
  sets: SetResult[];
}

interface SetResult {
  displayScore: string | null;
  fullRoundText: string | null;
  win: boolean | null;
  bracketUrl: string | null;
}

interface SchedulesByBlock {
  startTimeRaw: number;
  startTimeUtc: string | null;
  scheduledPlayers: {
    name: string;
    game: string;
    poolId: string;
    station: string;
    url: string;
  }[];
}
