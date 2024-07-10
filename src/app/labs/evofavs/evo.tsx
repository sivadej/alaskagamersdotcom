const STARTGG_TOKEN = process.env.STARTGG_TOKEN

export default async function StartGGFavs() {
  const brackets = await fetchBrackets();
  return (
    <small>
      <pre>{JSON.stringify(brackets, null, 2)}</pre>
    </small>
  );
}

async function fetchBrackets() {
  const fetchUrl = 'https://api.start.gg/gql/alpha';
  const response = await fetch(fetchUrl, {
    method: 'POST',
    headers: {
      ['content-type']: 'application/json',
      'authorization': `Bearer ${STARTGG_TOKEN}`,
    },
    body: JSON.stringify({
      query: `query {
        tournament(slug: "evo-2023") {
          id
          name
          participants(query: { filter: { gamerTag: "crucial" } }) {
            nodes {
              prefix
              gamerTag
              entrants {
                paginatedSets {
                  __typename
                  pageInfo {
                    total
                  }
                  nodes {
                    __typename
                    displayScore
                    fullRoundText
                    startAt
                    totalGames
                    station {
                      number
                    }
                    phaseGroup {
                      bracketUrl
                      displayIdentifier
                      wave {
                        startAt
                      }
                    }
                  }
                }
                initialSeedNum
                event {
                  name
                }
              }
            }
          }
        }
      }`
    }),
  });
  const data = await response.json();

  return data;
}
