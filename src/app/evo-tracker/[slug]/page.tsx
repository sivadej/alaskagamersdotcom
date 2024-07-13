import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || "";

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function PlayerPage({
  params,
}: {
  params: { slug: string };
}) {
  const playerData = await fetchRawPlayer(params.slug);
  return <div>{JSON.stringify(playerData, null, 2)}</div>;
}

async function fetchRawPlayer(playerId: string) {
  if (!playerId) return null;

  const { data } = await supabase
    .from("players")
    .select("id,data")
    .eq("id", playerId);
  // console.log(JSON.stringify(data, null, 2));
  const [player] = data ?? [];
  return player ?? null;
}
