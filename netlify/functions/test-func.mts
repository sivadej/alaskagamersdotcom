import type { Config } from "@netlify/functions"
import { createClient } from '@supabase/supabase-js'

export default async (req: Request) => {
    const { next_run } = await req.json();
    console.log("Received event! Next invocation at:", next_run)

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // insert a row into table 'ping'
    // insert default value into column 'timestamp'
    const res = await supabase
        .from('ping')
        .insert([{ created_at: new Date() }]);
    console.log(JSON.stringify(res));
}

export const config: Config = {
    schedule: "@hourly"
}
