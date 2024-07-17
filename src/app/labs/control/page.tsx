'use client';

import { useState, useEffect } from 'react';
import styles from './styles.module.css';
import { createClient } from '@supabase/supabase-js';
import debounce from 'debounce-promise';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY ?? '';

const supabase = createClient(supabaseUrl, supabaseKey);

const updateName1 = debounce(async (name: string) => {
  await supabase.from('board').update({ name1: name }).eq('id', 1);
}, 300);
const updateName2 = debounce(async (name: string) => {
  await supabase.from('board').update({ name2: name }).eq('id', 1);
}, 300);

async function changeScore(player: number, score: number) {
  let scoreKey: string | null = null;
  switch (player) {
    case 1:
      scoreKey = 'score1';
      break;
    case 2:
      scoreKey = 'score2';
      break;
    default:
      break;
  }
  if (scoreKey) {
    await supabase
      .from('board')
      .update({ [scoreKey]: score })
      .eq('id', 1);
  }
}

export default function Scoreboard() {
  const [data, setData] = useState<any>(null);
  const [name1, setName1] = useState<any>('');
  const [score1, setScore1] = useState<any>(0);
  const [name2, setName2] = useState<any>('');
  const [score2, setScore2] = useState<any>(0);

  const [name1Input, setName1Input] = useState<string>('');
  const [name2Input, setName2Input] = useState<string>('');

  const [bracketList, setBracketList] = useState<
    { name: string; id: string }[]
  >([]);
  const [nameList, setNameList] = useState<string[]>([]);

  useEffect(() => {
    getData();
  }, []);

  // Listen to supabase changes
  useEffect(() => {
    const mySubscription = supabase
      .channel('board')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'board' },
        (payload) => {
          console.log('Change received!', payload);
          // getData();
          const row = payload.new;
          console.log('row', row);
          if (row) {
            setName1(row.name1 ?? '');
            setScore1(row.score1 ?? '');
            setName2(row.name2 ?? '');
            setScore2(row.score2 ?? '');
            setName1Input(row.name1 ?? '');
            setName2Input(row.name2 ?? '');
          }
        },
      )
      .subscribe();

    return () => {
      mySubscription.unsubscribe();
    };
  }, []);

  async function getData() {
    const { data, status } = await supabase
      .from('board')
      .select('name1,name2,score1,score2')
      .eq('id', 1)
      .limit(1);
    console.log('data', data);
    setData({ data, status: status });

    const [row] = data ?? [];
    if (row) {
      setName1(row.name1 ?? '');
      setScore1(row.score1 ?? '');
      setName2(row.name2 ?? '');
      setScore2(row.score2 ?? '');
      setName1Input(row.name1 ?? '');
      setName2Input(row.name2 ?? '');
    }
  }

  return (
    <div className={styles.body}>
      <div className="flex h-24 items-center">
        <div className="flex-1 text-center text-3xl">
          {name1} - {score1}
          <div>
            <button
              className="bg-blue-500 text-white m-2 p-2"
              onClick={() => changeScore(1, parseInt(score1, 10) - 1)}
            >
              -
            </button>
            <button
              className="bg-blue-500 text-white m-2 p-2"
              onClick={() => changeScore(1, parseInt(score1, 10) + 1)}
            >
              +
            </button>
          </div>
        </div>
        <div className="flex-1 text-center text-3xl">
          {name2} - {score2}
          <div>
            <button
              className="bg-blue-500 text-white m-2 p-2"
              onClick={() => changeScore(2, parseInt(score2, 10) - 1)}
            >
              -
            </button>
            <button
              className="bg-blue-500 text-white m-2 p-2"
              onClick={() => changeScore(2, parseInt(score2, 10) + 1)}
            >
              +
            </button>
          </div>
        </div>
      </div>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <hr />
      <button
        onClick={() => {
          changeScore(1, 0);
          changeScore(2, 0);
        }}
      >
        reset scores
      </button>
      <hr />
      <input
        type="text"
        className="bg-gray-200 mr-4"
        value={name1Input}
        onChange={async (e) => {
          setName1Input(e.target.value);
          updateName1(e.target.value);
        }}
      />
      <input
        type="text"
        className="bg-gray-200"
        value={name2Input}
        onChange={async (e) => {
          setName2Input(e.target.value);
          updateName2(e.target.value);
        }}
      />
      <hr />
      <select
        onChange={async (e) => {
          setName1Input(e.target.value);
          updateName1(e.target.value);
        }}
      >
        {nameList.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
      <hr />
      <div>
        <button
          className="bg-green-500 p-2"
          onClick={async () => {
            const res = await fetch('/api/brackets', {
              method: 'GET',
            });
            const json = await res.json();
            console.log(json);
            const { data } = json ?? {};
            if (Array.isArray(data)) {
              setBracketList(
                data.map((row) => ({
                  name: row.name,
                  id: row.url,
                })),
              );
            }
          }}
        >
          load brackets
        </button>
        {bracketList.map((row) => (
          <div key={row.id}>
            {row.name}{' '}
            <button
              className="bg-green-700 text-white p-2"
              onClick={async () => {
                const res = await fetch(`/api/names/${row.id}`, {
                  method: 'GET',
                });
                const json = await res.json();
                console.log(json);
                const { data } = json ?? {};
                if (Array.isArray(data)) {
                  setNameList(data.map((name) => name || '<Missing Name>'));
                }
              }}
            >
              load names
            </button>
          </div>
        ))}
        <pre>{JSON.stringify(nameList, null, 2)}</pre>
      </div>
    </div>
  );
}
