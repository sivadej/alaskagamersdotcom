const LIST_LIMIT = 5;
const apiKey = process.env.CHALLONGE_API_KEY ?? "";

export default async function handler(req, res) {
  const today = new Date();
  const ninetyDaysAgo = new Date(today.setDate(today.getDate() - 90));
  const createdAfterDate = ninetyDaysAgo.toISOString().slice(0, 10);

  const response = await fetch(
    `https://api.challonge.com/v1/tournaments.json?api_key=${apiKey}&state=all&subdomain=akg&created_after=${createdAfterDate}`
  );
  const data = await response.json();

  if (!data || !Array.isArray(data))
    return res.status(400).json({ message: "Not found" });

  const ret = [];
  for (let i = data.length - LIST_LIMIT; i < data.length; i++) {
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

  res.status(200).json(ret);
  //res.status(200).json(data);
}
