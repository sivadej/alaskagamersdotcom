import { Suspense } from "react";
import EvoDB from "./evodb";
import Schedule from "./schedule";


export default async function Page() {
  return (
    <div>
      <Suspense fallback={<div>loading</div>}>
        <Schedule />
      </Suspense>
      <Suspense fallback={<div>loading</div>}>
        <EvoDB />
      </Suspense>
    </div>
  );
}

// Opt out of caching for all data requests in the route segment
export const dynamic = 'force-dynamic';