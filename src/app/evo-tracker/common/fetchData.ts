"use server";

import { createClient } from "@supabase/supabase-js";
import { convertPlayer } from "./functions";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || "";

const supabase = createClient(supabaseUrl, supabaseKey);

export async function getAllPlayers() {
  const { data } = await supabase
    .from("players")
    .select("id,data")
    .neq("id", new Date().getTime() * -1); // cache bustin'
  return data ?? [];
}

export async function getPlayerById(playerId: string) {
  if (!playerId) return null;

  const { data } = await supabase
    .from("players")
    .select("id,data")
    .eq("id", playerId);
  // console.log(JSON.stringify(data, null, 2));
  const [player] = data ?? [];
  return convertPlayer(player?.data?.data?.participant);
}
