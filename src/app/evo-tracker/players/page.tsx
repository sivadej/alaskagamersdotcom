import { getAllPlayers } from "../common/fetchData";
import PageBody from "../components/pagebody";
import PlayerList from "./playerlist";

export default async function PlayersPage() {
  const playerData = await getAllPlayers();

  if (!playerData) return <div>Something went wrong.</div>;

  const playerList = playerData.map((participantRes) => {
    const { participant } = participantRes?.data?.data;
    return {
      id: participant?.id,
      name: participant?.gamerTag,
      games: participant?.entrants
        ?.filter((entrant) => entrant?.event?.name)
        .map((entrant) => entrant.event?.name as string),
      url: `https://www.start.gg/tournament/evo-2024/attendee/${participant?.id}`,
    };
  });

  // sort playerList by name A-Z
  const sortedPlayerList = structuredClone(playerList).sort((a, b) =>
    (a.name ?? "").localeCompare(b.name ?? "")
  );

  return (
    <PageBody>
      <PlayerList playerList={sortedPlayerList} />
    </PageBody>
  );
}

// Opt out of caching for all data requests in the route segment
export const dynamic = "force-dynamic"; // this can probably be removed once the final data load is done
