import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function EvoDB() {
  const playerData = await fetchRawData();

  const players = convertPlayers(playerData);

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      {players.map((player) => {
        return (<div key={player.id} className="p-4 mx-auto mb-5 border-2 border-yellow-700 rounded">
          <h3 className="text-lg text-blue-400">{player.name}</h3>
          <div>
            {player.events.map((event) => {
              return (
                <div key={event.game} className="mt-4">
                  <h4 className="font-bold text-gray-300">
                    {event.game}
                    <span className="font-normal text-sm ml-2 text-gray-500">Standing: {event.standing}</span>
                  </h4>
                  <h3 className="text-gray-200 text-sm">Matches:</h3>
                  <div className="ml-2">
                    {event.sets.map((set) => {
                      return (
                        <div key={`${set.fullRoundText}|${set.displayScore}`}>
                          {set.win ? <span className="text-green-400">[W]</span> : <span className="text-red-400">[L]</span>} {set.fullRoundText}: {set.displayScore}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>)
      })}

      {/* <pre>{JSON.stringify(players, null, 2)}</pre> */}
    </div>
  );
}

async function fetchRawData() {
  const { data } = await supabase.from('players').select('id,data').neq('id', (new Date()).getTime() * -1);
  console.log(JSON.stringify(data, null, 2));
  return data ?? [];
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