'use client';
import { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY ?? '';

const supabase = createClient(supabaseUrl, supabaseKey);

export default function Scoreboard() {
  const [data, setData] = useState<any>(null);
  const [name1, setName1] = useState<any>('');
  const [score1, setScore1] = useState<any>(0);
  const [name2, setName2] = useState<any>('');
  const [score2, setScore2] = useState<any>(0);

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
          }
        }
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
    }
  }

  async function incrementScore1() {
    const oldScore = parseInt(score1 ?? 0);
    await supabase
      .from('board')
      .update({ score1: oldScore + 1 })
      .eq('id', 1);
  }

  async function decrementScore1() {
    const oldScore = parseInt(score1 ?? 0);
    await supabase
      .from('board')
      .update({ score1: oldScore - 1 })
      .eq('id', 1);
  }

  async function incrementScore2() {
    const oldScore = parseInt(score2 ?? 0);
    await supabase
      .from('board')
      .update({ score2: oldScore + 1 })
      .eq('id', 1);
  }

  async function decrementScore2() {
    const oldScore = parseInt(score2 ?? 0);
    await supabase
      .from('board')
      .update({ score2: oldScore - 1 })
      .eq('id', 1);
  }

  return (
    <div className={styles.body}>
      <div className='flex h-24 items-center'>
        <div className='flex-1 text-center text-3xl'>
          {name1} - {score1}
          <div>
            <button
              className='bg-blue-500 text-white m-2 p-2'
              onClick={decrementScore1}
            >
              -
            </button>
            <button
              className='bg-blue-500 text-white m-2 p-2'
              onClick={incrementScore1}
            >
              +
            </button>
          </div>
        </div>
        <div className='flex-1 text-center text-3xl'>
          {name2} - {score2}
          <div>
            <button
              className='bg-blue-500 text-white m-2 p-2'
              onClick={decrementScore2}
            >
              -
            </button>
            <button
              className='bg-blue-500 text-white m-2 p-2'
              onClick={incrementScore2}
            >
              +
            </button>
          </div>
        </div>
      </div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
