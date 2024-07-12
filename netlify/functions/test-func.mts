import type { Config } from "@netlify/functions"
import { createClient } from '@supabase/supabase-js'

export default async (req: Request) => {
    const { next_run } = await req.json();
    console.log("Received event! Next invocation at:", next_run)

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // hourly insert of a record to keep supabase free tier active
    // because i'm cheap lol

    // insert a row into table 'ping'
    const res = await supabase
        .from('ping')
        .insert([{}]);
    console.log(JSON.stringify(res));

    // purge records from this table that are older than a month
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    await supabase
        .from('ping')
        .delete()
        .lt('timestamp', monthAgo.toISOString());
}

export const config: Config = {
    schedule: "@hourly"
}
