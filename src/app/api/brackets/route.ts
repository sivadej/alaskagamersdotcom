import { NextResponse } from "next/server";

const LIST_LIMIT = 10;
const apiKey = process.env.CHALLONGE_API_KEY ?? '';

export async function GET() {
  const today = new Date();
  const ninetyDaysAgo = new Date(today.setDate(today.getDate() - 30));
  const createdAfterDate = ninetyDaysAgo.toISOString().slice(0, 10);

  const fetchStr = `https://api.challonge.com/v1/tournaments.json?api_key=${apiKey}&state=all&subdomain=akg&created_after=${createdAfterDate}`;
  const response = await fetch(fetchStr, {
    cache: 'no-store',
  });
  const data = await response.json();

  if (!data || !Array.isArray(data)) return [];

  const ret = [];
  for (let i = 0; i < data.length; i++) {
    const { tournament } = data[i] ?? {};
    if (!tournament) break;
    const {
      name,
      full_challonge_url,
      sign_up_url,
      url,
      started_at,
      completed_at,
      game_name,
      participants_count,
      id,
    } = tournament;
    ret.push({
      name,
      started_at,
      id,
      full_challonge_url,
      sign_up_url,
      url,
    });
  }
  ret.sort((a, b) => b.id - a.id);

  return NextResponse.json({ data: ret.slice(0, LIST_LIMIT) });
}
