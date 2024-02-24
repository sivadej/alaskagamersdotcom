import { NextResponse, NextRequest } from "next/server";

const apiKey = process.env.CHALLONGE_API_KEY ?? "";

export const revalidate = 10;
export async function GET(
  req: NextRequest,
  { params }: { params: { tourney: string } }
) {
  const fetchStr = `https://api.challonge.com/v1/tournaments/akg-${params.tourney}/participants.json?api_key=${apiKey}`;
  const response = await fetch(fetchStr, {
    
  });
  const data = await response.json();
  const ret: string[] = [];

  if (data && Array.isArray(data)) {
    for (const { participant } of data) {
      if (participant.name) {
        ret.push(participant.name);
      }
    }
  }

  return NextResponse.json({ data: ret }, { status: 200 });
}
