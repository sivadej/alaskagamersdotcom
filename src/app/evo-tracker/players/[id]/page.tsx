import { getPlayerById } from "../../common/fetchData";
import PlayerSchedule from "./playerschedule";
import PageBody from "../../components/pagebody";

export default async function PlayerPage({
  params,
}: {
  params: { id: string };
}) {
  const player = await getPlayerById(params.id);

  if (!player?.id) return <div>Player not found</div>;

  return (
    <PageBody>
      <div
        key={player.id}
        className="p-4 mx-auto mb-5 border-2 border-yellow-700 rounded"
      >
        <h3 className="text-lg text-blue-400">{player.name}</h3>
        <div>
          {player.events.map((event) => {
            return (
              <div key={event.game} className="mt-4">
                <h4 className="font-bold text-gray-300">
                  {event.game}
                  <span className="font-normal text-sm ml-2 text-gray-500">
                    Standing: {event.standing}
                  </span>
                </h4>
                <h3 className="text-gray-200 text-sm">Matches:</h3>
                <div className="ml-2">
                  {event.sets.map((set) => {
                    return (
                      <div key={`${set.fullRoundText}|${set.displayScore}`}>
                        {set.win ? (
                          <span className="text-green-400">[W]</span>
                        ) : (
                          <span className="text-red-400">[L]</span>
                        )}{" "}
                        {set.fullRoundText}: {set.displayScore}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <PlayerSchedule schedule={player.schedule} />
      </div>
    </PageBody>
  );
}

// Opt out of caching for all data requests in the route segment
export const dynamic = "force-dynamic";
