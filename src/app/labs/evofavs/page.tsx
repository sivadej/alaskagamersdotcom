import { Suspense } from "react";
import EvoDB from "./evodb";
import Schedule from "./schedule";


export default async function Page() {
  return (
    <div className="p-2 md:p-8">
      <div style={{ maxWidth: 600 }} className="bg-yellow-600 p-4 mx-auto mb-5 border-2 border-yellow-700 rounded text-xs md:text-sm">Preview Mode: Using EVO 2023 data until 2024 data becomes available.</div>
      <Suspense fallback={<div>Loading Player Schedules</div>}>
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