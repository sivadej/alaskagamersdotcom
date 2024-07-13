import Link from "next/link";
import { getAllPlayers } from "../common/fetchData";
import PageBody from "../components/pagebody";
import Image from "next/image";

export default async function PlayersPage() {
  const playerData = await getAllPlayers();

  if (!playerData) return <div>Something went wrong.</div>;

  const playerList = playerData.map((participantRes) => {
    const { participant } = participantRes?.data?.data;
    return {
      id: participant.id,
      name: participant.gamerTag,
      games: participant.entrants.map((entrant: any) => entrant?.event?.name),
      url: `https://www.start.gg/tournament/evo-2024/attendee/${participant.id}`,
    };
  });

  // sort playerList by name A-Z
  const sortedPlayerList = structuredClone(playerList).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <PageBody>
      {/* <div>
        <pre>{JSON.stringify(sortedPlayerList, null, 2)}</pre>
      </div> */}
      <div
        className="divide-y divide-gray-600 border border-gray-600"
        style={{
          boxShadow: "0px 0px 4px 2px rgba(120,120,120,0.2)",
        }}
      >
        {sortedPlayerList.map((player) => {
          return (
            <div
              key={player.id}
              className="bg-gray-900 hover:bg-gray-800 flex p-2 items-center"
            >
              <Link
                href={`/evo-tracker/players/${player.id}`}
                style={{ fontSize: "1.2em" }}
                className="flex-none md:w-56 w-32 mr-2"
              >
                {player.name}
              </Link>
              <Link
                href={`/evo-tracker/players/${player.id}`}
                style={{ flex: "1", lineHeight: "1" }}
              >
                <span className="text-xs mr-2 hidden md:block">
                  {player.games.join(", ")}
                </span>
              </Link>
              <Link
                href={`/evo-tracker/players/${player.id}`}
                style={{
                  display: "flex",
                  flex: "0 0 120px",
                  textAlign: "right",
                  justifyContent: "flex-end",
                }}
              >
                <div className="text-blue-400 text-xs flex items-center">
                  Schedule / Results
                </div>
              </Link>
              <Link
                href={player.url}
                style={{
                  display: "flex",
                  flex: "0 0 90px",
                  textAlign: "right",
                  justifyContent: "flex-end",
                }}
              >
                <div className="text-blue-400 text-xs flex items-center">
                  <Image
                    src="/startgg-logo.svg"
                    className="mr-1"
                    width={16}
                    height={16}
                    alt="start.gg"
                  />
                  start.gg
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </PageBody>
  );
}

// Opt out of caching for all data requests in the route segment
export const dynamic = "force-dynamic"; // this can probably be removed once the final data load is done
