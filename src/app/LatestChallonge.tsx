const LIST_LIMIT = 10;
const apiKey = process.env.CHALLONGE_API_KEY ?? '';

export default async function Challonge() {
  const brackets = await fetchBrackets();
  return (
    <div className='group text-center rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-neutral-700 hover:bg-neutral-800/30'>
      <h2 className={`mb-1 text-2xl font-semibold`}>Latest Brackets</h2>
        <p className={`m-0 text-sm opacity-50`}>
          Retrieved just now from Challonge:
        </p>
        <div>
          {brackets.map((bracket: any) => {
            const { name, started_at, id, full_challonge_url, sign_up_url } =
              bracket ?? {};
            const signUpUrl = sign_up_url && !started_at ? sign_up_url : null;
            return (
              <div
                key={id}
                className='mt-3 text-blue-300 underline text-lg hover:text-gray-400'
              >
                <a href={signUpUrl ?? full_challonge_url}>{name}</a>
              </div>
            );
          })}
        </div>
    </div>
  );
}

async function fetchBrackets() {
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
    });
  }
  ret.sort((a, b) => b.id - a.id);

  return ret.slice(0, LIST_LIMIT);
}
