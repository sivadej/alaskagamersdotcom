import { getPlayerById } from "../../common/fetchData";
import PlayerSchedule from "./playerschedule";
import PageBody from "../../components/pagebody";
import Image from "next/image";

export default async function PlayerPage({
  params,
}: {
  params: { id: string };
}) {
  const player = await getPlayerById(params.id);

  if (!player?.id) {
    return (
      <div className="flex justify-center items-center h-screen">
        Player not found.
      </div>
    );
  }

  return (
    <PageBody>
      <div className="mb-4 flex items-center">
        <PlayerName name={player.name} id={player.id} />
        <div className="flex-1 text-right">
          <div>{player.fullName}</div>
          <div className="text-sm text-gray-400">{player.city}</div>
        </div>
      </div>

      <h3 className="text-lg text-orange-300">Schedule</h3>
      <PlayerSchedule schedule={player.schedule} />
      <h3 className="text-lg text-orange-300 mt-8">Results</h3>
      <PlayerEventResult player={player} />
    </PageBody>
  );
}

function PlayerName({ name, id }: any) {
  return (
    <h2 className="text-3xl text-blue-400 flex">
      {name}
      {id === 12580893 ? (
        <Image
          src="/blsm.jpg"
          alt="lul"
          width={64}
          height={45}
          className="ml-2"
        />
      ) : null}
    </h2>
  );
}

function PlayerEventResult({ player }: { player: any }) {
  return player.events.map((event: any) => {
    return (
      <div key={event.game} className="border-gray-100 bg-gray-900 mb-2">
        <div className=" p-2 flex mb-1 bg-gray-800 items-center">
          <h4 className="text text-gray-200 flex-grow">{event.game}</h4>
          <h3 className="text-gray-400 text-sm">
            Standing: {event.standing ?? "N/A"}
          </h3>
        </div>
        <div className="ml-2">
          {event.sets.map((set: any) => {
            return (
              <div
                key={`${set.fullRoundText}|${set.displayScore}`}
                className="p-1"
              >
                <div className="flex items-center">
                  <div className="w-4 mr-2">
                    <Image
                      src={set.win ? "/green-dot.svg" : "/red-dot.svg"}
                      width={10}
                      height={10}
                      alt="W/L"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-400 text-xs md:hidden">
                      {set.fullRoundText}
                    </div>
                    <div>{set.displayScore}</div>
                  </div>
                  <div className="w-48 text-sm text-gray-500 text-right md:block hidden">
                    {set.fullRoundText}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  });
}

// Opt out of caching for all data requests in the route segment
export const dynamic = "force-dynamic"; // this can probably be removed once the final data load is done
