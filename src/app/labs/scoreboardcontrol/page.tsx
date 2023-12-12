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

  // async function handleInsert() {
  //   const { data, statusText } = await supabase.from('board').insert([
  //     { name1: 'name1', score1: 1111, name2: 'name2', score2: 2222 },
  //   ]);
  //   console.log('data', data);
  // }

  return (
    <div className={styles.body}>
      <div className='flex h-16 items-center'>
        <div className='flex-1 text-center text-6xl'>
          {name1} - {score1}
        </div>
        <div className='flex-1 text-center text-6xl'>
          {name2} - {score2}
        </div>
      </div>
      {/* <button onClick={handleInsert}>insert</button> */}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
