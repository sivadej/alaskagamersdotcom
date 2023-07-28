const LIST_LIMIT = 5;
const apiKey = process.env.CHALLONGE_API_KEY ?? "";

export default async function handler(req, res) {
  const today = new Date();
  const ninetyDaysAgo = new Date(today.setDate(today.getDate() - 30));
  const createdAfterDate = ninetyDaysAgo.toISOString().slice(0, 10);

  const fetchStr = `https://api.challonge.com/v1/tournaments.json?api_key=${apiKey}&state=all&subdomain=akg&created_after=${createdAfterDate}`;
  const response = await fetch(fetchStr);
  const data = await response.json();

  if (!data || !Array.isArray(data))
    return res.status(400).json({ message: "Not found" });

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
    });
  }
  ret.sort((a, b) => b.id - a.id);

  res.status(200).json(ret);
}
