'use server';

import { convertPlayer } from './functions';
import { ParticipantQueryRaw } from './startggSchemaTypes';

import staticPlayerData from './staticPlayerData.json';
import staticPlayerObjects from './staticPlayerObjects.json';

export async function getAllPlayers() {
  return (staticPlayerData as unknown as ParticipantQueryRaw[]) ?? [];
}

export async function getPlayerById(playerId: string) {
  if (!playerId) return null;
  const player = (staticPlayerObjects as Record<string, ParticipantQueryRaw>)[
    playerId
  ] as unknown as ParticipantQueryRaw;
  return convertPlayer(player.data.data.participant);
}

// import { createClient } from '@supabase/supabase-js';
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || '';
// const supabase = createClient(supabaseUrl, supabaseKey);

// export async function getAllPlayers_LIVE() {
//   const { data } = await supabase
//     .from('players')
//     .select('id,data')
//     .neq('id', new Date().getTime() * -1); // cache bustin'
//   console.log(JSON.stringify(data, null, 2));
//   return (data as unknown as ParticipantQueryRaw[]) ?? [];
// }

// export async function getPlayerById_LIVE(playerId: string) {
//   if (!playerId) return null;
//   const { data } = await supabase
//     .from('players')
//     .select('id,data')
//     .eq('id', playerId);
//   // console.log(JSON.stringify(data, null, 2));
//   const [player] = (data as unknown as ParticipantQueryRaw[]) ?? [];
//   return convertPlayer(player?.data?.data?.participant);
// }
