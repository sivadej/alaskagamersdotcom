import { Suspense } from "react";
import Evo from './evo';
import jsonData from './test.json';

export default async function Page() {
  return (
    <div>
      <pre>{JSON.stringify(parseData(), null, 2)}</pre>
      hello
      <Suspense fallback={<div>loading</div>}>
        <Evo />
      </Suspense>
    </div>
  );
}



function parseData() {
  const playerInfo: PlayerResult = {
    id: null,
    name: null,
    events: [],
    schedule: [],
  };

  const { data } = jsonData ?? {};
  const { participant } = data ?? {};
  const { id, gamerTag } = participant ?? {};

  playerInfo.id = id;
  playerInfo.name = gamerTag;

  const entrants = participant?.entrants ?? [];

  entrants.forEach((entrant) => {
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

    sets.forEach((set) => {
      if (!set) return;
  
      const displayScore = set.displayScore;
      const fullRoundText = set.fullRoundText;
      const win = set.winnerId === event.entrantId;
  
      const setResult: SetResult = {
        displayScore: displayScore,
        fullRoundText: fullRoundText,
        win,
      };
  
      event.sets.push(setResult);
    });

    playerInfo.events.push(event);
  });

  // to get players schedule, iterate through all sets and flatted by phaseGroup id

  return playerInfo;
}

interface PlayerResult {
  id: number | null;
  name: string | null;
  events: EventResult[];
  schedule: PoolSchedule[];
}

interface PoolSchedule {
  event: string | null;
  startTimeRaw: number | null;
  startTimeUtc: string | null;
  startDayUtc: string | null;
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
}