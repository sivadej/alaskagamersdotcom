import { getAllPlayers } from '../common/fetchData';
import PageBody from '../components/pagebody';

export default async function ResultsPage() {
  const playerData = await getAllPlayers();

  if (!playerData) return <div>Something went wrong.</div>;

  const resultsByGameMap = new Map<string, ResultsByGame>();

  playerData.forEach((player) => {
    if (!player.data.data.participant?.id) return;
    const participant = player.data.data.participant;

    participant.entrants?.forEach((entrant) => {
      const game = entrant.event?.name;
      const entrants =
        entrant.event?.numEntrants?.toLocaleString('en-US', {
          useGrouping: true,
        }) ?? '--';
      const placement = entrant.standing?.placement;
      const pId = participant.id;
      if (!game || !placement || !pId) return;

      const existingGame = resultsByGameMap.get(game);
      if (existingGame) {
        existingGame.players.push({
          name: participant.gamerTag ?? 'oopslul',
          placement,
          id: pId,
        });
      } else {
        resultsByGameMap.set(game, {
          game: `${game} (${entrants} entrants)`,
          players: [
            {
              name: participant.gamerTag ?? 'oopslul',
              placement,
              id: pId,
            },
          ],
        });
      }
    });
  });

  // convert map to array
  const resultsByGame = Array.from(resultsByGameMap.values());

  // sort array by game name
  resultsByGame.sort((a, b) => {
    if (a.game < b.game) return -1;
    if (a.game > b.game) return 1;
    return 0;
  });

  // within each game, sort players by placement, lowest number first
  resultsByGame.forEach((game) => {
    game.players.sort((a, b) => a.placement - b.placement);
  });

  return (
    <PageBody>
      {resultsByGame.map((game) => (
        <div
          key={game.game}
          className="border-gray-100 bg-gray-900 mt-4 mb-4 w-3/4 mx-auto"
        >
          <div className=" p-2 flex bg-gray-800 items-center">
            <h4 className="text text-gray-200 text-lg flex-grow">
              {game.game}
            </h4>
          </div>
          {game.players.map((player) => (
            <a
              key={player.id}
              className="flex items-center border border-gray-700 hover:bg-gray-700 p-2"
              href={`/evo-tracker/players/${player.id}`}
            >
              <div className="flex-1">{player.name}</div>
              <div>
                {player.placement.toLocaleString('en-US', {
                  useGrouping: true,
                })}
              </div>
            </a>
          ))}
        </div>
      ))}
    </PageBody>
  );
}

// Opt out of caching for all data requests in the route segment
export const dynamic = 'force-dynamic'; // this can probably be removed once the final data load is done

interface ResultsByGame {
  game: string;
  players: PlayerResult[];
}

interface PlayerResult {
  id: number;
  name: string;
  placement: number;
}
